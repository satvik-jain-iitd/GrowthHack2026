import React from 'react'
import { DomainsCard } from './DomainsCard'
import { Box, Text, Grid } from '@chakra-ui/react'
import { EARB_APPROVED_UUIDS } from '../../constants'
import { DOMAIN_TEST_IDS } from '../../test-ids'
import { Domain, Filters } from '../../types/domains'

interface Props {
    viewFilters: Filters[]
    domains?: Domain[]
    isV1: boolean
}

export const DomainsCardView = ({ viewFilters, domains, isV1 }: Props) => {
    return (
        <Box
            maxWidth='1520px'
            width='100%'
            data-testid={DOMAIN_TEST_IDS.cardContainer}
            marginTop={{ base: isV1 ? '50px' : '10px', sm: '10px' }}
        >
            {viewFilters.map(categoryName => {
                const filteredDomains = domains?.filter(
                    x => x.domain_category_nm === categoryName
                )
                if (filteredDomains?.length && filteredDomains.length > 0) {
                    return (
                        <Box key={categoryName} marginBottom='10px'>
                            <Text
                                as='h4'
                                fontFamily='BentonSans'
                                fontSize='16px'
                                fontWeight={460}
                                lineHeight='28px'
                                textAlign='left'
                                color={{ base: '#333', _dark: '#c8c9c7' }}
                            >
                                {categoryName}
                            </Text>
                            <Grid
                                templateColumns={{
                                    lg: 'repeat(4, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                    sm: 'repeat(1, 1fr)'
                                }}
                                gap='3'
                            >
                                {filteredDomains?.map(x => (
                                    <DomainsCard
                                        key={x.domain_nm}
                                        title={x.domain_nm}
                                        imgSrcLM={x.im_light_tx}
                                        imgSrcDM={x.im_dark_tx}
                                        imgSrcFilledLM={x.im_fill_light_tx}
                                        imgSrcFilledDM={x.im_fill_dark_tx}
                                        noContributions={!x.cntrb_in}
                                        description={x.dmn_shrt_ds}
                                        domainId={x.company_domain_id}
                                        playbookId={x.playbook_id}
                                        EARBApproved={
                                            !!EARB_APPROVED_UUIDS.has(
                                                x.company_domain_id
                                            )
                                        }
                                    />
                                ))}
                            </Grid>
                        </Box>
                    )
                }
                return <></>
            })}
        </Box>
    )
}
