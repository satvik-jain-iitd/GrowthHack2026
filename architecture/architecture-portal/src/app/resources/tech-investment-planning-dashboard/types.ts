export interface EpicMappingAccumulator {
    epicId: string
    epicName: string
    isSubmitted: boolean
    allRecommended: boolean
    savedJourneyIds: Set<string>
    savedCapabilityIds: Set<string>
    addedJourneyIds: Set<string>
    addedCapabilityIds: Set<string>
    capLevel3Count: number
    capLevel4Count: number
    // per-item detail for modal
    journeyDetail: Map<string, { statement: string; recommended: boolean }>
    capabilityDetail: Map<
        string,
        { name: string; level: number; recommended: boolean }
    >
}

export interface RecEpicAccumulator {
    epicId: string
    recJourneyIds: Set<string>
    recCapabilityIds: Set<string>
    capLevel3Count: number
    capLevel4Count: number
    // per-item detail for modal
    journeyDetail: Map<string, { statement: string }>
    capabilityDetail: Map<string, { name: string; level: number }>
}

export interface EpicSummaryRow {
    epicId: string
    epicName: string
    status: 'submitted' | 'abandoned'
    aiMatch: 'no_change' | 'delta' | 'n/a' | 'no_rec'
    addedJourneys: number
    addedCapabilities: number
    removedJourneys: number
    removedCapabilities: number
    savedJourneyCount: number
    savedCapabilityCount: number
    recJourneyCount: number
    recCapabilityCount: number
}

export interface JourneyFrequency {
    journeyId: string
    journeyStatement: string
    epicCount: number
}

export interface CapabilityFrequency {
    capabilityId: string
    capabilityName: string
    capabilityLevel: number
    epicCount: number
}

export interface DerivedMetrics {
    totalEpicsInitiated: number
    totalEpicsInRecommendations: number
    abandoned: number
    submitted: number
    noChange: number
    delta: number
    noRec: number
    totalAddedJourneys: number
    totalAddedCapabilities: number
    totalRemovedJourneys: number
    totalRemovedCapabilities: number
    epicsWithAdditions: number
    epicsWithRemovals: number
    totalKeptAiJourneys: number
    totalKeptAiCapabilities: number
    capLevelDistMapping: { level3: number; level4: number }
    capLevelDistRec: { level3: number; level4: number }
    journeyRetentionRate: number
    capabilityRetentionRate: number
    topRecJourneys: JourneyFrequency[]
    topRecCapabilities: CapabilityFrequency[]
    topSavedJourneys: JourneyFrequency[]
    topSavedCapabilities: CapabilityFrequency[]
    journeyRankRetention: number[]
}

export interface JourneyItem {
    journeyId: string
    journeyStatement: string
    recommended: boolean
    saved: boolean
}

export interface CapabilityItem {
    capabilityId: string
    capabilityName: string
    capabilityLevel: number
    recommended: boolean
    saved: boolean
}

export interface AuditEvent {
    time: string
    actor: string
    actionSummary: string
    itemIds: string[]
    isAiRecommended: (boolean | null)[]
}

export interface EpicAuditData {
    events: AuditEvent[]
    actors: string[]
    timeSpentMs: number | null
}

export interface EpicDetailData {
    epicId: string
    epicName: string
    savedJourneys: JourneyItem[]
    savedCapabilities: CapabilityItem[]
    recJourneys: JourneyItem[]
    recCapabilities: CapabilityItem[]
    audit?: EpicAuditData
    /** ms between first audit event and last submission. null if no submission found. */
    timeSpentMs: number | null
}

export interface StrategicEpic {
    resourceType: string
    id: number
    name: string
    createdBy: string
    planningCycle: string[]
    createdDate: string
    requestingLOB: string
    impactedLOB: string
    sponsoringLOB: string
    investmentCategory: string
    demandGroup: string
    description: string
}

export interface DashboardFilters {
    createdBy: string[]
    planningCycle: string[]
    createdDateFrom: Date | null
    createdDateTo: Date | null
    requestingLOB: string[]
    impactedLOB: string[]
    sponsoringLOB: string[]
    investmentCategory: string[]
    demandGroup: string[]
}

export const EMPTY_FILTERS: DashboardFilters = {
    createdBy: [],
    planningCycle: [],
    createdDateFrom: null,
    createdDateTo: null,
    requestingLOB: [],
    impactedLOB: [],
    sponsoringLOB: [],
    investmentCategory: [],
    demandGroup: []
}

export type SystemExceptionsMode =
    | 'without_system_exceptions'
    | 'with_system_exceptions'

export const DEFAULT_SYSTEM_EXCEPTIONS_MODE: SystemExceptionsMode =
    'without_system_exceptions'

/** Gates expanded debug tooltips (numerator/denominator/total) on toggle-scoped metrics. */
export const SHOW_METRIC_DEBUG_INFO = false

export type WorkerInMessage = {
    type: 'START'
    mappingUrl: string
    journeyRecUrl: string
    capRecUrl: string
    historyUrl: string
}

export type WorkerOutMessage =
    | {
          type: 'PROGRESS'
          phase: 'mapping' | 'journeyRec' | 'capRec' | 'history' | 'deriving'
          pct: number
      }
    | {
          type: 'COMPLETE'
          metrics: DerivedMetrics
          epicRows: EpicSummaryRow[]
          epicDetails: Record<string, EpicDetailData>
          epicActors: Record<string, string[]>
      }
    | { type: 'ERROR'; message: string }
