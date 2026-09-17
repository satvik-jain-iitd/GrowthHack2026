/* istanbul ignore file */
import React, { useState, useEffect } from 'react'
import { IconSearch } from '@americanexpress/dls-icons'
import {
    Box,
    Button,
    Input,
    InputGroup,
    Dialog,
    Flex,
    CloseButton
} from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import {
    ApiHistory,
    ApiStatusHistoryModalProps
} from '@/app/company-domains/types'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { ApiStatusHistoryTable } from './ApiStatusHistoryTable'

const toComparableIsoDate = (value?: Date): string | null => {
    if (!value || Number.isNaN(value.getTime())) {
        return null
    }

    const year = value.getFullYear()
    const month = `${value.getMonth() + 1}`.padStart(2, '0')
    const day = `${value.getDate()}`.padStart(2, '0')

    return `${year}-${month}-${day}`
}

export const ApiStatusHistoryModal: React.FC<ApiStatusHistoryModalProps> = ({
    columns,
    data,
    isOpen = false,
    onClose,
    operationName = '',
    isLoading
}) => {
    const [searchVal, setSearchVal] = useState<string>('')
    const [selectedStartDate, setSelectedStartDate] = useState<Date>()
    const [selectedEndDate, setSelectedEndDate] = useState<Date>()
    const [filteredData, setFilteredData] = useState<ApiHistory[]>(data)

    useEffect(() => {
        setFilteredData(data)
    }, [data])

    useEffect(() => {
        const comparableStartDate = toComparableIsoDate(selectedStartDate)
        const comparableEndDate = toComparableIsoDate(selectedEndDate)

        const filtered = data
            ?.map((item: ApiHistory) => ({
                wkflow_step_nm: item?.wkflow_step_nm,
                wkflow_sta_val_tx: item?.wkflow_sta_val_tx,
                creat_user_nm: item?.creat_user_nm,
                aprv_ts: item?.aprv_ts,
                userid: item?.userid,
                is_delegate_approval: item?.is_delegate_approval,
                is_delegate_to: item?.is_delegate_to
            }))
            ?.filter((item: ApiHistory) => {
                return Object.values(item).some(value =>
                    value
                        ?.toString()
                        .toLowerCase()
                        .includes(searchVal.toLowerCase())
                )
            })
            .filter((item: ApiHistory) => {
                const itemDate = item.aprv_ts
                    ? toComparableIsoDate(new Date(item.aprv_ts))
                    : null
                return (
                    (!comparableStartDate ||
                        (itemDate ?? '') >= comparableStartDate) &&
                    (!comparableEndDate ||
                        (itemDate ?? '') <= comparableEndDate)
                )
            })
        setFilteredData(filtered)
    }, [searchVal, selectedStartDate, selectedEndDate, data])
    const darkmodeChanges = { border: '1px solid gray' }

    return (
        <>
            {isOpen ? (
                <Dialog.Root
                    open={isOpen}
                    onOpenChange={e => !e.open && onClose()}
                    placement='center'
                >
                    <Dialog.Backdrop height={'100%'} width={'100%'} />
                    <Dialog.Positioner>
                        <Dialog.Content
                            style={{ width: '80%', maxWidth: '1700px' }}
                        >
                            <Dialog.Header
                                className={styles.appDialogHeader}
                                _dark={{
                                    backgroundColor: '#111111 !important',
                                    color: 'white'
                                }}
                            >
                                Audit Logs for Operation: {operationName}
                            </Dialog.Header>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton />
                            </Dialog.CloseTrigger>

                            {isLoading === false && (
                                <Dialog.Body>
                                    <Flex
                                        className={
                                            styles.historyFilterContainer
                                        }
                                    >
                                        <Box
                                            className={`col-md-4 ${styles.searchInput}`}
                                        >
                                            <label
                                                className={
                                                    styles.historySearchLabel
                                                }
                                                htmlFor='history-search-input'
                                                id='history-search-input-label'
                                            >
                                                Search:
                                            </label>
                                            <InputGroup
                                                id='history-search-input'
                                                startElement={
                                                    <IconSearch id='company-domain-search-icon' />
                                                }
                                            >
                                                <Input
                                                    placeholder='Search'
                                                    size='md'
                                                    type='search'
                                                    className={
                                                        styles.domainApiSearch
                                                    }
                                                    onChange={e =>
                                                        setSearchVal(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={searchVal}
                                                    _dark={darkmodeChanges}
                                                />
                                            </InputGroup>
                                        </Box>
                                        <Box
                                            className='col-md-2'
                                            maxWidth='none'
                                            mr={6}
                                        >
                                            <label
                                                className={
                                                    styles.historySearchLabel
                                                }
                                                htmlFor='start-date'
                                                id='start-date-label'
                                            >
                                                Start Date:
                                            </label>
                                            <Box flex='1' position='relative'>
                                                <SingleDatepicker
                                                    id='start-date'
                                                    name='start-date'
                                                    triggerVariant='input'
                                                    date={selectedStartDate}
                                                    onDateChange={date =>
                                                        setSelectedStartDate(
                                                            date
                                                        )
                                                    }
                                                    maxDate={
                                                        selectedEndDate ||
                                                        new Date()
                                                    }
                                                    configs={{
                                                        dateFormat: 'MM/dd/yyyy'
                                                    }}
                                                    propsConfigs={{
                                                        inputProps: {
                                                            placeholder:
                                                                'MM/DD/YYYY',
                                                            border: '1px solid black',
                                                            width: '100%',
                                                            paddingRight:
                                                                '4.5rem'
                                                        }
                                                    }}
                                                />
                                                {selectedStartDate && (
                                                    <CloseButton
                                                        size='sm'
                                                        position='absolute'
                                                        right='2.25rem'
                                                        top='50%'
                                                        transform='translateY(-50%)'
                                                        zIndex={2}
                                                        onClick={() =>
                                                            setSelectedStartDate(
                                                                undefined
                                                            )
                                                        }
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                        <Box
                                            className='col-md-2'
                                            maxWidth='none'
                                        >
                                            <label
                                                className={
                                                    styles.historySearchLabel
                                                }
                                                htmlFor='end-date'
                                                id='end-date-label'
                                            >
                                                End Date:
                                            </label>
                                            <Box flex='1' position='relative'>
                                                <SingleDatepicker
                                                    id='end-date'
                                                    name='end-date'
                                                    triggerVariant='input'
                                                    date={selectedEndDate}
                                                    onDateChange={date =>
                                                        setSelectedEndDate(date)
                                                    }
                                                    minDate={selectedStartDate}
                                                    maxDate={new Date()}
                                                    configs={{
                                                        dateFormat: 'MM/dd/yyyy'
                                                    }}
                                                    propsConfigs={{
                                                        inputProps: {
                                                            placeholder:
                                                                'MM/DD/YYYY',
                                                            border: '1px solid black',
                                                            width: '100%',
                                                            paddingRight:
                                                                '4.5rem'
                                                        }
                                                    }}
                                                />
                                                {selectedEndDate && (
                                                    <CloseButton
                                                        size='sm'
                                                        position='absolute'
                                                        right='2.25rem'
                                                        top='50%'
                                                        transform='translateY(-50%)'
                                                        zIndex={2}
                                                        onClick={() =>
                                                            setSelectedEndDate(
                                                                undefined
                                                            )
                                                        }
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    </Flex>
                                    {filteredData?.length === 0 ? (
                                        <label id='modal-error-msg-label'>
                                            No results found.
                                        </label>
                                    ) : (
                                        <Box
                                            className={
                                                styles.historyTableContainer
                                            }
                                        >
                                            <ApiStatusHistoryTable
                                                columns={columns}
                                                data={filteredData}
                                                isLoading={isLoading}
                                                isModal={true}
                                            />
                                        </Box>
                                    )}
                                </Dialog.Body>
                            )}
                            <Dialog.Footer>
                                <Button
                                    variant='outline'
                                    colorPalette='blue'
                                    onClick={onClose}
                                    className={styles.closeButton}
                                >
                                    Close
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Dialog.Root>
            ) : (
                <ApiStatusHistoryTable
                    columns={columns}
                    data={filteredData}
                    isLoading={isLoading}
                />
            )}
        </>
    )
}
