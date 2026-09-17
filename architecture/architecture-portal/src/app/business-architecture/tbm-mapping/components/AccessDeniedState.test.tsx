import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { AccessDeniedState } from './AccessDeniedState'

describe('AccessDeniedState', () => {
    it('renders the access denied heading', () => {
        render(<AccessDeniedState />)
        expect(screen.getByTestId('access-denied-heading')).toBeInTheDocument()
    })

    it('renders the access denied message', () => {
        render(<AccessDeniedState />)
        expect(screen.getByTestId('access-denied-message')).toBeInTheDocument()
    })
})
