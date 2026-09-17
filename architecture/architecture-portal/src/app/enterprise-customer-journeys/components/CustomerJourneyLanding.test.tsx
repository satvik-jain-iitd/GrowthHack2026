import React from 'react'
import { render, screen } from '@/test/utils/test-utils'
import { CustomerJourneyLanding } from './CustomerJourneyLanding'
import { useUserContext } from '@/context'
import { useCustomerJourneys } from '@/app/business-architecture/hooks/useGetCustomerJourneys'
import { CJ_LANDING_TEST_TEXT, CJ_DETAILS_TEST_TEXT } from '../test-data'
import { CJ_LANDING_TEST_IDS, CJ_DETAILS_TEST_IDS } from '../test-ids'

jest.mock('@/context')
jest.mock('@/app/business-architecture/hooks/useGetCustomerJourneys')

jest.mock('@/context/UserContext', () => ({
    useUserContext: jest.fn()
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

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: Record<string, unknown>) => <img {...props} />
}))

jest.mock('@americanexpress/dls-icons')

const mockJourney = {
    journey_id: CJ_LANDING_TEST_IDS.journeyId,
    journey_statement: CJ_LANDING_TEST_TEXT.journeyStatement,
    journey_grp_tx: 'Finance',
    customer_tx: [],
    market: [],
    product: []
}

const mockJourneyWithStages = {
    ...mockJourney,
    journey_stages: [
        {
            journey_stage_id: 'stage-1',
            journey_stage_name: CJ_DETAILS_TEST_TEXT.stage1Name,
            capabilities: [
                {
                    capability_id: 'cap-1',
                    capability_nm: CJ_DETAILS_TEST_TEXT.capabilityWithId,
                    capability_key_tx: 'planning'
                }
            ],
            apis: [],
            company_domains: []
        }
    ]
}

describe('CustomerJourneyLanding', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        ;(useCustomerJourneys as jest.Mock).mockReturnValue({
            customer_journey: [mockJourney]
        })
        ;(useUserContext as jest.Mock).mockReturnValue({
            userInfo: {
                displayName: 'Test User',
                userPrincipalName: '[REDACTED_EMAIL_ADDRESS_4]'
            }
        })
    })

    it('renders CustomerJourneyDetails when the journey id matches', () => {
        render(<CustomerJourneyLanding id={CJ_LANDING_TEST_IDS.journeyId} />)

        expect(
            screen.getByTestId(CJ_DETAILS_TEST_IDS.journeyLabel)
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(CJ_DETAILS_TEST_IDS.journeyStatement)
        ).toHaveTextContent(CJ_LANDING_TEST_TEXT.journeyStatement)
    })

    it('renders nothing when the journey id does not match', () => {
        render(
            <CustomerJourneyLanding id={CJ_LANDING_TEST_IDS.unknownJourneyId} />
        )

        expect(
            screen.queryByTestId(CJ_DETAILS_TEST_IDS.journeyStatement)
        ).not.toBeInTheDocument()
    })

    it('renders nothing when customer_journey is undefined', () => {
        ;(useCustomerJourneys as jest.Mock).mockReturnValue({
            customer_journey: undefined
        })

        render(<CustomerJourneyLanding id={CJ_LANDING_TEST_IDS.journeyId} />)

        expect(
            screen.queryByTestId(CJ_DETAILS_TEST_IDS.journeyStatement)
        ).not.toBeInTheDocument()
    })

    it('renders capabilities when journey has stages', () => {
        ;(useCustomerJourneys as jest.Mock).mockReturnValue({
            customer_journey: [mockJourneyWithStages]
        })

        render(<CustomerJourneyLanding id={CJ_LANDING_TEST_IDS.journeyId} />)

        expect(
            screen.getByTestId(CJ_DETAILS_TEST_IDS.capabilitiesHeading)
        ).toBeInTheDocument()
    })
})
