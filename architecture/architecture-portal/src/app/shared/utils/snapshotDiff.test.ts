import {
    computeSnapshotDiff,
    computeTrackedFieldDiffs,
    isSnapshotStale
} from './snapshotDiff'

describe('computeSnapshotDiff', () => {
    it('returns empty array when snapshot and current are identical', () => {
        const entity = {
            initiativeName: 'Test Initiative',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            yearsActive: ['2024']
        }
        const diffs = computeSnapshotDiff(entity, entity, 'initiative')
        expect(diffs).toEqual([])
    })

    it('detects changed string fields for initiative', () => {
        const snapshot = {
            initiativeName: 'Old Name',
            startDate: '2024-01-01',
            endDate: '2024-12-31'
        }
        const current = {
            initiativeName: 'New Name',
            startDate: '2024-01-01',
            endDate: '2025-06-30'
        }
        const diffs = computeSnapshotDiff(snapshot, current, 'initiative')
        expect(diffs).toHaveLength(2)
        expect(diffs[0]).toEqual({
            field: 'Initiative Name',
            from: 'Old Name',
            to: 'New Name',
            isChanged: true
        })
        expect(diffs[1]).toEqual({
            field: 'End Date',
            from: '2024-12-31',
            to: '2025-06-30',
            isChanged: true
        })
    })

    it('detects changed array fields', () => {
        const snapshot = { yearsActive: ['2024'] }
        const current = { yearsActive: ['2024', '2025'] }
        const diffs = computeSnapshotDiff(snapshot, current, 'initiative')
        expect(diffs).toHaveLength(1)
        expect(diffs[0].field).toBe('Years')
        expect(diffs[0].from).toBe('2024')
        expect(diffs[0].to).toBe('2024, 2025')
    })

    it('handles null values', () => {
        const snapshot = { startDate: null }
        const current = { startDate: '2024-06-01' }
        const diffs = computeSnapshotDiff(snapshot, current, 'initiative')
        expect(diffs).toHaveLength(1)
        expect(diffs[0].from).toBe('-')
        expect(diffs[0].to).toBe('2024-06-01')
    })

    it('handles application entity type', () => {
        const snapshot = {
            applicationName: 'Old App',
            lifecycleState: 'Active'
        }
        const current = {
            applicationName: 'New App',
            lifecycleState: 'Active'
        }
        const diffs = computeSnapshotDiff(snapshot, current, 'application')
        expect(diffs).toHaveLength(1)
        expect(diffs[0].field).toBe('Application Name')
    })

    it('handles linkedCompanyDomain as object', () => {
        const snapshot = {
            linkedCompanyDomain: {
                companyDomainId: 'd1',
                companyDomainName: 'Domain A'
            }
        }
        const current = {
            linkedCompanyDomain: {
                companyDomainId: 'd2',
                companyDomainName: 'Domain B'
            }
        }
        const diffs = computeSnapshotDiff(snapshot, current, 'application')
        expect(diffs).toHaveLength(1)
        expect(diffs[0].from).toBe('Domain A')
        expect(diffs[0].to).toBe('Domain B')
    })

    it('handles empty arrays as "-"', () => {
        const snapshot = { yearsActive: [] }
        const current = { yearsActive: ['2024'] }
        const diffs = computeSnapshotDiff(snapshot, current, 'initiative')
        expect(diffs).toHaveLength(1)
        expect(diffs[0].from).toBe('-')
    })

    it('renders title from metamodel ADR/BvB references', () => {
        const snapshot = {
            impactedCompanyDomains: [],
            buildVsBuyAssessments: [
                { bvbId: 'bvb-1', title: 'Buy Assessment A', isCore: true }
            ],
            architectureDecisionRecords: [
                { adrId: 'adr-1', title: 'ADR Alpha', isCore: false }
            ],
            linkedInitiatives: []
        }
        const current = {
            impactedCompanyDomains: [],
            buildVsBuyAssessments: [
                { bvbId: 'bvb-2', title: 'Buy Assessment B', isCore: true }
            ],
            architectureDecisionRecords: [
                { adrId: 'adr-2', title: 'ADR Beta', isCore: true }
            ],
            linkedInitiatives: []
        }
        const diffs = computeTrackedFieldDiffs(snapshot, current, 'initiative')
        const bvbDiff = diffs.find(d => d.field === 'BVBs')
        expect(bvbDiff?.from).toBe('Buy Assessment A')
        expect(bvbDiff?.to).toBe('Buy Assessment B')
        const adrDiff = diffs.find(d => d.field === 'ADRs')
        expect(adrDiff?.from).toBe('ADR Alpha')
        expect(adrDiff?.to).toBe('ADR Beta')
    })
})

describe('computeTrackedFieldDiffs', () => {
    it('returns diffs for tracked fields only', () => {
        const snapshot = {
            impactedCompanyDomains: [{ companyDomainName: 'Domain A' }],
            buildVsBuyAssessments: [],
            architectureDecisionRecords: [],
            linkedInitiatives: [],
            initiativeName: 'Old Name'
        }
        const current = {
            impactedCompanyDomains: [{ companyDomainName: 'Domain B' }],
            buildVsBuyAssessments: [],
            architectureDecisionRecords: [],
            linkedInitiatives: [],
            initiativeName: 'New Name'
        }
        const diffs = computeTrackedFieldDiffs(snapshot, current, 'initiative')
        expect(diffs).toHaveLength(4)
        expect(diffs.map(d => d.field)).toEqual([
            'Company Domain',
            'BVBs',
            'ADRs',
            'Linked Initiatives'
        ])
        expect(diffs[0].isChanged).toBe(true)
        expect(diffs[1].isChanged).toBe(false)
    })

    it('returns all fields as changed when snapshot is null', () => {
        const current = {
            impactedCompanyDomains: [{ companyDomainName: 'Domain A' }],
            buildVsBuyAssessments: ['bvb1'],
            architectureDecisionRecords: [],
            linkedInitiatives: []
        }
        const diffs = computeTrackedFieldDiffs(null, current, 'initiative')
        expect(diffs).toHaveLength(4)
        expect(diffs[0].from).toBe('-')
        expect(diffs[0].isChanged).toBe(true)
    })
})

describe('isSnapshotStale', () => {
    it('returns true when snapshot is null', () => {
        expect(isSnapshotStale(null, {}, 'initiative')).toBe(true)
    })

    it('returns false when tracked fields match', () => {
        const entity = {
            impactedCompanyDomains: [{ companyDomainName: 'Domain A' }],
            buildVsBuyAssessments: ['bvb1'],
            architectureDecisionRecords: ['adr1'],
            linkedInitiatives: ['init1']
        }
        expect(isSnapshotStale(entity, entity, 'initiative')).toBe(false)
    })

    it('returns true when a tracked field differs', () => {
        const snapshot = {
            impactedCompanyDomains: [{ companyDomainName: 'Domain A' }],
            buildVsBuyAssessments: ['bvb1'],
            architectureDecisionRecords: ['adr1'],
            linkedInitiatives: ['init1']
        }
        const current = {
            impactedCompanyDomains: [{ companyDomainName: 'Domain B' }],
            buildVsBuyAssessments: ['bvb1'],
            architectureDecisionRecords: ['adr1'],
            linkedInitiatives: ['init1']
        }
        expect(isSnapshotStale(snapshot, current, 'initiative')).toBe(true)
    })

    it('ignores non-tracked fields', () => {
        const snapshot = {
            initiativeName: 'Old Name',
            impactedCompanyDomains: [],
            buildVsBuyAssessments: [],
            architectureDecisionRecords: [],
            linkedInitiatives: []
        }
        const current = {
            initiativeName: 'New Name',
            impactedCompanyDomains: [],
            buildVsBuyAssessments: [],
            architectureDecisionRecords: [],
            linkedInitiatives: []
        }
        expect(isSnapshotStale(snapshot, current, 'initiative')).toBe(false)
    })
})
