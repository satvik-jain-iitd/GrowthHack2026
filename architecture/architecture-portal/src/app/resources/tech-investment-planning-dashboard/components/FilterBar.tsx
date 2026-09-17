/* istanbul ignore file */
'use client'
import { useMemo } from 'react'
import { Badge, Box, Button, Flex, Grid, Text } from '@chakra-ui/react'
import Select, {
    MultiValue,
    components,
    OptionProps,
    CSSObjectWithLabel
} from 'react-select'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { useTheme } from 'next-themes'
import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
import type {
    DashboardFilters,
    StrategicEpic
} from '@/app/resources/tech-investment-planning-dashboard/types'
import { EMPTY_FILTERS } from '@/app/resources/tech-investment-planning-dashboard/types'
import { getReactSelectStyles } from '@/app/company-domains/utils/reactSelectStyles'
import { ActorChip } from '@/app/resources/tech-investment-planning-dashboard/components/shared/ActorChip'

type SelectOption = { value: string; label: string }

const SELECT_ALL_VALUE = '__select_all__'
type SelectOptionWithAll = SelectOption & { isSelectAll?: true }

function withSelectAll(options: SelectOption[]): SelectOptionWithAll[] {
    return [
        { value: SELECT_ALL_VALUE, label: 'Select All', isSelectAll: true },
        ...options
    ]
}

function MultiSelectOption(props: OptionProps<SelectOptionWithAll, true>) {
    const { data, isSelected, selectProps } = props
    let checked = isSelected
    let isIndeterminate = false

    if (data.isSelectAll) {
        const allOpts = (selectProps.options as SelectOptionWithAll[]).filter(
            o => !o.isSelectAll
        )
        const selectedVals = (
            selectProps.value as SelectOptionWithAll[]
        ).filter(o => !o.isSelectAll)
        checked = allOpts.length > 0 && selectedVals.length === allOpts.length
        isIndeterminate =
            selectedVals.length > 0 && selectedVals.length < allOpts.length
    }

    return (
        <components.Option {...props}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                    type='checkbox'
                    checked={checked}
                    ref={el => {
                        if (el) el.indeterminate = isIndeterminate
                    }}
                    onChange={() => null}
                    style={{
                        accentColor: '#006fcf',
                        width: 16,
                        height: 16,
                        flexShrink: 0,
                        cursor: 'pointer'
                    }}
                />
                <span>{props.label}</span>
            </div>
        </components.Option>
    )
}

function CreatedBySelectOption(props: OptionProps<SelectOptionWithAll, true>) {
    if (props.data.isSelectAll) return <MultiSelectOption {...props} />
    return (
        <components.Option {...props}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                    type='checkbox'
                    checked={props.isSelected}
                    onChange={() => null}
                    style={{
                        accentColor: '#006fcf',
                        width: 16,
                        height: 16,
                        flexShrink: 0,
                        cursor: 'pointer'
                    }}
                />
                <ActorChip email={props.data.value} variant='chip' size='xs' />
            </div>
        </components.Option>
    )
}

function getOptions(
    epics: StrategicEpic[],
    key: keyof Pick<
        StrategicEpic,
        | 'createdBy'
        | 'requestingLOB'
        | 'sponsoringLOB'
        | 'investmentCategory'
        | 'demandGroup'
    >
): SelectOption[] {
    const set = new Set<string>()
    for (const epic of epics) {
        const val = epic[key]
        if (val) set.add(val)
    }
    return Array.from(set)
        .sort()
        .map(v => ({ value: v, label: v }))
}

function getPlanningCycleOptions(epics: StrategicEpic[]): SelectOption[] {
    const set = new Set<string>()
    for (const epic of epics) {
        if (Array.isArray(epic.planningCycle)) {
            for (const cycle of epic.planningCycle) {
                if (cycle) set.add(cycle)
            }
        }
    }
    return Array.from(set)
        .sort()
        .map(v => ({ value: v, label: v }))
}

function getImpactedLOBOptions(epics: StrategicEpic[]): SelectOption[] {
    const set = new Set<string>()
    for (const epic of epics) {
        if (!epic.impactedLOB) continue
        for (const lob of epic.impactedLOB.split(',')) {
            const trimmed = lob.trim()
            if (trimmed) set.add(trimmed)
        }
    }
    return Array.from(set)
        .sort()
        .map(v => ({ value: v, label: v }))
}

// Epics passing all filters except the specified key — for cascading options
function epicsExcluding(
    epics: StrategicEpic[],
    filters: DashboardFilters,
    excludeKey: keyof DashboardFilters
): StrategicEpic[] {
    return epics.filter(epic => {
        if (
            excludeKey !== 'createdBy' &&
            filters.createdBy.length > 0 &&
            !filters.createdBy.includes(epic.createdBy)
        )
            return false
        if (
            excludeKey !== 'planningCycle' &&
            filters.planningCycle.length > 0
        ) {
            const epicCycles = Array.isArray(epic.planningCycle)
                ? epic.planningCycle
                : []
            if (!filters.planningCycle.some(c => epicCycles.includes(c)))
                return false
        }
        if (
            excludeKey !== 'requestingLOB' &&
            filters.requestingLOB.length > 0 &&
            !filters.requestingLOB.includes(epic.requestingLOB)
        )
            return false
        if (
            excludeKey !== 'sponsoringLOB' &&
            filters.sponsoringLOB.length > 0 &&
            !filters.sponsoringLOB.includes(epic.sponsoringLOB)
        )
            return false
        if (
            excludeKey !== 'investmentCategory' &&
            filters.investmentCategory.length > 0 &&
            !filters.investmentCategory.includes(epic.investmentCategory)
        )
            return false
        if (
            excludeKey !== 'demandGroup' &&
            filters.demandGroup.length > 0 &&
            !filters.demandGroup.includes(epic.demandGroup)
        )
            return false
        if (excludeKey !== 'impactedLOB' && filters.impactedLOB.length > 0) {
            const epicLOBs = epic.impactedLOB
                ? epic.impactedLOB.split(',').map(s => s.trim())
                : []
            if (!filters.impactedLOB.some(lob => epicLOBs.includes(lob)))
                return false
        }
        if (
            excludeKey !== 'createdDateFrom' &&
            excludeKey !== 'createdDateTo'
        ) {
            if (
                filters.createdDateFrom !== null ||
                filters.createdDateTo !== null
            ) {
                const epicDate = epic.createdDate
                    ? new Date(epic.createdDate)
                    : null
                if (!epicDate) return false
                if (
                    filters.createdDateFrom &&
                    epicDate < filters.createdDateFrom
                )
                    return false
                if (filters.createdDateTo && epicDate > filters.createdDateTo)
                    return false
            }
        }
        return true
    })
}

function CreatedByMultiValue(
    props: import('react-select').MultiValueGenericProps<
        SelectOptionWithAll,
        true
    >
) {
    return (
        <components.MultiValueLabel {...props}>
            <ActorChip email={props.data.value} variant='chip' size='xs' />
        </components.MultiValueLabel>
    )
}

export function FilterBar() {
    const { strategicEpics, epicRows, filters, setFilters } = useDashboard()
    const { resolvedTheme } = useTheme()

    const initiatedEpics = useMemo(() => {
        const ids = new Set(epicRows.map(r => r.epicId))
        return strategicEpics.filter(e => ids.has(String(e.id)))
    }, [strategicEpics, epicRows])

    const selectStyles =
        getReactSelectStyles<SelectOptionWithAll>(resolvedTheme)

    const multiSelectStyles = {
        ...selectStyles,
        valueContainer: (base: CSSObjectWithLabel) => ({
            ...base,
            maxHeight: '80px',
            overflowY: 'auto' as const
        }),
        menuPortal: (base: CSSObjectWithLabel) => ({
            ...base,
            zIndex: 9999
        })
    }

    const activeCount = useMemo(() => {
        let count = 0
        if (filters.createdBy.length > 0) count++
        if (filters.planningCycle.length > 0) count++
        if (filters.createdDateFrom !== null || filters.createdDateTo !== null)
            count++
        if (filters.requestingLOB.length > 0) count++
        if (filters.impactedLOB.length > 0) count++
        if (filters.sponsoringLOB.length > 0) count++
        if (filters.investmentCategory.length > 0) count++
        if (filters.demandGroup.length > 0) count++
        return count
    }, [filters])

    function makeMultiChangeHandler(
        key: keyof DashboardFilters,
        availableOptions: SelectOption[]
    ) {
        return (selected: MultiValue<SelectOptionWithAll>) => {
            if (selected.some(o => o.value === SELECT_ALL_VALUE)) {
                const currentValues = filters[key] as string[]
                const allValues = availableOptions.map(o => o.value)
                setFilters({
                    ...filters,
                    [key]:
                        currentValues.length === allValues.length
                            ? []
                            : allValues
                })
            } else {
                setFilters({ ...filters, [key]: selected.map(o => o.value) })
            }
        }
    }

    function toOptions(values: string[]): SelectOption[] {
        return values.map(v => ({ value: v, label: v }))
    }

    const createdByOptions = useMemo(
        () =>
            getOptions(
                epicsExcluding(initiatedEpics, filters, 'createdBy'),
                'createdBy'
            ),
        [initiatedEpics, strategicEpics, filters]
    )
    const planningCycleOptions = useMemo(
        () =>
            getPlanningCycleOptions(
                epicsExcluding(initiatedEpics, filters, 'planningCycle')
            ),
        [initiatedEpics, strategicEpics, filters]
    )
    const requestingLOBOptions = useMemo(
        () =>
            getOptions(
                epicsExcluding(initiatedEpics, filters, 'requestingLOB'),
                'requestingLOB'
            ),
        [initiatedEpics, strategicEpics, filters]
    )
    const impactedLOBOptions = useMemo(
        () =>
            getImpactedLOBOptions(
                epicsExcluding(initiatedEpics, filters, 'impactedLOB')
            ),
        [initiatedEpics, strategicEpics, filters]
    )
    const sponsoringLOBOptions = useMemo(
        () =>
            getOptions(
                epicsExcluding(initiatedEpics, filters, 'sponsoringLOB'),
                'sponsoringLOB'
            ),
        [initiatedEpics, strategicEpics, filters]
    )
    const investmentCategoryOptions = useMemo(
        () =>
            getOptions(
                epicsExcluding(initiatedEpics, filters, 'investmentCategory'),
                'investmentCategory'
            ),
        [initiatedEpics, strategicEpics, filters]
    )
    const demandGroupOptions = useMemo(
        () =>
            getOptions(
                epicsExcluding(initiatedEpics, filters, 'demandGroup'),
                'demandGroup'
            ),
        [initiatedEpics, strategicEpics, filters]
    )

    if (strategicEpics.length === 0) return null

    return (
        <Box
            border='1px solid'
            borderColor='border.subtle'
            borderRadius='md'
            p={4}
            mb={6}
        >
            <Flex justify='space-between' align='center' mb={3}>
                <Flex align='center' gap={2}>
                    <Text fontWeight='semibold' color='text.emphasis'>
                        Filters
                    </Text>
                    {activeCount > 0 && (
                        <Badge colorPalette='blue' borderRadius='full'>
                            {activeCount} active
                        </Badge>
                    )}
                </Flex>
                {activeCount > 0 && (
                    <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => setFilters(EMPTY_FILTERS)}
                    >
                        Clear all
                    </Button>
                )}
            </Flex>

            <Grid
                templateColumns={{
                    base: '1fr',
                    md: '1fr 1fr',
                    lg: 'repeat(4, 1fr)'
                }}
                gap={{ base: 2, md: 3 }}
            >
                {/* Planning Cycle */}
                <Box>
                    <Text
                        fontSize='xs'
                        color='text.subtle'
                        mb={1}
                        fontWeight='medium'
                    >
                        Planning Cycle
                    </Text>
                    <Select
                        isMulti
                        options={withSelectAll(planningCycleOptions)}
                        value={toOptions(filters.planningCycle)}
                        onChange={makeMultiChangeHandler(
                            'planningCycle',
                            planningCycleOptions
                        )}
                        placeholder='All cycles...'
                        styles={multiSelectStyles}
                        menuPortalTarget={
                            typeof document !== 'undefined'
                                ? document.body
                                : null
                        }
                        menuPosition='fixed'
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option: MultiSelectOption }}
                    />
                </Box>

                {/* Created By */}
                <Box>
                    <Text
                        fontSize='xs'
                        color='text.subtle'
                        mb={1}
                        fontWeight='medium'
                    >
                        Created By
                    </Text>
                    <Select
                        isMulti
                        options={withSelectAll(createdByOptions)}
                        value={toOptions(filters.createdBy)}
                        onChange={makeMultiChangeHandler(
                            'createdBy',
                            createdByOptions
                        )}
                        placeholder='All creators...'
                        styles={multiSelectStyles}
                        menuPortalTarget={
                            typeof document !== 'undefined'
                                ? document.body
                                : null
                        }
                        menuPosition='fixed'
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{
                            Option: CreatedBySelectOption,
                            MultiValueLabel: CreatedByMultiValue
                        }}
                    />
                </Box>

                {/* Requesting LOB */}
                <Box>
                    <Text
                        fontSize='xs'
                        color='text.subtle'
                        mb={1}
                        fontWeight='medium'
                    >
                        Requesting LOB
                    </Text>
                    <Select
                        isMulti
                        options={withSelectAll(requestingLOBOptions)}
                        value={toOptions(filters.requestingLOB)}
                        onChange={makeMultiChangeHandler(
                            'requestingLOB',
                            requestingLOBOptions
                        )}
                        placeholder='All LOBs...'
                        styles={multiSelectStyles}
                        menuPortalTarget={
                            typeof document !== 'undefined'
                                ? document.body
                                : null
                        }
                        menuPosition='fixed'
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option: MultiSelectOption }}
                    />
                </Box>

                {/* Sponsoring LOB */}
                <Box>
                    <Text
                        fontSize='xs'
                        color='text.subtle'
                        mb={1}
                        fontWeight='medium'
                    >
                        Sponsoring LOB
                    </Text>
                    <Select
                        isMulti
                        options={withSelectAll(sponsoringLOBOptions)}
                        value={toOptions(filters.sponsoringLOB)}
                        onChange={makeMultiChangeHandler(
                            'sponsoringLOB',
                            sponsoringLOBOptions
                        )}
                        placeholder='All LOBs...'
                        styles={multiSelectStyles}
                        menuPortalTarget={
                            typeof document !== 'undefined'
                                ? document.body
                                : null
                        }
                        menuPosition='fixed'
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option: MultiSelectOption }}
                    />
                </Box>

                {/* Impacted LOB */}
                <Box>
                    <Text
                        fontSize='xs'
                        color='text.subtle'
                        mb={1}
                        fontWeight='medium'
                    >
                        Impacted LOB
                    </Text>
                    <Select
                        isMulti
                        options={withSelectAll(impactedLOBOptions)}
                        value={toOptions(filters.impactedLOB)}
                        onChange={makeMultiChangeHandler(
                            'impactedLOB',
                            impactedLOBOptions
                        )}
                        placeholder='All LOBs...'
                        styles={multiSelectStyles}
                        menuPortalTarget={
                            typeof document !== 'undefined'
                                ? document.body
                                : null
                        }
                        menuPosition='fixed'
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option: MultiSelectOption }}
                    />
                </Box>

                {/* Investment Category */}
                <Box>
                    <Text
                        fontSize='xs'
                        color='text.subtle'
                        mb={1}
                        fontWeight='medium'
                    >
                        Investment Category
                    </Text>
                    <Select
                        isMulti
                        options={withSelectAll(investmentCategoryOptions)}
                        value={toOptions(filters.investmentCategory)}
                        onChange={makeMultiChangeHandler(
                            'investmentCategory',
                            investmentCategoryOptions
                        )}
                        placeholder='All categories...'
                        styles={multiSelectStyles}
                        menuPortalTarget={
                            typeof document !== 'undefined'
                                ? document.body
                                : null
                        }
                        menuPosition='fixed'
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option: MultiSelectOption }}
                    />
                </Box>

                {/* Demand Group */}
                <Box>
                    <Text
                        fontSize='xs'
                        color='text.subtle'
                        mb={1}
                        fontWeight='medium'
                    >
                        Demand Group
                    </Text>
                    <Select
                        isMulti
                        options={withSelectAll(demandGroupOptions)}
                        value={toOptions(filters.demandGroup)}
                        onChange={makeMultiChangeHandler(
                            'demandGroup',
                            demandGroupOptions
                        )}
                        placeholder='All groups...'
                        styles={multiSelectStyles}
                        menuPortalTarget={
                            typeof document !== 'undefined'
                                ? document.body
                                : null
                        }
                        menuPosition='fixed'
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option: MultiSelectOption }}
                    />
                </Box>

                {/* Created Date range */}
                <Box>
                    <Text
                        fontSize='xs'
                        color='text.subtle'
                        mb={1}
                        fontWeight='medium'
                    >
                        Created Date
                    </Text>
                    <Flex gap={2}>
                        <Box flex={1}>
                            <SingleDatepicker
                                triggerVariant='input'
                                name='created-date-from'
                                date={filters.createdDateFrom ?? undefined}
                                onDateChange={date =>
                                    setFilters({
                                        ...filters,
                                        createdDateFrom: date ?? null
                                    })
                                }
                                propsConfigs={{
                                    inputProps: {
                                        placeholder: 'From',
                                        size: 'sm'
                                    }
                                }}
                            />
                        </Box>
                        <Box flex={1}>
                            <SingleDatepicker
                                triggerVariant='input'
                                name='created-date-to'
                                date={filters.createdDateTo ?? undefined}
                                onDateChange={date =>
                                    setFilters({
                                        ...filters,
                                        createdDateTo: date ?? null
                                    })
                                }
                                propsConfigs={{
                                    inputProps: {
                                        placeholder: 'To',
                                        size: 'sm'
                                    }
                                }}
                            />
                        </Box>
                    </Flex>
                </Box>
            </Grid>
        </Box>
    )
}
