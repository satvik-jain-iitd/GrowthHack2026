import '@testing-library/jest-dom'
import React from 'react'
import { screen } from '@testing-library/react'
import { DomainsCard } from './DomainsCard'
import { VERSION_1_DOMAINS_UUIDS } from '../../constants'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/test-utils'

jest.mock('../DomainStatusBadge', () => ({
    DomainStatusBadge: jest.fn(() => (
        <div>
            <p>{`No Contribution: false`}</p>
            <p>{`Last Updated: 2023-01-01T00:00:00Z`}</p>
            <p>{`Page Views: 123`}</p>
        </div>
    ))
}))

const mockPush = jest.fn()
jest.mock('@/hooks', () => ({
    useNavigation: jest.fn(() => ({
        push: mockPush
    }))
}))

describe('DomainsCard', () => {
    beforeEach(() => {
        VERSION_1_DOMAINS_UUIDS.add('test-domain-id')
    })

    afterEach(() => {
        VERSION_1_DOMAINS_UUIDS.clear()
    })

    it('should render the component with the provided props', () => {
        render(
            <DomainsCard
                title='Test Title'
                imgSrcLM='light-mode-image'
                imgSrcDM='dark-mode-image'
                imgSrcFilledLM='filled-light-mode-image'
                imgSrcFilledDM='filled-dark-mode-image'
                noContributions={false}
                description='Test Description'
                domainId='test-domain-id'
                playbookId='test-playbook-id'
                EARBApproved={true}
            />
        )
        expect(screen.getByText('Test Title')).toBeInTheDocument()
        expect(screen.getByText('Test Description')).toBeInTheDocument()
        expect(screen.getByText('No Contribution: false')).toBeInTheDocument()
        expect(
            screen.getByText('Last Updated: 2023-01-01T00:00:00Z')
        ).toBeInTheDocument()
        expect(screen.getByText('Page Views: 123')).toBeInTheDocument()
    })

    it('should toggle the filled image on hover', () => {
        render(
            <DomainsCard
                title='Test Title'
                imgSrcLM='light-mode-image'
                imgSrcDM='dark-mode-image'
                imgSrcFilledLM='light-mode-image'
                imgSrcFilledDM='filled-dark-mode-image'
                noContributions={false}
                description='Test Description'
                domainId='test-domain-id'
                playbookId='test-playbook-id'
                EARBApproved={true}
            />
        )

        const imageElement = screen.getAllByRole('img')
        expect(imageElement[1]).toHaveAttribute(
            'src',
            expect.stringContaining('dark-mode-image')
        )
    })

    it('should render the "Version 1" badge if the domain ID is in VERSION_1_DOMAINS_UUIDS', () => {
        render(
            <DomainsCard
                title='Test Title'
                imgSrcLM='light-mode-image'
                imgSrcDM='dark-mode-image'
                imgSrcFilledLM='filled-light-mode-image'
                imgSrcFilledDM='filled-dark-mode-image'
                noContributions={false}
                description='Test Description'
                domainId='test-domain-id'
                playbookId='test-playbook-id'
                EARBApproved={true}
            />
        )
        expect(screen.getByText('V1')).toBeInTheDocument()
    })

    it('should not render the "Version 1" badge if the domain ID is not in VERSION_1_DOMAINS_UUIDS', () => {
        render(
            <DomainsCard
                title='Test Title'
                imgSrcLM='light-mode-image'
                imgSrcDM='dark-mode-image'
                imgSrcFilledLM='filled-light-mode-image'
                imgSrcFilledDM='filled-dark-mode-image'
                noContributions={false}
                description='Test Description'
                domainId='non-existent-domain-id'
                playbookId='test-playbook-id'
                EARBApproved={true}
            />
        )
        expect(screen.queryByText('V1')).not.toBeInTheDocument()
    })
    it('should render hover mouse event', async () => {
        render(
            <DomainsCard
                title='Test Title'
                imgSrcLM='light-mode-image'
                imgSrcDM='dark-mode-image'
                imgSrcFilledLM='filled-light-mode-image'
                imgSrcFilledDM='filled-dark-mode-image'
                noContributions={false}
                description='Test Description'
                domainId='non-existent-domain-id'
                playbookId='test-playbook-id'
                EARBApproved={true}
            />
        )
        await userEvent.hover(screen.getByText('Test Title'))
        await userEvent.unhover(screen.getByText('Test Title'))
    })
})
