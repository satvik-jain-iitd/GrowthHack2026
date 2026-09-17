import React from 'react'
import { Button, HStack } from '@chakra-ui/react'
import {
    useSelectedCount,
    useAllJourneysComplete
} from './CapabilitySelectionContext'

type Props = {
    onBack?: () => void
    onSaveAndNext: () => void
    onSubmitAll?: () => void
    isLastJourney: boolean
    allJourneysVisited?: boolean
}

export function SelectionStatusBar({
    onBack,
    onSaveAndNext,
    onSubmitAll,
    isLastJourney,
    allJourneysVisited
}: Props) {
    const selectedCount = useSelectedCount()
    const allJourneysComplete = useAllJourneysComplete()

    const saveDisabled = selectedCount === 0
    const submitAllDisabled = !allJourneysComplete

    return (
        <HStack gap={4}>
            {onBack && (
                <Button
                    data-testid='back-to-journeys-btn'
                    colorPalette='blue'
                    variant='outline'
                    size='sm'
                    onClick={onBack}
                >
                    Back to Journeys
                </Button>
            )}
            <Button
                data-testid='review-selections-btn'
                colorPalette='blue'
                size='sm'
                onClick={onSaveAndNext}
                disabled={saveDisabled}
            >
                {isLastJourney ? 'Review Selections' : 'Review Selections '}
            </Button>
            {allJourneysVisited && onSubmitAll && (
                <Button
                    data-testid='submit-all-btn'
                    colorPalette='green'
                    size='sm'
                    onClick={onSubmitAll}
                    disabled={submitAllDisabled}
                >
                    Submit All
                </Button>
            )}
        </HStack>
    )
}
