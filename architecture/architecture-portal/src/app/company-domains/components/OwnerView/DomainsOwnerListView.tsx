import React, { useEffect, useState } from 'react'
import { DomainsOwnerListItem } from './DomainsOwnerListItem'
import { Table } from '@chakra-ui/react'
import styles from '../../domains-page.module.scss'
import { DOMAIN_TEST_IDS } from '../../test-ids'
import { Domain } from '../../types/domains'
import { IconChevronDown, IconChevronUp } from '@americanexpress/dls-icons'

enum Categories {
    domain_nm = 'Domains',
    domain_category_nm = 'Category',
    unit_cio_nm = 'Unit CIO',
    tech_owner_nm = 'Tech Owner',
    head_engineer_nm = 'Head Engineer',
    princ_ea_architect_nm = 'Principal Architect',
    ea_architect_nm = 'Enterprise Architect',
    unit_cio_delegate = 'Unit CIO Architect (delegate)'
}
const SORT_KEY_MAP: Record<string, keyof Domain> = {
    domain_nm: 'domain_nm',
    domain_category_nm: 'domain_category_nm',
    unit_cio_nm: 'unit_cio_nm',
    tech_owner_nm: 'tech_owner_nm',
    head_engineer_nm: 'head_engnr_email_ad_da',
    princ_ea_architect_nm: 'princ_ea_archt_email_ad_da',
    ea_architect_nm: 'ea_archt_email_ad_da',
    unit_cio_delegate: 'ea_architect_delegate_nm'
}
export const DomainsOwnerListView = ({ domains }: { domains?: Domain[] }) => {
    const [tableData, setTableData] = useState(domains)
    const [sortTable, setSortTable] = useState({
        sortOrder: '',
        sortColumn: ''
    })

    useEffect(() => {
        setTableData(domains)
    }, [domains])

    const handleSort = (uiKey: string) => {
        const key = SORT_KEY_MAP[uiKey]
        if (!key || !tableData) return

        let direction = 'ASC'
        if (sortTable.sortColumn === uiKey && sortTable.sortOrder === 'ASC') {
            direction = 'DESC'
        }

        const data = [...tableData].sort((a, b) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const getValue = (obj: any) => {
                const val = obj[key]
                if (Array.isArray(val)) return val[0] || ''
                if (val === null || val === undefined) return ''
                return String(val)
            }

            const aVal = getValue(a)
            const bVal = getValue(b)

            return direction === 'ASC'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal)
        })

        setTableData(data)
        setSortTable({ sortOrder: direction, sortColumn: uiKey })
    }
    return (
        <Table.ScrollArea
            height='80vh'
            maxW={{ base: '100vw', lg: '100%' }}
            scrollbar='hidden'
        >
            <Table.Root
                className={`excludeExpand ${styles.domainListView}`}
                backgroundColor='transparent'
                paddingX='1rem'
                data-testid={DOMAIN_TEST_IDS.ownerTable}
                stickyHeader
            >
                <Table.Header>
                    <Table.Row
                        backgroundColor={{ base: 'fg.info', _dark: '#53565a' }}
                    >
                        {Object.keys(Categories).map(key => (
                            <Table.ColumnHeader
                                key={key}
                                onClick={() => {
                                    handleSort(key as keyof Domain)
                                }}
                                style={{
                                    color: '#ffffff'
                                }}
                            >
                                <div>
                                    {Categories[key as keyof typeof Categories]}{' '}
                                    {sortTable.sortColumn === key ? (
                                        sortTable.sortOrder === 'ASC' ? (
                                            <IconChevronUp
                                                isFilled
                                                color='white'
                                                style={{ marginLeft: '5px' }}
                                            />
                                        ) : (
                                            <IconChevronDown
                                                isFilled
                                                color='white'
                                                style={{ marginLeft: '5px' }}
                                            />
                                        )
                                    ) : (
                                        <IconChevronDown
                                            isFilled
                                            color='white'
                                            style={{ marginLeft: '5px' }}
                                        />
                                    )}
                                </div>
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body backgroundColor='transparent'>
                    {tableData?.map(x => (
                        <DomainsOwnerListItem
                            key={x.domain_nm}
                            title={x.domain_nm}
                            group={x.domain_category_nm}
                            playbookId={x.playbook_id}
                            imgSrcLM={x.im_light_tx}
                            imgSrcDM={x.im_dark_tx}
                            imgSrcFilledLM={x.im_fill_light_tx}
                            imgSrcFilledDM={x.im_fill_dark_tx}
                            unitCIO={x.unit_cio_email_ad_da[0]}
                            techOwner={x.tech_own_email_ad_da[0]}
                            principalArchitect={x.princ_ea_archt_email_ad_da[0]}
                            enterpriseArchitect={x.ea_archt_email_ad_da[0]}
                            headEngineer={x.head_engnr_email_ad_da[0]}
                            unitCIODelegate={x.ea_architect_delegate_nm}
                        />
                    ))}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    )
}
