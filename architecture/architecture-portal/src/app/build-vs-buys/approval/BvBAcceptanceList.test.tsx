import React from 'react'
import '@testing-library/jest-dom'
import { NavigationProvider } from '@/context'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { BVB_TEST_TEXT, BVB_TEST_ROLE } from '@/app/build-vs-buys/test-data'

// Mock the useGetBvBPlaybooks hook
const mockUseGetBvBPlaybooks = jest.fn()
jest.mock('@/app/resources/bvb-tracker/hooks/useGetBvBPlaybooks', () => ({
    useGetBvBPlaybooks: (...args: unknown[]) =>
        // forward args into mock for easier assertions if needed
        mockUseGetBvBPlaybooks(...(args as unknown[]))
}))

import BvBAcceptancePage from './BvBAcceptanceList'

describe('BvBAcceptanceList', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('shows loading while the playbooks are being fetched', () => {
        mockUseGetBvBPlaybooks.mockReturnValue({
            playbooks: [],
            loading: true,
            error: null
        })

        render(
            <NavigationProvider>
                <BvBAcceptancePage />
            </NavigationProvider>
        )

        expect(screen.getByText(BVB_TEST_TEXT.loading)).toBeInTheDocument()
    })

    it('renders playbooks with name, formatted date and Pending badge', () => {
        mockUseGetBvBPlaybooks.mockReturnValue({
            playbooks: [
                {
                    playbook_id: 'p1',
                    playbook_nm: 'Playbook One',
                    creat_ts: '2020-01-15'
                },
                {
                    playbook_id: 'p2',
                    playbook_nm: 'Playbook Two',
                    creat_ts: '2021-12-31'
                }
            ],
            loading: false,
            error: null
        })

        render(
            <NavigationProvider>
                <BvBAcceptancePage />
            </NavigationProvider>
        )

        // Names
        expect(screen.getByText('Playbook One')).toBeInTheDocument()
        expect(screen.getByText('Playbook Two')).toBeInTheDocument()

        // Formatted dates (MM/DD/YYYY)
        expect(screen.getByText('01/15/2020')).toBeInTheDocument()
        expect(screen.getByText('12/31/2021')).toBeInTheDocument()

        // Pending badge (at least once)
        expect(
            screen.getAllByText(BVB_TEST_TEXT.pending).length
        ).toBeGreaterThanOrEqual(1)

        // Links: ensure the playbook name is a link with the expected href
        const linkOne = screen.getByRole(BVB_TEST_ROLE.link, {
            name: 'Playbook One'
        })
        expect(linkOne).toHaveAttribute('href', 'approval/p1')

        const linkTwo = screen.getByRole(BVB_TEST_ROLE.link, {
            name: 'Playbook Two'
        })
        expect(linkTwo).toHaveAttribute('href', 'approval/p2')
    })

    it('renders nothing when there are no playbooks (empty list)', () => {
        mockUseGetBvBPlaybooks.mockReturnValue({
            playbooks: [],
            loading: false,
            error: null
        })

        render(
            <NavigationProvider>
                <BvBAcceptancePage />
            </NavigationProvider>
        )

        // Header should still be present
        expect(screen.getByText('BvB Acceptance List')).toBeInTheDocument()
        // No playbook entries rendered
        // We expect no links for playbooks
        const links = screen.queryAllByRole('link')
        // There might be other links in the test wrapper; ensure none of them match playbook names
        expect(
            links.filter(
                l => l.textContent && l.textContent.includes('Playbook')
            ).length
        ).toBe(0)
    })
})
