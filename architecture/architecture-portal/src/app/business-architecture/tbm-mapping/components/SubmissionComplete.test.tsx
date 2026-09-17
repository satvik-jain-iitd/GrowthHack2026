import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { SubmissionComplete } from './SubmissionComplete'

jest.mock('@americanexpress/dls-icons', () => ({
    IconCheck: () => <span data-testid='icon-check' />
}))

describe('SubmissionComplete', () => {
    it('renders "Submission Complete" heading', () => {
        render(<SubmissionComplete />)
        expect(
            screen.getByTestId('submission-complete-heading')
        ).toBeInTheDocument()
    })

    it('renders a success message mentioning Apptio', () => {
        render(<SubmissionComplete />)
        expect(
            screen.getByTestId('submission-complete-message')
        ).toBeInTheDocument()
    })

    it('renders the check icon', () => {
        render(<SubmissionComplete />)
        expect(screen.getByTestId('icon-check')).toBeInTheDocument()
    })
})
