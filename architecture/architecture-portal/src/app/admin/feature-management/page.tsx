/* istanbul ignore file */
import { Metadata } from 'next'
import { AdminHeader } from '../components/AdminHeader'
import { FeatureManagementGuard } from './components/FeatureManagementGuard'
import { FeatureManagementTabs } from './components/FeatureManagementTabs'
import { Box } from '@chakra-ui/react'

export const metadata: Metadata = { title: 'Feature Management' }

export default function FeatureManagementPage() {
    return (
        <Box className='page-content'>
            <FeatureManagementGuard>
                <AdminHeader
                    title='Feature Management'
                    description='View and manage feature flags and pilot groups across the portal.'
                />
                <FeatureManagementTabs />
            </FeatureManagementGuard>
        </Box>
    )
}
