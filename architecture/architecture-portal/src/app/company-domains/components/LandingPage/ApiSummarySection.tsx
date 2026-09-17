/* istanbul ignore file */
import { Box, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react'
import Image from 'next/image'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { ApiEndpoint, ApiMetadata } from '@/app/company-domains/types'
import { CopyApiUrlButton } from '@/app/company-domains/components/LandingPage/CopyApiUrlButton'
import ExpandableText from './ExpandableText'
import EbcmBadgeList from './EbcmBadgeList'
import { Tooltip } from '@/components/ui'
import CodeText from '@/components/ui/CodeText'

interface ApiSummarySectionProps {
    apiUrl: string
    consumerDomainNames?: string
    createMarkup: (text: string) => { __html: string }
    data: ApiMetadata & ApiEndpoint
    endpointMetadata: ApiEndpoint[]
    tooltipStyles: Record<string, string | number>
}

const ApiSummarySection = ({
    apiUrl,
    consumerDomainNames,
    createMarkup,
    data,
    endpointMetadata,
    tooltipStyles
}: ApiSummarySectionProps) => {
    const activeEndpointCount =
        endpointMetadata?.filter(ep => ep?.delete?.toLowerCase() !== 'deleted')
            .length ?? 0

    return (
        <Box p={4}>
            <Flex alignItems='flex-start' gap={6}>
                <Box width={'80%'}>
                    <Grid templateColumns='repeat(3, 1fr)' gap={3} flex='1'>
                        <GridItem
                            color={{
                                base: 'black',
                                _dark: 'white'
                            }}
                        >
                            <Heading
                                as='h4'
                                className={styles.apiName}
                                display='flex'
                                alignItems='center'
                                gap={2}
                            >
                                {data?.api_nm || '--'}
                                <CopyApiUrlButton apiUrl={apiUrl} />
                            </Heading>
                        </GridItem>
                        <GridItem>
                            <Text
                                fontWeight='bold'
                                className={styles.content}
                                mb={2}
                            >
                                Provider Company Domain
                            </Text>
                            <Text className={styles.description}>
                                {data?.prvd_company_domain_nm?.join(', ') ||
                                    '--'}
                            </Text>
                        </GridItem>

                        <GridItem
                            color={{
                                base: 'black',
                                _dark: 'white'
                            }}
                        >
                            <Text className={styles.content}>API Resource</Text>
                            <Text className={styles.description}>
                                {data?.api_resource ? (
                                    <CodeText text={data?.api_resource} />
                                ) : (
                                    '--'
                                )}
                            </Text>
                        </GridItem>
                        <GridItem
                            color={{
                                base: 'black',
                                _dark: 'white'
                            }}
                        >
                            <Text className={styles.content}>
                                API Description
                            </Text>
                            <ExpandableText className={styles.description}>
                                {data?.api_ds ? (
                                    <div
                                        // eslint-disable-next-line react/no-danger
                                        dangerouslySetInnerHTML={createMarkup(
                                            data?.api_ds
                                        )}
                                    />
                                ) : (
                                    '--'
                                )}
                            </ExpandableText>
                        </GridItem>
                        <GridItem>
                            <Tooltip
                                disabled={!consumerDomainNames}
                                content='Consumer Company Domain data is derived from operational-level API endpoint information.'
                                contentProps={{
                                    css: tooltipStyles
                                }}
                            >
                                <Text className={styles.content}>
                                    Consumer Company Domain
                                </Text>
                            </Tooltip>
                            <ExpandableText className={styles.description}>
                                <span>{consumerDomainNames || '--'}</span>
                            </ExpandableText>
                        </GridItem>
                        <GridItem>
                            <Tooltip
                                disabled={
                                    !data?.ebcm_v10?.length &&
                                    !data?.ebcm_names?.length
                                }
                                content='EBCM data is derived from operational-level API endpoint information.'
                                contentProps={{
                                    css: tooltipStyles
                                }}
                            >
                                <Text
                                    fontWeight='bold'
                                    className={styles.content}
                                    mb={2}
                                >
                                    EBCM
                                </Text>
                            </Tooltip>
                            <EbcmBadgeList
                                capabilities={data?.ebcm_v10}
                                fallbackNames={data?.ebcm_names}
                            />
                        </GridItem>
                    </Grid>
                </Box>
                <Box width='20%' textAlign={'right'}>
                    <Box
                        className={styles.endpointIconText}
                        style={{ flex: 0 }}
                        textAlign={'left'}
                    >
                        <Image
                            src='/company-domains/api-endpoints.svg'
                            alt='API Endpoints Icon'
                            width={65}
                            height={65}
                        />
                        <div className={styles.endpointText}>
                            <h3
                                style={{
                                    fontSize: '36px',
                                    color: '#007bff'
                                }}
                            >
                                {activeEndpointCount}
                            </h3>
                            <h5
                                style={{
                                    fontSize: '14px',
                                    color: '#007bff',
                                    marginTop: '5px'
                                }}
                            >
                                {activeEndpointCount > 1
                                    ? 'Operations'
                                    : 'Operation'}
                            </h5>
                        </div>
                    </Box>
                </Box>
            </Flex>
        </Box>
    )
}

export default ApiSummarySection
