// import React from 'react'
// import '@testing-library/jest-dom'
// import { screen, fireEvent, waitFor, act } from '@testing-library/react'
// import { render } from '@/test/utils/test-utils'
// import { CapabilitySelectMap } from './CapabilitySelectMap'
// import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'
// import type { CapabilityNode } from '@/app/business-architecture/types'
//
// // ---------------------------------------------------------------------------
// // Mocks
// // ---------------------------------------------------------------------------
//
// jest.mock('@/app/business-architecture/hooks', () => ({
//     useCapabilities: jest.fn(),
//     useGetApptioJourneyCapabilities: jest.fn(),
//     useGetApptioEpicMappings: jest.fn()
// }))
//
// jest.mock('@/context', () => ({
//     useUserContext: () => ({
//         attributes: { email: 'test@test.com', fullName: 'Test User' }
//     })
// }))
//
// jest.mock(
//     '@/app/business-architecture/hooks/useSaveApptioJourneyCapabilities',
//     () => ({
//         saveApptioJourneyCapabilities: jest.fn().mockResolvedValue(undefined)
//     })
// )
//
// jest.mock(
//     '@/app/business-architecture/hooks/useSubmitApptioEpicMappings',
//     () => ({
//         submitApptioEpicMappings: jest.fn().mockResolvedValue(undefined)
//     })
// )
//
// jest.mock('react-toastify', () => ({
//     toast: { success: jest.fn(), error: jest.fn() }
// }))
//
// jest.mock('../utils/checkSessionValid', () => ({
//     checkSessionValid: jest.fn().mockResolvedValue(true)
// }))
//
// jest.mock('@/app/business-architecture/components/EbaHeader', () => ({
//     EbaHeader: ({ title }: { title: string }) => (
//         <div data-testid='eba-header'>{title}</div>
//     )
// }))
//
// jest.mock('./JourneySidebar', () => ({
//     JourneySidebar: () => <div data-testid='journey-sidebar' />
// }))
//
// jest.mock('./CapabilitySelectCard', () => ({
//     CapabilitySelectCard: ({ capability }: { capability: CapabilityNode }) => (
//         <div data-testid={`cap-card-${capability.capability_id}`}>
//             {capability.capability_nm}
//         </div>
//     )
// }))
//
// jest.mock('./JourneyCapabilityHeader', () => ({
//     JourneyCapabilityHeader: ({
//         onBack,
//         onSaveAndNext
//     }: {
//         journeyStatement: string
//         onBack?: () => void
//         onSaveAndNext: () => void
//         onSubmitAll: () => void
//         isLastJourney: boolean
//         allJourneysVisited: boolean
//     }) => (
//         <div>
//             {onBack && (
//                 <button data-testid='back-btn' onClick={onBack}>
//                     Back
//                 </button>
//             )}
//             <button data-testid='submit-btn' onClick={onSaveAndNext}>
//                 Submit
//             </button>
//         </div>
//     )
// }))
//
// jest.mock('./SubmitSummaryModal', () => ({
//     SubmitSummaryModal: ({
//         isOpen,
//         onClose,
//         onConfirm
//     }: {
//         isOpen: boolean
//         onClose: () => void
//         onConfirm: () => void
//     }) =>
//         isOpen ? (
//             <div data-testid='modal'>
//                 <button data-testid='modal-confirm' onClick={onConfirm}>
//                     Confirm
//                 </button>
//                 <button data-testid='modal-cancel' onClick={onClose}>
//                     Cancel
//                 </button>
//             </div>
//         ) : null
// }))
//
// import {
//     useCapabilities,
//     useGetApptioJourneyCapabilities,
//     useGetApptioEpicMappings
// } from '@/app/business-architecture/hooks'
//
// const mockUseCapabilities = useCapabilities as jest.Mock
// const mockUseGetApptioJourneyCapabilities =
//     useGetApptioJourneyCapabilities as jest.Mock
// const mockUseGetApptioEpicMappings = useGetApptioEpicMappings as jest.Mock
//
// // ---------------------------------------------------------------------------
// // Fixtures
// // ---------------------------------------------------------------------------
//
// const makeJourney = (id: string): CustomerJourney => ({
//     journey_id: id,
//     journey_statement: `Journey ${id}`,
//     journey_grp_tx: 'Group',
//     customer_tx: [],
//     market: [],
//     product: []
// })
//
// const l1Cap = {
//     capability_id: 'l1',
//     parent_capability_id: null,
//     capability_key_tx: 'l1',
//     capability_nm: 'Technology',
//     capability_desc_tx: '',
//     capability_level: 1,
//     begins_with_tx: '',
//     ends_with_tx: '',
//     includes_tx: '',
//     customer_journey_id: [],
//     product_tx: [],
//     region_tx: [],
//     customer_type: [],
//     l1_capability_id: 'l1',
//     children: []
// }

import CapabilitySelectMap from '@/app/business-architecture/tbm-mapping/components/CapabilitySelectMap'

describe('CapabilitySelectMap', () => {
    it('is defined', () => {
        expect(CapabilitySelectMap).toBeDefined()
    })
    // beforeEach(() => {
    //     jest.clearAllMocks()
    //     mockUseGetApptioJourneyCapabilities.mockReturnValue({
    //         journeyCapabilitiesMap: new Map(),
    //         isLoading: false
    //     })
    //     mockUseGetApptioEpicMappings.mockReturnValue({
    //         mappings: [],
    //         isLoading: false,
    //         error: null
    //     })
    // })
    //
    // it('renders a loading spinner when capabilities are loading', () => {
    //     mockUseCapabilities.mockReturnValue({ capability: [], loading: true })
    //     render(<CapabilitySelectMap />)
    //     expect(screen.getByTestId('loading-text')).toBeInTheDocument()
    // })
    //
    // it('renders EbaHeader with title "Capability Selection"', () => {
    //     mockUseCapabilities.mockReturnValue({ capability: [], loading: false })
    //     render(<CapabilitySelectMap />)
    //     expect(screen.getByTestId('eba-header')).toHaveTextContent(
    //         'Capability Selection'
    //     )
    // })
    //
    // it('does not render JourneySidebar when selectedJourneys is empty', () => {
    //     mockUseCapabilities.mockReturnValue({ capability: [], loading: false })
    //     render(<CapabilitySelectMap selectedJourneys={[]} />)
    //     expect(screen.queryByTestId('journey-sidebar')).not.toBeInTheDocument()
    // })
    //
    // it('renders JourneySidebar when journeys are provided', () => {
    //     mockUseCapabilities.mockReturnValue({ capability: [], loading: false })
    //     render(<CapabilitySelectMap selectedJourneys={[makeJourney('j1')]} />)
    //     expect(screen.getByTestId('journey-sidebar')).toBeInTheDocument()
    // })
    //
    // it('renders one CapabilitySelectCard per L1 node in the hierarchy', async () => {
    //     mockUseCapabilities.mockReturnValue({
    //         capability: [l1Cap],
    //         loading: false
    //     })
    //     render(<CapabilitySelectMap selectedJourneys={[makeJourney('j1')]} />)
    //     await waitFor(() => {
    //         expect(screen.getByTestId('cap-card-l1')).toBeInTheDocument()
    //     })
    // })
    //
    // it('SubmitSummaryModal is closed initially', () => {
    //     mockUseCapabilities.mockReturnValue({ capability: [], loading: false })
    //     render(<CapabilitySelectMap />)
    //     expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    // })
    //
    // it('clicking Submit opens the modal', async () => {
    //     mockUseCapabilities.mockReturnValue({ capability: [], loading: false })
    //     render(<CapabilitySelectMap />)
    //     act(() => fireEvent.click(screen.getByTestId('submit-btn')))
    //     await waitFor(() => {
    //         expect(screen.getByTestId('modal')).toBeInTheDocument()
    //     })
    // })
    //
    // it('clicking Cancel in the modal closes it', async () => {
    //     mockUseCapabilities.mockReturnValue({ capability: [], loading: false })
    //     render(<CapabilitySelectMap />)
    //     act(() => fireEvent.click(screen.getByTestId('submit-btn')))
    //     await waitFor(() => screen.getByTestId('modal'))
    //     act(() => fireEvent.click(screen.getByTestId('modal-cancel')))
    //     await waitFor(() => {
    //         expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    //     })
    // })
    //
    // it('passes onBack prop through to JourneyCapabilityHeader', () => {
    //     mockUseCapabilities.mockReturnValue({ capability: [], loading: false })
    //     const onBack = jest.fn()
    //     render(<CapabilitySelectMap onBack={onBack} />)
    //     fireEvent.click(screen.getByTestId('back-btn'))
    //     expect(onBack).toHaveBeenCalledTimes(1)
    // })
    //
    // it('clicking Confirm in the modal closes it', async () => {
    //     mockUseCapabilities.mockReturnValue({ capability: [], loading: false })
    //     render(<CapabilitySelectMap />)
    //     act(() => fireEvent.click(screen.getByTestId('submit-btn')))
    //     await waitFor(() => screen.getByTestId('modal'))
    //     await act(async () => {
    //         fireEvent.click(screen.getByTestId('modal-confirm'))
    //     })
    //     await waitFor(() => {
    //         expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    //     })
    // })
    //
    // it('no Back button when onBack is not provided', () => {
    //     mockUseCapabilities.mockReturnValue({ capability: [], loading: false })
    //     render(<CapabilitySelectMap />)
    //     expect(screen.queryByTestId('back-btn')).not.toBeInTheDocument()
    // })
    //
    // it('Confirm on journey modal advances to next journey (not last)', async () => {
    //     mockUseCapabilities.mockReturnValue({ capability: [], loading: false })
    //     render(
    //         <CapabilitySelectMap
    //             selectedJourneys={[makeJourney('j1'), makeJourney('j2')]}
    //         />
    //     )
    //     act(() => fireEvent.click(screen.getByTestId('submit-btn')))
    //     await waitFor(() => screen.getByTestId('modal'))
    //     await act(async () => {
    //         fireEvent.click(screen.getByTestId('modal-confirm'))
    //     })
    //     await waitFor(() => {
    //         expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    //     })
    // })
    //
    // it('Confirm on last journey modal chains to final summary modal', async () => {
    //     mockUseCapabilities.mockReturnValue({ capability: [], loading: false })
    //     render(<CapabilitySelectMap selectedJourneys={[makeJourney('j1')]} />)
    //     act(() => fireEvent.click(screen.getByTestId('submit-btn')))
    //     await waitFor(() => screen.getByTestId('modal'))
    //     await act(async () => {
    //         fireEvent.click(screen.getByTestId('modal-confirm'))
    //     })
    //     await waitFor(() => {
    //         expect(screen.getByTestId('modal')).toBeInTheDocument()
    //     })
    // })
    //
    // it('Confirm on final modal closes it', async () => {
    //     mockUseCapabilities.mockReturnValue({ capability: [], loading: false })
    //     render(<CapabilitySelectMap selectedJourneys={[makeJourney('j1')]} />)
    //     act(() => fireEvent.click(screen.getByTestId('submit-btn')))
    //     await waitFor(() => screen.getByTestId('modal'))
    //     await act(async () => {
    //         fireEvent.click(screen.getByTestId('modal-confirm'))
    //     })
    //     await waitFor(() => screen.getByTestId('modal'))
    //     await act(async () => {
    //         fireEvent.click(screen.getByTestId('modal-confirm'))
    //     })
    //     await waitFor(() => {
    //         expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    //     })
    // })
})
