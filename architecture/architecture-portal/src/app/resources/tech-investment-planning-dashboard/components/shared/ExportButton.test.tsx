import { render, fireEvent } from '@/test/utils/test-utils'
import { ExportButton } from '@/app/resources/tech-investment-planning-dashboard/components/shared/ExportButton'
import type {
    EpicSummaryRow,
    StrategicEpic
} from '@/app/resources/tech-investment-planning-dashboard/types'

jest.mock('papaparse', () => ({
    unparse: jest.fn(() => 'csv-content')
}))

import Papa from 'papaparse'
const mockUnparse = Papa.unparse as jest.Mock

function makeRow(overrides: Partial<EpicSummaryRow> = {}): EpicSummaryRow {
    return {
        epicId: 'E-001',
        epicName: 'Test Epic',
        status: 'submitted',
        aiMatch: 'no_change',
        addedJourneys: 1,
        addedCapabilities: 2,
        removedJourneys: 0,
        removedCapabilities: 1,
        savedJourneyCount: 3,
        savedCapabilityCount: 4,
        recJourneyCount: 2,
        recCapabilityCount: 5,
        ...overrides
    }
}

function makeStrategicEpic(
    overrides: Partial<StrategicEpic> = {}
): StrategicEpic {
    return {
        resourceType: 'StrategicEpic',
        id: 1001,
        name: 'Test Epic',
        createdBy: 'user@test.com',
        planningCycle: ['2025H1'],
        createdDate: '2025-01-01',
        requestingLOB: 'LOB A',
        impactedLOB: 'LOB B, LOB C',
        sponsoringLOB: 'LOB D',
        investmentCategory: 'Growth',
        demandGroup: 'Group X',
        description: '',
        ...overrides
    }
}

const emptyMap = new Map<string, StrategicEpic>()

describe('ExportButton', () => {
    let createObjectURL: jest.Mock
    let revokeObjectURL: jest.Mock

    beforeEach(() => {
        mockUnparse.mockClear()
        createObjectURL = jest.fn(() => 'blob:mock-url')
        revokeObjectURL = jest.fn()
        global.URL.createObjectURL = createObjectURL
        global.URL.revokeObjectURL = revokeObjectURL

        // Suppress anchor click navigation
        jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(
            () => {}
        )
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('button label shows correct rows.length', () => {
        const rows = [makeRow(), makeRow({ epicId: 'E-002' })]
        render(
            <ExportButton
                rows={rows}
                strategicEpicMap={emptyMap}
                epicActors={{}}
                epicDetails={{}}
            />
        )
        expect(document.body.textContent).toContain('Export CSV (2 rows)')
    })

    it('shows 0 rows when empty', () => {
        render(
            <ExportButton
                rows={[]}
                strategicEpicMap={emptyMap}
                epicActors={{}}
                epicDetails={{}}
            />
        )
        expect(document.body.textContent).toContain('Export CSV (0 rows)')
    })

    it('includes strategic epic fields when map has a matching entry', () => {
        const rows = [makeRow()]
        const se = makeStrategicEpic()
        const map = new Map<string, StrategicEpic>([['E-001', se]])
        const { container } = render(
            <ExportButton
                rows={rows}
                strategicEpicMap={map}
                epicActors={{}}
                epicDetails={{}}
            />
        )
        fireEvent.click(container.querySelector('button')!)

        expect(mockUnparse).toHaveBeenCalledTimes(1)
        const mapped = mockUnparse.mock.calls[0][0][0]
        expect(mapped).toMatchObject({
            epic_id: 'E-001',
            epic_name: 'Test Epic',
            status: 'submitted',
            ai_match: 'no_change',
            requesting_lob: 'LOB A',
            impacted_lob: 'LOB B, LOB C',
            sponsoring_lob: 'LOB D',
            investment_category: 'Growth',
            demand_group: 'Group X',
            planning_cycle: '2025H1',
            created_by: 'user@test.com',
            saved_ecj_count: 3,
            saved_ebc_count: 4,
            ai_rec_ecj_count: 2,
            ai_rec_ebc_count: 5,
            added_ecjs: 1,
            added_ebcs: 2,
            removed_ecjs: 0,
            removed_ebcs: 1
        })
    })

    it('uses empty strings for strategic epic fields when no map entry', () => {
        const rows = [makeRow()]
        const { container } = render(
            <ExportButton
                rows={rows}
                strategicEpicMap={emptyMap}
                epicActors={{}}
                epicDetails={{}}
            />
        )
        fireEvent.click(container.querySelector('button')!)

        const mapped = mockUnparse.mock.calls[0][0][0]
        expect(mapped.requesting_lob).toBe('')
        expect(mapped.investment_category).toBe('')
    })

    it('computes retained_ecj_count and retained_ebc_count like the table', () => {
        const rows = [
            makeRow({
                recJourneyCount: 2,
                removedJourneys: 1,
                recCapabilityCount: 5,
                removedCapabilities: 1
            })
        ]
        const { container } = render(
            <ExportButton
                rows={rows}
                strategicEpicMap={emptyMap}
                epicActors={{}}
                epicDetails={{}}
            />
        )
        fireEvent.click(container.querySelector('button')!)

        const mapped = mockUnparse.mock.calls[0][0][0]
        expect(mapped.retained_ecj_count).toBe(1)
        expect(mapped.retained_ebc_count).toBe(4)
    })

    it('exports an empty retained count when there was no AI recommendation', () => {
        const rows = [makeRow({ recJourneyCount: 0, recCapabilityCount: 0 })]
        const { container } = render(
            <ExportButton
                rows={rows}
                strategicEpicMap={emptyMap}
                epicActors={{}}
                epicDetails={{}}
            />
        )
        fireEvent.click(container.querySelector('button')!)

        const mapped = mockUnparse.mock.calls[0][0][0]
        expect(mapped.retained_ecj_count).toBe('')
        expect(mapped.retained_ebc_count).toBe('')
    })

    it('joins human actors and excludes system actors', () => {
        const rows = [makeRow()]
        const { container } = render(
            <ExportButton
                rows={rows}
                strategicEpicMap={emptyMap}
                epicActors={{
                    'E-001': [
                        'alice@test.com',
                        'Architecture Portal',
                        'bob@test.com'
                    ]
                }}
                epicDetails={{}}
            />
        )
        fireEvent.click(container.querySelector('button')!)

        const mapped = mockUnparse.mock.calls[0][0][0]
        expect(mapped.actors).toBe('alice@test.com; bob@test.com')
    })

    it('exports an empty actors string when there are no actors for the epic', () => {
        const rows = [makeRow()]
        const { container } = render(
            <ExportButton
                rows={rows}
                strategicEpicMap={emptyMap}
                epicActors={{}}
                epicDetails={{}}
            />
        )
        fireEvent.click(container.querySelector('button')!)

        const mapped = mockUnparse.mock.calls[0][0][0]
        expect(mapped.actors).toBe('')
    })

    it('creates a Blob and triggers download via anchor element', () => {
        const rows = [makeRow()]
        const { container } = render(
            <ExportButton
                rows={rows}
                strategicEpicMap={emptyMap}
                epicActors={{}}
                epicDetails={{}}
            />
        )
        fireEvent.click(container.querySelector('button')!)

        expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
    })

    it('calls URL.revokeObjectURL after click', () => {
        const rows = [makeRow()]
        const { container } = render(
            <ExportButton
                rows={rows}
                strategicEpicMap={emptyMap}
                epicActors={{}}
                epicDetails={{}}
            />
        )
        fireEvent.click(container.querySelector('button')!)

        expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })
})
