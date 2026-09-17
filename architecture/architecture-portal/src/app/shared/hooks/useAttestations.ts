import { API_ENDPOINTS } from '@/constants'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    AttestationSummary,
    CreateAttestationBody,
    EntityType,
    InitiativeAttestationDetail,
    ApplicationAttestationDetail
} from '../types/metamodel'
import { METAMODEL_INITIATIVE_QUERY_KEY } from './useMetamodelInitiative'
import { METAMODEL_APPLICATION_QUERY_KEY } from './useMetamodelApplication'
import { fetchWithToken } from '@/utils/client'

type AttestationDetail =
    | InitiativeAttestationDetail
    | ApplicationAttestationDetail

export const ATTESTATIONS_LIST_KEY = (
    entityType: EntityType,
    entityId: string
) => ['attestations_list', entityType, entityId]

export const ATTESTATION_DETAIL_KEY = (
    entityType: EntityType,
    entityId: string,
    attestationId: string
) => ['attestation_detail', entityType, entityId, attestationId]

function listUrl(entityType: EntityType, entityId: string): string {
    return entityType === 'initiative'
        ? API_ENDPOINTS.METAMODEL_LIST_INITIATIVE_ATTESTATIONS(entityId)
        : API_ENDPOINTS.METAMODEL_LIST_APPLICATION_ATTESTATIONS(entityId)
}

function detailUrl(
    entityType: EntityType,
    entityId: string,
    attestationId: string
): string {
    return entityType === 'initiative'
        ? API_ENDPOINTS.METAMODEL_GET_INITIATIVE_ATTESTATION(
              entityId,
              attestationId
          )
        : API_ENDPOINTS.METAMODEL_GET_APPLICATION_ATTESTATION(
              entityId,
              attestationId
          )
}

function createUrl(entityType: EntityType, entityId: string): string {
    return entityType === 'initiative'
        ? API_ENDPOINTS.METAMODEL_CREATE_INITIATIVE_ATTESTATION(entityId)
        : API_ENDPOINTS.METAMODEL_CREATE_APPLICATION_ATTESTATION(entityId)
}

export function useAttestationsList(
    entityType: EntityType,
    entityId: string,
    enabled = true
) {
    return useQuery<AttestationSummary[], Error>({
        queryKey: ATTESTATIONS_LIST_KEY(entityType, entityId),
        queryFn: async () => {
            const res = await fetchWithToken(listUrl(entityType, entityId))
            if (res.status === 404) return []
            if (!res.ok)
                throw new Error(
                    `Failed to fetch attestations: ${res.status} ${res.statusText}`
                )
            return res.json()
        },
        enabled: !!entityId && enabled
    })
}

export function useAttestationDetail(
    entityType: EntityType,
    entityId: string,
    attestationId: string,
    enabled = true
) {
    return useQuery<AttestationDetail, Error>({
        queryKey: ATTESTATION_DETAIL_KEY(entityType, entityId, attestationId),
        queryFn: async () => {
            const res = await fetchWithToken(
                detailUrl(entityType, entityId, attestationId)
            )
            if (!res.ok)
                throw new Error(
                    `Failed to fetch attestation detail: ${res.status} ${res.statusText}`
                )
            return res.json()
        },
        enabled: !!entityId && !!attestationId && enabled
    })
}

export interface RequestAttestationEmailBody {
    entityType: EntityType
    entityId: string
    entityName: string
    requesterName?: string
    requesterEmail: string
    recipientEmail: string
    recipientName?: string
    recipientRole?: string
    changedFields?: string[]
}

export function useRequestAttestationEmail() {
    return useMutation<unknown, Error, RequestAttestationEmailBody>({
        mutationFn: async (body: RequestAttestationEmailBody) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.POST_ATTESTATION_REQUEST_EMAIL,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                }
            )
            if (!res.ok)
                throw new Error(
                    `Failed to send attestation request email: ${res.status} ${res.statusText}`
                )
            return res.json()
        }
    })
}

export function useCreateAttestation(entityType: EntityType, entityId: string) {
    const queryClient = useQueryClient()
    return useMutation<AttestationDetail, Error, CreateAttestationBody>({
        mutationFn: async (body: CreateAttestationBody) => {
            const res = await fetchWithToken(createUrl(entityType, entityId), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            if (!res.ok)
                throw new Error(
                    `Failed to create attestation: ${res.status} ${res.statusText}`
                )
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ATTESTATIONS_LIST_KEY(entityType, entityId)
            })
            const entityKey =
                entityType === 'initiative'
                    ? METAMODEL_INITIATIVE_QUERY_KEY(entityId)
                    : METAMODEL_APPLICATION_QUERY_KEY(entityId)
            queryClient.invalidateQueries({ queryKey: entityKey })
        }
    })
}
