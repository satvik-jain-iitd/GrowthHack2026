import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DomainsOwnerListView } from './DomainsOwnerListView'
import { render } from '@/test/utils/test-utils'
import {
    DOMAIN_TEST_IDS,
    DOMAIN_TEST_TEXT
} from '@/app/company-domains/test-ids'

jest.mock('@/hooks', () => ({
    useNavigation: jest.fn(() => ({
        push: jest.fn()
    }))
}))

jest.mock('@/components/ui', () => ({
    __esModule: true,
    AvatarTableRow: ({ user }) => (
        <div data-testid='avatar-row'>{user?.name || 'User'}</div>
    )
}))

const mockDomains = [
    {
        domain_nm: 'Domain A',
        domain_category_nm: 'Category A',
        unit_cio_nm: 'Unit CIO Name',
        tech_owner_nm: 'Tech Owner Name',
        head_engineer_nm: 'Head Engineer Name',
        principal_ea_architect_nm: 'Principal Architect Name',
        ea_architect_nm: 'Enterprise Architect Name',
        ea_architect_delegate_nm: 'Unit CIO Delegate',
        unit_cio_email_ad_da: [
            'cio1@example.com',
            'cio2@example.com',
            'cio3@example.com'
        ],
        tech_own_email_ad_da: ['tech@example.com'],
        head_engnr_email_ad_da: ['head@example.com'],
        princ_ea_archt_email_ad_da: ['princ@example.com'],
        ea_archt_email_ad_da: ['Open'],
        playbook_id: 'playbook1',
        im_light_tx: 'light.png',
        im_dark_tx: 'dark.png',
        im_fill_light_tx: 'fill-light.png',
        im_fill_dark_tx: 'fill-dark.png'
    },
    {
        domain_nm: 'Domain B',
        domain_category_nm: 'Category B',
        unit_cio_nm: 'Unit CIO Name',
        tech_owner_nm: 'Tech Owner Name',
        head_engineer_nm: 'Head Engineer Name',
        principal_ea_architect_nm: 'Principal Architect Name',
        ea_architect_nm: 'Enterprise Architect Name',
        ea_architect_delegate_nm: 'Unit CIO Delegate',
        unit_cio_email_ad_da: [
            'cio1@example.com',
            'cio2@example.com',
            'cio3@example.com'
        ],
        tech_own_email_ad_da: ['tech@example.com'],
        head_engnr_email_ad_da: ['head@example.com'],
        princ_ea_archt_email_ad_da: ['princ@example.com'],
        ea_archt_email_ad_da: ['Open'],
        playbook_id: 'playbook1',
        im_light_tx: 'light.png',
        im_dark_tx: 'dark.png',
        im_fill_light_tx: 'fill-light.png',
        im_fill_dark_tx: 'fill-dark.png'
    },
    {
        domain_nm: 'Domain C',
        domain_category_nm: 'Category C',
        unit_cio_nm: 'Unit CIO Name',
        tech_owner_nm: 'Tech Owner Name',
        head_engineer_nm: 'Head Engineer Name',
        principal_ea_architect_nm: 'Principal Architect Name',
        ea_architect_nm: 'Enterprise Architect Name',
        ea_architect_delegate_nm: 'Unit CIO Delegate',
        unit_cio_email_ad_da: [
            'cio1@example.com',
            'cio2@example.com',
            'cio3@example.com'
        ],
        tech_own_email_ad_da: ['tech@example.com'],
        head_engnr_email_ad_da: ['head@example.com'],
        princ_ea_archt_email_ad_da: ['princ@example.com'],
        ea_archt_email_ad_da: ['Open'],
        playbook_id: 'playbook1',
        im_light_tx: 'light.png',
        im_dark_tx: 'dark.png',
        im_fill_light_tx: 'fill-light.png',
        im_fill_dark_tx: 'fill-dark.png'
    }
]
describe('DomainsOwnerListView', () => {
    it('renders all headers correctly', () => {
        render(<DomainsOwnerListView domains={mockDomains} />)
        ;[
            DOMAIN_TEST_TEXT.colDomains,
            DOMAIN_TEST_TEXT.colCategory,
            DOMAIN_TEST_TEXT.colUnitCIO,
            DOMAIN_TEST_TEXT.colTechOwner,
            DOMAIN_TEST_TEXT.colHeadEngineer,
            DOMAIN_TEST_TEXT.colPrincipalArchitect,
            DOMAIN_TEST_TEXT.colEnterpriseArchitect,
            DOMAIN_TEST_TEXT.colUnitCIODelegate
        ].forEach(header => {
            expect(screen.getByText(header)).toBeInTheDocument()
        })
    })
    it('renders with empty domains', () => {
        render(<DomainsOwnerListView domains={[]} />)
        expect(screen.queryByText('Domain A')).not.toBeInTheDocument()
    })
    it('triggers sorting and compares values correctly', () => {
        render(<DomainsOwnerListView domains={mockDomains} />)
        const domainHeader = screen.getByText(DOMAIN_TEST_TEXT.colDomains)
        fireEvent.click(domainHeader)
        fireEvent.click(domainHeader)
        expect(
            screen.getAllByTestId(DOMAIN_TEST_IDS.ownerTableItemTitle)[0]
        ).toHaveTextContent('Domain C')
    })

    it('Table.ColumnHeader onClick should handle sorting in ascending order', () => {
        render(<DomainsOwnerListView domains={mockDomains} />)
        const domainsHeader = screen.getByText(DOMAIN_TEST_TEXT.colDomains)

        fireEvent.click(domainsHeader)

        const rows = screen.getAllByTestId(DOMAIN_TEST_IDS.ownerTableItemTitle)
        expect(rows[0]).toHaveTextContent('Domain A')
        expect(rows[1]).toHaveTextContent('Domain B')
        expect(rows[2]).toHaveTextContent('Domain C')
    })

    it('Table.ColumnHeader onClick should toggle sorting from ascending to descending', () => {
        render(<DomainsOwnerListView domains={mockDomains} />)
        const domainsHeader = screen.getByText(DOMAIN_TEST_TEXT.colDomains)

        fireEvent.click(domainsHeader)
        let rows = screen.getAllByTestId(DOMAIN_TEST_IDS.ownerTableItemTitle)
        expect(rows[0]).toHaveTextContent('Domain A')

        fireEvent.click(domainsHeader)
        rows = screen.getAllByTestId(DOMAIN_TEST_IDS.ownerTableItemTitle)
        expect(rows[0]).toHaveTextContent('Domain C')
        expect(rows[2]).toHaveTextContent('Domain A')
    })

    it('Table.ColumnHeader onClick should sort by category column', () => {
        render(<DomainsOwnerListView domains={mockDomains} />)
        const categoryHeader = screen.getByText(DOMAIN_TEST_TEXT.colCategory)

        fireEvent.click(categoryHeader)

        const rows = screen.getAllByTestId(DOMAIN_TEST_IDS.ownerTableItemTitle)
        expect(rows).toHaveLength(3)
    })

    it('does not crash when domains is undefined and a column header is clicked', () => {
        render(<DomainsOwnerListView domains={undefined} />)
        const domainHeader = screen.getByText(DOMAIN_TEST_TEXT.colDomains)
        fireEvent.click(domainHeader)
        // No rows rendered, no error thrown
        expect(
            screen.queryAllByTestId(DOMAIN_TEST_IDS.ownerTableItemTitle)
        ).toHaveLength(0)
    })

    it('handles sorting by a column with an empty array value', () => {
        const domainsWithEmptyArray = [
            { ...mockDomains[0], ea_archt_email_ad_da: [] },
            { ...mockDomains[1] }
        ]
        render(<DomainsOwnerListView domains={domainsWithEmptyArray} />)
        const eaHeader = screen.getByText(
            DOMAIN_TEST_TEXT.colEnterpriseArchitect
        )
        fireEvent.click(eaHeader)
        const rows = screen.getAllByTestId(DOMAIN_TEST_IDS.ownerTableItemTitle)
        expect(rows).toHaveLength(2)
    })

    it('handles sorting by a column with a null string value', () => {
        const domainsWithNull = [
            { ...mockDomains[0], unit_cio_nm: null },
            { ...mockDomains[1] }
        ]
        render(<DomainsOwnerListView domains={domainsWithNull} />)
        const unitCIOHeader = screen.getByText(DOMAIN_TEST_TEXT.colUnitCIO)
        fireEvent.click(unitCIOHeader)
        const rows = screen.getAllByTestId(DOMAIN_TEST_IDS.ownerTableItemTitle)
        expect(rows).toHaveLength(2)
    })
})
