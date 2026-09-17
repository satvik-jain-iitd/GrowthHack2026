import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSubmitBAChangeModalRequest } from './useSubmitBAChangeModalRequest'
import { toast } from 'react-toastify'

jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() }
}))

describe('useSubmitBAChangeModalRequest', () => {
    beforeEach(() => {
        global.fetch = jest.fn()
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: { mutations: { retry: false } }
        })
        const wrapper = ({ children }: { children?: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )
        return wrapper
    }

    const makePayload = () => ({
        values: {
            changeType: 'add' as const,
            capabilityKeyTx: 'CAP-001',
            capabilityName: 'Test Capability',
            impactedCustomerSegment: 'Consumer',
            associatedSystems: 'System A',
            impactedMarkets: 'US',
            impactedAmexProducts: 'Gold Card',
            impactedChannels: 'Web',
            customerJourneyContext: 'Onboarding',
            additionalInformation: 'None'
        },
        displayName: 'John Doe',
        userPrincipalName: 'john.doe@example.com'
    })

    it('calls submit and shows success toast on success', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true })
        })

        const wrapper = createWrapper()
        const { result } = renderHook(
            () => useSubmitBAChangeModalRequest('EBA'),
            { wrapper }
        )

        await act(async () => {
            await result.current.handleSubmitBAChangeModal(makePayload())
        })

        expect(toast.success).toHaveBeenCalledWith(
            expect.stringContaining('EBA')
        )
        expect(toast.error).not.toHaveBeenCalled()
    })

    it('shows error toast and throws on failure', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({})
        })

        const wrapper = createWrapper()
        const { result } = renderHook(
            () => useSubmitBAChangeModalRequest('EBA'),
            { wrapper }
        )

        let caughtError: unknown
        await act(async () => {
            try {
                await result.current.handleSubmitBAChangeModal(makePayload())
            } catch (e) {
                caughtError = e
            }
        })

        expect(caughtError).toBeDefined()
        expect(toast.error).toHaveBeenCalledWith(
            'Something went wrong. Please try again.'
        )
    })

    it('uses custom team name in success message', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true })
        })

        const wrapper = createWrapper()
        const { result } = renderHook(
            () => useSubmitBAChangeModalRequest('CustomTeam'),
            { wrapper }
        )

        await act(async () => {
            await result.current.handleSubmitBAChangeModal(makePayload())
        })

        expect(toast.success).toHaveBeenCalledWith(
            expect.stringContaining('CustomTeam')
        )
    })

    it('starts with isSubmitting as false', () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({})
        })

        const wrapper = createWrapper()
        const { result } = renderHook(() => useSubmitBAChangeModalRequest(), {
            wrapper
        })

        expect(result.current.isSubmitting).toBe(false)
    })
})
