import React from 'react'
import { Box, Spinner, Text } from '@chakra-ui/react'
import { useGetADRAuditHistory } from '@/app/adrs/hooks/useGetADRAuditHistory'
import { Accordion, Table } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { AvatarTableRow } from '@/components/ui'
import AccordianArrowIcon from '@/app/docs/components/AccordianArrowIcon'

export type ADRAuditHistoryProps = {
    adrId: string
}

export default function ADRAuditHistory({ adrId }: ADRAuditHistoryProps) {
    const { data, isLoading, error } = useGetADRAuditHistory(adrId)

    return (
        <Accordion.Root orientation='vertical' collapsible>
            <Accordion.Item value='audit-history'>
                <Accordion.ItemTrigger
                    borderRadius='8px'
                    py={8}
                    px={2}
                    _hover={{ cursor: 'pointer' }}
                >
                    <Text textAlign='left' fontWeight={700} color='#006FCF'>
                        Audit History
                    </Text>
                    <AccordianArrowIcon />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                    <Accordion.ItemBody>
                        {isLoading ? (
                            <Spinner />
                        ) : error ? (
                            <Text color='red.500'>
                                Failed to load audit history.
                            </Text>
                        ) : !data || data.length === 0 ? (
                            <Text>No audit history found.</Text>
                        ) : (
                            <Box maxH='320px' overflowY='auto'>
                                <Table.Root variant='outline'>
                                    <Table.Header backgroundColor='bg.info'>
                                        <Table.Row>
                                            <Table.ColumnHeader>
                                                Actor
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader>
                                                Action
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader>
                                                Date
                                            </Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {data.map((entry, idx) => (
                                            <Table.Row key={idx}>
                                                <Table.Cell>
                                                    {entry.creat_user_email_ad_tx ===
                                                    'Architecture Portal' ? (
                                                        <AvatarTableRow
                                                            email={
                                                                entry.creat_user_email_ad_tx
                                                            }
                                                            portalLogo
                                                        />
                                                    ) : (
                                                        <AvatarTableRow
                                                            email={
                                                                entry.creat_user_email_ad_tx
                                                            }
                                                        />
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {entry.action_nm}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {dayjs(entry.aud_ts).format(
                                                        'MMM D, YYYY h:mm A'
                                                    )}
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        )}
                    </Accordion.ItemBody>
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Root>
    )
}
