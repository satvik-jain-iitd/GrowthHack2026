import { ARCHITECTURE_API_URL, METAMODEL_API_URL } from '@/constants'
import { fetchWithToken } from './fetchWithToken'

describe('fetchWithToken', () => {
    const globalFetch = jest.fn()

    beforeEach(() => {
        jest.resetAllMocks()
        global.fetch = globalFetch as unknown as typeof fetch
        globalFetch.mockResolvedValue({ ok: true })
    })

    it('rewrites architecture api calls to the proxy without tokenising', async () => {
        await fetchWithToken(`${ARCHITECTURE_API_URL}/arch-api/v1/adrs`)

        expect(globalFetch).toHaveBeenCalledWith(
            '/api/proxy/arch-api/v1/adrs',
            undefined
        )
    })

    it('forwards request init to the proxied call untouched', async () => {
        const init = { method: 'POST', body: '{}' }

        await fetchWithToken(`${ARCHITECTURE_API_URL}/arch-api/v1/adrs`, init)

        expect(globalFetch).toHaveBeenCalledWith(
            '/api/proxy/arch-api/v1/adrs',
            init
        )
    })

    // Metamodel traffic is deliberately unproxied and untokenised for now — see
    // the TODO in fetchWithToken. Flip this back when it moves behind the proxy.
    it('leaves metamodel api calls untouched', async () => {
        const url = `${METAMODEL_API_URL}/api/v1/initiatives?page=1&pageSize=100`

        await fetchWithToken(url)

        expect(globalFetch).toHaveBeenCalledWith(url, undefined)
    })

    it('leaves unrelated urls untouched', async () => {
        await fetchWithToken('/api/search')

        expect(globalFetch).toHaveBeenCalledWith('/api/search', undefined)
    })
})
