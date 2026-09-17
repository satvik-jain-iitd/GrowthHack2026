import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import ADRWorkflow from './ADRWorkflow'
import { useGetADR } from '@/app/docs/hooks/useGetADR'
import { useUserContext } from '@/context'

// Mock the dependencies
jest.mock('@/app/docs/hooks/useGetADR')
jest.mock('@/context')
jest.mock('./RegisterADRButton', () => ({
    __esModule: true,
    default: ({
        fileId,
        playbookId
    }: {
        fileId: string
        playbookId: string
    }) => (
        <div data-testid='register-adr-button'>
            Register ADR - {fileId} - {playbookId}
        </div>
    )
}))
jest.mock('./ADRWorkflowStepper', () => ({
    __esModule: true,
    default: ({ status }: { status: string }) => (
        <div data-testid='workflow-stepper'>Stepper: {status}</div>
    )
}))
jest.mock('./ADRActorTable', () => ({
    __esModule: true,
    default: ({ adr }: { adr: { adr_nm: string } }) => (
        <div data-testid='actor-table'>Actor Table: {adr.adr_nm}</div>
    )
}))
jest.mock('./ADRWorkflowActionButtons', () => ({
    __esModule: true,
    default: ({ adr, fileId }: { adr: { adr_nm: string }; fileId: string }) => (
        <div data-testid='action-buttons'>
            Actions: {adr.adr_nm} - {fileId}
        </div>
    )
}))
jest.mock('./ADRAuditHistory', () => ({
    __esModule: true,
    default: ({ adrId }: { adrId: string }) => (
        <div data-testid='audit-history'>Audit: {adrId}</div>
    )
}))
jest.mock('./EditAdrForm', () => ({
    __esModule: true,
    default: ({ adr, fileId }: { adr: { adr_nm: string }; fileId: string }) => (
        <div data-testid='edit-adr-form'>
            Edit Form: {adr.adr_nm} - {fileId}
        </div>
    )
}))

const mockUseGetADR = useGetADR as jest.MockedFunction<typeof useGetADR>
const mockUseUserContext = useUserContext as jest.MockedFunction<
    typeof useUserContext
>

describe('ADRWorkflow', () => {
    const mockADR = {
        adr_mtda_id: 'adr-123',
        adr_nm: 'test adr',
        rev_ctc_da: ['reviewerEmail@aexp.com'],
        aprv_ctc_da: ['approverEmail@aexp.com'],
        entrpr_archt_ctc_da: ['eaArchitectEmail@aexp.com'],
        adr_req_email_ad_tx: 'requesterEmail@aexp.com',
        wkflow_sta_nm: 'IN PROGRESS',
        wkflow_id: 'wkflow-123',
        wkflow_step_id: 'step-123',
        reviews: []
    }

    beforeEach(() => {
        jest.clearAllMocks()
        mockUseUserContext.mockReturnValue({
            attributes: { email: 'userEmail@aexp.com' }
        } as ReturnType<typeof useUserContext>)
    })

    it('shows RegisterADRButton when ADR is not loaded and not loading', () => {
        mockUseGetADR.mockReturnValue({
            isLoading: false,
            data: undefined,
            error: null,
            isError: false
        } as Partial<ReturnType<typeof useGetADR>> as ReturnType<
            typeof useGetADR
        >)

        render(
            <ADRWorkflow
                fileId='file-123'
                playbookId='playbook-123'
                repo='test-repo'
                fileName='test-file.md'
                filePlaybookTypeId='type-123'
            />
        )

        expect(screen.getByTestId('register-adr-button')).toBeInTheDocument()
        expect(screen.getByText(/Register ADR - file-123/)).toBeInTheDocument()
    })

    it('returns null when data is not available and still loading', () => {
        mockUseGetADR.mockReturnValue({
            isLoading: true,
            data: undefined,
            error: null,
            isError: false
        } as Partial<ReturnType<typeof useGetADR>> as ReturnType<
            typeof useGetADR
        >)

        const { container } = render(
            <ADRWorkflow
                fileId='file-123'
                playbookId='playbook-123'
                repo='test-repo'
                fileName='test-file.md'
            />
        )

        expect(container.firstChild).toBeNull()
    })

    it('returns null when wkflow_id is not present', () => {
        const adrWithoutWorkflow = { ...mockADR, wkflow_id: '' }
        mockUseGetADR.mockReturnValue({
            isLoading: false,
            data: adrWithoutWorkflow,
            error: null,
            isError: false
        } as Partial<ReturnType<typeof useGetADR>> as ReturnType<
            typeof useGetADR
        >)

        const { container } = render(
            <ADRWorkflow
                fileId='file-123'
                playbookId='playbook-123'
                repo='test-repo'
                fileName='test-file.md'
            />
        )

        expect(container.firstChild).toBeNull()
    })

    it('renders workflow accordion when ADR data is available', async () => {
        mockUseGetADR.mockReturnValue({
            isLoading: false,
            data: mockADR,
            error: null,
            isError: false
        } as Partial<ReturnType<typeof useGetADR>> as ReturnType<
            typeof useGetADR
        >)

        render(
            <ADRWorkflow
                fileId='file-123'
                playbookId='playbook-123'
                repo='test-repo'
                fileName='test-file.md'
            />
        )

        await waitFor(() => {
            expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
            expect(screen.getByText('View Details')).toBeInTheDocument()
        })
    })

    it('renders all child components when accordion is present', async () => {
        mockUseGetADR.mockReturnValue({
            isLoading: false,
            data: mockADR,
            error: null,
            isError: false
        } as Partial<ReturnType<typeof useGetADR>> as ReturnType<
            typeof useGetADR
        >)

        render(
            <ADRWorkflow
                fileId='file-123'
                playbookId='playbook-123'
                repo='test-repo'
                fileName='test-file.md'
            />
        )

        await waitFor(() => {
            expect(screen.getByTestId('action-buttons')).toBeInTheDocument()
        })

        expect(screen.getByTestId('workflow-stepper')).toBeInTheDocument()
        expect(screen.getByTestId('actor-table')).toBeInTheDocument()
        expect(screen.getByTestId('audit-history')).toBeInTheDocument()
        expect(screen.getByTestId('edit-adr-form')).toBeInTheDocument()
    })

    it('displays correct workflow status', async () => {
        const adrWithDifferentStatus = {
            ...mockADR,
            wkflow_sta_nm: 'UNDER REVIEW'
        }
        mockUseGetADR.mockReturnValue({
            isLoading: false,
            data: adrWithDifferentStatus,
            error: null,
            isError: false
        } as Partial<ReturnType<typeof useGetADR>> as ReturnType<
            typeof useGetADR
        >)

        render(
            <ADRWorkflow
                fileId='file-123'
                playbookId='playbook-123'
                repo='test-repo'
                fileName='test-file.md'
            />
        )

        await waitFor(() => {
            expect(screen.getByText('UNDER REVIEW')).toBeInTheDocument()
        })
    })

    it('passes correct props to child components', async () => {
        mockUseGetADR.mockReturnValue({
            isLoading: false,
            data: mockADR,
            error: null,
            isError: false
        } as Partial<ReturnType<typeof useGetADR>> as ReturnType<
            typeof useGetADR
        >)

        render(
            <ADRWorkflow
                fileId='file-123'
                playbookId='playbook-123'
                repo='test-repo'
                fileName='test-file.md'
            />
        )

        await waitFor(() => {
            expect(
                screen.getByText(/Actions: test adr - file-123/)
            ).toBeInTheDocument()
            expect(
                screen.getByText(/Actor Table: test adr/)
            ).toBeInTheDocument()
            expect(screen.getByText(/Audit: adr-123/)).toBeInTheDocument()
            expect(screen.getByText(/Stepper: IN PROGRESS/)).toBeInTheDocument()
            expect(
                screen.getByText(/Edit Form: test adr - file-123/)
            ).toBeInTheDocument()
        })
    })
})
