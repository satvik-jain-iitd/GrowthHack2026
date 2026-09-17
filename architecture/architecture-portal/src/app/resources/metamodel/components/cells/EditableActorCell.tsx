/* istanbul ignore file */
'use client'

import { useEffect, useRef, useState } from 'react'
import { Flex, Icon, Input, Text } from '@chakra-ui/react'
import { IconEdit } from '@americanexpress/dls-icons'
import { AvatarTableRow } from '@/components/ui'

export interface EditableActorCellProps {
    value: string
    rowId: string
    field: string
    onSave: (rowId: string, field: string, newValue: string) => void
    canEdit?: boolean
}

/**
 * Single-actor cell. Displays an AvatarTableRow (avatar + resolved name) with a
 * hover pencil icon. Clicking switches to an email Input. Saves on Enter or blur,
 * cancels on Escape.
 */
export function EditableActorCell({
    value,
    rowId,
    field,
    onSave,
    canEdit = false
}: EditableActorCellProps) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(value)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editing) inputRef.current?.focus()
    }, [editing])

    const commit = () => {
        setEditing(false)
        const trimmed = draft.trim()
        if (trimmed !== value) onSave(rowId, field, trimmed)
    }

    if (editing) {
        return (
            <Input
                ref={inputRef}
                size='sm'
                type='email'
                value={draft}
                placeholder='Enter email address'
                onChange={e => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={e => {
                    if (e.key === 'Enter') commit()
                    if (e.key === 'Escape') {
                        setDraft(value)
                        setEditing(false)
                    }
                }}
                onClick={e => e.stopPropagation()}
            />
        )
    }

    return (
        <Flex
            align='center'
            gap={1}
            role='group'
            cursor='text'
            onClick={() => {
                if (canEdit) {
                    setDraft(value)
                    setEditing(true)
                }
            }}
            minW={0}
        >
            {value ? (
                <AvatarTableRow email={value} nameWidth='150px' />
            ) : (
                <Text fontSize='sm' color='fg.subtle' flex={1}>
                    —
                </Text>
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
