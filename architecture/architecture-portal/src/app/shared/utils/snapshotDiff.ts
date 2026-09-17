export interface FieldDiff {
    field: string
    from: string
    to: string
    isChanged: boolean
}

function stringify(value: unknown): string {
    if (value == null) return '-'
    if (Array.isArray(value)) {
        if (value.length === 0) return '-'
        return value
            .map(v => {
                if (typeof v === 'object' && v !== null) {
                    const name =
                        (v as Record<string, unknown>).companyDomainName ??
                        (v as Record<string, unknown>).subdomainName ??
                        (v as Record<string, unknown>).applicationName ??
                        (v as Record<string, unknown>).initiativeName ??
                        (v as Record<string, unknown>).name ??
                        (v as Record<string, unknown>).title ??
                        JSON.stringify(v)
                    return String(name)
                }
                return String(v)
            })
            .join(', ')
    }
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
}

const INITIATIVE_DISPLAY_FIELDS: Record<string, string> = {
    initiativeName: 'Initiative Name',
    startDate: 'Start Date',
    endDate: 'End Date',
    yearsActive: 'Years',
    lineOfBusiness: 'Line of Business',
    strategicEpics: 'Strategic Epics',
    etp_ecmi_id: 'ETP',
    impactedCompanyDomains: 'Company Domain',
    impactedSubdomains: 'Subdomain',
    supportedBusinessUnits: 'Business Units',
    businessCapabilities: 'Business Capabilities',
    foundationalTechnologies: 'Foundational Technologies',
    supportedMarkets: 'Markets',
    technologyStacks: 'Tech Stacks',
    techCapabilities: 'Technical Capabilities'
}

const APPLICATION_DISPLAY_FIELDS: Record<string, string> = {
    applicationName: 'Application Name',
    lifecycleState: 'Lifecycle Status',
    lineOfBusiness: 'Line of Business',
    countriesSupported: 'Countries Supported',
    applicationType: 'App Type',
    linkedCompanyDomain: 'Company Domain',
    linkedSubdomain: 'Sub Domain',
    supportedBusinessUnits: 'Business Units',
    businessCapabilities: 'Business Capabilities',
    linkedFoundationalTechnologies: 'Foundational Technologies',
    marketsSupported: 'Markets',
    technologyStacks: 'Tech Stacks',
    techCapabilities: 'Technical Capabilities'
}

const INITIATIVE_ATTESTATION_TRACKED_FIELDS: Record<string, string> = {
    impactedCompanyDomains: 'Company Domain',
    buildVsBuyAssessments: 'BVBs',
    architectureDecisionRecords: 'ADRs',
    linkedInitiatives: 'Linked Initiatives'
}

const APPLICATION_ATTESTATION_TRACKED_FIELDS: Record<string, string> = {
    linkedCompanyDomain: 'Company Domain',
    linkedBuildVsBuyAssessments: 'BVBs',
    linkedArchitectureDecisionRecords: 'ADRs',
    linkedInitiatives: 'Linked Initiatives'
}

function extractDisplay(value: unknown, key: string): string {
    if (key === 'linkedCompanyDomain' && typeof value === 'object' && value) {
        return (
            String(
                (value as Record<string, unknown>).companyDomainName ?? '-'
            ) || '-'
        )
    }
    if (key === 'linkedSubdomain' && typeof value === 'object' && value) {
        return (
            String((value as Record<string, unknown>).subdomainName ?? '-') ||
            '-'
        )
    }
    return stringify(value)
}

export function computeSnapshotDiff(
    snapshot: Record<string, unknown>,
    current: Record<string, unknown>,
    entityType: 'initiative' | 'application'
): FieldDiff[] {
    const displayFields =
        entityType === 'initiative'
            ? INITIATIVE_DISPLAY_FIELDS
            : APPLICATION_DISPLAY_FIELDS

    const diffs: FieldDiff[] = []

    for (const [key, label] of Object.entries(displayFields)) {
        const snapshotVal = extractDisplay(snapshot[key], key)
        const currentVal = extractDisplay(current[key], key)
        const isChanged = snapshotVal !== currentVal
        if (isChanged) {
            diffs.push({
                field: label,
                from: snapshotVal,
                to: currentVal,
                isChanged
            })
        }
    }

    return diffs
}

export function computeTrackedFieldDiffs(
    snapshot: Record<string, unknown> | null,
    current: Record<string, unknown>,
    entityType: 'initiative' | 'application'
): FieldDiff[] {
    const trackedFields =
        entityType === 'initiative'
            ? INITIATIVE_ATTESTATION_TRACKED_FIELDS
            : APPLICATION_ATTESTATION_TRACKED_FIELDS

    const diffs: FieldDiff[] = []

    for (const [key, label] of Object.entries(trackedFields)) {
        const snapshotVal = snapshot ? extractDisplay(snapshot[key], key) : '-'
        const currentVal = extractDisplay(current[key], key)
        const isChanged = snapshot ? snapshotVal !== currentVal : true
        diffs.push({
            field: label,
            from: snapshotVal,
            to: currentVal,
            isChanged
        })
    }

    return diffs
}

export function isSnapshotStale(
    snapshot: Record<string, unknown> | null,
    current: Record<string, unknown>,
    entityType: 'initiative' | 'application'
): boolean {
    if (!snapshot) return true

    const trackedFields =
        entityType === 'initiative'
            ? INITIATIVE_ATTESTATION_TRACKED_FIELDS
            : APPLICATION_ATTESTATION_TRACKED_FIELDS

    for (const key of Object.keys(trackedFields)) {
        const snapshotVal = extractDisplay(snapshot[key], key)
        const currentVal = extractDisplay(current[key], key)
        if (snapshotVal !== currentVal) return true
    }

    return false
}
