/* istanbul ignore file */
import { Metadata } from 'next'
import EdaaatUI from './components/EdaaatUI'
import { Box, Flex } from '@chakra-ui/react'

export const metadata: Metadata = {
    title: 'Enterprise Data Architecture Artifact Automation Tool'
}

export default function Edaaat() {
    return (
        <Box>
            <Flex
                direction='column'
                minH='100vh'
                background='surface.default.offwhite'
            >
                <Box divideColor='gray.200'>
                    <EdaaatUI />
                </Box>
            </Flex>
        </Box>
    )
}
