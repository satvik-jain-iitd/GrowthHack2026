import { ARCHITECTURE_API_URL, METAMODEL_API_URL } from '@/constants'
import { fetchIdaasToken, Logger } from '@/utils/server'
import { fetchWithToken } from './fetchWithToken'

jest.mock('@/utils/server', () => ({
    fetchIdaasToken: jest.fn(),
    Logger: { error: jest.fn() }
}))

const mockToken = fetchIdaasToken as jest.Mock
const mockLoggerError = Logger.error as jest.Mock

describe('server fetchWithToken', () => {
    const globalFetch = jest.fn()

    beforeEach(() => {
        jest.resetAllMocks()
        global.fetch = globalFetch as unknown as typeof fetch
        globalFetch.mockResolvedValue({ ok: true })
        mockToken.mockResolvedValue('idaas-token')
    })

    const headersOfLastCall = () =>
        new Headers(globalFetch.mock.calls[0][1].headers)

    // Regression guard: server components call the architecture api directly
    // rather than through /api/proxy, so the bearer token has to be attached
    // here or every SSR request is rejected by the authz sidecar.
    it('attaches a bearer token to architecture api calls', async () => {
        await fetchWithToken(`${ARCHITECTURE_API_URL}/arch-api/v2/capabilities`)

        expect(globalFetch).toHaveBeenCalledWith(
            `${ARCHITECTURE_API_URL}/arch-api/v2/capabilities`,
            expect.anything()
        )
        expect(headersOfLastCall().get('Authorization')).toBe(
            'Bearer idaas-token'
        )
    })

    it('preserves caller-supplied headers alongside the token', async () => {
        await fetchWithToken(
            `${ARCHITECTURE_API_URL}/arch-api/v2/capabilities`,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        )

        const headers = headersOfLastCall()
        expect(headers.get('Content-Type')).toBe('application/json')
        expect(headers.get('Authorization')).toBe('Bearer idaas-token')
    })

    it('does not tokenise non-architecture urls', async () => {
        const url = `${METAMODEL_API_URL}/api/v1/initiatives`

        await fetchWithToken(url)

        expect(mockToken).not.toHaveBeenCalled()
        expect(globalFetch).toHaveBeenCalledWith(url, undefined)
    })

    it('logs and still issues the request when the token lookup fails', async () => {
        mockToken.mockRejectedValue(new Error('idaas down'))

        await fetchWithToken(`${ARCHITECTURE_API_URL}/arch-api/v2/capabilities`)

        expect(mockLoggerError).toHaveBeenCalled()
        expect(globalFetch).toHaveBeenCalled()
        expect(headersOfLastCall().get('Authorization')).toBeNull()
    })
})
