/* istanbul ignore file */
import { Box, Stack, Text, VStack } from '@chakra-ui/react'

export const DetailsHeader = () => {
    return (
        <Box
            zIndex={0}
            w='100%'
            h={{ base: '460px', md: '180px' }}
            bg={{ _dark: '#27272a', base: '#00175a' }}
            backgroundRepeat='no-repeat'
            backgroundPosition='right'
            backgroundImage={{
                base: 'none',
                md: "url('/company-domains/BKG.png')"
            }}
            backgroundSize='contain'
        >
            <Stack
                direction={{ base: 'column', md: 'row' }}
                px={{ base: '10px', md: '5%' }}
                justifyContent='space-between'
                width={'100%'}
                height={'100%'}
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
                            Enterprise Business Capability Details
                        </Text>
                    </VStack>
                </Box>
            </Stack>
        </Box>
    )
}
