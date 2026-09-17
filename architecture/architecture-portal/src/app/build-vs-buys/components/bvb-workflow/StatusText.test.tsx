import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@/test/utils/test-utils'
import StatusText from './StatusText'

describe('StatusText', () => {
    it('renders the mapped label from a plain status', () => {
        render(<StatusText data={{ status: 'approved' }} />)
        expect(screen.getByText('Approved')).toBeInTheDocument()
    })

    it('derives the status from workflowData currentTask', () => {
        render(
            <StatusText
                data={{
                    workflowData: {
                        status: 'IN_PROGRESS',
                        currentTask: { step: 'WaitForReviewers' }
                    }
                }}
            />
        )
        expect(screen.getByText('In Review')).toBeInTheDocument()
    })

    it('renders the completed approved status from workflowData', () => {
        render(
            <StatusText
                data={{
                    workflowData: {
                        status: 'PROCESS_STATE_COMPLETED',
                        adrRejected: false,
                        currentTask: { step: 'WaitForDeciders' }
                    }
                }}
            />
        )
        expect(screen.getByText('Approved')).toBeInTheDocument()
    })

    it('renders nothing mappable for an unknown status', () => {
        const { container } = render(
            <StatusText data={{ status: 'unknown' }} />
        )
        expect(container.textContent).toBe('')
    })
})
