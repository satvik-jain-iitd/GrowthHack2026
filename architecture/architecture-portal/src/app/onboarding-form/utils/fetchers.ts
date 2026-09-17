/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { GraphAPIUser } from '@/app/onboarding-form/types'
import { fetchWithToken } from '@/utils/client'

export async function fetchEaLeads(): Promise<string[]> {
    const url = API_ENDPOINTS.GET_EA_LEADS
    const res = await fetchWithToken(url)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    const data = await res.json()
    if (
        data &&
        typeof data === 'object' &&
        'value' in data &&
        Array.isArray(data.value)
    ) {
        return data.value
    }
    return data ?? []
}

export async function fetchUnitCioListByEmail(
    email: string
): Promise<GraphAPIUser[]> {
    const url = API_ENDPOINTS.GET_UNIT_CIOS_BY_EMAIL(email)
    const res = await fetchWithToken(url)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    const data = await res.json()
    if (
        data &&
        typeof data === 'object' &&
        'value' in data &&
        Array.isArray(data.value)
    ) {
        return data.value
    }
    return data ?? []
}

export async function fetchEmployeesByEmail(
    email: string
): Promise<GraphAPIUser[]> {
    const url = API_ENDPOINTS.GET_EMPLOYEES_BY_EMAIL(email)
    const res = await fetchWithToken(url)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    const data = await res.json()
    if (
        data &&
        typeof data === 'object' &&
        'value' in data &&
        Array.isArray(data.value)
    ) {
        return data.value
    }
    return data ?? []
}

export async function fetchEmployeesAndContractorsByEmail(
    email: string
): Promise<GraphAPIUser[]> {
    const url = API_ENDPOINTS.GET_EMPLOYEES_AND_CONTRACTORS_BY_EMAIL(email)
    const res = await fetchWithToken(url)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    const data = await res.json()
    if (
        data &&
        typeof data === 'object' &&
        'value' in data &&
        Array.isArray(data.value)
    ) {
        return data.value
    }
    return data ?? []
}

export async function fetchFoundationalTechnologyCategories(): Promise<
    string[]
> {
    const url = API_ENDPOINTS.GET_FOUNDATIONAL_TECHNOLOGY_CATEGORIES
    const res = await fetchWithToken(url)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    const data = await res.json()
    if (
        data &&
        typeof data === 'object' &&
        'value' in data &&
        Array.isArray(data.value)
    ) {
        return data.value
    }
    return data ?? []
}

export async function fetchTechOwnersByEmail(email: string) {
    const url = API_ENDPOINTS.GET_TECH_OWNERS_BY_EMAIL(email)
    const res = await fetchWithToken(url)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    const data = await res.json()
    if (
        data &&
        typeof data === 'object' &&
        'value' in data &&
        Array.isArray(data.value)
    ) {
        return data.value
    }
    return data ?? []
}

export async function fetchStakeholdersByEmail(email: string) {
    const url = API_ENDPOINTS.GET_STAKEHOLDERS_BY_EMAIL(email)
    const res = await fetchWithToken(url)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    const data = await res.json()
    if (
        data &&
        typeof data === 'object' &&
        'value' in data &&
        Array.isArray(data.value)
    ) {
        return data.value
    }
    return data ?? []
}

export async function fetchOwnersByEmail(email: string) {
    const url = API_ENDPOINTS.GET_OWNERS_BY_EMAIL(email)
    const res = await fetchWithToken(url)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    const data = await res.json()
    if (
        data &&
        typeof data === 'object' &&
        'value' in data &&
        Array.isArray(data.value)
    ) {
        return data.value
    }
    return data ?? []
}

export async function fetchEaArchitectByEmail(email: string) {
    const url = API_ENDPOINTS.GET_ENTERPRISE_ARCHITECTS_BY_EMAIL(email)
    const res = await fetchWithToken(url)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    const data = await res.json()
    if (
        data &&
        typeof data === 'object' &&
        'value' in data &&
        Array.isArray(data.value)
    ) {
        return data.value
    }
    return data ?? []
}

export async function fetchPrimaryCompanyDomains() {
    const url = API_ENDPOINTS.GET_COMPANY_DOMAIN_CATEGORIES
    const res = await fetchWithToken(url)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    const data = await res.json()
    if (
        data &&
        typeof data === 'object' &&
        'value' in data &&
        Array.isArray(data.value)
    ) {
        return data.value
    }
    return data ?? []
}
export async function fetchEaLeadsWithEmails(): Promise<
    { email: string; name: string }[]
> {
    const url = API_ENDPOINTS.GET_EA_LEADS_EMAIL
    const res = await fetchWithToken(url)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    const data = await res.json()
    return data ?? []
}
