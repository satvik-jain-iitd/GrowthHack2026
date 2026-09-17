/* istanbul ignore file */
'use client'

import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import { Badge, Box, Flex, Icon, Input, Text } from '@chakra-ui/react'
import { IconEdit, IconClose } from '@americanexpress/dls-icons'
import { AvatarTableRow } from '@/components/ui'

export interface EditableActorsCellProps {
    value: string[]
    rowId: string
    field: string
    onSave: (rowId: string, field: string, newValue: string) => void
    canEdit?: boolean
}

/**
 * Multi-actor cell. Displays stacked AvatarTableRow components with a hover
 * pencil icon. Clicking switches to a tag-chip editor where each person can be
 * removed individually and new emails can be added by typing and pressing
 * Enter or comma. Saves on blur when the add-input loses focus with no pending
 * text, or when Enter is pressed on an empty input.
 */
export function EditableActorsCell({
    value,
    rowId,
    field,
    onSave,
    canEdit = false
}: EditableActorsCellProps) {
    const filtered = value.filter(Boolean)
    const [editing, setEditing] = useState(false)
    const [tags, setTags] = useState<string[]>(filtered)
    const [inputVal, setInputVal] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (editing) inputRef.current?.focus()
    }, [editing])

    const commitTag = () => {
        const trimmed = inputVal.trim()
        if (trimmed && !tags.includes(trimmed)) {
            setTags(prev => [...prev, trimmed])
        }
        setInputVal('')
    }

    const removeTag = (tag: string) => {
        setTags(prev => prev.filter(t => t !== tag))
    }

    const save = (finalTags: string[]) => {
        setEditing(false)
        onSave(rowId, field, finalTags.join(', '))
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            commitTag()
        } else if (e.key === 'Escape') {
            setTags(value.filter(Boolean))
            setInputVal('')
            setEditing(false)
        } else if (
            e.key === 'Backspace' &&
            inputVal === '' &&
            tags.length > 0
        ) {
            setTags(prev => prev.slice(0, -1))
        }
    }

    const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        // Only commit when focus leaves the entire container
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            const pending = inputVal.trim()
            const finalTags =
                pending && !tags.includes(pending) ? [...tags, pending] : tags
            save(finalTags)
        }
    }

    if (editing) {
        return (
            <Box
                ref={containerRef}
                onBlur={handleContainerBlur}
                borderWidth='1px'
                borderColor='border'
                borderRadius='md'
                p={1.5}
                minH='36px'
                cursor='text'
                onClick={() => inputRef.current?.focus()}
            >
                <Flex flexWrap='wrap' gap={1} align='center'>
                    {tags.map(tag => (
                        <Badge
                            key={tag}
                            variant='subtle'
                            colorPalette='teal'
                            fontSize='2xs'
                            borderRadius='sm'
                            display='flex'
                            alignItems='center'
                            gap={1}
                            pl={1.5}
                            pr={0.5}
                        >
                            {tag}
                            <Icon
                                as={IconClose}
                                boxSize={3}
                                cursor='pointer'
                                onClick={e => {
                                    e.stopPropagation()
                                    removeTag(tag)
                                }}
                                onMouseDown={e => e.preventDefault()}
                            />
                        </Badge>
                    ))}
                    <Input
                        ref={inputRef}
                        size='xs'
                        variant='flushed'
                        value={inputVal}
                        placeholder={
                            tags.length === 0
                                ? 'Add email, press Enter'
                                : 'Add another…'
                        }
                        onChange={e => setInputVal(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onClick={e => e.stopPropagation()}
                        minW='120px'
                        flex={1}
                    />
                </Flex>
            </Box>
        )
    }

    return (
        <Flex
            align='flex-start'
            gap={1}
            role='group'
            cursor='text'
            onClick={() => {
                if (canEdit) {
                    setTags(value.filter(Boolean))
                    setEditing(true)
                }
            }}
            minW={0}
        >
            <Box flex={1} minW={0}>
                {filtered.length === 0 ? (
                    <Text fontSize='sm' color='fg.subtle'>
                        —
                    </Text>
                ) : (
                    <Flex flexDirection='column' gap={1}>
                        {filtered.map(email => (
                            <AvatarTableRow
                                key={email}
                                email={email}
                                nameWidth='150px'
                            />
                        ))}
                    </Flex>
                )}
            </Box>
            <Icon
                as={IconEdit}
                boxSize={3.5}
                color='fg.subtle'
                opacity={0}
                _groupHover={{ opacity: 1 }}
                flexShrink={0}
                mt={1}
                transition='opacity 0.1s'
            />
        </Flex>
    )
}
