/* istanbul ignore file */

import React, { useCallback, useRef, useState } from 'react'
import {
    Box,
    Dialog,
    Input,
    InputGroup,
    Portal,
    Text,
    VisuallyHidden
} from '@chakra-ui/react'
import { IconSearch } from '@americanexpress/dls-icons'
import { Domains, domainsLeftNav } from '@/app/api-docs/types/apiDocs'
import { SearchRow } from '@/app/api-docs/types/search'
import {
    useApiDocsSearchIndex,
    useSearchResults
} from '@/app/api-docs/components/hooks'
import styles from '@/app/api-docs/api-docs.module.scss'
import { SearchResultsList } from './SearchResultsList'
import { SearchEmptyState } from './SearchEmptyState'
import { SearchScopeBar } from './SearchScopeBar'
import { SearchFooterHints } from './SearchFooterHints'
import { SearchHelpPanel } from './SearchHelpPanel'
import { optionDomId } from './searchRowUtils'

const LISTBOX_ID = 'api-docs-search-listbox'

// A stable identity, so clearing the scope does not rebuild the result groups.
const EMPTY_SCOPE: ReadonlySet<string> = new Set<string>()

// Naming every scoped domain would overflow the input, so cap the list.
const describeScope = (names: string[]) =>
    names.length > 2
        ? `${names.slice(0, 2).join(', ')} +${names.length - 2}`
        : names.join(', ')

export default function SearchDialog({
    open,
    onOpenChange,
    sidebarData,
    domains,
    onNavigate,
    triggerRef
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    sidebarData: { [key: string]: domainsLeftNav }
    domains: Domains
    onNavigate: (id: string) => void
    triggerRef?: React.RefObject<HTMLButtonElement | null>
}) {
    const index = useApiDocsSearchIndex(sidebarData)
    const [query, setQuery] = useState('')
    const [highlightedKey, setHighlightedKey] = useState<string | null>(null)
    const [scope, setScope] = useState<ReadonlySet<string>>(EMPTY_SCOPE)
    const [scopeExpanded, setScopeExpanded] = useState(false)
    const [helpOpen, setHelpOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const { parsed, rows, toggleExpanded, isStale } = useSearchResults(
        index,
        query,
        scope
    )

    // The filtered tree is the source of truth; icons are looked up by id.
    const domainList = Object.values(sidebarData || {})
    const selectedDomains = domainList.filter(domain => scope.has(domain.id))
    const scopeLabel = describeScope(selectedDomains.map(d => d.name))

    // Row 0 is always highlighted so Enter never does nothing; the highlight is
    // tracked by row key so refetches and expansions do not shift it.
    const activeKey =
        highlightedKey && rows.some(row => row.key === highlightedKey)
            ? highlightedKey
            : (rows[0]?.key ?? null)

    // Clear on open rather than on close, so the browse state does not flash
    // through the exit animation.
    const [wasOpen, setWasOpen] = useState(open)
    if (open !== wasOpen) {
        setWasOpen(open)
        if (open) {
            setQuery('')
            setHighlightedKey(null)
            setScope(EMPTY_SCOPE)
            setScopeExpanded(false)
            setHelpOpen(false)
        }
    }

    const closeHelp = useCallback(() => {
        setHelpOpen(false)
        inputRef.current?.focus()
    }, [])

    const closeDialog = useCallback(() => onOpenChange(false), [onOpenChange])

    const toggleDomain = useCallback((domainId: string) => {
        setScope(prev => {
            const next = new Set(prev)
            if (!next.delete(domainId)) next.add(domainId)
            return next
        })
    }, [])

    const navigateTo = useCallback(
        (id: string) => {
            closeDialog()
            // Scroll lock is released and focus is restored before the handoff,
            // otherwise scrollIntoView gets clamped by the locked body.
            requestAnimationFrame(() => {
                triggerRef?.current?.focus({ preventScroll: true })
                onNavigate(id)
            })
        },
        [closeDialog, onNavigate, triggerRef]
    )

    const selectRow = useCallback(
        (row: SearchRow) => {
            if (row.type === 'expandApis' || row.type === 'expandOps') {
                // The expander disappears once expanded; anchor the highlight
                // on the row above so it does not jump back to the top.
                const position = rows.findIndex(item => item.key === row.key)
                setHighlightedKey(position > 0 ? rows[position - 1].key : null)
                toggleExpanded(row.key)
                return
            }
            navigateTo(row.navId)
        },
        [navigateTo, rows, toggleExpanded]
    )

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // Enter during IME candidate selection must not pick a result.
        if (event.nativeEvent.isComposing) return

        // Gated on an empty input so a literal `?` mid-query is never hijacked.
        if (event.key === '?' && !query) {
            event.preventDefault()
            setHelpOpen(value => !value)
            return
        }

        // No listbox is rendered behind the help panel, so navigation would
        // only drive an invisible highlight.
        if (helpOpen) return

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            if (!rows.length) return
            event.preventDefault()
            const position = rows.findIndex(row => row.key === activeKey)
            const next =
                event.key === 'ArrowDown'
                    ? (position + 1) % rows.length
                    : position <= 0
                      ? rows.length - 1
                      : position - 1
            setHighlightedKey(rows[next].key)
            return
        }

        if (event.key === 'Enter') {
            const row = rows.find(item => item.key === activeKey)
            if (!row) return
            event.preventDefault()
            selectRow(row)
        }
    }

    const hasQuery = parsed.tokens.length > 0

    return (
        <Dialog.Root
            open={open}
            onOpenChange={details =>
                details.open ? onOpenChange(true) : closeDialog()
            }
            placement='center'
            size='lg'
            closeOnEscape={!helpOpen}
            lazyMount
            unmountOnExit
            restoreFocus={false}
            initialFocusEl={() => inputRef.current}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        p={0}
                        overflow='hidden'
                        // On the content rather than the input, because
                        // clicking the footer link moves focus off the input.
                        onKeyDown={event => {
                            if (event.key === 'Escape' && helpOpen) closeHelp()
                        }}
                    >
                        <VisuallyHidden>
                            <Dialog.Title>
                                Search API documentation
                            </Dialog.Title>
                        </VisuallyHidden>
                        <Box
                            px={3}
                            py={3}
                            borderBottomWidth='1px'
                            borderColor='#D4DEE9'
                            _dark={{ borderColor: '#3c4250' }}
                        >
                            <InputGroup
                                startElement={
                                    <IconSearch
                                        size='sm'
                                        className={styles.searchIcon}
                                    />
                                }
                            >
                                <Input
                                    ref={inputRef}
                                    role='combobox'
                                    aria-expanded={hasQuery && !helpOpen}
                                    aria-controls={LISTBOX_ID}
                                    aria-autocomplete='list'
                                    aria-activedescendant={
                                        activeKey
                                            ? optionDomId(activeKey)
                                            : undefined
                                    }
                                    id='api-docs-search-input'
                                    placeholder={
                                        scopeLabel
                                            ? `Search in ${scopeLabel}…`
                                            : 'Search company domains, APIs, operations…'
                                    }
                                    value={query}
                                    onChange={event => {
                                        // Help must never block a query in
                                        // progress.
                                        setHelpOpen(false)
                                        setQuery(event.target.value)
                                    }}
                                    onKeyDown={handleKeyDown}
                                    variant='flushed'
                                    border='none'
                                    _focusVisible={{ boxShadow: 'none' }}
                                />
                            </InputGroup>
                        </Box>

                        {Boolean(domainList.length) && (
                            <SearchScopeBar
                                domainList={domainList}
                                domains={domains}
                                selected={scope}
                                onToggle={toggleDomain}
                                onClear={() => setScope(EMPTY_SCOPE)}
                                collapsed={hasQuery && !scopeExpanded}
                                onExpand={() => setScopeExpanded(true)}
                            />
                        )}

                        {helpOpen ? (
                            <SearchHelpPanel onBack={closeHelp} />
                        ) : hasQuery ? (
                            <SearchResultsList
                                rows={rows}
                                tokens={parsed.tokens}
                                domains={domains}
                                activeKey={activeKey}
                                stale={isStale}
                                onSelectRow={selectRow}
                                onHoverRow={setHighlightedKey}
                                listboxId={LISTBOX_ID}
                            />
                        ) : (
                            <SearchEmptyState
                                sidebarData={sidebarData}
                                selectedDomains={selectedDomains}
                                onNavigate={navigateTo}
                            />
                        )}

                        {hasQuery && !helpOpen && !rows.length && (
                            <Box px={4} py={6} fontSize='sm' color='gray.500'>
                                No matches for “{parsed.raw}”
                                {scopeLabel ? ` in ${scopeLabel}` : ''}.
                            </Box>
                        )}

                        <Text
                            aria-live='polite'
                            position='absolute'
                            width='1px'
                            height='1px'
                            overflow='hidden'
                            clipPath='inset(50%)'
                        >
                            {hasQuery ? `${rows.length} results` : ''}
                        </Text>

                        <SearchFooterHints
                            helpOpen={helpOpen}
                            onToggleHelp={() =>
                                helpOpen ? closeHelp() : setHelpOpen(true)
                            }
                        />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
