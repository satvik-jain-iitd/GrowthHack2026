import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSubmitECJChangeModalRequest } from './useSubmitECJChangeModalRequest'
import { toast } from 'react-toastify'

jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() }
}))

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { mutations: { retry: false } }
    })
    const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
    Wrapper.displayName = 'TestWrapper'
    return Wrapper
}

const makePayload = () => ({
    values: { changeDetails: 'Please update this journey' },
    displayName: 'John Doe',
    userPrincipalName: 'john.doe@example.com',
    journeyStatement: 'A journey statement',
    journeyDesc: 'A journey description'
})

describe('useSubmitECJChangeModalRequest', () => {
    beforeEach(() => {
        global.fetch = jest.fn()
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('submits and shows a success toast on success', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true })
        })

        const { result } = renderHook(() => useSubmitECJChangeModalRequest(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            await result.current.handleSubmitECJChangeModal(makePayload())
        })

        expect(toast.success).toHaveBeenCalled()
        expect(toast.error).not.toHaveBeenCalled()
    })

    it('shows an error toast and rethrows on failure', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({})
        })

        const { result } = renderHook(() => useSubmitECJChangeModalRequest(), {
            wrapper: createWrapper()
        })

        let thrown: unknown
        await act(async () => {
            try {
                await result.current.handleSubmitECJChangeModal(makePayload())
            } catch (error) {
                thrown = error
            }
        })

        expect((thrown as Error)?.message).toBe(
            'Failed to create ECJ change request email'
        )
        expect(toast.error).toHaveBeenCalledWith(
            'Something went wrong. Please try again.'
        )
    })
})
