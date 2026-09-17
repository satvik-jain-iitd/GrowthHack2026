/* istanbul ignore file */
import { Metadata } from 'next'
import { Box } from '@chakra-ui/react'
import { ApptioDashboard } from '@/app/resources/tech-investment-planning-dashboard/components/Dashboard'

export const metadata: Metadata = {
    title: 'Tech Investment Planning Dashboard'
}

export default async function PlanningProcessDashboard() {
    return (
        <Box className='page-content' mb={12}>
            <ApptioDashboard />
        </Box>
    )
}
