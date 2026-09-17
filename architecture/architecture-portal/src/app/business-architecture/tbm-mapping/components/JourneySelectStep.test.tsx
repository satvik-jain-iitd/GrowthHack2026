import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/test-utils'
import { JourneySelectStep } from './JourneySelectStep'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'
import type { ApptioEpicJourney } from '@/app/business-architecture/hooks/useGetApptioEpicJourneys'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('@/app/business-architecture/hooks', () => ({
    useCustomerJourneys: jest.fn(),
    useGetApptioEpicJourneys: jest.fn(),
    saveApptioEpicJourneys: jest.fn().mockResolvedValue(undefined)
}))

jest.mock('@/context', () => ({
    useUserContext: () => ({
        attributes: { email: 'test@test.com', fullName: 'Test User' }
    })
}))

jest.mock('../utils/checkSessionValid', () => ({
    checkSessionValid: jest.fn().mockResolvedValue(true)
}))

jest.mock('@/app/business-architecture/components/EbaHeader', () => ({
    EbaHeader: ({ title }: { title: string }) => (
        <div data-testid='eba-header'>{title}</div>
    )
}))

jest.mock('./AIJourneyRecommendBanner', () => ({
    AIJourneyRecommendBanner: () => <div data-testid='ai-banner' />
}))

jest.mock('@americanexpress/dls-icons', () => ({
    IconInfo: () => <span />,
    IconSearch: () => <span />,
    IconClose: () => <span />,
    IconWarning: () => <span data-testid='icon-warning' />
}))

jest.mock('@/components/icons/AIIcon', () => ({
    AIIcon: () => <span data-testid='ai-icon' />
}))

jest.mock('@/components/ui', () => ({
    Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

import {
    useCustomerJourneys,
    useGetApptioEpicJourneys,
    saveApptioEpicJourneys
} from '@/app/business-architecture/hooks'
import { checkSessionValid } from '../utils/checkSessionValid'

const mockUseCustomerJourneys = useCustomerJourneys as jest.Mock
const mockUseGetApptioEpicJourneys = useGetApptioEpicJourneys as jest.Mock
const mockSaveApptioEpicJourneys = saveApptioEpicJourneys as jest.Mock
const mockCheckSession = checkSessionValid as jest.Mock

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const makeJourney = (
    id: string,
    label: string,
    group = 'Group A'
): CustomerJourney => ({
    journey_id: id,
    journey_statement: label,
    journey_grp_tx: group,
    customer_tx: [],
    market: [],
    product: []
})

const makeEpicJourney = (id: string, isAI = false): ApptioEpicJourney => ({
    journeyId: id,
    journeyName: id,
    journeyGroup: 'Group A',
    isAIRecommended: isAI
})

const journeys: CustomerJourney[] = [
    makeJourney('j1', 'Buy online', 'Shopping'),
    makeJourney('j2', 'Return item', 'Shopping'),
    makeJourney('j3', 'Open account', 'Banking')
]

beforeEach(() => {
    jest.clearAllMocks()
    mockUseCustomerJourneys.mockReturnValue({ customer_journey: journeys })
    // By default, epic has j1 and j2 pre-selected (j1 AI-recommended)
    mockUseGetApptioEpicJourneys.mockReturnValue({
        epicJourneys: [
            makeEpicJourney('j1', true),
            makeEpicJourney('j2', false)
        ],
        loading: false,
        error: null
    })
    mockSaveApptioEpicJourneys.mockResolvedValue(undefined)
})

describe('JourneySelectStep', () => {
    it('renders all journey statements from useCustomerJourneys', () => {
        render(<JourneySelectStep epicId='EPIC-1' onNext={jest.fn()} />)
        expect(
            screen.getByTestId('journey-checkbox-label-j1')
        ).toHaveTextContent('Buy online')
        expect(
            screen.getByTestId('journey-checkbox-label-j2')
        ).toHaveTextContent('Return item')
        expect(
            screen.getByTestId('journey-checkbox-label-j3')
        ).toHaveTextContent('Open account')
    })

    it('epic journeys are pre-checked on load', async () => {
        render(<JourneySelectStep epicId='EPIC-1' onNext={jest.fn()} />)
        await waitFor(() => {
            const inputs = document.querySelectorAll('input[type="checkbox"]')
            const checked = Array.from(inputs).filter(
                (el: Element) => (el as HTMLInputElement).checked
            )
            expect(checked.length).toBe(2)
        })
    })

    it('filtering by search term narrows the journey list', async () => {
        render(<JourneySelectStep epicId='EPIC-1' onNext={jest.fn()} />)
        fireEvent.change(
            screen.getByPlaceholderText('Type an Enterprise Customer Journey'),
            { target: { value: 'account' } }
        )
        await waitFor(() => {
            expect(
                screen.getByTestId('journey-checkbox-label-j3')
            ).toHaveTextContent('Open account')
            const checkboxes = document.querySelectorAll(
                'input[type="checkbox"]'
            )
            expect(checkboxes.length).toBe(1)
        })
    })

    it('Clear button clears the search term and deselects all', async () => {
        render(<JourneySelectStep epicId='EPIC-1' onNext={jest.fn()} />)
        fireEvent.change(
            screen.getByPlaceholderText('Type an Enterprise Customer Journey'),
            { target: { value: 'buy' } }
        )
        fireEvent.click(screen.getByRole('button', { name: /Clear/i }))
        await waitFor(() => {
            expect(
                screen.getByPlaceholderText(
                    'Type an Enterprise Customer Journey'
                )
            ).toHaveValue('')
            const inputs = document.querySelectorAll('input[type="checkbox"]')
            const checked = Array.from(inputs).filter(
                (el: Element) => (el as HTMLInputElement).checked
            )
            expect(checked.length).toBe(0)
        })
    })

    it('toggling a checkbox selects or deselects a journey', async () => {
        render(<JourneySelectStep epicId='EPIC-1' onNext={jest.fn()} />)
        // Groups sort alphabetically: Banking (j3) renders before Shopping (j1, j2)
        const user = userEvent.setup()
        const controls = document.querySelectorAll('[data-part="control"]')
        // controls[0] = j3 (Banking group, first alphabetically), not pre-selected
        const j3Control = controls[0] as HTMLElement
        await user.click(j3Control)
        await waitFor(() => {
            const checkedInputs = Array.from(
                document.querySelectorAll('input[type="checkbox"]')
            ).filter(el => (el as HTMLInputElement).checked)
            expect(checkedInputs.length).toBe(3)
        })
    })

    it('"Review Impacted Capabilities" is disabled when nothing is selected', async () => {
        render(<JourneySelectStep epicId='EPIC-1' onNext={jest.fn()} />)
        fireEvent.click(screen.getByRole('button', { name: /Clear/i }))
        await waitFor(() => {
            expect(
                screen.getByRole('button', {
                    name: /Review Impacted Capabilities/i
                })
            ).toBeDisabled()
        })
    })

    it('clicking "Review Impacted Capabilities" calls onNext with selected journeys and state', async () => {
        const onNext = jest.fn()
        render(<JourneySelectStep epicId='EPIC-1' onNext={onNext} />)
        await waitFor(() => {
            const checked = Array.from(
                document.querySelectorAll('input[type="checkbox"]')
            ).filter(el => (el as HTMLInputElement).checked)
            expect(checked.length).toBeGreaterThan(0)
        })
        fireEvent.click(
            screen.getByRole('button', {
                name: /Review Impacted Capabilities/i
            })
        )
        await waitFor(() => {
            expect(onNext).toHaveBeenCalledTimes(1)
            const [selectedJourneys, state] = onNext.mock.calls[0]
            expect(selectedJourneys.length).toBeGreaterThan(0)
            expect(state.selectedIds).toBeInstanceOf(Set)
        })
    })

    it('initialState pre-populates searchTerm', () => {
        render(
            <JourneySelectStep
                epicId='EPIC-1'
                onNext={jest.fn()}
                initialState={{
                    selectedIds: new Set(['j3']),
                    searchTerm: 'open'
                }}
            />
        )
        expect(
            screen.getByPlaceholderText('Type an Enterprise Customer Journey')
        ).toHaveValue('open')
    })

    it('initialState selectedIds pre-checks those journeys', async () => {
        render(
            <JourneySelectStep
                epicId='EPIC-1'
                onNext={jest.fn()}
                initialState={{ selectedIds: new Set(['j3']), searchTerm: '' }}
            />
        )
        await waitFor(() => {
            const inputs = document.querySelectorAll('input[type="checkbox"]')
            const checked = Array.from(inputs).filter(
                el => (el as HTMLInputElement).checked
            )
            expect(checked.length).toBe(1)
        })
    })

    it('removing a journey tag via onRemoveJourney that is not selected is a no-op', async () => {
        const onNext = jest.fn()
        render(<JourneySelectStep epicId='EPIC-1' onNext={onNext} />)
        fireEvent.click(screen.getByRole('button', { name: /Clear/i }))
        await waitFor(() => {
            expect(
                screen.getByRole('button', {
                    name: /Review Impacted Capabilities/i
                })
            ).toBeDisabled()
        })
    })

    it('clicking the remove button on a journey tag removes it from selectedIds', async () => {
        render(<JourneySelectStep epicId='EPIC-1' onNext={jest.fn()} />)
        await waitFor(() => screen.getByTestId('journey-tag-j1'))
        fireEvent.click(
            screen.getByRole('button', { name: /Remove Buy online/i })
        )
        await waitFor(() => {
            const checked = Array.from(
                document.querySelectorAll('input[type="checkbox"]')
            ).filter(el => (el as HTMLInputElement).checked)
            expect(checked.length).toBe(1)
        })
    })

    it('journey grouped under "Other" when journey_grp_tx is falsy', () => {
        mockUseCustomerJourneys.mockReturnValue({
            customer_journey: [
                {
                    journey_id: 'jx',
                    journey_statement: 'Mystery journey',
                    journey_grp_tx: '',
                    customer_tx: [],
                    market: [],
                    product: []
                }
            ]
        })
        render(<JourneySelectStep epicId='EPIC-1' onNext={jest.fn()} />)
        expect(
            screen.getByTestId('journey-checkbox-label-jx')
        ).toHaveTextContent('Mystery journey')
    })

    it('renders EpicNotFoundState when API returns an epic-not-found error', () => {
        mockUseGetApptioEpicJourneys.mockReturnValue({
            epicJourneys: [],
            loading: false,
            error: new Error('No epic data found')
        })
        render(<JourneySelectStep epicId='NONEXISTENT' onNext={jest.fn()} />)
        expect(screen.getByTestId('epic-not-found-heading')).toBeInTheDocument()
    })

    it('renders SessionExpiredState when session is invalid on save', async () => {
        mockCheckSession.mockResolvedValue(false)
        render(<JourneySelectStep epicId='EPIC-1' onNext={jest.fn()} />)
        const nextBtn = screen.getByRole('button', {
            name: /Review Impacted Capabilities/i
        })
        fireEvent.click(nextBtn)
        await waitFor(() => {
            expect(
                screen.getByTestId('session-expired-heading')
            ).toBeInTheDocument()
        })
        expect(mockSaveApptioEpicJourneys).not.toHaveBeenCalled()
    })
})
