/* istanbul ignore file */

import { Badge, Box, HStack, Input, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import { SelectField } from '@/app/initiatives/components/consumer-api/SelectField'
import { ApiType, SearchResult } from './ConsumerApiAdd.types'
import { ConsumerApiTypeFilter } from './ConsumerApiTypeFilter'
import { useEffect, useRef, useState, useCallback } from 'react'
import { statusMap } from '@/app/company-domains/constants'
import { statusKeyMap } from '@/app/company-domains/components/LandingPage/Status'

function getStatusKey(operationStatus: string): keyof typeof statusMap {
    const normalStatus: keyof typeof statusKeyMap =
        operationStatus === ''
            ? 'DRAFT'
            : (operationStatus
                  ?.trim()
                  .toUpperCase() as keyof typeof statusKeyMap)

    return (statusKeyMap[normalStatus] || 'draft') as keyof typeof statusMap
}

export function ConsumerApiSearch({
    searchQuery,
    setSearchQuery,
    selectedResult,
    setSelectedResult,
    typeaheadResults,
    showDropdown,
    setShowDropdown,
    onDropdownScroll,
    isDebouncing,
    shouldSearchTypeC,
    isExplorerFetching,
    debouncedQuery,
    apiTypeOptions,
    selectedApiTypes,
    typeValidationError,
    onFilterChange,
    consumerCompanyDomain,
    consumerDomainOptions,
    onConsumerDomainChange
}: {
    searchQuery: string
    setSearchQuery: (query: string) => void
    selectedResult: SearchResult | null
    setSelectedResult: (value: SearchResult | null) => void
    typeaheadResults: SearchResult[]
    showDropdown: boolean
    setShowDropdown: (show: boolean) => void
    onDropdownScroll: (event: React.UIEvent<HTMLDivElement>) => void
    isDebouncing: boolean
    shouldSearchTypeC: boolean
    isExplorerFetching: boolean
    debouncedQuery: string
    apiTypeOptions: readonly ApiType[]
    selectedApiTypes: ApiType[]
    typeValidationError: string
    onFilterChange: (type: ApiType, checked: boolean) => void
    consumerCompanyDomain: string
    consumerDomainOptions: Array<{ label: string; value: string }>
    onConsumerDomainChange: (value: string) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)

    const handleOptionSelect = useCallback(
        (option: SearchResult) => {
            setSelectedResult(option)
            setSearchQuery(option.operationName)
            setShowDropdown(false)
            setHighlightedIndex(-1)
        },
        [setSearchQuery, setShowDropdown, setSelectedResult]
    )

    const effectiveHighlightedIndex = (() => {
        if (!showDropdown || typeaheadResults.length === 0) {
            return -1
        }

        if (highlightedIndex < 0) {
            return 0
        }

        return Math.min(highlightedIndex, typeaheadResults.length - 1)
    })()

    const scrollToOption = useCallback((index: number) => {
        if (index < 0) {
            return
        }

        const optionElement = dropdownRef.current?.querySelector(
            `[data-option-index="${index}"]`
        )

        optionElement?.scrollIntoView({ block: 'nearest' })
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node

            if (inputRef.current?.contains(target)) {
                return
            }

            if (dropdownRef.current?.contains(target)) {
                return
            }

            setShowDropdown(false)
            setHighlightedIndex(-1)
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [setShowDropdown])

    return (
        <HStack gap={4} w='100%' align='stretch'>
            <Box position='relative' minW='380px'>
                <Text fontSize='14px' fontWeight={500} mb={1}>
                    Select APIs
                    <Text as='span' color='red'>
                        *
                    </Text>
                </Text>
                <Input
                    ref={inputRef}
                    placeholder='Search APIs in Portal and Explorer'
                    value={searchQuery}
                    onChange={e => {
                        setSearchQuery(e.target.value)
                        setShowDropdown(true)
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={e => {
                        if (!showDropdown) {
                            return
                        }

                        if (e.key === 'ArrowDown') {
                            e.preventDefault()

                            if (typeaheadResults.length === 0) {
                                return
                            }

                            const nextIndex =
                                effectiveHighlightedIndex < 0
                                    ? 0
                                    : Math.min(
                                          effectiveHighlightedIndex + 1,
                                          typeaheadResults.length - 1
                                      )

                            setHighlightedIndex(nextIndex)
                            scrollToOption(nextIndex)
                        }

                        if (e.key === 'ArrowUp') {
                            e.preventDefault()

                            if (typeaheadResults.length === 0) {
                                return
                            }

                            const nextIndex =
                                effectiveHighlightedIndex < 0
                                    ? typeaheadResults.length - 1
                                    : Math.max(effectiveHighlightedIndex - 1, 0)

                            setHighlightedIndex(nextIndex)
                            scrollToOption(nextIndex)
                        }

                        if (e.key === 'Enter') {
                            if (typeaheadResults.length === 0) {
                                return
                            }

                            e.preventDefault()
                            const selectedIndex = effectiveHighlightedIndex
                            handleOptionSelect(typeaheadResults[selectedIndex])
                        }

                        if (e.key === 'Escape') {
                            setShowDropdown(false)
                            setHighlightedIndex(-1)
                        }
                    }}
                    borderColor={selectedResult ? '#48BB78' : 'inherit'}
                />

                {showDropdown && (
                    <VStack
                        ref={dropdownRef}
                        position='absolute'
                        top='100%'
                        left={0}
                        right={0}
                        bg='white'
                        border='1px solid #E2E8F0'
                        borderRadius='md'
                        mt={1}
                        zIndex={10}
                        maxH='320px'
                        overflowY='auto'
                        overflowX='hidden'
                        align='stretch'
                        gap={0}
                        onScroll={onDropdownScroll}
                    >
                        {typeaheadResults.map((option, index) => (
                            <Box
                                key={`${option.source}-${option.id}`}
                                data-option-index={index}
                                aria-selected={
                                    effectiveHighlightedIndex === index
                                }
                                w='100%'
                                px={2}
                                py={2.5}
                                minH='56px'
                                overflow='hidden'
                                bg={
                                    effectiveHighlightedIndex === index
                                        ? '#EDF2F7'
                                        : 'white'
                                }
                                _hover={{
                                    bg: '#F7FAFC',
                                    cursor: 'pointer'
                                }}
                                _dark={{
                                    bg:
                                        effectiveHighlightedIndex === index
                                            ? '#2D3748'
                                            : '#1A202C',
                                    _hover: {
                                        bg: '#2D3748',
                                        cursor: 'pointer'
                                    }
                                }}
                                borderBottom='1px solid #E2E8F0'
                                onMouseEnter={() => {
                                    setHighlightedIndex(index)
                                    scrollToOption(index)
                                }}
                                onClick={() => handleOptionSelect(option)}
                            >
                                <HStack
                                    align='flex-start'
                                    gap={2}
                                    w='100%'
                                    minW={0}
                                >
                                    {option.source === 'portal' ? (
                                        <Image
                                            src='/company-domains/aplogo.svg'
                                            alt='Architecture Portal Icon'
                                            width={14}
                                            height={14}
                                            style={{ marginTop: 2 }}
                                        />
                                    ) : (
                                        <Image
                                            src='/company-domains/Explorer_logo_icon.svg'
                                            alt='Explorer Icon'
                                            width={14}
                                            height={12}
                                            style={{ marginTop: 2 }}
                                        />
                                    )}
                                    <VStack
                                        align='start'
                                        gap={1}
                                        w='100%'
                                        minW={0}
                                    >
                                        <HStack
                                            justify='space-between'
                                            w='100%'
                                            gap={2}
                                        >
                                            <Text
                                                fontSize='13px'
                                                lineHeight='18px'
                                                flex={1}
                                                minW={0}
                                                overflow='hidden'
                                                textOverflow='ellipsis'
                                                whiteSpace='nowrap'
                                            >
                                                {option.operationName}
                                            </Text>
                                            {option.source === 'portal' && (
                                                <Badge
                                                    backgroundColor={
                                                        statusMap[
                                                            getStatusKey(
                                                                option.operationStatus
                                                            )
                                                        ]?.color ?? 'gray'
                                                    }
                                                    fontSize='8px'
                                                    px={1.5}
                                                    py={0}
                                                    borderRadius='xl'
                                                    fontWeight={600}
                                                    flexShrink={0}
                                                    whiteSpace='nowrap'
                                                    color='black'
                                                    _dark={{ color: 'white' }}
                                                >
                                                    {
                                                        statusMap[
                                                            getStatusKey(
                                                                option.operationStatus
                                                            )
                                                        ]?.label
                                                    }
                                                </Badge>
                                            )}
                                        </HStack>
                                        <Text
                                            fontSize='11px'
                                            lineHeight='16px'
                                            color='#718096'
                                            w='100%'
                                            overflow='hidden'
                                            textOverflow='ellipsis'
                                            whiteSpace='nowrap'
                                        >
                                            {option.source === 'portal'
                                                ? `${option.apiType} | ${option.apiName} | ${option.providerCompanyDomain}`
                                                : `${option.method ? option.method.toUpperCase() + ' | ' : ''} ${option.apiType || 'Type C'} | API Explorer`}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        ))}

                        {(isDebouncing ||
                            (shouldSearchTypeC && isExplorerFetching)) && (
                            <Box w='100%' p={2} textAlign='center'>
                                <Text fontSize='12px' color='#718096'>
                                    Searching APIs...
                                </Text>
                            </Box>
                        )}

                        {!isDebouncing &&
                            !(shouldSearchTypeC && isExplorerFetching) &&
                            typeaheadResults.length === 0 &&
                            debouncedQuery && (
                                <Box w='100%' p={2} textAlign='center'>
                                    <Text fontSize='12px' color='#718096'>
                                        No APIs found
                                    </Text>
                                </Box>
                            )}
                    </VStack>
                )}
            </Box>

            <ConsumerApiTypeFilter
                options={apiTypeOptions}
                selectedApiTypes={selectedApiTypes}
                typeValidationError={typeValidationError}
                onFilterChange={onFilterChange}
            />

            <SelectField
                id='consumerCompanyDomain'
                name='consumerCompanyDomain'
                label='Consumer Company Domain'
                placeholder='Select a Consumer Company Domain'
                value={consumerCompanyDomain}
                options={consumerDomainOptions}
                required
                disabled={!selectedResult}
                title={
                    !selectedResult
                        ? 'Please select an API first'
                        : 'Select a consumer company domain'
                }
                onChange={onConsumerDomainChange}
            />
        </HStack>
    )
}
