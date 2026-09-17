import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils'
import { BVB_TEST_IDS } from '@/app/build-vs-buys/test-ids'

// Polyfill ResizeObserver in case any imported UI primitives rely on it
class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}
;(
    global as unknown as { ResizeObserver?: typeof ResizeObserver }
).ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

import FeedbackModal from './FeedbackModal'

describe('FeedbackModal', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders title, confirmation text and textarea when open', () => {
        const onSubmit = jest.fn().mockResolvedValue(undefined)
        const onClose = jest.fn()

        render(
            <FeedbackModal open={true} onClose={onClose} onSubmit={onSubmit} />
        )

        expect(
            screen.getByTestId(BVB_TEST_IDS.feedbackTitle)
        ).toHaveTextContent('Provide Feedback')
        expect(
            screen.getByTestId(BVB_TEST_IDS.feedbackConfirmationText)
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(BVB_TEST_IDS.feedbackTextarea)
        ).toBeInTheDocument()

        // Submit should be disabled when textarea empty
        expect(
            screen.getByTestId(BVB_TEST_IDS.feedbackSubmitBtn)
        ).toBeDisabled()
    })

    it('allows entering feedback, submits and closes', async () => {
        const onSubmit = jest.fn().mockResolvedValue(undefined)
        const onClose = jest.fn()

        render(
            <FeedbackModal open={true} onClose={onClose} onSubmit={onSubmit} />
        )

        const textarea = screen.getByTestId(
            BVB_TEST_IDS.feedbackTextarea
        ) as HTMLTextAreaElement
        fireEvent.change(textarea, { target: { value: 'Looks good' } })

        const submitBtn = screen.getByTestId(BVB_TEST_IDS.feedbackSubmitBtn)
        expect(submitBtn).toBeEnabled()

        fireEvent.click(submitBtn)

        await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('Looks good'))
        expect(onClose).toHaveBeenCalled()
    })

    it('cancel button calls onClose and does not call onSubmit', () => {
        const onSubmit = jest.fn()
        const onClose = jest.fn()

        render(
            <FeedbackModal open={true} onClose={onClose} onSubmit={onSubmit} />
        )

        const cancelBtn = screen.getByTestId(BVB_TEST_IDS.feedbackCancelBtn)
        fireEvent.click(cancelBtn)

        expect(onClose).toHaveBeenCalled()
        expect(onSubmit).not.toHaveBeenCalled()
    })

    it('when showFeedback is false, no textarea is rendered and submit is enabled and sends empty feedback', async () => {
        const onSubmit = jest.fn().mockResolvedValue(undefined)
        const onClose = jest.fn()

        render(
            <FeedbackModal
                open={true}
                onClose={onClose}
                onSubmit={onSubmit}
                showFeedback={false}
            />
        )

        expect(
            screen.queryByTestId(BVB_TEST_IDS.feedbackTextarea)
        ).not.toBeInTheDocument()

        const submitBtn = screen.getByTestId(BVB_TEST_IDS.feedbackSubmitBtn)
        expect(submitBtn).toBeEnabled()

        fireEvent.click(submitBtn)
        await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(''))
        expect(onClose).toHaveBeenCalled()
    })

    it('pressing space key on textarea adds a space to the feedback value', () => {
        const onSubmit = jest.fn()
        const onClose = jest.fn()

        render(
            <FeedbackModal open={true} onClose={onClose} onSubmit={onSubmit} />
        )

        const textarea = screen.getByTestId(
            BVB_TEST_IDS.feedbackTextarea
        ) as HTMLTextAreaElement
        expect(textarea.value).toBe('')

        fireEvent.keyDown(textarea, { key: ' ' })
        expect(textarea.value).toBe(' ')
    })

    it('renders the warning banner with the provided message when showWarning is true', () => {
        const onSubmit = jest.fn()
        const onClose = jest.fn()

        render(
            <FeedbackModal
                open={true}
                onClose={onClose}
                onSubmit={onSubmit}
                showWarning={true}
                warningMessage='Reviewer approval rate is below 75% (currently 50%). Please consider this before submitting your decision.'
            />
        )

        expect(
            screen.getByTestId(BVB_TEST_IDS.feedbackApprovalWarning)
        ).toHaveTextContent(/currently 50%/i)
    })

    it('does not render the warning banner by default', () => {
        const onSubmit = jest.fn()
        const onClose = jest.fn()

        render(
            <FeedbackModal open={true} onClose={onClose} onSubmit={onSubmit} />
        )

        expect(
            screen.queryByTestId(BVB_TEST_IDS.feedbackApprovalWarning)
        ).not.toBeInTheDocument()
    })

    it('renders decision text properly when decision prop provided', () => {
        const onSubmit = jest.fn()
        const onClose = jest.fn()

        render(
            <FeedbackModal
                open={true}
                onClose={onClose}
                onSubmit={onSubmit}
                decision={'APPROVED'}
            />
        )

        expect(
            screen.getByTestId(BVB_TEST_IDS.feedbackConfirmationText)
        ).toHaveTextContent(/you Approved with the content/i)
    })
})
