/* istanbul ignore file */
import React from 'react'
import { Box } from '@chakra-ui/react'
import ApplicationLanding from '../components/ApplicationLanding'
import { DomainProvider } from '@/context'

export default async function page({
    params
}: {
    params: Promise<{ centralId: string }>
}) {
    const { centralId } = await params
    return (
        <Box p={8} pl={16} pr={16}>
            <DomainProvider>
                <ApplicationLanding centralId={centralId} />
            </DomainProvider>
        </Box>
    )
}
