/* istanbul ignore file */
'use client'
import { use } from 'react'
import { notFound } from 'next/navigation'
import { Box } from '@chakra-ui/react'
import { CapabilityMap } from '@/app/business-architecture/components/CapabilityMap'
import { EbaHeader } from '../../components/EbaHeader'

export default function CapabilityModelPage({
    params
}: {
    params: Promise<{ uuid?: string[] }>
}) {
    const { uuid } = use(params)
    const selectedL1 = uuid?.[0] ?? null

    if (uuid && uuid.length > 1) {
        notFound()
    }

    return (
        <Box className='page-content' background='surface.default.offwhite'>
            <EbaHeader />
            <CapabilityMap selectedL1={selectedL1} />
        </Box>
    )
}
