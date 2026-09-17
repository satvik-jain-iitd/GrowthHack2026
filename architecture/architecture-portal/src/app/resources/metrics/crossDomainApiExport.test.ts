import { METRIC3_COLUMNS, METRIC3_UNIT_CIO_COLUMNS } from './constants'
import {
    buildCrossDomainExportSheet,
    downloadCrossDomainApiExcel
} from './crossDomainApiExport'
import type { CrossDomainExportRow } from './crossDomainApiExport'
import type { EtpEcmiCrossDomainApiRow, EtpEcmiUnitCioGroupRow } from './types'

jest.mock('xlsx-js-style', () => ({
    utils: {
        aoa_to_sheet: jest.fn(() => ({ A1: { v: 'header' } })),
        encode_cell: jest.fn(({ c }: { r: number; c: number }) => `A${c + 1}`),
        book_new: jest.fn(() => ({ SheetNames: [], Sheets: {} })),
        book_append_sheet: jest.fn()
    },
    writeFile: jest.fn()
}))

import * as XLSX from 'xlsx-js-style'

const mockWriteFile = XLSX.writeFile as unknown as jest.Mock
const mockAoaToSheet = XLSX.utils.aoa_to_sheet as unknown as jest.Mock

const makeDetailRow = (
    overrides: Partial<EtpEcmiCrossDomainApiRow> = {}
): EtpEcmiCrossDomainApiRow => ({
    initiative_id: 'INI-1',
    initiative_name: 'Payments Modernization',
    etp_ecmi_id: 'ETP-1',
    is_etp: true,
    is_ecmi: false,
    unit_cio: 'Jane Doe',
    unit_cio_email: 'jane.doe@aexp.com',
    principal_architect: 'John Smith',
    principal_architect_email: 'john.smith@example.com',
    planning_cycle: '2025, 2026',
    playbook_onboarded: true,
    identified_apis: 13,
    cross_domain_type_ab_apis: 13,
    earb_approved_type_ab: 11,
    prod_certified_type_ab: 5,
    earb_approved_pct: 84.6199,
    prod_certified_pct: 38.46,
    is_identified: true,
    ...overrides
})

const makeGroupRow = (
    overrides: Partial<EtpEcmiUnitCioGroupRow> = {}
): EtpEcmiUnitCioGroupRow => ({
    unit_cio: 'Jane Doe',
    unit_cio_email: 'jane.doe@aexp.com',
    initiative_count: 5,
    etp_count: 3,
    ecmi_count: 2,
    playbook_onboarded_count: 3,
    identified_apis: 20,
    cross_domain_type_ab_apis: 20,
    earb_approved_type_ab: 10,
    prod_certified_type_ab: 4,
    earb_approved_pct: 50,
    prod_certified_pct: 20,
    ...overrides
})

const buildDetailSheet = (row: EtpEcmiCrossDomainApiRow) =>
    buildCrossDomainExportSheet([row], METRIC3_COLUMNS)

describe('buildCrossDomainExportSheet', () => {
    it('expands progress columns into label, count and total headers', () => {
        const { header } = buildCrossDomainExportSheet([], METRIC3_COLUMNS)

        expect(header).toEqual([
            'ETP / ECMI',
            'Unit CIO',
            'Principal Architect',
            'Type',
            'Years',
            'Identified APIs',
            'EARB Approved Cross-Domain APIs',
            'EARB Approved Cross-Domain APIs (Count)',
            'EARB Approved Cross-Domain APIs (Total)',
            'Production Certified Cross-Domain APIs',
            'Production Certified Cross-Domain APIs (Count)',
            'Production Certified Cross-Domain APIs (Total)',
            'Playbook Onboarded'
        ])
    })

    it('maps a detail row across every column type', () => {
        const { data } = buildDetailSheet(makeDetailRow())

        expect(data).toEqual([
            [
                'Payments Modernization',
                'Jane Doe',
                'John Smith',
                'ETP',
                '2025, 2026',
                13,
                '84.62%',
                11,
                13,
                '38.46%',
                5,
                13,
                'Yes'
            ]
        ])
    })

    it.each([
        [null, '0.00%'],
        [undefined, '0.00%'],
        [Number.NaN, '0.00%'],
        [120, '100.00%'],
        [-5, '0.00%']
    ])('formats a percentage of %p as %s', (value, expected) => {
        const row = makeDetailRow({
            earb_approved_pct: value as unknown as number
        })

        expect(buildDetailSheet(row).data[0][6]).toBe(expected)
    })

    it.each([
        [true, false, 'ETP'],
        [false, true, 'ECMI'],
        [true, true, 'ETP, ECMI'],
        [false, false, '—']
    ])('renders badges for etp=%p ecmi=%p', (isEtp, isEcmi, expected) => {
        const row = makeDetailRow({ is_etp: isEtp, is_ecmi: isEcmi })

        expect(buildDetailSheet(row).data[0][3]).toBe(expected)
    })

    it('falls back to a dash for blank owners and blank years', () => {
        const row = makeDetailRow({
            unit_cio: '',
            principal_architect: '',
            planning_cycle: ' , '
        })
        const [cells] = buildDetailSheet(row).data

        expect(cells[1]).toBe('—')
        expect(cells[2]).toBe('—')
        expect(cells[4]).toBe('—')
    })

    it('renders an un-onboarded playbook as No', () => {
        const row = makeDetailRow({ playbook_onboarded: false })

        expect(buildDetailSheet(row).data[0][12]).toBe('No')
    })

    it('emits a fraction triple for the grouped column set', () => {
        const { header, data } = buildCrossDomainExportSheet(
            [makeGroupRow()],
            METRIC3_UNIT_CIO_COLUMNS
        )
        const fractionIndex = header.indexOf('Playbooks Onboarded')

        expect(header.slice(fractionIndex, fractionIndex + 3)).toEqual([
            'Playbooks Onboarded',
            'Playbooks Onboarded (Count)',
            'Playbooks Onboarded (Total)'
        ])
        expect(data[0].slice(fractionIndex, fractionIndex + 3)).toEqual([
            '3 / 5',
            3,
            5
        ])
    })

    it('keeps counts and totals as numbers so Excel can sum them', () => {
        const [cells] = buildDetailSheet(makeDetailRow()).data

        expect(typeof cells[7]).toBe('number')
        expect(typeof cells[8]).toBe('number')
    })
})

describe('downloadCrossDomainApiExcel', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('writes a dated initiatives workbook', async () => {
        await downloadCrossDomainApiExcel({
            rows: [makeDetailRow()],
            columns: METRIC3_COLUMNS,
            isGrouped: false
        })

        expect(mockWriteFile).toHaveBeenCalledTimes(1)
        expect(mockWriteFile.mock.calls[0][1]).toMatch(
            /^cross-domain-apis-initiatives-\d{4}-\d{2}-\d{2}\.xlsx$/
        )
    })

    it('names the grouped workbook after the unit CIO view', async () => {
        await downloadCrossDomainApiExcel({
            rows: [makeGroupRow()],
            columns: METRIC3_UNIT_CIO_COLUMNS,
            isGrouped: true
        })

        expect(mockWriteFile.mock.calls[0][1]).toMatch(
            /^cross-domain-apis-unit-cio-\d{4}-\d{2}-\d{2}\.xlsx$/
        )
    })

    it('styles the header row and sizes the columns', async () => {
        const worksheet: Record<string, unknown> = { A1: {} }
        mockAoaToSheet.mockReturnValueOnce(worksheet)

        await downloadCrossDomainApiExcel({
            rows: [makeDetailRow()],
            columns: METRIC3_COLUMNS,
            isGrouped: false
        })

        expect((worksheet.A1 as { s: unknown }).s).toEqual({
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { patternType: 'solid', fgColor: { rgb: '006FCF' } },
            alignment: { horizontal: 'center', vertical: 'center' }
        })
        expect(worksheet['!cols']).toHaveLength(13)
    })

    it('does nothing when there are no rows', async () => {
        await downloadCrossDomainApiExcel({
            rows: [] as CrossDomainExportRow[],
            columns: METRIC3_COLUMNS,
            isGrouped: false
        })

        expect(mockAoaToSheet).not.toHaveBeenCalled()
        expect(mockWriteFile).not.toHaveBeenCalled()
    })
})
