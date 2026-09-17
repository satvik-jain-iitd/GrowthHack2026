/* istanbul ignore file */
import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { fetchWithToken } from '@/utils/client'

export const useMetadataTags = () => {
    const queryClient = useQueryClient()

    const fetchMetadataTagsPOST = useCallback(
        async (payload: Record<string, unknown> = {}): Promise<unknown> => {
            const host = API_ENDPOINTS.POST_METADATA_TAGS

            const response = await fetchWithToken(host, {
                method: 'POST',
                body: JSON.stringify(payload),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const { data } = await response.json()
            // Filter out objects with tag_category_nm === 'Business Capabilities'
            if (Array.isArray(data)) {
                return data.filter(
                    (obj: {
                        tag_category_id: string
                        tag_category_nm: string
                    }) => obj.tag_category_nm !== 'Business Capabilities'
                )
            } else {
                return data
            }
        },
        []
    )

    // Keep imperative fetching for GET operations (used in useEffect/conditional logic)
    const fetchMetadataTagsGET = useCallback(
        async (payload: string | number): Promise<unknown> => {
            const host = API_ENDPOINTS.GET_METADATA_TAGS(payload)
            const response = await fetchWithToken(host, {
                method: 'GET',
                credentials: 'include'
            })
            const { data } = await response.json()
            return data
        },

        []
    )

    const checkUserRole = useCallback(
        async (payload: Record<string, unknown> = {}): Promise<unknown> => {
            const host = API_ENDPOINTS.FETCH_USER_ROLES
            const response = await fetchWithToken(host, {
                method: 'POST',
                body: JSON.stringify(payload),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const { data } = await response.json()
            return data
        },
        []
    )

    const fetchMetadataFile = useCallback(
        async (fileId: string): Promise<unknown> => {
            const host = API_ENDPOINTS.GET_METADATA_FILE(fileId)
            const response = await fetchWithToken(host, {
                method: 'GET',
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Failed to fetch metadata file')
            }

            const { data } = await response.json()
            return data
        },
        []
    )
    // Convert POST operations to mutations
    const saveMetadataTagsMutation = useMutation({
        mutationFn: async ({
            fileId,
            payload
        }: {
            fileId: string
            payload: Record<string, unknown>
        }) => {
            const host = API_ENDPOINTS.GET_PLAYBOOK_FILE_BY_ID(fileId)
            const response = await fetchWithToken(host, {
                method: 'POST',
                body: JSON.stringify(payload),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!response.ok) {
                throw new Error('Failed to save metadata tags')
            }

            const { data } = await response.json()
            return data
        },
        onSuccess: () => {
            // Invalidate relevant queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['metadata'] })
        }
    })

    const setValidTagCategoriesMutation = useMutation({
        mutationFn: async ({
            payload
        }: {
            payload: Record<string, unknown>
        }) => {
            const host = API_ENDPOINTS.SAVE_METADATA_ARTIFACT_CATEGORY
            const response = await fetchWithToken(host, {
                method: 'POST',
                body: JSON.stringify(payload),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!response.ok) {
                throw new Error('Failed to set valid tag categories')
            }

            const { data } = await response.json()
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['metadata'] })
        }
    })

    // Wrapper functions to maintain backwards compatibility
    const saveMetadataTags = useCallback(
        async (fileId: string, payload: Record<string, unknown>) => {
            return saveMetadataTagsMutation.mutateAsync({ fileId, payload })
        },
        [saveMetadataTagsMutation]
    )

    const setValidTagCategories = useCallback(
        async (payload: Record<string, unknown>) => {
            return setValidTagCategoriesMutation.mutateAsync({ payload })
        },
        [setValidTagCategoriesMutation]
    )

    return {
        fetchMetadataTagsPOST,
        fetchMetadataTagsGET,
        saveMetadataTags,
        setValidTagCategories,
        checkUserRole,
        fetchMetadataFile,
        // Expose mutation states for UI feedback
        isSaving:
            saveMetadataTagsMutation.isPending ||
            setValidTagCategoriesMutation.isPending,
        saveError:
            saveMetadataTagsMutation.error ||
            setValidTagCategoriesMutation.error
    }
}
