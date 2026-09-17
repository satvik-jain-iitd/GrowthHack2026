import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import { AdminContainer } from './AdminContainer'
import { ADMIN_TEST_IDS } from '@/app/admin/test-ids'

const mockFetchArchitecture = jest.fn()

jest.mock('@/utils/server', () => ({
    fetchArchitecture: (...args: unknown[]) => mockFetchArchitecture(...args)
}))

jest.mock('./AdminLayout', () => ({
    AdminLayout: ({ sidebar }: { sidebar: unknown[] }) => (
        <div
            data-testid='admin-layout'
            data-sidebar-length={sidebar?.length ?? 0}
        >
            Admin Layout
        </div>
    )
}))

jest.mock('@/constants', () => ({
    API_ENDPOINTS: { GET_ADMIN_SIDEBAR: '/arch-api/v1/admin/sidebar' },
    PLAYBOOK_TYPE_IDS: {
        INITIATIVE: 'initiative-id',
        COMPANY_DOMAIN: 'company-domain-id',
        COMPANY_SUBDOMAIN: 'company-subdomain-id',
        COMPANY_DOMAIN_CATEGORY: 'company-domain-category-id',
        FOUNDATIONAL_TECHNOLOGY: 'foundational-technology-id'
    }
}))

const makeMockResponse = (data: unknown) => ({
    json: jest.fn().mockResolvedValue({ data })
})

describe('AdminContainer', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders AdminLayout for "initiatives" category with correct sidebar data', async () => {
        const initiativeSidebar = [{ id: '1', title: 'Initiative 1' }]
        // 3 sidebar fetches: initiatives, company-domains, foundational-technologies
        mockFetchArchitecture
            .mockResolvedValueOnce(makeMockResponse(initiativeSidebar))
            .mockResolvedValueOnce(makeMockResponse([{ id: '2' }]))
            .mockResolvedValueOnce(makeMockResponse([{ id: '3' }]))

        const jsx = await AdminContainer({ playbookCategory: 'initiatives' })
        render(jsx)

        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminLayout)
        ).toBeInTheDocument()
        expect(screen.getByTestId(ADMIN_TEST_IDS.adminLayout)).toHaveAttribute(
            'data-sidebar-length',
            '1'
        )
    })

    it('renders AdminLayout for "company-domains" category with correct sidebar data', async () => {
        const companyDomainsSidebar = [{ id: 'a' }, { id: 'b' }]
        mockFetchArchitecture
            .mockResolvedValueOnce(makeMockResponse([{ id: '1' }]))
            .mockResolvedValueOnce(makeMockResponse(companyDomainsSidebar))
            .mockResolvedValueOnce(makeMockResponse([{ id: '3' }]))

        const jsx = await AdminContainer({
            playbookCategory: 'company-domains'
        })
        render(jsx)

        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminLayout)
        ).toBeInTheDocument()
        expect(screen.getByTestId(ADMIN_TEST_IDS.adminLayout)).toHaveAttribute(
            'data-sidebar-length',
            '2'
        )
    })

    it('renders AdminLayout for "foundational-technologies" category with correct sidebar data', async () => {
        const foundationalSidebar = [{ id: 'x' }, { id: 'y' }, { id: 'z' }]
        mockFetchArchitecture
            .mockResolvedValueOnce(makeMockResponse([]))
            .mockResolvedValueOnce(makeMockResponse([]))
            .mockResolvedValueOnce(makeMockResponse(foundationalSidebar))

        const jsx = await AdminContainer({
            playbookCategory: 'foundational-technologies'
        })
        render(jsx)

        expect(
            screen.getByTestId(ADMIN_TEST_IDS.adminLayout)
        ).toBeInTheDocument()
        expect(screen.getByTestId(ADMIN_TEST_IDS.adminLayout)).toHaveAttribute(
            'data-sidebar-length',
            '3'
        )
    })

    it('calls fetchArchitecture 3 times for every playbookCategory', async () => {
        mockFetchArchitecture.mockResolvedValue(makeMockResponse([]))

        await AdminContainer({ playbookCategory: 'initiatives' })

        expect(mockFetchArchitecture).toHaveBeenCalledTimes(3)
    })

    it('calls fetchArchitecture with the correct endpoint and request body for initiatives', async () => {
        mockFetchArchitecture.mockResolvedValue(makeMockResponse([]))

        await AdminContainer({ playbookCategory: 'initiatives' })

        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            '/arch-api/v1/admin/sidebar',
            expect.objectContaining({
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playbook_type_ids: ['initiative-id'] })
            })
        )
    })

    it('calls fetchArchitecture with correct body for company-domains (3 type ids)', async () => {
        mockFetchArchitecture.mockResolvedValue(makeMockResponse([]))

        await AdminContainer({ playbookCategory: 'company-domains' })

        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            '/arch-api/v1/admin/sidebar',
            expect.objectContaining({
                body: JSON.stringify({
                    playbook_type_ids: [
                        'company-domain-id',
                        'company-subdomain-id',
                        'company-domain-category-id'
                    ]
                })
            })
        )
    })

    it('calls fetchArchitecture with correct body for foundational-technologies', async () => {
        mockFetchArchitecture.mockResolvedValue(makeMockResponse([]))

        await AdminContainer({ playbookCategory: 'foundational-technologies' })

        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            '/arch-api/v1/admin/sidebar',
            expect.objectContaining({
                body: JSON.stringify({
                    playbook_type_ids: ['foundational-technology-id']
                })
            })
        )
    })
})
