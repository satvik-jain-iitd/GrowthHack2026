import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import { AdminTabs } from './AdminTabs'
import { ADMIN_TEST_IDS } from '@/app/admin/test-ids'

const mockPush = jest.fn()
const mockUseAdminContext = jest.fn()

jest.mock('@/hooks', () => ({
    useNavigation: jest.fn(() => ({ push: mockPush }))
}))

jest.mock('@/context', () => ({
    useAdminContext: () => mockUseAdminContext()
}))

describe('AdminTabs', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockUseAdminContext.mockReturnValue({ selectedType: undefined })
    })

    it('renders all three tab buttons', () => {
        render(<AdminTabs />)
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminTabBtn('initiatives'))
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminTabBtn('company-domains'))
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(
                ADMIN_TEST_IDS.adminTabBtn('foundational-technologies')
            )
        ).toBeInTheDocument()
    })

    it('clicking a tab navigates to the correct route', () => {
        render(<AdminTabs />)
        fireEvent.click(
            screen.getByTestId(ADMIN_TEST_IDS.adminTabBtn('company-domains'))
        )
        expect(mockPush).toHaveBeenCalledWith('/admin/company-domains')
    })

    it('clicking each tab navigates to its route', () => {
        render(<AdminTabs />)
        fireEvent.click(
            screen.getByTestId(ADMIN_TEST_IDS.adminTabBtn('initiatives'))
        )
        expect(mockPush).toHaveBeenCalledWith('/admin/initiatives')

        fireEvent.click(
            screen.getByTestId(
                ADMIN_TEST_IDS.adminTabBtn('foundational-technologies')
            )
        )
        expect(mockPush).toHaveBeenCalledWith(
            '/admin/foundational-technologies'
        )
    })

    it('defaults to "initiatives" tab when selectedType is undefined', () => {
        mockUseAdminContext.mockReturnValue({ selectedType: undefined })
        render(<AdminTabs />)
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminTabBtn('initiatives'))
        ).toBeInTheDocument()
    })

    it('uses selectedType from context as initial active tab', () => {
        mockUseAdminContext.mockReturnValue({ selectedType: 'company-domains' })
        render(<AdminTabs />)
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminTabBtn('company-domains'))
        ).toBeInTheDocument()
    })

    it('updates active tab when selectedType changes via useEffect', () => {
        mockUseAdminContext.mockReturnValue({
            selectedType: 'foundational-technologies'
        })
        render(<AdminTabs />)
        expect(
            screen.getByTestId(
                ADMIN_TEST_IDS.adminTabBtn('foundational-technologies')
            )
        ).toBeInTheDocument()
    })

    it('handles nullish adminContext gracefully (optional chaining)', () => {
        mockUseAdminContext.mockReturnValue(undefined)
        render(<AdminTabs />)
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminTabBtn('initiatives'))
        ).toBeInTheDocument()
    })

    it('clicking a tab updates the active value and re-clicks work', () => {
        render(<AdminTabs />)
        fireEvent.click(
            screen.getByTestId(ADMIN_TEST_IDS.adminTabBtn('company-domains'))
        )
        expect(mockPush).toHaveBeenCalledWith('/admin/company-domains')

        fireEvent.click(
            screen.getByTestId(ADMIN_TEST_IDS.adminTabBtn('company-domains'))
        )
        expect(mockPush).toHaveBeenCalledTimes(2)
    })
})
