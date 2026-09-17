import React from 'react'
import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@/test/utils/test-utils'
import userEvent from '@testing-library/user-event'
import { AccessRequired } from './AccessRequired'
import {
    ARCH_PORTAL_ENTITLEMENT,
    ARCH_PORTAL_HELP_SLACK_URL
} from '@/constants'

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img {...props} alt={props.alt || ''} />
    )
}))

jest.mock('@/context', () => ({
    useNavigationContext: () => ({ startNavigation: jest.fn() })
}))

const writeText = jest.fn().mockResolvedValue(undefined)

// jsdom has no clipboard, and userEvent.setup() installs a getter-only stub of
// its own without restoring ours, so redefine it before every test.
const stubClipboard = () =>
    Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true
    })

describe('AccessRequired', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        stubClipboard()
    })

    it('renders the portal logo', () => {
        render(<AccessRequired />)

        expect(
            screen.getByAltText('Architecture Portal Logo')
        ).toBeInTheDocument()
    })

    it('explains that additional authorization is required', () => {
        render(<AccessRequired />)

        expect(screen.getByTestId('access-required-heading')).toHaveTextContent(
            'Access to the Architecture Portal requires additional authorization.'
        )
    })

    it('renders the body copy, entitlement name and help line', () => {
        render(<AccessRequired />)

        expect(
            screen.getByText(
                /Please submit an access request through IIQ for the required entitlement/i
            )
        ).toBeInTheDocument()
        expect(screen.getByText('Access to request')).toBeInTheDocument()
        expect(
            screen.getByTestId('access-required-entitlement')
        ).toHaveTextContent(ARCH_PORTAL_ENTITLEMENT)
        expect(screen.getByText(/Need help\? Visit/i)).toBeInTheDocument()
        expect(
            screen.getByTestId('access-required-slack-link')
        ).toHaveAttribute('href', ARCH_PORTAL_HELP_SLACK_URL)
    })

    // The reload itself is not asserted: jsdom defines window.location as
    // non-configurable, so it cannot be spied on or replaced.
    it('offers a sign in again action', () => {
        render(<AccessRequired />)

        expect(screen.getByTestId('access-required-signin')).toHaveTextContent(
            'sign in again'
        )
    })

    it('keeps the explanation collapsed until the trigger is clicked', async () => {
        render(<AccessRequired />)

        const trigger = screen.getByTestId('access-required-why-trigger')
        expect(trigger).toHaveAttribute('aria-expanded', 'false')

        await userEvent.setup().click(trigger)

        expect(trigger).toHaveAttribute('aria-expanded', 'true')
        expect(
            screen.getByTestId('access-required-why-content')
        ).toHaveTextContent(
            /compliance with American Express Data .* based on the/i
        )
    })

    it('copies the entitlement and swaps the icon to the copied state', async () => {
        render(<AccessRequired />)

        expect(screen.getByTestId('icon-copy')).toBeInTheDocument()

        await act(async () => {
            fireEvent.click(screen.getByTestId('access-required-copy'))
        })

        expect(writeText).toHaveBeenCalledWith(ARCH_PORTAL_ENTITLEMENT)
        expect(screen.getByTestId('icon-check')).toBeInTheDocument()
    })
})
