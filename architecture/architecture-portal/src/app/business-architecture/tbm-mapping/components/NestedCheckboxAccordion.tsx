import React, { memo, useCallback } from 'react'
import { Accordion, Box, Checkbox, HStack, Text } from '@chakra-ui/react'
import { CapabilityNode } from '@/app/business-architecture/types'
import { colors } from '@/app/business-architecture/constants'
import { AIIcon } from '@/components/icons/AIIcon'
import {
    useIsCapabilitySelected,
    useIsCapabilityAISelected,
    useCapabilityToggle
} from './CapabilitySelectionContext'

type Props = {
    data: CapabilityNode[]
    expanded: string[]
    setExpanded: React.Dispatch<React.SetStateAction<string[]>>
    matchedCapabilityIds?: Set<string>
}

type NodeProps = {
    node: CapabilityNode
    expanded: string[]
    setExpanded: React.Dispatch<React.SetStateAction<string[]>>
    matchedCapabilityIds?: Set<string>
}

const CapabilityCheckboxNode = memo(
    ({ node, expanded, setExpanded, matchedCapabilityIds }: NodeProps) => {
        const isChecked = useIsCapabilitySelected(node.capability_id)
        const isAI = useIsCapabilityAISelected(node.capability_id)
        const onToggleCapability = useCapabilityToggle()
        const hasChildren = (node.children?.length ?? 0) > 0
        const isExpanded = expanded.includes(node.capability_id)
        const highlightBorder =
            matchedCapabilityIds?.has(node.capability_id) ?? false
        const isLevel2 = Number(node.capability_level) === 2
        const isL3OrGreater = Number(node.capability_level) >= 3

        return (
            <Accordion.Item
                value={node.capability_id}
                mb={2}
                width='100%'
                overflow='visible'
                position='relative'
                border='none'
            >
                <Box
                    border={
                        highlightBorder
                            ? `2px solid ${colors[node.l1_capability_id]?.[0] ?? '#3182ce'}`
                            : '1px solid'
                    }
                    borderColor={highlightBorder ? undefined : 'border.regular'}
                    borderRadius='lg'
                    boxShadow='sm'
                    overflow='hidden'
                    width='100%'
                    backgroundColor={
                        hasChildren && isExpanded
                            ? isLevel2
                                ? {
                                      base: 'surface.foreground',
                                      _dark: 'gray.900'
                                  }
                                : (colors[node.l1_capability_id]?.[2] ?? {
                                      base: 'surface.foreground',
                                      _dark: 'gray.900'
                                  })
                            : { base: 'surface.foreground', _dark: 'gray.900' }
                    }
                >
                    {hasChildren ? (
                        <Box>
                            {isAI && (
                                <Box position='absolute' top='1' zIndex={1}>
                                    <AIIcon width={14} height={14} />
                                </Box>
                            )}

                            <HStack
                                py={1}
                                gap={1}
                                width='100%'
                                background={
                                    isExpanded
                                        ? isLevel2
                                            ? (colors[
                                                  node.l1_capability_id
                                              ]?.[1] ?? 'transparent')
                                            : (colors[
                                                  node.l1_capability_id
                                              ]?.[2] ?? 'transparent')
                                        : 'transparent'
                                }
                            >
                                {isL3OrGreater && (
                                    <Box
                                        ml={2}
                                        flexShrink={0}
                                        position='relative'
                                    >
                                        <Checkbox.Root
                                            size='lg'
                                            colorPalette={
                                                isAI && isChecked
                                                    ? 'orange'
                                                    : 'blue'
                                            }
                                            checked={isChecked}
                                            onCheckedChange={() =>
                                                onToggleCapability(
                                                    node.capability_id
                                                )
                                            }
                                            onClick={e => e.stopPropagation()}
                                            flexShrink={0}
                                        >
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control
                                                _hover={{ cursor: 'pointer' }}
                                                width='24px'
                                                height='24px'
                                            />
                                        </Checkbox.Root>
                                    </Box>
                                )}
                                <HStack gap={1} flex='1' minWidth={0}>
                                    <Accordion.ItemTrigger
                                        width='fit-content'
                                        _hover={{ cursor: 'pointer' }}
                                    >
                                        <Accordion.ItemIndicator
                                            ml={1}
                                            color={
                                                isExpanded && isLevel2
                                                    ? 'white'
                                                    : 'fg.default'
                                            }
                                        />
                                    </Accordion.ItemTrigger>
                                    <Text
                                        data-testid={`capability-nm-${node.capability_id}`}
                                        fontSize='12px'
                                        lineHeight='18px'
                                        color={
                                            isExpanded
                                                ? isLevel2
                                                    ? 'white'
                                                    : 'black'
                                                : 'fg.default'
                                        }
                                        py={1}
                                        flex='1'
                                        minWidth={0}
                                    >
                                        {node.capability_nm}
                                    </Text>
                                </HStack>
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
                                    {node.children!.map(child => (
                                        <CapabilityCheckboxNode
                                            key={child.capability_id}
                                            node={child}
                                            expanded={expanded}
                                            setExpanded={setExpanded}
                                            matchedCapabilityIds={
                                                matchedCapabilityIds
                                            }
                                        />
                                    ))}
                                </Accordion.Root>
                            </Accordion.ItemContent>
                        </Box>
                    ) : (
                        <Box borderRadius='lg'>
                            {isAI && (
                                <Box position='absolute' top='1' zIndex={1}>
                                    <AIIcon width={14} height={14} />
                                </Box>
                            )}

                            <HStack py={1} px={2} gap={2} width='100%'>
                                {isL3OrGreater && (
                                    <Box
                                        ml={1}
                                        flexShrink={0}
                                        position='relative'
                                    >
                                        <Checkbox.Root
                                            size='lg'
                                            colorPalette={
                                                isAI && isChecked
                                                    ? 'orange'
                                                    : 'blue'
                                            }
                                            checked={isChecked}
                                            onCheckedChange={() =>
                                                onToggleCapability(
                                                    node.capability_id
                                                )
                                            }
                                            flexShrink={0}
                                        >
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control
                                                _hover={{ cursor: 'pointer' }}
                                                width='24px'
                                                height='24px'
                                            />
                                        </Checkbox.Root>
                                    </Box>
                                )}
                                <Text
                                    data-testid={`capability-nm-${node.capability_id}`}
                                    fontSize='12px'
                                    flex='1'
                                    minWidth={0}
                                    ml={
                                        !isL3OrGreater &&
                                        node.capability_level > 2
                                            ? 6
                                            : !isL3OrGreater
                                              ? 3
                                              : 0
                                    }
                                    py={1}
                                >
                                    {node.capability_nm}
                                </Text>
                            </HStack>
                        </Box>
                    )}
                </Box>
            </Accordion.Item>
        )
    }
)

CapabilityCheckboxNode.displayName = 'CapabilityCheckboxNode'

export const NestedCheckboxAccordion: React.FC<Props> = memo(
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
                {data.map(node => (
                    <CapabilityCheckboxNode
                        key={node.capability_id}
                        node={node}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        matchedCapabilityIds={matchedCapabilityIds}
                    />
                ))}
            </Accordion.Root>
        )
    }
)

NestedCheckboxAccordion.displayName = 'NestedCheckboxAccordion'
