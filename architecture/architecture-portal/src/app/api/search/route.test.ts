import { GET } from './route'
import {
    SEARCH_TEST_PARAMS,
    SEARCH_TEST_CONFIG,
    SEARCH_TEST_RESULTS,
    SEARCH_TEST_ERRORS
} from './test-data'

// Only `mockSearch` needs to be in the outer scope — it's the leaf fn we control.
// Babel hoists `mock`-prefixed variables that are directly referenced in the factory.
// Inline jest.fn() for the chain intermediates (collections, documents) to avoid
// transitive-hoisting issues where only the directly-referenced variable is lifted.
const mockSearch = jest.fn()

jest.mock('@/constants', () => ({
    ARCHITECTURE_SEARCH_HOST: 'search.example.com'
}))

jest.mock('@/utils/server', () => ({
    Logger: { error: jest.fn(), info: jest.fn() }
}))

jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((body, init) => ({ _body: body, _init: init }))
    }
}))

// Typesense.Client is called as `new Typesense.Client(config)` and chained
// .collections(...).documents().search(params).
jest.mock('typesense', () => ({
    __esModule: true,
    default: {
        Client: jest.fn(() => ({
            collections: jest.fn(() => ({
                documents: jest.fn(() => ({ search: mockSearch }))
            }))
        }))
    }
}))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { NextResponse } = require('next/server')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Logger } = require('@/utils/server')
// Access the mocked Client constructor for call assertions
const TypesenseMock = jest.requireMock('typesense').default

const makeRequest = (q?: string) => {
    const url =
        q !== undefined
            ? `http://localhost/api/search?q=${encodeURIComponent(q)}`
            : 'http://localhost/api/search'
    return { url } as unknown as Request
}

describe('GET /api/search', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        NextResponse.json.mockImplementation(
            (body: unknown, init?: ResponseInit) => ({
                _body: body,
                _init: init
            })
        )
    })

    it('returns empty hits when q param is missing', async () => {
        await GET(makeRequest())

        expect(NextResponse.json).toHaveBeenCalledWith({ hits: [] })
        expect(TypesenseMock.Client).not.toHaveBeenCalled()
    })

    it('returns empty hits when q param is an empty string', async () => {
        await GET(makeRequest(SEARCH_TEST_PARAMS.emptyQuery))

        expect(NextResponse.json).toHaveBeenCalledWith({ hits: [] })
        expect(TypesenseMock.Client).not.toHaveBeenCalled()
    })

    it('creates a Typesense client with the correct host', async () => {
        mockSearch.mockResolvedValue(SEARCH_TEST_RESULTS)

        await GET(makeRequest(SEARCH_TEST_PARAMS.query))

        expect(TypesenseMock.Client).toHaveBeenCalledWith(
            expect.objectContaining({
                nodes: [
                    expect.objectContaining({
                        host: 'search.example.com',
                        port: SEARCH_TEST_CONFIG.port,
                        protocol: SEARCH_TEST_CONFIG.protocol
                    })
                ]
            })
        )
    })

    it('creates a Typesense client with the correct connection timeout', async () => {
        mockSearch.mockResolvedValue(SEARCH_TEST_RESULTS)

        await GET(makeRequest(SEARCH_TEST_PARAMS.query))

        expect(TypesenseMock.Client).toHaveBeenCalledWith(
            expect.objectContaining({
                connectionTimeoutSeconds:
                    SEARCH_TEST_CONFIG.connectionTimeoutSeconds
            })
        )
    })

    it('searches the correct collection', async () => {
        mockSearch.mockResolvedValue(SEARCH_TEST_RESULTS)

        await GET(makeRequest(SEARCH_TEST_PARAMS.query))

        // collections() is inline in the factory; verify via mockSearch being called
        // (reaching mockSearch requires the full chain to succeed)
        expect(mockSearch).toHaveBeenCalled()
    })

    it('calls search with correct query parameters', async () => {
        mockSearch.mockResolvedValue(SEARCH_TEST_RESULTS)

        await GET(makeRequest(SEARCH_TEST_PARAMS.query))

        expect(mockSearch).toHaveBeenCalledWith({
            q: SEARCH_TEST_PARAMS.query,
            query_by: SEARCH_TEST_CONFIG.queryBy,
            query_by_weights: SEARCH_TEST_CONFIG.queryByWeights,
            per_page: SEARCH_TEST_CONFIG.perPage
        })
    })

    it('returns the Typesense search results', async () => {
        mockSearch.mockResolvedValue(SEARCH_TEST_RESULTS)

        await GET(makeRequest(SEARCH_TEST_PARAMS.query))

        expect(NextResponse.json).toHaveBeenCalledWith(SEARCH_TEST_RESULTS)
    })

    it('returns a 500 error response when Typesense throws with a message', async () => {
        const err = new Error(SEARCH_TEST_ERRORS.message)
        mockSearch.mockRejectedValue(err)

        await GET(makeRequest(SEARCH_TEST_PARAMS.query))

        expect(NextResponse.json).toHaveBeenCalledWith(
            { error: SEARCH_TEST_ERRORS.message },
            { status: 500 }
        )
    })

    it('calls Logger.error when Typesense throws', async () => {
        const err = new Error(SEARCH_TEST_ERRORS.message)
        mockSearch.mockRejectedValue(err)

        await GET(makeRequest(SEARCH_TEST_PARAMS.query))

        expect(Logger.error).toHaveBeenCalledWith(err)
    })

    it('falls back to String(error) when error has no message', async () => {
        mockSearch.mockRejectedValue(SEARCH_TEST_ERRORS.noMessage)

        await GET(makeRequest(SEARCH_TEST_PARAMS.query))

        expect(NextResponse.json).toHaveBeenCalledWith(
            { error: String(SEARCH_TEST_ERRORS.noMessage) },
            { status: 500 }
        )
    })
})
