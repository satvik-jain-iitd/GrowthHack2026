/* istanbul ignore file */
'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button, Input, HStack } from '@chakra-ui/react'

type Props = {
    disabled: boolean
    onSave: (statement: string) => void
    isLoading?: boolean
    placeholder?: string
}

export function CreateJourneyButton({
    onSave,
    placeholder = 'Enter journey statement...',
    disabled
}: Props) {
    const requiredPrefix = 'I want to '
    const [isOpen, setIsOpen] = useState(false)
    const [journeyStatement, setJourneyStatement] = useState(requiredPrefix)
    const inputRef = useRef<HTMLInputElement>(null)

    const normalizeJourneyStatement = (value: string) => {
        if (value.startsWith(requiredPrefix)) {
            return value
        }

        const withoutPrefix = value.replace(/^I want to\s*/i, '').trimStart()
        return `${requiredPrefix}${withoutPrefix}`
    }

    // Focus input when it appears
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const hasJourneyContent =
        journeyStatement.slice(requiredPrefix.length).trim().length > 0

    const handleSubmit = () => {
        if (hasJourneyContent) {
            onSave(journeyStatement)
            setJourneyStatement(requiredPrefix)
            setIsOpen(false)
        }
    }

    const handleCancel = () => {
        setJourneyStatement(requiredPrefix)
        setIsOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit()
        } else if (e.key === 'Escape') {
            handleCancel()
        }
    }

    if (isOpen) {
        return (
            <HStack gap={2} marginBottom='22.5px' marginLeft='10px'>
                <Input
                    ref={inputRef}
                    placeholder={placeholder}
                    value={journeyStatement}
                    onChange={e =>
                        setJourneyStatement(
                            normalizeJourneyStatement(e.target.value)
                        )
                    }
                    onKeyDown={handleKeyDown}
                    borderRadius='md'
                    border='1px solid'
                    borderColor='border.emphasis'
                    background='surface.white'
                    width='340px'
                    height='40px'
                    disabled={disabled}
                />
                <Button
                    background='#006FCF'
                    onClick={handleSubmit}
                    disabled={disabled || !hasJourneyContent}
                >
                    Save
                </Button>
            </HStack>
        )
    }

    return (
        <Button
            colorPalette='blue'
            variant='outline'
            onClick={() => setIsOpen(true)}
            alignSelf='center'
            marginBottom='22px'
            marginLeft='10px'
        >
            Create A Journey
        </Button>
    )
}
