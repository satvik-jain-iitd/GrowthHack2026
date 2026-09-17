/* istanbul ignore file */
import { Metadata } from 'next'
import { Box } from '@chakra-ui/react'
import MetamodelHub from './components/MetamodelHub'

export const metadata: Metadata = {
    title: 'Metamodel'
}

export default function MetamodelPage() {
    return (
        <Box className='page-content' py={4}>
            <MetamodelHub />
        </Box>
    )
}
