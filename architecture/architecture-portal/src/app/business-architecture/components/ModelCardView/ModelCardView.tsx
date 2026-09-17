/* istanbul ignore file */
import React from 'react'
import { ModelCard } from './ModelCard'
import { Box, Grid } from '@chakra-ui/react'
import { useCapabilities } from '@/app/business-architecture/hooks'
import { l1Order } from '@/app/business-architecture/constants'
import { Capability } from '@/app/business-architecture/types'

export const ModelCardView = () => {
    const { capability = [] } = useCapabilities()
    const l1Capabilities = capability.filter(
        cap => Number(cap.capability_level) === 1
    )

    const sorted = l1Order
        .map(id => l1Capabilities.find(o => o.capability_id === id))
        .filter(Boolean) as Capability[]

    return (
        <Box
            width='100%'
            marginTop={{ base: '10px', sm: '10px' }}
            // maxWidth='1520px'
        >
            <Box marginBottom='10px'>
                <Grid
                    templateColumns={{
                        lg: 'repeat(4, 1fr)',
                        md: 'repeat(3, 1fr)',
                        sm: 'repeat(1, 1fr)'
                    }}
                    gap='3'
                >
                    {sorted.map((cap, index) => (
                        <ModelCard
                            key={cap.capability_nm}
                            title={cap.capability_nm}
                            capId={cap.capability_id}
                            index={index}
                            description={cap.capability_desc_tx || ''}
                        />
                    ))}
                </Grid>
            </Box>
        </Box>
    )
}
