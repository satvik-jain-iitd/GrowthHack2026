/* istanbul ignore file */
'use client'

import { Flex, Text } from '@chakra-ui/react'
import { AvatarTableRow, AvatarShowMore } from '@/components/ui'
import type { Actor } from './ActorCell'

export interface ActorsCellProps {
    actors: Actor[]
    /** Max avatars rendered inline before overflowing into a popover. */
    maxVisible?: number
}

/**
 * Read-only multi-actor cell. Renders stacked `AvatarTableRow`s for actors that
 * have an email; any overflow beyond `maxVisible` collapses into the shared
 * `AvatarShowMore` popover. Actors without an email render as plain names.
 * Filtering is handled by the column accessor/filterFn using actor names.
 */
export function ActorsCell({ actors, maxVisible = 2 }: ActorsCellProps) {
    const valid = actors.filter(actor => actor.name || actor.email)
    if (valid.length === 0) {
        return (
            <Text as='span' fontSize='sm'>
                —
            </Text>
        )
    }

    const visible = valid.slice(0, maxVisible)
    const overflow = valid.slice(maxVisible)

    return (
        <Flex direction='column' gap={1} align='flex-start'>
            {visible.map(actor =>
                actor.email ? (
                    <AvatarTableRow
                        key={actor.email}
                        email={actor.email}
                        nameWidth='150px'
                    />
                ) : (
                    <Text key={actor.name} as='span' fontSize='sm'>
                        {actor.name}
                    </Text>
                )
            )}
            {overflow.length > 0 && (
                <AvatarShowMore users={overflow.map(actor => actor.email)} />
            )}
        </Flex>
    )
}
