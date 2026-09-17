/* istanbul ignore file */

import { Code } from '@chakra-ui/react'

export function CodeBlock({
    val,
    ...props
}: { val: string | Array<string> | object } & React.ComponentProps<
    typeof Code
>) {
    return (
        <Code
            maxW='100%'
            overflowX='auto'
            whiteSpace='pre-wrap'
            wordBreak='break-word'
            borderColor='#D4DEE9'
            variant='outline'
            fontSize='12px'
            _dark={{ bg: 'gray.700', color: 'gray.300' }}
            {...props}
        >
            {typeof val === 'object' ? JSON.stringify(val, null, 2) : val}
        </Code>
    )
}
