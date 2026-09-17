/* istanbul ignore file */
import { Metadata } from 'next'
import { FOUNDATIONAL_ASSETS_IFRAME_URL } from '@/constants'
import { Box } from '@chakra-ui/react'

export const metadata: Metadata = {
    title: 'Foundational Technologies'
}

export default function FoundationalTechnologies() {
    return (
        <Box className='page-content'>
            <Box display='flex' justifyContent='center' w='100%'>
                <iframe
                    src={FOUNDATIONAL_ASSETS_IFRAME_URL}
                    style={{
                        width: '100%',
                        border: 'none',
                        minHeight: '100vh',
                        height: '1000px'
                    }}
                />
            </Box>
        </Box>
    )
}
