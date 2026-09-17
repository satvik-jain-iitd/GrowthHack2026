import {
    ARCHITECTURE_API_URL
    // ARCHITECTURE_INTELLIGENCE_API_URL
    // METAMODEL_API_URL
} from '@/constants'

export async function fetchWithToken(
    resource: string | URL,
    requestInit?: RequestInit
): Promise<Response> {
    let url: string | URL = resource.toString()

    const isArchApi = url.startsWith(ARCHITECTURE_API_URL)

    if (typeof window !== 'undefined' && isArchApi) {
        url = url.replace(ARCHITECTURE_API_URL, '/api/proxy')
    }

    // Disabling gen-ai auth as requested
    // const isGenAi = url.startsWith(ARCHITECTURE_INTELLIGENCE_API_URL)
    // if (typeof window !== 'undefined' && isGenAi) {
    //     url = url.replace(ARCHITECTURE_INTELLIGENCE_API_URL, '/api/genai/proxy')
    // }

    // TODO HS - Add metamodel to go through proxy
    // const isMetamodelApi = url.startsWith(METAMODEL_API_URL)
    // if (typeof window !== 'undefined' && isMetamodelApi) {
    //     url = url.replace(METAMODEL_API_URL, '/api/metamodel/proxy')
    // }

    return fetch(url, requestInit)
}
