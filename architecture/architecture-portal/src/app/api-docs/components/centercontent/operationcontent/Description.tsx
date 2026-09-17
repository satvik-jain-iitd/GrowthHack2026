/* istanbul ignore file */

import Styles from '@/app/api-docs/api-docs.module.scss'
import { Box, Text } from '@chakra-ui/react'
import { Markdown } from './Markdown'

export function Description({ opDescription }: { opDescription: string }) {
    return (
        <>
            <Box overflowX={'auto'} overflowY={'hidden'} width='100%'>
                <Text
                    as='div'
                    className={Styles.apiDocsFontSize}
                    mt='1em'
                    textAlign='justify'
                    boxSizing='border-box'
                >
                    <Markdown>{opDescription}</Markdown>
                </Text>
            </Box>
        </>
    )
}
