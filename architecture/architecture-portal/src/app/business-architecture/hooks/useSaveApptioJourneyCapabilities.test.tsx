import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSaveApptioJourneyCapabilities } from './useSaveApptioJourneyCapabilities'
import { API_ENDPOINTS, ARCHITECTURE_API_URL } from '@/constants'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
    }
})

const createWrapper = () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
    Wrapper.displayName = 'TestWrapper'
    return Wrapper
}

const payload = {
    epicId: 'epic-1',
    journeyId: 'journey-1',
    userInfo: { userEmail: 'user@example.com', userName: 'User' },
    capabilities: [{ id: 'cap-1', isAiRecommended: true }]
}

describe('useSaveApptioJourneyCapabilities', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('POSTs the capabilities and invalidates the cache on success', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true })
        })
        const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')

        const { result } = renderHook(
            () => useSaveApptioJourneyCapabilities(),
            { wrapper: createWrapper() }
        )

        result.current.mutate(payload)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_APPTIO_JOURNEY_CAPABILITIES(
                'epic-1',
                'journey-1'
            ).replace(ARCHITECTURE_API_URL, '/api/proxy'),
            expect.objectContaining({ method: 'POST', credentials: 'include' })
        )
        expect(invalidateSpy).toHaveBeenCalledWith({
            queryKey: ['apptio_journey_capabilities', 'epic-1', 'journey-1']
        })
    })

    it('throws when the request fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Server Error'
        })

        const { result } = renderHook(
            () => useSaveApptioJourneyCapabilities(),
            { wrapper: createWrapper() }
        )

        result.current.mutate(payload)

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe(
            'Failed to save journey capabilities: 500 Server Error'
        )
    })
})
