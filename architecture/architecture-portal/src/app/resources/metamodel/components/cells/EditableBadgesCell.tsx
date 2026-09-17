/* istanbul ignore file */
'use client'

import { useEffect, useRef, useState } from 'react'
import { Badge, Flex, Icon, Input, Text } from '@chakra-ui/react'
import { IconEdit } from '@americanexpress/dls-icons'

export interface EditableBadgesCellProps {
    value: string[]
    rowId: string
    field: string
    onSave: (rowId: string, field: string, newValue: string) => void
    colorPalette: string
}

/**
 * Multi-value array cell displayed as Chakra Badges. Clicking switches to a
 * comma-separated Input for editing. Saves on Enter or blur, cancels on Escape.
 * The `onSave` callback receives the new comma-separated string.
 */
export function EditableBadgesCell({
    value,
    rowId,
    field,
    onSave,
    colorPalette
}: EditableBadgesCellProps) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(value.join(', '))
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editing) inputRef.current?.focus()
    }, [editing])

    // Keep draft in sync if external value refreshes while not editing
    useEffect(() => {
        if (!editing) setDraft(value.join(', '))
    }, [value, editing])

    const commit = () => {
        setEditing(false)
        const next = draft.trim()
        if (next !== value.join(', ')) onSave(rowId, field, next)
    }

    if (editing) {
        return (
            <Input
                ref={inputRef}
                size='sm'
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={e => {
                    if (e.key === 'Enter') commit()
                    if (e.key === 'Escape') {
                        setDraft(value.join(', '))
                        setEditing(false)
                    }
                }}
                placeholder='Comma-separated values'
                onClick={e => e.stopPropagation()}
            />
        )
    }

    const isEmpty =
        value == null || value.length === 0 || (value.length === 1 && !value[0])

    return (
        <Flex
            align='center'
            gap={1}
            role='group'
            cursor='text'
            onClick={() => setEditing(true)}
            flexWrap='wrap'
        >
            {isEmpty ? (
                <Text fontSize='sm' color='fg.subtle' flex={1}>
                    —
                </Text>
            ) : (
                value.filter(Boolean).map(v => (
                    <Badge
                        key={v}
                        variant='subtle'
                        colorPalette={colorPalette}
                        fontSize='2xs'
                        borderRadius='sm'
                    >
                        {v}
                    </Badge>
                ))
            )}
            <Icon
                as={IconEdit}
                boxSize={3.5}
                color='fg.subtle'
                opacity={0}
                _groupHover={{ opacity: 1 }}
                flexShrink={0}
                transition='opacity 0.1s'
            />
        </Flex>
    )
}
