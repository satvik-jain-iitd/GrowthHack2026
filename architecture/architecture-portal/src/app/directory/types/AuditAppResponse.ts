import { UseMutateAsyncFunction } from '@tanstack/react-query'

export interface AuditUserName {
    name: string
    email: string
}

export interface AuditAppResponse {
    domainId?: string
    domainName?: string
    userName?: AuditUserName
    userEmail?: string
    action?: string
    timeStamp?: string
    appId?: string
    appName?: string
}

export interface LogsModalProps {
    isOpen: boolean
    columns: Array<{ key: string; label: string }>
    data: Array<AuditAppResponse>
    searchApic: 'application' | 'domain'
    id: string
    offset: string
    fetchData: UseMutateAsyncFunction<
        { data: AuditAppResponse[]; recordCount: number },
        Error,
        {
            applicationId?: string | undefined
            link?: boolean | undefined
            unlink?: boolean | undefined
            search_string?: string | undefined
            startDate?: string | undefined
            endDate?: string | undefined
            page?: string | undefined
            offset?: string | undefined
            sortBy?: string | undefined
            orderBy?: string | undefined
            domainId?: string | undefined
        },
        unknown
    >
    name: string
    recordCount: number
    serverError: unknown | null
    onClose: () => void
    isLoading?: boolean
}
