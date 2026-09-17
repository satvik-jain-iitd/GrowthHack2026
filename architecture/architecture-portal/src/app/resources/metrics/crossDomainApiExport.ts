import { EtpEcmiCrossDomainApiRow, EtpEcmiUnitCioGroupRow } from './types'

export type CrossDomainExportColumn = {
    label: string
    key: string
    type?: string
    numeratorKey?: string
    denominatorKey?: string
}

export type CrossDomainExportRow =
    | EtpEcmiCrossDomainApiRow
    | EtpEcmiUnitCioGroupRow

type Cell = string | number

const EMPTY = '—'

const HEADER_STYLE = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { patternType: 'solid', fgColor: { rgb: '006FCF' } },
    alignment: { horizontal: 'center', vertical: 'center' }
}

const readValue = (row: CrossDomainExportRow, key?: string) =>
    key ? (row as unknown as Record<string, unknown>)[key] : undefined

const toNumber = (value: unknown) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

// must stay in step with MetricProgressCell so the file agrees with the screen
const formatPercent = (value: unknown) => {
    const parsed = Number.parseFloat(String(value))
    const percentage = Number.isNaN(parsed)
        ? 0
        : Math.min(100, Math.max(0, parsed))
    return `${percentage.toFixed(2)}%`
}

// progress and fraction each occupy three columns: the rendered label plus the
// raw counts behind it, so the sheet stays summable
const isTripleColumn = (column: CrossDomainExportColumn) =>
    column.type === 'progress' || column.type === 'fraction'

const headerFor = (column: CrossDomainExportColumn) =>
    isTripleColumn(column)
        ? [column.label, `${column.label} (Count)`, `${column.label} (Total)`]
        : [column.label]

const cellsFor = (
    column: CrossDomainExportColumn,
    row: CrossDomainExportRow
): Cell[] => {
    if (column.type === 'badges') {
        const detailRow = row as EtpEcmiCrossDomainApiRow
        const badges = [
            detailRow.is_etp && 'ETP',
            detailRow.is_ecmi && 'ECMI'
        ].filter(Boolean)
        return [badges.length ? badges.join(', ') : EMPTY]
    }
    if (column.type === 'avatar') {
        return [String(readValue(row, column.key) || '') || EMPTY]
    }
    if (column.type === 'years') {
        const years = String(readValue(row, column.key) || '')
            .split(',')
            .map(year => year.trim())
            .filter(Boolean)
        return [years.length ? years.join(', ') : EMPTY]
    }
    if (column.type === 'boolean-badge') {
        return [readValue(row, column.key) ? 'Yes' : 'No']
    }
    if (column.type === 'progress') {
        return [
            formatPercent(readValue(row, column.key)),
            toNumber(readValue(row, column.numeratorKey)),
            toNumber(readValue(row, column.denominatorKey))
        ]
    }
    if (column.type === 'fraction') {
        const numerator = toNumber(readValue(row, column.key))
        const denominator = toNumber(readValue(row, column.denominatorKey))
        return [`${numerator} / ${denominator}`, numerator, denominator]
    }
    const value = readValue(row, column.key)
    return [typeof value === 'number' ? value : String(value ?? '')]
}

export function buildCrossDomainExportSheet(
    rows: readonly CrossDomainExportRow[],
    columns: readonly CrossDomainExportColumn[]
) {
    return {
        header: columns.flatMap(headerFor),
        data: rows.map(row => columns.flatMap(column => cellsFor(column, row)))
    }
}

export async function downloadCrossDomainApiExcel({
    rows,
    columns,
    isGrouped
}: {
    rows: readonly CrossDomainExportRow[]
    columns: readonly CrossDomainExportColumn[]
    isGrouped: boolean
}) {
    if (!rows.length) return

    const { header, data } = buildCrossDomainExportSheet(rows, columns)
    // indirection keeps the ~500KB library out of the page bundle
    const xlsxModuleName = 'xlsx-js-style'
    const XLSX = await import(xlsxModuleName)

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data])
    header.forEach((_, columnIndex) => {
        const headerCell =
            worksheet[XLSX.utils.encode_cell({ r: 0, c: columnIndex })]
        if (headerCell) headerCell.s = HEADER_STYLE
    })
    worksheet['!cols'] = header.map(label => ({
        wch: Math.min(45, Math.max(14, label.length + 2))
    }))

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cross-Domain APIs')

    const now = new Date()
    const dateStamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const fileName = `cross-domain-apis-${isGrouped ? 'unit-cio' : 'initiatives'}-${dateStamp}.xlsx`
    XLSX.writeFile(workbook, fileName)
}
