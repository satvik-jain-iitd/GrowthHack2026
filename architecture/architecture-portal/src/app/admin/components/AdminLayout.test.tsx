import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import { AdminLayout } from './AdminLayout'
import { AdminSidebarType } from './AdminSidebar'
import { ADMIN_TEST_IDS } from '@/app/admin/test-ids'

jest.mock('./AdminTabs', () => ({
    AdminTabs: () => <div data-testid='admin-tabs'>Admin Tabs</div>
}))

jest.mock('./AdminSidebar', () => ({
    AdminSidebar: ({
        isMobile
    }: {
        sidebar: AdminSidebarType[]
        isMobile?: boolean
    }) => (
        <div data-testid={isMobile ? 'admin-sidebar-mobile' : 'admin-sidebar'}>
            Admin Sidebar
        </div>
    )
}))

jest.mock('./AdminContent', () => ({
    AdminContent: () => <div data-testid='admin-content'>Admin Content</div>
}))

const mockSidebar: AdminSidebarType[] = [
    { playbook_id: '1', href: '/admin/item-1', label: 'Item 1', children: [] }
]

describe('AdminLayout', () => {
    it('renders AdminTabs', () => {
        render(<AdminLayout sidebar={mockSidebar} />)
        expect(screen.getByTestId(ADMIN_TEST_IDS.adminTabs)).toBeInTheDocument()
    })

    it('renders desktop AdminSidebar with sidebar prop', () => {
        render(<AdminLayout sidebar={mockSidebar} />)
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminSidebar)
        ).toBeInTheDocument()
    })

    it('renders mobile AdminSidebar with isMobile prop', () => {
        render(<AdminLayout sidebar={mockSidebar} />)
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminSidebarMobile)
        ).toBeInTheDocument()
    })

    it('renders AdminContent', () => {
        render(<AdminLayout sidebar={mockSidebar} />)
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminContent)
        ).toBeInTheDocument()
    })

    it('renders with an empty sidebar array', () => {
        render(<AdminLayout sidebar={[]} />)
        expect(screen.getByTestId(ADMIN_TEST_IDS.adminTabs)).toBeInTheDocument()
        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminContent)
        ).toBeInTheDocument()
    })
})
