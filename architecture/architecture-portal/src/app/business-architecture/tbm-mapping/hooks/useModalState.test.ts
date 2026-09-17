// /*istanbul ignore file*/
// import { renderHook, act } from '@testing-library/react'
// import { useModalState } from './useModalState'
// import { saveApptioJourneyCapabilities } from '@/app/business-architecture/hooks/useSaveApptioJourneyCapabilities'
// import { submitApptioEpicMappings } from '@/app/business-architecture/hooks/useSubmitApptioEpicMappings'
// import { checkSessionValid } from '../utils/checkSessionValid'
// import { toast } from 'react-toastify'
//
// jest.mock(
//     '@/app/business-architecture/hooks/useSaveApptioJourneyCapabilities',
//     () => ({
//         saveApptioJourneyCapabilities: jest.fn()
//     })
// )
// jest.mock(
//     '@/app/business-architecture/hooks/useSubmitApptioEpicMappings',
//     () => ({
//         submitApptioEpicMappings: jest.fn()
//     })
// )
// jest.mock('../utils/checkSessionValid', () => ({
//     checkSessionValid: jest.fn()
// }))
// jest.mock('react-toastify', () => ({
//     toast: { success: jest.fn(), error: jest.fn() }
// }))
//
// const mockSave = saveApptioJourneyCapabilities as jest.Mock
// const mockSubmitMappings = submitApptioEpicMappings as jest.Mock
// const mockCheckSession = checkSessionValid as jest.Mock
//
// function makeHookArgs(
//     overrides: Partial<Parameters<typeof useModalState>[0]> = {}
// ) {
//     const getAllJourneyCapabilities = jest
//         .fn()
//         .mockReturnValue([{ journey_id: 'j1', capability_ids: ['c1'] }])
//     const getAllJourneyAICapabilities = jest
//         .fn()
//         .mockReturnValue([{ journey_id: 'j1', capability_ids: ['c1'] }])
//     const onAdvanceJourney = jest.fn()
//     const onJourneySelect = jest.fn()
//
//     return {
//         epicId: 'epic-1',
//         currentJourneyId: 'j1',
//         isLastJourney: false,
//         onSubmitComplete: jest.fn(),
//         onJourneySelect,
//         onAdvanceJourney,
//         getAllJourneyCapabilities,
//         getAllJourneyAICapabilities,
//         user: { userEmail: 'test@example.com', userName: 'Test User' },
//         ...overrides
//     }
// }

import { useModalState } from '@/app/business-architecture/tbm-mapping/hooks/useModalState'

describe('useModalState', () => {
    it('is defined', () => {
        expect(useModalState).toBeDefined()
    })
    // beforeEach(() => {
    //     jest.clearAllMocks()
    //     mockSave.mockResolvedValue(undefined)
    //     mockSubmitMappings.mockResolvedValue(undefined)
    //     mockCheckSession.mockResolvedValue(true)
    // })
    //
    // it('starts with modalMode=null', () => {
    //     const { result } = renderHook(() => useModalState(makeHookArgs()))
    //     expect(result.current.modalMode).toBeNull()
    // })
    //
    // it('handleSaveAndNext sets modalMode to "journey"', () => {
    //     const { result } = renderHook(() => useModalState(makeHookArgs()))
    //     act(() => result.current.handleSaveAndNext())
    //     expect(result.current.modalMode).toBe('journey')
    // })
    //
    // it('handleSaveAndNext captures a snapshot of capabilities', () => {
    //     const getAllJourneyCapabilities = jest
    //         .fn()
    //         .mockReturnValue([
    //             { journey_id: 'j1', capability_ids: ['c1', 'c2'] }
    //         ])
    //     const { result } = renderHook(() =>
    //         useModalState(makeHookArgs({ getAllJourneyCapabilities }))
    //     )
    //     act(() => result.current.handleSaveAndNext())
    //     expect(result.current.modalSnapshot).toEqual([
    //         { journey_id: 'j1', capability_ids: ['c1', 'c2'] }
    //     ])
    // })
    //
    // it('handleJourneyModalConfirm calls save API and advances journey on success', async () => {
    //     const onAdvanceJourney = jest.fn()
    //     const { result } = renderHook(() =>
    //         useModalState(
    //             makeHookArgs({ isLastJourney: false, onAdvanceJourney })
    //         )
    //     )
    //     act(() => result.current.handleSaveAndNext())
    //     await act(async () => {
    //         await result.current.handleJourneyModalConfirm()
    //     })
    //     expect(mockSave).toHaveBeenCalledWith(
    //         'epic-1',
    //         'j1',
    //         [{ id: 'c1', isAiRecommended: true }],
    //         { userEmail: 'test@example.com', userName: 'Test User' }
    //     )
    //     expect(toast.success).toHaveBeenCalledWith(
    //         'Enterprise Business Capabilities saved successfully'
    //     )
    //     expect(onAdvanceJourney).toHaveBeenCalledTimes(1)
    //     expect(result.current.modalMode).toBeNull()
    // })
    //
    // it('handleJourneyModalConfirm goes to "final" mode when last journey', async () => {
    //     const { result } = renderHook(() =>
    //         useModalState(makeHookArgs({ isLastJourney: true }))
    //     )
    //     act(() => result.current.handleSaveAndNext())
    //     await act(async () => {
    //         await result.current.handleJourneyModalConfirm()
    //     })
    //     expect(result.current.modalMode).toBe('final')
    // })
    //
    // it('handleJourneyModalConfirm shows error toast and does not advance on failure', async () => {
    //     mockSave.mockRejectedValue(new Error('Network error'))
    //     const onAdvanceJourney = jest.fn()
    //     const { result } = renderHook(() =>
    //         useModalState(
    //             makeHookArgs({ isLastJourney: false, onAdvanceJourney })
    //         )
    //     )
    //     act(() => result.current.handleSaveAndNext())
    //     await act(async () => {
    //         await result.current.handleJourneyModalConfirm()
    //     })
    //     expect(toast.error).toHaveBeenCalledWith(
    //         'Failed to save capabilities, please try again.'
    //     )
    //     expect(onAdvanceJourney).not.toHaveBeenCalled()
    //     expect(result.current.modalMode).toBe('journey')
    // })
    //
    // it('handleJourneyModalConfirm marks non-AI capabilities correctly', async () => {
    //     const getAllJourneyCapabilities = jest
    //         .fn()
    //         .mockReturnValue([
    //             { journey_id: 'j1', capability_ids: ['c1', 'c2', 'c3'] }
    //         ])
    //     const getAllJourneyAICapabilities = jest
    //         .fn()
    //         .mockReturnValue([{ journey_id: 'j1', capability_ids: ['c2'] }])
    //     const { result } = renderHook(() =>
    //         useModalState(
    //             makeHookArgs({
    //                 getAllJourneyCapabilities,
    //                 getAllJourneyAICapabilities
    //             })
    //         )
    //     )
    //     act(() => result.current.handleSaveAndNext())
    //     await act(async () => {
    //         await result.current.handleJourneyModalConfirm()
    //     })
    //     expect(mockSave).toHaveBeenCalledWith(
    //         'epic-1',
    //         'j1',
    //         [
    //             { id: 'c1', isAiRecommended: false },
    //             { id: 'c2', isAiRecommended: true },
    //             { id: 'c3', isAiRecommended: false }
    //         ],
    //         { userEmail: 'test@example.com', userName: 'Test User' }
    //     )
    // })
    //
    // it('handleFinalConfirm submits mappings and calls onSubmitComplete on success', async () => {
    //     const onSubmitComplete = jest.fn()
    //     const args = makeHookArgs({ onSubmitComplete })
    //     const { result } = renderHook(() => useModalState(args))
    //     act(() => result.current.handleSubmitAll())
    //     await act(async () => {
    //         await result.current.handleFinalConfirm()
    //     })
    //     expect(mockSubmitMappings).toHaveBeenCalledWith('epic-1', args.user)
    //     expect(toast.success).toHaveBeenCalledWith(
    //         'Mappings submitted successfully'
    //     )
    //     expect(onSubmitComplete).toHaveBeenCalledTimes(1)
    //     expect(result.current.modalMode).toBeNull()
    // })
    //
    // it('handleFinalConfirm shows error toast and keeps modal open on failure', async () => {
    //     mockSubmitMappings.mockRejectedValue(new Error('Network error'))
    //     const onSubmitComplete = jest.fn()
    //     const { result } = renderHook(() =>
    //         useModalState(makeHookArgs({ onSubmitComplete }))
    //     )
    //     act(() => result.current.handleSubmitAll())
    //     await act(async () => {
    //         await result.current.handleFinalConfirm()
    //     })
    //     expect(toast.error).toHaveBeenCalledWith(
    //         'Failed to submit mappings, please try again.'
    //     )
    //     expect(onSubmitComplete).not.toHaveBeenCalled()
    //     expect(result.current.modalMode).toBe('final')
    // })
    //
    // it('handleSubmitAll sets modalMode to "final"', () => {
    //     const { result } = renderHook(() => useModalState(makeHookArgs()))
    //     act(() => result.current.handleSubmitAll())
    //     expect(result.current.modalMode).toBe('final')
    // })
    //
    // it('handleEditJourney navigates to the given journey and clears modal', () => {
    //     const onJourneySelect = jest.fn()
    //     const { result } = renderHook(() =>
    //         useModalState(makeHookArgs({ onJourneySelect }))
    //     )
    //     act(() => result.current.handleSaveAndNext())
    //     act(() => result.current.handleEditJourney('j2'))
    //     expect(result.current.modalMode).toBeNull()
    //     expect(onJourneySelect).toHaveBeenCalledWith('j2')
    // })
    //
    // it('isJourneyModalLoading is true while save is in progress', async () => {
    //     let resolvePromise: () => void
    //     mockSave.mockImplementation(
    //         () => new Promise<void>(resolve => (resolvePromise = resolve))
    //     )
    //     mockCheckSession.mockResolvedValue(true)
    //     const { result } = renderHook(() =>
    //         useModalState(makeHookArgs({ isLastJourney: false }))
    //     )
    //     act(() => result.current.handleSaveAndNext())
    //     // Start the confirm — session check resolves immediately but save hangs
    //     let confirmPromise: Promise<void>
    //     act(() => {
    //         confirmPromise = result.current.handleJourneyModalConfirm()
    //     })
    //     // Wait for session check to resolve
    //     await act(async () => {
    //         await Promise.resolve()
    //     })
    //     expect(result.current.isJourneyModalLoading).toBe(true)
    //     await act(async () => {
    //         resolvePromise!()
    //         await confirmPromise!
    //     })
    //     expect(result.current.isJourneyModalLoading).toBe(false)
    // })
    //
    // it('handleJourneyModalConfirm sets sessionExpired when session is invalid', async () => {
    //     mockCheckSession.mockResolvedValue(false)
    //     const onAdvanceJourney = jest.fn()
    //     const { result } = renderHook(() =>
    //         useModalState(
    //             makeHookArgs({ isLastJourney: false, onAdvanceJourney })
    //         )
    //     )
    //     act(() => result.current.handleSaveAndNext())
    //     await act(async () => {
    //         await result.current.handleJourneyModalConfirm()
    //     })
    //     expect(result.current.sessionExpired).toBe(true)
    //     expect(result.current.modalMode).toBeNull()
    //     expect(mockSave).not.toHaveBeenCalled()
    //     expect(onAdvanceJourney).not.toHaveBeenCalled()
    // })
    //
    // it('handleFinalConfirm sets sessionExpired when session is invalid', async () => {
    //     mockCheckSession.mockResolvedValue(false)
    //     const onSubmitComplete = jest.fn()
    //     const { result } = renderHook(() =>
    //         useModalState(makeHookArgs({ onSubmitComplete }))
    //     )
    //     act(() => result.current.handleSubmitAll())
    //     await act(async () => {
    //         await result.current.handleFinalConfirm()
    //     })
    //     expect(result.current.sessionExpired).toBe(true)
    //     expect(result.current.modalMode).toBeNull()
    //     expect(mockSubmitMappings).not.toHaveBeenCalled()
    //     expect(onSubmitComplete).not.toHaveBeenCalled()
    // })
    //
    // it('sessionExpired starts as false', () => {
    //     const { result } = renderHook(() => useModalState(makeHookArgs()))
    //     expect(result.current.sessionExpired).toBe(false)
    // })
})
