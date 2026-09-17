'use client'
import { useAdminContext } from '@/context'
import { Box } from '@chakra-ui/react'
import { AdminUsers } from './AdminUsers'
import { ADMIN_TEST_IDS } from '../test-ids'

export function AdminContent() {
    const adminContext = useAdminContext()
    const { selectedPlaybook, selectedType } = adminContext || {}

    return (
        <Box px={3}>
            <Box
                data-testid={ADMIN_TEST_IDS.playbookName}
                color={{ base: '#006fcf', _dark: 'white' }}
                fontSize='1.5rem'
                fontWeight={500}
            >
                {selectedPlaybook?.playbook_nm}
            </Box>
            <Box data-testid={ADMIN_TEST_IDS.contentDescription}>
                Use the table below to add and remove Owners/SMEs for the above{' '}
                {selectedType}
            </Box>
            <Box mt={4}>
                <AdminUsers />
            </Box>
        </Box>
    )
}
