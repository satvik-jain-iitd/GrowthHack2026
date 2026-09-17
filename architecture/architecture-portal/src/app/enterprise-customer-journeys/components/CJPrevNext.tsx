import React from 'react'
import { PrevNext as Props } from '@/types/PrevNext'
import { Box, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import { IconChevronLeft, IconChevronRight } from '@americanexpress/dls-icons'
import { NoPrefetchLink as Link } from '@/components/ui'
import { useCustomerJourneys } from '@/app/business-architecture/hooks'
import { CJ_PREV_NEXT_TEST_IDS } from '../test-ids'

export default function CJPrevNext({ prevNext }: { prevNext: Props }) {
    const { previous, next } = prevNext
    const { customer_journey } = useCustomerJourneys()
    return (
        <Box display='flex' justifyContent='space-between' mt={2}>
            {previous ? (
                <LinkBox
                    as='article'
                    width='50%'
                    m={1.5}
                    borderWidth='1px'
                    borderRadius='md'
                    _dark={{ bg: 'bg.muted' }}
                    _hover={{ borderColor: 'fg.info' }}
                    transition='border-color 0.2s'
                >
                    <LinkOverlay
                        as={Link}
                        href={previous.href!}
                        p={3}
                        display='block'
                        data-testid={CJ_PREV_NEXT_TEST_IDS.previousLink}
                    >
                        <Text
                            data-testid={CJ_PREV_NEXT_TEST_IDS.previousLabel}
                            color='fg'
                            textAlign='left'
                            ml={1}
                            fontSize={14}
                        >
                            Previous
                        </Text>
                        <Box
                            display='flex'
                            alignItems='center'
                            color='fg.info'
                            fontSize={14}
                            mt={1}
                        >
                            <IconChevronLeft />
                            <Box
                                as='span'
                                ml={2}
                                data-testid={
                                    CJ_PREV_NEXT_TEST_IDS.previousJourney
                                }
                            >
                                {customer_journey?.find(
                                    journey =>
                                        journey.journey_id ==
                                        previous.label
                                            .toLowerCase()
                                            .replace(/\s+/g, '-')
                                )?.journey_statement || previous.label}
                            </Box>
                        </Box>
                    </LinkOverlay>
                </LinkBox>
            ) : (
                <span
                    data-testid={CJ_PREV_NEXT_TEST_IDS.previousPlaceholder}
                    style={{ width: '50%', margin: '6px' }}
                />
            )}
            {next ? (
                <LinkBox
                    as='article'
                    width='50%'
                    m={1.5}
                    borderWidth='1px'
                    borderRadius='md'
                    _dark={{ bg: 'bg.muted' }}
                    _hover={{ borderColor: 'fg.info' }}
                    transition='border-color 0.2s'
                >
                    <LinkOverlay
                        as={Link}
                        href={next.href!}
                        p={3}
                        display='block'
                        data-testid={CJ_PREV_NEXT_TEST_IDS.nextLink}
                    >
                        <Text
                            data-testid={CJ_PREV_NEXT_TEST_IDS.nextLabel}
                            color='fg'
                            textAlign='right'
                            mr={1}
                            fontSize={14}
                        >
                            Next
                        </Text>
                        <Box
                            display='flex'
                            alignItems='center'
                            color='fg.info'
                            fontSize={14}
                            mt={1}
                            justifyContent='flex-end'
                        >
                            <Box
                                as='span'
                                mr={2}
                                data-testid={CJ_PREV_NEXT_TEST_IDS.nextJourney}
                            >
                                {customer_journey?.find(
                                    journey =>
                                        journey.journey_id ==
                                        next.label
                                            .toLowerCase()
                                            .replace(/\s+/g, '-')
                                )?.journey_statement || next.label}
                            </Box>
                            <IconChevronRight />
                        </Box>
                    </LinkOverlay>
                </LinkBox>
            ) : (
                <span
                    data-testid={CJ_PREV_NEXT_TEST_IDS.nextPlaceholder}
                    style={{ width: '50%', margin: '6px' }}
                />
            )}
        </Box>
    )
}
