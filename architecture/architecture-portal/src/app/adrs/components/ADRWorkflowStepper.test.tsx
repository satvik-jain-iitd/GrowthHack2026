import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import ADRWorkflowStepper from './ADRWorkflowStepper'

describe('ADRWorkflowStepper', () => {
    it('renders all steps for IN PROGRESS status', () => {
        render(<ADRWorkflowStepper status='IN PROGRESS' />)

        expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
        expect(screen.getByText('UNDER REVIEW')).toBeInTheDocument()
        expect(screen.getByText('AWAITING APPROVAL')).toBeInTheDocument()
        expect(screen.getByText('APPROVED')).toBeInTheDocument()
    })

    it('renders all steps for UNDER REVIEW status', () => {
        render(<ADRWorkflowStepper status='UNDER REVIEW' />)

        expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
        expect(screen.getByText('UNDER REVIEW')).toBeInTheDocument()
        expect(screen.getByText('AWAITING APPROVAL')).toBeInTheDocument()
        expect(screen.getByText('APPROVED')).toBeInTheDocument()
    })

    it('renders all steps for AWAITING APPROVAL status', () => {
        render(<ADRWorkflowStepper status='AWAITING APPROVAL' />)

        expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
        expect(screen.getByText('UNDER REVIEW')).toBeInTheDocument()
        expect(screen.getByText('AWAITING APPROVAL')).toBeInTheDocument()
        expect(screen.getByText('APPROVED')).toBeInTheDocument()
    })

    it('renders all steps for APPROVED status', () => {
        render(<ADRWorkflowStepper status='APPROVED' />)

        expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
        expect(screen.getByText('UNDER REVIEW')).toBeInTheDocument()
        expect(screen.getByText('AWAITING APPROVAL')).toBeInTheDocument()
        expect(screen.getByText('APPROVED')).toBeInTheDocument()
    })

    it('renders correct steps for NOT APPROVED status', () => {
        render(<ADRWorkflowStepper status='NOT APPROVED' />)

        expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
        expect(screen.getByText('UNDER REVIEW')).toBeInTheDocument()
        expect(screen.getByText('AWAITING APPROVAL')).toBeInTheDocument()
        expect(screen.getByText('APPROVED')).toBeInTheDocument()
    })

    it('handles unknown status gracefully', () => {
        render(<ADRWorkflowStepper status='UNKNOWN_STATUS' />)

        expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
        expect(screen.getByText('UNDER REVIEW')).toBeInTheDocument()
        expect(screen.getByText('AWAITING APPROVAL')).toBeInTheDocument()
        expect(screen.getByText('APPROVED')).toBeInTheDocument()
    })
})
