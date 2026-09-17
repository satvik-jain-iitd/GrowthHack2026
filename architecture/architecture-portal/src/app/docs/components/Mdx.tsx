/* istanbul ignore file */
import React from 'react'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import remarkDirectivesToMdx from '@/plugins/remark-directives-to-mdx'
import rehypeHighlight from 'rehype-highlight'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Markdown as MarkdownProps } from '@/types/Markdown'
import {
    Admonition,
    BadgeMandate,
    BadgeAdopt,
    BadgeAssess,
    BadgeTrial,
    BadgeSupported,
    BadgeExit,
    BadgeHold,
    LinkToPerson,
    IframeComp,
    InteractiveImage,
    ResponseBlock
} from '@/components/ui'
import Heading from '@/app/docs/components/Heading'
import { rewriteLinkHref } from '@/app/docs/utils/client'

export default function Mdx({
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
        <MDXRemote
            source={md!}
            options={{
                blockJS: false,
                mdxOptions: {
                    remarkPlugins: [
                        remarkGfm,
                        remarkDirective,
                        remarkDirectivesToMdx
                    ],
                    rehypePlugins: [rehypeHighlight]
                }
            }}
            components={{
                h1: createHeading('h1'),
                h2: createHeading('h2'),
                h3: createHeading('h3'),
                h4: createHeading('h4'),
                h5: createHeading('h5'),
                h6: createHeading('h6'),
                pre: (props: React.ComponentProps<'pre'>) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const child = (props as any).children?.props
                    const isMermaid =
                        child?.className?.includes('language-mermaid')
                    if (isMermaid) {
                        return <div className='mermaid'>{child.children}</div>
                    }
                    return <pre {...props} />
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
                },
                Admonition,
                BadgeMandate,
                BadgeAdopt,
                BadgeAssess,
                BadgeTrial,
                BadgeSupported,
                BadgeExit,
                BadgeHold,
                LinkToPerson,
                IframeComp,
                ResponseBlock
            }}
        />
    )
}
