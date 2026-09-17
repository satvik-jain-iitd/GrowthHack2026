import React from 'react'
import { fireEvent, render, screen } from '@/test/utils/test-utils'
import {
    CustomerJourneyDetails,
    CustomerJourney,
    JourneyStage
} from './CustomerJourneyDetails'
import {
    CJ_DETAILS_TEST_TEXT,
    CJ_DETAILS_TEST_HREFS,
    CJ_DETAILS_MAPPED_DOMAIN_ID
} from '../test-data'
import { CJ_DETAILS_TEST_IDS } from '../test-ids'

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: Record<string, unknown>) => <img alt='' {...props} />
}))

jest.mock('@/components/ui', () => ({
    NoPrefetchLink: ({
        href,
        children,
        ...props
    }: {
        href: string
        children: React.ReactNode
        [key: string]: unknown
    }) => (
        // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
        <a href={href} {...props}>
            {children}
        </a>
    ),
    Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

jest.mock('@americanexpress/dls-icons')

jest.mock('@/context/UserContext', () => ({
    useUserContext: () => ({
        userInfo: {
            displayName: 'Test User',
            userPrincipalName: '[REDACTED_EMAIL_ADDRESS_2]'
        }
    })
}))

const mockJourney: CustomerJourney = {
    journey_id: 'manage-finances',
    journey_statement: CJ_DETAILS_TEST_TEXT.journeyStatement,
    journey_desc: CJ_DETAILS_TEST_TEXT.journeyDesc,
    journey_grp_tx: 'Finance',
    customer_tx: [CJ_DETAILS_TEST_TEXT.customerTx],
    persona: [CJ_DETAILS_TEST_TEXT.persona],
    market: [CJ_DETAILS_TEST_TEXT.market],
    product: [CJ_DETAILS_TEST_TEXT.product],
    reviewed: false,
    ai_generated: true
}

const mockStage: JourneyStage = {
    journey_stage_id: 'stage-001',
    journey_stage_name: CJ_DETAILS_TEST_TEXT.stage1Name,
    capabilities: [
        {
            capability_id: 'cap-001',
            capability_nm: CJ_DETAILS_TEST_TEXT.capabilityWithId,
            capability_key_tx: 'financial-planning'
        },
        {
            capability_id: '',
            capability_nm: CJ_DETAILS_TEST_TEXT.capabilityNoId,
            capability_key_tx: 'roadmap-item'
        }
    ],
    apis_da: [
        {
            api_nm: CJ_DETAILS_TEST_TEXT.apiTypeA,
            api_metadata_id: 'api-001',
            prim_company_domain_id: 'dom-001',
            type_a: true,
            add_da: {
                architecturePortalUrl: 'https://example.com/domain/api/details'
            }
        },
        {
            api_nm: CJ_DETAILS_TEST_TEXT.apiNonTypeA,
            api_metadata_id: 'api-002',
            prim_company_domain_id: 'dom-001',
            type_a: false,
            add_da: { architecturePortalUrl: '' }
        }
    ],
    company_domains: [
        {
            company_domain_id: 'dom-001',
            domain_nm: CJ_DETAILS_TEST_TEXT.domainName,
            playbook_id: 'playbook-001'
        }
    ]
}

const mockJourneyWithStages: CustomerJourney = {
    ...mockJourney,
    journey_stages: [mockStage]
}

const mockJourneyWithMarketFilter: CustomerJourney = {
    ...mockJourney,
    market: ['US', 'UK'],
    journey_stages: [
        {
            ...mockStage,
            apis_da: [
                {
                    api_nm: 'US API',
                    api_metadata_id: 'api-us',
                    prim_company_domain_id: 'dom-001',
                    type_a: true,
                    add_da: {
                        architecturePortalUrl:
                            'https://example.com/domain/api/us-details'
                    },
                    market: ['US']
                },
                {
                    api_nm: 'UK API',
                    api_metadata_id: 'api-uk',
                    prim_company_domain_id: 'dom-001',
                    type_a: true,
                    add_da: {
                        architecturePortalUrl:
                            'https://example.com/domain/api/uk-details'
                    },
                    market: ['UK']
                },
                {
                    api_nm: 'No Market API',
                    api_metadata_id: 'api-no-market',
                    prim_company_domain_id: 'dom-001',
                    type_a: true,
                    add_da: {
                        architecturePortalUrl:
                            'https://example.com/domain/api/no-market'
                    }
                }
            ],
            applications: [
                {
                    application_nm: 'US App',
                    application_id: 'app-us',
                    market: ['US']
                },
                {
                    application_nm: 'UK App',
                    application_id: 'app-uk',
                    market: ['UK']
                }
            ]
        }
    ]
}

const mockJourneyWithAllRows: CustomerJourney = {
    ...mockJourney,
    journey_stages: [
        {
            ...mockStage,
            touch_point: ['Authenticate in app'],
            business_action: [
                {
                    business_action_nm: 'Approve transaction',
                    journey_variant: 'Shared'
                }
            ],
            applications: [
                {
                    application_nm: 'Payments App',
                    application_id: 'app-001',
                    market: ['US']
                },
                {
                    application_nm: 'Payments App',
                    application_id: 'app-002',
                    market: ['US']
                }
            ]
        }
    ]
}

const mockJourneyWithTwoStages: CustomerJourney = {
    ...mockJourney,
    journey_stages: [
        mockStage,
        {
            ...mockStage,
            journey_stage_id: 'stage-002',
            journey_stage_name: CJ_DETAILS_TEST_TEXT.stage2Name,
            capabilities: [
                {
                    capability_id: 'cap-002',
                    capability_nm: 'Second Capability',
                    capability_key_tx: 'second-capability'
                }
            ],
            apis_da: [
                {
                    api_nm: 'Second API',
                    api_metadata_id: 'api-003',
                    prim_company_domain_id: 'dom-001',
                    type_a: true,
                    add_da: {
                        architecturePortalUrl:
                            'https://example.com/domain/api/second'
                    }
                }
            ],
            company_domains: [
                {
                    company_domain_id: 'dom-002',
                    domain_nm: 'Lending Domain',
                    playbook_id: 'playbook-002'
                }
            ]
        }
    ]
}

describe('CustomerJourneyDetails', () => {
    describe('journey header section', () => {
        it('renders the CUSTOMER JOURNEY: label', () => {
            render(<CustomerJourneyDetails journey={mockJourney} />)
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.journeyLabel)
            ).toBeInTheDocument()
        })

        it('renders the journey statement as a heading', () => {
            render(<CustomerJourneyDetails journey={mockJourney} />)
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.journeyStatement)
            ).toHaveTextContent(CJ_DETAILS_TEST_TEXT.journeyStatement)
        })

        it('renders the journey description', () => {
            render(<CustomerJourneyDetails journey={mockJourney} />)
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.journeyDesc)
            ).toHaveTextContent(CJ_DETAILS_TEST_TEXT.journeyDesc)
        })

        it('does not render a description when journey_desc is undefined', () => {
            const journeyNoDesc: CustomerJourney = {
                ...mockJourney,
                journey_desc: undefined
            }
            render(<CustomerJourneyDetails journey={journeyNoDesc} />)
            // The element still renders but should have no text content
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.journeyDesc)
            ).toHaveTextContent('')
        })
    })

    describe('metadata section labels', () => {
        it('renders Customer section label', () => {
            render(<CustomerJourneyDetails journey={mockJourney} />)
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.customerLabel)
            ).toBeInTheDocument()
        })

        it('renders Persona section label', () => {
            render(<CustomerJourneyDetails journey={mockJourney} />)
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.personaLabel)
            ).toBeInTheDocument()
        })

        it('renders Product section label', () => {
            render(<CustomerJourneyDetails journey={mockJourney} />)
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.productLabel)
            ).toBeInTheDocument()
        })

        it('renders Market section label', () => {
            render(<CustomerJourneyDetails journey={mockJourney} />)
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.marketLabel)
            ).toBeInTheDocument()
        })
    })

    describe('metadata badges', () => {
        it('renders customer_tx badges', () => {
            render(<CustomerJourneyDetails journey={mockJourney} />)
            expect(
                screen.getByTestId(
                    CJ_DETAILS_TEST_IDS.customerBadge(
                        CJ_DETAILS_TEST_TEXT.customerTx
                    )
                )
            ).toBeInTheDocument()
        })

        it('renders persona badges', () => {
            render(<CustomerJourneyDetails journey={mockJourney} />)
            expect(
                screen.getByTestId(
                    CJ_DETAILS_TEST_IDS.personaBadge(
                        CJ_DETAILS_TEST_TEXT.persona
                    )
                )
            ).toBeInTheDocument()
        })

        it('renders product badges', () => {
            render(<CustomerJourneyDetails journey={mockJourney} />)
            expect(
                screen.getByTestId(
                    CJ_DETAILS_TEST_IDS.productBadge(
                        CJ_DETAILS_TEST_TEXT.product
                    )
                )
            ).toBeInTheDocument()
        })

        it('renders market badges', () => {
            render(<CustomerJourneyDetails journey={mockJourney} />)
            expect(
                screen.getByTestId(
                    CJ_DETAILS_TEST_IDS.marketBadge(CJ_DETAILS_TEST_TEXT.market)
                )
            ).toBeInTheDocument()
        })

        it('does not render persona badges when persona is undefined', () => {
            const journeyNoPersona: CustomerJourney = {
                ...mockJourney,
                persona: undefined
            }
            render(<CustomerJourneyDetails journey={journeyNoPersona} />)
            expect(
                screen.queryByTestId(
                    CJ_DETAILS_TEST_IDS.personaBadge(
                        CJ_DETAILS_TEST_TEXT.persona
                    )
                )
            ).not.toBeInTheDocument()
        })

        it('renders UK market flag with gb country code path', () => {
            render(
                <CustomerJourneyDetails journey={mockJourneyWithMarketFilter} />
            )
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.marketFlag('UK'))
            ).toHaveAttribute('src', expect.stringContaining('/flags/gb.png'))
        })
    })

    describe('EBCM stages table visibility', () => {
        it('does not render the stages table when journey_stages is empty', () => {
            const journeyEmptyStages: CustomerJourney = {
                ...mockJourney,
                journey_stages: []
            }
            render(<CustomerJourneyDetails journey={journeyEmptyStages} />)
            expect(
                screen.queryByTestId(CJ_DETAILS_TEST_IDS.capabilitiesHeading)
            ).not.toBeInTheDocument()
        })

        it('does not render the stages table when journey_stages is undefined', () => {
            render(<CustomerJourneyDetails journey={mockJourney} />)
            expect(
                screen.queryByTestId(CJ_DETAILS_TEST_IDS.capabilitiesHeading)
            ).not.toBeInTheDocument()
        })

        it('renders stage names in table column headers', () => {
            render(<CustomerJourneyDetails journey={mockJourneyWithStages} />)
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.stageName('stage-001'))
            ).toHaveTextContent(CJ_DETAILS_TEST_TEXT.stage1Name)
        })

        it('renders all stage headers when multiple stages exist', () => {
            render(
                <CustomerJourneyDetails journey={mockJourneyWithTwoStages} />
            )
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.stageName('stage-001'))
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.stageName('stage-002'))
            ).toBeInTheDocument()
        })

        it('renders the Capabilities row heading', () => {
            render(<CustomerJourneyDetails journey={mockJourneyWithStages} />)
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.capabilitiesHeading)
            ).toBeInTheDocument()
        })

        it('renders the Platforms Logo for the Company Domains row', () => {
            render(<CustomerJourneyDetails journey={mockJourneyWithStages} />)
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.platformsLogo)
            ).toBeInTheDocument()
        })

        it('renders the APIs row heading', () => {
            render(<CustomerJourneyDetails journey={mockJourneyWithStages} />)
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.apisHeading)
            ).toBeInTheDocument()
        })
    })

    describe('Capabilities', () => {
        it('renders a linked card for a capability with a non-empty capability_id', () => {
            render(<CustomerJourneyDetails journey={mockJourneyWithStages} />)
            const link = screen.getByTestId(
                CJ_DETAILS_TEST_IDS.capabilityLink('cap-001')
            )
            expect(link).toHaveAttribute(
                'href',
                CJ_DETAILS_TEST_HREFS.capability
            )
            expect(link).toHaveTextContent(
                CJ_DETAILS_TEST_TEXT.capabilityWithId
            )
        })

        it('renders capability text without a link when capability_id is empty', () => {
            render(<CustomerJourneyDetails journey={mockJourneyWithStages} />)
            expect(
                screen.getByTestId(
                    CJ_DETAILS_TEST_IDS.capabilityText('roadmap-item')
                )
            ).toHaveTextContent(CJ_DETAILS_TEST_TEXT.capabilityNoId)
            // Ensure there is no link for this capability
            expect(
                screen.queryByTestId(CJ_DETAILS_TEST_IDS.capabilityLink(''))
            ).not.toBeInTheDocument()
        })
    })

    describe('Company Domains', () => {
        it('renders a linked card for each company domain', () => {
            render(<CustomerJourneyDetails journey={mockJourneyWithStages} />)
            const link = screen.getByTestId(
                CJ_DETAILS_TEST_IDS.domainLink('dom-001')
            )
            expect(link).toHaveAttribute('href', CJ_DETAILS_TEST_HREFS.domain)
            expect(link).toHaveTextContent(CJ_DETAILS_TEST_TEXT.domainName)
        })
    })

    describe('APIs', () => {
        it('renders a linked card for a type_a API', () => {
            render(<CustomerJourneyDetails journey={mockJourneyWithStages} />)
            const link = screen.getByTestId(
                CJ_DETAILS_TEST_IDS.apiLink('api-001')
            )
            expect(link).toHaveAttribute('href', CJ_DETAILS_TEST_HREFS.api)
            expect(link).toHaveTextContent(CJ_DETAILS_TEST_TEXT.apiTypeA)
        })

        it('renders API text without a link when type_a is false', () => {
            render(<CustomerJourneyDetails journey={mockJourneyWithStages} />)
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.apiText('api-002'))
            ).toHaveTextContent(CJ_DETAILS_TEST_TEXT.apiNonTypeA)
            expect(
                screen.queryByTestId(CJ_DETAILS_TEST_IDS.apiLink('api-002'))
            ).not.toBeInTheDocument()
        })

        it('deduplicates APIs with the same api_nm', () => {
            const stageWithDuplicateApis: JourneyStage = {
                ...mockStage,
                apis_da: [
                    {
                        api_nm: CJ_DETAILS_TEST_TEXT.duplicateApiName,
                        api_metadata_id: 'api-001',
                        prim_company_domain_id: 'dom-001',
                        type_a: true,
                        add_da: {
                            architecturePortalUrl:
                                'https://example.com/domain/api/details'
                        }
                    },
                    {
                        api_nm: CJ_DETAILS_TEST_TEXT.duplicateApiName,
                        api_metadata_id: 'api-002',
                        prim_company_domain_id: 'dom-001',
                        type_a: true,
                        add_da: {
                            architecturePortalUrl:
                                'https://example.com/domain/api/details'
                        }
                    }
                ]
            }
            const journeyWithDuplicates: CustomerJourney = {
                ...mockJourney,
                journey_stages: [stageWithDuplicateApis]
            }
            render(<CustomerJourneyDetails journey={journeyWithDuplicates} />)
            // Only api-001 should render since api-002 is deduplicated (same api_nm)
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.apiLink('api-001'))
            ).toBeInTheDocument()
            expect(
                screen.queryByTestId(CJ_DETAILS_TEST_IDS.apiLink('api-002'))
            ).not.toBeInTheDocument()
        })

        it('renders graph-sourced endpoints and ignores apis_da when both are somehow present', () => {
            const journey: CustomerJourney = {
                ...mockJourney,
                journey_stages: [
                    {
                        ...mockStage,
                        apis: [
                            {
                                api_endpoint_mtda_id: 'ep-001',
                                api_nm: 'Get Card Details',
                                prim_company_domain_id:
                                    CJ_DETAILS_MAPPED_DOMAIN_ID,
                                type_a: true
                            }
                        ]
                    }
                ]
            }
            render(<CustomerJourneyDetails journey={journey} />)

            const link = screen.getByTestId(
                CJ_DETAILS_TEST_IDS.apiLink('ep-001')
            )
            expect(link).toHaveAttribute(
                'href',
                CJ_DETAILS_TEST_HREFS.apiEndpoint
            )
            expect(link).toHaveTextContent('Get Card Details')
            // The legacy blob from mockStage must not also render
            expect(
                screen.queryByTestId(CJ_DETAILS_TEST_IDS.apiLink('api-001'))
            ).not.toBeInTheDocument()
        })

        it('renders an endpoint as text when its domain has no docs URL mapped', () => {
            const journey: CustomerJourney = {
                ...mockJourney,
                journey_stages: [
                    {
                        ...mockStage,
                        apis_da: undefined,
                        apis: [
                            {
                                api_endpoint_mtda_id: 'ep-unmapped',
                                api_nm: 'Unmapped Endpoint',
                                prim_company_domain_id: 'dom-not-in-map',
                                type_a: true
                            }
                        ]
                    }
                ]
            }
            render(<CustomerJourneyDetails journey={journey} />)

            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.apiText('ep-unmapped'))
            ).toHaveTextContent('Unmapped Endpoint')
            expect(
                screen.queryByTestId(CJ_DETAILS_TEST_IDS.apiLink('ep-unmapped'))
            ).not.toBeInTheDocument()
        })

        it('renders an endpoint as text when it is not type_a', () => {
            const journey: CustomerJourney = {
                ...mockJourney,
                journey_stages: [
                    {
                        ...mockStage,
                        apis_da: undefined,
                        apis: [
                            {
                                api_endpoint_mtda_id: 'ep-type-b',
                                api_nm: 'Type B Endpoint',
                                prim_company_domain_id:
                                    CJ_DETAILS_MAPPED_DOMAIN_ID,
                                type_a: false
                            }
                        ]
                    }
                ]
            }
            render(<CustomerJourneyDetails journey={journey} />)

            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.apiText('ep-type-b'))
            ).toHaveTextContent('Type B Endpoint')
        })

        it('renders the APIs row when only some stages have API data', () => {
            const journey: CustomerJourney = {
                ...mockJourney,
                journey_stages: [
                    { ...mockStage, apis_da: undefined },
                    {
                        ...mockStage,
                        journey_stage_id: 'stage-002',
                        apis_da: undefined,
                        apis: [
                            {
                                api_endpoint_mtda_id: 'ep-002',
                                api_nm: 'Second Endpoint',
                                prim_company_domain_id:
                                    CJ_DETAILS_MAPPED_DOMAIN_ID,
                                type_a: true
                            }
                        ]
                    }
                ]
            }
            // A stage with neither key must not throw while its sibling renders
            render(<CustomerJourneyDetails journey={journey} />)

            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.apiLink('ep-002'))
            ).toBeInTheDocument()
        })

        it('deduplicates endpoints sharing an api_endpoint_mtda_id', () => {
            const duplicate = {
                api_endpoint_mtda_id: 'ep-001',
                api_nm: 'Get Card Details',
                prim_company_domain_id: CJ_DETAILS_MAPPED_DOMAIN_ID,
                type_a: true
            }
            const journey: CustomerJourney = {
                ...mockJourney,
                journey_stages: [
                    {
                        ...mockStage,
                        apis_da: undefined,
                        apis: [duplicate, { ...duplicate }]
                    }
                ]
            }
            render(<CustomerJourneyDetails journey={journey} />)

            expect(
                screen.getAllByTestId(CJ_DETAILS_TEST_IDS.apiLink('ep-001'))
            ).toHaveLength(1)
        })

        it('filters graph-sourced endpoints by selected market', () => {
            const journey: CustomerJourney = {
                ...mockJourney,
                market: ['US', 'UK'],
                journey_stages: [
                    {
                        ...mockStage,
                        apis_da: undefined,
                        apis: [
                            {
                                api_endpoint_mtda_id: 'ep-us',
                                api_nm: 'US Endpoint',
                                prim_company_domain_id:
                                    CJ_DETAILS_MAPPED_DOMAIN_ID,
                                type_a: true,
                                market: ['US']
                            },
                            {
                                api_endpoint_mtda_id: 'ep-uk',
                                api_nm: 'UK Endpoint',
                                prim_company_domain_id:
                                    CJ_DETAILS_MAPPED_DOMAIN_ID,
                                type_a: true,
                                market: ['UK']
                            }
                        ]
                    }
                ]
            }
            render(<CustomerJourneyDetails journey={journey} />)

            fireEvent.click(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.marketBadge('US'))
            )

            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.apiLink('ep-us'))
            ).toBeInTheDocument()
            expect(
                screen.queryByTestId(CJ_DETAILS_TEST_IDS.apiLink('ep-uk'))
            ).not.toBeInTheDocument()
        })

        it('filters APIs by selected market and restores after toggling filter off', () => {
            render(
                <CustomerJourneyDetails journey={mockJourneyWithMarketFilter} />
            )

            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.apiLink('api-us'))
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.apiLink('api-uk'))
            ).toBeInTheDocument()

            fireEvent.click(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.marketBadge('UK'))
            )

            expect(
                screen.queryByTestId(CJ_DETAILS_TEST_IDS.apiLink('api-us'))
            ).not.toBeInTheDocument()
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.apiLink('api-uk'))
            ).toBeInTheDocument()

            fireEvent.click(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.marketBadge('UK'))
            )

            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.apiLink('api-us'))
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.apiLink('api-uk'))
            ).toBeInTheDocument()
        })
    })

    describe('Touch points, business actions, and applications', () => {
        it('renders Touch Points and Business Actions rows when data exists', () => {
            render(<CustomerJourneyDetails journey={mockJourneyWithAllRows} />)

            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.touchPointsHeading)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.businessActionsHeading)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(
                    CJ_DETAILS_TEST_IDS.touchPointText('Authenticate in app')
                )
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(
                    CJ_DETAILS_TEST_IDS.businessActionText(
                        'Approve transaction'
                    )
                )
            ).toBeInTheDocument()
        })

        it('renders Applications row and deduplicates applications by name', () => {
            render(<CustomerJourneyDetails journey={mockJourneyWithAllRows} />)

            expect(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.applicationsHeading)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(
                    CJ_DETAILS_TEST_IDS.applicationText('app-001')
                )
            ).toBeInTheDocument()
            expect(
                screen.queryByTestId(
                    CJ_DETAILS_TEST_IDS.applicationText('app-002')
                )
            ).not.toBeInTheDocument()
        })

        it('filters applications by selected market', () => {
            render(
                <CustomerJourneyDetails journey={mockJourneyWithMarketFilter} />
            )

            expect(
                screen.getByTestId(
                    CJ_DETAILS_TEST_IDS.applicationText('app-us')
                )
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(
                    CJ_DETAILS_TEST_IDS.applicationText('app-uk')
                )
            ).toBeInTheDocument()

            fireEvent.click(
                screen.getByTestId(CJ_DETAILS_TEST_IDS.marketBadge('US'))
            )

            expect(
                screen.getByTestId(
                    CJ_DETAILS_TEST_IDS.applicationText('app-us')
                )
            ).toBeInTheDocument()
            expect(
                screen.queryByTestId(
                    CJ_DETAILS_TEST_IDS.applicationText('app-uk')
                )
            ).not.toBeInTheDocument()
        })
    })
})
