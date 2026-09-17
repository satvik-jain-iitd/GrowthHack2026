/* istanbul ignore file */

import { Playbook } from '@/types/Playbook'
import {
    VStack,
    Box,
    HStack,
    Button,
    Progress,
    Stack,
    Text,
    Link
} from '@chakra-ui/react'
import { Tooltip } from '@/components/ui'
import { EtpEcmiCrossDomainApiRow } from '@/app/resources/metrics/types/EtpEcmiCrossDomainApi'

export function ConsumerApiHeader({
    playbook,
    isAdd,
    handleAdd,
    metrics,
    isMetricsLoading,
    isUserAuthorizedToEdit
}: {
    playbook: Playbook | undefined
    isAdd: boolean
    handleAdd: (isAdd: boolean) => void
    metrics: EtpEcmiCrossDomainApiRow | undefined
    isMetricsLoading: boolean
    isUserAuthorizedToEdit: boolean
}) {
    const { playbook_nm } = playbook || {}
    const row = isMetricsLoading ? undefined : metrics
    const crossDomainMetric = row?.prod_certified_pct ?? 0
    const earbApprovedMetric = row?.earb_approved_pct ?? 0
    const totalUniqueOperationsCount = row?.identified_apis ?? 0
    const certifiedCrossDomainTypeACount = row?.prod_certified_type_ab ?? 0
    const earbApprovedCrossDomainCount = row?.earb_approved_type_ab ?? 0

    const crossDomainMetricTooltip = `${certifiedCrossDomainTypeACount} out of ${totalUniqueOperationsCount} operations are Type A / B that are Production Certified.`

    const earbApprovedMetricTooltip = `${earbApprovedCrossDomainCount} out of ${totalUniqueOperationsCount} operations are Type A / B that are EARB Approved.`

    return (
        <VStack
            align='start'
            mb={8}
            bg='#ECEDEE'
            _dark={{ bg: '#1A202C' }}
            px={8}
            py={4}
            borderRadius='2xl'
            w='100%'
        >
            <HStack w='100%' align='start' justify='space-between'>
                <Box
                    as='h1'
                    fontSize='3xl'
                    fontWeight='300'
                    color='#00175A'
                    _dark={{ color: '#fff' }}
                >
                    {'Initiative: ' + (playbook_nm ? playbook_nm : ' API')}
                    <br />
                    {' Cross-Domain APIs'}
                </Box>
                {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                <Link
                    href='/contribute/initiatives-consumer-apis'
                    target='_blank'
                    rel='noopener noreferrer'
                    fontSize='sm'
                    color='#0066BE'
                    _dark={{ color: '#63B3ED' }}
                    textDecoration='underline'
                    mt={2}
                    aria-label='Help: Consumer APIs guide'
                >
                    Help
                </Link>
            </HStack>
            <HStack w={'100%'}>
                {isUserAuthorizedToEdit && (
                    <Button
                        variant={'subtle'}
                        color='#0066BE'
                        _dark={{
                            color: '#fff'
                        }}
                        border='1px solid #0066BE'
                        onClick={() => handleAdd(!isAdd)}
                        title={
                            !isAdd
                                ? 'Add a consumer API to this initiative'
                                : 'Close add API form'
                        }
                    >
                        {!isAdd ? 'Add API' : 'Close'}
                    </Button>
                )}
                <Tooltip
                    showArrow
                    content={crossDomainMetricTooltip}
                    contentProps={{
                        css: { '--tooltip-bg': '#2D3748' }
                    }}
                >
                    <HStack ml='auto' gap={8} cursor='help'>
                        <VStack align='start' gap={2}>
                            <Text
                                color='#00175A'
                                _dark={{
                                    color: '#fff'
                                }}
                            >
                                % of Cross-Domain APIs that are Type A / B
                                certified
                            </Text>
                            <Stack gap='4' w='100%'>
                                <Progress.Root
                                    variant='outline'
                                    value={crossDomainMetric}
                                >
                                    <Progress.Track
                                        h='30px'
                                        borderRadius='16px'
                                        overflow='hidden'
                                    >
                                        <Progress.Range
                                            bg='#33A0FF'
                                            borderRadius='16px'
                                        />
                                    </Progress.Track>
                                </Progress.Root>
                            </Stack>
                            <Tooltip
                                showArrow
                                content={earbApprovedMetricTooltip}
                                contentProps={{
                                    css: { '--tooltip-bg': '#2D3748' }
                                }}
                            >
                                <Text
                                    fontSize='xs'
                                    color='gray.500'
                                    _dark={{ color: 'gray.400' }}
                                    mt={1}
                                    cursor='help'
                                >
                                    {earbApprovedMetric.toFixed(2)}% of Cross
                                    Domain APIs that are Type A / B EARB
                                    approved
                                </Text>
                            </Tooltip>
                        </VStack>
                        <Text
                            color='#006FCF'
                            fontWeight='100'
                            fontSize='54px'
                            lineHeight='120%'
                            letterSpacing='0%'
                            ml='auto'
                        >
                            {crossDomainMetric.toFixed(2) + '%'}
                        </Text>
                    </HStack>
                </Tooltip>
            </HStack>
        </VStack>
    )
}
