import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import { AdminHeader } from './AdminHeader'
import { ADMIN_TEST_IDS } from '@/app/admin/test-ids'

describe('AdminHeader', () => {
    it('renders the Admin heading', () => {
        render(<AdminHeader />)
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminHeading)
        ).toBeInTheDocument()
    })

    it('renders the description text', () => {
        render(<AdminHeader />)
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminHeaderDescription)
        ).toBeInTheDocument()
    })

    it('renders default title and description text when no props are passed', () => {
        render(<AdminHeader />)
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminHeading)
        ).toHaveTextContent('Admin')
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminHeaderDescription)
        ).toHaveTextContent(
            'Manage and restrict access and permissions across playbooks.'
        )
    })

    it('renders custom title and description when provided', () => {
        render(
            <AdminHeader
                title='Feature Management'
                description='View and manage feature flags and pilot groups.'
            />
        )
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminHeading)
        ).toHaveTextContent('Feature Management')
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminHeaderDescription)
        ).toHaveTextContent('View and manage feature flags and pilot groups.')
    })
})
