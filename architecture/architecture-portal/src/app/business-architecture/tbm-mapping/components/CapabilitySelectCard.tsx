'use client'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { Box, GridItem, HStack, Text } from '@chakra-ui/react'
import { IconChevronDown, IconChevronUp } from '@americanexpress/dls-icons'
import { CapabilityNode } from '@/app/business-architecture/types'
import { colors } from '@/app/business-architecture/constants'
import { NestedCheckboxAccordion } from './NestedCheckboxAccordion'

export const CapabilitySelectCard = memo(
    ({
        capability,
        isExpanded,
        onToggleExpand,
        defaultExpanded = [],
        activeJourneyId,
        isFilterMatch,
        hasContentFilter,
        autoExpandedIds,
        matchedCapabilityIds
    }: {
        capability: CapabilityNode
        isExpanded: boolean
        onToggleExpand: (id: string) => void
        defaultExpanded?: string[]
        activeJourneyId?: string
        isFilterMatch?: boolean
        hasContentFilter?: boolean
        autoExpandedIds?: Set<string>
        matchedCapabilityIds?: Set<string>
    }) => {
        const hasChildren = (capability.children?.length ?? 0) > 0
        const [expanded, setExpanded] = useState<string[]>(
            () => defaultExpanded
        )

        // When the active journey changes, reset expanded to defaultExpanded.
        // Skip this sync while a content filter is active — the filter-based
        // useEffect below takes priority in that case.
        const [prevJourneyId, setPrevJourneyId] = useState<string | undefined>(
            activeJourneyId
        )
        // Track defaultExpanded length to detect async data arrival
        const [prevDefaultLength, setPrevDefaultLength] = useState(
            defaultExpanded.length
        )
        if (prevJourneyId !== activeJourneyId) {
            setPrevJourneyId(activeJourneyId)
            setPrevDefaultLength(defaultExpanded.length)
            if (!hasContentFilter) {
                const levelIds = autoExpandedIds
                    ? Array.from(autoExpandedIds)
                    : []
                setExpanded(
                    Array.from(new Set([...levelIds, ...defaultExpanded]))
                )
            }
        } else if (defaultExpanded.length !== prevDefaultLength) {
            // defaultExpanded updated (e.g. API data arrived)
            setPrevDefaultLength(defaultExpanded.length)
            if (!hasContentFilter) {
                const levelIds = autoExpandedIds
                    ? Array.from(autoExpandedIds)
                    : []
                setExpanded(
                    Array.from(new Set([...levelIds, ...defaultExpanded]))
                )
            }
        }

        // Sync inner accordion expansion from autoExpandedIds when level or filter
        // changes. When no filter is active, merge with AI ancestor defaults so
        // both level-based and AI ancestor expansion coexist.
        const autoExpandedArray = useMemo(
            () => (autoExpandedIds ? Array.from(autoExpandedIds) : undefined),
            [autoExpandedIds]
        )
        useEffect(() => {
            if (autoExpandedArray === undefined) return
            if (hasContentFilter) {
                setExpanded(autoExpandedArray)
            } else {
                setExpanded(
                    Array.from(
                        new Set([...autoExpandedArray, ...defaultExpanded])
                    )
                )
            }
        }, [autoExpandedArray, hasContentFilter, defaultExpanded])

        return (
            <GridItem
                maxW='100%'
                backgroundColor={{ base: 'gray.200', _dark: 'gray.900' }}
                borderRadius='md'
                transition='transform 0.3s, box-shadow 0.3s'
                _hover={!isExpanded ? { transform: 'translateY(-2px)' } : {}}
            >
                <Box
                    backgroundColor={{
                        base: 'surface.foreground',
                        _dark: 'gray.900'
                    }}
                    borderRadius='md'
                    boxShadow='lg'
                    p={3}
                    minH='86px'
                    border={
                        isFilterMatch && hasContentFilter
                            ? `2px solid ${colors[capability.capability_id]?.[0] ?? '#ccc'}`
                            : {
                                  base: '1px solid {colors.border.subtle}',
                                  _dark: '1px solid {colors.gray.800}'
                              }
                    }
                    transition='box-shadow 0.3s ease, border-color 0.3s ease'
                >
                    <Box
                        borderTop={`4px solid ${colors[capability.capability_id]?.[0] ?? '#ccc'}`}
                        mb={3}
                    />
                    <HStack alignItems='flex-start' mb={2}>
                        {hasChildren && (
                            <Box
                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                                onClick={() =>
                                    onToggleExpand(capability.capability_id)
                                }
                                flexShrink={0}
                                _hover={{ cursor: 'pointer' }}
                                marginRight={1}
                            >
                                {isExpanded ? (
                                    <IconChevronUp
                                        style={{
                                            fontSize: '13px',
                                            height: '10px',
                                            verticalAlign: 'top',
                                            marginTop: '3px'
                                        }}
                                    />
                                ) : (
                                    <IconChevronDown
                                        style={{
                                            fontSize: '13px',
                                            height: '10px',
                                            verticalAlign: 'top',
                                            marginTop: '3px'
                                        }}
                                    />
                                )}
                            </Box>
                        )}
                        <Text
                            data-testid={`capability-card-name-${capability.capability_id}`}
                            fontSize='12px'
                            fontWeight='bold'
                            lineClamp='2'
                            flex='1'
                            minWidth={0}
                            color='text.emphasis'
                        >
                            {capability.capability_nm.toUpperCase()}
                        </Text>
                    </HStack>
                    <Box
                        display='grid'
                        style={{
                            gridTemplateRows: isExpanded ? '1fr' : '0fr',
                            transition:
                                'grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <Box
                            overflow={isExpanded ? 'visible' : 'hidden'}
                            style={{
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded
                                    ? 'translateY(0)'
                                    : 'translateY(-8px)',
                                transition:
                                    'opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s'
                            }}
                        >
                            <Box as='ul' listStyleType='none' p={0} m={0}>
                                <NestedCheckboxAccordion
                                    data={capability.children ?? []}
                                    expanded={expanded}
                                    setExpanded={setExpanded}
                                    matchedCapabilityIds={matchedCapabilityIds}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </GridItem>
        )
    }
)

CapabilitySelectCard.displayName = 'CapabilitySelectCard'
