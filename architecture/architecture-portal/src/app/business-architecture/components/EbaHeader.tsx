/* istanbul ignore file */
import { Box, Stack, Text, VStack } from '@chakra-ui/react'
import type { SystemStyleObject } from '@chakra-ui/react'

interface EbaHeaderProps {
    title?: string
    subtitle?: string
    subtitleLines?: string[]
    subtitleWidth?: SystemStyleObject['width']
    subtitleNoWrap?: boolean
    epicName?: string
}

export const EbaHeader = ({
    title = 'Enterprise Business Capability Model',
    subtitle = 'Explore Enterprise Business Capabilities in American Express',
    subtitleLines,
    subtitleWidth = { base: '100%', md: '80%' },
    subtitleNoWrap = false,
    epicName = ''
}: EbaHeaderProps = {}) => {
    return (
        <Box
            zIndex={0}
            w='100%'
            h={{ base: '100px', md: '151px' }}
            backgroundColor={{
                base: '#00175a',
                _dark: 'surface.foregroundSubtle'
            }}
            backgroundImage={{
                base: 'none',
                md: "url('/company-domains/BKG.png')"
            }}
            backgroundRepeat='no-repeat'
            backgroundPosition='right'
            backgroundSize='contain'
            id='eba-header'
        >
            <Stack
                direction={{ base: 'column', md: 'row' }}
                px={{ base: '10px', md: '5%', xl: '10vw' }}
                justifyContent='space-between'
                width={'100%'}
                height={'100%'}
            >
                <Box alignContent='space-evenly'>
                    <VStack alignItems='flex-start'>
                        <Text
                            fontSize={{ base: '28px', md: '48px' }}
                            style={{
                                whiteSpace: 'nowrap',
                                paddingTop: '10px',
                                width: '50%',
                                font: 'BentonSans',
                                fontWeight: 300,
                                lineHeight: '44px',
                                textAlign: 'left',
                                color: 'white'
                            }}
                        >
                            {title}
                        </Text>
                        {subtitleLines && subtitleLines.length > 0 ? (
                            <VStack
                                alignItems='flex-start'
                                gap={0.5}
                                width={subtitleWidth}
                            >
                                {subtitleLines.map((line, index) => (
                                    <Text
                                        key={`${line}-${index}`}
                                        fontSize='16px'
                                        fontWeight='400'
                                        lineHeight='24px'
                                        textAlign='left'
                                        color='white'
                                    >
                                        {line}
                                    </Text>
                                ))}
                            </VStack>
                        ) : (
                            <Text
                                fontSize='16px'
                                fontWeight='400'
                                lineHeight='24px'
                                textAlign='left'
                                color='white'
                                width={subtitleNoWrap ? 'auto' : subtitleWidth}
                                style={{
                                    whiteSpace: subtitleNoWrap
                                        ? 'nowrap'
                                        : 'normal'
                                }}
                            >
                                {subtitle}
                            </Text>
                        )}
                    </VStack>
                </Box>
                <Box alignContent={'center'}>
                    <Text color={'white'}>{epicName}</Text>
                </Box>
            </Stack>
        </Box>
    )
}
