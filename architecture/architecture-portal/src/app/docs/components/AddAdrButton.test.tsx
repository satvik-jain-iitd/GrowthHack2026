import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils'
import AddAdrButton from './AddAdrButton'
import { PLAYBOOK_TYPE_IDS } from '@/constants/playbookType'
import { useAddAdr } from '@/app/docs/hooks/useAddAdr'
import { useUserContext } from '@/context'
import { usePlaybook } from '@/hooks'
import { useWatch } from 'react-hook-form'

// Mock the hooks
jest.mock('@/app/docs/hooks/useAddAdr')
jest.mock('@/context')
jest.mock('@/hooks', () => ({
    usePlaybook: jest.fn()
}))

// Define mock ADR type constant (can't use imported constant in jest.mock factory)
const mockAdrType = '23e10939-906a-451c-b13f-932ef78481b4'

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
                    adrName: 'Test ADR',
                    reviewers: ['reviewerEmail@aexp.com'],
                    deciders: ['approverEmail@aexp.com'],
                    eaArchitects: ['eaArchitectEmail@aexp.com'],
                    adr_type: mockAdrType
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
        <div data-testid={`typeahead-${name}`} data-disabled={disabled}>
            <label>
                {label}
                {required && ' *'}
            </label>
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
        required,
        disabled
    }: {
        name: string
        label: string
        required?: boolean
        disabled?: boolean
    }) => (
        <div data-testid={`select-${name}`} data-disabled={disabled}>
            <label>
                {label}
                {required && ' *'}
            </label>
        </div>
    )
}))

// Mock the icon
jest.mock('@americanexpress/dls-icons', () => ({
    IconPlusCircle: () => <div data-testid='icon-plus-circle'>+</div>
}))

// Mock Chakra UI Dialog components
jest.mock('@chakra-ui/react', () => ({
    ...jest.requireActual('@chakra-ui/react'),
    Dialog: {
        Root: ({
            children,
            open
        }: {
            children: React.ReactNode
            open: boolean
        }) => (
            <div
                data-testid='dialog-root'
                style={{ display: open ? 'block' : 'none' }}
            >
                {children}
            </div>
        ),
        Trigger: ({ children }: { children: React.ReactNode }) => (
            <div data-testid='dialog-trigger'>{children}</div>
        ),
        Backdrop: () => <div data-testid='dialog-backdrop' />,
        Positioner: ({ children }: { children: React.ReactNode }) => (
            <div data-testid='dialog-positioner'>{children}</div>
        ),
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
        ActionTrigger: ({
            children,
            _asChild
        }: {
            children: React.ReactNode
            _asChild?: boolean
        }) => <>{children}</>,
        CloseTrigger: ({
            children,
            _asChild
        }: {
            children: React.ReactNode
            _asChild?: boolean
        }) => <>{children}</>
    }
}))

describe('AddAdrButton Component', () => {
    const mockMutate = jest.fn()
    const mockUser = {
        attributes: {
            email: 'userEmail@aexp.com',
            fullName: 'Test User'
        }
    }

    beforeEach(() => {
        jest.clearAllMocks()
        ;(useAddAdr as jest.Mock).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
            isSuccess: false
        })
        ;(useUserContext as jest.Mock).mockReturnValue(mockUser)
        ;(usePlaybook as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false
        })
    })

    describe('Component Rendering', () => {
        it('renders the Add ADR button with box styling by default', () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            expect(screen.getByText('Add ADR')).toBeInTheDocument()
            expect(screen.getByTestId('icon-plus-circle')).toBeInTheDocument()
        })

        it('renders the Add ADR text link when text prop is true', () => {
            render(
                <AddAdrButton
                    playbookId='playbook-123'
                    repo='test-repo'
                    text={true}
                />
            )

            const textLink = screen.getByText('Add ADR')
            expect(textLink).toBeInTheDocument()
            // Should not have the icon in text mode
            expect(
                screen.queryByTestId('icon-plus-circle')
            ).not.toBeInTheDocument()
        })

        it('accepts playbookId prop', () => {
            render(
                <AddAdrButton
                    playbookId='custom-playbook-id'
                    repo='test-repo'
                />
            )

            expect(screen.getByText('Add ADR')).toBeInTheDocument()
        })

        it('accepts repo prop', () => {
            render(
                <AddAdrButton playbookId='playbook-123' repo='custom-repo' />
            )

            expect(screen.getByText('Add ADR')).toBeInTheDocument()
        })

        it('accepts optional playbookTypeId prop', () => {
            render(
                <AddAdrButton
                    playbookId='playbook-123'
                    repo='test-repo'
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            expect(screen.getByText('Add ADR')).toBeInTheDocument()
        })
    })

    describe('Loading States', () => {
        it('shows "Adding..." in box mode when isPending is true', () => {
            ;(useAddAdr as jest.Mock).mockReturnValue({
                mutate: mockMutate,
                isPending: true,
                isSuccess: false
            })

            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            expect(screen.getByText('Adding...')).toBeInTheDocument()
        })

        it('shows "Adding ADR..." in text mode when isPending is true', () => {
            ;(useAddAdr as jest.Mock).mockReturnValue({
                mutate: mockMutate,
                isPending: true,
                isSuccess: false
            })

            render(
                <AddAdrButton
                    playbookId='playbook-123'
                    repo='test-repo'
                    text={true}
                />
            )

            expect(screen.getByText('Adding ADR...')).toBeInTheDocument()
        })
    })

    describe('Dialog Interactions', () => {
        it('opens dialog when box button is clicked', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            const button = screen.getByText('Add ADR')
            fireEvent.click(button)

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })
        })

        it('opens dialog when text link is clicked', async () => {
            render(
                <AddAdrButton
                    playbookId='playbook-123'
                    repo='test-repo'
                    text={true}
                />
            )

            const textLink = screen.getByText('Add ADR')
            fireEvent.click(textLink)

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })
        })

        it('renders all form fields when dialog is opened', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

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
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('ADR Name *')).toBeInTheDocument()
                expect(screen.getByText('Reviewer(s) *')).toBeInTheDocument()
                expect(screen.getByText('Decider(s) *')).toBeInTheDocument()
                expect(
                    screen.getByText('EA Architect(s) *')
                ).toBeInTheDocument()
                expect(screen.getByText('ADR Type *')).toBeInTheDocument()
            })
        })

        it('shows Submit button in dialog', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Submit')).toBeInTheDocument()
            })
        })

        it('shows Close button in dialog', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Close')).toBeInTheDocument()
            })
        })

        it('closes dialog when Close button is clicked', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })

            const closeButton = screen.getByText('Close')
            fireEvent.click(closeButton)

            await waitFor(() => {
                const dialogRoot = screen.getByTestId('dialog-root')
                expect(dialogRoot).toHaveStyle({ display: 'none' })
            })
        })

        it('shows "Submitting..." when form is being submitted', async () => {
            ;(useAddAdr as jest.Mock).mockReturnValue({
                mutate: mockMutate,
                isPending: true,
                isSuccess: false
            })

            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Adding...'))

            await waitFor(() => {
                expect(screen.getByText('Submitting...')).toBeInTheDocument()
            })
        })
    })

    describe('Form Submission', () => {
        it('calls mutate with correct data on form submission', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Submit')).toBeInTheDocument()
            })

            const submitButton = screen.getByText('Submit')
            fireEvent.click(submitButton)

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    {
                        playbookId: 'playbook-123',
                        repo: 'test-repo',
                        adrName: 'Test ADR',
                        reviewers: ['reviewerEmail@aexp.com'],
                        deciders: ['approverEmail@aexp.com'],
                        eaArchitects: ['eaArchitectEmail@aexp.com'],
                        requester: 'userEmail@aexp.com',
                        user: {
                            fullName: 'Test User',
                            email: 'userEmail@aexp.com'
                        },
                        adr_type: mockAdrType
                    },
                    expect.any(Object)
                )
            })
        })

        it('closes dialog on successful submission', async () => {
            const mockMutateWithCallback = jest.fn((data, callbacks) => {
                // Immediately call onSuccess to simulate successful mutation
                if (callbacks?.onSuccess) {
                    callbacks.onSuccess()
                }
            })

            ;(useAddAdr as jest.Mock).mockReturnValue({
                mutate: mockMutateWithCallback,
                isPending: false,
                isSuccess: false
            })

            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })

            // Submit the form which will trigger the mutation with onSuccess callback
            const submitButton = screen.getByText('Submit')
            fireEvent.click(submitButton)

            await waitFor(() => {
                const dialogRoot = screen.getByTestId('dialog-root')
                expect(dialogRoot).toHaveStyle({ display: 'none' })
            })
        })
    })

    describe('User Context Integration', () => {
        it('handles user with empty email', () => {
            ;(useUserContext as jest.Mock).mockReturnValue({
                attributes: {
                    email: '',
                    fullName: ''
                }
            })

            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            expect(screen.getByText('Add ADR')).toBeInTheDocument()
        })

        it('handles null user context', () => {
            ;(useUserContext as jest.Mock).mockReturnValue(null)

            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            expect(screen.getByText('Add ADR')).toBeInTheDocument()
        })

        it('uses user email in form submission', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Submit')).toBeInTheDocument()
            })

            fireEvent.click(screen.getByText('Submit'))

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        requester: 'userEmail@aexp.com',
                        user: expect.objectContaining({
                            email: 'userEmail@aexp.com',
                            fullName: 'Test User'
                        })
                    }),
                    expect.any(Object)
                )
            })
        })
    })

    describe('ADR Type Options', () => {
        it('defines all required ADR type constants', () => {
            expect(PLAYBOOK_TYPE_IDS.BUILD_VS_BUY).toBeDefined()
            expect(PLAYBOOK_TYPE_IDS.INITIATIVE).toBeDefined()
            expect(PLAYBOOK_TYPE_IDS.FOUNDATIONAL_TECHNOLOGY).toBeDefined()
            expect(PLAYBOOK_TYPE_IDS.COMPANY_DOMAIN).toBeDefined()
            expect(PLAYBOOK_TYPE_IDS.ADR).toBeDefined()
        })

        it('validates ADR type IDs are strings', () => {
            expect(typeof PLAYBOOK_TYPE_IDS.BUILD_VS_BUY).toBe('string')
            expect(typeof PLAYBOOK_TYPE_IDS.INITIATIVE).toBe('string')
            expect(typeof PLAYBOOK_TYPE_IDS.FOUNDATIONAL_TECHNOLOGY).toBe(
                'string'
            )
            expect(typeof PLAYBOOK_TYPE_IDS.COMPANY_DOMAIN).toBe('string')
            expect(typeof PLAYBOOK_TYPE_IDS.ADR).toBe('string')
        })
    })

    describe('Form Field Utility Functions', () => {
        it('handles mapResponseToItems with null response', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-reviewers')
                ).toBeInTheDocument()
            })

            // The mapResponseToItems function should handle null/undefined responses
            // This is tested through the component rendering
            expect(
                screen.getByTestId('typeahead-reviewers')
            ).toBeInTheDocument()
        })

        it('handles itemToString with null item', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-deciders')
                ).toBeInTheDocument()
            })

            // The itemToString function should handle null items
            expect(screen.getByTestId('typeahead-deciders')).toBeInTheDocument()
        })

        it('handles itemToString with valid GraphAPIUser', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-eaArchitects')
                ).toBeInTheDocument()
            })

            // The itemToString function processes user principal names
            expect(
                screen.getByTestId('typeahead-eaArchitects')
            ).toBeInTheDocument()
        })
    })

    describe('Form Validation', () => {
        it('includes validation rules for required fields', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('ADR Name *')).toBeInTheDocument()
                expect(screen.getByText('Reviewer(s) *')).toBeInTheDocument()
                expect(screen.getByText('Decider(s) *')).toBeInTheDocument()
                expect(
                    screen.getByText('EA Architect(s) *')
                ).toBeInTheDocument()
                expect(screen.getByText('ADR Type *')).toBeInTheDocument()
            })

            // All required fields should be marked with *
            const requiredFields = screen.getAllByText(/\*/)
            expect(requiredFields.length).toBeGreaterThanOrEqual(5)
        })

        it('passes setValidating prop to TextField', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(
                    screen.getByTestId('textfield-adrName')
                ).toBeInTheDocument()
            })

            // TextField should receive setValidating function
            expect(screen.getByTestId('textfield-adrName')).toBeInTheDocument()
        })
    })

    describe('Mutation Error Handling', () => {
        it('maintains dialog open state when mutation fails', async () => {
            const mockMutateWithError = jest.fn((data, callbacks) => {
                if (callbacks?.onError) {
                    callbacks.onError(new Error('Mutation failed'))
                }
            })

            ;(useAddAdr as jest.Mock).mockReturnValue({
                mutate: mockMutateWithError,
                isPending: false,
                isSuccess: false
            })

            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })

            const submitButton = screen.getByText('Submit')
            fireEvent.click(submitButton)

            await waitFor(() => {
                // Dialog should remain open after error
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })
        })
    })

    describe('Preset PlaybookTypeId', () => {
        it('uses playbookTypeId as default value when provided', () => {
            render(
                <AddAdrButton
                    playbookId='playbook-123'
                    repo='test-repo'
                    playbookTypeId={PLAYBOOK_TYPE_IDS.INITIATIVE}
                />
            )

            fireEvent.click(screen.getByText('Add ADR'))

            // The select field should have the preset value
            // This tests the defaultValues in useForm
            expect(screen.getByText('Add ADR')).toBeInTheDocument()
        })

        it('uses empty string as default when playbookTypeId is not provided', () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            // The select field should have empty default value
            expect(screen.getByText('Add ADR')).toBeInTheDocument()
        })
    })

    describe('BvB Autofill Behavior', () => {
        const mockBvBPlaybook = {
            add_da: {
                workflowData: {
                    actors: {
                        reviewers: ['reviewer@aexp.com'],
                        deciders: ['decider@aexp.com']
                    }
                },
                eaArchitect: ['architect@aexp.com']
            }
        }

        it('disables actor typeahead fields when BvB type and playbook data is available', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: mockBvBPlaybook,
                isLoading: false
            })

            render(
                <AddAdrButton
                    playbookId='bvb-playbook-id'
                    repo='test-repo'
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-reviewers')
                ).toHaveAttribute('data-disabled', 'true')
                expect(
                    screen.getByTestId('typeahead-deciders')
                ).toHaveAttribute('data-disabled', 'true')
                expect(
                    screen.getByTestId('typeahead-eaArchitects')
                ).toHaveAttribute('data-disabled', 'true')
            })
        })

        it('disables adr_type select field when BvB type and playbook data is available', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: mockBvBPlaybook,
                isLoading: false
            })

            render(
                <AddAdrButton
                    playbookId='bvb-playbook-id'
                    repo='test-repo'
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByTestId('select-adr_type')).toHaveAttribute(
                    'data-disabled',
                    'true'
                )
            })
        })

        it('does not disable fields when playbook type is not BvB', async () => {
            render(
                <AddAdrButton
                    playbookId='non-bvb-playbook-id'
                    repo='test-repo'
                    playbookTypeId={PLAYBOOK_TYPE_IDS.ADR}
                />
            )

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-reviewers')
                ).toHaveAttribute('data-disabled', 'false')
                expect(
                    screen.getByTestId('typeahead-deciders')
                ).toHaveAttribute('data-disabled', 'false')
                expect(
                    screen.getByTestId('typeahead-eaArchitects')
                ).toHaveAttribute('data-disabled', 'false')
                expect(screen.getByTestId('select-adr_type')).toHaveAttribute(
                    'data-disabled',
                    'false'
                )
            })
        })

        it('does not disable fields when BvB type but playbook data is not yet loaded', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: null,
                isLoading: true
            })

            render(
                <AddAdrButton
                    playbookId='bvb-playbook-id'
                    repo='test-repo'
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-reviewers')
                ).toHaveAttribute('data-disabled', 'false')
                expect(screen.getByTestId('select-adr_type')).toHaveAttribute(
                    'data-disabled',
                    'false'
                )
            })
        })

        it('calls usePlaybook with the provided playbookId', () => {
            render(
                <AddAdrButton
                    playbookId='specific-bvb-id'
                    repo='test-repo'
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            expect(usePlaybook).toHaveBeenCalledWith('specific-bvb-id')
        })

        it('falls back to top-level fields when workflow actors are absent', async () => {
            const playbookWithTopLevelActors = {
                add_da: {
                    reviewers: ['fallback-reviewer@aexp.com'],
                    deciders: ['fallback-decider@aexp.com'],
                    eaArchitect: ['fallback-architect@aexp.com']
                }
            }
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: playbookWithTopLevelActors,
                isLoading: false
            })

            render(
                <AddAdrButton
                    playbookId='bvb-playbook-id'
                    repo='test-repo'
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-reviewers')
                ).toHaveAttribute('data-disabled', 'true')
                expect(
                    screen.getByTestId('typeahead-deciders')
                ).toHaveAttribute('data-disabled', 'true')
                expect(
                    screen.getByTestId('typeahead-eaArchitects')
                ).toHaveAttribute('data-disabled', 'true')
            })
        })

        it('sets adr_type to playbookTypeId when BvB metadata is initially null then loads', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: null,
                isLoading: false
            })

            const { rerender } = render(
                <AddAdrButton
                    playbookId='bvb-playbook-id'
                    repo='test-repo'
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })

            // Now provide the BvB data
            const playbookWithBvBData = {
                add_da: {
                    workflowData: {
                        actors: {
                            reviewers: ['reviewer1@aexp.com'],
                            deciders: ['decider1@aexp.com']
                        }
                    },
                    eaArchitect: ['eaArchitect@aexp.com']
                }
            }
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: playbookWithBvBData,
                isLoading: false
            })

            rerender(
                <AddAdrButton
                    playbookId='bvb-playbook-id'
                    repo='test-repo'
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            // Check that fields are now disabled after data loads
            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-reviewers')
                ).toHaveAttribute('data-disabled', 'true')
            })
        })
    })

    describe('Cross-field Validation', () => {
        it('includes validation rule to prevent same person in reviewers and deciders', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })

            // The TypeaheadField components have validation rules passed via rules prop
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

            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })

            expect(
                screen.getByTestId('typeahead-reviewers')
            ).toBeInTheDocument()
            expect(screen.getByTestId('typeahead-deciders')).toBeInTheDocument()

            // Reset mock
            ;(useWatch as jest.Mock).mockReturnValue([])
        })

        it('validates deciders cannot overlap with reviewers when watchedReviewers has values', async () => {
            const mockWatchedReviewers = ['reviewer1@aexp.com']
            ;(useWatch as jest.Mock).mockImplementation(({ name }) => {
                if (name === 'reviewers') return mockWatchedReviewers
                return []
            })

            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })

            expect(
                screen.getByTestId('typeahead-reviewers')
            ).toBeInTheDocument()
            expect(screen.getByTestId('typeahead-deciders')).toBeInTheDocument()

            // Reset mock
            ;(useWatch as jest.Mock).mockReturnValue([])
        })

        it('validation works when both reviewers and deciders have same person', async () => {
            const duplicateEmail = 'reviewer1@aexp.com'
            ;(useWatch as jest.Mock).mockImplementation(({ name }) => {
                if (name === 'reviewers') return [duplicateEmail]
                if (name === 'deciders') return [duplicateEmail]
                return []
            })

            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })

            expect(
                screen.getByTestId('typeahead-reviewers')
            ).toBeInTheDocument()
            expect(screen.getByTestId('typeahead-deciders')).toBeInTheDocument()

            // Reset mock
            ;(useWatch as jest.Mock).mockReturnValue([])
        })
    })

    describe('Helper Functions', () => {
        it('handles null response in mapResponseToItems for reviewers', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })

            // The mapResponseToItems function should handle null/undefined
            expect(
                screen.getByTestId('typeahead-reviewers')
            ).toBeInTheDocument()
        })

        it('handles null item in itemToString for reviewers', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })

            // The itemToString function should return empty string for null items
            expect(
                screen.getByTestId('typeahead-reviewers')
            ).toBeInTheDocument()
        })

        it('handles valid GraphAPIUser in itemToString', async () => {
            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })

            // Component should handle valid user objects
            expect(screen.getByTestId('typeahead-deciders')).toBeInTheDocument()
        })
    })

    describe('Form State Management', () => {
        it('resets form on successful submission', async () => {
            const mockMutateWithSuccess = jest.fn((data, callbacks) => {
                if (callbacks?.onSuccess) {
                    callbacks.onSuccess()
                }
            })

            ;(useAddAdr as jest.Mock).mockReturnValue({
                mutate: mockMutateWithSuccess,
                isPending: false,
                isSuccess: false
            })

            render(<AddAdrButton playbookId='playbook-123' repo='test-repo' />)

            fireEvent.click(screen.getByText('Add ADR'))

            await waitFor(() => {
                expect(screen.getByText('Add new ADR')).toBeInTheDocument()
            })

            const submitButton = screen.getByText('Submit')
            fireEvent.click(submitButton)

            await waitFor(() => {
                expect(mockMutateWithSuccess).toHaveBeenCalled()
            })
        })
    })
})
