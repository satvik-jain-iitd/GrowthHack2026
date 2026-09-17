import '@testing-library/jest-dom'
import React from 'react'
import DomainApiContainer from './DomainApiContainer'
import DomainApiPage from './DomainApiPage'
import ChartsContainer from './ChartsContainer'
import HeaderPieChart, { CustomTooltip as PieTooltip } from './HeaderPieChart'
import HeaderBarChart, { CustomTooltip as BarTooltip } from './HeaderBarChart'
import { EBCMFields } from './EBCMFields'
import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import { render } from '@/test/utils/test-utils'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'react-toastify'
import { DOMAIN_TEST_IDS } from '../../test-ids'

jest.mock('@/utils/server', () => ({
    fetchArchitecture: jest.fn()
}))

jest.mock('./DomainApiPage', () => jest.fn(() => null))

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn()
    }
}))

jest.mock('@americanexpress/dls-icons', () => ({
    IconPlusCircle: () => <span data-testid='icon-plus-circle' />
}))

jest.mock('react-select', () => {
    return function MockSelect({ name, isDisabled, onChange }) {
        return (
            <div
                data-testid={`mock-select-${name}`}
                data-disabled={isDisabled ? 'true' : 'false'}
            >
                <button
                    type='button'
                    data-testid={`change-${name}`}
                    onClick={() =>
                        onChange?.(
                            {
                                label: `${name}-label`,
                                value: `${name}-value`
                            },
                            { action: 'select-option' }
                        )
                    }
                >
                    Change {name}
                </button>
            </div>
        )
    }
})

const mockReact = React
jest.mock('recharts', () => {
    return {
        ResponsiveContainer: ({ children }) => (
            <div data-testid='responsive-container'>{children}</div>
        ),
        PieChart: ({ children }) => <svg>{children}</svg>,
        Pie: ({ children }) => <g>{children}</g>,
        Label: ({ content }) => <g>{content}</g>,
        Cell: ({ fill }) => <div data-testid='chart-cell'>{fill}</div>,
        Tooltip: ({ content }) => (
            <div>
                {content
                    ? mockReact.cloneElement(content, {
                          active: true,
                          label: 'EARB Approved Operations',
                          payload: [
                              { name: 'EARB Approved Operations', value: 7 }
                          ]
                      })
                    : null}
            </div>
        ),
        Legend: ({ content }) => (
            <div>
                {content
                    ? mockReact.cloneElement(content, {
                          payload: [
                              {
                                  payload: {
                                      fill: '#F9A94E',
                                      value: '7',
                                      name: 'EARB Approved Operations'
                                  }
                              }
                          ]
                      })
                    : null}
            </div>
        ),
        BarChart: ({ children }) => <div>{children}</div>,
        Bar: ({ children }) => <div>{children}</div>,
        XAxis: () => <div data-testid='x-axis' />,
        YAxis: () => <div data-testid='y-axis' />,
        CartesianGrid: () => <div data-testid='grid' />
    }
})

const buildResponse = data => {
    return Promise.resolve({
        json: jest.fn().mockResolvedValue({ data })
    })
}

describe('DomainApiContainer', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('fetches data and passes props to DomainApiPage', async () => {
        const companySubDomains = [{ company_sub_domain_id: 'sub-1' }]
        const companyDomains = [
            {
                company_domain_id: 'domain-1',
                playbook_id: 'playbook-1',
                domain_nm: 'Payments'
            }
        ]
        const statusCount = { approved: 2, pending: 1 }

        fetchArchitecture
            .mockResolvedValueOnce(buildResponse(companySubDomains))
            .mockResolvedValueOnce(buildResponse(companyDomains))
            .mockResolvedValueOnce(buildResponse(statusCount))

        const element = await DomainApiContainer({ playbook_id: 'playbook-1' })
        render(element)

        expect(fetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_SUB_DOMAINS
        )
        expect(fetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_DOMAINS
        )
        expect(fetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_STATUS_COUNT('domain-1')
        )

        const props = DomainApiPage.mock.calls[0][0]
        expect(props.domainMetadata).toEqual(companyDomains[0])
        expect(props.statusCount).toEqual(statusCount)
        expect(props.companyDomains).toEqual(companyDomains)
        expect(props.companySubDomains).toEqual(companySubDomains)
    })

    it('uses empty domain id when playbook is not found', async () => {
        const companySubDomains = []
        const companyDomains = [
            {
                company_domain_id: 'domain-1',
                playbook_id: 'playbook-1',
                domain_nm: 'Payments'
            }
        ]
        const statusCount = { approved: 0, pending: 0 }

        fetchArchitecture
            .mockResolvedValueOnce(buildResponse(companySubDomains))
            .mockResolvedValueOnce(buildResponse(companyDomains))
            .mockResolvedValueOnce(buildResponse(statusCount))

        const element = await DomainApiContainer({ playbook_id: 'missing-id' })
        render(element)

        expect(fetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_STATUS_COUNT('')
        )

        const props = DomainApiPage.mock.calls[0][0]
        expect(props.domainMetadata).toEqual({})
    })
})

describe('DomainApi charts coverage', () => {
    it('renders pie chart center label and tooltip', () => {
        render(
            <HeaderPieChart
                Proposed={7}
                chartData={[
                    {
                        name: 'EARB Approved Operations',
                        value: 7,
                        color: '#F9A94E'
                    }
                ]}
            />
        )

        expect(screen.getByTestId('chart-legend-domain')).toBeInTheDocument()
        expect(
            screen.getByTestId('chart-legend-operations')
        ).toBeInTheDocument()
        expect(
            screen.getByText('EARB Approved Operations : 7')
        ).toBeInTheDocument()
    })

    it('renders bar chart legend when Proposed is positive', () => {
        render(
            <HeaderBarChart
                Proposed={5}
                chartData={[
                    {
                        name: 'EARB Approved Operations',
                        value: 5,
                        color: '#F9A94E'
                    }
                ]}
            />
        )

        expect(screen.getByTestId('chart-legend-domain')).toBeInTheDocument()
        expect(
            screen.getByTestId('chart-legend-operations')
        ).toBeInTheDocument()
        expect(
            screen.getByText('EARB Approved Operations: 7')
        ).toBeInTheDocument()
    })

    it('returns null for inactive custom tooltips', () => {
        const { container: pieContainer } = render(
            <PieTooltip active={false} payload={[{ name: 'x', value: '1' }]} />
        )
        const { container: barContainer } = render(
            <BarTooltip active={false} label='x' payload={[{ value: '1' }]} />
        )

        expect(pieContainer.firstChild).toBeNull()
        expect(barContainer.firstChild).toBeNull()
    })

    it('renders ChartsContainer in both pie and bar modes', () => {
        const statusCount = {
            domainStatusCount: {
                eARB_Approved: 0,
                dARB_Approved: 0,
                api: {
                    eARB_Approved: 0,
                    dARB_Approved: 0,
                    design_Certified: 0,
                    prod_Certified: 0,
                    proposed: 0,
                    total: 0
                },
                operations: {
                    eARB_Approved: 1,
                    dARB_Approved: 0,
                    design_Certified: 2,
                    prod_Certified: 0,
                    proposed: 0,
                    total: 3
                }
            }
        }

        const { rerender } = render(
            <ChartsContainer showBarChart={false} statusCount={statusCount} />
        )
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument()

        rerender(
            <ChartsContainer showBarChart={true} statusCount={statusCount} />
        )
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })
})

describe('EBCMFields coverage', () => {
    const getBaseProps = () => ({
        formErrors: {
            ebcm: {
                error: false,
                message: ''
            }
        },
        formValues: {
            ebcm: ''
        },
        levels: {
            level1: null,
            level2: null,
            level3: null,
            level4: null,
            level2Options: [],
            level3Options: [],
            level4Options: []
        },
        onLevel1Change: jest.fn(),
        onLevel2Change: jest.fn(),
        onLevel3Change: jest.fn(),
        onLevel4Change: jest.fn(),
        onRemoveEBCM: jest.fn(),
        selectedEBCM: [],
        sortedList1: [{ id: 'L1', name: 'Level 1' }],
        selectStyles: {},
        setSelectedEBCM: jest.fn(),
        setFormValues: jest.fn(),
        setLevels: jest.fn()
    })

    it('renders conditional level fields and error message', () => {
        const props = getBaseProps()
        const { rerender } = render(<EBCMFields {...props} />)

        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.ebcmLevel1Field)
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.ebcmLevel2Field)
        ).toBeInTheDocument()
        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.ebcmLevel3Field)
        ).not.toBeInTheDocument()

        rerender(
            <EBCMFields
                {...props}
                formErrors={{
                    ebcm: { error: true, message: 'EBCM is required' }
                }}
                formValues={{
                    ebcm: { label: 'Selected EBCM', value: 'selected-ebcm' }
                }}
                levels={{
                    ...props.levels,
                    level1: { label: 'L1', value: '1' },
                    level2: { label: 'L2', value: '2' },
                    level3: { label: 'L3', value: '3' },
                    level4Options: [{ id: '4', name: 'L4' }]
                }}
            />
        )

        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.ebcmLevel3Field)
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.ebcmLevel4Field)
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.addEbcmError)
        ).toHaveTextContent('EBCM is required')
    })

    it('calls level change handlers and add/remove handlers', async () => {
        const props = getBaseProps()
        const formValues = {
            ebcm: { label: 'Payments > L3', value: 'payments-l3' }
        }
        render(
            <EBCMFields
                {...props}
                formValues={formValues}
                levels={{
                    ...props.levels,
                    level1: { label: 'L1', value: '1' },
                    level2: { label: 'L2', value: '2' },
                    level3: { label: 'L3', value: '3' },
                    level4Options: [{ id: '4', name: 'L4' }]
                }}
                selectedEBCM={[
                    { label: 'Existing', value: 'existing' },
                    { label: 'Payments > L3', value: 'payments-l3' }
                ]}
            />
        )

        await userEvent.click(screen.getByTestId('change-ebcmLevel1'))
        await userEvent.click(screen.getByTestId('change-ebcmLevel2'))
        await userEvent.click(screen.getByTestId('change-ebcmLevel3'))
        await userEvent.click(screen.getByTestId('change-ebcmLevel4'))

        expect(props.onLevel1Change).toHaveBeenCalled()
        expect(props.onLevel2Change).toHaveBeenCalled()
        expect(props.onLevel3Change).toHaveBeenCalled()
        expect(props.onLevel4Change).toHaveBeenCalled()

        await userEvent.click(screen.getByTestId('add-ebcm-button'))
        expect(toast.success).toHaveBeenCalledWith(
            'Payments > L3 is already Added.'
        )

        const closeButtons = screen.getAllByTestId('ebcm-close')
        await userEvent.click(closeButtons[0])
        expect(props.onRemoveEBCM).toHaveBeenCalledWith('Existing')
    })
})
