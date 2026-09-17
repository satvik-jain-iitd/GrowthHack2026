import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import SourcesSection from './SourcesSection'

describe('SourcesSection', () => {
    it('renders nothing when there are no sources', () => {
        const { container } = render(<SourcesSection sources={[]} />)
        expect(container.firstChild).toBeNull()
    })

    it('renders singular "source" text for a single source', () => {
        render(<SourcesSection sources={['https://example.com/docs/page']} />)
        expect(screen.getByText(/1 source/)).toBeInTheDocument()
    })

    it('renders plural "sources" text for multiple sources', () => {
        render(
            <SourcesSection
                sources={[
                    'https://example.com/docs/page-one',
                    'https://example.com/docs/page-two'
                ]}
            />
        )
        expect(screen.getByText(/2 sources/)).toBeInTheDocument()
    })

    it('renders a link per source using the last URL path segment as display name', () => {
        render(
            <SourcesSection sources={['https://example.com/docs/my-page/']} />
        )
        const link = screen.getByRole('link', {
            name: 'my-page',
            hidden: true
        })
        expect(link).toHaveAttribute(
            'href',
            'https://example.com/docs/my-page/'
        )
    })

    it('falls back to the hostname when the URL has no path segments', () => {
        render(<SourcesSection sources={['https://example.com/']} />)
        expect(
            screen.getByRole('link', { name: 'example.com', hidden: true })
        ).toBeInTheDocument()
    })

    it('falls back to the raw string when the source is not a valid URL', () => {
        render(<SourcesSection sources={['not-a-valid-url']} />)
        expect(
            screen.getByRole('link', {
                name: 'not-a-valid-url',
                hidden: true
            })
        ).toBeInTheDocument()
    })
})
