export const ATTESTATION_REQUEST_WINDOW_MS = 60 * 60 * 1000

export function attestationRequestKey(
    entityType: string,
    entityId: string,
    userEmail?: string
): string {
    return `attestation_request_${entityType}_${entityId}_${
        userEmail?.toLowerCase() ?? 'anonymous'
    }`
}

export function getAttestationRequestRemainingMs(
    entityType: string,
    entityId: string,
    userEmail?: string,
    now: number = Date.now(),
    windowMs: number = ATTESTATION_REQUEST_WINDOW_MS
): number {
    if (typeof window === 'undefined') return 0
    const raw = window.localStorage.getItem(
        attestationRequestKey(entityType, entityId, userEmail)
    )
    if (!raw) return 0
    const last = Number(raw)
    if (!Number.isFinite(last)) return 0
    const remaining = windowMs - (now - last)
    return remaining > 0 ? remaining : 0
}

export function recordAttestationRequest(
    entityType: string,
    entityId: string,
    userEmail?: string,
    now: number = Date.now()
): void {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(
        attestationRequestKey(entityType, entityId, userEmail),
        String(now)
    )
}

export function formatRemaining(ms: number): string {
    const totalMinutes = Math.ceil(ms / 60000)
    if (totalMinutes <= 1) return '1 minute'
    return `${totalMinutes} minutes`
}
