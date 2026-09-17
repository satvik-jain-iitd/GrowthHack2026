'use client'
import { Box, Text } from '@chakra-ui/react'
import { IconWarning } from '@americanexpress/dls-icons'
import { useMaintenanceModeVisible } from '@/hooks'
import { NAVBAR_HEIGHT, MAINTENANCE_BANNER_HEIGHT } from '@/constants/layout'

export default function MaintenanceBanner() {
    const visible = useMaintenanceModeVisible()

    if (!visible) return null

    return (
        <Box
            as='aside'
            position='fixed'
            top={NAVBAR_HEIGHT}
            width='100%'
            height={MAINTENANCE_BANNER_HEIGHT}
            zIndex={1200}
            display='flex'
            alignItems='center'
            justifyContent='center'
            px={4}
            bg={{ base: 'orange.50', _dark: 'orange.900' }}
            borderBottom='1px solid'
            borderColor='border.subtle'
        >
            <IconWarning
                color='caution'
                size='xl'
                isFilled={false}
                title='Scheduled maintenance warning'
                titleId='maintenance-warning-icon'
            />
            <Text pl={2} fontSize='sm' fontWeight='medium' textAlign='center'>
                Scheduled maintenance is in progress — some features may be
                temporarily unavailable.
            </Text>
        </Box>
    )
}
