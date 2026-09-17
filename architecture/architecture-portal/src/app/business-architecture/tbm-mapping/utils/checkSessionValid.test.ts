import { checkSessionValid } from './checkSessionValid'

describe('checkSessionValid', () => {
    beforeEach(() => jest.clearAllMocks())

    it('returns true when session endpoint responds with ok', async () => {
        global.fetch = jest.fn().mockResolvedValue({ ok: true })
        const result = await checkSessionValid()
        expect(result).toBe(true)
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/v1/session?refreshNeeded=true'),
            expect.objectContaining({
                method: 'GET',
                credentials: 'include'
            })
        )
    })

    it('returns false when session endpoint responds with non-ok status', async () => {
        global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 })
        const result = await checkSessionValid()
        expect(result).toBe(false)
    })

    it('returns false when fetch throws a network error', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))
        const result = await checkSessionValid()
        expect(result).toBe(false)
    })
})
