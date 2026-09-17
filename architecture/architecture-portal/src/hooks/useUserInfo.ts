/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export interface UserInfo {
    userId: string
    displayName: string
    jobTitle: string
    userPrincipalName: string
}

const USER_INFO_QUERY_KEY = (email: string) => ['user-info', email]

const fetchUserInfo = async (email: string): Promise<UserInfo | null> => {
    if (!email) return null
    const res = await fetchWithToken(API_ENDPOINTS.GET_USER_INFO(email))
    if (!res.ok) return null
    return res.json()
}

export const useUserInfo = (email: string) => {
    const {
        data: userInfo,
        isLoading,
        error
    } = useQuery<UserInfo | null>({
        queryKey: USER_INFO_QUERY_KEY(email),
        queryFn: () => fetchUserInfo(email),
        enabled: !!email,
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24
    })

    return { userInfo, isLoading, error }
}
