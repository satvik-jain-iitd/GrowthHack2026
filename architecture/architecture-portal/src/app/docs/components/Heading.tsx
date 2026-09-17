/* istanbul ignore file */
'use client'
import * as React from 'react'
import { IconButton, Link } from '@chakra-ui/react'
import { IconLink } from '@americanexpress/dls-icons'
import { useTocContext } from '@/context'

type HeadingProps = {
    children: React.ReactNode
    id?: string
    el: React.ElementType
}

export default function Heading({ children, id, el: Element }: HeadingProps) {
    const { onTocClick } = useTocContext()
    const [hovered, setHovered] = React.useState(false)

    return (
        <Element
            id={id}
            style={{ position: 'relative' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span style={{ display: 'flex', alignItems: 'center' }}>
                {children}
                {id && (
                    // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                    <Link
                        href={`#${id}`}
                        onClick={e => onTocClick(e, id)}
                        ml={2}
                    >
                        <IconButton
                            size='sm'
                            variant='subtle'
                            borderRadius='50%'
                            opacity={hovered ? 1 : 0}
                            transition='opacity 0.2s'
                            p={1}
                        >
                            <IconLink color='information' />
                        </IconButton>
                    </Link>
                )}
            </span>
        </Element>
    )
}
