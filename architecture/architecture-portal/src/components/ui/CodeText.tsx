/* istanbul ignore file */
import { Code } from '@chakra-ui/react'

export default function CodeText({
    text,
    isExpanded
}: {
    text: string
    isExpanded?: boolean
}) {
    return (
        <Code
            fontSize='var(--apiFontSizeBase)'
            bg={'none'}
            color={isExpanded ? '#fff' : 'default'}
        >
            {text}
        </Code>
    )
}
