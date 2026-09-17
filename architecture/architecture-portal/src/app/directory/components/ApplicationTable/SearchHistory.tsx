/* istanbul ignore file */
import { useEffect, useRef } from 'react'
import {
    Box,
    CloseButton,
    Flex,
    Input,
    InputGroup,
    Text
} from '@chakra-ui/react'
import { IconSearch } from '@americanexpress/dls-icons'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import {
    useApplicationHistorySearch,
    useDomainHistorySearch
} from '../../hooks'

import Select from 'react-select'
import styles from '@/app/directory/directory.module.css'
import { AuditAppResponse } from '../../types'

const options = [
    { value: 'linked', label: 'Linked' },
    { value: 'unlinked', label: 'Unlinked' }
]

const formatDate = (date: string) => {
    if (!date) {
        return date
    }
    const [year, month, day] = date.split('-')
    return `${month}-${day}-${year}`
}

const toDateValue = (date: string): Date | undefined => {
    if (!date) {
        return undefined
    }

    const [year, month, day] = date.split('-').map(Number)
    return new Date(year, month - 1, day)
}

const toInputDateValue = (date?: Date): string => {
    if (!date || Number.isNaN(date.getTime())) {
        return ''
    }

    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const day = `${date.getDate()}`.padStart(2, '0')

    return `${year}-${month}-${day}`
}

const SearchHistory = ({
    rawData,
    recordCount,
    checkboxes,
    setCheckboxes,
    setSortedData,
    searchVal,
    setSearchVal,
    selectedStartDate,
    setSelectedStartDate,
    selectedEndDate,
    setSelectedEndDate,
    searchApic,
    id,
    offset,
    setTotalLogCount,
    columnName,
    sortType,

    setPageNum
}: {
    rawData: Array<AuditAppResponse>
    recordCount: number
    checkboxes: Array<{ value: string; label: string }>
    setCheckboxes: (value: Array<{ value: string; label: string }>) => void
    setSortedData: (data: Array<AuditAppResponse>) => void
    searchVal: string
    setSearchVal: (value: string) => void
    selectedStartDate: string
    setSelectedStartDate: (date: string) => void
    selectedEndDate: string
    setSelectedEndDate: (date: string) => void
    searchApic: 'application' | 'domain'
    id: string
    offset: string
    setTotalLogCount: (data: number) => void
    columnName: string
    sortType: string

    setPageNum: (val: string) => void
}) => {
    const applicationMutation = useApplicationHistorySearch()
    const domainMutation = useDomainHistorySearch()
    const hasMountedCheckboxEffect = useRef(false)
    const startDateValue = toDateValue(selectedStartDate)
    const endDateValue = toDateValue(selectedEndDate)

    const hasActiveFilters = (
        nextSearchVal = searchVal,
        nextStartDate = selectedStartDate,
        nextEndDate = selectedEndDate,
        nextCheckboxes = checkboxes
    ) => {
        const selectedValues = nextCheckboxes.map(({ value }) => value)
        return (
            nextSearchVal.length >= 1 ||
            Boolean(nextStartDate) ||
            Boolean(nextEndDate) ||
            !selectedValues.includes('linked') ||
            !selectedValues.includes('unlinked')
        )
    }

    const resetToRawData = () => {
        setSortedData(rawData)
        setTotalLogCount(recordCount)
        setPageNum('1')
    }

    const runSearch = async ({
        nextSearchVal = searchVal,
        nextStartDate = selectedStartDate,
        nextEndDate = selectedEndDate,
        nextCheckboxes = checkboxes,
        forceRequest = false
    }: {
        nextSearchVal?: string
        nextStartDate?: string
        nextEndDate?: string
        nextCheckboxes?: Array<{ value: string; label: string }>
        forceRequest?: boolean
    }) => {
        if (
            !forceRequest &&
            !hasActiveFilters(
                nextSearchVal,
                nextStartDate,
                nextEndDate,
                nextCheckboxes
            )
        ) {
            resetToRawData()
            return
        }

        const payload = {
            link: nextCheckboxes.some(({ value }) => value === 'linked'),
            unlink: nextCheckboxes.some(({ value }) => value === 'unlinked'),
            search_string: nextSearchVal,
            startDate: formatDate(nextStartDate),
            endDate: formatDate(nextEndDate),
            page: '1',
            offset,
            sortBy: columnName,
            orderBy: sortType,
            ...(searchApic === 'application'
                ? { applicationId: id }
                : { domainId: id })
        }

        const searchData =
            searchApic === 'application'
                ? await applicationMutation.mutateAsync(payload)
                : await domainMutation.mutateAsync(payload)

        setSortedData(searchData?.data ?? [])
        setTotalLogCount(searchData?.recordCount ?? 0)
        setPageNum('1')
    }

    useEffect(() => {
        if (hasActiveFilters()) {
            runSearch({})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnName, sortType])

    const onSearch = async (searchValue: string) => {
        setSearchVal(searchValue)
        await runSearch({ nextSearchVal: searchValue })
    }

    const onDateChange = async (
        startDate: string | null,
        endDate: string | null
    ) => {
        await runSearch({
            nextStartDate: startDate ?? selectedStartDate,
            nextEndDate: endDate ?? selectedEndDate
        })
    }

    useEffect(() => {
        if (!hasMountedCheckboxEffect.current) {
            hasMountedCheckboxEffect.current = true
            return
        }

        runSearch({ nextCheckboxes: checkboxes, forceRequest: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkboxes])

    return (
        <div className='history-input-fields'>
            <Flex
                className={styles.historyFiltersRow}
                justifyContent={'space-between'}
                gap='4'
                wrap='wrap'
                flexDirection={{ base: 'row', mdDown: 'column' }}
            >
                <Box className={`col-md-4 ${styles.historySearchBox}`}>
                    <Text id='history-search-input-label'>Search:</Text>
                    <InputGroup
                        id='history-search-input'
                        startElement={
                            <IconSearch id='company-domain-search-icon' />
                        }
                    >
                        <Input
                            className={styles.historySearchInput}
                            placeholder='Search'
                            size='md'
                            type='search'
                            borderRadius='8px'
                            width={{ mdDown: '100%' }}
                            onChange={e => onSearch(e.target.value)}
                            value={searchVal}
                        />
                    </InputGroup>
                </Box>
                <Box className={`col-md-2 ${styles.historyDateBox}`} minW='0'>
                    <Text id='start-date-label'>Start Date:</Text>
                    <Box
                        position='relative'
                        width='100%'
                        className={styles.historyDateField}
                    >
                        <SingleDatepicker
                            id='start-date'
                            name='start-date'
                            triggerVariant='input'
                            date={startDateValue}
                            onDateChange={date => {
                                const nextValue = toInputDateValue(date)
                                onDateChange(nextValue, null)
                                setSelectedStartDate(nextValue)
                            }}
                            maxDate={endDateValue || new Date()}
                            configs={{
                                dateFormat: 'MM/dd/yyyy'
                            }}
                            propsConfigs={{
                                inputProps: {
                                    className: styles.historyDateInput,
                                    placeholder: 'MM/DD/YYYY',
                                    borderRadius: '8px',
                                    width: '100%',
                                    paddingRight: '4.5rem'
                                },
                                triggerIconBtnProps: {
                                    className: styles.historyDateCalendarButton
                                }
                            }}
                        />
                        {selectedStartDate && (
                            <CloseButton
                                className={styles.historyDateClearButton}
                                size='sm'
                                zIndex={2}
                                onClick={() => {
                                    onDateChange('', null)
                                    setSelectedStartDate('')
                                }}
                            />
                        )}
                    </Box>
                </Box>
                <Box className={`col-md-2 ${styles.historyDateBox}`} minW='0'>
                    <Text id='end-date-label'>End Date:</Text>
                    <Box
                        position='relative'
                        width='100%'
                        className={styles.historyDateField}
                    >
                        <SingleDatepicker
                            id='end-date'
                            name='end-date'
                            triggerVariant='input'
                            date={endDateValue}
                            onDateChange={date => {
                                const nextValue = toInputDateValue(date)
                                onDateChange(null, nextValue)
                                setSelectedEndDate(nextValue)
                            }}
                            minDate={startDateValue}
                            maxDate={new Date()}
                            configs={{
                                dateFormat: 'MM/dd/yyyy'
                            }}
                            propsConfigs={{
                                inputProps: {
                                    className: styles.historyDateInput,
                                    placeholder: 'MM/DD/YYYY',
                                    borderRadius: '8px',
                                    width: '100%',
                                    paddingRight: '4.5rem'
                                },
                                triggerIconBtnProps: {
                                    className: styles.historyDateCalendarButton
                                }
                            }}
                        />
                        {selectedEndDate && (
                            <CloseButton
                                className={styles.historyDateClearButton}
                                size='sm'
                                zIndex={2}
                                onClick={() => {
                                    onDateChange(null, '')
                                    setSelectedEndDate('')
                                }}
                            />
                        )}
                    </Box>
                </Box>
                <Box className={`col-md-4 ${styles.historyFilterBox}`}>
                    <Text id='history-multiselect-label'>Filter by:</Text>

                    <Select
                        isMulti
                        isClearable={false}
                        id='history-multiselect'
                        className='multi-select-container'
                        onChange={selectedOptions => {
                            setCheckboxes([
                                ...(selectedOptions as Array<{
                                    value: string
                                    label: string
                                }>)
                            ])
                        }}
                        value={checkboxes}
                        styles={{
                            multiValueRemove: base => {
                                return checkboxes.length == 1
                                    ? { ...base, display: 'none' }
                                    : {
                                          ...base,
                                          color: 'var(--directory-filter-color)'
                                      }
                            },
                            control: base => ({
                                ...base,
                                borderColor: 'var(--chakra-colors-gray-300)',
                                minHeight: '40px',
                                width: '315px',
                                backgroundColor: 'var(--bgColor-default)'
                            }),
                            input: base => ({
                                ...base,
                                color: 'var(--directory-filter-color)'
                            }),
                            menu: base => ({
                                ...base,
                                backgroundColor: 'var(--bgColor-default)'
                            }),
                            option: base => ({
                                ...base,
                                backgroundColor: 'var(--bgColor-default)'
                            }),
                            multiValue: base => ({
                                ...base,
                                backgroundColor: 'var(--directory-filter)'
                            }),
                            multiValueLabel: base => ({
                                ...base,
                                color: 'var(--directory-filter-color)'
                            })
                        }}
                        options={options}
                        placeholder='Select'
                    />
                </Box>
            </Flex>
        </div>
    )
}

export default SearchHistory

// import React from 'react'

// function SearchHistory() {
//     return <div>SearchHistory</div>
// }

// export default SearchHistory
