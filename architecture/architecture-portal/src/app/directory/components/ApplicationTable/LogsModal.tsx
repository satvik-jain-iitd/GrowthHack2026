/* istanbul ignore file */
import React, { useState, useEffect, useRef } from 'react'
import {
    Button,
    Dialog,
    Grid,
    GridItem,
    CloseButton,
    Text,
    Box,
    Pagination,
    ButtonGroup,
    IconButton,
    Spinner
} from '@chakra-ui/react'
import { IconChevronLeft, IconChevronRight } from '@americanexpress/dls-icons'
import styles from '@/app/directory/directory.module.css'
import SearchHistory from './SearchHistory'
import LogsModalTable from './LogsModalTable'
import { LogsModalProps } from '../../types'
import { useApplicationHistorySearch } from '../../hooks'

const historyFilterOptions = [
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

const LogsModal = (props: LogsModalProps) => {
    const {
        isOpen,
        columns,
        data,
        searchApic,
        id,
        offset,
        fetchData,
        name,
        recordCount,
        serverError,
        onClose,
        isLoading = false
    } = props

    const [sortedData, setSortedData] = useState(data)
    const [searchVal, setSearchVal] = useState('')
    const [selectedStartDate, setSelectedStartDate] = useState('')
    const [selectedEndDate, setSelectedEndDate] = useState('')
    const [totalLogCount, setTotalLogCount] = useState(recordCount)
    const [pageNum, setPageNum] = useState('1')
    const [columnName, setColumnName] = useState('')
    const [sortType, setSortType] = useState('')
    const [checkboxes, setCheckboxes] = useState(historyFilterOptions)
    const hasFetchedInitialData = useRef(false)
    const pageSize = Number(offset) || 10
    const applicationSearchMutation = useApplicationHistorySearch()

    const hasLinkedSelected = checkboxes.some(({ value }) => value === 'linked')
    const hasUnlinkedSelected = checkboxes.some(
        ({ value }) => value === 'unlinked'
    )

    const hasActiveFilters =
        searchVal.length >= 1 ||
        selectedStartDate ||
        selectedEndDate ||
        !hasLinkedSelected ||
        !hasUnlinkedSelected

    const hasRows = sortedData?.length !== 0
    const showEmptyState = !isLoading && !hasRows && serverError === null
    const showErrorState = !isLoading && !hasRows && serverError !== null

    useEffect(() => {
        setTotalLogCount(recordCount)
    }, [recordCount])

    useEffect(() => {
        setSortedData(data)
    }, [data])

    useEffect(() => {
        if (!isOpen) {
            hasFetchedInitialData.current = false
        }
    }, [isOpen])

    useEffect(() => {
        if (
            !isOpen ||
            hasActiveFilters ||
            data.length > 0 ||
            recordCount > 0 ||
            hasFetchedInitialData.current
        ) {
            return
        }

        hasFetchedInitialData.current = true

        const payload = {
            page: '1',
            offset,
            sortBy: columnName,
            orderBy: sortType,
            ...(searchApic === 'application'
                ? { applicationId: id }
                : { domainId: id })
        }

        fetchData(payload).then(response => {
            setSortedData(response.data)
            setTotalLogCount(response.recordCount)
            setPageNum('1')
        })
    }, [
        isOpen,
        hasActiveFilters,
        data.length,
        recordCount,
        offset,
        columnName,
        sortType,
        searchApic,
        id,
        fetchData
    ])

    const handleChange = async (page: string) => {
        if (hasActiveFilters) {
            const payload = {
                page,
                offset,
                sortBy: columnName,
                orderBy: sortType,
                search_string: searchVal,
                startDate: formatDate(selectedStartDate),
                endDate: formatDate(selectedEndDate),
                ...(searchApic === 'application'
                    ? {
                          applicationId: id,
                          link: hasLinkedSelected,
                          unlink: hasUnlinkedSelected
                      }
                    : {
                          domainId: id,
                          link: hasLinkedSelected,
                          unlink: hasUnlinkedSelected
                      })
            }

            const response =
                searchApic === 'application'
                    ? await applicationSearchMutation.mutateAsync(payload)
                    : await fetchData(payload)

            setSortedData(response.data)
            setTotalLogCount(response.recordCount)
            setPageNum(page)
            return
        }

        if (
            searchApic === 'application' &&
            searchVal.length === 0 &&
            !selectedStartDate &&
            !selectedEndDate
        ) {
            const payload = {
                applicationId: id,
                page: page,
                offset: offset,
                sortBy: columnName,
                orderBy: sortType
            }
            fetchData(payload).then(respo => {
                setSortedData(respo.data)
                setTotalLogCount(() => respo.recordCount)
            })
        }

        if (
            searchApic === 'domain' &&
            searchVal.length === 0 &&
            !selectedStartDate &&
            !selectedEndDate
        ) {
            const payload = {
                domainId: id,
                link: true,
                unlink: true,
                search_string: '',
                page: page,
                offset: offset,
                sortBy: columnName,
                orderBy: sortType
            }
            const response = await fetchData(payload)
            setSortedData(response.data)
            setTotalLogCount(response.recordCount)
        }
        setPageNum(page)
    }

    const handleSort = (key: string) => {
        let direction = 'asc'
        if (columnName === key && sortType === 'asc') {
            direction = 'desc'
        }

        setColumnName(key)
        if (direction === 'asc') {
            setSortType('asc')
        } else {
            setSortType('desc')
        }

        if (
            searchApic === 'application' &&
            searchVal.length === 0 &&
            !selectedStartDate &&
            !selectedEndDate
        ) {
            const payload = {
                applicationId: id,
                page: pageNum,
                offset: offset,
                sortBy: key,
                orderBy: direction === 'asc' ? 'asc' : 'desc'
            }
            fetchData(payload).then(respo => {
                setSortedData(respo.data)
                setTotalLogCount(() => respo.recordCount)
            })
        }

        if (
            searchApic === 'domain' &&
            searchVal.length === 0 &&
            !selectedStartDate &&
            !selectedEndDate
        ) {
            const payload = {
                domainId: id,
                page: pageNum,
                offset: offset,
                sortBy: key,
                orderBy: direction === 'asc' ? 'asc' : 'desc'
            }
            fetchData(payload).then(respo => {
                setSortedData(respo.data)
                setTotalLogCount(() => respo.recordCount)
            })
        }
    }

    const handleClose = () => {
        setSelectedStartDate('')
        setSelectedEndDate('')
        props.onClose?.()
    }

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={e => !e.open && handleClose()}
            placement='center'
            closeOnInteractOutside={true}
            size='xl'
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content
                    className={`${styles.logsModalContent} logsModalContent`}
                >
                    <Dialog.Header className='appDialogHeader'>
                        <Dialog.Title>Audit History</Dialog.Title>
                    </Dialog.Header>
                    <Text
                        id='history-modal-name'
                        ml='6'
                        mb='4'
                        fontWeight={600}
                        fontSize={'1rem'}
                        lineHeight={'1.5rem'}
                    >
                        {name}
                    </Text>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton onClick={onClose} />
                    </Dialog.CloseTrigger>
                    <Dialog.Body className={styles.logsModalBody}>
                        <Box mb='5'>
                            <SearchHistory
                                rawData={data}
                                recordCount={recordCount}
                                checkboxes={checkboxes}
                                setCheckboxes={setCheckboxes}
                                setSortedData={setSortedData}
                                searchVal={searchVal}
                                setSearchVal={setSearchVal}
                                selectedStartDate={selectedStartDate}
                                setSelectedStartDate={setSelectedStartDate}
                                selectedEndDate={selectedEndDate}
                                setSelectedEndDate={setSelectedEndDate}
                                setTotalLogCount={setTotalLogCount}
                                searchApic={searchApic}
                                id={id}
                                offset={offset}
                                columnName={columnName}
                                sortType={sortType}
                                setPageNum={setPageNum}
                            />
                        </Box>
                        <Box className={styles.logsResultsContainer}>
                            {hasRows && (
                                <Box
                                    className={`${styles.logsResultsShell} ${
                                        isLoading
                                            ? styles.logsResultsShellLoading
                                            : ''
                                    }`}
                                >
                                    <Box
                                        className={
                                            styles.logsResultsTableScroll
                                        }
                                    >
                                        <LogsModalTable
                                            columns={columns}
                                            sortedData={sortedData}
                                            columnName={columnName}
                                            sortType={sortType}
                                            handleSort={handleSort}
                                        />
                                    </Box>
                                    <Box
                                        className={styles.logsPaginationSection}
                                    >
                                        <Grid
                                            templateColumns='minmax(0, 1fr) auto'
                                            templateRows={{
                                                base: 'auto auto',
                                                md: 'auto'
                                            }}
                                            alignItems='center'
                                            gap='4'
                                            className={`${styles.logsPaginationGrid} audit-history-bottom-section`}
                                        >
                                            <GridItem minW='0'>
                                                <Text mt='2'>
                                                    Showing{' '}
                                                    {pageSize * +pageNum >
                                                    totalLogCount
                                                        ? totalLogCount
                                                        : pageSize *
                                                          +pageNum}{' '}
                                                    of {totalLogCount} Results
                                                </Text>
                                            </GridItem>
                                            {totalLogCount > pageSize && (
                                                <GridItem
                                                    textAlign='right'
                                                    minW='fit-content'
                                                    colSpan={{ base: 1, md: 1 }}
                                                >
                                                    <Box
                                                        className={
                                                            styles.logsPaginationScroll
                                                        }
                                                    >
                                                        <Pagination.Root
                                                            count={
                                                                totalLogCount
                                                            }
                                                            pageSize={10}
                                                            page={+pageNum}
                                                            onPageChange={details =>
                                                                handleChange(
                                                                    details.page.toString()
                                                                )
                                                            }
                                                        >
                                                            <ButtonGroup
                                                                variant='ghost'
                                                                size='sm'
                                                                className={
                                                                    styles.logsPaginationButtons
                                                                }
                                                            >
                                                                <Pagination.PrevTrigger
                                                                    asChild
                                                                >
                                                                    <IconButton
                                                                        color={{
                                                                            base: '#006fcf'
                                                                        }}
                                                                    >
                                                                        <IconChevronLeft />
                                                                        Previous
                                                                    </IconButton>
                                                                </Pagination.PrevTrigger>

                                                                <Pagination.Items
                                                                    render={page => (
                                                                        <IconButton
                                                                            variant={{
                                                                                base: 'ghost',
                                                                                _selected:
                                                                                    'solid'
                                                                            }}
                                                                            backgroundColor={{
                                                                                _selected:
                                                                                    '#006fcf'
                                                                            }}
                                                                        >
                                                                            {
                                                                                page.value
                                                                            }
                                                                        </IconButton>
                                                                    )}
                                                                />

                                                                <Pagination.NextTrigger
                                                                    asChild
                                                                >
                                                                    <IconButton
                                                                        color={{
                                                                            base: '#006fcf'
                                                                        }}
                                                                    >
                                                                        Next
                                                                        <IconChevronRight />
                                                                    </IconButton>
                                                                </Pagination.NextTrigger>
                                                            </ButtonGroup>
                                                        </Pagination.Root>
                                                    </Box>
                                                </GridItem>
                                            )}
                                        </Grid>
                                    </Box>
                                </Box>
                            )}

                            {showEmptyState && (
                                <Box
                                    className={`${styles.logsStateBox} ${styles.logsEmptyState} modal-error-msg`}
                                >
                                    <Text id='modal-error-msg-label'>
                                        No results found.
                                    </Text>
                                </Box>
                            )}

                            {showErrorState && (
                                <Box
                                    className={`${styles.logsStateBox} ${styles.logsErrorState} modal-error-msg`}
                                >
                                    <Text id='modal-error-msg-label'>
                                        An Error has occurred. Please reload the
                                        page.
                                    </Text>
                                    <Button
                                        id='modal-error-msg-btn'
                                        variant='outline'
                                        colorScheme='blue'
                                        onClick={() => window.location.reload()}
                                    >
                                        Reload
                                    </Button>
                                </Box>
                            )}

                            {isLoading && (
                                <Box className={styles.logsLoadingOverlay}>
                                    <Spinner />
                                </Box>
                            )}
                        </Box>
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button
                            variant='outline'
                            className='closeButton'
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default LogsModal
