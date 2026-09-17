'use client'

import { useEffect, useRef, useState } from 'react'
import {
    Box,
    Checkbox,
    Icon,
    Input,
    NativeSelect,
    Portal,
    Popover,
    Stack,
    Text
} from '@chakra-ui/react'
import { IconFilter } from '@americanexpress/dls-icons'

/** Delay before a keystroke is pushed into the table's filter state. */
const DEBOUNCE_MS = 250

export interface FilterOption {
    label: string
    value: string
}

export interface FilterPopoverProps {
    columnId: string
    /** A list of selected values when `multiple`, the filter text otherwise. */
    value: string | string[]
    onChange: (value: string | string[]) => void
    placeholder?: string
    /** When supplied the filter is a dropdown of these options, not a text input. */
    options?: FilterOption[]
    /** Renders `options` as checkboxes reporting every selected value. */
    multiple?: boolean
}

/**
 * Funnel-icon button that opens a popover with a text input — or a dropdown when
 * `options` are supplied, or a checkbox group when they are `multiple` — for
 * column filtering. The icon turns blue and a dot indicator appears when a
 * filter is active. Rendered via Portal to escape table overflow clipping.
 */
export function FilterPopover({
    columnId,
    value,
    onChange,
    placeholder = 'Filter…',
    options,
    multiple = false
}: FilterPopoverProps) {
    const text = typeof value === 'string' ? value : ''
    const selected = Array.isArray(value) ? value : []

    // Typing re-runs the filtered/sorted row model, which is expensive on large
    // datasets, so the input is uncontrolled-ish: local state updates on every
    // keystroke and the table only sees the debounced value.
    const [draft, setDraft] = useState(text)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => setDraft(text), [text])

    useEffect(
        () => () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        },
        []
    )

    const pushChange = (next: string, immediate = false) => {
        setDraft(next)
        if (timerRef.current) clearTimeout(timerRef.current)
        if (immediate) {
            onChange(next)
            return
        }
        timerRef.current = setTimeout(() => onChange(next), DEBOUNCE_MS)
    }

    const toggleOption = (optionValue: string) =>
        onChange(
            selected.includes(optionValue)
                ? selected.filter(current => current !== optionValue)
                : [...selected, optionValue]
        )

    const hasValue = multiple
        ? selected.length > 0
        : text.length > 0 || draft.length > 0

    return (
        <Popover.Root positioning={{ placement: 'top-end' }}>
            <Popover.Trigger asChild>
                <Box
                    as='button'
                    aria-label={`Filter ${columnId}`}
                    display='inline-flex'
                    alignItems='center'
                    p='2px'
                    borderRadius='sm'
                    color={hasValue ? 'blue.500' : 'fg.muted'}
                    _hover={{ color: 'fg', bg: 'bg.subtle' }}
                    onClick={e => e.stopPropagation()}
                >
                    <Icon as={IconFilter} boxSize={3.5} />
                </Box>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content minW='200px' p={3}>
                        <Stack gap={2}>
                            <Text
                                fontSize='xs'
                                fontWeight='semibold'
                                color='fg.muted'
                            >
                                Filter {columnId.replace(/_/g, ' ')}
                            </Text>
                            {options && multiple && (
                                <Stack gap={1}>
                                    {options.map(option => (
                                        <Checkbox.Root
                                            key={option.value}
                                            size='sm'
                                            checked={selected.includes(
                                                option.value
                                            )}
                                            onCheckedChange={() =>
                                                toggleOption(option.value)
                                            }
                                        >
                                            <Checkbox.HiddenInput
                                                aria-label={option.label}
                                            />
                                            <Checkbox.Control />
                                            <Checkbox.Label>
                                                {option.label}
                                            </Checkbox.Label>
                                        </Checkbox.Root>
                                    ))}
                                </Stack>
                            )}
                            {options && !multiple && (
                                <NativeSelect.Root size='sm'>
                                    <NativeSelect.Field
                                        aria-label={`Filter ${columnId} value`}
                                        value={draft}
                                        onChange={e =>
                                            pushChange(e.target.value, true)
                                        }
                                    >
                                        <option value=''>{placeholder}</option>
                                        {options.map(option => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            )}
                            {!options && (
                                <Input
                                    autoFocus
                                    size='sm'
                                    value={draft}
                                    onChange={e => pushChange(e.target.value)}
                                    placeholder={placeholder}
                                />
                            )}
                            {hasValue && (
                                <Box
                                    as='button'
                                    fontSize='xs'
                                    color='blue.500'
                                    textAlign='left'
                                    cursor='pointer'
                                    onClick={() =>
                                        multiple
                                            ? onChange([])
                                            : pushChange('', true)
                                    }
                                    _hover={{ textDecoration: 'underline' }}
                                >
                                    Clear filter
                                </Box>
                            )}
                        </Stack>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}
