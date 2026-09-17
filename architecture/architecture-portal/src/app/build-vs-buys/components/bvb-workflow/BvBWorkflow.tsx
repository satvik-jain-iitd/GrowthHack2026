'use client'
import React from 'react'
import {
    Accordion,
    Box,
    Flex,
    Icon,
    Stack,
    useAccordionItemContext
} from '@chakra-ui/react'
import { IconAlert, IconChevronRight } from '@americanexpress/dls-icons'
import BvBWorkflowStepper from '@/app/build-vs-buys/components/bvb-workflow/stepper/BvBWorkflowStepper'
import { usePlaybook } from '@/hooks'
import StatusText from '@/app/build-vs-buys/components/bvb-workflow/StatusText'
import BvBWorkflowActorTable from '@/app/build-vs-buys/components/bvb-workflow/BvBWorkflowActorTable'
import BvBWorkflowActionButtons from '@/app/build-vs-buys/components/bvb-workflow/BvBWorkflowActionButtons'

type BvBWorkflowProps = {
    playbookId: string
}

export default function BvBWorkflow({ playbookId }: BvBWorkflowProps) {
    const { data: playbook, isLoading } = usePlaybook(playbookId)

    if (isLoading || !playbook) {
        return null
    }

    /*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
    const bvbWorkflowdata = (playbook.add_da as any).workflowData

    if (!bvbWorkflowdata) {
        return null
    }

    // Custom Arrow Icon that rotates when expanded
    function ArrowIcon() {
        const { expanded } = useAccordionItemContext()
        return (
            <Icon
                as={IconChevronRight}
                color='#006FCF'
                ml={1}
                style={{
                    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                }}
            />
        )
    }

    return (
        <Stack width='full'>
            <Accordion.Root orientation={'vertical'} collapsible>
                <Accordion.Item value='workflow'>
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
                            <StatusText data={playbook.add_da} />
                            <Box ml='auto' display='flex' alignItems='center'>
                                <Flex
                                    align='center'
                                    mr={4}
                                    cursor='pointer'
                                    color='#006FCF'
                                    data-testid='workflow-view-details'
                                >
                                    View Details
                                    <ArrowIcon />
                                </Flex>
                                <BvBWorkflowActionButtons playbook={playbook} />
                            </Box>
                        </Box>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                        <Accordion.ItemBody>
                            <Box mt={2} minH='120px'>
                                <BvBWorkflowStepper playbook={playbook} />
                                <BvBWorkflowActorTable playbook={playbook} />
                            </Box>
                        </Accordion.ItemBody>
                    </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
        </Stack>
    )
}
