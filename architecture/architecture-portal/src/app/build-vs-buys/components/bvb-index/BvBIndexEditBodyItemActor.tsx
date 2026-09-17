import { VStack, Text, Box, Button, Input, Field } from '@chakra-ui/react'
import React, { useState } from 'react'

function isAexpEmail(email: string) {
    const normalized = email.trim().toLowerCase()
    return normalized.endsWith('@aexp.com') || normalized.endsWith('@resy.com')
}

function getActorError(actor: string, actors: string[]): string {
    if (!isAexpEmail(actor)) return 'Must end with @aexp.com'
    if (actors.filter(a => a === actor).length > 1) return 'Duplicate email'
    return ''
}

function isFieldEditable(keyName: string, stepIndex?: number): boolean {
    const alwaysEditable = new Set(['stakeHolders', 'requester'])
    if (alwaysEditable.has(keyName)) return true
    if (typeof stepIndex !== 'number') return false
    if (stepIndex > 2) return false
    if (stepIndex > 1) return keyName !== 'reviewers'
    return true
}

export default function BvBIndexEditBodyItemActor({
    label,
    keyName,
    value,
    icon,
    onChange,
    stepIndex
}: {
    label: string
    keyName: string
    value: string[] | undefined
    icon: React.ReactNode
    onChange?: (_actors: string[]) => void
    stepIndex?: number
}) {
    const isEditable = isFieldEditable(keyName, stepIndex)

    const [localActors, setLocalActors] = useState<string[]>(value || [])
    const [newActor, setNewActor] = useState('')
    const [addError, setAddError] = useState('')

    React.useEffect(() => {
        setLocalActors(value || [])
    }, [value])

    const handleRemove = (idx: number) => {
        const updated = localActors.filter((_, i) => i !== idx)
        setLocalActors(updated)
        if (onChange) onChange(updated)
    }

    const handleEdit = (idx: number, val: string) => {
        const updated = [...localActors]
        updated[idx] = val
        setLocalActors(updated)
        if (onChange) onChange(updated)
    }

    const handleAdd = () => {
        const trimmed = newActor.trim().toLowerCase()
        if (trimmed === '' || !isAexpEmail(trimmed)) {
            setAddError('Must end with @aexp.com')
            return
        }
        if (localActors.map(a => a.toLowerCase()).includes(trimmed)) {
            setAddError('Duplicate email')
            return
        }
        setAddError('')
        const updated = [...localActors, trimmed]
        setLocalActors(updated)
        setNewActor('')
        if (onChange) onChange(updated)
    }

    return (
        <VStack gap={3} align='stretch'>
            <Text
                as='span'
                fontWeight='bold'
                fontSize='sm'
                color='fg.muted'
                display='flex'
                alignItems='center'
                gap={1}
            >
                {icon} {label}
            </Text>
            {localActors.map((actor, idx) => {
                const errorMsg = getActorError(actor, localActors)
                return (
                    <Box key={idx} display='flex' alignItems='center'>
                        <Field.Root invalid={!!errorMsg} flex='1'>
                            <Input
                                color={'fg'}
                                value={actor}
                                size='lg'
                                onChange={e => handleEdit(idx, e.target.value)}
                                disabled={!isEditable}
                            />
                            {errorMsg && (
                                <Field.ErrorText>{errorMsg}</Field.ErrorText>
                            )}
                        </Field.Root>
                        <Button
                            ml={2}
                            colorPalette='red'
                            variant='outline'
                            aria-label='remove'
                            onClick={() => handleRemove(idx)}
                            disabled={!isEditable}
                        >
                            Remove
                        </Button>
                    </Box>
                )
            })}
            <Box display='flex' alignItems='center'>
                <Field.Root invalid={!!addError} flex='1'>
                    <Input
                        color={'fg'}
                        size='sm'
                        value={newActor}
                        onChange={e => {
                            setNewActor(e.target.value)
                            setAddError('')
                        }}
                        disabled={!isEditable}
                    />
                    {addError && <Field.ErrorText>{addError}</Field.ErrorText>}
                </Field.Root>
                <Button
                    ml={2}
                    colorPalette='blue'
                    variant='outline'
                    aria-label='add'
                    onClick={handleAdd}
                    disabled={!isEditable}
                >
                    Add
                </Button>
            </Box>
        </VStack>
    )
}
