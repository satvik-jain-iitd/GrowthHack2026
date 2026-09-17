/* istanbul ignore file */
import { createContext, useContext } from 'react'
import type {
    DashboardFilters,
    DerivedMetrics,
    EpicDetailData,
    EpicSummaryRow,
    StrategicEpic,
    SystemExceptionsMode
} from '@/app/resources/tech-investment-planning-dashboard/types'

interface DashboardContextValue {
    metrics: DerivedMetrics
    filteredMetrics: DerivedMetrics
    epicRows: EpicSummaryRow[]
    filteredEpicRows: EpicSummaryRow[]
    epicDetails: Record<string, EpicDetailData>
    epicActors: Record<string, string[]>
    strategicEpics: StrategicEpic[]
    strategicEpicsCount: number | null
    filters: DashboardFilters
    setFilters: (f: DashboardFilters) => void
    systemExceptionsMode: SystemExceptionsMode
    setSystemExceptionsMode: (m: SystemExceptionsMode) => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export const DashboardProvider = DashboardContext.Provider

export function useDashboard(): DashboardContextValue {
    const ctx = useContext(DashboardContext)
    if (!ctx)
        throw new Error('useDashboard must be used inside DashboardProvider')
    return ctx
}
