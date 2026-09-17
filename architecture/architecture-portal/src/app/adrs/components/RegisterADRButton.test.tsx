import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import RegisterADRButton from './RegisterADRButton'
import { useUserContext } from '@/context'
import { useAddAdr } from '@/app/docs/hooks/useAddAdr'
import { PLAYBOOK_TYPE_IDS } from '@/constants/playbookType'
import { usePlaybook } from '@/hooks'
import { getStatusByTask } from '@/app/build-vs-buys/components/StatusBadge'

// Mock dependencies
jest.mock('@/context')
jest.mock('@/app/docs/hooks/useAddAdr')
jest.mock('@/hooks', () => ({
    usePlaybook: jest.fn()
}))
jest.mock('@/app/build-vs-buys/components/StatusBadge', () => ({
    getStatusByTask: jest.fn()
}))
// Note: react-hook-form is not mocked here as RegisterADRButton relies on real implementation
// useWatch is available from react-hook-form for tests that need to reference it
jest.mock('@/app/onboarding-form/components', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TypeaheadField: ({ name, label, rules, control, disabled }: any) => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const React = require('react')
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Controller } = require('react-hook-form')
        return React.createElement(Controller, {
            name,
            control,
            defaultValue: [],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: ({ field }: any) =>
                React.createElement(
                    'div',
                    {
                        'data-testid': `typeahead-${name}`,
                        'data-disabled': disabled
                    },
                    React.createElement('label', null, label),
                    rules?.required && React.createElement('span', null, '*'),
                    React.createElement('input', { ...field, type: 'hidden' })
                )
        })
    }
}))
jest.mock('@/app/onboarding-form/components/TextField', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TextField: ({ name, label, placeholder, required, register }: any) => {
        const registration = register ? register(name) : {}
        return (
            <div data-testid={`textfield-${name}`}>
                <label>{label}</label>
                <input
                    {...registration}
                    placeholder={placeholder}
                    required={required}
                />
            </div>
        )
    }
}))
jest.mock('@/app/onboarding-form/components/NativeSelectField', () => ({
    NativeSelectField: ({
        name,
        label,
        options,
        required,
        visible = true,
        register,
        disabled
    }: {
        name: string
        label: string
        options: Array<{
            value: string
            displayText: string
            disabled?: boolean
        }>
        required?: boolean
        visible?: boolean
        register?: (name: string) => { name: string }
        disabled?: boolean
    }) => {
        const registration = register ? register(name) : { name }
        return visible ? (
            <div data-testid={`select-${name}`} data-disabled={disabled}>
                <label>{label}</label>
                <select
                    {...registration}
                    required={required}
                    disabled={disabled}
                >
                    {options.map(opt => (
                        <option
                            key={opt.value}
                            value={opt.value}
                            disabled={opt.disabled}
                        >
                            {opt.displayText}
                        </option>
                    ))}
                </select>
            </div>
        ) : null
    }
}))
jest.mock('@/app/onboarding-form/components/DatepickerField', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DatepickerField: ({ name, label, required, control, disabled }: any) => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const React = require('react')
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Controller } = require('react-hook-form')
        return React.createElement(Controller, {
            name,
            control,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: ({ field }: any) =>
                React.createElement(
                    'div',
                    {
                        'data-testid': `datepicker-${name}`,
                        'data-disabled': disabled,
                        'data-value':
                            field.value instanceof Date
                                ? field.value.toISOString()
                                : ''
                    },
                    React.createElement('label', null, label),
                    React.createElement('input', {
                        ...field,
                        value: undefined,
                        type: 'date',
                        required,
                        disabled
                    })
                )
        })
    }
}))

const mockUseUserContext = useUserContext as jest.MockedFunction<
    typeof useUserContext
>
const mockUseAddAdr = useAddAdr as jest.MockedFunction<typeof useAddAdr>

const mockUser = {
    attributes: {
        email: 'userEmail@aexp.com',
        fullName: 'Test User',
        employeeId: '12345'
    }
}

const defaultProps = {
    playbookId: 'playbook-123',
    repo: 'test-repo',
    fileId: 'file-123',
    fileName: 'Test ADR',
    playbookTypeId: PLAYBOOK_TYPE_IDS.ADR
}

describe('RegisterADRButton', () => {
    const mockMutate = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        mockUseUserContext.mockReturnValue(
            mockUser as unknown as ReturnType<typeof useUserContext>
        )
        mockUseAddAdr.mockReturnValue({
            mutate: mockMutate,
            isPending: false,
            isSuccess: false,
            isError: false,
            error: null,
            data: undefined,
            reset: jest.fn(),
            mutateAsync: jest.fn()
        } as unknown as ReturnType<typeof useAddAdr>)
        ;(usePlaybook as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false
        })
    })

    describe('Initial Render', () => {
        it('renders the Register ADR button', () => {
            render(<RegisterADRButton {...defaultProps} />)
            expect(screen.getByText('Register ADR')).toBeInTheDocument()
        })

        it('displays "Registering..." when isPending is true', () => {
            mockUseAddAdr.mockReturnValue({
                mutate: mockMutate,
                isPending: true,
                isSuccess: false,
                isError: false,
                error: null,
                data: undefined,
                reset: jest.fn(),
                mutateAsync: jest.fn()
            } as unknown as ReturnType<typeof useAddAdr>)

            render(<RegisterADRButton {...defaultProps} />)
            expect(screen.getByText('Registering...')).toBeInTheDocument()
        })
    })

    describe('Dialog Interaction', () => {
        it('opens the dialog when Register ADR button is clicked', async () => {
            render(<RegisterADRButton {...defaultProps} />)

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })
        })

        it('closes the dialog when Close button is clicked', async () => {
            render(<RegisterADRButton {...defaultProps} />)

            // Open dialog
            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            // Close dialog
            const closeButton = screen.getByText('Close')
            fireEvent.click(closeButton)

            await waitFor(() => {
                expect(
                    screen.queryByText('Register Existing ADR')
                ).not.toBeInTheDocument()
            })
        })
    })

    describe('Form Fields', () => {
        beforeEach(async () => {
            render(<RegisterADRButton {...defaultProps} />)
            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)
            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })
        })

        it('renders ADR Name field with default value', () => {
            const textField = screen.getByTestId('textfield-adrName')
            expect(textField).toBeInTheDocument()
            const input = textField.querySelector('input')
            expect(input).toHaveAttribute('name', 'adrName')
        })

        it('renders Reviewers typeahead field', () => {
            expect(
                screen.getByTestId('typeahead-reviewers')
            ).toBeInTheDocument()
            expect(screen.getByText('Reviewer(s)')).toBeInTheDocument()
        })

        it('renders Deciders typeahead field', () => {
            expect(screen.getByTestId('typeahead-deciders')).toBeInTheDocument()
            expect(screen.getByText('Decider(s)')).toBeInTheDocument()
        })

        it('renders EA Architects typeahead field', () => {
            expect(
                screen.getByTestId('typeahead-eaArchitects')
            ).toBeInTheDocument()
            expect(screen.getByText('EA Architect(s)')).toBeInTheDocument()
        })

        it('renders Status select field with correct options', () => {
            const statusField = screen.getByTestId('select-status')
            expect(statusField).toBeInTheDocument()

            const select = statusField.querySelector('select')
            const options = select?.querySelectorAll('option')

            expect(options).toHaveLength(5)
            expect(options?.[0]).toHaveTextContent('Select status')
            expect(options?.[1]).toHaveTextContent('In progress')
            expect(options?.[2]).toHaveTextContent('Under review')
            expect(options?.[3]).toHaveTextContent('Awaiting approval')
            expect(options?.[4]).toHaveTextContent('Approved')
        })

        it('renders ADR Type select field with correct options', () => {
            const adrTypeField = screen.getByTestId('select-adrType')
            expect(adrTypeField).toBeInTheDocument()

            const select = adrTypeField.querySelector('select')
            const options = select?.querySelectorAll('option')

            expect(options).toHaveLength(6) // 1 placeholder + 5 types
            expect(options?.[0]).toHaveTextContent('Select ADR Type')
            expect(options?.[1]).toHaveTextContent('Build vs Buy')
            expect(options?.[2]).toHaveTextContent('Initiative')
            expect(options?.[3]).toHaveTextContent('Foundational Technology')
            expect(options?.[4]).toHaveTextContent('Company Domain')
            expect(options?.[5]).toHaveTextContent('Enterprise ADR')
        })

        it('does not render Approved Date field initially', () => {
            expect(
                screen.queryByTestId('datepicker-approvedDate')
            ).not.toBeInTheDocument()
        })

        it('renders Approved Date field when status is APPROVED', async () => {
            // Change status to APPROVED
            const statusField = screen.getByTestId('select-status')
            const select = statusField.querySelector('select')!
            fireEvent.change(select, { target: { value: 'APPROVED' } })
            // Assert Approved Date field
            await waitFor(() => {
                expect(
                    screen.getByTestId('datepicker-approvedDate')
                ).toBeInTheDocument()
            })
        })
    })

    describe('Form Submission', () => {
        it('submits form with correct data structure', async () => {
            render(<RegisterADRButton {...defaultProps} />)

            // Open dialog
            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            // Wait for form fields to be registered
            await waitFor(() => {
                expect(
                    screen
                        .getByTestId('textfield-adrName')
                        .querySelector('input')
                ).toBeInTheDocument()
            })

            // Fill out required fields
            const adrNameInput = screen
                .getByTestId('textfield-adrName')
                .querySelector('input')!
            fireEvent.change(adrNameInput, { target: { value: 'Test ADR' } })

            const statusField = screen.getByTestId('select-status')
            const statusSelect = statusField.querySelector('select')!
            fireEvent.change(statusSelect, { target: { value: 'IN_PROGRESS' } })

            const adrTypeField = screen.getByTestId('select-adrType')
            const adrTypeSelect = adrTypeField.querySelector('select')!
            fireEvent.change(adrTypeSelect, {
                target: { value: defaultProps.playbookTypeId }
            })

            // Submit form
            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        playbookId: 'playbook-123',
                        repo: 'test-repo',
                        fileId: 'file-123',
                        adrName: 'Test ADR',
                        reviewers: [],
                        deciders: [],
                        eaArchitects: [],
                        requester: 'userEmail@aexp.com',
                        user: {
                            fullName: 'Test User',
                            email: 'userEmail@aexp.com'
                        },
                        status: 'IN_PROGRESS',
                        approvedDate: undefined
                    }),
                    expect.any(Object)
                )
            })
        })

        it('includes approvedDate when status is APPROVED', async () => {
            render(<RegisterADRButton {...defaultProps} />)

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            // Change status to APPROVED
            const statusField = screen.getByTestId('select-status')
            const select = statusField.querySelector('select')!
            fireEvent.change(select, { target: { value: 'APPROVED' } })

            await waitFor(() => {
                expect(
                    screen.getByTestId('datepicker-approvedDate')
                ).toBeInTheDocument()
            })

            // Submit form
            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled()
            })
        })

        it('handles missing user context gracefully', async () => {
            mockUseUserContext.mockReturnValue(
                null as unknown as ReturnType<typeof useUserContext>
            )

            render(<RegisterADRButton {...defaultProps} />)

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            // Submit form
            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        requester: '',
                        user: {
                            fullName: '',
                            email: ''
                        }
                    }),
                    expect.any(Object)
                )
            })
        })

        it('disables submit button when isPending', async () => {
            mockUseAddAdr.mockReturnValue({
                mutate: mockMutate,
                isPending: true,
                isSuccess: false,
                isError: false,
                error: null,
                data: undefined,
                reset: jest.fn(),
                mutateAsync: jest.fn()
            } as unknown as ReturnType<typeof useAddAdr>)

            render(<RegisterADRButton {...defaultProps} />)

            const registerButton = screen.getByText('Registering...')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            const submitButton = screen.getByText('Submitting...')
            expect(submitButton).toBeDisabled()
        })
    })

    describe('Success Handling', () => {
        it('closes dialog and resets form on successful submission', async () => {
            const mockMutateWithCallback = jest.fn((data, callbacks) => {
                // Immediately call onSuccess to simulate successful mutation
                if (callbacks?.onSuccess) {
                    callbacks.onSuccess()
                }
            })

            mockUseAddAdr.mockReturnValue({
                mutate: mockMutateWithCallback,
                isPending: false,
                isSuccess: false,
                isError: false,
                error: null,
                data: undefined,
                reset: jest.fn(),
                mutateAsync: jest.fn()
            } as unknown as ReturnType<typeof useAddAdr>)

            render(<RegisterADRButton {...defaultProps} />)

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            // Submit the form which will trigger the mutation with onSuccess callback
            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(
                    screen.queryByText('Register Existing ADR')
                ).not.toBeInTheDocument()
            })
        })
    })

    describe('Playbook Type Handling', () => {
        it('uses provided playbookTypeId as default ADR Type', async () => {
            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            const adrTypeField = screen.getByTestId('select-adrType')
            const select = adrTypeField.querySelector('select')!

            expect(select.value).toBe(PLAYBOOK_TYPE_IDS.BUILD_VS_BUY)
        })

        it('uses empty string as default when playbookTypeId is not provided', async () => {
            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={undefined}
                />
            )

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            const adrTypeField = screen.getByTestId('select-adrType')
            const select = adrTypeField.querySelector('select')!

            // When playbookTypeId is undefined, it defaults to empty string
            expect(select.value).toBe('')
        })
    })

    describe('Default Values', () => {
        it('sets fileName as default adrName', async () => {
            render(
                <RegisterADRButton {...defaultProps} fileName='My Custom ADR' />
            )

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            // The TextField mock doesn't show the value, but we can verify the prop was passed
            expect(screen.getByTestId('textfield-adrName')).toBeInTheDocument()
        })

        it('initializes with empty arrays for typeahead fields', async () => {
            render(<RegisterADRButton {...defaultProps} />)

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            // Submit form
            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        reviewers: [],
                        deciders: [],
                        eaArchitects: []
                    }),
                    expect.any(Object)
                )
            })
        })
    })

    describe('Button States', () => {
        it('shows Submit button text when not pending', async () => {
            render(<RegisterADRButton {...defaultProps} />)

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(screen.getByText('Submit')).toBeInTheDocument()
            })
        })

        it('shows Submitting... when isPending', async () => {
            mockUseAddAdr.mockReturnValue({
                mutate: mockMutate,
                isPending: true,
                isSuccess: false,
                isError: false,
                error: null,
                data: undefined,
                reset: jest.fn(),
                mutateAsync: jest.fn()
            } as unknown as ReturnType<typeof useAddAdr>)

            render(<RegisterADRButton {...defaultProps} />)

            const registerButton = screen.getByText('Registering...')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(screen.getByText('Submitting...')).toBeInTheDocument()
            })
        })
    })

    describe('All ADR Types', () => {
        const adrTypes = [
            { id: PLAYBOOK_TYPE_IDS.BUILD_VS_BUY, name: 'Build vs Buy' },
            { id: PLAYBOOK_TYPE_IDS.INITIATIVE, name: 'Initiative' },
            {
                id: PLAYBOOK_TYPE_IDS.FOUNDATIONAL_TECHNOLOGY,
                name: 'Foundational Technology'
            },
            { id: PLAYBOOK_TYPE_IDS.COMPANY_DOMAIN, name: 'Company Domain' },
            { id: PLAYBOOK_TYPE_IDS.ADR, name: 'Enterprise ADR' }
        ]

        it.each(adrTypes)(
            'displays $name option in ADR Type dropdown',
            async ({ name }) => {
                render(<RegisterADRButton {...defaultProps} />)

                const registerButton = screen.getByText('Register ADR')
                fireEvent.click(registerButton)

                await waitFor(() => {
                    expect(screen.getByText(name)).toBeInTheDocument()
                })
            }
        )
    })

    describe('BvB Autofill Behavior', () => {
        const mockBvBPlaybook = {
            add_da: {
                workflowData: {
                    actors: {
                        reviewers: ['reviewer1@aexp.com'],
                        deciders: ['decider1@aexp.com']
                    }
                },
                eaArchitect: ['eaArchitect@aexp.com'],
                status: 'inProgress'
            }
        }

        it('disables actor typeahead fields when BvB type and playbook data is available', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: mockBvBPlaybook,
                isLoading: false
            })

            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

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

        it('disables status and adrType select fields when BvB type and playbook data is available', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: mockBvBPlaybook,
                isLoading: false
            })

            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

            await waitFor(() => {
                expect(screen.getByTestId('select-status')).toHaveAttribute(
                    'data-disabled',
                    'true'
                )
                expect(screen.getByTestId('select-adrType')).toHaveAttribute(
                    'data-disabled',
                    'true'
                )
            })
        })

        it('does not disable fields when playbook type is not BvB', async () => {
            render(<RegisterADRButton {...defaultProps} />)

            fireEvent.click(screen.getByText('Register ADR'))

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
                expect(screen.getByTestId('select-status')).toHaveAttribute(
                    'data-disabled',
                    'false'
                )
                expect(screen.getByTestId('select-adrType')).toHaveAttribute(
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
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-reviewers')
                ).toHaveAttribute('data-disabled', 'false')
                expect(screen.getByTestId('select-status')).toHaveAttribute(
                    'data-disabled',
                    'false'
                )
                expect(screen.getByTestId('select-adrType')).toHaveAttribute(
                    'data-disabled',
                    'false'
                )
            })
        })

        it('calls usePlaybook with the provided playbookId', () => {
            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookId='specific-bvb-id'
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            expect(usePlaybook).toHaveBeenCalledWith('specific-bvb-id')
        })

        it('falls back to top-level actor fields when workflowData has no actors', async () => {
            const playbookWithTopLevelActors = {
                add_da: {
                    reviewers: ['fallback-reviewer1@aexp.com'],
                    deciders: ['fallback-decider1@aexp.com'],
                    eaArchitect: ['fallback-eaArchitect@aexp.com']
                }
            }
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: playbookWithTopLevelActors,
                isLoading: false
            })

            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

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

        it('maps BvB approved status to ADR APPROVED and shows datepicker', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: {
                    add_da: {
                        workflowData: {
                            actors: {
                                reviewers: ['reviewer1@aexp.com'],
                                deciders: ['decider1@aexp.com']
                            }
                        },
                        eaArchitect: ['eaArchitect@aexp.com'],
                        status: 'approved'
                    }
                },
                isLoading: false
            })

            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

            await waitFor(() => {
                expect(
                    screen.getByTestId('datepicker-approvedDate')
                ).toBeInTheDocument()
            })
        })

        it('maps BvB inReview status to ADR UNDER_REVIEW via direct status field', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: {
                    add_da: {
                        workflowData: {
                            actors: {
                                reviewers: ['reviewer1@aexp.com'],
                                deciders: ['decider1@aexp.com']
                            }
                        },
                        eaArchitect: ['eaArchitect@aexp.com'],
                        status: 'inReview'
                    }
                },
                isLoading: false
            })

            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({ status: 'UNDER_REVIEW' }),
                    expect.any(Object)
                )
            })
        })

        it('uses getStatusByTask to derive status when currentTask is present', async () => {
            ;(getStatusByTask as jest.Mock).mockReturnValue('awaitingApproval')
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: {
                    add_da: {
                        workflowData: {
                            currentTask: { step: 'WaitForDeciders' },
                            actors: {
                                reviewers: ['reviewer1@aexp.com'],
                                deciders: ['decider1@aexp.com']
                            }
                        },
                        eaArchitect: ['eaArchitect@aexp.com']
                    }
                },
                isLoading: false
            })

            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            expect(getStatusByTask).toHaveBeenCalledWith(
                'WaitForDeciders',
                expect.objectContaining({
                    currentTask: { step: 'WaitForDeciders' }
                })
            )

            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({ status: 'AWAITING_APPROVAL' }),
                    expect.any(Object)
                )
            })
        })

        it('maps BvB awaitingAcceptance status to ADR IN_PROGRESS', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: {
                    add_da: {
                        workflowData: {
                            actors: {
                                reviewers: ['reviewer1@aexp.com'],
                                deciders: ['decider1@aexp.com']
                            }
                        },
                        eaArchitect: ['eaArchitect@aexp.com'],
                        status: 'awaitingAcceptance'
                    }
                },
                isLoading: false
            })

            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({ status: 'IN_PROGRESS' }),
                    expect.any(Object)
                )
            })
        })

        it('maps BvB inProgress status to ADR IN_PROGRESS', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: {
                    add_da: {
                        workflowData: {
                            actors: {
                                reviewers: ['reviewer1@aexp.com'],
                                deciders: ['decider1@aexp.com']
                            }
                        },
                        eaArchitect: ['eaArchitect@aexp.com'],
                        status: 'inProgress'
                    }
                },
                isLoading: false
            })

            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({ status: 'IN_PROGRESS' }),
                    expect.any(Object)
                )
            })
        })

        it('maps BvB rejected status to ADR IN_PROGRESS', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: {
                    add_da: {
                        workflowData: {
                            actors: {
                                reviewers: ['reviewer1@aexp.com'],
                                deciders: ['decider1@aexp.com']
                            }
                        },
                        eaArchitect: ['eaArchitect@aexp.com'],
                        status: 'rejected'
                    }
                },
                isLoading: false
            })

            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({ status: 'IN_PROGRESS' }),
                    expect.any(Object)
                )
            })
        })

        it('defaults to IN_PROGRESS when BvB status is unknown', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: {
                    add_da: {
                        workflowData: {
                            actors: {
                                reviewers: ['reviewer1@aexp.com'],
                                deciders: ['decider1@aexp.com']
                            }
                        },
                        eaArchitect: ['eaArchitect@aexp.com'],
                        status: 'unknownStatus'
                    }
                },
                isLoading: false
            })

            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({ status: 'IN_PROGRESS' }),
                    expect.any(Object)
                )
            })
        })

        it('autofills and locks Approved Date when BvB workflow has completedAt', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: {
                    add_da: {
                        workflowData: {
                            actors: {
                                reviewers: ['reviewer1@aexp.com'],
                                deciders: ['decider1@aexp.com']
                            },
                            completedAt: '2026-03-14T10:15:00.000Z'
                        },
                        eaArchitect: ['eaArchitect@aexp.com'],
                        status: 'approved'
                    }
                },
                isLoading: false
            })

            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

            await waitFor(() => {
                const datepicker = screen.getByTestId('datepicker-approvedDate')
                expect(datepicker).toHaveAttribute('data-disabled', 'true')
                expect(datepicker).toHaveAttribute(
                    'data-value',
                    '2026-03-14T10:15:00.000Z'
                )
            })

            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        status: 'APPROVED',
                        approvedDate: '2026-03-14'
                    }),
                    expect.any(Object)
                )
            })
        })

        it('leaves Approved Date empty and editable when BvB workflow has no completedAt', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: {
                    add_da: {
                        workflowData: {
                            actors: {
                                reviewers: ['reviewer1@aexp.com'],
                                deciders: ['decider1@aexp.com']
                            }
                        },
                        eaArchitect: ['eaArchitect@aexp.com'],
                        status: 'approved'
                    }
                },
                isLoading: false
            })

            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

            await waitFor(() => {
                const datepicker = screen.getByTestId('datepicker-approvedDate')
                expect(datepicker).toHaveAttribute('data-disabled', 'false')
                expect(datepicker).toHaveAttribute('data-value', '')
            })
        })

        it('autofills adrType when BvB metadata is available', async () => {
            ;(usePlaybook as jest.Mock).mockReturnValue({
                data: {
                    add_da: {
                        workflowData: {
                            actors: {
                                reviewers: ['reviewer1@aexp.com'],
                                deciders: ['decider1@aexp.com']
                            }
                        },
                        eaArchitect: ['eaArchitect@aexp.com'],
                        status: 'inProgress'
                    }
                },
                isLoading: false
            })

            render(
                <RegisterADRButton
                    {...defaultProps}
                    playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                />
            )

            fireEvent.click(screen.getByText('Register ADR'))

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        adr_type: PLAYBOOK_TYPE_IDS.BUILD_VS_BUY
                    }),
                    expect.any(Object)
                )
            })
        })
    })

    describe('Cross-field Validation', () => {
        it('includes validation rule to prevent same person in reviewers and deciders', async () => {
            render(<RegisterADRButton {...defaultProps} />)

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            // The TypeaheadField components have validation rules
            expect(
                screen.getByTestId('typeahead-reviewers')
            ).toBeInTheDocument()
            expect(screen.getByTestId('typeahead-deciders')).toBeInTheDocument()
        })
    })

    describe('Helper Functions', () => {
        it('handles null response in mapResponseToItems for all typeahead fields', async () => {
            render(<RegisterADRButton {...defaultProps} />)

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-reviewers')
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('typeahead-deciders')
                ).toBeInTheDocument()
                expect(
                    screen.getByTestId('typeahead-eaArchitects')
                ).toBeInTheDocument()
            })
        })

        it('handles null item in itemToString for all typeahead fields', async () => {
            render(<RegisterADRButton {...defaultProps} />)

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByTestId('typeahead-reviewers')
                ).toBeInTheDocument()
            })
        })
    })

    describe('Form State Management', () => {
        it('resets form on successful submission', async () => {
            const mockMutateWithSuccess = jest.fn((data, callbacks) => {
                if (callbacks?.onSuccess) {
                    callbacks.onSuccess()
                }
            })

            mockUseAddAdr.mockReturnValue({
                mutate: mockMutateWithSuccess,
                isPending: false,
                isSuccess: false,
                isError: false,
                error: null,
                data: undefined,
                reset: jest.fn(),
                mutateAsync: jest.fn()
            } as unknown as ReturnType<typeof useAddAdr>)

            render(<RegisterADRButton {...defaultProps} />)

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            const form = document.getElementById('register-adr-form')!
            fireEvent.submit(form)

            await waitFor(() => {
                expect(mockMutateWithSuccess).toHaveBeenCalled()
            })
        })

        it('uses fileName as default adrName value', async () => {
            render(
                <RegisterADRButton
                    {...defaultProps}
                    fileName='Custom ADR Name'
                />
            )

            const registerButton = screen.getByText('Register ADR')
            fireEvent.click(registerButton)

            await waitFor(() => {
                expect(
                    screen.getByText('Register Existing ADR')
                ).toBeInTheDocument()
            })

            expect(screen.getByTestId('textfield-adrName')).toBeInTheDocument()
        })
    })
})
