import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants'
import {
    fetchAllMetamodelPages,
    fetchMetamodelDetailsByIds
} from './useMetamodelList'

/**
 * Some metamodel detail endpoints expose linkages as bare id arrays rather than
 * `{ id, name }` references (e.g. an ADR's linked initiatives/applications, a
 * BvB's linked initiatives/applications/ADRs). These helpers resolve those ids
 * to human-readable names so popovers can render names instead of raw ids.
 *
 * Initiatives and applications are resolved through their get-by-ids detail
 * endpoints (which carry the name). ADRs are resolved through the list endpoint
 * because the ADR detail DTO has no name field.
 */

// architecture-metamodel caps get-by-ids at 5 ids per request for these datasets.
const INITIATIVES_BY_IDS_BATCH_SIZE = 5
const APPLICATIONS_BY_IDS_BATCH_SIZE = 5
const BUSINESS_CAPABILITIES_BY_IDS_BATCH_SIZE = 5
const TECHNICAL_CAPABILITIES_BY_IDS_BATCH_SIZE = 5
const FOUNDATIONAL_TECHNOLOGIES_BY_IDS_BATCH_SIZE = 5

interface InitiativeNameDto {
    initiativeId: string
    initiativeName: string
}

interface ApplicationNameDto {
    applicationId: string
    applicationName: string
}

interface AdrNameDto {
    id: string
    name: string
}

interface BusinessCapabilityNameDto {
    businessCapabilityId: string
    name: string
}

interface TechnicalCapabilityNameDto {
    technicalCapabilityId: string
    name: string
}

interface FoundationalTechnologyNameDto {
    foundationalTechnologyId: string
    name: string
}

async function resolveInitiativeNames(
    ids: string[]
): Promise<Record<string, string>> {
    const details = await fetchMetamodelDetailsByIds<InitiativeNameDto>(
        API_ENDPOINTS.METAMODEL_GET_INITIATIVES_BY_IDS,
        ids,
        INITIATIVES_BY_IDS_BATCH_SIZE
    )
    const map: Record<string, string> = {}
    for (const detail of details) {
        map[detail.initiativeId] = detail.initiativeName
    }
    return map
}

async function resolveApplicationNames(
    ids: string[]
): Promise<Record<string, string>> {
    const details = await fetchMetamodelDetailsByIds<ApplicationNameDto>(
        API_ENDPOINTS.METAMODEL_GET_APPLICATIONS_BY_IDS,
        ids,
        APPLICATIONS_BY_IDS_BATCH_SIZE
    )
    const map: Record<string, string> = {}
    for (const detail of details) {
        map[detail.applicationId] = detail.applicationName
    }
    return map
}

async function resolveAdrNames(): Promise<Record<string, string>> {
    const list = await fetchAllMetamodelPages<AdrNameDto>(
        API_ENDPOINTS.METAMODEL_LIST_ADRS
    )
    const map: Record<string, string> = {}
    for (const item of list) {
        map[item.id] = item.name
    }
    return map
}

async function resolveBusinessCapabilityNames(
    ids: string[]
): Promise<Record<string, string>> {
    const details = await fetchMetamodelDetailsByIds<BusinessCapabilityNameDto>(
        API_ENDPOINTS.METAMODEL_GET_BUSINESS_CAPABILITIES_BY_IDS,
        ids,
        BUSINESS_CAPABILITIES_BY_IDS_BATCH_SIZE
    )
    const map: Record<string, string> = {}
    for (const detail of details) {
        map[detail.businessCapabilityId] = detail.name
    }
    return map
}

async function resolveTechnicalCapabilityNames(
    ids: string[]
): Promise<Record<string, string>> {
    const details =
        await fetchMetamodelDetailsByIds<TechnicalCapabilityNameDto>(
            API_ENDPOINTS.METAMODEL_GET_TECHNICAL_CAPABILITIES_BY_IDS,
            ids,
            TECHNICAL_CAPABILITIES_BY_IDS_BATCH_SIZE
        )
    const map: Record<string, string> = {}
    for (const detail of details) {
        map[detail.technicalCapabilityId] = detail.name
    }
    return map
}

async function resolveFoundationalTechnologyNames(
    ids: string[]
): Promise<Record<string, string>> {
    const details =
        await fetchMetamodelDetailsByIds<FoundationalTechnologyNameDto>(
            API_ENDPOINTS.METAMODEL_GET_FOUNDATIONAL_TECHNOLOGIES_BY_IDS,
            ids,
            FOUNDATIONAL_TECHNOLOGIES_BY_IDS_BATCH_SIZE
        )
    const map: Record<string, string> = {}
    for (const detail of details) {
        map[detail.foundationalTechnologyId] = detail.name
    }
    return map
}

/** Sorted, de-duplicated ids so the query key is stable across renders. */
function stableIds(ids: string[]): string[] {
    return Array.from(new Set(ids.filter(Boolean))).sort()
}

export interface LinkedNameKinds {
    initiativeIds?: string[]
    applicationIds?: string[]
    businessCapabilityIds?: string[]
    technicalCapabilityIds?: string[]
    foundationalTechnologyIds?: string[]
    /** When true, the full ADR id→name map is loaded (ids need not be listed). */
    resolveAdrs?: boolean
}

export interface LinkedNames {
    /** Maps an id to its resolved name, or the id itself if unresolved. */
    initiativeName: (id: string) => string
    applicationName: (id: string) => string
    adrName: (id: string) => string
    businessCapabilityName: (id: string) => string
    technicalCapabilityName: (id: string) => string
    foundationalTechnologyName: (id: string) => string
    loading: boolean
}

/**
 * Resolves linked initiative/application/ADR ids to names, caching each dataset
 * in React Query. Unknown ids fall back to the id string so popovers still show
 * something meaningful while names load or if a lookup misses.
 */
export function useLinkedNames({
    initiativeIds = [],
    applicationIds = [],
    businessCapabilityIds = [],
    technicalCapabilityIds = [],
    foundationalTechnologyIds = [],
    resolveAdrs = false
}: LinkedNameKinds): LinkedNames {
    const initIds = useMemo(() => stableIds(initiativeIds), [initiativeIds])
    const appIds = useMemo(() => stableIds(applicationIds), [applicationIds])
    const bizCapIds = useMemo(
        () => stableIds(businessCapabilityIds),
        [businessCapabilityIds]
    )
    const techCapIds = useMemo(
        () => stableIds(technicalCapabilityIds),
        [technicalCapabilityIds]
    )
    const foundTechIds = useMemo(
        () => stableIds(foundationalTechnologyIds),
        [foundationalTechnologyIds]
    )

    const initiativeQuery = useQuery<Record<string, string>>({
        queryKey: ['metamodel', 'resolve', 'initiative-names', initIds],
        queryFn: () => resolveInitiativeNames(initIds),
        enabled: initIds.length > 0
    })

    const applicationQuery = useQuery<Record<string, string>>({
        queryKey: ['metamodel', 'resolve', 'application-names', appIds],
        queryFn: () => resolveApplicationNames(appIds),
        enabled: appIds.length > 0
    })

    const adrQuery = useQuery<Record<string, string>>({
        queryKey: ['metamodel', 'resolve', 'adr-names'],
        queryFn: resolveAdrNames,
        enabled: resolveAdrs
    })

    const businessCapabilityQuery = useQuery<Record<string, string>>({
        queryKey: [
            'metamodel',
            'resolve',
            'business-capability-names',
            bizCapIds
        ],
        queryFn: () => resolveBusinessCapabilityNames(bizCapIds),
        enabled: bizCapIds.length > 0
    })

    const technicalCapabilityQuery = useQuery<Record<string, string>>({
        queryKey: [
            'metamodel',
            'resolve',
            'technical-capability-names',
            techCapIds
        ],
        queryFn: () => resolveTechnicalCapabilityNames(techCapIds),
        enabled: techCapIds.length > 0
    })

    const foundationalTechnologyQuery = useQuery<Record<string, string>>({
        queryKey: [
            'metamodel',
            'resolve',
            'foundational-technology-names',
            foundTechIds
        ],
        queryFn: () => resolveFoundationalTechnologyNames(foundTechIds),
        enabled: foundTechIds.length > 0
    })

    return useMemo(() => {
        const initMap = initiativeQuery.data ?? {}
        const appMap = applicationQuery.data ?? {}
        const adrMap = adrQuery.data ?? {}
        const bizCapMap = businessCapabilityQuery.data ?? {}
        const techCapMap = technicalCapabilityQuery.data ?? {}
        const foundTechMap = foundationalTechnologyQuery.data ?? {}
        return {
            initiativeName: (id: string) => initMap[id] ?? id,
            applicationName: (id: string) => appMap[id] ?? id,
            adrName: (id: string) => adrMap[id] ?? id,
            businessCapabilityName: (id: string) => bizCapMap[id] ?? id,
            technicalCapabilityName: (id: string) => techCapMap[id] ?? id,
            foundationalTechnologyName: (id: string) => foundTechMap[id] ?? id,
            loading:
                initiativeQuery.isLoading ||
                applicationQuery.isLoading ||
                adrQuery.isLoading ||
                businessCapabilityQuery.isLoading ||
                technicalCapabilityQuery.isLoading ||
                foundationalTechnologyQuery.isLoading
        }
    }, [
        initiativeQuery.data,
        applicationQuery.data,
        adrQuery.data,
        businessCapabilityQuery.data,
        technicalCapabilityQuery.data,
        foundationalTechnologyQuery.data,
        initiativeQuery.isLoading,
        applicationQuery.isLoading,
        adrQuery.isLoading,
        businessCapabilityQuery.isLoading,
        technicalCapabilityQuery.isLoading,
        foundationalTechnologyQuery.isLoading
    ])
}
