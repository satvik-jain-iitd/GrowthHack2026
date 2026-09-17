import React from 'react'
import { screen } from '@testing-library/react'
import { Accordion } from '@chakra-ui/react'
import { render } from '@/test/utils/test-utils'
import AttestationBanner from './AttestationBanner'
import { AttestationRole } from '../utils/attestationState'

jest.mock('@americanexpress/dls-icons', () => ({
    IconWarning: (props: Record<string, unknown>) => (
        <span data-testid='icon-warning' {...props} />
    )
}))

// AttestationBanner is always rendered inside an Accordion.ItemTrigger in the
// app (it uses Accordion.ItemIndicator), so tests wrap it in the same context.
const renderBanner = (role: AttestationRole) =>
    render(
        <Accordion.Root collapsible>
            <Accordion.Item value='banner'>
                <Accordion.ItemTrigger>
                    <AttestationBanner role={role} />
                </Accordion.ItemTrigger>
            </Accordion.Item>
        </Accordion.Root>
    )

describe('AttestationBanner', () => {
    it('renders attestation needed title for principal architect', () => {
        renderBanner('principal_architect')
        expect(
            screen.getByText('Change Request Attestation Needed')
        ).toBeInTheDocument()
        expect(
            screen.getByText(/review the changes below and attest/)
        ).toBeInTheDocument()
    })

    it('renders attestation needed title for enterprise architect', () => {
        renderBanner('enterprise_architect')
        expect(
            screen.getByText('Change Request Attestation Needed')
        ).toBeInTheDocument()
        expect(
            screen.getByText(
                /review the changes below and provide attestation./
            )
        ).toBeInTheDocument()
    })

    it('renders proposed change legend', () => {
        renderBanner('principal_architect')
        expect(screen.getByText('= proposed change')).toBeInTheDocument()
    })

    it('renders warning icons', () => {
        renderBanner('principal_architect')
        const icons = screen.getAllByTestId('icon-warning')
        expect(icons.length).toBeGreaterThanOrEqual(2)
    })

    it('renders as a yellow box', () => {
        const { container } = renderBanner('enterprise_architect')
        expect(container.firstChild).toBeTruthy()
    })
})
