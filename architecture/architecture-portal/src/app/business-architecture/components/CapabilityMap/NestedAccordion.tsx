/* istanbul ignore file */
import React, { memo, useCallback } from 'react'
import { Accordion, Box, HStack, Text } from '@chakra-ui/react'
import { CapabilityNode } from '@/app/business-architecture/types'
import { NoPrefetchLink as Link, Tooltip } from '@/components/ui'
import { colors } from '../../constants'

type Props = {
    data: CapabilityNode[]
    expanded: string[]
    setExpanded: React.Dispatch<React.SetStateAction<string[]>>
    matchedCapabilityIds: Set<string>
}

// Renders a single accordion node recursively.
// Kept as a plain function (not a component) so it can recurse without
// extra component overhead for small subtrees, while the top-level
// NestedAccordion itself is memo-wrapped to skip unchanged cards entirely.
function renderNode(
    node: CapabilityNode,
    expanded: string[],
    setExpanded: React.Dispatch<React.SetStateAction<string[]>>,
    matchedCapabilityIds: Set<string>
): React.ReactNode {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expanded.includes(node.capability_id)
    const isLevel2 = Number(node.capability_level) === 2
    const isLevel2OrGreater = Number(node.capability_level) >= 2
    const highlightBorder = matchedCapabilityIds.has(node.capability_id)

    return (
        <Accordion.Item
            key={node.capability_id}
            value={node.capability_id}
            mb={2}
            width='100%'
            overflow='visible'
            position='relative'
            zIndex={isExpanded ? 1 : 'auto'}
            border='none'
            transition='transform 0.3s, box-shadow 0.3s'
        >
            <Box
                border={
                    highlightBorder
                        ? `2px solid ${colors[node.l1_capability_id || '']?.[0] ?? '#3182ce'}`
                        : '1px solid border.regular'
                }
                borderRadius='lg'
                boxShadow='sm'
                overflow='hidden'
                width='100%'
                transition='transform 0.3s, box-shadow 0.3s'
                _hover={{
                    transform: !isExpanded ? 'translateY(-2px)' : undefined,
                    zIndex: 10,
                    boxShadow: 'xl'
                }}
                backgroundColor={
                    hasChildren && isExpanded
                        ? isLevel2
                            ? { base: 'surface.foreground', _dark: 'gray.900' }
                            : (colors[node.l1_capability_id]?.[2] ?? {
                                  base: 'surface.foreground',
                                  _dark: 'gray.900'
                              })
                        : { base: 'surface.foreground', _dark: 'gray.900' }
                }
            >
                {hasChildren ? (
                    <Box>
                        <HStack
                            py={1}
                            gap={1}
                            background={
                                isExpanded
                                    ? isLevel2
                                        ? (colors[node.l1_capability_id]?.[1] ??
                                          'transparent')
                                        : (colors[node.l1_capability_id]?.[2] ??
                                          'transparent')
                                    : 'transparent'
                            }
                        >
                            <Accordion.ItemTrigger
                                width='fit-content'
                                _hover={{ cursor: 'pointer' }}
                            >
                                <Accordion.ItemIndicator
                                    ml={1}
                                    color={
                                        isExpanded
                                            ? isLevel2
                                                ? 'white'
                                                : 'fg.default'
                                            : 'fg.default'
                                    }
                                />
                            </Accordion.ItemTrigger>
                            <Tooltip showArrow content={node.capability_nm}>
                                <Link
                                    href={`/business-architecture/capabilities/${node.capability_id}/?tab=Enterprise+Customer+Journeys`}
                                >
                                    <Text
                                        fontSize='12px'
                                        lineHeight='18px'
                                        color={
                                            isExpanded
                                                ? isLevel2
                                                    ? 'white'
                                                    : 'black'
                                                : 'fg.default'
                                        }
                                        minWidth={0}
                                        _hover={{
                                            color: isExpanded
                                                ? isLevel2OrGreater
                                                    ? ''
                                                    : 'text.link'
                                                : 'text.link',
                                            textDecoration: 'underline'
                                        }}
                                        mr={2}
                                    >
                                        {node.capability_nm}
                                    </Text>
                                </Link>
                            </Tooltip>
                        </HStack>
                        <Accordion.ItemContent
                            paddingX={1}
                            marginTop={2}
                            overflow='visible'
                        >
                            <Accordion.Root
                                multiple
                                value={expanded}
                                onValueChange={details =>
                                    setExpanded(details.value)
                                }
                                overflow='visible'
                            >
                                {node.children!.map(child =>
                                    renderNode(
                                        child,
                                        expanded,
                                        setExpanded,
                                        matchedCapabilityIds
                                    )
                                )}
                            </Accordion.Root>
                        </Accordion.ItemContent>
                    </Box>
                ) : (
                    <Box borderRadius='lg'>
                        <Tooltip showArrow content={node.capability_nm}>
                            <Link
                                href={`/business-architecture/capabilities/${node.capability_id}/?tab=Enterprise+Customer+Journeys`}
                            >
                                <Text
                                    m={3}
                                    fontSize='12px'
                                    flex='1'
                                    minWidth={0}
                                    _hover={{
                                        color: isExpanded
                                            ? isLevel2OrGreater
                                                ? ''
                                                : 'text.link'
                                            : 'text.link',
                                        textDecoration: 'underline'
                                    }}
                                    ml={
                                        Number(node.capability_level) > 2
                                            ? 6
                                            : 3
                                    }
                                >
                                    {node.capability_nm}
                                </Text>
                            </Link>
                        </Tooltip>
                    </Box>
                )}
            </Box>
        </Accordion.Item>
    )
}

export const NestedAccordion: React.FC<Props> = memo(
    ({ data, expanded, setExpanded, matchedCapabilityIds }) => {
        const handleValueChange = useCallback(
            (details: { value: string[] }) => setExpanded(details.value),
            [setExpanded]
        )

        if (!data || data.length === 0) return null

        return (
            <Accordion.Root
                multiple
                value={expanded}
                onValueChange={handleValueChange}
            >
                {data.map(node =>
                    renderNode(
                        node,
                        expanded,
                        setExpanded,
                        matchedCapabilityIds
                    )
                )}
            </Accordion.Root>
        )
    }
)

NestedAccordion.displayName = 'NestedAccordion'
