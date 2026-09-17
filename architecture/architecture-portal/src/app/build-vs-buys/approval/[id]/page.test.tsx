import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { BVB_TEST_TEXT } from '@/app/build-vs-buys/test-data'

// Mock next/navigation hooks
const mockUseParams = jest.fn()
const mockUseRouter = jest.fn()
jest.mock('next/navigation', () => ({
    useParams: () => mockUseParams(),
    useRouter: () => mockUseRouter()
}))

// Mock usePlaybook hook
const mockUsePlaybook = jest.fn()
jest.mock('@/hooks/usePlaybooks', () => ({
    usePlaybook: (...args: unknown[]) => mockUsePlaybook(...(args as unknown[]))
}))

// Mock useSubmitAcceptance hook
const mockUseSubmitAcceptance = jest.fn()
jest.mock('@/hooks/useWorkflowActions', () => ({
    useSubmitAcceptance: (...args: unknown[]) =>
        mockUseSubmitAcceptance(...(args as unknown[]))
}))

import ApprovalPage from './page'

describe('BvB Approval Page', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('shows loading while playbook is being fetched', () => {
        mockUseParams.mockReturnValue({ id: 'playbook-1' })
        mockUsePlaybook.mockReturnValue({ data: null, isLoading: true })

        render(<ApprovalPage />)

        expect(screen.getByText(BVB_TEST_TEXT.loading)).toBeInTheDocument()
    })

    it('renders playbook details and handles approve/reject flow', async () => {
        // params and playbook
        mockUseParams.mockReturnValue({ id: 'playbook-1' })

        const mockPlaybook = {
            playbook_id: 'playbook-1',
            playbook_nm: 'My Playbook',
            creat_ts: '2022-07-20',
            ctc_email_ad_tx: 'user@aexp.com',
            prim_pfrm_nm: 'PlatformX',
            add_da: {
                workflowData: { bvbId: 'bvb-123' },
                etpImpacting: true,
                overallRisk: 'Low',
                estimatedCost: '$1000',
                description: 'A description',
                deciders: ['decider1'],
                owner: ['owner1'],
                requester: ['req1'],
                stakeHolders: ['s1'],
                eaArchitect: ['a1'],
                reviewers: ['r1'],
                targetedEndDate: '2022-12-31'
            }
        }

        mockUsePlaybook.mockReturnValue({
            data: mockPlaybook,
            isLoading: false
        })

        // Router mock with back
        const backMock = jest.fn()
        mockUseRouter.mockReturnValue({ back: backMock })

        // Setup approve/reject hooks to be returned in order
        const approveMutate = jest.fn().mockResolvedValue({})
        const rejectMutate = jest.fn().mockResolvedValue({})

        const approveHook = { mutateAsync: approveMutate, isPending: false }
        const rejectHook = { mutateAsync: rejectMutate, isPending: false }

        mockUseSubmitAcceptance
            .mockImplementationOnce(() => approveHook)
            .mockImplementationOnce(() => rejectHook)

        render(<ApprovalPage />)

        // Static content
        expect(screen.getByText('My Playbook')).toBeInTheDocument()
        expect(screen.getByText('07/20/2022')).toBeInTheDocument()
        expect(screen.getByText('user@aexp.com')).toBeInTheDocument()
        expect(screen.getByText('PlatformX')).toBeInTheDocument()

        // The hooks should have been initialized with correct args
        expect(mockUseSubmitAcceptance).toHaveBeenCalledWith(
            'bvb-123',
            'playbook-1',
            'APPROVED'
        )
        expect(mockUseSubmitAcceptance).toHaveBeenCalledWith(
            'bvb-123',
            'playbook-1',
            'REJECTED'
        )

        // Click Approve
        fireEvent.click(screen.getByText(BVB_TEST_TEXT.approve))

        await waitFor(() => expect(approveMutate).toHaveBeenCalled())
        expect(backMock).toHaveBeenCalled()

        // Click Reject
        fireEvent.click(screen.getByText(BVB_TEST_TEXT.reject))

        await waitFor(() => expect(rejectMutate).toHaveBeenCalled())
        expect(backMock).toHaveBeenCalledTimes(2)
    })
})
