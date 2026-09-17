/* istanbul ignore file */
import { Box, Button, CloseButton, Dialog, Table } from '@chakra-ui/react'
import { useMemo } from 'react'
import * as XLSX from 'xlsx'
import {
    JsonValue,
    PreviousArtifactDataShape,
    PreviousArtifactRow
} from '../utils/types'

const TABLE_COLUMNS: Array<{
    key: keyof PreviousArtifactRow
    label: string
}> = [
    { key: 'artifact_nm', label: 'Artifact' },
    { key: 'diagram_type_nm', label: 'Diagram Type' },
    { key: 'diagram_lvl_nm', label: 'Diagram Level' },
    { key: 'inp_fl_nm', label: 'Template File' }
]

// Exclude
const EXCLUDED_SHEETS = new Set(['Conceptual_Heading'])

const normalizeSheetKey = (key: string) => key.toLowerCase()

const isDataFlowDataKey = (key: string) =>
    normalizeSheetKey(key) === 'dataflow_data'

const isDataFlowHeadingKey = (key: string) =>
    normalizeSheetKey(key) === 'dataflow_heading'

const isExcludedSheetKey = (key: string) =>
    EXCLUDED_SHEETS.has(key) || isDataFlowHeadingKey(key)

const hasDataPayload = (value: JsonValue | undefined): boolean => {
    if (!value || Array.isArray(value) || typeof value !== 'object') {
        return false
    }

    return Object.keys(value as Record<string, unknown>).length > 0
}

const hasDownloadablePayload = (
    value: PreviousArtifactDataShape | undefined
): boolean => {
    if (!value) {
        return false
    }

    return Object.entries(value).some(([key, sheetValue]) => {
        if (isExcludedSheetKey(key)) {
            return false
        }

        if (sheetValue === null) {
            return false
        }

        if (Array.isArray(sheetValue)) {
            return sheetValue.length > 0
        }

        if (typeof sheetValue === 'object') {
            return Object.keys(sheetValue as Record<string, unknown>).length > 0
        }

        return String(sheetValue).trim().length > 0
    })
}

const normalizeFileName = (fileName: string | undefined, fallback: string) => {
    const trimmed = (fileName || '').trim()
    const baseName =
        !trimmed || trimmed.toLowerCase() === 'no file selected'
            ? fallback
            : trimmed

    return baseName.toLowerCase().endsWith('.xlsx')
        ? baseName
        : `${baseName}.xlsx`
}

const SHEET_NAME_OVERRIDES: Record<string, string> = {
    Conceptual_Data: 'Conceptual Model',
    Conceptual_Detail: 'Conceptual - Logical Mapping',
    dataflow_data: 'Data Flow',
    Dataflow_Data: 'Data Flow',
    DataFlow_Data: 'Data Flow',
    dataflow_reference: 'Reference',
    Dataflow_Reference: 'Reference',
    DataFlow_Reference: 'Reference'
}

const REQUIRED_DATA_FLOW_COLUMNS = [
    'Company Domain',
    'Company Sub-Domain',
    'Process Name',
    'Major Application',
    'Data Transmitted',
    'Mode Of Transmission',
    'Certified Type A API?',
    'Schema Transmitted'
] as const

const normalizeFieldKey = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, '')

const normalizeDomainName = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, '')

const DATA_FLOW_COLUMN_KEY_ALIASES: Record<string, string[]> = {
    'Company Domain': ['Company Domain', 'company_domain', 'companydomain'],
    'Company Sub-Domain': [
        'Company Sub-Domain',
        'company_sub_domain',
        'companysubdomain',
        'sub_domain',
        'subdomain'
    ],
    'Process Name': ['Process Name', 'process_name', 'processname'],
    'Major Application': [
        'Major Application',
        'major_application',
        'majorapplication'
    ],
    'Data Transmitted': [
        'Data Transmitted',
        'data_transmitted',
        'datatransmitted'
    ],
    'Mode Of Transmission': [
        'Mode Of Transmission',
        'mode_of_transmission',
        'modeoftransmission'
    ],
    'Certified Type A API?': [
        'Certified Type A API?',
        'certified_type_a_api',
        'certifiedtypeaapi',
        'type_a_api',
        'typeaapi'
    ],
    'Schema Transmitted': [
        'Schema Transmitted',
        'schema_transmitted',
        'schematransmitted'
    ]
}

const getMappedDataFlowCellValue = (
    row: Record<string, JsonValue>,
    requiredColumn: (typeof REQUIRED_DATA_FLOW_COLUMNS)[number]
) => {
    const aliasSet = new Set(
        DATA_FLOW_COLUMN_KEY_ALIASES[requiredColumn].map(alias =>
            normalizeFieldKey(alias)
        )
    )

    for (const [key, value] of Object.entries(row)) {
        if (!aliasSet.has(normalizeFieldKey(key))) {
            continue
        }

        if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
        ) {
            return String(value)
        }

        if (value === null || value === undefined) {
            return ''
        }

        return JSON.stringify(value)
    }

    return ''
}

const stringifyDataFlowValue = (value: JsonValue | undefined): string => {
    if (value === null || value === undefined) {
        return ''
    }

    if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
    ) {
        return String(value)
    }

    return JSON.stringify(value)
}

const buildDomainCanonicalLookup = (domainNames: string[]) => {
    const lookup = new Map<string, string>()
    domainNames.forEach(domainName => {
        const trimmed = domainName.trim()
        if (!trimmed) {
            return
        }

        const normalized = normalizeDomainName(trimmed)
        if (!normalized || lookup.has(normalized)) {
            return
        }

        lookup.set(normalized, trimmed)
    })
    return lookup
}

const normalizeCompanyDomainCellValue = (
    value: string,
    domainCanonicalLookup: Map<string, string>
) => {
    const normalized = normalizeDomainName(value)
    return domainCanonicalLookup.get(normalized) || value
}

const isCompanyDomainColumn = (columnName: string) => {
    const normalizedColumn = normalizeFieldKey(columnName)
    return /^companydomain\d*$/.test(normalizedColumn)
}

const getAdditionalDataFlowColumns = (
    rows: Array<Record<string, JsonValue>>
): string[] => {
    const requiredHeaderSet = new Set(REQUIRED_DATA_FLOW_COLUMNS)
    const additionalColumns: string[] = []

    rows.forEach(row => {
        Object.keys(row).forEach(key => {
            if (
                requiredHeaderSet.has(
                    key as (typeof REQUIRED_DATA_FLOW_COLUMNS)[number]
                )
            ) {
                return
            }

            if (!additionalColumns.includes(key)) {
                additionalColumns.push(key)
            }
        })
    })

    return additionalColumns
}

const createDataFlowWorksheet = (
    value: JsonValue,
    firstRowValue?: JsonValue,
    referenceDomainNames: string[] = []
): XLSX.WorkSheet => {
    const dataFlowRows = Array.isArray(value)
        ? (value.filter(
              item =>
                  item !== null &&
                  !Array.isArray(item) &&
                  typeof item === 'object'
          ) as Array<Record<string, JsonValue>>)
        : []

    const additionalColumns = getAdditionalDataFlowColumns(dataFlowRows)
    const allColumns = [...REQUIRED_DATA_FLOW_COLUMNS, ...additionalColumns]
    const domainCanonicalLookup =
        buildDomainCanonicalLookup(referenceDomainNames)

    const mappedRows = dataFlowRows.map(row => [
        ...REQUIRED_DATA_FLOW_COLUMNS.map(column =>
            column === 'Company Domain'
                ? normalizeCompanyDomainCellValue(
                      getMappedDataFlowCellValue(row, column),
                      domainCanonicalLookup
                  )
                : getMappedDataFlowCellValue(row, column)
        ),
        ...additionalColumns.map(column => {
            const cellValue = stringifyDataFlowValue(row[column])
            if (!cellValue || !isCompanyDomainColumn(column)) {
                return cellValue
            }

            return normalizeCompanyDomainCellValue(
                cellValue,
                domainCanonicalLookup
            )
        })
    ])

    return XLSX.utils.aoa_to_sheet([
        [stringifyCellValue(firstRowValue ?? '')],
        [],
        allColumns,
        ...mappedRows
    ])
}

const sheetNameFromKey = (key: string) =>
    (SHEET_NAME_OVERRIDES[key] || key).slice(0, 31)

const stringifyCellValue = (value: JsonValue): string => {
    if (value === null) {
        return ''
    }

    if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
    ) {
        return String(value)
    }

    return JSON.stringify(value)
}

const appendSheet = (
    workbook: XLSX.WorkBook,
    sheetName: string,
    value: JsonValue,
    firstRowValue?: JsonValue
) => {
    const hasFirstRowValue = firstRowValue !== undefined

    if (Array.isArray(value)) {
        const rows = value.filter(
            item =>
                item !== null &&
                !Array.isArray(item) &&
                typeof item === 'object'
        ) as Array<Record<string, JsonValue>>

        if (rows.length > 0) {
            if (hasFirstRowValue) {
                const worksheet = XLSX.utils.aoa_to_sheet([
                    [stringifyCellValue(firstRowValue)]
                ])
                XLSX.utils.sheet_add_json(worksheet, rows, {
                    origin: 'A2'
                })
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
                return
            }

            XLSX.utils.book_append_sheet(
                workbook,
                XLSX.utils.json_to_sheet(rows),
                sheetName
            )
            return
        }

        if (hasFirstRowValue) {
            const worksheet = XLSX.utils.aoa_to_sheet([
                [stringifyCellValue(firstRowValue)],
                [JSON.stringify(value)]
            ])
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
            return
        }

        XLSX.utils.book_append_sheet(
            workbook,
            XLSX.utils.aoa_to_sheet([['value'], [JSON.stringify(value)]]),
            sheetName
        )
        return
    }

    if (value !== null && typeof value === 'object') {
        const objectRows = Object.entries(
            value as Record<string, JsonValue>
        ).map(([key, cellValue]) => [
            key,
            cellValue === null || typeof cellValue !== 'object'
                ? String(cellValue ?? '')
                : JSON.stringify(cellValue)
        ])

        if (hasFirstRowValue) {
            const worksheet = XLSX.utils.aoa_to_sheet([
                [stringifyCellValue(firstRowValue)]
            ])
            XLSX.utils.sheet_add_aoa(
                worksheet,
                [['key', 'value'], ...objectRows],
                {
                    origin: 'A2'
                }
            )
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
            return
        }

        XLSX.utils.book_append_sheet(
            workbook,
            XLSX.utils.aoa_to_sheet([['key', 'value'], ...objectRows]),
            sheetName
        )
        return
    }

    if (hasFirstRowValue) {
        XLSX.utils.book_append_sheet(
            workbook,
            XLSX.utils.aoa_to_sheet([
                [stringifyCellValue(firstRowValue)],
                [String(value ?? '')]
            ]),
            sheetName
        )
        return
    }

    XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.aoa_to_sheet([['value'], [String(value ?? '')]]),
        sheetName
    )
}

const parseRows = (data?: JsonValue[] | null): PreviousArtifactRow[] => {
    if (!Array.isArray(data)) {
        return []
    }

    const parsedRows: PreviousArtifactRow[] = []
    data.forEach(item => {
        if (item && !Array.isArray(item) && typeof item === 'object') {
            parsedRows.push(item as PreviousArtifactRow)
        }
    })

    return parsedRows
}

export const PreviousArtifactsModal = (props: {
    isOpen: boolean
    onClose: () => void
    data?: JsonValue[] | null
    companyDomainNames?: string[]
}) => {
    const { isOpen, onClose, data, companyDomainNames = [] } = props

    const createReferenceWorksheet = (domainNames: string[]) => {
        const uniqueDomainNames = Array.from(
            new Set(domainNames.map(name => name.trim()).filter(Boolean))
        )
        const rows = uniqueDomainNames.map(domainName => [
            'Company Domain',
            domainName
        ])

        const worksheet = XLSX.utils.aoa_to_sheet([
            ['Column1.playbook_type_nm', 'Column1.playbook_nm'],
            ...rows
        ])

        worksheet.E2 = { t: 's', v: 'Yes' }
        worksheet.E3 = { t: 's', v: 'No' }

        const worksheetRange = XLSX.utils.decode_range(
            worksheet['!ref'] || 'A1:A1'
        )
        worksheetRange.e.c = Math.max(worksheetRange.e.c, 4)
        worksheetRange.e.r = Math.max(worksheetRange.e.r, 2)
        worksheet['!ref'] = XLSX.utils.encode_range(worksheetRange)

        return worksheet
    }

    const upsertSheet = (
        workbook: XLSX.WorkBook,
        sheetName: string,
        worksheet: XLSX.WorkSheet
    ) => {
        const existingIndex = workbook.SheetNames.indexOf(sheetName)
        if (existingIndex >= 0) {
            workbook.SheetNames.splice(existingIndex, 1)
            delete workbook.Sheets[sheetName]
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    }

    const rows = useMemo(
        () =>
            parseRows(data).filter(row =>
                hasDownloadablePayload(row.inp_fl_da)
            ),
        [data]
    )

    const handleClose = () => {
        onClose()
    }

    const handleDownloadTemplate = (
        row: PreviousArtifactRow,
        rowIndex: number
    ) => {
        const payload = row.inp_fl_da
        if (
            !payload ||
            !hasDataPayload(payload) ||
            !hasDownloadablePayload(payload)
        ) {
            return
        }

        const conceptualHeadingValue = payload.Conceptual_Heading
        const dataFlowHeadingValue = Object.entries(payload).find(([key]) =>
            isDataFlowHeadingKey(key)
        )?.[1]
        const isDataFlowPayload = Object.keys(payload).some(key =>
            isDataFlowDataKey(key)
        )

        const workbook = XLSX.utils.book_new()
        let appendedSheetCount = 0
        Object.entries(payload).forEach(([key, value]) => {
            if (isExcludedSheetKey(key)) {
                return
            }

            if (value === null) {
                return
            }

            if (Array.isArray(value) && value.length === 0) {
                return
            }

            if (
                !Array.isArray(value) &&
                typeof value === 'object' &&
                Object.keys(value as Record<string, unknown>).length === 0
            ) {
                return
            }

            const targetSheetName = sheetNameFromKey(key)

            if (isDataFlowPayload && isDataFlowDataKey(key)) {
                XLSX.utils.book_append_sheet(
                    workbook,
                    createDataFlowWorksheet(
                        value,
                        dataFlowHeadingValue,
                        companyDomainNames
                    ),
                    targetSheetName
                )
                appendedSheetCount += 1
                return
            }

            appendSheet(
                workbook,
                targetSheetName,
                value,
                key === 'Conceptual_Data'
                    ? conceptualHeadingValue
                    : isDataFlowPayload && isDataFlowDataKey(key)
                      ? dataFlowHeadingValue
                      : undefined
            )

            appendedSheetCount += 1
        })

        if (isDataFlowPayload) {
            upsertSheet(
                workbook,
                'Reference',
                createReferenceWorksheet(companyDomainNames)
            )
            appendedSheetCount += 1
        }

        if (appendedSheetCount === 0) {
            return
        }

        const fallbackName = `previous-artifact-${rowIndex + 1}`
        const fileName = normalizeFileName(row.inp_fl_nm, fallbackName)
        XLSX.writeFile(workbook, fileName)
    }

    const renderCellValue = (value: JsonValue | undefined) => {
        if (value === null) {
            return '-'
        }

        if (value === undefined) {
            return '-'
        }

        if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
        ) {
            return String(value)
        }

        return JSON.stringify(value)
    }

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={e => !e.open && handleClose()}
            placement='center'
        >
            <Dialog.Backdrop width={'100%'} height={'100%'} />
            <Dialog.Positioner>
                <Dialog.Content
                    style={{ width: '80%', maxWidth: '1700px' }}
                    height={{ mdDown: '80%' }}
                    overflow={'auto'}
                >
                    <Dialog.CloseTrigger asChild>
                        <CloseButton />
                    </Dialog.CloseTrigger>
                    <Dialog.Header
                        _dark={{
                            backgroundColor: '#111111 !important',
                            color: 'white'
                        }}
                    >
                        <Dialog.Title>Previously Used Templates</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.CloseTrigger />
                    <Dialog.Body>
                        {rows.length > 0 ? (
                            <Box>
                                <Table.ScrollArea>
                                    <Table.Root
                                        size='sm'
                                        minW='900px'
                                        color={{
                                            base: '#1f2937',
                                            _dark: 'white'
                                        }}
                                    >
                                        <Table.Header>
                                            <Table.Row
                                                backgroundColor={{
                                                    base: '#DDE9F4',
                                                    _dark: '#53565a'
                                                }}
                                            >
                                                {TABLE_COLUMNS.map(column => (
                                                    <Table.ColumnHeader
                                                        key={column.key}
                                                        color={{
                                                            base: 'black',
                                                            _dark: 'white'
                                                        }}
                                                    >
                                                        {column.label}
                                                    </Table.ColumnHeader>
                                                ))}
                                                <Table.ColumnHeader
                                                    color={{
                                                        base: 'black',
                                                        _dark: 'white'
                                                    }}
                                                >
                                                    Download
                                                </Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {rows.map((row, rowIndex) => (
                                                <Table.Row key={`${rowIndex}`}>
                                                    {TABLE_COLUMNS.map(
                                                        column => (
                                                            <Table.Cell
                                                                key={`${rowIndex}-${String(column.key)}`}
                                                                color={{
                                                                    base: '#1f2937',
                                                                    _dark: 'white'
                                                                }}
                                                            >
                                                                {renderCellValue(
                                                                    row[
                                                                        column
                                                                            .key
                                                                    ]
                                                                )}
                                                            </Table.Cell>
                                                        )
                                                    )}
                                                    <Table.Cell
                                                        color={{
                                                            base: '#1f2937',
                                                            _dark: 'white'
                                                        }}
                                                    >
                                                        <Button
                                                            size='xs'
                                                            colorPalette='blue'
                                                            variant='outline'
                                                            onClick={() =>
                                                                handleDownloadTemplate(
                                                                    row,
                                                                    rowIndex
                                                                )
                                                            }
                                                        >
                                                            Download
                                                        </Button>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                </Table.ScrollArea>
                            </Box>
                        ) : (
                            'No previously used templates found for the selected inputs.'
                        )}
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button
                            variant='outline'
                            colorPalette='blue'
                            onClick={handleClose}
                            // className={styles.closeButton}
                        >
                            Close
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
