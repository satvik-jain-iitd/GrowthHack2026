/* istanbul ignore file */
import React from 'react'
import { Flex, Box, Heading, Card, GridItem } from '@chakra-ui/react'
import { NoPrefetchLink } from '@/components/ui'

interface Props {
    title: string
    journeyId: string
    link: string
}

export function JourneyCard({ title, journeyId, link }: Props) {
    return (
        <GridItem key={journeyId}>
            <NoPrefetchLink href={link}>
                <Card.Root
                    backgroundColor={{ base: 'white', _dark: '#27272a' }}
                    flex={{ base: '0 0 20%', md: '0 0 25%', sm: '0 0 33%' }}
                    height='auto'
                    minH='231px'
                    margin='10px'
                    borderRadius='10px'
                    boxShadow='md'
                    cursor='pointer'
                    transition='transform 0.3s, box-shadow 0.3s'
                    _hover={{
                        transform: 'translateY(-4px)',
                        boxShadow: 'xl'
                    }}
                    // id={`capability-card-${index}`}
                >
                    <Card.Body>
                        <Flex flexDirection='column' width='100%'>
                            <Box
                                // borderTop={`4px solid ${colors[capId][0] ?? '#ccc'}`}
                                mb={4}
                            />
                            <Box>
                                <Heading
                                    size='md'
                                    fontSize='20px'
                                    color='fg.info'
                                    marginTop={3}
                                    css={{
                                        display: '-webkit-box',
                                        lineClamp: 3,
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical'
                                        // overflow: 'hidden'
                                    }}
                                >
                                    {title}
                                </Heading>
                            </Box>
                        </Flex>
                    </Card.Body>
                </Card.Root>
            </NoPrefetchLink>
        </GridItem>
    )
}
