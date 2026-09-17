'use client'
import { Box, Text, Progress, Flex } from '@chakra-ui/react'
import type { ProcessingPhase } from '@/app/resources/tech-investment-planning-dashboard/hooks/useCsvProcessor'

const phaseLabels: Record<string, string> = {
    mapping: 'Loading epic submissions and user selections…',
    journeyRec: 'Loading AI journey recommendations…',
    capRec: 'Loading AI capability recommendations…',
    history: 'Replaying activity history…',
    deriving: 'Crunching the numbers and building your dashboard…'
}

interface Props {
    phase: ProcessingPhase
    pct: number
    error: string | null
}

export function LoadingScreen({ phase, pct, error }: Props) {
    if (error) {
        return (
            <Flex align='center' justify='center' minH='60vh'>
                <Box
                    bg={{ base: 'red.50', _dark: 'red.950' }}
                    border='1px solid'
                    borderColor={{ base: 'red.300', _dark: 'red.500' }}
                    borderRadius='xl'
                    p={8}
                    maxW='lg'
                    textAlign='center'
                >
                    <Text
                        fontWeight='semibold'
                        color={{ base: 'red.600', _dark: 'red.400' }}
                        fontSize='xl'
                        mb={2}
                    >
                        Error loading data
                    </Text>
                    <Text
                        color={{ base: 'gray.700', _dark: 'gray.300' }}
                        fontSize='sm'
                    >
                        {error}
                    </Text>
                </Box>
            </Flex>
        )
    }

    const label = phaseLabels[phase] ?? 'Initializing...'

    return (
        <Flex
            direction='column'
            align='center'
            justify='center'
            minH='60vh'
            gap={6}
        >
            <Box textAlign='center'>
                <Text
                    fontSize='3xl'
                    fontWeight='bold'
                    color={{ base: 'blue.600', _dark: 'blue.400' }}
                    mb={1}
                >
                    Tech Investment Planning Dashboard
                </Text>
                <Text color='text.subtle' fontSize='sm'>
                    Journey &amp; Capability Analytics
                </Text>
            </Box>
            <Box w='96' maxW='full'>
                <Progress.Root
                    value={pct}
                    size='sm'
                    colorPalette='blue'
                    borderRadius='full'
                >
                    <Progress.Track borderRadius='full'>
                        <Progress.Range />
                    </Progress.Track>
                </Progress.Root>
            </Box>
            <Text
                color={{ base: 'gray.700', _dark: 'gray.300' }}
                fontSize='sm'
                maxW='md'
                textAlign='center'
            >
                {label}
            </Text>
            <Text color='text.subtle' fontSize='xs'>
                {pct}% complete
            </Text>
        </Flex>
    )
}
