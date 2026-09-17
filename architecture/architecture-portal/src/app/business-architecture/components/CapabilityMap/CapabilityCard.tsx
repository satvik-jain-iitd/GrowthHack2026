/* istanbul ignore file */
import { Box, GridItem, HStack, Text } from '@chakra-ui/react'
import { CapabilityNode } from '@/app/business-architecture/types'
import { colors } from '@/app/business-architecture/constants'
import { NoPrefetchLink as Link, Tooltip } from '@/components/ui'
import { NestedAccordion } from './NestedAccordion'
import React, { memo, useEffect, useState } from 'react'
import { IconChevronDown, IconChevronUp } from '@americanexpress/dls-icons'

export const CapabilityCard = ({
    capability,
    gridColumnStart,
    selectedL1,
    hasChildren,
    hasContentFilter,
    isFilterMatch,
    isExpanded,
    onToggleExpand,
    matchedCapabilityIds,
    autoExpandedIds
}: {
    capability: CapabilityNode
    gridColumnStart?: number
    selectedL1?: string | null
    hasChildren: boolean
    hasContentFilter: boolean
    isFilterMatch: boolean
    isExpanded: boolean
    onToggleExpand: () => void
    matchedCapabilityIds: Set<string>
    autoExpandedIds: Set<string>
}) => {
    const isSelectedCard = selectedL1 === capability.capability_id

    const [expanded, setExpanded] = useState<string[]>(
        Array.from(autoExpandedIds)
    )

    useEffect(() => {
        setExpanded(Array.from(autoExpandedIds))
    }, [autoExpandedIds])

    return (
        <GridItem
            maxW='100%'
            gridColumnStart={gridColumnStart}
            backgroundColor={{ base: 'gray.200', _dark: 'gray.900' }}
            borderRadius='md'
            transition='transform 0.3s, box-shadow 0.3s, z-index 0s'
            _hover={
                !isExpanded
                    ? {
                          transform: 'translateY(-2px)'
                      }
                    : {}
            }
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
                    (isSelectedCard && !hasContentFilter) ||
                    (isFilterMatch && hasContentFilter)
                        ? `2px solid ${colors[capability.capability_id][0]}`
                        : {
                              base: '1px solid {colors.border.subtle}',
                              _dark: '1px solid {colors.gray.800}'
                          }
                }
                transition='box-shadow 0.3s ease, border-color 0.3s ease'
            >
                <Box
                    borderTop={`4px solid ${colors[capability.capability_id][0] ?? '#ccc'}`}
                    mb={3}
                />
                <HStack alignItems='flex-start' mb={2}>
                    {hasChildren && (
                        <Box
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            onClick={onToggleExpand}
                            flexShrink={0}
                            _hover={{ cursor: 'pointer' }}
                            marginRight={1}
                            float='top'
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
                    <Tooltip showArrow content={capability.capability_nm}>
                        <Link
                            href={`/business-architecture/capabilities/${capability.capability_id}/?tab=Enterprise+Enterprise+Customer+Journeys`}
                        >
                            <Text
                                fontSize='12px'
                                fontWeight='bold'
                                lineClamp='2'
                                flex='1'
                                minWidth={0}
                                color='text.emphasis'
                                _hover={{
                                    color: 'text.link',
                                    textDecoration: 'underline'
                                }}
                                verticalAlign='middle'
                            >
                                {capability.capability_nm.toUpperCase()}
                            </Text>
                        </Link>
                    </Tooltip>
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
                            <NestedAccordion
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

export default memo(CapabilityCard)
