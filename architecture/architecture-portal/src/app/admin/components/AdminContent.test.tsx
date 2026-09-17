import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import { AdminContent } from './AdminContent'
import { ADMIN_TEST_IDS } from '@/app/admin/test-ids'

const mockUseAdminContext = jest.fn()

jest.mock('@/context', () => ({
    useAdminContext: () => mockUseAdminContext()
}))

jest.mock('./AdminUsers', () => ({
    AdminUsers: () => <div data-testid='admin-users'>Admin Users</div>
}))

describe('AdminContent', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the playbook name when selectedPlaybook is set', () => {
        mockUseAdminContext.mockReturnValue({
            selectedPlaybook: { playbook_id: '1', playbook_nm: 'My Playbook' },
            selectedType: 'Initiative'
        })

        render(<AdminContent />)

        const playbookName = screen.getByTestId(ADMIN_TEST_IDS.playbookName)
        expect(playbookName).toHaveTextContent('My Playbook')
    })

    it('renders the selectedType in the description', () => {
        mockUseAdminContext.mockReturnValue({
            selectedPlaybook: { playbook_id: '1', playbook_nm: 'My Playbook' },
            selectedType: 'Initiative'
        })

        render(<AdminContent />)

        const description = screen.getByTestId(
            ADMIN_TEST_IDS.contentDescription
        )
        expect(description).toHaveTextContent(
            /Use the table below to add and remove Owners\/SMEs for the above/
        )
        expect(description).toHaveTextContent(/Initiative/)
    })

    it('renders AdminUsers component', () => {
        mockUseAdminContext.mockReturnValue({
            selectedPlaybook: { playbook_id: '1', playbook_nm: 'Test' },
            selectedType: 'Domain'
        })

        render(<AdminContent />)

        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminUsers)
        ).toBeInTheDocument()
    })

    it('renders nothing for playbook name when selectedPlaybook is undefined', () => {
        mockUseAdminContext.mockReturnValue({
            selectedPlaybook: undefined,
            selectedType: 'Domain'
        })

        render(<AdminContent />)

        const playbookName = screen.getByTestId(ADMIN_TEST_IDS.playbookName)
        expect(playbookName).toBeEmptyDOMElement()
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminUsers)
        ).toBeInTheDocument()
    })

    it('renders correctly when adminContext is nullish (optional chaining guard)', () => {
        mockUseAdminContext.mockReturnValue(undefined)

        render(<AdminContent />)

        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminUsers)
        ).toBeInTheDocument()
    })
})
