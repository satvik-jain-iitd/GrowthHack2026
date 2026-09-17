import { GET, POST } from './route'
import {
    CONTENTS_TEST_PARAMS,
    CONTENTS_TEST_AUTH,
    CONTENTS_TEST_SHAS,
    CONTENTS_TEST_ERRORS,
    CONTENTS_TEST_PR
} from './test-data'

// next-auth's ESM dependency chain (openid-client → jose) cannot be parsed by Babel.
// Mock both next-auth packages to prevent the parse error.
jest.mock('next-auth', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('next-auth/next', () => ({
    __esModule: true,
    getServerSession: jest.fn()
}))
jest.mock('@/app/api/auth/[...nextauth]/AuthOptions', () => ({
    __esModule: true,
    default: {}
}))
jest.mock('@/constants', () => ({
    SOURCE_HOST: {
        GHE: 'ghe',
        GHC: 'ghc'
    },
    SOURCE_HOST_CONFIG: {
        ghe: {
            providerId: 'github-enterprise',
            url: 'https://github.example.com',
            apiUrl: 'https://github.example.com/api/v3'
        },
        ghc: {
            providerId: 'github-cloud',
            url: 'https://github.com',
            apiUrl: 'https://api.github.com'
        }
    }
}))
jest.mock('@/utils/server', () => ({
    fetchGithub: jest.fn(),
    Logger: { info: jest.fn(), error: jest.fn() }
}))
jest.mock('mime', () => ({
    __esModule: true,
    default: { getType: jest.fn(() => 'text/markdown') }
}))
jest.mock('next/server', () => {
    // NextResponse is used both as `new NextResponse(body, init)` and `NextResponse.json(body, init)`
    const MockNextResponse = jest.fn(function (mockBody, mockInit) {
        return {
            _body: mockBody,
            _init: mockInit,
            status: mockInit && mockInit.status ? mockInit.status : 200
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any
    MockNextResponse.json = jest.fn((mockBody, mockInit) => ({
        _body: mockBody,
        _init: mockInit
    }))
    return { NextResponse: MockNextResponse }
})

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { fetchGithub } = require('@/utils/server')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getServerSession } = require('next-auth/next')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { NextResponse } = require('next/server')

// Minimal request-like object — route.ts only calls .json() on POST requests
const makeGetRequest = (host = 'ghe') =>
    ({ url: `http://localhost/test?host=${host}` }) as unknown as Request
const makePostRequest = (content = 'hello world', host = 'ghe') =>
    ({
        json: jest.fn().mockResolvedValue({ content, host })
    }) as unknown as Request

// Helper to build a mock context
const makeContext = (pathParts?: string[]) => ({
    params: Promise.resolve({
        owner: CONTENTS_TEST_PARAMS.owner,
        repo: CONTENTS_TEST_PARAMS.repo,
        path: pathParts
    })
})

// Helper to build a mock ok fetch response
const okRes = (json?: unknown, text?: string) => ({
    ok: true,
    status: 200,
    json: jest.fn().mockResolvedValue(json ?? {}),
    text: jest.fn().mockResolvedValue(text ?? ''),
    body: 'mock-body',
    headers: { get: jest.fn().mockReturnValue(null) }
})

// Helper to build a failed fetch response
const failRes = (status = 500, text = 'error') => ({
    ok: false,
    status,
    json: jest.fn().mockResolvedValue({ message: text }),
    text: jest.fn().mockResolvedValue(text),
    headers: { get: jest.fn().mockReturnValue(null) }
})

// Shared mock: full happy-path POST sequence
const setupHappyPostMocks = () => {
    getServerSession.mockResolvedValue({
        accessToken: CONTENTS_TEST_AUTH.accessToken
    })

    fetchGithub.mockImplementation(
        (host: string, resource: string, opts?: { method?: string }) => {
            // GET /user
            if (resource === '/user')
                return Promise.resolve(
                    okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                )
            // fork check
            if (
                resource ===
                    `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                !opts?.method
            )
                return Promise.resolve(okRes({ archived: false }))
            // fork git/refs check
            if (
                resource ===
                    `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/git/refs` &&
                !opts?.method
            )
                return Promise.resolve(okRes([]))
            // base ref
            if (
                resource ===
                `/repos/${CONTENTS_TEST_PARAMS.owner}/${CONTENTS_TEST_PARAMS.repo}/git/ref/heads/main`
            )
                return Promise.resolve(
                    okRes({ object: { sha: CONTENTS_TEST_SHAS.baseSha } })
                )
            // SHA check in fork
            if (
                resource ===
                `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
            )
                return Promise.resolve(okRes())
            // check if new branch exists (branch does not exist yet)
            if (resource.includes('/git/ref/heads/edit-'))
                return Promise.resolve(failRes(404))
            // create branch
            if (
                resource ===
                    `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/git/refs` &&
                opts?.method === 'POST'
            )
                return Promise.resolve(okRes())
            // get file sha on fork branch
            if (
                resource.includes(
                    `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/contents/`
                )
            )
                return Promise.resolve(
                    okRes({ sha: CONTENTS_TEST_SHAS.fileSha })
                )
            // update file
            if (
                resource ===
                `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/contents/${encodeURIComponent(CONTENTS_TEST_PARAMS.filePath)}`
            )
                return Promise.resolve(okRes())
            // create PR
            if (
                resource ===
                `/repos/${CONTENTS_TEST_PARAMS.owner}/${CONTENTS_TEST_PARAMS.repo}/pulls`
            )
                return Promise.resolve(
                    okRes({
                        html_url: CONTENTS_TEST_PR.htmlUrl,
                        number: CONTENTS_TEST_PR.number
                    })
                )
            return Promise.resolve(failRes(500))
        }
    )
}

describe('GET /api/v3/repos/[owner]/[repo]/contents/[[...path]]', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        NextResponse.json.mockImplementation(
            (body: unknown, init?: ResponseInit) => ({
                _body: body,
                _init: init
            })
        )
    })

    it('returns the streamed response with correct content-type header on success', async () => {
        getServerSession.mockResolvedValue({
            accessToken: CONTENTS_TEST_AUTH.accessToken
        })
        fetchGithub.mockResolvedValue(okRes())

        const result = await GET(
            makeGetRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        // Should return a NextResponse (not a json error)
        expect(result).toBeDefined()
        expect((result as { status: number }).status).toBe(200)
    })

    it('builds filePath by joining path array parts', async () => {
        getServerSession.mockResolvedValue({
            accessToken: CONTENTS_TEST_AUTH.accessToken
        })
        fetchGithub.mockResolvedValue(okRes())

        await GET(makeGetRequest(), makeContext(['docs', 'guide.md']))

        expect(fetchGithub).toHaveBeenCalledWith(
            'ghe',
            expect.stringContaining('docs/guide.md'),
            expect.any(Object)
        )
    })

    it('builds an empty filePath when path is undefined', async () => {
        getServerSession.mockResolvedValue(null)
        fetchGithub.mockResolvedValue(okRes())

        await GET(makeGetRequest(), makeContext(undefined))

        expect(fetchGithub).toHaveBeenCalledWith(
            'ghe',
            expect.stringContaining('/repos/test-org/test-repo/contents/'),
            expect.any(Object)
        )
    })

    it('omits Authorization header when session has no accessToken', async () => {
        getServerSession.mockResolvedValue({})
        fetchGithub.mockResolvedValue(okRes())

        await GET(makeGetRequest(), makeContext(CONTENTS_TEST_PARAMS.pathParts))

        const callOpts = fetchGithub.mock.calls[0][2]
        expect(callOpts.headers.Authorization).toBeUndefined()
    })

    it('returns JSON error when fetchGithub response is not ok', async () => {
        getServerSession.mockResolvedValue(null)
        fetchGithub.mockResolvedValue(failRes(404))

        await GET(makeGetRequest(), makeContext(CONTENTS_TEST_PARAMS.pathParts))

        expect(NextResponse.json).toHaveBeenCalledWith(
            { error: CONTENTS_TEST_ERRORS.fetchGithubFailed },
            { status: 404 }
        )
    })

    it('returns JSON error when fetchGithub returns null', async () => {
        getServerSession.mockResolvedValue(null)
        fetchGithub.mockResolvedValue(null)

        await GET(makeGetRequest(), makeContext(CONTENTS_TEST_PARAMS.pathParts))

        expect(NextResponse.json).toHaveBeenCalledWith(
            { error: CONTENTS_TEST_ERRORS.fetchGithubFailed },
            { status: undefined }
        )
    })
})

describe('POST /api/v3/repos/[owner]/[repo]/contents/[[...path]]', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        NextResponse.json.mockImplementation(
            (body: unknown, init?: ResponseInit) => ({
                _body: body,
                _init: init
            })
        )
    })

    it('returns 401 when no session', async () => {
        getServerSession.mockResolvedValue(null)

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.stringContaining('Not authenticated')
            }),
            { status: 401 }
        )
    })

    it('returns 401 when session has no accessToken', async () => {
        getServerSession.mockResolvedValue({})

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.stringContaining('Not authenticated')
            }),
            { status: 401 }
        )
    })

    it('returns error when fetching current user fails', async () => {
        getServerSession.mockResolvedValue({
            accessToken: CONTENTS_TEST_AUTH.accessToken
        })
        fetchGithub.mockResolvedValueOnce(failRes(500, 'server error'))

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: CONTENTS_TEST_ERRORS.failedReadUser
            }),
            expect.objectContaining({ status: 500 })
        )
    })

    it('returns error when fetching current user returns null', async () => {
        getServerSession.mockResolvedValue({
            accessToken: CONTENTS_TEST_AUTH.accessToken
        })
        fetchGithub.mockResolvedValueOnce(null)

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: CONTENTS_TEST_ERRORS.failedReadUser
            }),
            expect.objectContaining({ status: 500 })
        )
    })

    it('returns error when fork creation fails', async () => {
        getServerSession.mockResolvedValue({
            accessToken: CONTENTS_TEST_AUTH.accessToken
        })
        fetchGithub
            .mockResolvedValueOnce(
                okRes({ login: CONTENTS_TEST_AUTH.userLogin })
            ) // /user
            .mockResolvedValueOnce(failRes(404)) // fork check → not found
            .mockResolvedValueOnce(failRes(422, 'fork failed')) // POST /forks

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: CONTENTS_TEST_ERRORS.failedForkRepo
            }),
            expect.objectContaining({ status: 422 })
        )
    })

    it('returns error when base ref fetch fails', async () => {
        getServerSession.mockResolvedValue({
            accessToken: CONTENTS_TEST_AUTH.accessToken
        })
        fetchGithub
            .mockResolvedValueOnce(
                okRes({ login: CONTENTS_TEST_AUTH.userLogin })
            ) // /user
            .mockResolvedValueOnce(okRes({ archived: false })) // fork exists
            .mockResolvedValueOnce(okRes([])) // git/refs readable
            .mockResolvedValueOnce(failRes(500, 'ref error')) // base ref

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: CONTENTS_TEST_ERRORS.failedBaseRef
            }),
            expect.objectContaining({ status: 500 })
        )
    })

    it('returns error when base SHA is missing in ref response', async () => {
        getServerSession.mockResolvedValue({
            accessToken: CONTENTS_TEST_AUTH.accessToken
        })
        fetchGithub
            .mockResolvedValueOnce(
                okRes({ login: CONTENTS_TEST_AUTH.userLogin })
            )
            .mockResolvedValueOnce(okRes({ archived: false }))
            .mockResolvedValueOnce(okRes([]))
            .mockResolvedValueOnce(okRes({ object: {} })) // no sha

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: CONTENTS_TEST_ERRORS.baseSHAMissing
            }),
            { status: 500 }
        )
    })

    it('returns error when file update fails', async () => {
        getServerSession.mockResolvedValue({
            accessToken: CONTENTS_TEST_AUTH.accessToken
        })
        let callCount = 0
        fetchGithub.mockImplementation(
            (host: string, resource: string, opts?: { method?: string }) => {
                callCount++
                if (resource === '/user')
                    return Promise.resolve(
                        okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                    )
                if (
                    !opts?.method &&
                    resource.includes(
                        `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}`
                    ) &&
                    !resource.includes('git/') &&
                    !resource.includes('contents')
                )
                    return Promise.resolve(okRes({ archived: false }))
                if (resource.includes('/git/refs') && !opts?.method)
                    return Promise.resolve(okRes([]))
                if (resource.includes('/git/ref/heads/main'))
                    return Promise.resolve(
                        okRes({ object: { sha: CONTENTS_TEST_SHAS.baseSha } })
                    )
                if (
                    resource.includes(
                        `/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
                    )
                )
                    return Promise.resolve(okRes())
                if (resource.includes('/git/ref/heads/edit-'))
                    return Promise.resolve(failRes(404))
                if (resource.includes('/git/refs') && opts?.method === 'POST')
                    return Promise.resolve(okRes())
                if (resource.includes('/contents/') && !opts?.method)
                    return Promise.resolve(
                        okRes({ sha: CONTENTS_TEST_SHAS.fileSha })
                    )
                if (resource.includes('/contents/') && opts?.method === 'PUT')
                    return Promise.resolve(failRes(500, 'update failed'))
                return Promise.resolve(
                    failRes(500, `unexpected call ${callCount}: ${resource}`)
                )
            }
        )

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: CONTENTS_TEST_ERRORS.failedUpdateFile
            }),
            expect.any(Object)
        )
    })

    it('returns error when PR creation fails', async () => {
        getServerSession.mockResolvedValue({
            accessToken: CONTENTS_TEST_AUTH.accessToken
        })
        fetchGithub.mockImplementation(
            (host: string, resource: string, opts?: { method?: string }) => {
                if (resource === '/user')
                    return Promise.resolve(
                        okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                    )
                if (
                    !opts?.method &&
                    resource.includes(
                        `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}`
                    ) &&
                    !resource.includes('git/') &&
                    !resource.includes('contents')
                )
                    return Promise.resolve(okRes({ archived: false }))
                if (resource.includes('/git/refs') && !opts?.method)
                    return Promise.resolve(okRes([]))
                if (resource.includes('/git/ref/heads/main'))
                    return Promise.resolve(
                        okRes({ object: { sha: CONTENTS_TEST_SHAS.baseSha } })
                    )
                if (
                    resource.includes(
                        `/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
                    )
                )
                    return Promise.resolve(okRes())
                if (resource.includes('/git/ref/heads/edit-'))
                    return Promise.resolve(failRes(404))
                if (resource.includes('/git/refs') && opts?.method === 'POST')
                    return Promise.resolve(okRes())
                if (resource.includes('/contents/') && !opts?.method)
                    return Promise.resolve(
                        okRes({ sha: CONTENTS_TEST_SHAS.fileSha })
                    )
                if (resource.includes('/contents/') && opts?.method === 'PUT')
                    return Promise.resolve(okRes())
                if (resource.includes('/pulls'))
                    return Promise.resolve(failRes(422, 'pr failed'))
                return Promise.resolve(failRes(500))
            }
        )

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: CONTENTS_TEST_ERRORS.failedCreatePR
            }),
            expect.any(Object)
        )
    })

    it('returns { pr: prData } on the happy path', async () => {
        setupHappyPostMocks()

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        expect(NextResponse.json).toHaveBeenCalledWith({
            pr: expect.objectContaining({ html_url: CONTENTS_TEST_PR.htmlUrl })
        })
    })

    it('uses fork existing on happy path (skips fork creation)', async () => {
        setupHappyPostMocks()

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        // fork creation POST should not have been called
        const forkCreationCall = (
            fetchGithub.mock.calls as [string, string, { method?: string }][]
        ).find(
            ([_, resource, opts]) =>
                resource ===
                    `/repos/${CONTENTS_TEST_PARAMS.owner}/${CONTENTS_TEST_PARAMS.repo}/forks` &&
                opts?.method === 'POST'
        )
        expect(forkCreationCall).toBeUndefined()
    })

    it('handles thrown errors and returns 500', async () => {
        getServerSession.mockRejectedValue(new Error('unexpected crash'))

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            { error: 'Error: unexpected crash' },
            { status: 500 }
        )
    })

    it('returns 409 when fork is out of date with upstream', async () => {
        getServerSession.mockResolvedValue({
            accessToken: CONTENTS_TEST_AUTH.accessToken
        })
        fetchGithub.mockImplementation((host: string, resource: string) => {
            if (resource === '/user')
                return Promise.resolve(
                    okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                )
            if (
                resource.includes(
                    `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}`
                ) &&
                !resource.includes('git/') &&
                !resource.includes('contents')
            )
                return Promise.resolve(okRes({ archived: false }))
            if (resource.includes('/git/refs'))
                return Promise.resolve(okRes([]))
            if (resource.includes('/git/ref/heads/main'))
                return Promise.resolve(
                    okRes({ object: { sha: CONTENTS_TEST_SHAS.baseSha } })
                )
            if (resource.includes(`/git/commits/${CONTENTS_TEST_SHAS.baseSha}`))
                return Promise.resolve(failRes(404))
            // merge-upstream also fails
            if (resource.includes('/merge-upstream'))
                return Promise.resolve(failRes(409))
            return Promise.resolve(failRes(500))
        })

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.stringContaining(CONTENTS_TEST_AUTH.userLogin)
            }),
            { status: 409 }
        )
    })

    it('returns error when fork is archived', async () => {
        getServerSession.mockResolvedValue({
            accessToken: CONTENTS_TEST_AUTH.accessToken
        })
        fetchGithub
            .mockResolvedValueOnce(
                okRes({ login: CONTENTS_TEST_AUTH.userLogin })
            )
            .mockResolvedValueOnce(okRes({ archived: true })) // fork is archived

        await POST(
            makePostRequest(),
            makeContext(CONTENTS_TEST_PARAMS.pathParts)
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.stringContaining('archived')
            }),
            { status: 400 }
        )
    })

    it('builds an empty filePath for POST when path is undefined', async () => {
        setupHappyPostMocks()

        await POST(makePostRequest(), makeContext(undefined))

        expect(NextResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({ pr: expect.any(Object) })
        )
    })

    describe('fork creation polling paths', () => {
        beforeEach(() => {
            jest.useFakeTimers()
        })
        afterEach(() => jest.useRealTimers())

        it('polls fork until ready after creation and completes PR', async () => {
            getServerSession.mockResolvedValue({
                accessToken: CONTENTS_TEST_AUTH.accessToken
            })
            let forkCheckCount = 0
            fetchGithub.mockImplementation(
                (
                    host: string,
                    resource: string,
                    opts?: { method?: string }
                ) => {
                    if (resource === '/user')
                        return Promise.resolve(
                            okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                        )
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                        !opts?.method
                    ) {
                        forkCheckCount++
                        if (forkCheckCount <= 1)
                            return Promise.resolve(failRes(404)) // fork not found
                        return Promise.resolve(okRes({ archived: false })) // poll succeeds
                    }
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_PARAMS.owner}/${CONTENTS_TEST_PARAMS.repo}/forks` &&
                        opts?.method === 'POST'
                    )
                        return Promise.resolve({
                            ok: false,
                            status: 202,
                            json: jest.fn().mockResolvedValue({}),
                            text: jest.fn().mockResolvedValue(''),
                            headers: { get: jest.fn().mockReturnValue(null) }
                        })
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/git/refs` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes([]))
                    if (resource.includes('/git/ref/heads/main'))
                        return Promise.resolve(
                            okRes({
                                object: { sha: CONTENTS_TEST_SHAS.baseSha }
                            })
                        )
                    if (
                        resource.includes(
                            `/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
                        )
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/git/ref/heads/edit-'))
                        return Promise.resolve(failRes(404))
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/git/refs` &&
                        opts?.method === 'POST'
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/contents/') && !opts?.method)
                        return Promise.resolve(
                            okRes({ sha: CONTENTS_TEST_SHAS.fileSha })
                        )
                    if (
                        resource.includes('/contents/') &&
                        opts?.method === 'PUT'
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/pulls'))
                        return Promise.resolve(
                            okRes({
                                html_url: CONTENTS_TEST_PR.htmlUrl,
                                number: CONTENTS_TEST_PR.number
                            })
                        )
                    return Promise.resolve(failRes(500))
                }
            )

            const p = POST(
                makePostRequest(),
                makeContext(CONTENTS_TEST_PARAMS.pathParts)
            )
            await jest.runAllTimersAsync()
            await p

            expect(NextResponse.json).toHaveBeenCalledWith({
                pr: expect.objectContaining({
                    html_url: CONTENTS_TEST_PR.htmlUrl
                })
            })
        })

        it('returns timedOutFork error when fork never becomes ready', async () => {
            getServerSession.mockResolvedValue({
                accessToken: CONTENTS_TEST_AUTH.accessToken
            })
            let forkCheckCount = 0
            fetchGithub.mockImplementation(
                (
                    host: string,
                    resource: string,
                    opts?: { method?: string }
                ) => {
                    if (resource === '/user')
                        return Promise.resolve(
                            okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                        )
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                        !opts?.method
                    ) {
                        forkCheckCount++
                        return Promise.resolve(failRes(404)) // always not ready
                    }
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_PARAMS.owner}/${CONTENTS_TEST_PARAMS.repo}/forks` &&
                        opts?.method === 'POST'
                    )
                        return Promise.resolve({
                            ok: false,
                            status: 202,
                            json: jest.fn().mockResolvedValue({}),
                            text: jest.fn().mockResolvedValue(''),
                            headers: { get: jest.fn().mockReturnValue(null) }
                        })
                    return Promise.resolve(failRes(500))
                }
            )

            const p = POST(
                makePostRequest(),
                makeContext(CONTENTS_TEST_PARAMS.pathParts)
            )
            await jest.runAllTimersAsync()
            await p

            expect(NextResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.stringContaining(
                        'Timed out waiting for fork to be ready'
                    )
                }),
                { status: 500 }
            )
            expect(forkCheckCount).toBeGreaterThanOrEqual(10)
        })

        it('polls git/refs until readable when fork exists but refs not initially ready', async () => {
            getServerSession.mockResolvedValue({
                accessToken: CONTENTS_TEST_AUTH.accessToken
            })
            let refsCheckCount = 0
            fetchGithub.mockImplementation(
                (
                    host: string,
                    resource: string,
                    opts?: { method?: string }
                ) => {
                    if (resource === '/user')
                        return Promise.resolve(
                            okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                        )
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes({ archived: false }))
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/git/refs` &&
                        !opts?.method
                    ) {
                        refsCheckCount++
                        if (refsCheckCount <= 1)
                            return Promise.resolve(failRes(503)) // not readable yet
                        return Promise.resolve(okRes([]))
                    }
                    if (resource.includes('/git/ref/heads/main'))
                        return Promise.resolve(
                            okRes({
                                object: { sha: CONTENTS_TEST_SHAS.baseSha }
                            })
                        )
                    if (
                        resource.includes(
                            `/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
                        )
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/git/ref/heads/edit-'))
                        return Promise.resolve(failRes(404))
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/git/refs` &&
                        opts?.method === 'POST'
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/contents/') && !opts?.method)
                        return Promise.resolve(
                            okRes({ sha: CONTENTS_TEST_SHAS.fileSha })
                        )
                    if (
                        resource.includes('/contents/') &&
                        opts?.method === 'PUT'
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/pulls'))
                        return Promise.resolve(
                            okRes({
                                html_url: CONTENTS_TEST_PR.htmlUrl,
                                number: CONTENTS_TEST_PR.number
                            })
                        )
                    return Promise.resolve(failRes(500))
                }
            )

            const p = POST(
                makePostRequest(),
                makeContext(CONTENTS_TEST_PARAMS.pathParts)
            )
            await jest.runAllTimersAsync()
            await p

            expect(NextResponse.json).toHaveBeenCalledWith({
                pr: expect.objectContaining({
                    html_url: CONTENTS_TEST_PR.htmlUrl
                })
            })
        })

        it('returns timedOutForkRefs error when git/refs is never readable', async () => {
            getServerSession.mockResolvedValue({
                accessToken: CONTENTS_TEST_AUTH.accessToken
            })
            fetchGithub.mockImplementation(
                (
                    host: string,
                    resource: string,
                    opts?: { method?: string }
                ) => {
                    if (resource === '/user')
                        return Promise.resolve(
                            okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                        )
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes({ archived: false }))
                    if (resource.includes('/git/refs') && !opts?.method)
                        return Promise.resolve(failRes(503)) // always fails
                    return Promise.resolve(failRes(500))
                }
            )

            const p = POST(
                makePostRequest(),
                makeContext(CONTENTS_TEST_PARAMS.pathParts)
            )
            await jest.runAllTimersAsync()
            await p

            expect(NextResponse.json).toHaveBeenCalledWith(
                { error: CONTENTS_TEST_ERRORS.timedOutForkRefs },
                { status: 500 }
            )
        })

        it('retries branch creation on 5xx transient error and succeeds', async () => {
            getServerSession.mockResolvedValue({
                accessToken: CONTENTS_TEST_AUTH.accessToken
            })
            let createCount = 0
            fetchGithub.mockImplementation(
                (
                    host: string,
                    resource: string,
                    opts?: { method?: string }
                ) => {
                    if (resource === '/user')
                        return Promise.resolve(
                            okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                        )
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes({ archived: false }))
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/git/refs` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes([]))
                    if (resource.includes('/git/ref/heads/main'))
                        return Promise.resolve(
                            okRes({
                                object: { sha: CONTENTS_TEST_SHAS.baseSha }
                            })
                        )
                    if (
                        resource.includes(
                            `/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
                        )
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/git/ref/heads/edit-'))
                        return Promise.resolve(failRes(404))
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/git/refs` &&
                        opts?.method === 'POST'
                    ) {
                        createCount++
                        if (createCount === 1)
                            return Promise.resolve(
                                failRes(503, 'service unavailable')
                            )
                        return Promise.resolve(okRes())
                    }
                    if (resource.includes('/contents/') && !opts?.method)
                        return Promise.resolve(
                            okRes({ sha: CONTENTS_TEST_SHAS.fileSha })
                        )
                    if (
                        resource.includes('/contents/') &&
                        opts?.method === 'PUT'
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/pulls'))
                        return Promise.resolve(
                            okRes({
                                html_url: CONTENTS_TEST_PR.htmlUrl,
                                number: CONTENTS_TEST_PR.number
                            })
                        )
                    return Promise.resolve(failRes(500))
                }
            )

            const p = POST(
                makePostRequest(),
                makeContext(CONTENTS_TEST_PARAMS.pathParts)
            )
            await jest.runAllTimersAsync()
            await p

            expect(NextResponse.json).toHaveBeenCalledWith({
                pr: expect.objectContaining({
                    html_url: CONTENTS_TEST_PR.htmlUrl
                })
            })
            expect(createCount).toBe(2)
        })

        it('returns failedCreateBranch error after all retry attempts are exhausted', async () => {
            getServerSession.mockResolvedValue({
                accessToken: CONTENTS_TEST_AUTH.accessToken
            })
            fetchGithub.mockImplementation(
                (
                    host: string,
                    resource: string,
                    opts?: { method?: string }
                ) => {
                    if (resource === '/user')
                        return Promise.resolve(
                            okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                        )
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes({ archived: false }))
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/git/refs` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes([]))
                    if (resource.includes('/git/ref/heads/main'))
                        return Promise.resolve(
                            okRes({
                                object: { sha: CONTENTS_TEST_SHAS.baseSha }
                            })
                        )
                    if (
                        resource.includes(
                            `/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
                        )
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/git/ref/heads/edit-'))
                        return Promise.resolve(failRes(404))
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/git/refs` &&
                        opts?.method === 'POST'
                    )
                        return Promise.resolve(
                            failRes(503, 'service unavailable')
                        ) // always fails
                    return Promise.resolve(failRes(500))
                }
            )

            const p = POST(
                makePostRequest(),
                makeContext(CONTENTS_TEST_PARAMS.pathParts)
            )
            await jest.runAllTimersAsync()
            await p

            expect(NextResponse.json).toHaveBeenCalledWith(
                { error: CONTENTS_TEST_ERRORS.failedCreateBranch },
                { status: 500 }
            )
        })
    })

    describe('additional uncovered paths', () => {
        it('skips branch creation when branch already exists on fork', async () => {
            getServerSession.mockResolvedValue({
                accessToken: CONTENTS_TEST_AUTH.accessToken
            })
            fetchGithub.mockImplementation(
                (
                    host: string,
                    resource: string,
                    opts?: { method?: string }
                ) => {
                    if (resource === '/user')
                        return Promise.resolve(
                            okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                        )
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes({ archived: false }))
                    if (resource.includes('/git/refs') && !opts?.method)
                        return Promise.resolve(okRes([]))
                    if (resource.includes('/git/ref/heads/main'))
                        return Promise.resolve(
                            okRes({
                                object: { sha: CONTENTS_TEST_SHAS.baseSha }
                            })
                        )
                    if (
                        resource.includes(
                            `/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
                        )
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/git/ref/heads/edit-'))
                        return Promise.resolve(okRes()) // branch already EXISTS
                    if (resource.includes('/contents/') && !opts?.method)
                        return Promise.resolve(
                            okRes({ sha: CONTENTS_TEST_SHAS.fileSha })
                        )
                    if (
                        resource.includes('/contents/') &&
                        opts?.method === 'PUT'
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/pulls'))
                        return Promise.resolve(
                            okRes({
                                html_url: CONTENTS_TEST_PR.htmlUrl,
                                number: CONTENTS_TEST_PR.number
                            })
                        )
                    return Promise.resolve(failRes(500))
                }
            )

            await POST(
                makePostRequest(),
                makeContext(CONTENTS_TEST_PARAMS.pathParts)
            )

            const branchCreateCall = (
                fetchGithub.mock.calls as [
                    string,
                    string,
                    { method?: string }
                ][]
            ).find(
                ([_, resource, opts]) =>
                    resource ===
                        `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/git/refs` &&
                    opts?.method === 'POST'
            )
            expect(branchCreateCall).toBeUndefined()
            expect(NextResponse.json).toHaveBeenCalledWith({
                pr: expect.objectContaining({
                    html_url: CONTENTS_TEST_PR.htmlUrl
                })
            })
        })

        it('creates new file when it does not exist on fork branch', async () => {
            getServerSession.mockResolvedValue({
                accessToken: CONTENTS_TEST_AUTH.accessToken
            })
            fetchGithub.mockImplementation(
                (
                    host: string,
                    resource: string,
                    opts?: { method?: string }
                ) => {
                    if (resource === '/user')
                        return Promise.resolve(
                            okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                        )
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes({ archived: false }))
                    if (resource.includes('/git/refs') && !opts?.method)
                        return Promise.resolve(okRes([]))
                    if (resource.includes('/git/ref/heads/main'))
                        return Promise.resolve(
                            okRes({
                                object: { sha: CONTENTS_TEST_SHAS.baseSha }
                            })
                        )
                    if (
                        resource.includes(
                            `/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
                        )
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/git/ref/heads/edit-'))
                        return Promise.resolve(failRes(404))
                    if (
                        resource.includes('/git/refs') &&
                        opts?.method === 'POST'
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/contents/') && !opts?.method)
                        return Promise.resolve(failRes(404)) // file does not exist on fork branch
                    if (
                        resource.includes('/contents/') &&
                        opts?.method === 'PUT'
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/pulls'))
                        return Promise.resolve(
                            okRes({
                                html_url: CONTENTS_TEST_PR.htmlUrl,
                                number: CONTENTS_TEST_PR.number
                            })
                        )
                    return Promise.resolve(failRes(500))
                }
            )

            await POST(
                makePostRequest(),
                makeContext(CONTENTS_TEST_PARAMS.pathParts)
            )

            const putCall = (
                fetchGithub.mock.calls as [
                    string,
                    string,
                    { method?: string; body?: string }
                ][]
            ).find(
                ([_, resource, opts]) =>
                    resource.includes('/contents/') && opts?.method === 'PUT'
            )
            const putBody = JSON.parse(putCall![2].body!)
            expect(putBody.sha).toBeUndefined()
            expect(NextResponse.json).toHaveBeenCalledWith({
                pr: expect.objectContaining({
                    html_url: CONTENTS_TEST_PR.htmlUrl
                })
            })
        })

        it('continues to create PR when merge-upstream succeeds and shaCheck2 passes', async () => {
            getServerSession.mockResolvedValue({
                accessToken: CONTENTS_TEST_AUTH.accessToken
            })
            let commitCheckCount = 0
            fetchGithub.mockImplementation(
                (
                    host: string,
                    resource: string,
                    opts?: { method?: string }
                ) => {
                    if (resource === '/user')
                        return Promise.resolve(
                            okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                        )
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes({ archived: false }))
                    if (resource.includes('/git/refs') && !opts?.method)
                        return Promise.resolve(okRes([]))
                    if (resource.includes('/git/ref/heads/main'))
                        return Promise.resolve(
                            okRes({
                                object: { sha: CONTENTS_TEST_SHAS.baseSha }
                            })
                        )
                    if (
                        resource.includes(
                            `/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
                        )
                    ) {
                        commitCheckCount++
                        if (commitCheckCount === 1)
                            return Promise.resolve(failRes(404)) // initial shaCheck fails
                        return Promise.resolve(okRes()) // shaCheck2 passes
                    }
                    if (
                        resource.includes('/merge-upstream') &&
                        opts?.method === 'POST'
                    )
                        return Promise.resolve(okRes()) // merge-upstream succeeds
                    if (resource.includes('/git/ref/heads/edit-'))
                        return Promise.resolve(failRes(404))
                    if (
                        resource.includes('/git/refs') &&
                        opts?.method === 'POST'
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/contents/') && !opts?.method)
                        return Promise.resolve(
                            okRes({ sha: CONTENTS_TEST_SHAS.fileSha })
                        )
                    if (
                        resource.includes('/contents/') &&
                        opts?.method === 'PUT'
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/pulls'))
                        return Promise.resolve(
                            okRes({
                                html_url: CONTENTS_TEST_PR.htmlUrl,
                                number: CONTENTS_TEST_PR.number
                            })
                        )
                    return Promise.resolve(failRes(500))
                }
            )

            await POST(
                makePostRequest(),
                makeContext(CONTENTS_TEST_PARAMS.pathParts)
            )

            expect(NextResponse.json).toHaveBeenCalledWith({
                pr: expect.objectContaining({
                    html_url: CONTENTS_TEST_PR.htmlUrl
                })
            })
            expect(commitCheckCount).toBe(2)
        })

        it('returns 409 when merge-upstream succeeds but shaCheck2 still fails', async () => {
            getServerSession.mockResolvedValue({
                accessToken: CONTENTS_TEST_AUTH.accessToken
            })
            fetchGithub.mockImplementation(
                (
                    host: string,
                    resource: string,
                    opts?: { method?: string }
                ) => {
                    if (resource === '/user')
                        return Promise.resolve(
                            okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                        )
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes({ archived: false }))
                    if (resource.includes('/git/refs') && !opts?.method)
                        return Promise.resolve(okRes([]))
                    if (resource.includes('/git/ref/heads/main'))
                        return Promise.resolve(
                            okRes({
                                object: { sha: CONTENTS_TEST_SHAS.baseSha }
                            })
                        )
                    if (
                        resource.includes(
                            `/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
                        )
                    )
                        return Promise.resolve(failRes(404)) // both shaCheck and shaCheck2 fail
                    if (
                        resource.includes('/merge-upstream') &&
                        opts?.method === 'POST'
                    )
                        return Promise.resolve(okRes()) // merge-upstream succeeds
                    return Promise.resolve(failRes(500))
                }
            )

            await POST(
                makePostRequest(),
                makeContext(CONTENTS_TEST_PARAMS.pathParts)
            )

            expect(NextResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.stringContaining(CONTENTS_TEST_AUTH.userLogin)
                }),
                { status: 409 }
            )
        })

        it('returns 409 when merge-upstream call itself fails', async () => {
            getServerSession.mockResolvedValue({
                accessToken: CONTENTS_TEST_AUTH.accessToken
            })
            fetchGithub.mockImplementation(
                (
                    host: string,
                    resource: string,
                    opts?: { method?: string }
                ) => {
                    if (resource === '/user')
                        return Promise.resolve(
                            okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                        )
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes({ archived: false }))
                    if (resource.includes('/git/refs') && !opts?.method)
                        return Promise.resolve(okRes([]))
                    if (resource.includes('/git/ref/heads/main'))
                        return Promise.resolve(
                            okRes({
                                object: { sha: CONTENTS_TEST_SHAS.baseSha }
                            })
                        )
                    if (
                        resource.includes(
                            `/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
                        )
                    )
                        return Promise.resolve(failRes(404))
                    if (
                        resource.includes('/merge-upstream') &&
                        opts?.method === 'POST'
                    )
                        return Promise.resolve(
                            failRes(503, 'upstream unavailable')
                        )
                    return Promise.resolve(failRes(500))
                }
            )

            await POST(
                makePostRequest(),
                makeContext(CONTENTS_TEST_PARAMS.pathParts)
            )

            expect(NextResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.stringContaining(CONTENTS_TEST_AUTH.userLogin)
                }),
                { status: 409 }
            )
        })

        it('returns failedCheckForkSha error when shaCheck fails with non-404 status', async () => {
            getServerSession.mockResolvedValue({
                accessToken: CONTENTS_TEST_AUTH.accessToken
            })
            fetchGithub.mockImplementation(
                (
                    host: string,
                    resource: string,
                    opts?: { method?: string }
                ) => {
                    if (resource === '/user')
                        return Promise.resolve(
                            okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                        )
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes({ archived: false }))
                    if (resource.includes('/git/refs') && !opts?.method)
                        return Promise.resolve(okRes([]))
                    if (resource.includes('/git/ref/heads/main'))
                        return Promise.resolve(
                            okRes({
                                object: { sha: CONTENTS_TEST_SHAS.baseSha }
                            })
                        )
                    if (
                        resource.includes(
                            `/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
                        )
                    )
                        return Promise.resolve(failRes(500)) // non-404 failure
                    return Promise.resolve(failRes(500))
                }
            )

            await POST(
                makePostRequest(),
                makeContext(CONTENTS_TEST_PARAMS.pathParts)
            )

            expect(NextResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: CONTENTS_TEST_ERRORS.failedCheckForkSha
                }),
                expect.objectContaining({ status: 500 })
            )
        })

        it('returns error when branch creation fails with 4xx non-retryable error', async () => {
            getServerSession.mockResolvedValue({
                accessToken: CONTENTS_TEST_AUTH.accessToken
            })
            fetchGithub.mockImplementation(
                (
                    host: string,
                    resource: string,
                    opts?: { method?: string }
                ) => {
                    if (resource === '/user')
                        return Promise.resolve(
                            okRes({ login: CONTENTS_TEST_AUTH.userLogin })
                        )
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}` &&
                        !opts?.method
                    )
                        return Promise.resolve(okRes({ archived: false }))
                    if (resource.includes('/git/refs') && !opts?.method)
                        return Promise.resolve(okRes([]))
                    if (resource.includes('/git/ref/heads/main'))
                        return Promise.resolve(
                            okRes({
                                object: { sha: CONTENTS_TEST_SHAS.baseSha }
                            })
                        )
                    if (
                        resource.includes(
                            `/git/commits/${CONTENTS_TEST_SHAS.baseSha}`
                        )
                    )
                        return Promise.resolve(okRes())
                    if (resource.includes('/git/ref/heads/edit-'))
                        return Promise.resolve(failRes(404))
                    if (
                        resource ===
                            `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}/git/refs` &&
                        opts?.method === 'POST'
                    )
                        return Promise.resolve(
                            failRes(422, 'reference already exists')
                        )
                    return Promise.resolve(failRes(500))
                }
            )

            await POST(
                makePostRequest(),
                makeContext(CONTENTS_TEST_PARAMS.pathParts)
            )

            expect(NextResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Failed to create branch on fork'
                }),
                expect.objectContaining({ status: 422 })
            )
        })
    })
})
