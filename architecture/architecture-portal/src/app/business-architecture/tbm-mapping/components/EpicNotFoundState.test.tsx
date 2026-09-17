import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { EpicNotFoundState } from './EpicNotFoundState'

jest.mock('@americanexpress/dls-icons', () => ({
    IconWarning: () => <span data-testid='icon-warning' />
}))

describe('EpicNotFoundState', () => {
    it('renders "Epic Not Found" heading', () => {
        render(<EpicNotFoundState epicId='EPIC-999' />)
        expect(screen.getByTestId('epic-not-found-heading')).toBeInTheDocument()
    })

    it('renders the epicId in the message', () => {
        render(<EpicNotFoundState epicId='EPIC-999' />)
        expect(screen.getByTestId('epic-not-found-message')).toHaveTextContent(
            'EPIC-999'
        )
    })

    it('renders the warning icon', () => {
        render(<EpicNotFoundState epicId='EPIC-999' />)
        expect(screen.getByTestId('icon-warning')).toBeInTheDocument()
    })
})
