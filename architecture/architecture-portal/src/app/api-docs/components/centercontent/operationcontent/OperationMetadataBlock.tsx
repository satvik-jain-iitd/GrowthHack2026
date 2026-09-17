/* istanbul ignore file */

import { Box, Flex, Text } from '@chakra-ui/react'
import Styles from '@/app/api-docs/api-docs.module.scss'
import Status from '@/app/company-domains/components/LandingPage/Status'
import { DesignScoreBadge, NfrList } from '@/components/ui'
import { OperationMetadata } from '@/app/api-docs/types/apiDocs'

export function OperationMetadataBlock({
    title,
    metadata,
    status
}: {
    title: string
    metadata: OperationMetadata
    status?: string
}) {
    const { operation_desc, design_score, design_report_url, nfrs } = metadata
    return (
        <Box width='100%' boxSizing='border-box'>
            <Flex alignItems='center' gap={2} width='100%' wrap='wrap'>
                <Text as='h3' fontSize='1em' fontWeight='700'>
                    {title}
                </Text>
                <Box ml='auto'>
                    <Status
                        data={{ status: status ?? '' }}
                        rowExpanded={false}
                    />
                </Box>
            </Flex>
            {operation_desc && (
                <Text
                    as='div'
                    className={Styles.apiDocsFontSize}
                    mt='0.75em'
                    textAlign='justify'
                >
                    {operation_desc}
                </Text>
            )}
            <Flex mt='1em' alignItems='center' gap={3} wrap='wrap'>
                <Text
                    as='span'
                    fontSize='0.7em'
                    fontWeight={600}
                    letterSpacing='0.05em'
                    color='#686565'
                    _dark={{ color: 'gray.400' }}
                >
                    SLOs
                </Text>
                <Box flex='1'>
                    <NfrList slas={nfrs} variant='badges' />
                </Box>
                <Box ml='auto'>
                    <DesignScoreBadge
                        score={design_score}
                        href={design_report_url ?? undefined}
                        tooltip='Design Score for the Operation, Click to see the breakdown'
                    />
                </Box>
            </Flex>
        </Box>
    )
}
