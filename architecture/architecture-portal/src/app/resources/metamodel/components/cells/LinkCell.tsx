/* istanbul ignore file */
'use client'

import { Link, Text } from '@chakra-ui/react'

export interface LinkCellProps {
    href: string
    label?: string
}

/**
 * Read-only cell that renders a URL as an external link. Falls back to an
 * em dash when no URL is present.
 */
export function LinkCell({ href, label = 'Open' }: LinkCellProps) {
    if (!href) {
        return (
            <Text as='span' fontSize='sm'>
                —
            </Text>
        )
    }

    return (
        // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link -- external URL opened in a new tab, not internal SPA navigation
        <Link
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            fontSize='sm'
            color='blue.500'
        >
            {label}
        </Link>
    )
}
