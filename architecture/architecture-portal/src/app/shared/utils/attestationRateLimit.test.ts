import {
    ATTESTATION_REQUEST_WINDOW_MS,
    attestationRequestKey,
    getAttestationRequestRemainingMs,
    recordAttestationRequest,
    formatRemaining
} from './attestationRateLimit'

describe('attestationRateLimit', () => {
    beforeEach(() => {
        window.localStorage.clear()
    })

    it('builds a stable, case-insensitive key', () => {
        expect(attestationRequestKey('initiative', 'i1', 'User@Test.com')).toBe(
            'attestation_request_initiative_i1_user@test.com'
        )
    })

    it('returns 0 remaining when no request was recorded', () => {
        expect(
            getAttestationRequestRemainingMs('initiative', 'i1', 'u@test.com')
        ).toBe(0)
    })

    it('returns remaining time within the window after recording a request', () => {
        const now = 1_000_000
        recordAttestationRequest('initiative', 'i1', 'u@test.com', now)
        const remaining = getAttestationRequestRemainingMs(
            'initiative',
            'i1',
            'u@test.com',
            now + 10 * 60 * 1000
        )
        expect(remaining).toBe(ATTESTATION_REQUEST_WINDOW_MS - 10 * 60 * 1000)
    })

    it('returns 0 once the window has elapsed', () => {
        const now = 1_000_000
        recordAttestationRequest('initiative', 'i1', 'u@test.com', now)
        expect(
            getAttestationRequestRemainingMs(
                'initiative',
                'i1',
                'u@test.com',
                now + ATTESTATION_REQUEST_WINDOW_MS + 1
            )
        ).toBe(0)
    })

    it('scopes lockouts per entity and per user', () => {
        const now = 1_000_000
        recordAttestationRequest('initiative', 'i1', 'u@test.com', now)
        expect(
            getAttestationRequestRemainingMs(
                'initiative',
                'i2',
                'u@test.com',
                now
            )
        ).toBe(0)
        expect(
            getAttestationRequestRemainingMs(
                'initiative',
                'i1',
                'other@test.com',
                now
            )
        ).toBe(0)
    })

    it('formats remaining time in minutes', () => {
        expect(formatRemaining(30_000)).toBe('1 minute')
        expect(formatRemaining(5 * 60 * 1000)).toBe('5 minutes')
    })
})
