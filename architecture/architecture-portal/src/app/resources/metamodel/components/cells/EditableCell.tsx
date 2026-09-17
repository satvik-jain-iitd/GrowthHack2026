/* istanbul ignore file */
'use client'

import { useEffect, useRef, useState } from 'react'
import { Flex, Icon, Input, Text } from '@chakra-ui/react'
import { IconEdit } from '@americanexpress/dls-icons'

export interface EditableCellProps {
    value: string
    rowId: string
    field: string
    onSave: (rowId: string, field: string, newValue: string) => void
    fontFamily?: string
    fontWeight?: string | number
}

/**
 * Single-value text cell. Displays text with a hover pencil icon; clicking
 * switches to an inline Input. Saves on Enter or blur, cancels on Escape.
 */
export function EditableCell({
    value,
    rowId,
    field,
    onSave,
    fontFamily,
    fontWeight
}: EditableCellProps) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(value)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editing) inputRef.current?.focus()
    }, [editing])

    const commit = () => {
        setEditing(false)
        if (draft !== value) onSave(rowId, field, draft)
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
                        setDraft(value)
                        setEditing(false)
                    }
                }}
                fontFamily={fontFamily}
                fontWeight={fontWeight}
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
            onClick={() => setEditing(true)}
        >
            <Text
                as='span'
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                fontSize='sm'
                flex={1}
                minW={0}
                overflow='hidden'
                textOverflow='ellipsis'
                whiteSpace='nowrap'
            >
                {value || '—'}
            </Text>
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
