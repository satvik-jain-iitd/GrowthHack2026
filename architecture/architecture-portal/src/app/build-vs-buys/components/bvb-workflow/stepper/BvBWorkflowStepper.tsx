import { Box, Flex, Stack, Steps } from '@chakra-ui/react'
import { IconCheck } from '@americanexpress/dls-icons'

import * as React from 'react'
import {
    getStatusByTask,
    getStatusLabel
} from '@/app/build-vs-buys/components/StatusBadge'
import { Playbook } from '@/types/Playbook'

const steps = [
    'Awaiting Acceptance',
    'In Progress',
    'In Review',
    'Awaiting Approval',
    'Complete'
]

export const CompleteIcon = () => {
    return (
        <Flex
            alignItems={'center'}
            justifyContent={'center'}
            backgroundColor={'green'}
            w={8}
            h={8}
            borderRadius={50}
        >
            <IconCheck color={'white'} />
        </Flex>
    )
}

export const ActiveIcon = () => {
    return (
        <Box
            position={'relative'}
            width={8}
            height={8}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Box
                position={'absolute'}
                top={'50%'}
                left={'50%'}
                width={8}
                height={8}
                borderRadius={'50%'}
                border={'2.5px solid #006FCF'}
                boxSizing={'border-box'}
                backgroundColor={'bg'}
                style={{ transform: 'translate(-50%, -50%)' }}
            />
            <Box
                position={'absolute'}
                top={'50%'}
                left={'50%'}
                width={'22px'}
                height={'22px'}
                borderRadius={'50%'}
                border={'2.5px solid #006FCF'}
                boxSizing={'border-box'}
                backgroundColor={'bg'}
                style={{ transform: 'translate(-50%, -50%)' }}
            />
        </Box>
    )
}

export const IncompleteIcon = () => {
    return (
        <Box
            position={'relative'}
            width={8}
            height={8}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Box
                position={'absolute'}
                top={'50%'}
                left={'50%'}
                width={8}
                height={8}
                borderRadius={'50%'}
                border={'2px solid #bdbdbd'}
                boxSizing={'border-box'}
                backgroundColor={'bg'}
                style={{ transform: 'translate(-50%, -50%)' }}
            />
        </Box>
    )
}
export default function BvBWorkflowStepper({
    playbook
}: {
    playbook: Playbook
}) {
    const getActiveStep = () => {
        /*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
        const bvbWorkflowdata = (playbook.add_da as any).workflowData
        const workflowStep = getStatusByTask(
            bvbWorkflowdata.currentTask.step,
            bvbWorkflowdata
        )

        if (!workflowStep) {
            return null
        }
        const stepLabel = getStatusLabel(workflowStep)

        if (stepLabel === 'Approved' || stepLabel === 'Rejected') {
            return steps.length
        }
        return steps.indexOf(stepLabel)
    }

    return (
        <>
            <Steps.Root
                px={20}
                mb={10}
                colorPalette={'green'}
                step={getActiveStep() || 0}
                count={steps.length}
                size={'sm'}
                backgroundColor={'transparent'}
                w='100%'
            >
                <Steps.List display='flex' w='100%'>
                    {steps.map((step, index) => (
                        <Steps.Item index={index} key={index} py={2}>
                            <Stack align='center' gap={2}>
                                <Steps.Indicator>
                                    <Steps.Status
                                        current={<ActiveIcon />}
                                        complete={<CompleteIcon />}
                                        incomplete={<IncompleteIcon />}
                                    />
                                </Steps.Indicator>
                                <Steps.Title
                                    data-testid={`stepper-step-title-${index}`}
                                    whiteSpace={'nowrap'}
                                    top={12}
                                    position={'absolute'}
                                    textAlign={'center'}
                                >
                                    {steps[index]}
                                </Steps.Title>
                            </Stack>
                            <Steps.Separator
                                flex={1}
                                alignSelf='center'
                                mx={2}
                            />
                        </Steps.Item>
                    ))}
                </Steps.List>
            </Steps.Root>
        </>
    )
}
