import { fetchWithToken } from '@/utils/client'
import {
    fetchInitiativesList,
    toInitiativeListFilters,
    toInitiativeListParams,
    INITIATIVE_FILTER_PARAMS,
    INITIATIVE_SORT_FIELDS
} from './useGetAllInitiatives'

jest.mock('@/utils/client', () => ({
    fetchWithToken: jest.fn()
}))

const mockFetch = fetchWithToken as jest.Mock

const onePage = (data: unknown[]) => ({
    ok: true,
    json: async () => ({ page: 1, pageSize: 100, total: data.length, data })
})

afterEach(() => jest.resetAllMocks())

describe('toInitiativeListParams', () => {
    it('omits every param when no filters are active', () => {
        expect(
            Object.values(toInitiativeListParams()).every(
                value => value === undefined
            )
        ).toBe(true)
    })

    it('maps the searchable fields onto their API param names', () => {
        expect(
            toInitiativeListParams({
                name: 'Payments',
                lineOfBusiness: 'GCS',
                etpEcmiId: '5338',
                legacyEtpEcmiId: 'ETP0000',
                unitCio: 'Cio',
                additionalArchitects: 'Extra'
            })
        ).toMatchObject({
            name: 'Payments',
            lineOfBusiness: 'GCS',
            etp_ecmi_id: '5338',
            legacy_etp_ecmi_id: 'ETP0000',
            unitCio: 'Cio',
            additionalArchitects: 'Extra'
        })
    })

    it('sends the selected initiative types as one comma separated param', () => {
        expect(
            toInitiativeListParams({ initiativeTypes: ['none', 'ecmi'] })
                .initiativeTypes
        ).toBe('none,ecmi')
    })

    it('omits the type param when nothing is selected', () => {
        expect(
            toInitiativeListParams({ initiativeTypes: [] }).initiativeTypes
        ).toBeUndefined()
    })

    it('searches years active through the year param', () => {
        expect(toInitiativeListParams({ year: '2026' }).year).toBe('2026')
    })

    it('defaults the direction when a sort column is set, and omits it otherwise', () => {
        expect(toInitiativeListParams({ sortBy: 'name' })).toMatchObject({
            sortBy: 'name',
            sortDir: 'asc'
        })
        expect(
            toInitiativeListParams({ sortDir: 'desc' }).sortDir
        ).toBeUndefined()
    })
})

describe('initiative column mappings', () => {
    it('only offers a sort on columns that are also searchable', () => {
        const filterable = Object.keys(INITIATIVE_FILTER_PARAMS)
        expect(
            Object.keys(INITIATIVE_SORT_FIELDS).filter(
                columnId => !filterable.includes(columnId)
            )
        ).toEqual([])
    })

    it('maps every searchable grid column', () => {
        expect(Object.keys(INITIATIVE_FILTER_PARAMS)).toEqual([
            'name',
            'lineOfBusiness',
            'yearsActive',
            'etpEcmiId',
            'legacyEtpEcmiId',
            'ownerUnitCio',
            'ownerTechVp',
            'ownerHeadEngineer',
            'ownerPrincipalArchitect',
            'ownerEnterpriseArchitect',
            'additionalArchitects',
            'initiativeType'
        ])
    })
})

describe('toInitiativeListFilters', () => {
    it('maps a column filter onto its API filter', () => {
        expect(
            toInitiativeListFilters([{ id: 'ownerTechVp', value: 'Vp' }])
        ).toEqual({ techVp: 'Vp' })
    })

    it('ignores columns the endpoint cannot search', () => {
        expect(
            toInitiativeListFilters([{ id: 'linkedAdrs', value: 'ADR' }])
        ).toEqual({})
    })

    it('keeps every selected initiative type', () => {
        expect(
            toInitiativeListFilters([
                { id: 'initiativeType', value: ['etp', 'none'] }
            ])
        ).toEqual({ initiativeTypes: ['etp', 'none'] })
    })

    it('drops values that are not initiative types', () => {
        expect(
            toInitiativeListFilters([
                { id: 'initiativeType', value: ['etp', 'other'] }
            ])
        ).toEqual({ initiativeTypes: ['etp'] })
    })

    it('omits the types when the selection is empty', () => {
        expect(
            toInitiativeListFilters([{ id: 'initiativeType', value: [] }])
        ).toEqual({})
    })

    it('searches years active by year', () => {
        expect(
            toInitiativeListFilters([{ id: 'yearsActive', value: '2026' }])
        ).toEqual({ year: '2026' })
    })

    it('maps the sorted column and direction', () => {
        expect(
            toInitiativeListFilters([], [{ id: 'initiativeType', desc: true }])
        ).toEqual({ sortBy: 'initiativeType', sortDir: 'desc' })
    })

    it('leaves the sort unset for a column the endpoint cannot order by', () => {
        expect(
            toInitiativeListFilters([], [{ id: 'startDate', desc: false }])
        ).toEqual({})
    })
})

describe('fetchInitiativesList', () => {
    it('appends the active filters and sort to the list request', async () => {
        mockFetch.mockResolvedValueOnce(
            onePage([{ initiativeId: 'i1', initiativeName: 'Init' }])
        )

        await fetchInitiativesList({
            name: 'Digital Payments',
            initiativeTypes: ['etp'],
            year: '2026',
            sortBy: 'lineOfBusiness',
            sortDir: 'desc'
        })

        const url = mockFetch.mock.calls[0][0] as string
        expect(url).toContain('name=Digital%20Payments')
        expect(url).toContain('initiativeTypes=etp')
        expect(url).toContain('year=2026')
        expect(url).toContain('sortBy=lineOfBusiness')
        expect(url).toContain('sortDir=desc')
    })

    it('requests without filter params when none are active', async () => {
        mockFetch.mockResolvedValueOnce(onePage([]))

        await fetchInitiativesList()

        expect(mockFetch.mock.calls[0][0]).toContain('page=1')
        expect(mockFetch.mock.calls[0][0]).not.toContain('sortBy')
    })
})
