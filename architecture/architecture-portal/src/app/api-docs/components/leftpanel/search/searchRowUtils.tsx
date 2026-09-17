/* istanbul ignore file */

import React from 'react'
import { Highlight, chakra } from '@chakra-ui/react'
import { DESCRIPTION_CLAMP } from '@/app/api-docs/constants/search'

export const LinkButton = ({
    children,
    onClick
}: {
    children: React.ReactNode
    onClick: () => void
}) => (
    <chakra.button
        type='button'
        fontSize='xs'
        fontWeight='600'
        color='#006fcf'
        onClick={onClick}
    >
        {children}
    </chakra.button>
)

// Row keys carry `/` and `:`; aria-activedescendant needs a plain DOM id.
export const optionDomId = (key: string) =>
    `api-docs-search-option-${key.replace(/[^a-zA-Z0-9_-]/g, '_')}`

export const clampDescription = (value?: string) => {
    if (!value) return ''
    if (value.length <= DESCRIPTION_CLAMP) return value
    return `${value.slice(0, DESCRIPTION_CLAMP).trimEnd()}…`
}

// Single-character tokens against long text produce thousands of spans.
const highlightable = (tokens: string[]) => tokens.filter(t => t.length > 1)

export function HighlightedText({
    text,
    tokens
}: {
    text: string
    tokens: string[]
}) {
    const query = highlightable(tokens)
    if (!text) return null
    if (!query.length) return <>{text}</>
    return (
        <Highlight
            ignoreCase
            matchAll
            query={query}
            styles={{ bg: 'yellow.emphasized', fontWeight: 'medium' }}
        >
            {text}
        </Highlight>
    )
}
