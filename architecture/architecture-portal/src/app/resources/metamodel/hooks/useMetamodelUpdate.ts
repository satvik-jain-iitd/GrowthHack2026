import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUserContext } from '@/context'
import { fetchWithToken } from '@/utils/client'

export interface MetamodelUpdatePayload<TRow> {
    /** Id of the row being edited. */
    id: string
    /** Partial patch — only the changed field(s) need to be sent. */
    patch: Partial<TRow>
}

export interface MetamodelUpdateConfig<TRow extends { id: string }> {
    /** Query key of the list this mutation optimistically updates. */
    queryKey: readonly unknown[]
    /** Builds the PATCH url for a given row id. */
    endpoint: (id: string) => string
    /**
     * Maps a row patch into the request body the metamodel PATCH endpoint
     * expects (DTO field names differ from the grid's row shape).
     */
    buildBody: (patch: Partial<TRow>, userEmail: string) => unknown
}

/**
 * Generic optimistic-update mutation hook shared by the editable metamodel
 * grids (initiatives, applications).
 *
 * Flow mirrors the original initiatives hook:
 * 1. `onMutate`  — cancel in-flight refetches, snapshot cache, apply change
 * 2. `onError`   — roll back to the snapshot
 * 3. `onSettled` — invalidate so the cache re-syncs with the server
 */
export function useMetamodelUpdate<TRow extends { id: string }>(
    config: MetamodelUpdateConfig<TRow>
) {
    const queryClient = useQueryClient()
    const user = useUserContext()
    const userEmail = user?.attributes?.email || ''

    return useMutation({
        mutationFn: async ({ id, patch }: MetamodelUpdatePayload<TRow>) => {
            const res = await fetchWithToken(config.endpoint(id), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config.buildBody(patch, userEmail))
            })
            if (!res.ok) {
                throw new Error(
                    `Failed to update: ${res.status} ${res.statusText}`
                )
            }
        },

        onMutate: async ({ id, patch }: MetamodelUpdatePayload<TRow>) => {
            await queryClient.cancelQueries({ queryKey: config.queryKey })
            const previousData = queryClient.getQueryData<TRow[]>(
                config.queryKey
            )
            queryClient.setQueryData<TRow[]>(
                config.queryKey,
                old =>
                    old?.map(item =>
                        item.id === id ? { ...item, ...patch } : item
                    ) ?? []
            )
            return { previousData }
        },

        onError: (_err, _vars, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(config.queryKey, context.previousData)
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: config.queryKey })
        }
    })
}
