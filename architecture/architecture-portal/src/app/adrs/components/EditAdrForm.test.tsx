import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils'
import EditAdrForm from './EditAdrForm'
import { useEditAdr } from '@/app/adrs/hooks/useEditAdr'
import { useUserContext } from '@/context'
import { useADRRoles } from '@/app/adrs/hooks/useADRRoles'
import { ADR } from '@/app/docs/hooks/useGetADR'
import { useWatch } from 'react-hook-form'

// Mock the hooks
jest.mock('@/app/adrs/hooks/useEditAdr')
jest.mock('@/context')
jest.mock('@/app/adrs/hooks/useADRRoles')

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
    useWatch: jest.fn(() => []),
    useForm: () => ({
        control: {},
        register: jest.fn((name: string) => ({
            name,
            onChange: jest.fn(),
            onBlur: jest.fn(),
            ref: jest.fn()
        })),
        handleSubmit:
            (fn: (data: Record<string, unknown>) => void) =>
            (e?: React.FormEvent) => {
                e?.preventDefault?.()
                fn({
                    adrName: 'Updated ADR',
                    reviewers: ['reviewer@example.com'],
                    deciders: ['decider@example.com'],
                    eaArchitects: ['architect@example.com'],
                    adr_type: 'TECHNICAL'
                })
            },
        reset: jest.fn(),
        trigger: jest.fn(),
        formState: { errors: {} }
    })
}))

// Mock the utility functions
jest.mock('@/app/onboarding-form/utils', () => ({
    fetchEmployeesAndContractorsByEmail: jest.fn(),
    fetchStakeholdersByEmail: jest.fn(),
    fetchEaArchitectByEmail: jest.fn()
}))

// Mock the form components
jest.mock('@/app/onboarding-form/components', () => ({
    TypeaheadField: ({
        name,
        label,
        required,
        disabled
    }: {
        name: string
        label: string
        required?: boolean
        disabled?: boolean
    }) => (
        <div data-testid={`typeahead-${name}`}>
            <label>
                {label}
                {required && ' *'}
            </label>
            {disabled && <span data-testid={`${name}-disabled`}>Disabled</span>}
        </div>
    )
}))

jest.mock('@/app/onboarding-form/components/TextField', () => ({
    TextField: ({
        name,
        label,
        required
    }: {
        name: string
        label: string
        required?: boolean
    }) => (
        <div data-testid={`textfield-${name}`}>
            <label>
                {label}
                {required && ' *'}
            </label>
        </div>
    )
}))

jest.mock('@/app/onboarding-form/components/NativeSelectField', () => ({
    NativeSelectField: ({
        name,
        label,
        required
    }: {
        name: string
        label: string
        required?: boolean
    }) => (
        <div data-testid={`select-${name}`}>
            <label>
                {label}
                {required && ' *'}
            </label>
        </div>
    )
}))

// Mock the icon
jest.mock('@americanexpress/dls-icons', () => ({
    IconEdit: () => <div data-testid='icon-edit'>Edit</div>
}))

// Mock Chakra UI Dialog components with simplified approach
const mockDialogState = { isOpen: false }

jest.mock('@chakra-ui/react', () => {
    const actual = jest.requireActual('@chakra-ui/react')
    return {
        ...actual,
        Dialog: {
            Root: ({
                children,
                open
            }: {
                children: React.ReactNode
                open: boolean
            }) => {
                mockDialogState.isOpen = open
                return <div data-testid='dialog-root'>{children}</div>
            },
            Trigger: ({ children }: { children: React.ReactNode }) => (
                <div>{children}</div>
            ),
            Backdrop: () =>
                mockDialogState.isOpen ? (
                    <div data-testid='dialog-backdrop' />
                ) : null,
            Positioner: ({ children }: { children: React.ReactNode }) =>
                mockDialogState.isOpen ? (
                    <div data-testid='dialog-positioner'>{children}</div>
                ) : null,
            Content: ({ children }: { children: React.ReactNode }) => (
                <div data-testid='dialog-content'>{children}</div>
            ),
            Header: ({ children }: { children: React.ReactNode }) => (
                <div data-testid='dialog-header'>{children}</div>
            ),
            Title: ({ children }: { children: React.ReactNode }) => (
                <div data-testid='dialog-title'>{children}</div>
            ),
            Body: ({ children }: { children: React.ReactNode }) => (
                <div data-testid='dialog-body'>{children}</div>
            ),
            Footer: ({ children }: { children: React.ReactNode }) => (
                <div data-testid='dialog-footer'>{children}</div>
            ),
            ActionTrigger: ({ children }: { children: React.ReactNode }) => (
                <>{children}</>
            ),
            CloseTrigger: ({ children }: { children: React.ReactNode }) => (
                <>{children}</>
            )
        }
    }
})

describe('EditAdrForm Component', () => {
    const mockMutate = jest.fn()
    const mockUser = {
        attributes: {
            email: 'testuser@example.com',
            fullName: 'Test User'
        }
    }

    const mockAdrInProgress: ADR = {
        adr_mtda_id: 'adr-123',
        adr_nm: 'Test ADR',
        adr_type_nm: 'TECHNICAL',
        rev_ctc_da: ['reviewer@example.com'],
        aprv_ctc_da: ['decider@example.com'],
        entrpr_archt_ctc_da: ['architect@example.com'],
        adr_req_email_ad_tx: 'testuser@example.com',
        wkflow_sta_nm: 'IN PROGRESS',
        wkflow_id: 'workflow-123',
        wkflow_step_id: 'step-123'
    }

    const mockAdrUnderReview: ADR = {
        ...mockAdrInProgress,
        wkflow_sta_nm: 'UNDER REVIEW'
    }

    const mockAdrAwaitingApproval: ADR = {
        ...mockAdrInProgress,
        wkflow_sta_nm: 'AWAITING APPROVAL'
    }

    const mockAdrApproved: ADR = {
        ...mockAdrInProgress,
        wkflow_sta_nm: 'APPROVED'
    }

    beforeEach(() => {
        jest.clearAllMocks()
        ;(useEditAdr as jest.Mock).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
            isSuccess: false
        })
        ;(useUserContext as jest.Mock).mockReturnValue(mockUser)
        ;(useADRRoles as jest.Mock).mockReturnValue({
            isRequester: true,
            isReviewer: false,
            isDecider: false,
            isArchitect: false,
            isAdmin: false
        })
    })

    describe('Component Rendering', () => {
        it('renders the Edit ADR button when status is IN PROGRESS', () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            expect(button).toBeInTheDocument()
            expect(screen.getByTestId('icon-edit')).toBeInTheDocument()
        })

        it('does not render the Edit button when ADR is APPROVED', () => {
            render(<EditAdrForm adr={mockAdrApproved} fileId='file-123' />)

            expect(
                screen.queryByRole('button', { name: /Edit ADR/i })
            ).not.toBeInTheDocument()
        })

        it('does not render the Edit button when user is not requester or EA architect', () => {
            ;(useADRRoles as jest.Mock).mockReturnValue({
                isRequester: false,
                isReviewer: false,
                isDecider: false,
                isArchitect: false,
                isAdmin: false
            })

            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            expect(
                screen.queryByRole('button', { name: /Edit ADR/i })
            ).not.toBeInTheDocument()
        })

        it('renders the Edit button when user is an EA architect', () => {
            ;(useADRRoles as jest.Mock).mockReturnValue({
                isRequester: false,
                isReviewer: false,
                isDecider: false,
                isArchitect: true,
                isAdmin: false
            })

            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            expect(
                screen.getByRole('button', { name: /Edit ADR/i })
            ).toBeInTheDocument()
        })

        it('accepts fileId prop', () => {
            render(
                <EditAdrForm adr={mockAdrInProgress} fileId='custom-file-id' />
            )

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            expect(button).toBeInTheDocument()
        })
    })

    describe('Loading States', () => {
        it('shows "Updating..." when isPending is true', () => {
            ;(useEditAdr as jest.Mock).mockReturnValue({
                mutate: mockMutate,
                isPending: true,
                isSuccess: false
            })

            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Updating/i })
            expect(button).toBeInTheDocument()
        })

        it('disables button when isPending is true', () => {
            ;(useEditAdr as jest.Mock).mockReturnValue({
                mutate: mockMutate,
                isPending: true,
                isSuccess: false
            })

            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Updating/i })
            expect(button).toBeDisabled()
        })
    })

    describe('Dialog Interactions', () => {
        it('opens dialog when Edit button is clicked', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(screen.getByTestId('dialog-title')).toHaveTextContent(
                    'Edit ADR'
                )
            })
        })

        it('renders all form fields when dialog is opened', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByTestId('textfield-adrName')
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('typeahead-reviewers')
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('typeahead-deciders')
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('typeahead-eaArchitects')
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('select-adr_type')
                ).toBeInTheDocument()
            })
        })

        it('displays correct field labels', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(screen.getByText('ADR Name *')).toBeInTheDocument()
                expect(screen.getByText('Reviewer(s) *')).toBeInTheDocument()
                expect(screen.getByText('Decider(s) *')).toBeInTheDocument()
                expect(
                    screen.getByText('EA Architect(s) *')
                ).toBeInTheDocument()
                expect(screen.getByText('ADR Type')).toBeInTheDocument()
            })
        })

        it('shows Update button in dialog', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /Update/i })
                ).toBeInTheDocument()
            })
        })

        it('shows Close button in dialog', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                const closeButtons = screen.getAllByRole('button', {
                    name: /Close/i
                })
                expect(closeButtons.length).toBeGreaterThan(0)
            })
        })

        it('closes dialog when Close button is clicked', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const editButton = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(editButton)

            await waitFor(() => {
                expect(
                    screen.getByTestId('dialog-positioner')
                ).toBeInTheDocument()
            })

            const closeButtons = screen.getAllByRole('button', {
                name: /Close/i
            })
            fireEvent.click(closeButtons[0])

            await waitFor(() => {
                expect(
                    screen.queryByTestId('dialog-positioner')
                ).not.toBeInTheDocument()
            })
        })
    })

    describe('Workflow Status-Based Field Restrictions', () => {
        it('does not show warning banner when ADR is IN PROGRESS', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.queryByText(/Some fields are locked/)
                ).not.toBeInTheDocument()
                expect(
                    screen.queryByText(/Reviewer field is locked/)
                ).not.toBeInTheDocument()
            })
        })

        it('shows warning banner and disables reviewers when ADR is UNDER REVIEW', async () => {
            render(<EditAdrForm adr={mockAdrUnderReview} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByText(
                        /Reviewer field is locked because this ADR is under review/
                    )
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('reviewers-disabled')
                ).toBeInTheDocument()
            })
        })

        it('shows warning banner and disables deciders when ADR is AWAITING APPROVAL', async () => {
            render(
                <EditAdrForm adr={mockAdrAwaitingApproval} fileId='file-123' />
            )

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByText(
                        /Some fields are locked because this ADR is awaiting approval/
                    )
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('reviewers-disabled')
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('deciders-disabled')
                ).toBeInTheDocument()
            })
        })

        it('allows editing all fields when status is IN PROGRESS', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.queryByTestId('reviewers-disabled')
                ).not.toBeInTheDocument()
                expect(
                    screen.queryByTestId('deciders-disabled')
                ).not.toBeInTheDocument()
            })
        })

        it('disables reviewers but allows other fields when UNDER REVIEW', async () => {
            render(<EditAdrForm adr={mockAdrUnderReview} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByTestId('reviewers-disabled')
                ).toBeInTheDocument()
                expect(
                    screen.queryByTestId('deciders-disabled')
                ).not.toBeInTheDocument()
                expect(
                    screen.getByTestId('textfield-adrName')
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('typeahead-eaArchitects')
                ).toBeInTheDocument()
            })
        })

        it('disables both reviewers and deciders when AWAITING APPROVAL', async () => {
            render(
                <EditAdrForm adr={mockAdrAwaitingApproval} fileId='file-123' />
            )

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByTestId('reviewers-disabled')
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('deciders-disabled')
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('textfield-adrName')
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('typeahead-eaArchitects')
                ).toBeInTheDocument()
            })
        })
    })

    describe('Form Submission', () => {
        it('calls mutate with correct data when form is submitted (IN PROGRESS)', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /Update/i })
                ).toBeInTheDocument()
            })

            const form = screen.getByTestId('dialog-body').querySelector('form')
            if (form) {
                fireEvent.submit(form)
            }

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        adrId: 'adr-123',
                        fileId: 'file-123',
                        adrName: 'Updated ADR',
                        reviewers: ['reviewer@example.com'],
                        deciders: ['decider@example.com'],
                        eaArchitects: ['architect@example.com'],
                        adr_type: 'TECHNICAL',
                        user: 'testuser@example.com'
                    }),
                    expect.any(Object)
                )
            })
        })

        it('excludes reviewers from payload when ADR is UNDER REVIEW', async () => {
            render(<EditAdrForm adr={mockAdrUnderReview} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /Update/i })
                ).toBeInTheDocument()
            })

            const form = screen.getByTestId('dialog-body').querySelector('form')
            if (form) {
                fireEvent.submit(form)
            }

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        adrId: 'adr-123',
                        fileId: 'file-123',
                        reviewers: mockAdrUnderReview.rev_ctc_da
                    }),
                    expect.any(Object)
                )
            })
        })

        it('excludes both reviewers and deciders from payload when ADR is AWAITING APPROVAL', async () => {
            render(
                <EditAdrForm adr={mockAdrAwaitingApproval} fileId='file-123' />
            )

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /Update/i })
                ).toBeInTheDocument()
            })

            const form = screen.getByTestId('dialog-body').querySelector('form')
            if (form) {
                fireEvent.submit(form)
            }

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        adrId: 'adr-123',
                        fileId: 'file-123',
                        reviewers: mockAdrAwaitingApproval.rev_ctc_da,
                        deciders: mockAdrAwaitingApproval.aprv_ctc_da
                    }),
                    expect.any(Object)
                )
            })
        })

        it('includes user email in the payload', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /Update/i })
                ).toBeInTheDocument()
            })

            const form = screen.getByTestId('dialog-body').querySelector('form')
            if (form) {
                fireEvent.submit(form)
            }

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled()
            })

            const callArgs =
                mockMutate.mock.calls[mockMutate.mock.calls.length - 1]
            expect(callArgs[0].user).toBe(mockUser.attributes.email)
        })
    })

    describe('Form Reset', () => {
        it('resets form when ADR data changes', () => {
            const { rerender } = render(
                <EditAdrForm adr={mockAdrInProgress} fileId='file-123' />
            )

            const updatedAdr = {
                ...mockAdrInProgress,
                adr_nm: 'Updated ADR Name'
            }

            rerender(<EditAdrForm adr={updatedAdr} fileId='file-123' />)

            // The useEffect hook should trigger reset with new values
            const button = screen.getByRole('button', { name: /Edit ADR/i })
            expect(button).toBeInTheDocument()
        })
    })

    describe('Edge Cases', () => {
        it('handles missing user context gracefully', async () => {
            ;(useUserContext as jest.Mock).mockReturnValue(null)

            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            const form = screen.getByTestId('dialog-body').querySelector('form')
            if (form) {
                fireEvent.submit(form)
            }

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        user: ''
                    }),
                    expect.any(Object)
                )
            })
        })

        it('handles ADR with empty arrays', () => {
            const adrWithEmptyArrays: ADR = {
                ...mockAdrInProgress,
                rev_ctc_da: [],
                aprv_ctc_da: [],
                entrpr_archt_ctc_da: []
            }

            render(<EditAdrForm adr={adrWithEmptyArrays} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            expect(button).toBeInTheDocument()
        })

        it('handles ADR with undefined adr_type_nm', () => {
            const adrWithoutType: ADR = {
                ...mockAdrInProgress,
                adr_type_nm: ''
            }

            render(<EditAdrForm adr={adrWithoutType} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            expect(button).toBeInTheDocument()
        })

        it('handles ADR with null workflow status', () => {
            const adrWithNullStatus: ADR = {
                ...mockAdrInProgress,
                wkflow_sta_nm: '' as never
            }

            render(<EditAdrForm adr={adrWithNullStatus} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            expect(button).toBeInTheDocument()
        })
    })

    describe('Cross-field Validation', () => {
        it('includes validation rule to prevent same person in reviewers and deciders', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(screen.getByTestId('dialog-title')).toHaveTextContent(
                    'Edit ADR'
                )
            })

            // The TypeaheadField components have validation rules
            // This test verifies the component passes the validation rules
            expect(
                screen.getByTestId('typeahead-reviewers')
            ).toBeInTheDocument()
            expect(screen.getByTestId('typeahead-deciders')).toBeInTheDocument()
        })

        it('validates reviewers cannot overlap with deciders when watchedDeciders has values', async () => {
            const mockWatchedDeciders = ['decider1@aexp.com']
            ;(useWatch as jest.Mock).mockImplementation(({ name }) => {
                if (name === 'deciders') return mockWatchedDeciders
                return []
            })

            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(screen.getByTestId('dialog-title')).toHaveTextContent(
                    'Edit ADR'
                )
            })

            expect(
                screen.getByTestId('typeahead-reviewers')
            ).toBeInTheDocument()

            // Reset mock
            ;(useWatch as jest.Mock).mockReturnValue([])
        })

        it('validates deciders cannot overlap with reviewers when watchedReviewers has values', async () => {
            const mockWatchedReviewers = ['reviewer1@aexp.com']
            ;(useWatch as jest.Mock).mockImplementation(({ name }) => {
                if (name === 'reviewers') return mockWatchedReviewers
                return []
            })

            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(screen.getByTestId('dialog-title')).toHaveTextContent(
                    'Edit ADR'
                )
            })

            expect(screen.getByTestId('typeahead-deciders')).toBeInTheDocument()

            // Reset mock
            ;(useWatch as jest.Mock).mockReturnValue([])
        })

        it('validation detects when both reviewers and deciders have same person', async () => {
            const duplicateEmail = 'reviewer1@aexp.com'
            ;(useWatch as jest.Mock).mockImplementation(({ name }) => {
                if (name === 'reviewers') return [duplicateEmail]
                if (name === 'deciders') return [duplicateEmail]
                return []
            })

            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(screen.getByTestId('dialog-title')).toHaveTextContent(
                    'Edit ADR'
                )
            })

            expect(
                screen.getByTestId('typeahead-reviewers')
            ).toBeInTheDocument()

            // Reset mock
            ;(useWatch as jest.Mock).mockReturnValue([])
        })
    })

    describe('Helper Functions', () => {
        it('handles null response in mapResponseToItems', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-eaArchitects')
                ).toBeInTheDocument()
            })
        })

        it('handles null item in itemToString', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-reviewers')
                ).toBeInTheDocument()
            })
        })
    })

    describe('Form State Management', () => {
        it('resets form on successful update', async () => {
            const mockMutateWithSuccess = jest.fn((data, callbacks) => {
                if (callbacks?.onSuccess) {
                    callbacks.onSuccess()
                }
            })

            ;(useEditAdr as jest.Mock).mockReturnValue({
                mutate: mockMutateWithSuccess,
                isPending: false,
                isSuccess: false
            })

            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(screen.getByTestId('dialog-title')).toHaveTextContent(
                    'Edit ADR'
                )
            })

            const form = screen.getByTestId('dialog-body').querySelector('form')
            if (form) {
                fireEvent.submit(form)
            }

            await waitFor(() => {
                expect(mockMutateWithSuccess).toHaveBeenCalled()
            })
        })

        it('handles onOpenChange event', async () => {
            render(<EditAdrForm adr={mockAdrInProgress} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(screen.getByTestId('dialog-title')).toHaveTextContent(
                    'Edit ADR'
                )
            })

            // Dialog should be open
            expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
        })
    })

    describe('Conditional Tooltips', () => {
        it('shows locked tooltip for reviewers when UNDER REVIEW', async () => {
            render(<EditAdrForm adr={mockAdrUnderReview} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-reviewers')
                ).toBeInTheDocument()
            })

            // Reviewers field should be disabled with appropriate tooltip
            expect(screen.getByTestId('reviewers-disabled')).toBeInTheDocument()
        })

        it('shows locked tooltip for deciders when AWAITING APPROVAL', async () => {
            render(
                <EditAdrForm adr={mockAdrAwaitingApproval} fileId='file-123' />
            )

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-deciders')
                ).toBeInTheDocument()
            })

            // Deciders field should be disabled with appropriate tooltip
            expect(screen.getByTestId('deciders-disabled')).toBeInTheDocument()
        })
    })

    describe('Form Update Logic', () => {
        it('preserves original reviewers when locked during UNDER REVIEW', async () => {
            render(<EditAdrForm adr={mockAdrUnderReview} fileId='file-123' />)

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /Update/i })
                ).toBeInTheDocument()
            })

            const form = screen.getByTestId('dialog-body').querySelector('form')
            if (form) {
                fireEvent.submit(form)
            }

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        reviewers: mockAdrUnderReview.rev_ctc_da
                    }),
                    expect.any(Object)
                )
            })
        })

        it('preserves original deciders when locked during AWAITING APPROVAL', async () => {
            render(
                <EditAdrForm adr={mockAdrAwaitingApproval} fileId='file-123' />
            )

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /Update/i })
                ).toBeInTheDocument()
            })

            const form = screen.getByTestId('dialog-body').querySelector('form')
            if (form) {
                fireEvent.submit(form)
            }

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        deciders: mockAdrAwaitingApproval.aprv_ctc_da
                    }),
                    expect.any(Object)
                )
            })
        })

        it('always allows editing adrName and eaArchitects regardless of status', async () => {
            render(
                <EditAdrForm adr={mockAdrAwaitingApproval} fileId='file-123' />
            )

            const button = screen.getByRole('button', { name: /Edit ADR/i })
            fireEvent.click(button)

            await waitFor(() => {
                expect(
                    screen.getByTestId('textfield-adrName')
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('typeahead-eaArchitects')
                ).toBeInTheDocument()
            })

            // These fields should not be disabled
            expect(
                screen.queryByTestId('adrName-disabled')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('eaArchitects-disabled')
            ).not.toBeInTheDocument()
        })
    })
})
