/* istanbul ignore file */
import { SOURCE_HOST_CONFIG, SourceHost } from '@/constants'
import { selectToken, updateToken } from './githubTokenPool'
import { fetchWithLogging } from './fetchWithLogging'

export async function fetchGithub(
    host: SourceHost,
    resource: string,
    request: RequestInit = {}
): Promise<Response> {
    let tokenName: string | undefined
    const headers = new Headers(request.headers || {})

    // Pick the token from the in-memory pool
    if (!headers.has('Authorization')) {
        const { name, token } = selectToken(host)
        headers.set('Authorization', `Bearer ${token}`)
        tokenName = name
    }

    const apiBase = SOURCE_HOST_CONFIG[host].apiUrl
    const url = `${apiBase}${resource}`
    const response = await fetchWithLogging(url, {
        ...request,
        next: {
            revalidate: 60,
            ...(request.next || {})
        },
        headers
    })

    // Update token state from headers
    if (tokenName) updateToken(host, tokenName, response.headers)

    return response
}
