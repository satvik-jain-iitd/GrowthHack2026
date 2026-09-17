import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import AttestationConfirmationModal from './AttestationConfirmationModal'
import { type AttestationType } from '@/constants/attestationConfig'

describe('AttestationConfirmationModal', () => {
    const defaultProps = {
        isOpen: true,
        attestationType: 'INITIATIVE_PRE_BUILD' as AttestationType,
        onConfirm: jest.fn(),
        onCancel: jest.fn()
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the modal with attestation items when open', () => {
        render(<AttestationConfirmationModal {...defaultProps} />)

        expect(screen.getByText('Attestation Confirmation')).toBeInTheDocument()
        expect(screen.getByText(/INITIATIVE PRE BUILD/)).toBeInTheDocument()
    })

    it('displays attestation item names and descriptions', () => {
        render(<AttestationConfirmationModal {...defaultProps} />)

        expect(
            screen.getByText('EA Design Playbook - Architecture Design')
        ).toBeInTheDocument()
        expect(
            screen.getByText('Core ADR Inventory and Approvals')
        ).toBeInTheDocument()
    })

    it('renders the attestation checkbox', () => {
        render(<AttestationConfirmationModal {...defaultProps} />)

        expect(
            screen.getByText('Yes, I attest to these changes')
        ).toBeInTheDocument()
    })

    it('Confirm & Submit button is initially disabled', () => {
        render(<AttestationConfirmationModal {...defaultProps} />)

        const confirmButton = screen.getByText('Confirm & Submit')
        expect(confirmButton).toBeDisabled()
    })

    it('does not call onConfirm when checkbox is not checked', () => {
        render(<AttestationConfirmationModal {...defaultProps} />)

        const confirmButton = screen.getByText('Confirm & Submit')
        fireEvent.click(confirmButton)

        expect(defaultProps.onConfirm).not.toHaveBeenCalled()
    })

    it('calls onCancel when Cancel button is clicked', () => {
        render(<AttestationConfirmationModal {...defaultProps} />)

        const cancelButton = screen.getByText('Cancel')
        fireEvent.click(cancelButton)

        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
    })

    it('renders different items for APPLICATION_PRE_DEPLOY', () => {
        render(
            <AttestationConfirmationModal
                {...defaultProps}
                attestationType='APPLICATION_PRE_DEPLOY'
            />
        )

        expect(screen.getByText(/APPLICATION PRE DEPLOY/)).toBeInTheDocument()
        expect(
            screen.getByText('EA Design Playbook - Overall Design')
        ).toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
        render(
            <AttestationConfirmationModal {...defaultProps} isOpen={false} />
        )

        expect(
            screen.queryByText('Attestation Confirmation')
        ).not.toBeInTheDocument()
    })
})
