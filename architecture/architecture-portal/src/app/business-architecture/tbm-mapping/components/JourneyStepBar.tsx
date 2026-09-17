'use client'
import React from 'react'
import { Box, HStack, Text } from '@chakra-ui/react'
import { IconCheck } from '@americanexpress/dls-icons'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'

type Props = {
    journeys: CustomerJourney[]
    currentIndex: number
}

export function JourneyStepBar({ journeys, currentIndex }: Props) {
    return (
        <Box
            width='100%'
            overflowX='auto'
            py={4}
            px={6}
            borderBottom='1px solid'
            borderColor='gray.200'
        >
            <HStack gap={3} flexWrap='wrap'>
                {journeys.map((journey, idx) => {
                    const isActive = idx === currentIndex
                    const isCompleted = idx < currentIndex

                    return (
                        <HStack
                            key={journey.journey_id}
                            gap={2}
                            px={4}
                            py={2}
                            borderRadius='full'
                            border='2px solid'
                            borderColor={
                                isActive
                                    ? '#006FCF'
                                    : isCompleted
                                      ? '#006FCF'
                                      : 'gray.300'
                            }
                            backgroundColor={
                                isActive
                                    ? '#EAF3FF'
                                    : isCompleted
                                      ? 'white'
                                      : 'white'
                            }
                            flexShrink={0}
                            maxWidth='280px'
                        >
                            {/* Step circle indicator */}
                            <Box
                                width='20px'
                                height='20px'
                                borderRadius='full'
                                border={isCompleted ? 'none' : '2px solid'}
                                borderColor={isActive ? '#006FCF' : 'gray.400'}
                                backgroundColor={
                                    isCompleted
                                        ? '#2E7D32'
                                        : isActive
                                          ? '#006FCF'
                                          : 'transparent'
                                }
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                                flexShrink={0}
                            >
                                {isCompleted ? (
                                    <IconCheck
                                        color='white'
                                        style={{
                                            width: '12px',
                                            height: '12px',
                                            display: 'block',
                                            flexShrink: 0,
                                            transform:
                                                'translateY(-1px) translateX(-1.5px)'
                                        }}
                                    />
                                ) : (
                                    <Text
                                        data-testid={`step-number-${idx}`}
                                        fontSize='11px'
                                        fontWeight='700'
                                        color={isActive ? 'white' : 'gray.500'}
                                        lineHeight='1'
                                    >
                                        {idx + 1}
                                    </Text>
                                )}
                            </Box>

                            {/* Journey statement — truncated */}
                            <Text
                                data-testid={`step-label-${journey.journey_id}`}
                                fontSize='13px'
                                fontWeight={isActive ? '600' : '400'}
                                color={
                                    isActive
                                        ? '#006FCF'
                                        : isCompleted
                                          ? '#006FCF'
                                          : 'gray.500'
                                }
                                lineHeight='1.3'
                                overflow='hidden'
                                textOverflow='ellipsis'
                                whiteSpace='nowrap'
                                maxWidth='200px'
                            >
                                {journey.journey_statement}
                            </Text>
                        </HStack>
                    )
                })}
            </HStack>
        </Box>
    )
}
