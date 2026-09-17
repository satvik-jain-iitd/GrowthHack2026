/* istanbul ignore file */
'use client'

import { Box, Flex, Text } from '@chakra-ui/react'

export interface MetamodelTableHeaderProps {
    title: string
    subtitle: string
}

/**
 * Dark blue banner header used across all Metamodel table pages.
 * Matches the Company Domains page style.
 */
export function MetamodelTableHeader({
    title,
    subtitle
}: MetamodelTableHeaderProps) {
    return (
        <Flex
            direction={{ base: 'column', md: 'row' }}
            marginBottom='50px'
            justifyContent={{ base: 'flex-start', md: 'space-between' }}
            height='180px'
            backgroundColor={{ base: '#00175a', _dark: '#1c1c1c' }}
            backgroundImage={{
                base: 'none',
                md: "url('/company-domains/BKG.png')"
            }}
            backgroundRepeat='no-repeat'
            backgroundPosition='right'
            backgroundSize='contain'
        >
            <Box pt={{ base: '10px', md: '60px' }} px='1vw' pr='10vw'>
                <Text
                    style={{
                        whiteSpace: 'nowrap',
                        paddingTop: '10px',
                        font: 'BentonSans',
                        fontSize: '37px',
                        fontWeight: 300,
                        lineHeight: '44px',
                        textAlign: 'left',
                        color: '#ffffff'
                    }}
                >
                    {title}
                </Text>
                <Box
                    fontSize='15px'
                    fontWeight='400'
                    lineHeight='24px'
                    textAlign='left'
                    color='#ffffff'
                >
                    <Text>{subtitle}</Text>
                </Box>
            </Box>
        </Flex>
    )
}
