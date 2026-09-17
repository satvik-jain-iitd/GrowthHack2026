/* istanbul ignore file */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'
import { useUserContext } from '@/context'
import { PilotGroup } from '@/types/PilotGroup'
import { AuditLogEntry } from '@/types/AuditLog'
import { PILOT_GROUP_QUERY_KEY } from './usePilotGroup'

const PILOT_GROUPS_QUERY_KEY = ['pilot-groups']

const fetchPilotGroups = async (): Promise<PilotGroup[]> => {
    const res = await fetchWithToken(API_ENDPOINTS.GET_PILOT_GROUPS)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch pilot groups: ${res.status} ${res.statusText}`
        )
    }
    const { data } = await res.json()
    return (data ?? []) as PilotGroup[]
}

export const usePilotGroups = () => {
    return useQuery<PilotGroup[]>({
        queryKey: PILOT_GROUPS_QUERY_KEY,
        queryFn: fetchPilotGroups
    })
}

export const useCreatePilotGroup = () => {
    const queryClient = useQueryClient()
    const user = useUserContext()
    const emailId = user?.attributes?.email

    return useMutation({
        mutationFn: async ({ groupName }: { groupName: string }) => {
            const res = await fetchWithToken(API_ENDPOINTS.POST_PILOT_GROUP, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailId, groupName })
            })
            if (!res.ok) {
                throw new Error(`Failed to create pilot group "${groupName}"`)
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PILOT_GROUPS_QUERY_KEY })
        }
    })
}

export const useDeletePilotGroup = () => {
    const queryClient = useQueryClient()
    const user = useUserContext()
    const emailId = user?.attributes?.email

    return useMutation({
        mutationFn: async ({ groupId }: { groupId: string }) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.DELETE_PILOT_GROUP(groupId),
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ emailId })
                }
            )
            if (!res.ok) {
                throw new Error(`Failed to delete pilot group "${groupId}"`)
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PILOT_GROUPS_QUERY_KEY })
        }
    })
}

export const useAddPilotGroupMembers = () => {
    const queryClient = useQueryClient()
    const user = useUserContext()
    const emailId = user?.attributes?.email

    return useMutation({
        mutationFn: async ({
            groupId,
            memberEmails
        }: {
            groupId: string
            memberEmails: string[]
        }) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.POST_PILOT_GROUP_MEMBERS(groupId),
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ emailId, memberEmails })
                }
            )
            if (!res.ok) {
                throw new Error(
                    `Failed to add members to pilot group "${groupId}"`
                )
            }
            return res.json()
        },
        onSuccess: (_data, { groupId }) => {
            queryClient.invalidateQueries({ queryKey: PILOT_GROUPS_QUERY_KEY })
            queryClient.invalidateQueries({
                queryKey: PILOT_GROUP_QUERY_KEY(groupId)
            })
        }
    })
}

export const useRemovePilotGroupMembers = () => {
    const queryClient = useQueryClient()
    const user = useUserContext()
    const emailId = user?.attributes?.email

    return useMutation({
        mutationFn: async ({
            groupId,
            memberEmails
        }: {
            groupId: string
            memberEmails: string[]
        }) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.DELETE_PILOT_GROUP_MEMBERS(groupId),
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ emailId, memberEmails })
                }
            )
            if (!res.ok) {
                throw new Error(
                    `Failed to remove members from pilot group "${groupId}"`
                )
            }
            return res.json()
        },
        onSuccess: (_data, { groupId }) => {
            queryClient.invalidateQueries({ queryKey: PILOT_GROUPS_QUERY_KEY })
            queryClient.invalidateQueries({
                queryKey: PILOT_GROUP_QUERY_KEY(groupId)
            })
        }
    })
}

const fetchPilotGroupAuditLogs = async (
    groupId: string
): Promise<AuditLogEntry[]> => {
    const res = await fetchWithToken(
        API_ENDPOINTS.GET_PILOT_GROUP_AUDIT_LOGS(groupId)
    )
    if (!res.ok) {
        throw new Error(
            `Failed to fetch audit logs for pilot group "${groupId}"`
        )
    }
    const { data } = await res.json()
    return (data ?? []) as AuditLogEntry[]
}

export const usePilotGroupAuditLogs = (groupId: string) => {
    return useQuery<AuditLogEntry[]>({
        queryKey: ['pilot-group-audit-logs', groupId],
        queryFn: () => fetchPilotGroupAuditLogs(groupId),
        enabled: !!groupId
    })
}
