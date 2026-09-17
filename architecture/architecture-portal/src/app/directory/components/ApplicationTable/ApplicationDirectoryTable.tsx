/* istanbul ignore file */
import React from 'react'
import { Box, Table } from '@chakra-ui/react'
import { UserAvatar } from '@/app/company-domains/components/UserAvatar'
import { IconChevronDown, IconChevronRight } from '@americanexpress/dls-icons'
import { ApplicationDetail } from '@/app/company-domains/components/LandingPage/ApplicationDetail'
import ApplicationListActions from './ApplicationListActions'
import {
    Application,
    ApplicationCentralInfo
} from '@/app/company-domains/types'
import { useDirectoryContext } from '@/context'

interface Column3Data {
    email?: string
    name?: string
}
interface RowData {
    column1?: string
    column2?: string
    column3?: Column3Data
    column4?: string
    column5?: string
    expand?: boolean
}

export const ApplicationDirectoryTable = ({
    columnNames = [],
    rows = [],
    data,
    actionsActive = '',
    modalView
}: {
    columnNames: string[]
    rows: RowData[]
    data: (Application & ApplicationCentralInfo)[]
    actionsActive: string
    modalView: boolean
}) => {
    const { applicationExpandedIndex, setApplicationExpandedIndex } =
        useDirectoryContext() || {}

    const handleExpandRowClick = (index: number | null) => {
        if (applicationExpandedIndex == index) {
            setApplicationExpandedIndex?.(null)
        } else {
            setApplicationExpandedIndex?.(index)
        }
    }
    const overFlowMenu = (
        rowData: Application & ApplicationCentralInfo,
        expanded: boolean
    ) => {
        if (actionsActive === 'Applications') {
            return (
                <ApplicationListActions
                    data={rowData}
                    expanded={expanded}
                    modalView={modalView}
                />
            )
        }
        return ''
    }

    return (
        <Box id='application-directory-container' p={5}>
            <Table.Root
                id='company-directory-table'
                className='directory-table'
            >
                <Table.Header id='company-directory-table-head'>
                    <Table.Row
                        backgroundColor={{ base: '#DDE9F4', _dark: '#53565a' }}
                        height='48px'
                        justifyContent='space-between'
                        id='company-directory-table-head-row'
                    >
                        <Table.ColumnHeader
                            color={{ base: 'black', _dark: 'white' }}
                            fontWeight='600'
                            width={'3%'}
                        ></Table.ColumnHeader>
                        {columnNames?.map((column, i) => {
                            return (
                                <Table.ColumnHeader
                                    color={{ base: 'black', _dark: 'white' }}
                                    fontWeight='600'
                                    className='company-directory-table-head-cell l-n-7'
                                    key={'headCell' + i}
                                    align={
                                        column === 'Action' ? 'right' : 'left'
                                    }
                                >
                                    {column}
                                </Table.ColumnHeader>
                            )
                        })}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {rows?.map((rowData, index) => {
                        return (
                            <React.Fragment key={index}>
                                <Table.Row
                                    className={
                                        applicationExpandedIndex == index
                                            ? 'company-directory-table-row-expanded'
                                            : 'company-directory-table-row'
                                    }
                                    background={
                                        applicationExpandedIndex == index
                                            ? '#006FCF'
                                            : 'inherit'
                                    }
                                    key={'row' + index}
                                >
                                    <Table.Cell
                                        id={
                                            applicationExpandedIndex == index
                                                ? 'domain-api-table-cell-expanded'
                                                : 'domain-api-table-cell'
                                        }
                                        onClick={() =>
                                            handleExpandRowClick(index)
                                        }
                                        textAlign={'center'}
                                    >
                                        {applicationExpandedIndex == index ? (
                                            <IconChevronDown color={'white'} />
                                        ) : (
                                            <IconChevronRight />
                                        )}
                                    </Table.Cell>
                                    {columnNames?.map((columns, i) => {
                                        const columnIndex = i + 1
                                        return rowData?.[
                                            `column${columnIndex}` as keyof typeof rowData
                                        ] === 'action' ? (
                                            <Table.Cell
                                                align='right'
                                                key={'cell' + i}
                                                width='30px'
                                                color={
                                                    applicationExpandedIndex ==
                                                    index
                                                        ? 'white'
                                                        : {
                                                              base: 'black',
                                                              _dark: 'white'
                                                          }
                                                }
                                                id={
                                                    applicationExpandedIndex ==
                                                    index
                                                        ? 'company-directory-table-cell-expanded'
                                                        : 'company-directory-table-cell'
                                                }
                                                data-testid={
                                                    index + 1 === rows?.length
                                                        ? 'menuItems'
                                                        : ''
                                                }
                                            >
                                                {overFlowMenu(
                                                    data?.[index],
                                                    applicationExpandedIndex ==
                                                        index || false
                                                )}
                                            </Table.Cell>
                                        ) : (
                                            <Table.Cell
                                                width={
                                                    columnIndex == 2
                                                        ? '500px'
                                                        : '350px'
                                                }
                                                className='domain-owner'
                                                color={
                                                    applicationExpandedIndex ==
                                                    index
                                                        ? 'white'
                                                        : {
                                                              base: 'black',
                                                              _dark: 'white'
                                                          }
                                                }
                                                key={'cell' + i}
                                                id={
                                                    applicationExpandedIndex ==
                                                    index
                                                        ? 'company-directory-table-cell-expanded'
                                                        : 'company-directory-table-cell'
                                                }
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    {columnIndex == 3 &&
                                                        rowData?.['column3']
                                                            ?.name && (
                                                            <UserAvatar
                                                                email={
                                                                    rowData?.[
                                                                        'column3'
                                                                    ]?.email
                                                                }
                                                                name={
                                                                    rowData?.[
                                                                        `column3`
                                                                    ]?.name
                                                                }
                                                            />
                                                        )}
                                                    <span
                                                        style={{
                                                            marginLeft: '10px'
                                                        }}
                                                    >
                                                        {columnIndex == 3
                                                            ? rowData?.[
                                                                  `column${columnIndex}`
                                                              ]?.name
                                                            : rowData?.[
                                                                  `column${columnIndex}` as
                                                                      | 'column1'
                                                                      | 'column2'
                                                                      | 'column4'
                                                                      | 'column5'
                                                              ] || '--'}
                                                    </span>
                                                </div>
                                            </Table.Cell>
                                        )
                                    })}
                                </Table.Row>
                                {applicationExpandedIndex == index && (
                                    <Table.Row id='company-directory-expandable-content'>
                                        <Table.Cell
                                            colSpan={6}
                                            className='pad-2 companyDetailContainer'
                                        >
                                            <Box>
                                                <ApplicationDetail
                                                    applicationData={
                                                        data?.[index]
                                                    }
                                                    setOpenModal={() =>
                                                        handleExpandRowClick(
                                                            index
                                                        )
                                                    }
                                                />
                                            </Box>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </React.Fragment>
                        )
                    })}
                </Table.Body>
            </Table.Root>
        </Box>
    )
}

export default ApplicationDirectoryTable
