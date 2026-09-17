import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import MetadataTags from './MetadataTags'

describe('MetadataTags', () => {
    it('renders an authoritative tag without recommendation styling', () => {
        const { container } = render(<MetadataTags label='US' />)
        expect(screen.getByText('US')).toBeInTheDocument()
        expect(container.querySelector('[data-recommended="true"]')).toBeNull()
        expect(container.querySelector('svg')).toBeNull()
    })

    it('marks a recommended tag and renders the AI icon', () => {
        const { container } = render(
            <MetadataTags label='GB' isRecommended={true} />
        )
        expect(
            container.querySelector('[data-recommended="true"]')
        ).not.toBeNull()
        expect(container.querySelector('svg')).not.toBeNull()
    })
})
