import { Box, Button, Dialog, Text, Textarea } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Admonition } from '@/components/ui'

type FeedbackModalProps = {
    open: boolean
    onClose: () => void
    onSubmit: (_feedback: string) => Promise<void>
    title?: string
    submitLabel?: string
    showFeedback?: boolean
    decision?: 'APPROVED' | 'REJECTED' | 'ABSTAIN'
    showWarning?: boolean
    warningMessage?: string
}

export default function FeedbackModal({
    open,
    onClose,
    onSubmit,
    title = 'Provide Feedback',
    submitLabel = 'Submit',
    showFeedback = true,
    decision,
    showWarning = false,
    warningMessage
}: FeedbackModalProps) {
    const [feedback, setFeedback] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        await onSubmit(feedback ? feedback : '')
        setLoading(false)
        setFeedback('')
        onClose()
    }

    const isApproved = decision
        ? decision.charAt(0).toUpperCase() + decision.slice(1).toLowerCase()
        : ''
    const confirmationText = showFeedback
        ? `By submitting, you are confirming you ${isApproved} with the content in this ADR. Your comments below will be used to support the final decision.`
        : 'Please confirm that you would like to submit, once you submit you cannot go back to the current status you are on. Would you still like to submit?'

    return (
        <Dialog.Root
            trapFocus={true}
            open={open}
            onOpenChange={isOpen => !isOpen && onClose()}
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.CloseTrigger />
                    <Dialog.Header>
                        <Box>
                            <Dialog.Title data-testid='feedback-title'>
                                {title}
                            </Dialog.Title>
                            <Text data-testid='feedback-confirmation-text'>
                                {confirmationText}
                            </Text>
                            {showWarning && (
                                <Box
                                    mt={3}
                                    data-testid='feedback-approval-warning'
                                >
                                    <Admonition type='warning'>
                                        {warningMessage ??
                                            'Reviewer approval rate is low. Please consider this before submitting your decision.'}
                                    </Admonition>
                                </Box>
                            )}
                        </Box>
                    </Dialog.Header>
                    {showFeedback && (
                        <Dialog.Body>
                            <Textarea
                                data-testid='feedback-textarea'
                                onKeyDown={e => {
                                    if (e.key === ' ') {
                                        setFeedback(prev => prev + ' ')
                                        e.preventDefault()
                                    }
                                }}
                                autoFocus
                                placeholder='Feedback'
                                minH='80px'
                                value={feedback}
                                onChange={e => setFeedback(e.target.value)}
                            />
                        </Dialog.Body>
                    )}
                    <Dialog.Footer>
                        <Button
                            data-testid='feedback-cancel-btn'
                            onClick={e => {
                                e.stopPropagation()
                                e.preventDefault()
                                onClose()
                            }}
                            disabled={loading}
                            mr={2}
                            variant={'outline'}
                            colorPalette={'gray'}
                        >
                            Cancel
                        </Button>
                        <Button
                            data-testid='feedback-submit-btn'
                            onClick={e => {
                                e.stopPropagation()
                                e.preventDefault()
                                handleSubmit()
                            }}
                            disabled={
                                loading || (showFeedback && !feedback.trim())
                            }
                            colorPalette='blue'
                        >
                            {submitLabel}
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
