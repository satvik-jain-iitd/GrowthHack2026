import { diagnoseGithubFailure } from './diagnoseGithubFailure'
import { fetchGithub } from './fetchGithub'

jest.mock('./fetchGithub')
jest.mock('./logger', () => ({
    Logger: { error: jest.fn() }
}))

const mockFetchGithub = fetchGithub as jest.Mock

const makeResponse = (status: number, headers: Record<string, string> = {}) =>
    ({
        status,
        ok: false,
        headers: new Headers(headers)
    }) as Response

const diagnose = (response: Response) =>
    diagnoseGithubFailure({
        host: 'ghe',
        owner: 'amex-eng',
        repository: 'gmnst-architecture',
        filePath: 'workproducts/vision.md',
        response
    })

describe('diagnoseGithubFailure', () => {
    beforeEach(() => jest.clearAllMocks())

    it('reports rate_limited for a 403 with no remaining quota', async () => {
        const result = await diagnose(
            makeResponse(403, { 'x-ratelimit-remaining': '0' })
        )

        expect(result.reason).toBe('rate_limited')
        expect(mockFetchGithub).not.toHaveBeenCalled()
    })

    it('reports repo_inaccessible for a 403 with quota remaining', async () => {
        const result = await diagnose(
            makeResponse(403, { 'x-ratelimit-remaining': '42' })
        )

        expect(result.reason).toBe('repo_inaccessible')
    })

    it('reports unauthorized for a 401', async () => {
        const result = await diagnose(makeResponse(401))

        expect(result.reason).toBe('unauthorized')
    })

    it('reports file_not_found when a 404 repo probe succeeds', async () => {
        mockFetchGithub.mockResolvedValue({ ok: true, status: 200 })

        const result = await diagnose(makeResponse(404))

        expect(result.reason).toBe('file_not_found')
        expect(mockFetchGithub).toHaveBeenCalledWith(
            'ghe',
            '/repos/amex-eng/gmnst-architecture',
            { next: { revalidate: 300 } }
        )
    })

    it.each([404, 403])(
        'reports repo_inaccessible when a 404 repo probe returns %i',
        async status => {
            mockFetchGithub.mockResolvedValue({ ok: false, status })

            const result = await diagnose(makeResponse(404))

            expect(result.reason).toBe('repo_inaccessible')
        }
    )

    it('reports unknown when a 404 repo probe fails for another reason', async () => {
        mockFetchGithub.mockResolvedValue({ ok: false, status: 500 })

        const result = await diagnose(makeResponse(404))

        expect(result.reason).toBe('unknown')
    })

    it('reports unknown when the repo probe throws', async () => {
        mockFetchGithub.mockRejectedValue(new Error('network down'))

        const result = await diagnose(makeResponse(404))

        expect(result.reason).toBe('unknown')
    })

    it('reports unknown for an unexpected status', async () => {
        const result = await diagnose(makeResponse(500))

        expect(result.reason).toBe('unknown')
        expect(mockFetchGithub).not.toHaveBeenCalled()
    })

    it('builds the repo url from the enterprise host', async () => {
        const result = await diagnose(makeResponse(401))

        expect(result).toMatchObject({
            status: 401,
            host: 'ghe',
            owner: 'amex-eng',
            repository: 'gmnst-architecture',
            filePath: 'workproducts/vision.md',
            repoUrl: 'https://github.aexp.com/amex-eng/gmnst-architecture'
        })
    })

    it('builds the repo url from the cloud host', async () => {
        const result = await diagnoseGithubFailure({
            host: 'ghc',
            owner: 'amex-eng',
            repository: 'amex-skills',
            response: makeResponse(401)
        })

        expect(result.repoUrl).toBe('https://github.com/amex-eng/amex-skills')
        expect(result.filePath).toBeUndefined()
    })
})
