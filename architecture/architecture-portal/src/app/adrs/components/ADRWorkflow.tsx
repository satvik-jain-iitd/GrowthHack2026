'use client'

import { useGetADR } from '@/app/docs/hooks/useGetADR'
import { IconAlert } from '@americanexpress/dls-icons'
import { Accordion, Box, Flex, Icon, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import ADRWorkflowStepper from '@/app/adrs/components/ADRWorkflowStepper'
import ADRActorTable from '@/app/adrs/components/ADRActorTable'
import ADRWorkflowActionButtons from '@/app/adrs/components/ADRWorkflowActionButtons'
import RegisterADRButton from '@/app/adrs/components/RegisterADRButton'
import ADRAuditHistory from '@/app/adrs/components/ADRAuditHistory'
import AccordianArrowIcon from '@/app/docs/components/AccordianArrowIcon'
import EditAdrForm from '@/app/adrs/components/EditAdrForm'

type ADRWorkflowProps = {
    fileId: string
    playbookId: string
    repo: string
    fileName: string
    filePlaybookTypeId?: string
}
export default function ADRWorkflow({
    fileId,
    playbookId,
    repo,
    fileName,
    filePlaybookTypeId
}: ADRWorkflowProps) {
    const { isLoading, data, isError } = useGetADR(fileId)

    if ((!isLoading && !data) || isError) {
        return (
            <RegisterADRButton
                fileId={fileId}
                playbookId={playbookId}
                repo={repo}
                fileName={fileName}
                playbookTypeId={filePlaybookTypeId}
            />
        )
    }

    if (!data || !data.wkflow_id) {
        return null
    }

    return (
        <Stack width={'full'} py={4}>
            <Accordion.Root orientation={'vertical'} collapsible>
                <Accordion.Item value={'workflow'}>
                    <Accordion.ItemTrigger
                        backgroundColor={'rgba(0, 111, 207, 0.05)'}
                        p={4}
                        borderRadius='8px'
                        minH={75}
                    >
                        <Box display='flex' alignItems='center' width='full'>
                            <Icon
                                as={IconAlert}
                                fontSize={32}
                                color='#006FCF'
                                mr={2}
                            />
                            <Text
                                color={'#006FCF'}
                                fontFamily='Helvetica'
                                fontSize='16px'
                                fontStyle='normal'
                                fontWeight={700}
                                lineHeight='normal'
                                whiteSpace='nowrap'
                            >
                                {data.wkflow_sta_nm}
                            </Text>
                            <Box ml='auto' display='flex' alignItems='center'>
                                <Flex
                                    align='center'
                                    mr={4}
                                    cursor='pointer'
                                    color='#006FCF'
                                >
                                    View Details
                                    <AccordianArrowIcon />
                                </Flex>
                                <ADRWorkflowActionButtons
                                    adr={data}
                                    fileId={fileId}
                                />
                            </Box>
                        </Box>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                        <Accordion.ItemBody>
                            <Box mt={2} minH='120px'>
                                <ADRWorkflowStepper
                                    status={data.wkflow_sta_nm}
                                />
                                <ADRActorTable adr={data} />
                                <ADRAuditHistory adrId={data.adr_mtda_id} />
                                <EditAdrForm adr={data} fileId={fileId} />
                            </Box>
                        </Accordion.ItemBody>
                    </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
        </Stack>
    )
}
