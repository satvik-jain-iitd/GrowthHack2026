'use client'
import React, { useMemo, useState } from 'react'
import { Box, Grid, HStack, Text, VStack } from '@chakra-ui/react'
import { CapabilityCard } from '@/app/business-architecture/components/CapabilityMap'
import { CapabilityNode } from '@/app/business-architecture/types'
import {
    useCapabilities,
    useCapabilityOwners,
    useCustomerJourneys,
    useSubmitBAChangeModalRequest
} from '@/app/business-architecture/hooks'
import { BAChangeModal } from '@/app/business-architecture/components/BAChangeModal'
import { CapabilityFilterBar } from '@/app/business-architecture/components/CapabilityFilterBar'
import { useCapabilityFilters } from '@/app/business-architecture/hooks/useCapabilityFilters'

export function CapabilityMap({
    selectedL1: initialSelectedL1
}: {
    selectedL1: string | null
}) {
    const { capability = [] } = useCapabilities()
    const { capability_owners = [] } = useCapabilityOwners()
    const { customer_journey = [] } = useCustomerJourneys()

    // ba change request modal
    const [isOpenChangeModal, setIsOpenChangeModal] = useState(false)
    const { handleSubmitBAChangeModal, isSubmitting } =
        useSubmitBAChangeModalRequest('EBA')

    // creates the capability forest
    const capabilityHierarchy = useMemo(() => {
        const nodeMap: Record<string, CapabilityNode> = {}
        for (const item of capability) {
            nodeMap[item.capability_id] = { ...item, children: [] }
        }
        const roots: CapabilityNode[] = []
        for (const item of capability) {
            const node = nodeMap[item.capability_id]
            if (
                item.parent_capability_id &&
                nodeMap[item.parent_capability_id]
            ) {
                nodeMap[item.parent_capability_id].children!.push(node)
            } else if (!item.parent_capability_id) {
                roots.push(node)
            }
        }
        return roots
    }, [capability])

    const {
        capabilityFilter,
        updateFilter,
        clearFilters,
        hasContentFilter,
        setExpandedOverrides,
        setExpansionMode,
        setSelectedL1,
        capabilityLevel,
        setCapabilityLevel,
        filteredHierarchy,
        capabilityHierarchyMap,
        matchedCapabilityIds,
        autoExpandedIds,
        handleToggleExpand,
        getIsExpanded,
        allCustomers,
        minLevel,
        maxLevel
    } = useCapabilityFilters({
        capability,
        capabilityHierarchy,
        capabilityOwners: capability_owners,
        customerJourneys: customer_journey,
        initialSelectedL1
    })

    return (
        <Box marginTop={1} width='100%'>
            <Box
                width='99.5%'
                mx='auto'
                paddingTop={5}
                px={0}
                mb={12}
                borderRadius='17px'
            >
                <CapabilityFilterBar
                    capabilityFilter={capabilityFilter}
                    updateFilter={updateFilter}
                    clearFilters={clearFilters}
                    hasContentFilter={hasContentFilter}
                    allCustomers={allCustomers}
                    customerJourneys={customer_journey}
                    minLevel={minLevel}
                    maxLevel={maxLevel}
                    capabilityLevel={capabilityLevel}
                    onLevelDecrement={() => {
                        setExpansionMode('level')
                        const newLevel = Math.max(
                            minLevel,
                            Number(capabilityLevel) - 1
                        )
                        setCapabilityLevel(newLevel.toString())
                        setExpandedOverrides({})
                        setSelectedL1(null)
                    }}
                    onLevelIncrement={() => {
                        setExpansionMode('level')
                        const newLevel = Math.min(
                            maxLevel,
                            Number(capabilityLevel) + 1
                        )
                        setCapabilityLevel(newLevel.toString())
                        setExpandedOverrides({})
                        setSelectedL1(null)
                    }}
                />
                <VStack px={8} marginTop={5}>
                    <HStack
                        justifyContent='space-between'
                        marginX={2}
                        marginBottom={2}
                        width='100%'
                        marginTop={1}
                    >
                        <Text fontWeight='700' fontStyle='bold' fontSize='16px'>
                            Expand any Enterprise Business Capability to see
                            more.
                        </Text>
                        <HStack justifyContent='flex-end'>
                            <Text
                                color='text.brand'
                                fontSize='16px'
                                onClick={() => {
                                    setExpansionMode('level')
                                    setSelectedL1(null)
                                    setCapabilityLevel(maxLevel.toString())
                                    setExpandedOverrides({})
                                }}
                                _hover={{
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Expand All
                            </Text>
                            <Text color='text.brand' fontSize='16px'>
                                /
                            </Text>
                            <Text
                                color='text.brand'
                                fontSize='16px'
                                onClick={() => {
                                    setExpansionMode('level')
                                    setSelectedL1(null)
                                    setCapabilityLevel(minLevel.toString())
                                    setExpandedOverrides({})
                                }}
                                _hover={{
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Collapse All
                            </Text>
                        </HStack>
                    </HStack>
                    <Grid
                        templateColumns={{
                            lg: 'repeat(7, 1fr)',
                            md: 'repeat(2, 1fr)',
                            sm: 'repeat(1, 1fr)'
                        }}
                        gap={5}
                        position='relative'
                    >
                        {filteredHierarchy.map(cap => {
                            const unfiltered =
                                capabilityHierarchyMap[cap.capability_id] ?? cap
                            const isExpanded = getIsExpanded(cap.capability_id)
                            return (
                                <CapabilityCard
                                    key={cap.capability_id}
                                    capability={cap}
                                    selectedL1={null}
                                    hasChildren={
                                        (unfiltered.children?.length ?? 0) > 0
                                    }
                                    hasContentFilter={hasContentFilter}
                                    isFilterMatch={matchedCapabilityIds.has(
                                        cap.capability_id
                                    )}
                                    isExpanded={isExpanded}
                                    onToggleExpand={() =>
                                        handleToggleExpand(
                                            cap.capability_id,
                                            isExpanded
                                        )
                                    }
                                    matchedCapabilityIds={matchedCapabilityIds}
                                    autoExpandedIds={autoExpandedIds}
                                />
                            )
                        })}
                    </Grid>
                </VStack>

                <BAChangeModal
                    isOpen={isOpenChangeModal}
                    setIsOpenChangeModal={setIsOpenChangeModal}
                    onSubmit={handleSubmitBAChangeModal}
                    isSubmitting={isSubmitting}
                />
            </Box>
        </Box>
    )
}
export default CapabilityMap
