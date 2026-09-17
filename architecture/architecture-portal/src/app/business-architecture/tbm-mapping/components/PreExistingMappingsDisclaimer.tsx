/* istanbul ignore file */
import { Alert, Box } from '@chakra-ui/react'

export default function PreExistingMappingsDisclaimer() {
    return (
        <Box w={'100%'}>
            <Alert.Root variant={'outline'} bg={'blue.50'}>
                <Alert.Indicator />
                <Alert.Content>
                    <Alert.Title>
                        Pre-Existing Mappings Have Been Detected
                    </Alert.Title>
                    <Alert.Description>
                        Business Architects have already reviewed the
                        preselected capabilities below for this journey
                    </Alert.Description>
                </Alert.Content>
            </Alert.Root>
        </Box>
    )
}
