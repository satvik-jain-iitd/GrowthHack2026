/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

const USER_AVATAR_QUERY_KEY = (email: string) => ['user-avatar', email]

const fetchUserAvatar = async (email: string): Promise<string | null> => {
    if (!email) return null
    const endpoint = API_ENDPOINTS.GET_USER_ICON(email)
    const res = await fetchWithToken(endpoint)
    if (!res.ok) return null
    const blob = await res.blob()
    return URL.createObjectURL(blob)
}

export const useUserAvatar = (email: string) => {
    const {
        data: avatarUrl,
        isLoading,
        error
    } = useQuery<string | null>({
        queryKey: USER_AVATAR_QUERY_KEY(email),
        queryFn: () => fetchUserAvatar(email),
        enabled: !!email,
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24
    })

    return { avatarUrl, isLoading, error }
}
