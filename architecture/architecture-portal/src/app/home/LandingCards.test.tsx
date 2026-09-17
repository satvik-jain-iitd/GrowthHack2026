import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { LandingCards } from './LandingCards'

const mockPush = jest.fn()

jest.mock('@/hooks', () => ({
    useNavigation: jest.fn(() => ({ push: mockPush }))
}))

jest.mock('@/components/ui', () => ({
    NoPrefetchLink: ({
        children,
        ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
        <a {...props}>{children}</a>
    )
}))

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img {...props} />
    )
}))

describe('LandingCards', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('navigates to an internal route when a card is clicked', () => {
        render(<LandingCards />)

        fireEvent.click(screen.getByText('Initiatives'))

        expect(mockPush).toHaveBeenCalledWith('/initiatives')
    })

    it('opens a new window for external cards', () => {
        const openSpy = jest
            .spyOn(window, 'open')
            .mockImplementation(() => null)

        render(<LandingCards />)

        fireEvent.click(screen.getByText('Architecture Governance'))

        expect(openSpy).toHaveBeenCalledWith(
            'https://architecture.aexp.com/governance',
            '_blank',
            'noopener'
        )

        openSpy.mockRestore()
    })

    it('stops card click propagation when a nested link is clicked', () => {
        render(<LandingCards />)

        fireEvent.click(screen.getByRole('link', { name: 'View Initiatives' }))

        expect(mockPush).not.toHaveBeenCalled()
    })

    it('switches to filled icon on hover and resets on mouse leave', () => {
        render(<LandingCards />)

        const title = screen.getByText('Initiatives')

        expect(
            screen.queryByAltText('Initiatives filled icon')
        ).not.toBeInTheDocument()

        fireEvent.mouseEnter(title)
        expect(screen.getAllByAltText('Initiatives filled icon')).toHaveLength(
            2
        )

        fireEvent.mouseLeave(title)
        expect(
            screen.queryByAltText('Initiatives filled icon')
        ).not.toBeInTheDocument()
    })
})
