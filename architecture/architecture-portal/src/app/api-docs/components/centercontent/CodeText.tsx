/* istanbul ignore file */
import { Code } from '@chakra-ui/react'

const reqRespSamples = {
    maxW: '100%',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
}

export default function CodeText({
    isSample,
    children,
    pl
}: {
    isSample?: boolean
    children: React.ReactNode
    pl?: number
}) {
    return (
        <Code
            bg={'none'}
            w={isSample ? '100%' : 'auto'}
            {...(pl !== undefined ? { pl } : {})}
            {...(isSample ? reqRespSamples : {})}
        >
            {children}
        </Code>
    )
}
