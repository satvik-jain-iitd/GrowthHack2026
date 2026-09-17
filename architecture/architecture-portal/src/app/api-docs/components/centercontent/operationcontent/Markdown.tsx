/* istanbul ignore file */

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkDirectivesToHtml from '@/plugins/remark-directives-to-html'
import { Box, Link } from '@chakra-ui/react'

const schema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames || [])],
    attributes: {
        ...(defaultSchema.attributes || {}),
        '*': [...(defaultSchema.attributes?.['*'] || []), 'style'],
        font: ['size', 'weight', 'style']
    }
}

export function Markdown({
    children,
    ...props
}: { children: string } & React.ComponentProps<typeof Box>) {
    return (
        <>
            <Box {...props}>
                <ReactMarkdown
                    remarkPlugins={[
                        remarkGfm,
                        remarkDirective,
                        remarkDirectivesToHtml
                    ]}
                    rehypePlugins={[
                        rehypeRaw,
                        rehypeHighlight,
                        [rehypeSanitize, schema]
                    ]}
                    components={{
                        ul: ({ children }) => (
                            <Box
                                as='ul'
                                pl={5}
                                mb={3}
                                style={{ listStyleType: 'disc' }}
                            >
                                {children}
                            </Box>
                        ),
                        ol: ({ children }) => (
                            <Box
                                as='ol'
                                pl={5}
                                mb={3}
                                style={{ listStyleType: 'decimal' }}
                            >
                                {children}
                            </Box>
                        ),
                        li: ({ children }) => (
                            <Box as='li' mb={1}>
                                {children}
                            </Box>
                        ),
                        a: ({ children, href }) => (
                            <>
                                {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                                <Link
                                    href={href}
                                    target='_blank'
                                    variant='underline'
                                    colorPalette='blue'
                                    whiteSpace='pre-wrap'
                                    wordBreak='break-word'
                                >
                                    {children}
                                </Link>
                            </>
                        ),
                        code: ({ children }) => {
                            return (
                                <Box
                                    as='code'
                                    bg='gray.100'
                                    _dark={{ bg: 'gray.700' }}
                                    px='0.25em'
                                    py='0.1em'
                                    whiteSpace='pre-wrap'
                                    overflowX='visible'
                                    maxW='100%'
                                >
                                    {children}
                                </Box>
                            )
                        }
                    }}
                >
                    {children}
                </ReactMarkdown>
            </Box>
        </>
    )
}
