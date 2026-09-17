import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@/test/utils/test-utils'
import SlackHelpButton from './SlackHelpButton'

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img {...props} alt={props.alt || ''} />
    )
}))

jest.mock('@/components/ui', () => ({
    NoPrefetchLink: ({
        href,
        children,
        ...props
    }: {
        href: string
        children: React.ReactNode
        [key: string]: unknown
    }) => (
        // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
        <a href={href} {...props}>
            {children}
        </a>
    )
}))

describe('SlackHelpButton', () => {
    const baseProps = {
        href: 'https://aexp.enterprise.slack.com/archives/C0B4G48Q96J',
        label: 'Need Help?',
        iconSrc: '/slack-icon-size_256.png',
        iconAlt: 'Slack'
    }

    it('renders the provided label and icon', () => {
        render(<SlackHelpButton {...baseProps} />)

        expect(screen.getByText('Need Help?')).toBeInTheDocument()
        expect(screen.getByAltText('Slack')).toBeInTheDocument()
    })

    it('renders the link with default target and rel attributes', () => {
        render(<SlackHelpButton {...baseProps} />)

        const helpLink = screen.getByRole('link', { name: /need help\?/i })
        expect(helpLink).toHaveAttribute(
            'href',
            'https://aexp.enterprise.slack.com/archives/C0B4G48Q96J'
        )
        expect(helpLink).toHaveAttribute('target', '_blank')
        expect(helpLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('uses default icon dimensions when width and height are omitted', () => {
        render(<SlackHelpButton {...baseProps} />)

        const icon = screen.getByAltText('Slack')
        expect(icon).toHaveAttribute('width', '24')
        expect(icon).toHaveAttribute('height', '24')
    })

    it('honors custom target, rel, and icon dimensions', () => {
        render(
            <SlackHelpButton
                {...baseProps}
                target='_self'
                rel='noreferrer'
                iconWidth={32}
                iconHeight={20}
            />
        )

        const helpLink = screen.getByRole('link', { name: /need help\?/i })
        const icon = screen.getByAltText('Slack')

        expect(helpLink).toHaveAttribute('target', '_self')
        expect(helpLink).toHaveAttribute('rel', 'noreferrer')
        expect(icon).toHaveAttribute('width', '32')
        expect(icon).toHaveAttribute('height', '20')
    })
})
