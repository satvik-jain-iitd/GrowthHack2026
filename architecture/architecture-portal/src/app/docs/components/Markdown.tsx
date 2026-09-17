/* istanbul ignore file */
import React from 'react'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import ReactMarkdown, { Components } from 'react-markdown'
import { Markdown as MarkdownProps } from '@/types/Markdown'
import Heading from '@/app/docs/components/Heading'
import { Admonition, InteractiveImage } from '@/components/ui'
import remarkDirectivesToHtml from '@/plugins/remark-directives-to-html'
import { rewriteLinkHref } from '@/app/docs/utils/client'

const schema = {
    ...defaultSchema,
    tagNames: [
        ...(defaultSchema.tagNames || []),
        'admonition',
        'iframe',
        'style'
    ],
    attributes: {
        ...(defaultSchema.attributes || {}),
        admonition: ['type', 'title'],
        iframe: [
            'src',
            'width',
            'height',
            'allow',
            'allowfullscreen',
            'frameborder',
            'loading',
            'referrerpolicy',
            'sandbox',
            'title',
            'style'
        ],
        style: [],
        '*': [...(defaultSchema.attributes?.['*'] || []), 'style']
    }
}

export default function Markdown({
    md,
    toc,
    filePath,
    repository,
    preview = false,
    static: isStatic = false,
    sourceHost = 'ghe'
}: MarkdownProps) {
    let tocIndex: number = 0
    let imageCount: number = 0

    function createHeading(el: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
        // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
        return ({ children }: any) => {
            if (typeof children !== 'string') {
                return <Heading el={el}>{children}</Heading>
            }

            const id = toc?.[tocIndex]?.anchor
            tocIndex++
            return (
                <Heading id={id} el={el}>
                    {children}
                </Heading>
            )
        }
    }

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkDirective, remarkDirectivesToHtml]}
            rehypePlugins={[
                rehypeRaw,
                rehypeHighlight,
                [rehypeSanitize, schema]
            ]}
            components={
                {
                    h1: createHeading('h1'),
                    h2: createHeading('h2'),
                    h3: createHeading('h3'),
                    h4: createHeading('h4'),
                    h5: createHeading('h5'),
                    h6: createHeading('h6'),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    pre({ children }: any) {
                        const codeChild = children?.props
                        const className = codeChild?.className
                        const language = className
                            ?.replace('language-', '')
                            ?.toLowerCase()
                        if (language === 'mermaid') {
                            const codeText =
                                typeof codeChild?.children === 'string'
                                    ? codeChild.children.trim()
                                    : ''
                            // Render Mermaid block directly in a div, skip <pre>
                            return <div className='mermaid'>{codeText}</div>
                        }

                        // Default <pre> for other code
                        return <pre>{children}</pre>
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
                    code: ({ children, className, node, ...props }: any) => {
                        return (
                            <code
                                className={
                                    className
                                        ? `${className} code-block`
                                        : 'code-block'
                                }
                                {...props}
                            >
                                {children}
                            </code>
                        )
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    admonition: ({ node, ...props }: any) => {
                        const type = node.properties?.type || props?.type
                        const title = node.properties?.title || undefined
                        return (
                            <Admonition type={type} title={title}>
                                {props.children}
                            </Admonition>
                        )
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
                    p: ({ node, ...props }: any) => {
                        const flatChildren = React.Children.toArray(
                            props.children
                        ).filter(child => {
                            if (typeof child === 'string') {
                                return child.trim() !== ''
                            }
                            return true
                        })
                        if (flatChildren.length === 1) {
                            const child = flatChildren[0]
                            if (
                                React.isValidElement(child) &&
                                ((typeof child.type === 'function' &&
                                    child.type.name === 'img') ||
                                    (typeof child.type === 'string' &&
                                        child.type === 'img'))
                            ) {
                                return child
                            }
                        }
                        return <p {...props} />
                    },
                    img: ({ src = '', alt = '' }) => {
                        const priority = imageCount < 2
                        imageCount++
                        return (
                            <InteractiveImage
                                src={src}
                                alt={alt}
                                filePath={filePath}
                                repository={repository}
                                priority={priority}
                                preview={preview}
                                static={isStatic}
                                sourceHost={sourceHost}
                            />
                        )
                    },
                    a: (props: React.ComponentProps<'a'>) => {
                        const href = rewriteLinkHref(
                            props.href || '',
                            repository,
                            filePath,
                            sourceHost
                        )
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const child = (props as any).children
                        return (
                            // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                            <a {...props} href={href}>
                                {child}
                            </a>
                        )
                    }
                } as unknown as Components
            }
        >
            {md}
        </ReactMarkdown>
    )
}
