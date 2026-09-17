import { submitApptioEpicMappings } from './useSubmitApptioEpicMappings'

describe('submitApptioEpicMappings', () => {
    const getContentTypeHeader = (headers: HeadersInit | undefined) => {
        if (!headers) return undefined
        if (headers instanceof Headers) {
            return headers.get('Content-Type') ?? undefined
        }
        if (Array.isArray(headers)) {
            return headers.find(([key]) => key === 'Content-Type')?.[1]
        }
        return headers['Content-Type']
    }

    beforeEach(() => {
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('sends POST request to mappings endpoint', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true })

        const userInfo = {
            userEmail: 'user@aexp.com',
            userName: 'Test User'
        }
        await submitApptioEpicMappings('epic-1', userInfo)

        expect(global.fetch).toHaveBeenCalledTimes(1)
        const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
        expect(url).toContain('/strategic-epics/epic-1/mappings')
        expect(options.method).toBe('POST')
        expect(getContentTypeHeader(options.headers)).toBe('application/json')
        expect(JSON.parse(options.body)).toEqual({ userInfo })
    })

    it('resolves on successful response', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true })

        await expect(
            submitApptioEpicMappings('epic-1', {
                userEmail: 'user@aexp.com',
                userName: 'A'
            })
        ).resolves.toBeUndefined()
    })

    it('throws on non-ok response', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 503,
            statusText: 'Service Unavailable'
        })

        await expect(
            submitApptioEpicMappings('epic-1', {
                userEmail: 'user@aexp.com',
                userName: 'A'
            })
        ).rejects.toThrow(
            'Failed to submit epic mappings: 503 Service Unavailable'
        )
    })
})
