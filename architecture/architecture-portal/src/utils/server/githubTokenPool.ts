/* istanbul ignore file */
import { SOURCE_HOST_CONFIG, SourceHost } from '@/constants'
import { Logger } from './logger'

type TokenConfig = { name: string; token: string }
type TokenState = {
    limit?: number | null
    remaining?: number | null
    resetSec?: number | null
    updatedAtMs: number
    remainingPct?: number | null
    status?: 'ok' | 'warn' | 'degrade' | 'stop' | 'unknown'
}

// --- Swap policy config ---
const WARN_PCT: number = 25 // warning threshold (percentage)
const DEGRADE_PCT: number = 10 // degradation threshold (percentage)
const MIN_SWAP_INTERVAL_MS: number = 5000 // 5 seconds
const SWAP_MARGIN_REQUESTS: number = 100

const INF = Number.POSITIVE_INFINITY

type HostState = {
    cachedTokens: TokenConfig[] | null
    lastUsedInMem: string | null
    lastSwapAt: number
    stateMap: Map<string, TokenState>
    lastAlertStatus: Map<string, string>
}

const hostStates = new Map<string, HostState>()

function getHostState(host: string): HostState {
    let s = hostStates.get(host)
    if (!s) {
        s = {
            cachedTokens: null,
            lastUsedInMem: null,
            lastSwapAt: 0,
            stateMap: new Map(),
            lastAlertStatus: new Map()
        }
        hostStates.set(host, s)
    }
    return s
}

/**
 * Get GitHub API tokens from the environment variable for the given host.
 * GHE tokens are read from GITHUB_TOKENS_JSON; Cloud tokens from GITHUB_CLOUD_TOKENS_JSON.
 */
function getTokens(host: SourceHost): TokenConfig[] {
    const hs = getHostState(host)
    if (hs.cachedTokens) return hs.cachedTokens
    const envKey = SOURCE_HOST_CONFIG[host].tokenKey
    if (!process.env[envKey]) return []
    try {
        const tokens = JSON.parse(process.env[envKey]!) as TokenConfig[]
        hs.cachedTokens = tokens
        return tokens
    } catch (error) {
        Logger.error(error)
        return []
    }
}

/**
 * Evaluate status from remainingPct and remaining number.
 */
function evaluateStatus(
    remainingPct: number | null | undefined,
    remaining: number | null | undefined
) {
    if (Number.isFinite(remaining) && remaining! <= 0) return 'stop'
    if (Number.isFinite(remainingPct)) {
        if ((remainingPct as number) <= DEGRADE_PCT) return 'degrade'
        if ((remainingPct as number) <= WARN_PCT) return 'warn'
    }
    return 'ok'
}

/**
 * Logs token state information (human-readable).
 */
function logTokenState(tokenName: string, s: TokenState) {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const limit = Number.isFinite(s.limit as any) ? s.limit : 'unknown'
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const remaining = Number.isFinite(s.remaining as any)
        ? s.remaining
        : 'unknown'
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pct = Number.isFinite(s.remainingPct as any)
        ? `${(s.remainingPct as number).toFixed(2)}%`
        : 'unknown'
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resetHuman = Number.isFinite(s.resetSec as any)
        ? new Date((s.resetSec as number) * 1000).toISOString()
        : 'unknown'
    Logger.info(
        `[GITHUB-REST-API] ${tokenName} remaining=${remaining}/${limit} (${pct}) reset=${resetHuman} status=${s.status}`
    )
}

/**
 * Logs a token swap event (always logs when an actual swap occurs).
 * reason should be a short string such as 'stop' | 'degrade' | 'margin'
 */
function logTokenSwap(
    prevName: string,
    newName: string,
    prevState?: TokenState,
    reason?: string
) {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prevPct = Number.isFinite(prevState?.remainingPct as any)
        ? `${(prevState!.remainingPct as number).toFixed(2)}%`
        : 'unknown'

    const reasonTag = reason ? ` reason=${reason}` : ''
    Logger.info(
        `[GITHUB-REST-API] swapped token ${prevName} -> ${newName} (prev ${prevPct})${reasonTag}`
    )
}

/**
 * Selects the GitHub API token to use for the next request.
 *
 * Behavior / guarantees:
 * - Uses an in-memory, per-process view of token rate-limit state.
 * - Prefers the previously used token (stickiness) to avoid thrashing.
 * - If the current token is `ok` then it will continue to be used.
 * - If the current token is in `warn` or `degrade` status:
 *     - swaps only if another token is meaningfully better
 *       (remaining > current + SWAP_MARGIN_REQUESTS)
 *       AND the minimum swap cooldown has elapsed.
 * - If the current token is `stop` then it will always be swapped away from.
 * - Tokens with unknown remaining budget are treated as having infinite
 *   remaining, but stickiness is preserved when both tokens are unknown.
 *
 * Observability:
 * - EVERY actual token swap is logged (no log suppression).
 * - No logs are emitted if the selected token does not change.
 *
 * Safety / stability:
 * - Swap cooldown (MIN_SWAP_INTERVAL_MS) prevents rapid flip-flopping.
 * - Absolute margin (SWAP_MARGIN_REQUESTS) prevents swapping for
 *   negligible differences in remaining budget.
 * - Designed for high-throughput endpoints; selection is O(n) over token count.
 *
 * Returns:
 * - `{ name, token }` for the selected GitHub API token.
 *
 * Notes:
 * - All state is per-process; different pods may make different choices.
 * - Token selection does not block on I/O and is safe to call on hot paths.
 */
export function selectToken(host: SourceHost): { name: string; token: string } {
    const now = Date.now()
    const hs = getHostState(host)
    const tokens = getTokens(host)
    if (tokens.length === 0) {
        throw new Error(
            'No GitHub tokens available: Tokens JSON missing/invalid.'
        )
    }

    // Build candidates with numeric remaining (INF if unknown)
    const candidates = tokens.map(cfg => {
        const st = hs.stateMap.get(cfg.name)
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const remainingNum = Number.isFinite(st?.remaining as any)
            ? (st!.remaining as number)
            : INF
        const status = st?.status ?? 'unknown'
        return { cfg, remainingNum, status }
    })

    // Sort descending by remaining (largest first)
    candidates.sort((a, b) => {
        const va =
            a.remainingNum === INF ? Number.MAX_SAFE_INTEGER : a.remainingNum
        const vb =
            b.remainingNum === INF ? Number.MAX_SAFE_INTEGER : b.remainingNum
        return vb - va
    })

    const best = candidates[0]
    if (!best) {
        const cfg = tokens[0]
        hs.lastUsedInMem = cfg.name
        hs.lastSwapAt = now
        return { name: cfg.name, token: cfg.token }
    }

    // First-ever selection: choose best
    if (!hs.lastUsedInMem) {
        hs.lastUsedInMem = best.cfg.name
        hs.lastSwapAt = now
        return { name: best.cfg.name, token: best.cfg.token }
    }

    const prevName = hs.lastUsedInMem
    const prevState = hs.stateMap.get(prevName)
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prevRemaining = Number.isFinite(prevState?.remaining as any)
        ? (prevState!.remaining as number)
        : INF
    const prevStatus = prevState?.status ?? 'unknown'
    const bestRemaining = best.remainingNum

    // Forced swap if current token exhausted
    if (prevStatus === 'stop') {
        if (best.cfg.name !== prevName) {
            logTokenSwap(prevName, best.cfg.name, prevState, 'stop')
        }
        hs.lastUsedInMem = best.cfg.name
        hs.lastSwapAt = now
        return { name: best.cfg.name, token: best.cfg.token }
    }

    const cooldownPassed = now - hs.lastSwapAt >= MIN_SWAP_INTERVAL_MS

    // If both remaining are unknown/infinite, prefer sticking to previous to avoid thrash
    if (prevRemaining === INF && bestRemaining === INF) {
        const prevCfg = tokens.find(t => t.name === prevName)!
        return { name: prevCfg.name, token: prevCfg.token }
    }

    // For OK tokens, keep using the current token
    if (prevStatus === 'ok') {
        return {
            name: prevName,
            token: tokens.find(t => t.name === prevName)!.token
        }
    }

    // For WARN or DEGRADE, consider swapping (same handling)
    if (prevStatus === 'warn' || prevStatus === 'degrade') {
        const bestIsMeaningfullyBetter =
            bestRemaining !== INF && prevRemaining !== INF
                ? bestRemaining > prevRemaining + SWAP_MARGIN_REQUESTS
                : bestRemaining !== INF && prevRemaining === INF

        if (bestIsMeaningfullyBetter && cooldownPassed) {
            if (best.cfg.name !== prevName) {
                logTokenSwap(
                    prevName,
                    best.cfg.name,
                    prevState,
                    'degrade/warn/margin'
                )
            }
            hs.lastUsedInMem = best.cfg.name
            hs.lastSwapAt = now
            return { name: best.cfg.name, token: best.cfg.token }
        }

        // stick to previous if not meaningfully better yet
        return {
            name: prevName,
            token: tokens.find(t => t.name === prevName)!.token
        }
    }

    // Fallback: if prevStatus is unknown or any other value, behave conservatively:
    // only swap if best is meaningfully better and cooldown passed
    if (
        bestRemaining !== INF &&
        prevRemaining !== INF &&
        bestRemaining > prevRemaining + SWAP_MARGIN_REQUESTS &&
        cooldownPassed
    ) {
        if (best.cfg.name !== prevName) {
            logTokenSwap(prevName, best.cfg.name, prevState, 'margin')
        }
        hs.lastUsedInMem = best.cfg.name
        hs.lastSwapAt = now
        return { name: best.cfg.name, token: best.cfg.token }
    }

    // Tie-case: if equal remaining, prefer previous (avoid unnecessary swap)
    if (
        Number.isFinite(bestRemaining) &&
        Number.isFinite(prevRemaining) &&
        bestRemaining === prevRemaining
    ) {
        const prevCfg = tokens.find(t => t.name === prevName)!
        return { name: prevCfg.name, token: prevCfg.token }
    }

    // Stick to previous by default
    return {
        name: prevName,
        token: tokens.find(t => t.name === prevName)!.token
    }
}

/**
 * Update in-memory state from GitHub headers (non-blocking)
 * - Logs human friendly remaining %
 * - Logs status transitions (warn/degrade/stop) with deduplication per-process
 */
export function updateToken(
    host: string,
    tokenName: string,
    headers: Headers
): void {
    const hs = getHostState(host)
    try {
        const limitH = headers.get('x-ratelimit-limit')
        const remainingH = headers.get('x-ratelimit-remaining')
        const resetH = headers.get('x-ratelimit-reset')

        const limitParsed = limitH ? Number.parseInt(limitH, 10) : undefined
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const limit = Number.isFinite(limitParsed as any)
            ? (limitParsed as number)
            : undefined

        const remainingParsed = remainingH
            ? Number.parseInt(remainingH, 10)
            : undefined
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const remaining = Number.isFinite(remainingParsed as any)
            ? (remainingParsed as number)
            : undefined

        const resetParsed = resetH ? Number.parseInt(resetH, 10) : undefined
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resetSec = Number.isFinite(resetParsed as any)
            ? (resetParsed as number)
            : undefined

        const now = Date.now()

        const prev = hs.stateMap.get(tokenName)

        const remainingPct =
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            Number.isFinite(limit as any) && Number.isFinite(remaining as any)
                ? Number(
                      (
                          ((remaining as number) / (limit as number)) *
                          100
                      ).toFixed(2)
                  )
                : (prev?.remainingPct ?? null)

        const status = evaluateStatus(remainingPct, remaining)

        // Clear alert dedupe when token recovers to OK,
        // so future warn/degrade/stop transitions will log again.
        if (status === 'ok') hs.lastAlertStatus.delete(tokenName)

        // Decide if update is meaningful. Only update + alert if something changed.
        const changed =
            !prev ||
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Number.isFinite(prev.limit as any)
                ? prev.limit !== limit
                : //eslint-disable-next-line @typescript-eslint/no-explicit-any
                  Number.isFinite(limit as any)) ||
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Number.isFinite(prev.remaining as any)
                ? prev.remaining !== remaining
                : //eslint-disable-next-line @typescript-eslint/no-explicit-any
                  Number.isFinite(remaining as any)) ||
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Number.isFinite(prev.resetSec as any)
                ? prev.resetSec !== resetSec
                : //eslint-disable-next-line @typescript-eslint/no-explicit-any
                  Number.isFinite(resetSec as any)) ||
            prev.status !== status

        // Always update updatedAtMs so logs reflect freshness
        const newState: TokenState = {
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            limit: Number.isFinite(limit as any)
                ? (limit as number)
                : prev?.limit,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            remaining: Number.isFinite(remaining as any)
                ? (remaining as number)
                : prev?.remaining,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            resetSec: Number.isFinite(resetSec as any)
                ? (resetSec as number)
                : prev?.resetSec,
            updatedAtMs: now,
            remainingPct,
            status
        }
        hs.stateMap.set(tokenName, newState)

        // Log human readable info every update
        logTokenState(tokenName, newState)

        if (!changed) return

        // On status transition, dedupe per-process and log once
        const prevStatus = prev?.status ?? 'unknown'
        const lastSent = hs.lastAlertStatus.get(tokenName) ?? 'unknown'
        if (prevStatus !== status && lastSent !== status) {
            const msg = `Token=${tokenName} status changed: ${prevStatus} → ${status}. remaining=${newState.remaining ?? 'unknown'} / ${newState.limit ?? 'unknown'} (${newState.remainingPct ?? 'unknown'}%) reset=${newState.resetSec ? new Date(newState.resetSec * 1000).toISOString() : 'unknown'}`

            // record that we've sent this status for dedupe
            hs.lastAlertStatus.set(tokenName, status)

            if (status === 'warn' || status === 'degrade') {
                Logger.warn(`[GITHUB_RATE_LIMIT_WARN] ${msg}`)
            } else if (status === 'stop') {
                Logger.error(`[GITHUB_RATE_LIMIT_ERR] ${msg}`)
            } else {
                Logger.info(`[GITHUB_RATE_LIMIT] ${msg}`)
            }
        }
    } catch (error) {
        Logger.error(error)
    }
}

/**
 * For observability: get a snapshot of token names and their state.
 * NOTE: this intentionally does NOT return token secrets.
 */
export function getTokenSnapshot(host: SourceHost = 'ghe') {
    const hs = getHostState(host)
    const tokens = getTokens(host)
    return tokens.map(t => ({
        name: t.name,
        ...(hs.stateMap.get(t.name) ?? {})
    }))
}
