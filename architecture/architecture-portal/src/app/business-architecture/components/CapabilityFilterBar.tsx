'use client'
import React, { useEffect, useMemo, useState } from 'react'
import {
    Box,
    Combobox,
    HStack,
    Input,
    InputGroup,
    NativeSelect,
    NumberInput,
    Portal,
    Text,
    useListCollection,
    VStack
} from '@chakra-ui/react'
import { IconMinus, IconPlus, IconSearch } from '@americanexpress/dls-icons'
import type { CapabilityFilter } from '@/app/business-architecture/types'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'

interface JourneyFilterOption {
    journeyStatement: string
    journeyGrpTx: string
    journeyDesc?: string
    journeyId: string
    groupName: string
}

interface CapabilityFilterBarProps {
    capabilityFilter: CapabilityFilter
    updateFilter: (updates: Partial<CapabilityFilter>) => void
    clearFilters: () => void
    hasContentFilter: boolean
    allCustomers: string[]
    customerJourneys: CustomerJourney[]
    minLevel?: number
    maxLevel?: number
    capabilityLevel?: string
    showLevelControl?: boolean
    showCustomerFilter?: boolean
    showJourneyFilter?: boolean
    onLevelDecrement?: () => void
    onLevelIncrement?: () => void
}

export function CapabilityFilterBar({
    capabilityFilter,
    updateFilter,
    clearFilters,
    hasContentFilter,
    allCustomers,
    customerJourneys,
    minLevel = 1,
    maxLevel = 5,
    capabilityLevel,
    showLevelControl = true,
    showCustomerFilter = true,
    showJourneyFilter = true,
    onLevelDecrement,
    onLevelIncrement
}: CapabilityFilterBarProps) {
    const groupedJourneys = useMemo(() => {
        const groups = new Map<string, CustomerJourney[]>()
        for (const journey of customerJourneys) {
            const groupName = journey.journey_grp_tx || 'Other'
            const group = groups.get(groupName)
            if (group) {
                group.push(journey)
            } else {
                groups.set(groupName, [journey])
            }
        }
        return Array.from(groups.entries())
            .sort(([groupA], [groupB]) => groupA.localeCompare(groupB))
            .map(([groupName, groupJourneys]) => ({
                groupName,
                journeys: [...groupJourneys].sort((journeyA, journeyB) =>
                    journeyA.journey_statement.localeCompare(
                        journeyB.journey_statement
                    )
                )
            }))
    }, [customerJourneys])

    const journeyOptions = useMemo(
        () =>
            groupedJourneys.flatMap(group =>
                group.journeys.map(journey => ({
                    journeyStatement: journey.journey_statement ?? '',
                    journeyGrpTx: journey.journey_grp_tx ?? '',
                    journeyDesc: journey.journey_desc,
                    journeyId: journey.journey_id,
                    groupName: group.groupName
                }))
            ),
        [groupedJourneys]
    )

    const [journeyInputValue, setJourneyInputValue] = useState(
        capabilityFilter.customerJourney
    )

    // Keep the combobox input in sync when the filter is cleared externally.
    // Syncing during render avoids the effect-based setState lint warning while
    // still resetting without an extra paint.
    const [prevCustomerJourney, setPrevCustomerJourney] = useState(
        capabilityFilter.customerJourney
    )
    if (prevCustomerJourney !== capabilityFilter.customerJourney) {
        setPrevCustomerJourney(capabilityFilter.customerJourney)
        setJourneyInputValue(capabilityFilter.customerJourney)
    }

    const { collection: journeyCollection, set: setJourneyCollection } =
        useListCollection<JourneyFilterOption>({
            initialItems: journeyOptions,
            itemToString: item => (item ? item.journeyStatement : ''),
            itemToValue: item => (item ? item.journeyStatement : '')
        })

    useEffect(() => {
        const normalizedInput = journeyInputValue
            .trim()
            .replaceAll('-', '')
            .replaceAll(' ', '')
            .toLowerCase()
        if (!normalizedInput) {
            setJourneyCollection(journeyOptions)
            return
        }

        setJourneyCollection(
            journeyOptions.filter(
                option =>
                    (option.journeyStatement ?? '')
                        .trim()
                        .replaceAll('-', '')
                        .replaceAll(' ', '')
                        .toLowerCase()
                        .includes(normalizedInput) ||
                    (option.journeyGrpTx ?? '')
                        .trim()
                        .replaceAll('-', '')
                        .replaceAll(' ', '')
                        .toLowerCase()
                        .includes(normalizedInput) ||
                    (option.journeyDesc ?? '')
                        .trim()
                        .replaceAll('-', '')
                        .replaceAll(' ', '')
                        .toLowerCase()
                        .includes(normalizedInput)
            )
        )
    }, [journeyInputValue, journeyOptions, setJourneyCollection])

    const groupedFilteredJourneyOptions = useMemo(() => {
        const groups = new Map<string, JourneyFilterOption[]>()
        for (const option of journeyCollection.items ?? []) {
            const existing = groups.get(option.groupName)
            if (existing) {
                existing.push(option)
            } else {
                groups.set(option.groupName, [option])
            }
        }
        return Array.from(groups.entries())
    }, [journeyCollection.items])

    return (
        <Box
            p={4}
            borderRadius='17px'
            px={3}
            backgroundColor={{
                base: 'surface.foreground',
                _dark: 'gray.900'
            }}
            mx={8}
        >
            <HStack
                pt={2}
                px={5}
                borderRadius='md'
                mb={hasContentFilter ? 2 : 5}
                justifyContent='space-between'
                gap={5}
            >
                <VStack width='100%'>
                    <Text
                        alignSelf='start'
                        fontSize='14px'
                        fontWeight='600'
                        mb={2}
                        ml='1'
                    >
                        Search
                    </Text>
                    <InputGroup
                        flex='1'
                        endElement={<IconSearch />}
                        backgroundColor='transparent'
                        width='100%'
                    >
                        <Input
                            variant='subtle'
                            borderRadius='lg'
                            border='1px solid'
                            borderColor='border.emphasis'
                            width='100%'
                            placeholder='Filter By Capability Name or Description'
                            id='capabilityNameSearch'
                            value={capabilityFilter.name}
                            onChange={e =>
                                updateFilter({ name: e.target.value })
                            }
                            background='surface.white'
                        />
                    </InputGroup>
                </VStack>
                <VStack width='100%'>
                    <Text
                        alignSelf='start'
                        fontSize='14px'
                        fontWeight='600'
                        mb={2}
                        ml='1'
                    >
                        Search By Application
                    </Text>
                    <InputGroup
                        flex='1'
                        endElement={<IconSearch />}
                        backgroundColor='transparent'
                        width='100%'
                    >
                        <Input
                            variant='subtle'
                            borderRadius='lg'
                            border='1px solid'
                            borderColor='border.emphasis'
                            width='100%'
                            placeholder='Filter By Application name or ID'
                            id='applicationSearch'
                            value={capabilityFilter.application}
                            onChange={e =>
                                updateFilter({ application: e.target.value })
                            }
                            background='surface.white'
                        />
                    </InputGroup>
                </VStack>
                {showCustomerFilter && (
                    <Box width='100%'>
                        <Text fontSize='14px' fontWeight='600' mb={4} ml='1'>
                            Customer
                        </Text>
                        <NativeSelect.Root size='sm' variant='subtle'>
                            <NativeSelect.Field
                                placeholder='Please select customer'
                                onChange={e =>
                                    updateFilter({ customer: e.target.value })
                                }
                                value={capabilityFilter.customer}
                                color={
                                    capabilityFilter.customer.length === 0
                                        ? 'text.subtle'
                                        : 'text.regular'
                                }
                                height='40px'
                                borderRadius='lg'
                                border='1px solid'
                                borderColor='border.emphasis'
                                background='surface.white'
                            >
                                {allCustomers.map(customer => (
                                    <option key={customer} value={customer}>
                                        {customer}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator color='blue.500' />
                        </NativeSelect.Root>
                    </Box>
                )}
                {showJourneyFilter && (
                    <Box width='100%'>
                        <Text fontSize='14px' fontWeight='600' mb={4} ml='1'>
                            Enterprise Customer Journey
                        </Text>
                        <Combobox.Root
                            collection={journeyCollection}
                            inputValue={journeyInputValue}
                            value={
                                capabilityFilter.customerJourney
                                    ? [capabilityFilter.customerJourney]
                                    : []
                            }
                            selectionBehavior='replace'
                            openOnClick
                            onInputValueChange={e =>
                                setJourneyInputValue(e.inputValue)
                            }
                            onValueChange={details => {
                                const selectedValue = details.value[0] ?? ''
                                setJourneyInputValue(selectedValue)
                                updateFilter({ customerJourney: selectedValue })
                            }}
                            positioning={{
                                sameWidth: true,
                                placement: 'bottom-start'
                            }}
                            placeholder='Please select enterprise customer journey'
                        >
                            <Combobox.Control>
                                <Combobox.Input
                                    placeholder='Please select enterprise customer journey'
                                    height='40px'
                                    borderRadius='lg'
                                    border='1px solid'
                                    borderColor='border.emphasis'
                                    background='surface.white'
                                    color={
                                        capabilityFilter.customerJourney
                                            .length === 0
                                            ? 'text.subtle'
                                            : 'text.regular'
                                    }
                                    pe='56px'
                                />
                                <Combobox.IndicatorGroup>
                                    <Combobox.ClearTrigger
                                        onClick={() => {
                                            setJourneyInputValue('')
                                            updateFilter({
                                                customerJourney: ''
                                            })
                                        }}
                                    />
                                    <Combobox.Trigger />
                                </Combobox.IndicatorGroup>
                            </Combobox.Control>
                            <Portal>
                                <Combobox.Positioner>
                                    <Combobox.Content
                                        maxH='280px'
                                        overflowY='auto'
                                        zIndex={20}
                                        css={{
                                            border: '1px solid var(--chakra-colors-gray-400)',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        {groupedFilteredJourneyOptions.length ===
                                            0 && (
                                            <Combobox.Empty>
                                                <Box p={2}>
                                                    <Text
                                                        fontSize='sm'
                                                        color='text.subtle'
                                                    >
                                                        No journeys found
                                                    </Text>
                                                </Box>
                                            </Combobox.Empty>
                                        )}
                                        {groupedFilteredJourneyOptions.map(
                                            ([groupName, options]) => (
                                                <Combobox.ItemGroup
                                                    key={groupName}
                                                >
                                                    <Combobox.ItemGroupLabel
                                                        px={3}
                                                        pb={1}
                                                        pt={1}
                                                        fontSize='xs'
                                                        fontWeight='700'
                                                        textTransform='uppercase'
                                                        color='text.subtle'
                                                    >
                                                        {groupName}
                                                    </Combobox.ItemGroupLabel>
                                                    {options.map(option => (
                                                        <Combobox.Item
                                                            key={
                                                                option.journeyStatement
                                                            }
                                                            item={option}
                                                            pl={7}
                                                            color='text.regular'
                                                        >
                                                            {
                                                                option.journeyStatement
                                                            }
                                                            <Combobox.ItemIndicator />
                                                        </Combobox.Item>
                                                    ))}
                                                </Combobox.ItemGroup>
                                            )
                                        )}
                                    </Combobox.Content>
                                </Combobox.Positioner>
                            </Portal>
                        </Combobox.Root>
                    </Box>
                )}
                {showLevelControl && (
                    <Box width={300}>
                        <Text fontSize='14px' fontWeight='600' mt={1.5} mb={4}>
                            Capability Level
                        </Text>
                        <NumberInput.Root
                            variant='subtle'
                            spinOnPress={false}
                            value={capabilityLevel}
                            min={minLevel}
                            max={maxLevel}
                            mb={2}
                        >
                            <HStack
                                gap='2'
                                background='surface.white'
                                borderRadius='lg'
                                border='1px solid'
                                borderColor='border.emphasis'
                                height='40px'
                            >
                                <NumberInput.DecrementTrigger
                                    asChild
                                    borderRadius='lg'
                                    onClick={onLevelDecrement}
                                >
                                    <Box padding={2}>
                                        <IconMinus />
                                    </Box>
                                </NumberInput.DecrementTrigger>
                                <NumberInput.ValueText
                                    textAlign='center'
                                    fontSize='md'
                                    minW='3ch'
                                />
                                <NumberInput.IncrementTrigger
                                    asChild
                                    borderRadius='lg'
                                    onClick={onLevelIncrement}
                                >
                                    <Box padding={2}>
                                        <IconPlus />
                                    </Box>
                                </NumberInput.IncrementTrigger>
                            </HStack>
                        </NumberInput.Root>
                    </Box>
                )}
            </HStack>
            {hasContentFilter && (
                <Text
                    width='fit-content'
                    color='text.brand'
                    fontSize='16px'
                    px={5}
                    onClick={clearFilters}
                    _hover={{
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                >
                    Clear filters
                </Text>
            )}
        </Box>
    )
}
