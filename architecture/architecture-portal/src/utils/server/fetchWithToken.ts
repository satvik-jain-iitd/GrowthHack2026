import {
    ARCHITECTURE_API_URL
    // ARCHITECTURE_INTELLIGENCE_API_URL
} from '@/constants'
import { fetchIdaasToken, Logger } from '@/utils/server'

export async function fetchWithToken(
    resource: string | URL,
    requestInit?: RequestInit
): Promise<Response> {
    const url: string | URL = resource.toString()

    // const isGenAi = url.startsWith(ARCHITECTURE_INTELLIGENCE_API_URL)
    const isGenAi = false // disabling gen-ai auth for the time being
    const isArchApi = url.startsWith(ARCHITECTURE_API_URL)

    // TODO HS - Add metamodel to go through proxy
    // architecture api and not proxy
    if (isArchApi || isGenAi) {
        const headers = new Headers(requestInit?.headers ?? {})
        try {
            const token = await fetchIdaasToken({ isGenAi })
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
        } catch (error) {
            Logger.error('fetchWithToken: failed to fetch IDAAS token', {
                'url.full': url,
                'idaas.audience': isGenAi ? 'genai' : 'architecture',
                'error.message': String(error)
            })
        }

        requestInit = {
            ...requestInit,
            headers
        }
    }

    return fetch(url, requestInit)
}
