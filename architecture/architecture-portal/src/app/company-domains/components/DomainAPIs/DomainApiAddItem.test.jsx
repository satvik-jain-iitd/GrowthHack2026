import React from 'react'
import { render } from '@/test/utils/test-utils'
import { screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DomainApiAddItem } from './DomainApiAddItem'
import { useSaveApiData } from '@/app/company-domains/hooks'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useQueryClient } from '@tanstack/react-query'
import {
    DOMAIN_TEST_IDS,
    DOMAIN_TEST_LABEL,
    DOMAIN_TEST_ROLE,
    DOMAIN_TEST_TEXT
} from '../../test-ids'

jest.setTimeout(20000)

jest.mock('@/hooks/useUserInfo', () => ({
    useUserInfo: jest.fn(() => ({
        userInfo: { displayName: 'Test User' },
        isLoading: false,
        error: null
    }))
}))

jest.mock('@tanstack/react-query', () => {
    const actualReactQuery = jest.requireActual('@tanstack/react-query')
    return {
        ...actualReactQuery,
        useQueryClient: jest.fn(() => ({
            invalidateQueries: jest.fn().mockResolvedValue(undefined)
        }))
    }
})

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}))

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ alt, ...props }) => <img alt={alt || 'test-image'} {...props} />
}))

jest.mock('@/context/UserContext', () => ({
    useUserContext: jest.fn(() => ({
        attributes: { email: 'user@test.com' },
        groups: []
    }))
}))
jest.mock('@/app/company-domains/hooks', () => {
    const actualHooks = jest.requireActual('@/app/company-domains/hooks')
    const ebcmMockData = {
        '1 Payments': {
            id: '1',
            name: '1 Payments',
            children: {
                '1.1 Processing': {
                    id: '1.1',
                    name: '1.1 Processing',
                    children: {
                        '1.1.1 Settlement': {
                            id: '1.1.1',
                            name: '1.1.1 Settlement',
                            children: {
                                '1.1.1.1 Clearance': {
                                    id: '1.1.1.1',
                                    name: '1.1.1.1 Clearance'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return {
        ...actualHooks,
        useDomainApiWithEndpointDetails: jest.fn(() => ({
            refresh: jest.fn()
        })),
        useEBCMLevels: jest.fn(() => ({
            fetchData: jest.fn(),
            ebcmLevelsData: ebcmMockData,
            isLoading: false,
            serverError: null
        })),
        useGetReviewer: jest.fn(() => ({
            isLoading: false,
            data: null
        })),
        useEBCMSearch: jest.fn(() => ({
            sortedList1: [{ id: '1', name: '1 Payments' }]
        })),
        useSaveApiData: jest.fn(() => ({
            mutateAsync: jest.fn()
        })),
        useDomainMap: jest.fn(() => ({
            companyDomainsData: [
                {
                    label: 'Payments',
                    value: 'domain-1',
                    company_domain_id: 'domain-1',
                    domain_nm: 'Payments',
                    isFixed: true
                },
                {
                    label: 'Lending',
                    value: 'domain-2',
                    company_domain_id: 'domain-2',
                    domain_nm: 'Lending'
                }
            ],
            domainMap: {
                'domain-1': {
                    label: 'Payments',
                    value: 'domain-1',
                    company_domain_id: 'domain-1',
                    domain_nm: 'Payments',
                    isFixed: true,
                    subDomains: [
                        {
                            label: 'Card Issuance',
                            value: 'sub-1',
                            company_sub_domain_id: 'sub-1'
                        }
                    ]
                },
                'domain-2': {
                    label: 'Lending',
                    value: 'domain-2',
                    company_domain_id: 'domain-2',
                    domain_nm: 'Lending',
                    subDomains: []
                }
            }
        }))
    }
})

beforeAll(() => {
    if (!Element.prototype.scrollIntoView) {
        Element.prototype.scrollIntoView = jest.fn()
    }
})

describe('DomainApiAddItem', () => {
    const companySubDomains = [
        {
            company_sub_domain_id: 'sub-1',
            company_domain_id: 'domain-1',
            sub_domain_nm: 'Card Issuance'
        }
    ]
    const companyDomains = [
        {
            company_domain_id: 'domain-1',
            playbook_id: 'playbook-1',
            domain_nm: 'Payments'
        },
        {
            company_domain_id: 'domain-2',
            playbook_id: 'playbook-2',
            domain_nm: 'Lending'
        }
    ]

    const fillRequiredOperationFields = async ({
        apiType = 'Type B',
        journeyLink = 'https://architecture.aexp.com/architecture-docs/test'
    } = {}) => {
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.operation),
            'Test Operation'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.description),
            'Test Operation Description'
        )

        const apiTypeContainer = screen.getByTestId(
            DOMAIN_TEST_IDS.apiTypeField
        )
        await userEvent.click(
            within(apiTypeContainer).getByRole(DOMAIN_TEST_ROLE.combobox)
        )
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.option, { name: apiType })
        )
        await userEvent.keyboard('{Escape}')

        const journeyInput = screen.getByTestId(DOMAIN_TEST_IDS.journeyLink)
        await userEvent.clear(journeyInput)
        if (journeyLink) {
            await userEvent.type(journeyInput, journeyLink)
        }

        const intendedMarketsContainer = screen.getByTestId(
            DOMAIN_TEST_IDS.intendedMarketsField
        )
        await userEvent.click(
            within(intendedMarketsContainer).getByRole(
                DOMAIN_TEST_ROLE.combobox
            )
        )
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.option, {
                name: new RegExp(DOMAIN_TEST_TEXT.global, 'i')
            })
        )
        await userEvent.keyboard('{Escape}')

        const consumerDomainContainer = screen.getByTestId(
            DOMAIN_TEST_IDS.consumerDomainField
        )
        await userEvent.click(
            within(consumerDomainContainer).getByRole(DOMAIN_TEST_ROLE.combobox)
        )
        const consumerDomainOption =
            screen.queryByRole(DOMAIN_TEST_ROLE.option, {
                name: DOMAIN_TEST_TEXT.lending
            }) ||
            screen.queryByRole(DOMAIN_TEST_ROLE.option, {
                name: DOMAIN_TEST_TEXT.payments
            }) ||
            screen.getByRole(DOMAIN_TEST_ROLE.option, {
                name: /Third Party Domains/i
            })
        await userEvent.click(consumerDomainOption)
        await userEvent.keyboard('{Escape}')

        await userEvent.type(
            screen.getByTitle(DOMAIN_TEST_TEXT.operationInput),
            'Test Input'
        )
        await userEvent.type(
            screen.getByTitle(DOMAIN_TEST_TEXT.operationOutput),
            'Test Output'
        )

        await userEvent.type(screen.getByTestId('slaResponseTime'), '100')
        await userEvent.type(screen.getByTestId('slaAverageRps'), '10')
        await userEvent.type(screen.getByTestId('slaPeakRps'), '100')
        await userEvent.type(screen.getByTestId('slaErrorRate'), '1')
        await userEvent.type(screen.getByTestId('slaAvailability'), '99.9')
    }

    const selectEbcmLevel1 = async () => {
        const level1Container = screen.getByTestId(
            DOMAIN_TEST_IDS.ebcmLevel1Field
        )
        await userEvent.click(
            within(level1Container).getByRole(DOMAIN_TEST_ROLE.combobox)
        )
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.option, {
                name: DOMAIN_TEST_TEXT.ebcmOptionLevel1
            })
        )
    }

    const baseRejectedApiData = {
        api_id: 'api-rejected-123',
        api_metadata_id: 'api-rejected-123',
        api_nm: 'Rejected API',
        api_ds: 'This API was rejected',
        isrejected: 'true',
        status: 'REJECTED',
        prvd_company_domain_id: ['domain-1'],
        consm_company_domain_id: ['domain-2'],
        ebcm_da: [],
        add_da: {}
    }

    const renderRejectedApiForm = (
        apiOverrides = {},
        editRowOverrides = {}
    ) => {
        const apiData = { ...baseRejectedApiData, ...apiOverrides }
        return render(
            <DomainApiAddItem
                cancelAdd={jest.fn()}
                domainId={companyDomains[0].company_domain_id}
                reloadData={jest.fn()}
                isEditRow={{
                    api_id:
                        apiData.api_metadata_id ||
                        baseRejectedApiData.api_metadata_id,
                    api_data: apiData,
                    api_nm: apiData.api_nm,
                    isApiEdit: true,
                    ...editRowOverrides
                }}
                ebcmLevelsData={{}}
                setIsValuesChanged={jest.fn()}
                handleTimeOutModalOpen={jest.fn()}
                apiData={[]}
                refreshApiData={jest.fn()}
                apiEndpointData={{}}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )
    }

    beforeEach(() => {
        jest.clearAllMocks()
        useSaveApiData.mockImplementation(() => ({
            mutateAsync: jest.fn()
        }))
        useQueryClient.mockReturnValue({
            invalidateQueries: jest.fn().mockResolvedValue(undefined)
        })
    })

    it('validates provider domain required condition in API form', async () => {
        renderRejectedApiForm({
            api_nm: 'Edited API',
            api_ds: 'Edited API Description',
            isrejected: 'false',
            status: 'DRAFT',
            prvd_company_domain_id: ['domain-2'],
            consm_company_domain_id: ['domain-2']
        })

        const providerDomain = screen.getByTestId(
            DOMAIN_TEST_IDS.providerDomainField
        )

        await userEvent.click(
            within(providerDomain).getByRole(DOMAIN_TEST_ROLE.button, {
                name: new RegExp(DOMAIN_TEST_TEXT.removeLending, 'i')
            })
        )

        await waitFor(() => {
            expect(
                within(providerDomain).queryByText('Lending')
            ).not.toBeInTheDocument()
        })
    })

    it('validates operations-form required conditions in edit-row operation mode', async () => {
        render(
            <DomainApiAddItem
                cancelAdd={jest.fn()}
                domainId='domain-1'
                reloadData={jest.fn()}
                isEditRow={{
                    api_id: 'api-operation-1',
                    api_nm: '',
                    isApiEdit: false,
                    api_data: {
                        api_metadata_id: 'api-operation-1',
                        api_nm: '',
                        api_ds: '',
                        status: 'DRAFT',
                        prvd_company_domain_id: ['domain-1'],
                        consm_company_domain_id: ['domain-2'],
                        ebcm_da: [],
                        co_editors: [],
                        add_da: {}
                    }
                }}
                ebcmLevelsData={{}}
                setIsValuesChanged={jest.fn()}
                handleTimeOutModalOpen={jest.fn()}
                apiData={[
                    {
                        api_metadata_id: 'api-meta-1',
                        api_nm: 'Existing API'
                    }
                ]}
                refreshApiData={jest.fn()}
                apiEndpointData={{}}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.proposeOperation
            })
        )

        await waitFor(() => {
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.apiTypeError)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.operationError)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.descriptionError)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.intendedMarketsError)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.inputError)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.outputError)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.journeyLinkError)
            ).toBeInTheDocument()
        })

        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.apiError)
        ).not.toBeInTheDocument()
    })

    it('renders co-editor avatars when co-editors are provided', () => {
        const coEditors = ['user1@test.com', 'user2@test.com']

        const { container } = renderRejectedApiForm({
            co_editors: coEditors
        })

        const coEditorNodes = container.querySelectorAll('.co-editor-info')
        expect(coEditorNodes).toHaveLength(coEditors.length)

        coEditors.forEach(email => {
            expect(useUserInfo).toHaveBeenCalledWith(email)
        })
    })

    it('opens co-editors list when clicking the avatar group', () => {
        const coEditors = ['user@test.com']
        const setOpenCoEditorsModal = jest.fn()
        const actualUseState = React.useState
        const useStateSpy = jest
            .spyOn(React, 'useState')
            .mockImplementation(initial => {
                const [state, setState] = actualUseState(initial)

                if (
                    initial &&
                    typeof initial === 'object' &&
                    'coEditorsList' in initial &&
                    'addCoEditors' in initial
                ) {
                    const wrappedSetState = value => {
                        setOpenCoEditorsModal(value)
                        return setState(value)
                    }

                    return [state, wrappedSetState]
                }

                return [state, setState]
            })

        try {
            const { container } = renderRejectedApiForm({
                co_editors: coEditors
            })

            const coEditorNode = container.querySelector('.co-editor-info')
            expect(coEditorNode).toBeInTheDocument()

            fireEvent.click(coEditorNode)

            expect(setOpenCoEditorsModal).toHaveBeenCalledWith(
                expect.objectContaining({ coEditorsList: true })
            )
        } finally {
            useStateSpy.mockRestore()
        }
    })

    it('returns early on SUBMIT when co-editor emails are invalid', async () => {
        const mockMutateAsync = jest.fn()

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        render(
            <DomainApiAddItem
                cancelAdd={jest.fn()}
                domainId='domain-1'
                reloadData={jest.fn()}
                isEditRow={{
                    api_id: '',
                    api_nm: '',
                    isApiEdit: false,
                    api_data: {
                        api_metadata_id: '',
                        api_nm: '',
                        api_ds: '',
                        status: 'DRAFT',
                        prvd_company_domain_id: ['domain-1'],
                        consm_company_domain_id: ['domain-2'],
                        ebcm_da: [],
                        co_editors: ['user3@test.com'],
                        add_da: {}
                    }
                }}
                ebcmLevelsData={{}}
                setIsValuesChanged={jest.fn()}
                handleTimeOutModalOpen={jest.fn()}
                apiData={[]}
                refreshApiData={jest.fn()}
                apiEndpointData={{}}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )

        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            'Email API'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            'Email API Description'
        )

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submit
            })
        )

        await waitFor(() => {
            expect(mockMutateAsync).not.toHaveBeenCalled()
        })
    })

    it('shows operation duplicate-name error when operation save response is duplicate', async () => {
        const duplicateMessage = 'Operation already exists'
        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: false,
            json: async () => ({
                status: 400,
                data: { isDuplicateName: true },
                message: duplicateMessage
            })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        render(
            <DomainApiAddItem
                cancelAdd={jest.fn()}
                domainId='domain-1'
                reloadData={jest.fn()}
                isEditRow={{
                    api_id: 'api-operation-2',
                    api_nm: 'Existing API',
                    isApiEdit: false,
                    api_data: {
                        api_metadata_id: 'api-operation-2',
                        api_nm: 'Existing API',
                        api_ds: 'Existing API Description',
                        status: 'DRAFT',
                        prvd_company_domain_id: ['domain-1'],
                        consm_co_dmn_da: ['domain-2'],
                        ebcm_da: [],
                        co_editors: [],
                        add_da: {}
                    }
                }}
                ebcmLevelsData={{}}
                setIsValuesChanged={jest.fn()}
                handleTimeOutModalOpen={jest.fn()}
                apiData={[
                    {
                        api_metadata_id: 'api-operation-2',
                        api_nm: 'Existing API'
                    }
                ]}
                refreshApiData={jest.fn()}
                apiEndpointData={{}}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )

        await fillRequiredOperationFields()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.proposeOperation
            })
        )

        await waitFor(() => {
            expect(
                screen.getByText(new RegExp(duplicateMessage, 'i'))
            ).toBeInTheDocument()
            expect(mockMutateAsync).toHaveBeenCalledTimes(1)
        })
    })

    it('shows add-EBCM validation when an EBCM level is selected but not added', async () => {
        const mockMutateAsync = jest.fn()

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        render(
            <DomainApiAddItem
                cancelAdd={jest.fn()}
                domainId='domain-1'
                reloadData={jest.fn()}
                isEditRow={{
                    api_id: 'api-operation-ebcm-validation',
                    api_nm: 'Existing API',
                    isApiEdit: false,
                    api_data: {
                        api_metadata_id: 'api-operation-ebcm-validation',
                        api_nm: 'Existing API',
                        api_ds: 'Existing API Description',
                        status: 'DRAFT',
                        prvd_company_domain_id: ['domain-1'],
                        consm_company_domain_id: ['domain-2'],
                        ebcm_da: [],
                        co_editors: [],
                        add_da: {}
                    }
                }}
                ebcmLevelsData={{}}
                setIsValuesChanged={jest.fn()}
                handleTimeOutModalOpen={jest.fn()}
                apiData={[
                    {
                        api_metadata_id: 'api-operation-ebcm-validation',
                        api_nm: 'Existing API'
                    }
                ]}
                refreshApiData={jest.fn()}
                apiEndpointData={{}}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )

        await fillRequiredOperationFields()
        await selectEbcmLevel1()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.proposeOperation
            })
        )

        await waitFor(() => {
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.addEbcmError)
            ).toBeInTheDocument()
            expect(mockMutateAsync).not.toHaveBeenCalled()
        })
    })

    it('adds and removes EBCM tag and includes EBCM values in operation save payload', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    api_endpoint_metadata_id: 'endpoint-ebcm-1'
                }
            })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        render(
            <DomainApiAddItem
                cancelAdd={jest.fn()}
                domainId='domain-1'
                reloadData={jest.fn()}
                isEditRow={{
                    api_id: 'api-operation-ebcm-save',
                    api_nm: 'Existing API',
                    isApiEdit: false,
                    api_data: {
                        api_metadata_id: 'api-operation-ebcm-save',
                        api_nm: 'Existing API',
                        api_ds: 'Existing API Description',
                        status: 'DRAFT',
                        prvd_company_domain_id: ['domain-1'],
                        consm_company_domain_id: ['domain-2'],
                        ebcm_da: [],
                        co_editors: [],
                        add_da: {}
                    }
                }}
                ebcmLevelsData={{}}
                setIsValuesChanged={jest.fn()}
                handleTimeOutModalOpen={jest.fn()}
                apiData={[
                    {
                        api_metadata_id: 'api-operation-ebcm-save',
                        api_nm: 'Existing API'
                    }
                ]}
                refreshApiData={jest.fn()}
                apiEndpointData={{}}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )

        await fillRequiredOperationFields()
        await selectEbcmLevel1()

        await userEvent.click(screen.getByTestId(DOMAIN_TEST_IDS.addEbcmButton))

        await waitFor(() => {
            expect(
                screen.getByText(DOMAIN_TEST_TEXT.ebcmOptionLevel1)
            ).toBeInTheDocument()
        })

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.save
            })
        )

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    isApiFormEnabled: false,
                    requestBody: expect.objectContaining({
                        ebcm_da: ['1']
                    })
                })
            )
        })

        const closeButtons = screen.getAllByTestId(DOMAIN_TEST_IDS.ebcmClose)
        await userEvent.click(closeButtons[0])

        await waitFor(() => {
            expect(
                screen.queryByText(DOMAIN_TEST_TEXT.ebcmOptionLevel1)
            ).not.toBeInTheDocument()
        })
    })

    it('shows API duplicate-name error when API submit response is duplicate', async () => {
        const duplicateMessage = 'API already exists'
        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: false,
            json: async () => ({
                status: 400,
                data: { isDuplicateName: true },
                message: duplicateMessage
            })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderRejectedApiForm({
            api_nm: 'Unique API Name',
            api_ds: 'Updated API description'
        })

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submitForReview
            })
        )

        const yesButton = await screen.findByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.yes
        })
        await userEvent.click(yesButton)

        await waitFor(() => {
            expect(
                screen.getByText(new RegExp(duplicateMessage, 'i'))
            ).toBeInTheDocument()
            expect(mockMutateAsync).toHaveBeenCalledTimes(1)
        })
    })

    it('handles successful submit-and-continue in API mode', async () => {
        const reloadData = jest.fn()
        const invalidateQueries = jest.fn().mockResolvedValue(undefined)
        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    api_nm: 'Submitted API',
                    api_metadata_id: 'api-submitted-1'
                }
            })
        })

        useQueryClient.mockReturnValue({
            invalidateQueries
        })
        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        render(
            <DomainApiAddItem
                cancelAdd={jest.fn()}
                domainId='domain-1'
                reloadData={reloadData}
                isEditRow={{
                    api_id: '',
                    api_nm: '',
                    isApiEdit: false,
                    api_data: {
                        api_metadata_id: '',
                        api_nm: '',
                        api_ds: '',
                        status: 'DRAFT',
                        prvd_company_domain_id: ['domain-1'],
                        consm_company_domain_id: ['domain-2'],
                        ebcm_da: [],
                        co_editors: [],
                        add_da: {}
                    }
                }}
                ebcmLevelsData={{}}
                setIsValuesChanged={jest.fn()}
                handleTimeOutModalOpen={jest.fn()}
                apiData={[]}
                refreshApiData={jest.fn()}
                apiEndpointData={{}}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )

        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            'Submitted API'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            'API description for submit and continue'
        )

        const submitAndAddButton = screen.getByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.submitAndAddOperation
        })
        await userEvent.click(submitAndAddButton)

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    isApiFormEnabled: true,
                    requestBody: expect.objectContaining({
                        api_nm: 'Submitted API'
                    })
                })
            )
            expect(invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['fetchApiEndpointWithDetails', 'domain-1']
            })
            expect(reloadData).toHaveBeenCalledTimes(1)
        })

        await waitFor(() => {
            expect(
                screen.getByRole(DOMAIN_TEST_ROLE.heading, {
                    name: DOMAIN_TEST_TEXT.proposingOperation
                })
            ).toBeInTheDocument()
        })
    })

    it('returns safely when mutation response is undefined', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValue(undefined)

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderRejectedApiForm({
            api_nm: 'No Response API',
            api_ds: 'No response from mutation'
        })

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submitForReview
            })
        )

        const yesButton = await screen.findByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.yes
        })
        await userEvent.click(yesButton)

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledTimes(1)
        })
        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.modalConfirmationHeader)
        ).not.toBeInTheDocument()
    })

    it('shows session expired message when submit returns 400 non-duplicate', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: false,
            json: async () => ({
                status: 400,
                data: { isDuplicateName: false },
                message: 'bad request'
            })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderRejectedApiForm({
            api_nm: 'Session API',
            api_ds: 'Session path test'
        })

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submitForReview
            })
        )

        const yesButton = await screen.findByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.yes
        })
        await userEvent.click(yesButton)

        expect(
            await screen.findByText('Session expired. Please log in again.')
        ).toBeInTheDocument()
    })

    it('shows 401 error message when submit returns unauthorized', async () => {
        const unauthorizedMessage = 'Unauthorized access'
        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: false,
            json: async () => ({
                status: 401,
                message: unauthorizedMessage
            })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderRejectedApiForm({
            api_nm: 'Unauthorized API',
            api_ds: 'Unauthorized path test'
        })

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submitForReview
            })
        )

        const yesButton = await screen.findByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.yes
        })
        await userEvent.click(yesButton)

        expect(await screen.findByText(unauthorizedMessage)).toBeInTheDocument()
    })

    it('opens success confirmation after successful operation submit', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    api_endpoint_metadata_id: 'endpoint-submit-1'
                }
            })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        render(
            <DomainApiAddItem
                cancelAdd={jest.fn()}
                domainId='domain-1'
                reloadData={jest.fn()}
                isEditRow={{
                    api_id: 'api-operation-submit',
                    api_nm: 'Existing API',
                    isApiEdit: false,
                    api_data: {
                        api_metadata_id: 'api-operation-submit',
                        api_nm: 'Existing API',
                        api_ds: 'Existing API Description',
                        status: 'DRAFT',
                        prvd_company_domain_id: ['domain-1'],
                        consm_company_domain_id: ['domain-2'],
                        ebcm_da: [],
                        co_editors: [],
                        add_da: {}
                    }
                }}
                ebcmLevelsData={{}}
                setIsValuesChanged={jest.fn()}
                handleTimeOutModalOpen={jest.fn()}
                apiData={[
                    {
                        api_metadata_id: 'api-operation-submit',
                        api_nm: 'Existing API'
                    }
                ]}
                refreshApiData={jest.fn()}
                apiEndpointData={{}}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )

        await fillRequiredOperationFields()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.proposeOperation
            })
        )

        expect(
            await screen.findByTestId(DOMAIN_TEST_IDS.modalSuccessHeader)
        ).toBeInTheDocument()
    })

    it('handles successful SAVE in operations mode by calling cancel and reload callbacks', async () => {
        const cancelAdd = jest.fn()
        const reloadData = jest.fn()
        const setIsValuesChanged = jest.fn()
        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    api_endpoint_metadata_id: 'endpoint-999'
                }
            })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        render(
            <DomainApiAddItem
                cancelAdd={cancelAdd}
                domainId='domain-1'
                reloadData={reloadData}
                isEditRow={{
                    api_id: 'api-operation-save',
                    api_nm: 'Existing API',
                    isApiEdit: false,
                    api_data: {
                        api_metadata_id: 'api-operation-save',
                        api_nm: 'Existing API',
                        api_ds: 'Existing API Description',
                        status: 'DRAFT',
                        prvd_company_domain_id: ['domain-1'],
                        consm_company_domain_id: ['domain-2'],
                        ebcm_da: [],
                        co_editors: [],
                        add_da: {}
                    }
                }}
                ebcmLevelsData={{}}
                setIsValuesChanged={setIsValuesChanged}
                handleTimeOutModalOpen={jest.fn()}
                apiData={[
                    {
                        api_metadata_id: 'api-operation-save',
                        api_nm: 'Existing API'
                    }
                ]}
                refreshApiData={jest.fn()}
                apiEndpointData={{}}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )

        await fillRequiredOperationFields()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.save
            })
        )

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    isApiFormEnabled: false,
                    requestBody: expect.objectContaining({
                        action_type: 'SAVE'
                    })
                })
            )
            expect(cancelAdd).toHaveBeenCalledTimes(1)
            expect(reloadData).toHaveBeenCalledTimes(1)
            expect(setIsValuesChanged).toHaveBeenCalledWith(false)
        })
    })

    it('clicks "Submit for review" button with invalid form and prevents submission', async () => {
        const mockMutateAsync = jest.fn()

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderRejectedApiForm({
            api_nm: '',
            api_ds: '',
            consm_company_domain_id: []
        })

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submitForReview
            })
        )

        await waitFor(() => {
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.apiNameError)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.apiDescriptionError)
            ).toBeInTheDocument()
            // Note: Consumer Company Domain is required is only shown in operations mode, not in API edit mode
            // In API edit mode, the validation doesn't require Consumer Company Domain
        })

        expect(mockMutateAsync).not.toHaveBeenCalled()
        expect(
            screen.queryByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.yes
            })
        ).not.toBeInTheDocument()
    })

    it('clicks "Submit for review" button with valid form and opens confirmation modal', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    api_nm: 'Rejected API Updated',
                    api_metadata_id: 'api-rejected-123'
                }
            })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderRejectedApiForm({
            api_nm: 'Rejected API Updated',
            api_ds: 'This API was rejected and is being resubmitted with updates'
        })

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submitForReview
            })
        )

        expect(
            await screen.findByTestId(DOMAIN_TEST_IDS.modalConfirmationHeader)
        ).toBeInTheDocument()
    })

    it('closes confirmation modal when clicking Close button in success state', async () => {
        const cancelAdd = jest.fn()
        const reloadData = jest.fn()
        const setIsValuesChanged = jest.fn()

        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    api_nm: 'Test API',
                    api_metadata_id: 'api-123'
                }
            })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        render(
            <DomainApiAddItem
                cancelAdd={cancelAdd}
                domainId='domain-1'
                reloadData={reloadData}
                isEditRow={{
                    api_id: 'api-123',
                    api_data: {
                        api_metadata_id: 'api-123',
                        api_nm: 'Test API',
                        api_ds: 'Test Description',
                        prvd_company_domain_id: ['domain-1'],
                        consm_company_domain_id: ['domain-2'],
                        ebcm_da: [],
                        co_editors: [],
                        add_da: {}
                    },
                    api_nm: 'Test API',
                    isApiEdit: true
                }}
                ebcmLevelsData={{}}
                setIsValuesChanged={setIsValuesChanged}
                handleTimeOutModalOpen={jest.fn()}
                apiData={[]}
                refreshApiData={jest.fn()}
                apiEndpointData={{}}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )

        // Click Submit to submit the API
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submit
            })
        )

        // Wait for the success modal to appear
        await waitFor(() => {
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.modalSuccessHeader)
            ).toBeInTheDocument()
        })

        // Verify the mutate was called
        expect(mockMutateAsync).toHaveBeenCalled()

        // Click the Close button on the success modal
        const closeButton = screen.getByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.close
        })
        await userEvent.click(closeButton)

        // Verify the callbacks were invoked
        expect(cancelAdd).toHaveBeenCalledTimes(1)
        expect(reloadData).toHaveBeenCalledTimes(2) // Called once on submit, once on close
        expect(setIsValuesChanged).toHaveBeenCalledWith(false)
    })

    it('displays "No changes found" when closeConfirmation is called with no changes', async () => {
        const cancelAdd = jest.fn()
        const setIsValuesChanged = jest.fn()

        render(
            <DomainApiAddItem
                cancelAdd={cancelAdd}
                domainId='domain-1'
                reloadData={jest.fn()}
                isEditRow={{
                    api_id: 'api-123',
                    api_data: {
                        api_metadata_id: 'api-123',
                        api_nm: 'Existing API',
                        api_ds: 'Description',
                        prvd_company_domain_id: ['domain-1'],
                        consm_company_domain_id: ['domain-2'],
                        ebcm_da: [],
                        co_editors: [],
                        add_da: {}
                    },
                    api_nm: 'Existing API',
                    isApiEdit: false
                }}
                ebcmLevelsData={{}}
                setIsValuesChanged={setIsValuesChanged}
                handleTimeOutModalOpen={jest.fn()}
                apiData={[]}
                refreshApiData={jest.fn()}
                apiEndpointData={{}}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )

        const saveButton = screen.getByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.save
        })
        await userEvent.click(saveButton)

        await waitFor(() => {
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.modalSuccessHeader)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.modalSuccessBody)
            ).toBeInTheDocument()
        })

        const closeButton = screen.getByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.close
        })
        await userEvent.click(closeButton)

        await waitFor(() => {
            expect(cancelAdd).toHaveBeenCalledTimes(1)
        })
    })

    it('calls handleChanges action when clicking Yes in ConfirmationSubmitModal', async () => {
        const cancelAdd = jest.fn()
        const reloadData = jest.fn()
        const setIsValuesChanged = jest.fn()

        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    api_nm: 'Test API',
                    api_metadata_id: 'api-123'
                }
            })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        render(
            <DomainApiAddItem
                cancelAdd={cancelAdd}
                domainId='domain-1'
                reloadData={reloadData}
                isEditRow={{
                    api_id: 'api-123',
                    api_data: {
                        api_metadata_id: 'api-123',
                        api_nm: 'Test API',
                        api_ds: 'Test Description',
                        prvd_company_domain_id: ['domain-1'],
                        consm_company_domain_id: ['domain-2'],
                        ebcm_da: [],
                        co_editors: [],
                        add_da: {},
                        isrejected: 'true',
                        status: 'rejected'
                    },
                    api_nm: 'Test API',
                    isApiEdit: true
                }}
                ebcmLevelsData={{}}
                setIsValuesChanged={setIsValuesChanged}
                handleTimeOutModalOpen={jest.fn()}
                apiData={[]}
                refreshApiData={jest.fn()}
                apiEndpointData={{}}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )

        const apiNameInput = screen.getByLabelText(DOMAIN_TEST_LABEL.apiName)
        await userEvent.clear(apiNameInput)
        await userEvent.type(apiNameInput, 'Updated API Name')

        const submitForReviewButton = screen.getByRole(
            DOMAIN_TEST_ROLE.button,
            {
                name: DOMAIN_TEST_TEXT.submitForReview
            }
        )
        await userEvent.click(submitForReviewButton)

        await waitFor(() => {
            expect(
                screen.getByTestId(
                    DOMAIN_TEST_IDS.modalStartApprovalConfirmation
                )
            ).toBeInTheDocument()
        })

        const yesButton = screen.getByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.yes
        })
        await userEvent.click(yesButton)

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    isApiFormEnabled: true,
                    requestBody: expect.objectContaining({
                        api_nm: 'Updated API Name',
                        pageLink: expect.any(String),
                        api_metadata_id: 'api-123'
                    })
                })
            )
        })
    })

    it('closes ConfirmationSubmitModal and resets state when setOpenReviewConfirmation is triggered', async () => {
        const cancelAdd = jest.fn()
        const reloadData = jest.fn()
        const setIsValuesChanged = jest.fn()

        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    api_nm: 'Test API',
                    api_metadata_id: 'api-123'
                }
            })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        render(
            <DomainApiAddItem
                cancelAdd={cancelAdd}
                domainId='domain-1'
                reloadData={reloadData}
                isEditRow={{
                    api_id: 'api-123',
                    api_data: {
                        api_metadata_id: 'api-123',
                        api_nm: 'Test API',
                        api_ds: 'Test Description',
                        prvd_company_domain_id: ['domain-1'],
                        consm_company_domain_id: ['domain-2'],
                        ebcm_da: [],
                        co_editors: [],
                        add_da: {},
                        isrejected: 'true',
                        status: 'rejected'
                    },
                    api_nm: 'Test API',
                    isApiEdit: true
                }}
                ebcmLevelsData={{}}
                setIsValuesChanged={setIsValuesChanged}
                handleTimeOutModalOpen={jest.fn()}
                apiData={[]}
                refreshApiData={jest.fn()}
                apiEndpointData={{}}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )

        const apiNameInput = screen.getByLabelText(DOMAIN_TEST_LABEL.apiName)
        await userEvent.clear(apiNameInput)
        await userEvent.type(apiNameInput, 'Updated API Name v2')

        const submitForReviewButton = screen.getByRole(
            DOMAIN_TEST_ROLE.button,
            {
                name: DOMAIN_TEST_TEXT.submitForReview
            }
        )
        await userEvent.click(submitForReviewButton)

        await waitFor(() => {
            expect(
                screen.getByTestId(
                    DOMAIN_TEST_IDS.modalStartApprovalConfirmation
                )
            ).toBeInTheDocument()
        })

        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.modalStartApprovalDescription)
        ).toBeInTheDocument()

        const cancelButtons = screen.getAllByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.cancel
        })
        const modalCancelButton = cancelButtons.find(button =>
            button.classList.contains('closeButton')
        )
        await userEvent.click(modalCancelButton)

        await waitFor(() => {
            expect(
                screen.queryByTestId(
                    DOMAIN_TEST_IDS.modalStartApprovalConfirmation
                )
            ).not.toBeInTheDocument()
        })

        expect(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName)
        ).toBeInTheDocument()
    })
})
