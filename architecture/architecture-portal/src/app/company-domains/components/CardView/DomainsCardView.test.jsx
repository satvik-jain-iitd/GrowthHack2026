import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DomainsCardView } from './DomainsCardView'
import { EARB_APPROVED_UUIDS } from '../../constants'
import { DOMAIN_TEST_IDS } from '../../test-ids'
import { render } from '@/test/utils/test-utils'

jest.mock('./DomainsCard', () => ({
    DomainsCard: jest.fn(props => {
        return (
            <div>
                <h5>{props.title}</h5>
                <p>{props.description}</p>
                {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                <a href={`/domains/${props.playbookId}`}>Link</a>
            </div>
        )
    })
}))

describe('DomainsCardView', () => {
    beforeEach(() => {
        EARB_APPROVED_UUIDS.add('approved-domain-id')
    })

    afterEach(() => {
        EARB_APPROVED_UUIDS.clear()
        jest.restoreAllMocks()
    })

    it('should render the component with the provided props', () => {
        const viewFilters = ['Category 1', 'Category 2']
        const domains = [
            {
                domain_category_nm: 'Category 1',
                domain_nm: 'Domain 1',
                im_light_tx: 'light-image-1',
                im_dark_tx: 'dark-image-1',
                im_fill_light_tx: 'filled-light-image-1',
                im_fill_dark_tx: 'filled-dark-image-1',
                cntrb_in: true,
                playbook_id: 'playbook-1',
                dmn_shrt_ds: 'Description 1',
                company_domain_id: 'approved-domain-id'
            },
            {
                domain_category_nm: 'Category 2',
                domain_nm: 'Domain 2',
                im_light_tx: 'light-image-2',
                im_dark_tx: 'dark-image-2',
                im_fill_light_tx: 'filled-light-image-2',
                im_fill_dark_tx: 'filled-dark-image-2',
                cntrb_in: false,
                playbook_id: 'playbook-2',
                dmn_shrt_ds: 'Description 2',
                company_domain_id: 'non-approved-domain-id'
            }
        ]

        render(
            <DomainsCardView
                viewFilters={viewFilters}
                domains={domains}
                isV1={true}
            />
        )
        const container = screen.getByTestId(DOMAIN_TEST_IDS.cardContainer)
        expect(container).toBeInTheDocument()
        expect(screen.getByText('Category 1')).toBeInTheDocument()
        expect(screen.getByText('Category 2')).toBeInTheDocument()
        expect(screen.getByText('Domain 1')).toBeInTheDocument()
        expect(screen.getByText('Description 1')).toBeInTheDocument()
        expect(screen.getByText('Domain 2')).toBeInTheDocument()
        expect(screen.getByText('Description 2')).toBeInTheDocument()
        expect(screen.getAllByText('Link')[0].closest('a')).toHaveAttribute(
            'href',
            '/domains/playbook-1'
        )
        expect(screen.getAllByText('Link')[1].closest('a')).toHaveAttribute(
            'href',
            '/domains/playbook-2'
        )
    })

    it('should not render a category if there are no domains in it', () => {
        const viewFilters = ['Category 1', 'Category 2']
        const domains = [
            {
                domain_category_nm: 'Category 1',
                domain_nm: 'Domain 1',
                im_light_tx: 'light-image-1',
                im_dark_tx: 'dark-image-1',
                im_fill_light_tx: 'filled-light-image-1',
                im_fill_dark_tx: 'filled-dark-image-1',
                cntrb_in: true,
                playbook_id: 'playbook-1',
                dmn_shrt_ds: 'Description 1',
                company_domain_id: 'approved-domain-id'
            }
        ]

        render(
            <DomainsCardView
                viewFilters={viewFilters}
                domains={domains}
                isV1={false}
            />
        )
        expect(screen.getByText('Category 1')).toBeInTheDocument()
        expect(screen.queryByText('Category 2')).not.toBeInTheDocument()
        expect(screen.getByText('Domain 1')).toBeInTheDocument()
        expect(screen.getByText('Description 1')).toBeInTheDocument()
    })

    it('should apply the correct margin based on the isV1 prop', () => {
        const viewFilters = ['Category 1']
        const domains = [
            {
                domain_category_nm: 'Category 1',
                domain_nm: 'Domain 1',
                im_light_tx: 'light-image-1',
                im_dark_tx: 'dark-image-1',
                im_fill_light_tx: 'filled-light-image-1',
                im_fill_dark_tx: 'filled-dark-image-1',
                cntrb_in: true,
                playbook_id: 'playbook-1',
                dmn_shrt_ds: 'Description 1',
                company_domain_id: 'approved-domain-id'
            }
        ]

        const { rerender } = render(
            <DomainsCardView
                viewFilters={viewFilters}
                domains={domains}
                isV1={true}
            />
        )
        const container = screen.getByTestId(DOMAIN_TEST_IDS.cardContainer)
        const className = container.className
        expect(className).toMatch(/css-/)
        rerender(
            <DomainsCardView
                viewFilters={viewFilters}
                domains={domains}
                isV1={false}
            />
        )
        const newClassName = container.className
        expect(newClassName).not.toBe(className)
    })
})
