/* istanbul ignore file */
import React from 'react'
import { Alert } from '@chakra-ui/react'

const DEFAULT_TYPE = 'note' as const
const SEVERITY_MAPPING = {
    success: 'success',
    note: 'info',
    info: 'info',
    tip: 'info',
    caution: 'warning',
    warning: 'warning',
    important: 'warning',
    danger: 'error'
} as const

type AdmonitionType = keyof typeof SEVERITY_MAPPING

export function Admonition({
    type = DEFAULT_TYPE,
    title,
    children
}: {
    type?: AdmonitionType
    title?: string
    children: React.ReactNode
}) {
    const safeType = (type || DEFAULT_TYPE).toLowerCase() as AdmonitionType
    const severity = SEVERITY_MAPPING[safeType] || 'info'

    return (
        <Alert.Root
            status={severity}
            variant='surface'
            css={{
                '& p:last-of-type': {
                    marginBottom: 0
                }
            }}
        >
            <Alert.Indicator />
            <Alert.Content>
                {title && <Alert.Title>{title}</Alert.Title>}
                <Alert.Description>{children}</Alert.Description>
            </Alert.Content>
        </Alert.Root>
    )
}
