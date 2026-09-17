/* istanbul ignore file */
'use client'
import { useNavigation } from '@/hooks'
import React, { useState, useMemo, useEffect } from 'react'
import {
    Combobox,
    InputGroup,
    VStack,
    Card,
    Portal,
    Span,
    Spinner,
    useListCollection,
    SystemStyleObject,
    Box,
    Text
} from '@chakra-ui/react'
import debounce from 'lodash.debounce'
import { SearchResult } from '@/types/SearchResult'
import { IconSearch, IconDocument } from '@americanexpress/dls-icons'
import { fetchWithToken } from '@/utils/client'
import styles from './AutocompleteSearch.module.scss'

function itemToValue(item: SearchResult | null): string {
    return item ? item.fl_id : ''
}

function itemToString(item: SearchResult | null): string {
    return item ? item.fl_id : ''
}

function getItemName(item: SearchResult): string {
    if (item.playbook_type_nm) {
        return item.playbook_type_nm + ' / ' + item.playbook_nm
    }
    return item.playbook_nm
}

export default function AutocompleteSearch({
    css
}: {
    css?:
        | SystemStyleObject
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | Omit<(SystemStyleObject | undefined)[], keyof any[]>
}) {
    const router = useNavigation()
    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const { collection, set } = useListCollection<SearchResult>({
        initialItems: [],
        itemToString,
        itemToValue
    })

    const debouncedSearch = useMemo(
        () =>
            debounce(async (text: string) => {
                if (!text) {
                    set([])
                    return
                }
                setIsLoading(true)
                try {
                    const res = await fetchWithToken(`/api/search?q=${text}`)
                    const result = await res.json()
                    const hits = result.hits || []
                    set(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        hits.map((hit: any) => {
                            const doc = hit.document
                            const highlight = hit.highlight || {}
                            return {
                                fl_id: doc.uuid,
                                title: highlight.title?.snippet || doc.title,
                                playbook_nm:
                                    highlight.playbook_nm?.snippet ||
                                    doc.playbook_nm,
                                playbook_type_nm: doc.playbook_type_nm,
                                snippet:
                                    highlight.content?.snippet ||
                                    doc.content?.slice(0, 120) ||
                                    ''
                            } as SearchResult
                        })
                    )
                } catch (error) {
                    console.error('Error fetching search results:', error)
                    if (error instanceof Error) {
                        setError(error.message)
                    } else {
                        setError(String(error))
                    }
                    set([])
                } finally {
                    setIsLoading(false)
                }
            }, 500),
        [set]
    )

    useEffect(() => {
        debouncedSearch(inputValue)
        return debouncedSearch.cancel
    }, [inputValue, debouncedSearch])

    return (
        <Combobox.Root
            size='sm'
            mr={2}
            css={{
                width: '200px',
                ...(css && typeof css === 'object' ? css : {}),
                fontSize: 'var(--navbar-font-size)'
            }}
            collection={collection}
            placeholder='Search...'
            selectionBehavior='clear'
            inputValue={inputValue}
            onInputValueChange={e => setInputValue(e.inputValue)}
            positioning={{ sameWidth: false, placement: 'bottom-start' }}
            onSelect={details => {
                const selected = collection.items?.find(
                    item => itemToValue(item) === details.itemValue
                )
                if (selected && selected.fl_id) {
                    setInputValue('')
                    router.push(`/docs/${selected.fl_id}`)
                }
            }}
        >
            <Combobox.Control>
                <InputGroup
                    startElement={<IconSearch size='xs' color='neutral' />}
                >
                    <Combobox.Input
                        color='fg'
                        placeholder='Search'
                        bg={{ base: 'gray.200', _dark: 'gray.900' }}
                        borderRadius='2xl'
                    />
                </InputGroup>
                <Combobox.IndicatorGroup>
                    {isLoading && (
                        <Spinner color='fg' size='xs' borderWidth='1px' />
                    )}
                    <Combobox.ClearTrigger />
                </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content
                        minW='sm'
                        zIndex={1202}
                        className={styles.searchResults}
                        bg='bg.muted'
                    >
                        {error ? (
                            <Span p='2' color='fg.error'>
                                Error fetching search results: {error}
                            </Span>
                        ) : (
                            collection.items?.map(option => (
                                <Combobox.Item key={option.fl_id} item={option}>
                                    <Card.Root
                                        size='sm'
                                        variant='outline'
                                        width='100%'
                                        textAlign='left'
                                        borderRadius='10px'
                                        bg='bg.panel'
                                        _hover={{
                                            bg: {
                                                base: 'bg.info',
                                                _dark: 'bg.muted'
                                            },
                                            cursor: 'pointer'
                                        }}
                                        padding={0}
                                    >
                                        <Card.Body p={2} ml={2}>
                                            <Box
                                                my={1}
                                                display='flex'
                                                alignItems='center'
                                            >
                                                <IconDocument
                                                    className={
                                                        styles.documentIcon
                                                    }
                                                />
                                                <VStack
                                                    align='start'
                                                    gap={0}
                                                    ml={4}
                                                >
                                                    <Text
                                                        fontWeight='semibold'
                                                        textStyle='md'
                                                        dangerouslySetInnerHTML={{
                                                            __html: option.title
                                                        }}
                                                    />
                                                    <Text
                                                        textStyle='sm'
                                                        color='fg.muted'
                                                        dangerouslySetInnerHTML={{
                                                            __html: getItemName(
                                                                option
                                                            )
                                                        }}
                                                    />
                                                    <Text
                                                        textStyle='sm'
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                '...' +
                                                                option.snippet +
                                                                '...'
                                                        }}
                                                    />
                                                </VStack>
                                            </Box>
                                        </Card.Body>
                                    </Card.Root>
                                    <Combobox.ItemIndicator />
                                </Combobox.Item>
                            ))
                        )}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    )
}
