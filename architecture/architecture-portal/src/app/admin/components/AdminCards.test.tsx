import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import { AdminCards } from './AdminCards'
import { ADMIN_TEST_IDS } from '@/app/admin/test-ids'

const mockPush = jest.fn()

jest.mock('@/hooks', () => ({
    useNavigation: jest.fn(() => ({ push: mockPush }))
}))

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img {...props} />
    )
}))

jest.mock('../constants/adminTabs', () => ({
    adminTabs: [
        {
            title: 'Initiatives',
            id: 'Initiatives',
            imgSrc: '/admin/initiatives_icon.png',
            filledImgSrc: '/admin/Initiatives_iconfilled.png',
            darkImgSrc: '/admin/DarkInitiatives_icon.png',
            darkFilledImgSrc: '/admin/DarkInitiatives_iconfilled.png',
            link: '/admin/initiatives',
            description: 'Initiatives description.'
        },
        {
            title: 'Company Domains',
            id: 'CompanyDomains',
            imgSrc: '/admin/PlatformsLogo.png',
            filledImgSrc: '/admin/domain_fillicon.png',
            darkImgSrc: '/admin/darkdomain_icon.png',
            darkFilledImgSrc: '/admin/darkdomain_fillicon.png',
            link: '/admin/company-domains',
            description: 'Company Domains description.'
        }
    ]
}))

const getCard = (index: number) =>
    screen.getAllByTestId(ADMIN_TEST_IDS.cardDescription)[index].parentElement!

describe('AdminCards', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders all card titles', () => {
        render(<AdminCards />)
        const titles = screen.getAllByTestId(ADMIN_TEST_IDS.cardTitle)
        expect(titles).toHaveLength(2)
    })

    it('renders all card descriptions', () => {
        render(<AdminCards />)
        const descriptions = screen.getAllByTestId(
            ADMIN_TEST_IDS.cardDescription
        )
        expect(descriptions).toHaveLength(2)
    })

    it('renders unfilled icons by default', () => {
        render(<AdminCards />)
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.cardImage(0, 'dark'))
        ).toHaveAttribute('src', '/admin/DarkInitiatives_icon.png')
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.cardImage(0, 'light'))
        ).toHaveAttribute('src', '/admin/initiatives_icon.png')
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.cardImage(1, 'dark'))
        ).toHaveAttribute('src', '/admin/darkdomain_icon.png')
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.cardImage(1, 'light'))
        ).toHaveAttribute('src', '/admin/PlatformsLogo.png')
    })

    it('shows filled icons on mouse enter', () => {
        render(<AdminCards />)
        const card = getCard(0)
        fireEvent.mouseEnter(card)

        expect(
            screen.getByTestId(ADMIN_TEST_IDS.cardImage(0, 'dark-filled'))
        ).toHaveAttribute('src', '/admin/DarkInitiatives_iconfilled.png')
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.cardImage(0, 'light-filled'))
        ).toHaveAttribute('src', '/admin/Initiatives_iconfilled.png')
    })

    it('reverts to unfilled icons on mouse leave', () => {
        render(<AdminCards />)
        const card = getCard(0)
        fireEvent.mouseEnter(card)
        fireEvent.mouseLeave(card)

        expect(
            screen.getByTestId(ADMIN_TEST_IDS.cardImage(0, 'dark'))
        ).toHaveAttribute('src', '/admin/DarkInitiatives_icon.png')
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.cardImage(0, 'light'))
        ).toHaveAttribute('src', '/admin/initiatives_icon.png')
    })

    it('navigates to the correct link when a card is clicked', () => {
        render(<AdminCards />)
        fireEvent.click(getCard(0))
        expect(mockPush).toHaveBeenCalledWith('/admin/initiatives')
    })

    it('navigates to company-domains link when second card is clicked', () => {
        render(<AdminCards />)
        fireEvent.click(getCard(1))
        expect(mockPush).toHaveBeenCalledWith('/admin/company-domains')
    })

    it('only fills the hovered card and leaves other card unfilled', () => {
        render(<AdminCards />)

        fireEvent.mouseEnter(getCard(0))
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.cardImage(0, 'dark-filled'))
        ).toHaveAttribute('src', '/admin/DarkInitiatives_iconfilled.png')
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.cardImage(1, 'light'))
        ).toHaveAttribute('src', '/admin/PlatformsLogo.png')

        fireEvent.mouseEnter(getCard(1))
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.cardImage(1, 'dark-filled'))
        ).toHaveAttribute('src', '/admin/darkdomain_fillicon.png')
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.cardImage(0, 'light'))
        ).toHaveAttribute('src', '/admin/initiatives_icon.png')
    })
})
