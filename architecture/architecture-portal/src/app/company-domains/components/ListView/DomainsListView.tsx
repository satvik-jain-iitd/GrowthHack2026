import React from 'react'
import { DomainsListItem } from './DomainsListItem'
import { Table } from '@chakra-ui/react'
import styles from '../../domains-page.module.scss'
import { EARB_APPROVED_UUIDS } from '../../constants'
import { DOMAIN_TEST_IDS } from '../../test-ids'
import { Domain } from '../../types/domains'

interface Props {
    domains?: Domain[]
    isV1: boolean
}

export const DomainsListView = ({ domains, isV1 }: Props) => {
    return (
        <Table.ScrollArea
            height='80vh'
            scrollbar='hidden'
            maxW={{ base: '100vw', lg: '100%' }}
        >
            <Table.Root
                variant='line'
                stickyHeader
                className={styles.domainListView}
                backgroundColor='transparent'
                paddingX='1rem'
                data-testid={DOMAIN_TEST_IDS.listView}
            >
                <Table.Header>
                    <Table.Row
                        backgroundColor={{ base: 'fg.info', _dark: '#53565a' }}
                    >
                        <Table.ColumnHeader color={'#ffffff'}>
                            Domains
                        </Table.ColumnHeader>
                        <Table.ColumnHeader color={'#ffffff'}>
                            Category
                        </Table.ColumnHeader>
                        <Table.ColumnHeader color={'#ffffff'}>
                            Description
                        </Table.ColumnHeader>
                        <Table.ColumnHeader color={'#ffffff'}>
                            Tranche
                        </Table.ColumnHeader>
                        {false && (
                            <Table.ColumnHeader color={'#ffffff'}>
                                {' '}
                                {/* TODO: Replace with isV1 when ready to display EARB */}
                                Status
                            </Table.ColumnHeader>
                        )}
                        <Table.ColumnHeader color={'#ffffff'} minWidth='14rem'>
                            Last Updated / Views
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body backgroundColor='transparent'>
                    {domains?.map(x => (
                        <DomainsListItem
                            key={x.domain_nm}
                            title={x.domain_nm}
                            category={x.domain_category_nm}
                            imgSrcLM={x.im_light_tx}
                            imgSrcDM={x.im_dark_tx}
                            imgSrcFilledLM={x.im_fill_light_tx}
                            imgSrcFilledDM={x.im_fill_dark_tx}
                            noContributions={!x.cntrb_in}
                            description={x.dmn_shrt_ds}
                            domainId={x.company_domain_id}
                            EARBApproved={
                                !!EARB_APPROVED_UUIDS.has(x.company_domain_id)
                            }
                            isV1={isV1}
                            playbookId={x.playbook_id}
                        />
                    ))}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    )
}
