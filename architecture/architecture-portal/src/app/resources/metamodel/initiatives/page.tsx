/* istanbul ignore file */
import { Metadata } from 'next'
import { Box } from '@chakra-ui/react'
import InitiativesTable from './components/InitiativesTable'

export const metadata: Metadata = {
    title: 'Initiatives'
}

// No server-side prefetch: the metamodel API is only reachable from the
// browser, so the grid loads its data client-side like the management pages do.
export default function MetamodelInitiativesPage() {
    return (
        <Box className='page-content' py={4}>
            <InitiativesTable />
        </Box>
    )
}
