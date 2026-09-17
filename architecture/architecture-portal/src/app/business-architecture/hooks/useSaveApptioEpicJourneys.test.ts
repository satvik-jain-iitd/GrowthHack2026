import { saveApptioEpicJourneys } from './useSaveApptioEpicJourneys'

describe('saveApptioEpicJourneys', () => {
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

    it('sends POST request with journey data', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true })

        const journeyData = [
            { id: 'j1', isAiRecommended: true },
            { id: 'j2', isAiRecommended: false }
        ]
        const userInfo = {
            userEmail: 'testUser@aexp.com',
            userName: 'Test User'
        }

        await saveApptioEpicJourneys('epic-1', journeyData, userInfo)

        expect(global.fetch).toHaveBeenCalledTimes(1)
        const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
        expect(url).toContain('/strategic-epics/epic-1/journeys')
        expect(options.method).toBe('POST')
        expect(getContentTypeHeader(options.headers)).toBe('application/json')
        expect(JSON.parse(options.body)).toEqual({ userInfo, journeyData })
    })

    it('resolves on successful response', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true })

        await expect(
            saveApptioEpicJourneys('epic-1', [{ id: 'j1' }], {
                userEmail: 'user@aexp.com',
                userName: 'A'
            })
        ).resolves.toBeUndefined()
    })

    it('throws on non-ok response', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error'
        })

        await expect(
            saveApptioEpicJourneys('epic-1', [{ id: 'j1' }], {
                userEmail: 'user@aexp.com',
                userName: 'A'
            })
        ).rejects.toThrow(
            'Failed to save apptio epic journeys: 500 Internal Server Error'
        )
    })
})
