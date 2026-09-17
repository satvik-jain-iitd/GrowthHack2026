'use client'

import { useState } from 'react'
import {
    Badge,
    Box,
    Portal,
    Popover,
    Spinner,
    Stack,
    Text
} from '@chakra-ui/react'

import { useInitiativeTechStacks } from '../hooks/useInitiativeTechStacks'

export interface TechStacksCellProps {
    initiativeId: string
    /** Count from the metamodel tech-stack ids, shown on the badge upfront. */
    count: number
}

/**
 * Tech Stacks badge + popover for an initiative. The badge count comes from the
 * metamodel row; the human-readable names are resolved from architecture-api's
 * PTB initiative metadata only when the popover is opened. Falls back silently
 * to an empty list if the lookup fails.
 */
export function TechStacksCell({ initiativeId, count }: TechStacksCellProps) {
    const [open, setOpen] = useState(false)
    const { techStacks, loading } = useInitiativeTechStacks(initiativeId, open)

    const badgeLabel = `${count} Tech Stacks`

    if (count === 0) {
        return (
            <Badge
                colorPalette='gray'
                variant='subtle'
                borderRadius='full'
                px={2}
            >
                {badgeLabel}
            </Badge>
        )
    }

    return (
        <Popover.Root
            open={open}
            onOpenChange={event => setOpen(event.open)}
            positioning={{ placement: 'bottom-start' }}
        >
            <Popover.Trigger asChild>
                <Badge
                    colorPalette='purple'
                    variant='subtle'
                    borderRadius='full'
                    px={2}
                    cursor='pointer'
                    _hover={{ opacity: 0.8 }}
                    aria-label={`View ${count} Technology Stacks`}
                >
                    {badgeLabel}
                </Badge>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content minW='260px' maxW='380px'>
                        <Box p={3}>
                            <Text
                                fontSize='xs'
                                fontWeight='semibold'
                                color='fg.muted'
                                mb={2}
                            >
                                Technology Stacks
                            </Text>
                            {loading ? (
                                <Spinner size='sm' />
                            ) : (
                                <Stack gap={1}>
                                    {techStacks.length === 0 ? (
                                        <Text fontSize='xs' color='fg.muted'>
                                            No technology stacks found.
                                        </Text>
                                    ) : (
                                        techStacks.map((item, i) => (
                                            <Text
                                                key={i}
                                                fontSize='xs'
                                                color='fg'
                                            >
                                                {item}
                                            </Text>
                                        ))
                                    )}
                                </Stack>
                            )}
                        </Box>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}
