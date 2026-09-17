import { Stack, Steps } from '@chakra-ui/react'
import * as React from 'react'
import {
    ActiveIcon,
    CompleteIcon,
    IncompleteIcon
} from '@/app/build-vs-buys/components/bvb-workflow/stepper/BvBWorkflowStepper'

// Define all possible steps, including NOT APPROVED
const allSteps = [
    'IN PROGRESS',
    'UNDER REVIEW',
    'AWAITING APPROVAL',
    'APPROVED',
    'NOT APPROVED'
]

export default function ADRWorkflowStepper({ status }: { status: string }) {
    // Determine which steps to show and the current step index
    let steps = allSteps.slice(0, 4) // Always show up to APPROVED
    let currentStep = steps.indexOf(status)

    // If NOT APPROVED, replace APPROVED with NOT APPROVED as the last step
    if (status === 'NOT APPROVED') {
        steps = allSteps.slice(0, 3).concat('APPROVED')
        currentStep = 3 // Mark as stopped at AWAITING APPROVAL
    } else if (status === 'APPROVED') {
        steps = allSteps.slice(0, 4)
        currentStep = 4
    } else if (steps.includes(status)) {
        currentStep = steps.indexOf(status)
    } else {
        currentStep = 0 // fallback
    }

    return (
        <Steps.Root
            px={20}
            mb={10}
            colorPalette={'green'}
            step={currentStep}
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
                                    complete={
                                        // Only show APPROVED as complete if status is APPROVED
                                        step === 'APPROVED' &&
                                        status === 'APPROVED' ? (
                                            <CompleteIcon />
                                        ) : step !== 'APPROVED' &&
                                          index < currentStep ? (
                                            <CompleteIcon />
                                        ) : (
                                            <IncompleteIcon />
                                        )
                                    }
                                    incomplete={<IncompleteIcon />}
                                />
                            </Steps.Indicator>
                            <Steps.Title
                                whiteSpace={'nowrap'}
                                top={12}
                                position={'absolute'}
                                textAlign={'center'}
                            >
                                {step}
                            </Steps.Title>
                        </Stack>
                        <Steps.Separator flex={1} alignSelf='center' mx={2} />
                    </Steps.Item>
                ))}
            </Steps.List>
        </Steps.Root>
    )
}
