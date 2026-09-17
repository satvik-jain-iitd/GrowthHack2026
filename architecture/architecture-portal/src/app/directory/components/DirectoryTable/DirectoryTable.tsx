/* istanbul ignore file */
import { Table } from '@chakra-ui/react'
import React, { useState } from 'react'
import { DirectoryTableRow } from './DirectoryTableRow'
import { Domain } from '@/app/company-domains/types'
import { IconChevronDown, IconChevronUp } from '@americanexpress/dls-icons'
import { DIRECTORY_TEST_IDS } from '@/app/directory/test-ids'

enum Columns {
    domain = 'domain_nm',
    unitCio = 'unit_cio_nm',
    techOwner = 'tech_owner_nm',
    principalEaArchitect = 'principal_ea_architect_nm'
}

export const DirectoryTable = ({
    domains,
    setDomains
}: {
    domains: Domain[] | undefined
    setDomains: (result: Domain[] | undefined) => void
}) => {
    const [sortTable, setSortTable] = useState({
        sortOrder: '',
        sortColumn: ''
    })
    const [openRowId, setOpenRowId] = useState<string | null>(null)
    const handleSort = (key: keyof Domain) => {
        let direction = 'ASC'
        if (sortTable.sortColumn === key && sortTable.sortOrder === 'ASC') {
            direction = 'DESC'
        }

        const data =
            domains &&
            [...domains].sort((a, b) => {
                const aValueToCompare = String(a[key])
                const bValueToCompare = String(b[key])

                return direction === 'ASC'
                    ? aValueToCompare?.localeCompare(bValueToCompare)
                    : bValueToCompare?.localeCompare(aValueToCompare)
            })

        setDomains(data)
        setSortTable({ sortOrder: direction, sortColumn: key })
    }

    return (
        <Table.ScrollArea height='90vh' scrollbar='hidden'>
            <Table.Root
                id='directory-table'
                stickyHeader
                data-testid={DIRECTORY_TEST_IDS.directoryTable}
                minW='1000px'
            >
                <Table.Header>
                    <Table.Row
                        backgroundColor={{ base: '#DDE9F4', _dark: '#53565a' }}
                        height='48px'
                        justifyContent='space-between'
                    >
                        <Table.ColumnHeader
                            onClick={() => {
                                handleSort(Columns.domain)
                            }}
                            color={{ base: 'black', _dark: 'white' }}
                            width='35%'
                            fontWeight='600'
                        >
                            Company Domain Name
                            {sortTable.sortColumn === Columns.domain ? (
                                <IconChevronUp
                                    isFilled
                                    color='black'
                                    style={{
                                        marginLeft: '5px',
                                        rotate:
                                            sortTable.sortOrder === 'ASC'
                                                ? '0deg'
                                                : '180deg'
                                    }}
                                />
                            ) : (
                                <IconChevronDown
                                    isFilled
                                    color='black'
                                    style={{ marginLeft: '5px' }}
                                />
                            )}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            onClick={() => {
                                handleSort(Columns.unitCio)
                            }}
                            color={{ base: 'black', _dark: 'white' }}
                            width='20%'
                            fontWeight='600'
                        >
                            Unit CIO
                            {sortTable.sortColumn === Columns.unitCio ? (
                                <IconChevronUp
                                    isFilled
                                    color='black'
                                    style={{
                                        marginLeft: '5px',
                                        rotate:
                                            sortTable.sortOrder === 'ASC'
                                                ? '0deg'
                                                : '180deg'
                                    }}
                                />
                            ) : (
                                <IconChevronDown
                                    isFilled
                                    color='black'
                                    style={{ marginLeft: '5px' }}
                                />
                            )}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            onClick={() => {
                                handleSort(Columns.techOwner)
                            }}
                            color={{ base: 'black', _dark: 'white' }}
                            width='20%'
                            fontWeight='600'
                        >
                            Tech Owner
                            {sortTable.sortColumn === Columns.techOwner ? (
                                <IconChevronUp
                                    isFilled
                                    color='black'
                                    style={{
                                        marginLeft: '5px',
                                        rotate:
                                            sortTable.sortOrder === 'ASC'
                                                ? '0deg'
                                                : '180deg'
                                    }}
                                />
                            ) : (
                                <IconChevronDown
                                    isFilled
                                    color='black'
                                    style={{ marginLeft: '5px' }}
                                />
                            )}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            onClick={() => {
                                handleSort(Columns.principalEaArchitect)
                            }}
                            color={{ base: 'black', _dark: 'white' }}
                            width='20%'
                            fontWeight='600'
                        >
                            Principal Architect
                            {sortTable.sortColumn ===
                            Columns.principalEaArchitect ? (
                                <IconChevronUp
                                    isFilled
                                    color='black'
                                    style={{
                                        marginLeft: '5px',
                                        rotate:
                                            sortTable.sortOrder === 'ASC'
                                                ? '0deg'
                                                : '180deg'
                                    }}
                                />
                            ) : (
                                <IconChevronDown
                                    isFilled
                                    color='black'
                                    style={{ marginLeft: '5px' }}
                                />
                            )}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            color={{ base: 'black', _dark: 'white' }}
                            width='5%'
                            fontWeight='600'
                        >
                            Action
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {domains?.length ? (
                        domains.map(domain => (
                            <DirectoryTableRow
                                key={domain.domain_nm}
                                domain={domain}
                                rowId={domain.company_domain_id}
                                openRowId={openRowId}
                                setOpenRowId={setOpenRowId}
                            />
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell
                                colSpan={5}
                                textAlign='center'
                                py='12'
                                color='gray.fg'
                            >
                                No company Domains found
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    )
}
