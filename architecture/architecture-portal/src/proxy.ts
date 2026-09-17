/* istanbul ignore file */
/**
 * Next.js Middleware: Distributed sliding window rate limiter for page routes using Redis.
 *
 * - Enforces per-user (guid) rate limits using rate-limiter-flexible with Redis backend.
 * - Applies both per-minute and per-hour limits.
 * - Only users with a valid identity header (RL_ID_HEADER, default 'guid') are rate limited.
 * - Requests with allowlisted identities (from RL_ALLOWLIST) are bypassed.
 * - Returns standard rate limit headers and a 429 JSON error when limits are exceeded.
 * - Excludes static assets and Next.js internals via matcher config.
 * - All limits and window sizes are configurable via environment variables.
 *
 * Envoy was not chosen at the time of implementation due to its limited configuration options. This middleware is suitable for our internal docs use case.
 * For distributed rate limiting at the edge, use Envoy at the service mesh layer via Helm values files:
 *   https://github.aexp.com/pages/amex-eng/amexway/docs/paved-roads/build-deploy/private-cloud/helm-values#rate-limiting
 */

import { NextRequest, NextResponse } from 'next/server'
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible'
import { Logger } from '@/utils/server'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createRedisClient } = require('../redis-client.js')
const PER_MINUTE_LIMIT = Number(process.env.RL_PER_MINUTE_LIMIT) || 60
const PER_HOUR_LIMIT = Number(process.env.RL_PER_HOUR_LIMIT) || 600
const RL_ID_HEADER = process.env.RL_ID_HEADER || 'guid'
const RL_ALLOWLIST_RAW = process.env.RL_ALLOWLIST || '' // e.g. "internal-guid-1,10.0.0.5,192.0.2.0"
const ALLOWLIST = new Set(
    RL_ALLOWLIST_RAW.split(',')
        .map((s: string) => s.trim().toLowerCase())
        .filter(Boolean)
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedClient: any = null
let minuteLimiter: RateLimiterRedis | null = null
let hourLimiter: RateLimiterRedis | null = null

/**
 * isRedisReady
 * Checks if a Redis client is ready/connected, supporting both ioredis and node-redis client shapes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRedisReady(client?: any): boolean {
    if (!client) return false
    if (typeof client.status === 'string') {
        return client.status === 'ready' || client.status === 'connected'
    }

    if (typeof client.isReady === 'boolean') return client.isReady
    if (typeof client.connected === 'boolean') return client.connected
    return false
}

/**
 * getOrCreateLimiters
 * Lazily creates and caches a single Redis client and limiter instances for reuse across requests.
 * Only creates a new client if the cached one does not exist.
 * Always uses the client name 'rate-limiter' for logging and tracking.
 */
async function getOrCreateLimiters(): Promise<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: any | null
    minute: RateLimiterRedis | null
    hour: RateLimiterRedis | null
}> {
    // Only create once, then always reuse
    if (cachedClient && minuteLimiter && hourLimiter) {
        return {
            client: cachedClient,
            minute: minuteLimiter,
            hour: hourLimiter
        }
    }

    // Otherwise, create a new client
    const client = await createRedisClient('rate-limiter')
    if (!client) {
        cachedClient = null
        minuteLimiter = null
        hourLimiter = null
        return { client: null, minute: null, hour: null }
    }

    try {
        minuteLimiter = new RateLimiterRedis({
            storeClient: client,
            keyPrefix: 'rate-limiter',
            points: PER_MINUTE_LIMIT,
            duration: 60,
            blockDuration: 60,
            useRedisPackage: true
        })

        hourLimiter = new RateLimiterRedis({
            storeClient: client,
            keyPrefix: 'rate-limiter-hour',
            points: PER_HOUR_LIMIT,
            duration: 3600,
            blockDuration: 3600,
            useRedisPackage: true
        })

        cachedClient = client
        Logger.info('[RATE_LIMIT] Initialized limiters with Redis client')
        return { client, minute: minuteLimiter, hour: hourLimiter }
    } catch (error) {
        Logger.error('[RATE_LIMIT_ERR] Failed to init rate limiters', { error })
        minuteLimiter = null
        hourLimiter = null
        cachedClient = null
        return { client: null, minute: null, hour: null }
    }
}

/**
 * getRateLimitKey
 * Returns a rate limit key for the request based on the configured identity header (RL_ID_HEADER).
 * - If the header is present and not allowlisted, returns `guid:<val>`.
 * - If the header is allowlisted, returns null (bypass).
 * - If the header is missing or empty, returns null (no rate limiting).
 */
function getRateLimitKey(req: NextRequest): string | null {
    const idHeaderValue = req.headers.get(RL_ID_HEADER)
    if (idHeaderValue && idHeaderValue.trim()) {
        const val = idHeaderValue.trim()
        if (ALLOWLIST.has(val.toLowerCase())) {
            Logger.info('[RATE_LIMIT] Bypass - allowlisted identity', {
                identity: val
            })
            return null
        }
        return `guid:${val}`
    }
    return null
}

/**
 * attachRateLimitHeaders
 * Sets X-RateLimit headers on the response using RateLimiterRes-like objects for minute and hour windows.
 */
function attachRateLimitHeaders(
    headers: Headers,
    nowSec: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    minuteRes?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hourRes?: any
) {
    if (minuteRes) {
        headers.set('X-RateLimit-Limit', String(PER_MINUTE_LIMIT))
        headers.set(
            'X-RateLimit-Remaining',
            String(
                typeof minuteRes.remainingPoints === 'number'
                    ? minuteRes.remainingPoints
                    : 0
            )
        )
        headers.set(
            'X-RateLimit-Reset',
            String(
                Math.floor(
                    nowSec + Math.ceil((minuteRes.msBeforeNext || 0) / 1000)
                )
            )
        )
    } else {
        headers.set('X-RateLimit-Limit', String(PER_MINUTE_LIMIT))
        headers.set('X-RateLimit-Remaining', '')
        headers.set('X-RateLimit-Reset', String(Math.floor(nowSec + 60)))
    }

    if (hourRes) {
        headers.set('X-RateLimit-Limit-Hour', String(PER_HOUR_LIMIT))
        headers.set(
            'X-RateLimit-Remaining-Hour',
            String(
                typeof hourRes.remainingPoints === 'number'
                    ? hourRes.remainingPoints
                    : 0
            )
        )
        headers.set(
            'X-RateLimit-Reset-Hour',
            String(
                Math.floor(
                    nowSec + Math.ceil((hourRes.msBeforeNext || 0) / 1000)
                )
            )
        )
    } else {
        headers.set('X-RateLimit-Limit-Hour', String(PER_HOUR_LIMIT))
        headers.set('X-RateLimit-Remaining-Hour', '')
        headers.set('X-RateLimit-Reset-Hour', String(Math.floor(nowSec + 3600)))
    }
}

/**
 * isRateLimitError
 * Returns true if the object is a rate-limiter-flexible error indicating "limit exceeded" (msBeforeNext or remainingPoints present).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRateLimitError(obj: any): boolean {
    return (
        obj &&
        typeof obj === 'object' &&
        ('msBeforeNext' in obj || 'remainingPoints' in obj)
    )
}

export default async function proxy(req: NextRequest) {
    const nowMs = Date.now()
    const nowSec = Math.floor(nowMs / 1000)
    const response = NextResponse.next({
        request: {
            headers: new Headers(req.headers)
        }
    })

    const key = getRateLimitKey(req)
    if (key === null) return response

    const { client, minute, hour } = await getOrCreateLimiters()
    if (!isRedisReady(client) || !minute || !hour) {
        Logger.warn(
            '[RATE_LIMIT_WARN] Redis not ready or limiters unavailable, bypassing rate limiting',
            {
                key,
                redisClientStatus: client
                    ? (client.status ??
                      (client.isReady
                          ? 'isReady'
                          : client.connected
                            ? 'connected'
                            : 'unknown'))
                    : 'no-client'
            }
        )
        return response
    }

    const [minResSettled, hourResSettled] = await Promise.allSettled([
        minute.consume(key),
        hour.consume(key)
    ])

    const headers = new Headers()
    if (
        minResSettled.status === 'fulfilled' &&
        hourResSettled.status === 'fulfilled'
    ) {
        const minuteRes = minResSettled.value as RateLimiterRes
        const hourRes = hourResSettled.value as RateLimiterRes
        attachRateLimitHeaders(headers, nowSec, minuteRes, hourRes)
        for (const [k, v] of headers.entries()) response.headers.set(k, v)
        return response
    }

    if (
        minResSettled.status === 'fulfilled' &&
        hourResSettled.status === 'rejected'
    ) {
        const minuteRes = minResSettled.value as RateLimiterRes
        const hourError = hourResSettled.reason
        if (isRateLimitError(hourError)) {
            Logger.warn(
                '[RATE_LIMIT_BLOCK] hour limit exceeded (parallel path, compensating minute)',
                {
                    key,
                    path: req.nextUrl.pathname,
                    method: req.method,
                    ip:
                        req.headers.get('x-forwarded-for') ||
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (req as any).ip ||
                        'unknown',
                    error: hourError
                }
            )

            try {
                await minute.reward(key, 1)
            } catch (rewardErr) {
                Logger.error(
                    '[RATE_LIMIT_ERR] Failed to compensate minute after hour exceeded',
                    { key, error: rewardErr }
                )
            }

            attachRateLimitHeaders(headers, nowSec, minuteRes, hourError)
            const retryAfterSec = Math.max(
                1,
                Math.ceil((hourError.msBeforeNext || 0) / 1000)
            )
            headers.set('Retry-After', String(retryAfterSec))
            headers.set('Content-Type', 'application/json; charset=utf-8')
            return new NextResponse(
                JSON.stringify({
                    message: 'Too Many Requests',
                    reason: 'per_hour'
                }),
                { status: 429, headers }
            )
        }

        Logger.error(
            '[RATE_LIMIT_ERR] Non-rate error on hour consume; compensating minute and allowing request',
            {
                key,
                error: hourError
            }
        )

        try {
            await minute.reward(key, 1)
        } catch (rewardErr) {
            Logger.error(
                '[RATE_LIMIT_ERR] Failed to compensate minute after non-rate error',
                { key, error: rewardErr }
            )
        }

        attachRateLimitHeaders(headers, nowSec, minuteRes, undefined)
        for (const [k, v] of headers.entries()) response.headers.set(k, v)
        return response
    }

    if (
        minResSettled.status === 'rejected' &&
        hourResSettled.status === 'fulfilled'
    ) {
        const hourRes = hourResSettled.value as RateLimiterRes
        const minError = minResSettled.reason
        if (isRateLimitError(minError)) {
            Logger.warn(
                '[RATE_LIMIT_BLOCK] minute limit exceeded (parallel path, compensating hour)',
                {
                    key,
                    path: req.nextUrl.pathname,
                    method: req.method,
                    ip:
                        req.headers.get('x-forwarded-for') ||
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (req as any).ip ||
                        'unknown',
                    error: minError
                }
            )

            try {
                await hour.reward(key, 1)
            } catch (rewardErr) {
                Logger.error(
                    '[RATE_LIMIT_ERR] Failed to compensate hour after minute exceeded',
                    { key, error: rewardErr }
                )
            }

            attachRateLimitHeaders(headers, nowSec, minError, hourRes)
            const retryAfterSec = Math.max(
                1,
                Math.ceil((minError.msBeforeNext || 0) / 1000)
            )
            headers.set('Retry-After', String(retryAfterSec))
            headers.set('Content-Type', 'application/json; charset=utf-8')
            return new NextResponse(
                JSON.stringify({
                    message: 'Too Many Requests',
                    reason: 'per_minute'
                }),
                { status: 429, headers }
            )
        }

        Logger.error(
            '[RATE_LIMIT_ERR] Non-rate error on minute consume; compensating hour and allowing request',
            { key, error: minError }
        )

        try {
            await hour.reward(key, 1)
        } catch (rewardErr) {
            Logger.error(
                '[RATE_LIMIT_ERR] Failed to compensate hour after non-rate error',
                { key, error: rewardErr }
            )
        }

        attachRateLimitHeaders(headers, nowSec, undefined, hourRes)
        for (const [k, v] of headers.entries()) response.headers.set(k, v)
        return response
    }

    if (
        minResSettled.status === 'rejected' &&
        hourResSettled.status === 'rejected'
    ) {
        const minErr = minResSettled.reason
        const hourErr = hourResSettled.reason
        if (isRateLimitError(minErr) && isRateLimitError(hourErr)) {
            Logger.warn('[RATE_LIMIT_BLOCK] both minute+hour exceeded', {
                key,
                path: req.nextUrl.pathname,
                method: req.method,
                ip:
                    req.headers.get('x-forwarded-for') ||
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (req as any).ip ||
                    'unknown',
                minuteErr: minErr,
                hourErr: hourErr
            })
            attachRateLimitHeaders(headers, nowSec, minErr, hourErr)
            const retryAfterSec = Math.max(
                1,
                Math.ceil(
                    Math.max(
                        minErr.msBeforeNext || 0,
                        hourErr.msBeforeNext || 0
                    ) / 1000
                )
            )
            headers.set('Retry-After', String(retryAfterSec))
            headers.set('Content-Type', 'application/json; charset=utf-8')
            return new NextResponse(
                JSON.stringify({
                    message: 'Too Many Requests',
                    reason: 'both'
                }),
                { status: 429, headers }
            )
        }

        Logger.error(
            '[RATE_LIMIT_ERR] Redis/consume errors (non-rate) — allowing request',
            { key, minErr, hourErr }
        )
        return response
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - common static asset extensions
         */
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt|pdf|woff|woff2|ttf|eot|otf|mp4|webm|ogg|mp3|wav|zip|tar|gz)$).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' }
            ]
        }
    ]
}
