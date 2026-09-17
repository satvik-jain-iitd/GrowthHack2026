import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { DomainMetrics } from './DomainMetrics'

jest.mock('@/components/icons', () => ({
    SubDomainsIcon: ({ color }: { color: string }) => (
        <span data-testid='subdomains-icon' data-color={color}>
            icon
        </span>
    )
}))

describe('DomainMetrics', () => {
    it('renders subdomains metric when subDomains is greater than zero', () => {
        render(<DomainMetrics subDomains={5} />)

        expect(screen.getByText('5')).toBeInTheDocument()
        expect(screen.getByText('SUBDOMAINS')).toBeInTheDocument()
        expect(screen.getByTestId('subdomains-icon')).toHaveAttribute(
            'data-color',
            '#61c5ff'
        )
    })

    it('does not render metric when subDomains is zero', () => {
        render(<DomainMetrics subDomains={0} />)

        expect(screen.queryByText('SUBDOMAINS')).not.toBeInTheDocument()
        expect(screen.queryByTestId('subdomains-icon')).not.toBeInTheDocument()
    })
})
