/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS, SOURCE_HOST, SourceHost } from '@/constants'
import { EtpTitle, GraphAPIUser, Option } from '@/app/onboarding-form/types'
import { Playbook } from '@/types/Playbook'
import {
    BVB_PLAYBOOKS_QUERY_KEY,
    fetchBvBPlaybooks
} from '@/app/resources/bvb-tracker/hooks/useGetBvBPlaybooks'
import { fetchWithToken } from '@/utils/client'

function useApiQuery<T>(key: unknown[], url: string, enabled: boolean = true) {
    return useQuery<T, Error>({
        queryKey: key,
        queryFn: async () => {
            const res = await fetchWithToken(url)
            if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
            const data = await res.json()
            // If data has a 'value' field, return it (for GraphAPIResponse)
            if (
                data &&
                typeof data === 'object' &&
                'value' in data &&
                Array.isArray(data.value)
            ) {
                return data.value as T
            }
            return data ?? null
        },
        enabled
    })
}

export function useEaLeadsList() {
    return useApiQuery<string[]>(['eaLeads'], API_ENDPOINTS.GET_EA_LEADS)
}

export function useBusinessUnitList() {
    return useApiQuery<Option[]>(
        ['businessUnits'],
        API_ENDPOINTS.GET_BUSINESS_UNITS
    )
}

export function useEtpList() {
    return useApiQuery<EtpTitle[]>(['etpTitles'], API_ENDPOINTS.GET_ETP_TITLES)
}

export function useInitiativeCategoriesList() {
    return useApiQuery<Option[]>(
        ['initiativeCategories'],
        API_ENDPOINTS.GET_INITIATIVE_CATEGORIES
    )
}

export function useUnitCioList(email: string) {
    return useApiQuery<GraphAPIUser[]>(
        ['unitCios', email],
        API_ENDPOINTS.GET_UNIT_CIOS_BY_EMAIL(email),
        !!email
    )
}

export function useEmployeesByEmail(email: string) {
    return useApiQuery<GraphAPIUser[]>(
        ['employees', email],
        API_ENDPOINTS.GET_EMPLOYEES_BY_EMAIL(email),
        !!email
    )
}

export function useEmployeesAndContractorsByEmail(email: string) {
    return useApiQuery<GraphAPIUser[]>(
        ['employeesAndContractors', email],
        API_ENDPOINTS.GET_EMPLOYEES_AND_CONTRACTORS_BY_EMAIL(email),
        !!email
    )
}

export function useFoundationalTechnologyCategories() {
    return useApiQuery<string[]>(
        ['foundationalTechnologyCategories'],
        API_ENDPOINTS.GET_FOUNDATIONAL_TECHNOLOGY_CATEGORIES
    )
}

export function useFrameworkCategories() {
    return useApiQuery<Option[]>(
        ['frameworkCategories'],
        API_ENDPOINTS.GET_FRAMEWORK_CATEGORIES
    )
}

export function useRepoExists(
    owner: string,
    repo: string | undefined,
    path?: string,
    preferredHost?: SourceHost
) {
    return useQuery<{ status: number; sourceHost: SourceHost }, Error>({
        queryKey: ['repoContents', owner, repo, path, preferredHost],
        queryFn: async () => {
            const buildUrl = (host: SourceHost) => {
                let url = `/api/v3/repos/${owner}/${repo}/contents`
                if (path) url += `/${path}`
                url += `?host=${host}`
                return url
            }

            const hostsToTry: SourceHost[] = preferredHost
                ? [
                      preferredHost,
                      preferredHost === SOURCE_HOST.GHC
                          ? SOURCE_HOST.GHE
                          : SOURCE_HOST.GHC
                  ]
                : [SOURCE_HOST.GHC, SOURCE_HOST.GHE]

            let fallbackResult: {
                status: number
                sourceHost: SourceHost
            } | null = null

            for (const host of hostsToTry) {
                const res = await fetchWithToken(buildUrl(host), {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })

                if (res.status === 200) {
                    return { status: 200, sourceHost: host }
                }

                if (res.status !== 404 && !fallbackResult) {
                    fallbackResult = { status: res.status, sourceHost: host }
                }
            }

            return (
                fallbackResult ?? {
                    status: 404,
                    sourceHost: hostsToTry[0]
                }
            )
        },
        enabled: !!owner && !!repo // only run if owner and repo are provided
    })
}

export function useRepoTypeOptions() {
    return useApiQuery<Option[]>(
        ['repoTypeOptions'],
        API_ENDPOINTS.GET_REPO_TYPE_OPTIONS
    )
}

export function useCompanyDomainList() {
    return useApiQuery<Option[]>(
        ['companyDomainOptions'],
        API_ENDPOINTS.GET_COMPANY_DOMAIN_CATEGORIES
    )
}

export function useGetBvBPlaybooksTitles() {
    const { data } = useQuery<Playbook[]>({
        queryKey: BVB_PLAYBOOKS_QUERY_KEY,
        queryFn: fetchBvBPlaybooks
    })

    const bvbTitlesSet = Array.isArray(data)
        ? new Set(
              data.map(pb =>
                  pb.playbook_nm
                      .replaceAll(' ', '-')
                      .toLowerCase()
                      .replace(/[^a-zA-Z0-9._-]/g, '')
                      .replace(/\s/g, '')
              )
          )
        : new Set()

    return { bvbTitlesSet }
}
