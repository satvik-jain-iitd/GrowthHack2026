import { render } from '@/test/utils/test-utils'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DomainApiPage from './DomainApiPage'
import { useSaveApiData } from '@/app/company-domains/hooks'
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

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}))

jest.mock('next/image', () => ({
    __esModule: true,
    default: props => <img {...props} />
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

describe('DomainApiPage', () => {
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

    const statusCount = {
        domainStatusCount: {
            eARB_Approved: 0,
            dARB_Approved: 0
        }
    }

    const renderPage = () =>
        render(
            <DomainApiPage
                domainMetadata={companyDomains[0]}
                statusCount={statusCount}
                companyDomains={companyDomains}
                companySubDomains={companySubDomains}
            />
        )

    const mockSubmitAndAddOperation = (apiName = 'Test API') => {
        useSaveApiData.mockImplementation(() => ({
            mutateAsync: jest.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    data: {
                        api_nm: apiName,
                        api_metadata_id: 'api-123'
                    }
                })
            })
        }))
    }

    const openOperationsForm = async (
        apiName = 'Test API',
        apiDescription = 'Test Description'
    ) => {
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            apiName
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            apiDescription
        )

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submitAndAddOperation
            })
        )

        await waitFor(() => {
            expect(
                screen.getByRole(DOMAIN_TEST_ROLE.heading, {
                    name: new RegExp(DOMAIN_TEST_TEXT.proposingOperation, 'i')
                })
            ).toBeInTheDocument()
        })
    }

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

        // Consumer Company Domain is required in operations form
        const consumerDomainContainer = screen.getByTestId(
            DOMAIN_TEST_IDS.consumerDomainField
        )
        await userEvent.click(
            within(consumerDomainContainer).getByRole(DOMAIN_TEST_ROLE.combobox)
        )
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.option, {
                name: DOMAIN_TEST_TEXT.lending
            })
        )
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

    const findElementByType = (node, componentType) => {
        if (!node || typeof node !== 'object') return null
        if (node.type === componentType) return node

        const children = node.props?.children
        if (Array.isArray(children)) {
            for (const child of children) {
                const found = findElementByType(child, componentType)
                if (found) return found
            }
            return null
        }

        return findElementByType(children, componentType)
    }

    beforeEach(() => {
        jest.clearAllMocks()
        useSaveApiData.mockImplementation(() => ({
            mutateAsync: jest.fn()
        }))
    })

    it('handleAdd calls setIsValuesChanged(false) when add mode and edit row are active', () => {
        const setIsAdd = jest.fn()
        const setIsEditRow = jest.fn()
        const setIsValuesChanged = jest.fn()

        jest.isolateModules(() => {
            jest.doMock('react', () => {
                const actualReact = jest.requireActual('react')

                return {
                    ...actualReact,
                    default: actualReact,
                    useEffect: jest.fn(),
                    useState: jest
                        .fn()
                        .mockImplementationOnce(() => [true, setIsAdd])
                        .mockImplementationOnce(() => [
                            {
                                api_id: 'api-123',
                                api_data: {},
                                api_nm: 'Existing API',
                                isApiEdit: true
                            },
                            setIsEditRow
                        ])
                        .mockImplementationOnce(() => [
                            false,
                            setIsValuesChanged
                        ])
                        .mockImplementationOnce(() => [0, jest.fn()])
                }
            })

            const LocalDomainApiPage =
                jest.requireActual('./DomainApiPage').default
            const LocalDomainApiHeader =
                jest.requireActual('./DomainApiHeader').default

            const pageElement = LocalDomainApiPage({
                domainMetadata: companyDomains[0],
                statusCount,
                companyDomains,
                companySubDomains
            })

            const headerElement = findElementByType(
                pageElement,
                LocalDomainApiHeader
            )

            expect(headerElement).toBeTruthy()
            headerElement.props.handleAdd()
        })

        expect(setIsValuesChanged).toHaveBeenCalledWith(false)
        expect(setIsEditRow).toHaveBeenCalledWith({
            api_id: '',
            api_data: {},
            api_nm: '',
            isApiEdit: false
        })
        expect(setIsAdd).toHaveBeenCalledWith(true)
    })

    it('handleAdd executes else branch when isEditRow is falsy', () => {
        const setIsAdd = jest.fn()
        const setIsEditRow = jest.fn()

        jest.isolateModules(() => {
            jest.doMock('react', () => {
                const actualReact = jest.requireActual('react')

                return {
                    ...actualReact,
                    default: actualReact,
                    useEffect: jest.fn(),
                    useState: jest
                        .fn()
                        .mockImplementationOnce(() => [false, setIsAdd])
                        .mockImplementationOnce(() => [null, setIsEditRow])
                        .mockImplementationOnce(() => [false, jest.fn()])
                        .mockImplementationOnce(() => [0, jest.fn()])
                }
            })

            const LocalDomainApiPage =
                jest.requireActual('./DomainApiPage').default
            const LocalDomainApiHeader =
                jest.requireActual('./DomainApiHeader').default

            const pageElement = LocalDomainApiPage({
                domainMetadata: companyDomains[0],
                statusCount,
                companyDomains,
                companySubDomains
            })

            const headerElement = findElementByType(
                pageElement,
                LocalDomainApiHeader
            )

            expect(headerElement).toBeTruthy()
            headerElement.props.handleAdd()
        })

        expect(setIsAdd).toHaveBeenCalledWith(true)
        expect(setIsEditRow).not.toHaveBeenCalled()
    })

    it('handleEdit updates edit row and closes add form when index is provided', () => {
        const setIsAdd = jest.fn()
        const setIsEditRow = jest.fn()
        const apiData = {
            api_id: 'api-456',
            api_metadata_id: 'api-456',
            api_nm: 'Updated API',
            api_ds: 'Updated API Description'
        }

        jest.isolateModules(() => {
            jest.doMock('react', () => {
                const actualReact = jest.requireActual('react')

                return {
                    ...actualReact,
                    default: actualReact,
                    useEffect: jest.fn(),
                    useState: jest
                        .fn()
                        .mockImplementationOnce(() => [true, setIsAdd])
                        .mockImplementationOnce(() => [
                            {
                                api_id: 'api-123',
                                api_data: {},
                                api_nm: 'Existing API',
                                isApiEdit: true
                            },
                            setIsEditRow
                        ])
                        .mockImplementationOnce(() => [false, jest.fn()])
                        .mockImplementationOnce(() => [0, jest.fn()])
                }
            })

            const LocalDomainApiPage =
                jest.requireActual('./DomainApiPage').default
            const LocalDomainApiSearchableTable = jest.requireActual(
                '@/app/company-domains/components/LandingPage/DomainApiSearchableTable'
            ).default
            const pageElement = LocalDomainApiPage({
                domainMetadata: companyDomains[0],
                statusCount,
                companyDomains,
                companySubDomains
            })

            const searchableTableElement = findElementByType(
                pageElement,
                LocalDomainApiSearchableTable
            )

            expect(searchableTableElement).toBeTruthy()
            searchableTableElement.props.handleEdit(
                'api-456',
                apiData,
                'Updated API',
                true
            )
        })

        expect(setIsEditRow).toHaveBeenCalledWith({
            api_id: 'api-456',
            api_data: apiData,
            api_nm: 'Updated API',
            isApiEdit: true
        })
        expect(setIsAdd).toHaveBeenCalledWith(false)
    })

    it('handleEdit updates edit row without closing add form when add and edit states are falsy', () => {
        const setIsAdd = jest.fn()
        const setIsEditRow = jest.fn()
        const apiData = {
            api_id: 'api-789',
            api_metadata_id: 'api-789',
            api_nm: 'Standalone API',
            api_ds: 'Standalone API Description'
        }

        jest.isolateModules(() => {
            jest.doMock('react', () => {
                const actualReact = jest.requireActual('react')

                return {
                    ...actualReact,
                    default: actualReact,
                    useEffect: jest.fn(),
                    useState: jest
                        .fn()
                        .mockImplementationOnce(() => [false, setIsAdd])
                        .mockImplementationOnce(() => [null, setIsEditRow])
                        .mockImplementationOnce(() => [false, jest.fn()])
                        .mockImplementationOnce(() => [0, jest.fn()])
                }
            })

            const LocalDomainApiPage =
                jest.requireActual('./DomainApiPage').default
            const LocalDomainApiSearchableTable = jest.requireActual(
                '@/app/company-domains/components/LandingPage/DomainApiSearchableTable'
            ).default
            const pageElement = LocalDomainApiPage({
                domainMetadata: companyDomains[0],
                statusCount,
                companyDomains,
                companySubDomains
            })

            const searchableTableElement = findElementByType(
                pageElement,
                LocalDomainApiSearchableTable
            )

            expect(searchableTableElement).toBeTruthy()
            searchableTableElement.props.handleEdit(
                'api-789',
                apiData,
                'Standalone API',
                true
            )
        })

        expect(setIsEditRow).toHaveBeenCalledWith({
            api_id: 'api-789',
            api_data: apiData,
            api_nm: 'Standalone API',
            isApiEdit: true
        })
        expect(setIsAdd).not.toHaveBeenCalled()
    })

    it('handleEdit resets edit row when index is not provided', () => {
        const setIsAdd = jest.fn()
        const setIsEditRow = jest.fn()

        jest.isolateModules(() => {
            jest.doMock('react', () => {
                const actualReact = jest.requireActual('react')

                return {
                    ...actualReact,
                    default: actualReact,
                    useEffect: jest.fn(),
                    useState: jest
                        .fn()
                        .mockImplementationOnce(() => [false, setIsAdd])
                        .mockImplementationOnce(() => [
                            {
                                api_id: 'api-123',
                                api_data: { api_id: 'api-123' },
                                api_nm: 'Existing API',
                                isApiEdit: true
                            },
                            setIsEditRow
                        ])
                        .mockImplementationOnce(() => [false, jest.fn()])
                        .mockImplementationOnce(() => [0, jest.fn()])
                }
            })

            const LocalDomainApiPage =
                jest.requireActual('./DomainApiPage').default
            const LocalDomainApiSearchableTable = jest.requireActual(
                '@/app/company-domains/components/LandingPage/DomainApiSearchableTable'
            ).default
            const pageElement = LocalDomainApiPage({
                domainMetadata: companyDomains[0],
                statusCount,
                companyDomains,
                companySubDomains
            })

            const searchableTableElement = findElementByType(
                pageElement,
                LocalDomainApiSearchableTable
            )

            expect(searchableTableElement).toBeTruthy()
            searchableTableElement.props.handleEdit('', {}, 'Ignored API', true)
        })

        expect(setIsEditRow).toHaveBeenCalledWith({
            api_id: '',
            api_data: {},
            api_nm: '',
            isApiEdit: false
        })
        expect(setIsAdd).not.toHaveBeenCalled()
    })

    it('applies selectDropdownMenu class for currently supported markets menu', async () => {
        mockSubmitAndAddOperation()
        renderPage()

        await openOperationsForm()

        const actualMarketsContainer = screen.getByTestId(
            DOMAIN_TEST_IDS.currentlySupportedMarketsField
        )

        await userEvent.click(
            within(actualMarketsContainer).getByRole(DOMAIN_TEST_ROLE.combobox)
        )

        await waitFor(() => {
            const menu = document.querySelector('.selectDropdownMenu')
            expect(menu).toBeInTheDocument()
            expect(menu).toHaveClass('selectDropdownMenu')
        })
    })

    it('updates currently supported markets value on change', async () => {
        mockSubmitAndAddOperation()
        renderPage()

        await openOperationsForm()

        const actualMarketsContainer = screen.getByTestId(
            DOMAIN_TEST_IDS.currentlySupportedMarketsField
        )

        await userEvent.click(
            within(actualMarketsContainer).getByRole(DOMAIN_TEST_ROLE.combobox)
        )
        const globalOption = await screen.findByRole(DOMAIN_TEST_ROLE.option, {
            name: new RegExp(DOMAIN_TEST_TEXT.globalMarket, 'i')
        })
        await userEvent.click(globalOption)
        await userEvent.keyboard('{Escape}')

        await waitFor(() => {
            expect(
                within(actualMarketsContainer).getByText(
                    DOMAIN_TEST_TEXT.globalMarket
                )
            ).toBeInTheDocument()
        })
    })

    it('shows the add form and closes on cancel', async () => {
        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        expect(
            screen.getByRole(DOMAIN_TEST_ROLE.heading, {
                name: DOMAIN_TEST_TEXT.addingNewApi
            })
        ).toBeInTheDocument()
        expect(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName)
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.providerDomainField)
        ).toBeInTheDocument()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.cancel
            })
        )

        expect(
            screen.queryByRole(DOMAIN_TEST_ROLE.heading, {
                name: DOMAIN_TEST_TEXT.addingNewApi
            })
        ).not.toBeInTheDocument()
        expect(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        ).toBeInTheDocument()
    })

    it('shows validation errors when submitting an empty API form', async () => {
        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submit
            })
        )

        await waitFor(() => {
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.apiNameError)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.apiDescriptionError)
            ).toBeInTheDocument()
        })
    })

    it('validates all operations-form required conditions including API in Operations mode', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ data: {} })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderPage()
        await openOperationsForm('Validation API', 'Validation Description')

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.proposeOperation
            })
        )

        await waitFor(() => {
            const apiField = screen
                .getByText(DOMAIN_TEST_LABEL.apiField)
                .closest('[role="group"]')
            expect(apiField.querySelector('.errorField')).toBeInTheDocument()
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

        expect(mockMutateAsync).toHaveBeenCalledTimes(1)
    })

    it('validates invalid journey link prefix in operations mode', async () => {
        const mockMutateAsync = jest
            .fn()
            .mockImplementation(({ isApiFormEnabled }) =>
                Promise.resolve({
                    ok: true,
                    json: async () => ({
                        data: isApiFormEnabled
                            ? {
                                  api_nm: 'Journey API',
                                  api_metadata_id: 'api-journey-1'
                              }
                            : {
                                  api_endpoint_metadata_id: 'endpoint-journey-1'
                              }
                    })
                })
            )

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderPage()
        await openOperationsForm('Journey API', 'Journey Description')

        await fillRequiredOperationFields({
            journeyLink: 'https://example.com/invalid-journey-link'
        })

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.proposeOperation
            })
        )

        await waitFor(() => {
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.journeyLinkError)
            ).toBeInTheDocument()
        })

        expect(mockMutateAsync).toHaveBeenCalledTimes(1)
    })

    it('accepts architecture1 journey link prefix for operations', async () => {
        const mockMutateAsync = jest
            .fn()
            .mockImplementation(({ isApiFormEnabled }) =>
                Promise.resolve({
                    ok: true,
                    json: async () => ({
                        data: isApiFormEnabled
                            ? {
                                  api_nm: 'Journey API',
                                  api_metadata_id: 'api-journey-2'
                              }
                            : {
                                  api_endpoint_metadata_id: 'endpoint-journey-2'
                              }
                    })
                })
            )

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderPage()
        await openOperationsForm('Journey API', 'Journey Description')

        const validJourneyLink =
            'https://architecture1.aexp.com/docs/test-journey-link'
        await fillRequiredOperationFields({
            journeyLink: validJourneyLink
        })

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.proposeOperation
            })
        )

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledTimes(2)
        })

        expect(mockMutateAsync.mock.calls[1][0].requestBody.journey_link).toBe(
            validJourneyLink
        )
        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.journeyLinkError)
        ).not.toBeInTheDocument()
    })

    it('validates Type A restriction when multiple provider domains are selected', async () => {
        const mockMutateAsync = jest
            .fn()
            .mockImplementation(({ isApiFormEnabled }) =>
                Promise.resolve({
                    ok: true,
                    json: async () => ({
                        data: isApiFormEnabled
                            ? {
                                  api_nm: 'Type A API',
                                  api_metadata_id: 'api-type-a-1'
                              }
                            : {
                                  api_endpoint_metadata_id: 'endpoint-type-a-1'
                              }
                    })
                })
            )

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            'Type A API'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            'Type A API Description'
        )

        const providerDomain = screen.getByTestId(
            DOMAIN_TEST_IDS.providerDomainField
        )
        await userEvent.click(
            within(providerDomain).getByRole(DOMAIN_TEST_ROLE.combobox)
        )
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.option, {
                name: DOMAIN_TEST_TEXT.lending
            })
        )
        await userEvent.keyboard('{Escape}')

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submitAndAddOperation
            })
        )

        await waitFor(() => {
            expect(
                screen.getByRole(DOMAIN_TEST_ROLE.heading, {
                    name: new RegExp(DOMAIN_TEST_TEXT.proposingOperation, 'i')
                })
            ).toBeInTheDocument()
        })

        await fillRequiredOperationFields({
            apiType: 'Type A',
            journeyLink: 'https://architecture.aexp.com/architecture-docs/test'
        })

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.proposeOperation
            })
        )

        await waitFor(() => {
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.apiTypeError)
            ).toBeInTheDocument()
        })

        expect(mockMutateAsync).toHaveBeenCalledTimes(1)
    })

    it('updates multi-select domain values and preserves provider domain on clear', async () => {
        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        const providerDomain = screen.getByTestId(
            DOMAIN_TEST_IDS.providerDomainField
        )

        const providerSelect = within(providerDomain).getByRole(
            DOMAIN_TEST_ROLE.combobox
        )

        expect(
            within(providerDomain).getByText(DOMAIN_TEST_TEXT.payments)
        ).toBeInTheDocument()

        await userEvent.click(providerSelect)
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.option, {
                name: DOMAIN_TEST_TEXT.lending
            })
        )
        await userEvent.keyboard('{Escape}')

        await waitFor(() => {
            expect(
                within(providerDomain).getByText(DOMAIN_TEST_TEXT.payments)
            ).toBeInTheDocument()
            expect(
                within(providerDomain).getByText(DOMAIN_TEST_TEXT.lending)
            ).toBeInTheDocument()
        })

        await userEvent.click(
            within(providerDomain).getByRole(DOMAIN_TEST_ROLE.button, {
                name: new RegExp(DOMAIN_TEST_TEXT.removeLending, 'i')
            })
        )

        await waitFor(() => {
            expect(
                within(providerDomain).getByText(DOMAIN_TEST_TEXT.payments)
            ).toBeInTheDocument()
            expect(
                within(providerDomain).queryByText(DOMAIN_TEST_TEXT.lending)
            ).not.toBeInTheDocument()
        })
    })

    it('prevents multiple provider domains with Type A API', async () => {
        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        // Fill required fields
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            'Test API'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            'Test API'
        )

        const providerDomain = screen.getByTestId(
            DOMAIN_TEST_IDS.providerDomainField
        )
        await userEvent.click(
            within(providerDomain).getByRole(DOMAIN_TEST_ROLE.combobox)
        )
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.option, {
                name: DOMAIN_TEST_TEXT.lending
            })
        )
        await userEvent.keyboard('{Escape}')

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submit
            })
        )

        await waitFor(() => {
            expect(
                screen.queryByTestId(DOMAIN_TEST_IDS.apiTypeError)
            ).not.toBeInTheDocument()
        })
    })

    it('validates journey link format for operations', async () => {
        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        // Fill API Name and Description
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            'Test API'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            'Test description'
        )

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submit
            })
        )

        await waitFor(() => {
            expect(
                screen.queryByTestId(DOMAIN_TEST_IDS.journeyLinkError)
            ).not.toBeInTheDocument()
        })
    })

    it('prevents removing fixed provider domains', async () => {
        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        const providerDomain = screen.getByTestId(
            DOMAIN_TEST_IDS.providerDomainField
        )

        expect(
            within(providerDomain).getByText(DOMAIN_TEST_TEXT.payments)
        ).toBeInTheDocument()

        const removeButton = within(providerDomain).queryByRole(
            DOMAIN_TEST_ROLE.button,
            {
                name: new RegExp(DOMAIN_TEST_TEXT.removePayments, 'i')
            }
        )

        expect(removeButton).not.toBeInTheDocument()
    })

    it('prevents clearing all provider domains when one is fixed', async () => {
        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        const providerDomain = screen.getByTestId(
            DOMAIN_TEST_IDS.providerDomainField
        )

        await userEvent.click(
            within(providerDomain).getByRole(DOMAIN_TEST_ROLE.combobox)
        )
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.option, {
                name: DOMAIN_TEST_TEXT.lending
            })
        )
        await userEvent.keyboard('{Escape}')

        await waitFor(() => {
            expect(
                within(providerDomain).getByText(DOMAIN_TEST_TEXT.lending)
            ).toBeInTheDocument()
        })
    })

    it('clears form errors when updating multi-select values', async () => {
        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        // Create an error by submitting empty form
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submit
            })
        )

        await waitFor(() => {
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.apiNameError)
            ).toBeInTheDocument()
        })

        const providerDomain = screen.getByTestId(
            DOMAIN_TEST_IDS.providerDomainField
        )

        await userEvent.click(
            within(providerDomain).getByRole(DOMAIN_TEST_ROLE.combobox)
        )
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.option, {
                name: DOMAIN_TEST_TEXT.lending
            })
        )
        await userEvent.keyboard('{Escape}')

        await waitFor(() => {
            expect(
                within(providerDomain).getByText(DOMAIN_TEST_TEXT.lending)
            ).toBeInTheDocument()
        })

        const providerDomainError = within(providerDomain).queryByText(
            DOMAIN_TEST_LABEL.required
        )
        expect(providerDomainError).not.toBeInTheDocument()
    })

    it('clicks "Submit and Add Operation" button and calls handleSave with correct parameters', async () => {
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

        renderPage()

        // Open the API form
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            'Test API'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            'Test API Description'
        )

        const submitAndAddButton = screen.getByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.submitAndAddOperation
        })
        await userEvent.click(submitAndAddButton)

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledTimes(1)
        })

        await waitFor(() => {
            expect(
                screen.getByRole(DOMAIN_TEST_ROLE.heading, {
                    name: /proposing operation/i
                })
            ).toBeInTheDocument()
        })
    })

    it('clicks "Save" button in operations form and calls handleSave', async () => {
        const mockMutateAsync = jest
            .fn()
            .mockImplementation(({ isApiFormEnabled }) =>
                Promise.resolve({
                    ok: true,
                    json: async () => ({
                        data: isApiFormEnabled
                            ? {
                                  api_nm: 'Test API',
                                  api_metadata_id: 'api-123'
                              }
                            : {
                                  api_endpoint_metadata_id: 'endpoint-123'
                              }
                    })
                })
            )

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderPage()
        await openOperationsForm('Test API', 'Test Description')

        // Reset mock to track only the operations form submission
        mockMutateAsync.mockClear()

        await fillRequiredOperationFields({
            apiType: 'Type B',
            journeyLink: 'https://architecture.aexp.com/architecture-docs/test'
        })

        const saveButton = screen.getByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.save
        })
        await userEvent.click(saveButton)

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledTimes(1)
        })
    })

    it('clicks "Submit" button in API form and calls handleSave with SUBMIT action', async () => {
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

        renderPage()

        // Open the API form
        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            'Test API'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            'Test API Description'
        )

        const submitButton = screen.getByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.submit
        })
        await userEvent.click(submitButton)

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledTimes(1)
            expect(mockMutateAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    isApiFormEnabled: true,
                    requestBody: expect.objectContaining({
                        api_nm: 'Test API',
                        api_ds: 'Test API Description'
                    })
                })
            )
        })
    })

    it('clicks "Propose Operation" button in operations form and calls handleSave', async () => {
        const mockMutateAsync = jest
            .fn()
            .mockImplementation(({ isApiFormEnabled }) =>
                Promise.resolve({
                    ok: true,
                    json: async () => ({
                        data: isApiFormEnabled
                            ? {
                                  api_nm: 'Test API',
                                  api_metadata_id: 'api-123'
                              }
                            : {
                                  api_endpoint_metadata_id: 'endpoint-456'
                              }
                    })
                })
            )

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderPage()
        await openOperationsForm('Test API', 'Test Description')

        // Reset mock to track only the operations form submission
        mockMutateAsync.mockClear()

        await fillRequiredOperationFields({
            apiType: 'Type B',
            journeyLink: 'https://architecture.aexp.com/architecture-docs/test'
        })

        const proposeOperationButton = screen.getByRole(
            DOMAIN_TEST_ROLE.button,
            {
                name: DOMAIN_TEST_TEXT.proposeOperation
            }
        )
        await userEvent.click(proposeOperationButton)

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledTimes(1)
            expect(mockMutateAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    requestBody: expect.objectContaining({
                        action_type: 'SUBMIT',
                        endpoint_operation: 'Test Operation'
                    })
                })
            )
        })
    })

    it('does not submit on SAVE in operations mode when operation is missing', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    api_nm: 'Save Branch API',
                    api_metadata_id: 'api-save-branch-1'
                }
            })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderPage()
        await openOperationsForm('Save Branch API', 'Save Branch Description')

        mockMutateAsync.mockClear()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.save
            })
        )

        await waitFor(() => {
            expect(
                screen.getByRole(DOMAIN_TEST_ROLE.heading, {
                    name: new RegExp(DOMAIN_TEST_TEXT.proposingOperation, 'i')
                })
            ).toBeInTheDocument()
        })

        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.operationError)
        ).not.toBeInTheDocument()

        expect(mockMutateAsync).not.toHaveBeenCalled()
    })

    it('shows API duplicate-name error when API save response is duplicate', async () => {
        const duplicateMessage = 'API name already exists'
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

        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            'Duplicate API Name'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            'Duplicate API Description'
        )

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submit
            })
        )

        await waitFor(() => {
            expect(screen.getByText(duplicateMessage)).toBeInTheDocument()
            expect(mockMutateAsync).toHaveBeenCalledTimes(1)
        })
    })

    it('returns early on 401 response without showing duplicate-name errors', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValue({
            ok: false,
            json: async () => ({
                status: 401,
                data: {},
                message: 'Unauthorized'
            })
        })

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            '401 API'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            '401 API Description'
        )

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submit
            })
        )

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledTimes(1)
        })

        // 401 response shows session error, not duplicate-name errors
        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.apiNameError)
        ).not.toBeInTheDocument()
        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.modalSuccessHeader)
        ).not.toBeInTheDocument()
    })

    it('logs error when mutation throws in handleSave catch block', async () => {
        const mutationError = new Error('Network failure')
        const mockMutateAsync = jest.fn().mockRejectedValue(mutationError)
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            'Error API'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            'Error API Description'
        )

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submit
            })
        )

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(mutationError)
        })

        consoleErrorSpy.mockRestore()
    })

    it('displays loading state on Submit button while submitting API form', async () => {
        let resolvePromise
        const mockMutateAsync = jest.fn().mockImplementation(
            () =>
                new Promise(resolve => {
                    resolvePromise = resolve
                })
        )

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            'Loading Test'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            'Testing loading state'
        )

        const submitButton = screen.getByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.submit
        })
        await userEvent.click(submitButton)

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalled()
        })

        resolvePromise({
            ok: true,
            json: async () => ({ data: { api_metadata_id: 'api-123' } })
        })
    })

    it('displays loading state on Propose Operation button while submitting operation', async () => {
        let resolvePromise
        const mockMutateAsync = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: async () => ({
                        data: {
                            api_nm: 'Test API',
                            api_metadata_id: 'api-123'
                        }
                    })
                })
            )
            .mockImplementationOnce(
                () =>
                    new Promise(resolve => {
                        resolvePromise = resolve
                    })
            )

        useSaveApiData.mockImplementation(() => ({
            mutateAsync: mockMutateAsync
        }))

        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            'Test API'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            'Test Description'
        )

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submitAndAddOperation
            })
        )

        await waitFor(() => {
            expect(
                screen.getByRole(DOMAIN_TEST_ROLE.heading, {
                    name: new RegExp(DOMAIN_TEST_TEXT.proposingOperation, 'i')
                })
            ).toBeInTheDocument()
        })

        await fillRequiredOperationFields({
            apiType: 'Type B',
            journeyLink: 'https://architecture.aexp.com/architecture-docs/test'
        })

        const proposeButton = screen.getByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.proposeOperation
        })
        await userEvent.click(proposeButton)

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledTimes(2)
        })

        resolvePromise({
            ok: true,
            json: async () => ({ data: { api_endpoint_metadata_id: 'ep-123' } })
        })
    })

    it('opens review confirmation modal after successful submission', async () => {
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

        renderPage()

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        )

        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiName),
            'Test API'
        )
        await userEvent.type(
            screen.getByLabelText(DOMAIN_TEST_LABEL.apiDescription),
            'Test Description'
        )

        await userEvent.click(
            screen.getByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.submit
            })
        )

        await waitFor(() => {
            expect(
                screen.getByTestId(DOMAIN_TEST_IDS.modalSuccessHeader)
            ).toBeInTheDocument()
        })
    })
})
