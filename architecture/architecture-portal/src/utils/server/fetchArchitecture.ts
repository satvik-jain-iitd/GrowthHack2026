/* istanbul ignore file */
import { fetchWithLogging } from './fetchWithLogging'
export async function fetchArchitecture(
    resource: string,
    request: RequestInit = {}
): Promise<Response> {
    return await fetchWithLogging(resource, {
        ...request,
        next: {
            revalidate: 60,
            ...(request.next || {})
        }
    })
}
