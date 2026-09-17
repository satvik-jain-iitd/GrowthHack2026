/* istanbul ignore file */
import { Box, Flex, Stack, Steps } from '@chakra-ui/react'
import { IconCheck } from '@americanexpress/dls-icons'
import * as React from 'react'
import Image from 'next/image'
import { StatusBadge } from './Status'
import { statusMap } from '@/app/company-domains/constants'

const steps = [
    { key: 'deleted', label: 'Deleted', system: 'portal' },
    { key: 'draft', label: 'Draft', system: 'portal' },
    { key: 'proposed', label: 'Proposed', system: 'portal' },
    { key: 'darbAppr', label: 'ARB Approved', system: 'portal' },
    { key: 'earbAppr', label: 'EARB Approved', system: 'portal' },
    { key: 'catalog', label: 'Onboarded to Catalog', system: 'explorer' },
    { key: 'preCert', label: 'Design Certified', system: 'explorer' },
    { key: 'prodCert', label: 'Production Certified', system: 'explorer' }
]

const CompleteIcon = ({ status }: { status: string }) => {
    return (
        <Flex
            alignItems={'center'}
            justifyContent={'center'}
            backgroundColor={status === 'deleted' ? '#c60707' : 'green'}
            w={8}
            h={8}
            borderRadius={50}
        >
            <IconCheck color={'white'} />
        </Flex>
    )
}

const ActiveIcon = () => {
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

const IncompleteIcon = () => {
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

export default function OperationStepper({
    currentStep,
    status
}: {
    currentStep: number
    status: string
}) {
    const isDeleted = status?.toLowerCase() === 'deleted'
    return (
        <>
            <Steps.Root
                px={20}
                mb={10}
                colorPalette={isDeleted ? 'gray' : 'green'}
                step={currentStep}
                count={steps.length}
                size={'sm'}
                backgroundColor={'transparent'}
                width={{ base: '90%', mdDown: '980px' }}
            >
                <Steps.List display='flex' w='100%'>
                    {steps
                        .filter(item =>
                            isDeleted ? item : item?.key != 'deleted'
                        )
                        .map((step, index) => (
                            <Steps.Item index={index} key={index} py={2}>
                                <Stack align='center' gap={2}>
                                    {step.system === 'portal' ? (
                                        <Image
                                            src='/company-domains/aplogo.svg'
                                            alt='Architecture Portal Icon'
                                            width={30}
                                            height={30}
                                            style={{ marginTop: '-40px' }}
                                        />
                                    ) : (
                                        <Image
                                            src='/company-domains/Explorer_logo_icon.svg'
                                            alt='Explorer Icon'
                                            width={30}
                                            height={30}
                                            style={{ marginTop: '-40px' }}
                                        />
                                    )}
                                    <Steps.Indicator>
                                        <Steps.Status
                                            current={
                                                isDeleted ? (
                                                    <IncompleteIcon />
                                                ) : (
                                                    <ActiveIcon />
                                                )
                                            }
                                            complete={
                                                <CompleteIcon
                                                    status={step?.key}
                                                />
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
                                        {/* {step.label} */}
                                        <StatusBadge
                                            status={
                                                step.key as keyof typeof statusMap
                                            }
                                            rowExpanded={false}
                                        />
                                    </Steps.Title>
                                </Stack>
                                <Steps.Separator
                                    flex={1}
                                    alignSelf='center'
                                    mx={2}
                                    background={isDeleted ? '#f4f4f4' : ''}
                                />
                            </Steps.Item>
                        ))}
                </Steps.List>
            </Steps.Root>
        </>
    )
}
