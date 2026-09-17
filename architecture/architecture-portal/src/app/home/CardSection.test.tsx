import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import CardSection from './CardSection'
import { usePlaybooks } from '@/hooks'
import { PLAYBOOK_TYPE_IDS } from '@/constants'

jest.mock('@/hooks', () => ({
    usePlaybooks: jest.fn()
}))

jest.mock('@/app/home/LandingCards', () => ({
    LandingCards: () => <div data-testid='landing-cards'>LandingCards</div>
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

const mockUsePlaybooks = usePlaybooks as jest.Mock

describe('CardSection', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders landing cards and sidebar sections', () => {
        mockUsePlaybooks.mockReturnValue({ playbooks: [] })

        render(<CardSection />)

        expect(screen.getByTestId('landing-cards')).toBeInTheDocument()
        expect(screen.getByText('Trending Initiatives')).toBeInTheDocument()
        expect(screen.getByText('Important Links')).toBeInTheDocument()
        expect(screen.getByText("What's New")).toBeInTheDocument()
    })

    it('renders sorted top 4 trending initiative links only', () => {
        mockUsePlaybooks.mockReturnValue({
            playbooks: [
                {
                    playbook_id: '3',
                    playbook_nm: 'Initiative 3',
                    playbook_type_id: PLAYBOOK_TYPE_IDS.INITIATIVE,
                    add_da: { trendingNumber: 3 }
                },
                {
                    playbook_id: '1',
                    playbook_nm: 'Initiative 1',
                    playbook_type_id: PLAYBOOK_TYPE_IDS.INITIATIVE,
                    add_da: { trendingNumber: 1 }
                },
                {
                    playbook_id: '2',
                    playbook_nm: 'Initiative 2',
                    playbook_type_id: PLAYBOOK_TYPE_IDS.INITIATIVE,
                    add_da: { trendingNumber: 2 }
                },
                {
                    playbook_id: '4',
                    playbook_nm: 'Initiative 4',
                    playbook_type_id: PLAYBOOK_TYPE_IDS.INITIATIVE,
                    add_da: { trendingNumber: 4 }
                },
                {
                    playbook_id: '5',
                    playbook_nm: 'Initiative 5',
                    playbook_type_id: PLAYBOOK_TYPE_IDS.INITIATIVE,
                    add_da: { trendingNumber: 5 }
                },
                {
                    playbook_id: 'x',
                    playbook_nm: 'Not Trending',
                    playbook_type_id: PLAYBOOK_TYPE_IDS.INITIATIVE,
                    add_da: {}
                },
                {
                    playbook_id: 'y',
                    playbook_nm: 'Wrong Type',
                    playbook_type_id: PLAYBOOK_TYPE_IDS.ADR,
                    add_da: { trendingNumber: 0 }
                }
            ]
        })

        render(<CardSection />)

        expect(
            screen.getByRole('link', { name: 'Initiative 1' })
        ).toHaveAttribute('href', '/docs/1')
        expect(
            screen.getByRole('link', { name: 'Initiative 2' })
        ).toHaveAttribute('href', '/docs/2')
        expect(
            screen.getByRole('link', { name: 'Initiative 3' })
        ).toHaveAttribute('href', '/docs/3')
        expect(
            screen.getByRole('link', { name: 'Initiative 4' })
        ).toHaveAttribute('href', '/docs/4')
        expect(
            screen.queryByRole('link', { name: 'Initiative 5' })
        ).not.toBeInTheDocument()
        expect(screen.queryByText('Not Trending')).not.toBeInTheDocument()
        expect(screen.queryByText('Wrong Type')).not.toBeInTheDocument()
    })

    it('renders external links with a blank target', () => {
        mockUsePlaybooks.mockReturnValue({ playbooks: [] })

        render(<CardSection />)

        expect(
            screen.getByRole('link', {
                name: 'TECH05.10 ETP/ECMI Playbook Adoption'
            })
        ).toHaveAttribute('target', '_blank')
    })
})
