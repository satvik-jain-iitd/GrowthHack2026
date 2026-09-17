import React from 'react'
import { render, screen } from '@/test/utils/test-utils'
import CJPrevNext from './CJPrevNext'
import { useCustomerJourneys } from '@/app/business-architecture/hooks'
import { PrevNext } from '@/types/PrevNext'
import { CJ_TEST_TEXT, CJ_TEST_HREFS } from '../test-data'
import { CJ_PREV_NEXT_TEST_IDS } from '../test-ids'

jest.mock('@/app/business-architecture/hooks')
jest.mock('@/components/ui', () => ({
    NoPrefetchLink: ({
        href,
        children,
        ...props
    }: {
        href: string
        children: React.ReactNode
        [key: string]: unknown
        // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
    }) => (
        // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
        <a href={href} {...props}>
            {children}
        </a>
    )
}))

const mockCustomerJourneys = [
    {
        journey_id: 'manage-account',
        journey_statement: CJ_TEST_TEXT.manageAccountStatement,
        journey_grp_tx: 'Account',
        customer_tx: [],
        market: [],
        product: []
    },
    {
        journey_id: 'view-statements',
        journey_statement: CJ_TEST_TEXT.viewStatementsStatement,
        journey_grp_tx: 'Account',
        customer_tx: [],
        market: [],
        product: []
    }
]

describe('CJPrevNext', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        ;(useCustomerJourneys as jest.Mock).mockReturnValue({
            customer_journey: mockCustomerJourneys
        })
    })

    describe('with both previous and next', () => {
        const prevNext: PrevNext = {
            previous: {
                label: CJ_TEST_TEXT.manageAccount,
                href: CJ_TEST_HREFS.prevPage
            },
            next: {
                label: CJ_TEST_TEXT.viewStatements,
                href: CJ_TEST_HREFS.nextPage
            }
        }

        it('renders Previous and Next labels', () => {
            render(<CJPrevNext prevNext={prevNext} />)

            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.previousLabel)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.nextLabel)
            ).toBeInTheDocument()
        })

        it('shows journey_statement for previous when label matches a journey_id', () => {
            render(<CJPrevNext prevNext={prevNext} />)

            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.previousJourney)
            ).toHaveTextContent(CJ_TEST_TEXT.manageAccountStatement)
        })

        it('shows journey_statement for next when label matches a journey_id', () => {
            render(<CJPrevNext prevNext={prevNext} />)

            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.nextJourney)
            ).toHaveTextContent(CJ_TEST_TEXT.viewStatementsStatement)
        })

        it('renders correct hrefs for previous and next links', () => {
            render(<CJPrevNext prevNext={prevNext} />)

            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.previousLink)
            ).toHaveAttribute('href', CJ_TEST_HREFS.prevPage)
            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.nextLink)
            ).toHaveAttribute('href', CJ_TEST_HREFS.nextPage)
        })
    })

    describe('with previous only', () => {
        const prevNext: PrevNext = {
            previous: {
                label: CJ_TEST_TEXT.manageAccount,
                href: CJ_TEST_HREFS.prevPage
            }
        }

        it('renders Previous label', () => {
            render(<CJPrevNext prevNext={prevNext} />)
            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.previousLabel)
            ).toBeInTheDocument()
        })

        it('does not render Next label', () => {
            render(<CJPrevNext prevNext={prevNext} />)
            expect(
                screen.queryByTestId(CJ_PREV_NEXT_TEST_IDS.nextLabel)
            ).not.toBeInTheDocument()
        })

        it('renders a placeholder span instead of Next', () => {
            render(<CJPrevNext prevNext={prevNext} />)
            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.nextPlaceholder)
            ).toBeInTheDocument()
        })
    })

    describe('with next only', () => {
        const prevNext: PrevNext = {
            next: {
                label: CJ_TEST_TEXT.viewStatements,
                href: CJ_TEST_HREFS.nextPage
            }
        }

        it('renders Next label', () => {
            render(<CJPrevNext prevNext={prevNext} />)
            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.nextLabel)
            ).toBeInTheDocument()
        })

        it('does not render Previous label', () => {
            render(<CJPrevNext prevNext={prevNext} />)
            expect(
                screen.queryByTestId(CJ_PREV_NEXT_TEST_IDS.previousLabel)
            ).not.toBeInTheDocument()
        })

        it('renders a placeholder span instead of Previous', () => {
            render(<CJPrevNext prevNext={prevNext} />)
            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.previousPlaceholder)
            ).toBeInTheDocument()
        })
    })

    describe('with neither previous nor next', () => {
        const prevNext: PrevNext = {}

        it('renders no links', () => {
            render(<CJPrevNext prevNext={prevNext} />)
            expect(
                screen.queryByTestId(CJ_PREV_NEXT_TEST_IDS.previousLabel)
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId(CJ_PREV_NEXT_TEST_IDS.nextLabel)
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId(CJ_PREV_NEXT_TEST_IDS.previousLink)
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId(CJ_PREV_NEXT_TEST_IDS.nextLink)
            ).not.toBeInTheDocument()
        })
    })

    describe('label fallback when no matching journey found', () => {
        const prevNext: PrevNext = {
            previous: {
                label: CJ_TEST_TEXT.unknownJourney,
                href: CJ_TEST_HREFS.prev
            },
            next: {
                label: CJ_TEST_TEXT.anotherUnknown,
                href: CJ_TEST_HREFS.next
            }
        }

        it('falls back to the raw label when journey_id does not match', () => {
            render(<CJPrevNext prevNext={prevNext} />)

            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.previousJourney)
            ).toHaveTextContent(CJ_TEST_TEXT.unknownJourney)
            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.nextJourney)
            ).toHaveTextContent(CJ_TEST_TEXT.anotherUnknown)
        })
    })

    describe('when customer_journey is undefined', () => {
        it('falls back to raw labels gracefully', () => {
            ;(useCustomerJourneys as jest.Mock).mockReturnValue({
                customer_journey: undefined
            })

            const prevNext: PrevNext = {
                previous: {
                    label: CJ_TEST_TEXT.someLabel,
                    href: CJ_TEST_HREFS.prev
                },
                next: {
                    label: CJ_TEST_TEXT.otherLabel,
                    href: CJ_TEST_HREFS.next
                }
            }

            render(<CJPrevNext prevNext={prevNext} />)

            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.previousJourney)
            ).toHaveTextContent(CJ_TEST_TEXT.someLabel)
            expect(
                screen.getByTestId(CJ_PREV_NEXT_TEST_IDS.nextJourney)
            ).toHaveTextContent(CJ_TEST_TEXT.otherLabel)
        })
    })
})
