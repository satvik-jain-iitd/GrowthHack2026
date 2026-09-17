/* istanbul ignore file */

import React, { useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { Domains } from '@/app/api-docs/types/apiDocs'
import { SearchRow } from '@/app/api-docs/types/search'
import styles from './search.module.scss'
import { SearchGroupHeaderRow } from './SearchGroupHeaderRow'
import { SearchOperationRow } from './SearchOperationRow'
import { SearchExpanderRow } from './SearchExpanderRow'
import { optionDomId } from './searchRowUtils'

const plural = (count: number, noun: string) =>
    `${count} ${noun}${count === 1 ? '' : 's'}`

export function SearchResultsList({
    rows,
    tokens,
    domains,
    activeKey,
    stale,
    onSelectRow,
    onHoverRow,
    listboxId
}: {
    rows: SearchRow[]
    tokens: string[]
    domains: Domains
    activeKey: string | null
    stale: boolean
    onSelectRow: (row: SearchRow) => void
    onHoverRow: (key: string) => void
    listboxId: string
}) {
    // block: 'nearest' only — the body is scroll-locked while the dialog is open.
    useEffect(() => {
        if (!activeKey) return
        document
            .getElementById(optionDomId(activeKey))
            ?.scrollIntoView({ block: 'nearest' })
    }, [activeKey])

    return (
        <Box
            role='listbox'
            id={listboxId}
            aria-label='API documentation search results'
            className={styles.searchList}
            maxH='60vh'
            overflowY='auto'
            px={1}
            py={2}
            opacity={stale ? 0.6 : 1}
        >
            {rows.map(row => {
                const active = row.key === activeKey
                const select = () => onSelectRow(row)
                const hover = () => onHoverRow(row.key)

                if (row.type === 'domain') {
                    return (
                        <SearchGroupHeaderRow
                            key={row.key}
                            rowKey={row.key}
                            level='domain'
                            domainId={row.group.entry.id}
                            domains={domains}
                            name={row.group.entry.name}
                            countLabel={plural(row.group.totalApis, 'API')}
                            tokens={tokens}
                            active={active}
                            onSelect={select}
                            onHover={hover}
                        />
                    )
                }
                if (row.type === 'api') {
                    return (
                        <SearchGroupHeaderRow
                            key={row.key}
                            rowKey={row.key}
                            level='api'
                            domainId=''
                            domains={domains}
                            name={row.group.entry.name}
                            description={row.group.entry.description}
                            countLabel={plural(
                                row.group.totalOperations,
                                'operation'
                            )}
                            tokens={tokens}
                            active={active}
                            onSelect={select}
                            onHover={hover}
                        />
                    )
                }
                if (row.type === 'operation') {
                    return (
                        <SearchOperationRow
                            key={row.key}
                            rowKey={row.key}
                            result={row.result}
                            tokens={tokens}
                            active={active}
                            onSelect={select}
                            onHover={hover}
                        />
                    )
                }
                return (
                    <SearchExpanderRow
                        key={row.key}
                        rowKey={row.key}
                        indent={row.type === 'expandApis' ? 7 : 11}
                        label={
                            row.type === 'expandApis'
                                ? `Show all ${row.hidden} more APIs`
                                : `Show all ${row.hidden} more operations`
                        }
                        active={active}
                        onSelect={select}
                        onHover={hover}
                    />
                )
            })}
        </Box>
    )
}
