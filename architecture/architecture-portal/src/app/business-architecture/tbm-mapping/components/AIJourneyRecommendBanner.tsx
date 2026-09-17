import React from 'react'
import { Box, HStack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { IconInfo } from '@americanexpress/dls-icons'
import { Tooltip } from '@/components/ui'
import { AIIcon } from '@/components/icons/AIIcon'
import { AICheckBoxIcon } from '@/components/icons/AICheckBoxIcon'

export function AIJourneyRecommendBanner() {
    return (
        <Box
            mx={8}
            my={5}
            borderRadius='xl'
            border='1px solid'
            borderColor='border.subtle'
            backgroundColor={'bg.muted'}
            boxShadow='sm'
            overflow='hidden'
        >
            <HStack gap={0} alignItems='stretch'>
                {/* Left content */}
                <Box flex='1' p={6}>
                    <HStack mb={3} gap={2}>
                        <AIIcon width={28} height={28} />
                        <Text
                            data-testid='ai-banner-heading'
                            fontWeight='700'
                            fontSize='24px'
                            color={{ base: '#00175a', _dark: 'blue.300' }}
                        >
                            AI Recommended Enterprise Customer Journeys
                        </Text>
                        <Tooltip
                            showArrow
                            content='Journeys are recommended based on your application context.'
                        >
                            <IconInfo
                                style={{
                                    color: 'var(--chakra-colors-text-subtle)',
                                    cursor: 'pointer',
                                    width: '16px',
                                    height: '16px'
                                }}
                            />
                        </Tooltip>
                    </HStack>
                    <Text
                        data-testid='ai-banner-body'
                        fontSize='18px'
                        color='text.regular'
                        mb={5}
                        maxWidth='888px'
                        lineHeight='1.6'
                    >
                        Below are AI recommended Enterprise Customer Journeys.
                        If you would like to add additional journeys please use
                        the typeahead search or scroll the list of enterprise
                        customer journeys. You may choose multiple journeys.
                        Click &ldquo;Review Impacted Enterprise Business
                        Capabilities&rdquo; to view recommended Enterprise
                        Business Capabilities for each Enterprise Customer
                        Journey.
                    </Text>
                    <Box display={'flex'} alignItems={'center'}>
                        <AICheckBoxIcon />
                        <Text pl={1}>= AI Selected</Text>
                    </Box>
                </Box>

                {/* Right hero image */}
                <Box
                    flexShrink={0}
                    mr={200}
                    width={{ base: '0', md: '310px' }}
                    display={{ base: 'none', md: 'block' }}
                    position='relative'
                >
                    <Image
                        src='/business-architecture/customerJourneysHero.png'
                        alt='Enterprise Customer Journeys'
                        fill
                        style={{
                            objectFit: 'contain',
                            objectPosition: 'right center'
                        }}
                    />
                </Box>
            </HStack>
        </Box>
    )
}
