/* istanbul ignore file */
'use client'

import { Badge, Box, Portal, Popover, Stack, Text } from '@chakra-ui/react'

export interface ListPopoverProps {
    count: number
    items: string[]
    label: string
    colorPalette: string
    /** Optional formatter for the badge label. Defaults to just the count. */
    badgeText?: (count: number) => string
}

/**
 * Displays a clickable badge showing the item count. On click, opens a popover
 * listing all items. Rendered via Portal to escape table overflow clipping.
 */
export function ListPopover({
    count,
    items,
    label,
    colorPalette,
    badgeText
}: ListPopoverProps) {
    const badgeLabel = badgeText ? badgeText(count) : String(count)

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
        <Popover.Root positioning={{ placement: 'bottom-start' }}>
            <Popover.Trigger asChild>
                <Badge
                    colorPalette={colorPalette}
                    variant='subtle'
                    borderRadius='full'
                    px={2}
                    cursor='pointer'
                    _hover={{ opacity: 0.8 }}
                    aria-label={`View ${count} ${label}`}
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
                                {label} ({count})
                            </Text>
                            <Stack gap={1}>
                                {items.map((item, i) => (
                                    <Text key={i} fontSize='xs' color='fg'>
                                        {item}
                                    </Text>
                                ))}
                            </Stack>
                        </Box>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}
