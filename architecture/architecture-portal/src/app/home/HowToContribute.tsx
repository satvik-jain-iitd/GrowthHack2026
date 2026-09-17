/* istanbul ignore file */
import React from 'react'
import { Box, Button, Grid, GridItem, Stack, Text } from '@chakra-ui/react'
import styles from '@/app/home/HowToContribute.module.css'
import Image from 'next/image'
import { NoPrefetchLink as Link } from '@/components/ui'

export default function HowToContribute() {
    return (
        <Box my={10} display='flex' justifyContent='center' width='100%'>
            <Box
                className={styles['how-to-contribute']}
                w={{ xl: '50%', base: '100%' }}
            >
                <Grid
                    templateColumns='repeat(12, 1fr)'
                    gap='6'
                    w={{ xl: '100%', base: '80%' }}
                >
                    <GridItem colSpan={{ lg: 8, base: 12 }}>
                        <Stack pl={12} pt={7} pb={{ xl: 0, base: 5 }}>
                            <Text fontSize='4xl' color='white'>
                                How can you contribute?
                            </Text>
                            <Text fontSize='md' mt={2} mb={2} color='white'>
                                Want to contribute to the Architecture Portal?
                                Here is the Step by Step guide to get started.
                            </Text>
                            <Button
                                variant='solid'
                                alignSelf='flex-start'
                                colorPalette='blue'
                                css={{
                                    color: {
                                        base: 'white',
                                        _dark: 'gray.800'
                                    },
                                    bgColor: {
                                        base: 'colorPalette.600',
                                        _hover: 'colorPalette.500',
                                        _dark: {
                                            base: 'colorPalette.300',
                                            _hover: 'colorPalette.400'
                                        }
                                    }
                                }}
                            >
                                <Link href='/contribute/getting-started'>
                                    GET STARTED
                                </Link>
                            </Button>
                        </Stack>
                    </GridItem>
                    <GridItem
                        colSpan={{ lg: 4, base: 0 }}
                        display={{ lg: 'block', base: 'none' }}
                    >
                        <Image
                            src='/contributeDark.png'
                            alt='How to Contribute'
                            width={406}
                            height={230}
                            className='image-dark'
                        />
                        <Image
                            src='/HowToContribute.png'
                            alt='How to Contribute'
                            width={406}
                            height={230}
                            className='image-light'
                        />
                    </GridItem>
                </Grid>
            </Box>
        </Box>
    )
}
