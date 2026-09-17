/* istanbul ignore file */
import { featureFlags } from '@/constants'
import {
    AbsoluteCenter,
    Box,
    HStack,
    ProgressCircle,
    Text,
    VStack,
    Stack
} from '@chakra-ui/react'
import { useGetAppCounts } from '../hooks'
import { DIRECTORY_TEST_IDS } from '../test-ids'
import React from 'react'

export const DirectoryHeader = () => {
    const { appCounts } = useGetAppCounts()
    const mapped = Number(appCounts?.mapped) || 0
    const domainMapped = Number(appCounts?.com_dom_mapped) || 0
    const progress = mapped > 0 ? (domainMapped / mapped) * 100 : 0

    return (
        <Box
            zIndex={0}
            w='100%'
            h={{ base: '480px', md: '250px' }}
            bg={{ _dark: '#27272a', base: '#00175a' }}
            backgroundRepeat='no-repeat'
            backgroundPosition='right'
            data-testid={DIRECTORY_TEST_IDS.header}
        >
            <Stack
                direction={{ base: 'column', md: 'row' }}
                px={{ base: '10px', md: '15%' }}
                justifyContent='space-between'
            >
                <Box alignContent='space-evenly'>
                    <VStack alignItems='flex-start'>
                        <Text
                            style={{
                                whiteSpace: 'nowrap',
                                paddingTop: '10px',
                                width: '50%',
                                font: 'BentonSans',
                                fontSize: '48px',
                                fontWeight: 300,
                                lineHeight: '44px',
                                textAlign: 'left',
                                color: '#ffffff'
                            }}
                        >
                            Architecture Directory
                        </Text>
                        <Text
                            fontSize='16px'
                            fontWeight='400'
                            lineHeight='24px'
                            textAlign='left'
                            color='#ffffff'
                            width={{ base: '100%', md: '80%' }}
                        >
                            A centralized directory for Company Domain and
                            application mapping that enables Domain Owners to
                            review/update mappings, enhancing visibility,
                            governance, and stakeholder understanding of the
                            technology ecosystem.
                        </Text>
                    </VStack>
                </Box>
                <HStack marginRight='-55px' marginTop='25px' gap={5}>
                    <Box>
                        <ProgressCircle.Root
                            value={progress}
                            title='Application to Company Domain mapping completion chart'
                            colorPalette='blue'
                            // data-testid={DIRECTORY.app_pie_chart}
                        >
                            <ProgressCircle.Circle
                                css={{
                                    '--thickness': '20px',
                                    '--size': '180px'
                                }}
                            >
                                <ProgressCircle.Track />
                                <ProgressCircle.Range />
                            </ProgressCircle.Circle>
                            <AbsoluteCenter>
                                <Text
                                    fontSize='48px'
                                    color='white'
                                    paddingBottom='45px'
                                    fontWeight='400'
                                >
                                    {mapped}
                                </Text>
                            </AbsoluteCenter>

                            <AbsoluteCenter>
                                <Text
                                    paddingTop='44px'
                                    fontSize='14px'
                                    color='white'
                                    fontWeight='400'
                                    width='100%'
                                    lineHeight='19px'
                                    textAlign='center'
                                >
                                    PROD APPLICATIONS
                                </Text>
                            </AbsoluteCenter>
                        </ProgressCircle.Root>
                    </Box>

                    <VStack>
                        <Box>
                            <Text
                                as='h2'
                                fontSize='48px'
                                fontWeight='700'
                                color='#4299e1'
                            >
                                {domainMapped}
                            </Text>
                            <Text
                                as='h5'
                                fontSize='16px'
                                fontWeight='700'
                                color='white'
                                whiteSpace='nowrap'
                            >
                                MAPPED TO DOMAIN
                            </Text>
                        </Box>

                        {featureFlags?.enableEBCM ? (
                            <Box>
                                <Text
                                    as='h2'
                                    fontSize='48px'
                                    fontWeight='700'
                                    color='#0167c0'
                                >
                                    {appCounts?.ebcm_mapped || 0}
                                </Text>
                                <Text
                                    as='h5'
                                    fontSize='16px'
                                    fontWeight='700'
                                    color='white'
                                >
                                    MAPPED TO EBCM
                                </Text>
                            </Box>
                        ) : (
                            <Box paddingRight={'40px'}>
                                <Text
                                    as='h2'
                                    fontSize='48px'
                                    fontWeight='700'
                                    color='rgba(178, 212, 239, 0.92)'
                                >
                                    {mapped - domainMapped}
                                </Text>
                                <Text
                                    as='h5'
                                    fontSize='16px'
                                    fontWeight='700'
                                    color='white'
                                >
                                    UNMAPPED
                                </Text>
                            </Box>
                        )}
                    </VStack>
                </HStack>
            </Stack>
        </Box>
    )
}
