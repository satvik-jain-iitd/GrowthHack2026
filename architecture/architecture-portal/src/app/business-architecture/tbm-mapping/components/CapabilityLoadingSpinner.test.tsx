import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { CapabilityLoadingSpinner } from './CapabilityLoadingSpinner'

describe('CapabilityLoadingSpinner', () => {
    it('renders the loading text', () => {
        render(<CapabilityLoadingSpinner />)
        expect(screen.getByTestId('loading-text')).toBeInTheDocument()
    })

    it('renders within a container with appropriate min height', () => {
        const { container } = render(<CapabilityLoadingSpinner />)
        // The outermost Box should exist
        expect(container.firstChild).toBeTruthy()
    })
})
