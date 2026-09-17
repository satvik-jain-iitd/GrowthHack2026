'use client'
import { Box, Text } from '@chakra-ui/react'
import { ADMIN_TEST_IDS } from '../test-ids'

type AdminHeaderProps = {
    title?: string
    description?: string
}

export const AdminHeader = ({
    title = 'Admin',
    description = 'Manage and restrict access and permissions across playbooks.'
}: AdminHeaderProps) => {
    return (
        <Box
            zIndex={0}
            w='100%'
            h='180px'
            bg={{ _dark: '#1c1c1c', base: '#00175a' }}
            backgroundImage='url(/admin/BKG.png)'
            backgroundRepeat='no-repeat'
            backgroundPosition='right'
        >
            <Box pt={20} pl='5%'>
                <Text
                    as='h1'
                    fontSize='4xl'
                    color='white'
                    data-testid={ADMIN_TEST_IDS.adminHeading}
                >
                    {title}
                </Text>
                <Text
                    fontSize='sm'
                    color='white'
                    data-testid={ADMIN_TEST_IDS.adminHeaderDescription}
                >
                    {description}
                </Text>
            </Box>
        </Box>
    )
}
