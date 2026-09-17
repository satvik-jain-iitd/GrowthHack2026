/* istanbul ignore file */
'use client'

import { Text } from '@chakra-ui/react'
import { AvatarTableRow } from '@/components/ui'

export interface Actor {
    name: string
    email: string
}

export interface ActorCellProps {
    actor: Actor | null | undefined
}

/**
 * Read-only single-actor cell. Renders an `AvatarTableRow` (avatar + directory
 * resolved name) when an email is present, otherwise falls back to the plain
 * name or an em dash. Filtering is handled by the column's accessor/filterFn
 * using the actor name, so search-by-name still works.
 */
export function ActorCell({ actor }: ActorCellProps) {
    if (actor?.email) {
        return <AvatarTableRow email={actor.email} nameWidth='150px' />
    }
    return (
        <Text as='span' fontSize='sm'>
            {actor?.name || '—'}
        </Text>
    )
}
