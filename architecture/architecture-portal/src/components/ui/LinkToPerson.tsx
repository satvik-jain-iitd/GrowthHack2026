/* istanbul ignore file */
import React from 'react'

function PersonHref(adsId: string) {
    return `https://dotconnector.aexp.com/people/${adsId}`
}

export function LinkToPerson({
    adsId,
    children
}: {
    adsId: string
    children: React.ReactNode
}) {
    return (
        // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
        <a target='_blank' rel='noopener noreferrer' href={PersonHref(adsId)}>
            {children}
        </a>
    )
}
