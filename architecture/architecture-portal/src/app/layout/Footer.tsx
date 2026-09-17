/* istanbul ignore file */
'use client'
import { Box, Container, Link, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { FOOTER_HEIGHT } from '@/constants'

export default function Footer() {
    return (
        <Box
            id='global-footer'
            as='footer'
            py={9}
            bg='gray.200'
            borderTop='1px solid'
            borderColor='border.emphasized'
            height={FOOTER_HEIGHT}
            _dark={{ bg: 'surface.white', borderTop: '0px' }}
        >
            <Container maxW='container.lg'>
                <Box
                    display='flex'
                    justifyContent='center'
                    flexDirection='column'
                    alignItems='center'
                >
                    <Box display='flex' alignItems='center'>
                        <Image
                            src='/ArchitecturePortalLogo.svg'
                            alt='Architecture Portal Logo'
                            width={40}
                            height={40}
                        />
                        <Text
                            ml={1}
                            fontWeight='bold'
                            color='#00175a'
                            _dark={{ color: '#1a88e9ff' }}
                        >
                            Architecture Portal
                        </Text>
                    </Box>
                    <Text
                        fontSize='sm'
                        color='gray.600'
                        mt={3}
                        _dark={{ color: 'gray.400' }}
                    >
                        Use of this system requires compliance with AXP-Internal
                        data classification{' '}
                        {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                        <Link
                            href='/faqs#data-classification'
                            target='_blank'
                            textDecoration='underline'
                        >
                            guidelines
                        </Link>
                        .
                    </Text>
                    <Text
                        fontSize='sm'
                        color='gray.600'
                        mt={1}
                        _dark={{ color: 'gray.400' }}
                    >
                        Adherance to{' '}
                        {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                        <Link
                            href='https://spaces.aexp.com/sites/global%20standards%20library/Shared%20Documents/TECH02.01%20Information%20Management%20Standard.pdf'
                            target='_blank'
                            textDecoration='underline'
                        >
                            Information Management Standard
                        </Link>{' '}
                        is required by all contributors.
                    </Text>
                    <Text
                        fontSize='sm'
                        color='gray.600'
                        mt={1}
                        _dark={{ color: 'gray.400' }}
                    >
                        © {new Date().getFullYear()}{' '}
                        {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                        <Link
                            href='https://www.americanexpress.com/'
                            target='_blank'
                            textDecoration='underline'
                        >
                            American Express
                        </Link>
                        . All rights reserved.
                    </Text>
                </Box>
            </Container>
        </Box>
    )
}
