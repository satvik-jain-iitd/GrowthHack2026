/* istanbul ignore file */
'use client'
import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import styles from '@/app/home/HeroSection.module.css'
import AutocompleteSearch from '@/app/layout/AutocompleteSearch'
import Image from 'next/image'

export default function HeroSection() {
    return (
        <Box
            className={styles['hero-section']}
            display='flex'
            justifyContent='center'
            width='100%'
        >
            <Grid
                templateColumns='repeat(12, 1fr)'
                gap='6'
                w={{ xl: '50%', base: '80%' }}
            >
                <GridItem colSpan={{ lg: 6, base: 12 }}>
                    <Text
                        fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                        color='white'
                        mt={4}
                    >
                        Architecture Portal
                    </Text>
                    <Text fontSize='md' color='white' mt={1}>
                        Centralized repository providing visibility and detailed
                        insight into all Technical Architecture related
                        information including standards and best practices for
                        various{' '}
                        <Text
                            as='span'
                            color={{ base: 'blue.200', _dark: 'fg.info' }}
                        >
                            Enterprise Initiatives
                        </Text>
                        ,{' '}
                        <Text
                            as='span'
                            color={{ base: 'blue.200', _dark: 'fg.info' }}
                        >
                            Foundational Technologies
                        </Text>
                        ,{' '}
                        <Text
                            as='span'
                            color={{ base: 'blue.200', _dark: 'fg.info' }}
                        >
                            Company Domains
                        </Text>
                        ,{' '}
                        <Text
                            as='span'
                            color={{ base: 'blue.200', _dark: 'fg.info' }}
                        >
                            Enterprise Customer Journeys
                        </Text>{' '}
                        and{' '}
                        <Text
                            as='span'
                            color={{ base: 'blue.200', _dark: 'fg.info' }}
                        >
                            Applications
                        </Text>
                        .
                    </Text>
                    <AutocompleteSearch
                        css={{
                            width: '100%',
                            mx: 0,
                            mt: 4
                        }}
                    />
                </GridItem>
                <GridItem colSpan={{ lg: 6, base: 12 }}>
                    <Box
                        display={{ base: 'none', lg: 'flex' }}
                        justifyContent='center'
                        alignItems='center'
                    >
                        <Image
                            width={680}
                            height={405}
                            alt='Hero Section'
                            className='image-light'
                            src='/heroLaptop.png'
                        />
                        <Image
                            width={680}
                            height={405}
                            alt='Hero Section'
                            className='image-dark'
                            src='/herolaptopDark.png'
                        />
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    )
}
