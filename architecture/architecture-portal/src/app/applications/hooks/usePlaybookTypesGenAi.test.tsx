import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePlaybookTypesGenAi } from './usePlaybookTypesGenAi'
import { API_ENDPOINTS, ARCHITECTURE_API_URL } from '@/constants'

const architectureProxy = (url: string) =>
    url.replace(ARCHITECTURE_API_URL, '/api/proxy')

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    })
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
    Wrapper.displayName = 'TestWrapper'
    return Wrapper
}

describe('usePlaybookTypesGenAi', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('flattens playbook types into label/value options', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: [
                    {
                        playbook_type_id: 't-1',
                        playbook_type_nm: 'Type One',
                        playbooks: [
                            {
                                playbook_id: 'pb-1',
                                playbook_name: 'Playbook 1'
                            },
                            { playbook_id: 'pb-2', playbook_name: 'Playbook 2' }
                        ]
                    },
                    {
                        playbook_type_id: 't-2',
                        playbook_type_nm: 'Type Two',
                        playbooks: [
                            { playbook_id: 'pb-3', playbook_name: 'Playbook 3' }
                        ]
                    }
                ]
            })
        })

        const { result } = renderHook(() => usePlaybookTypesGenAi(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            architectureProxy(API_ENDPOINTS.GET_PLAYBOOK_TYPES_GENAI),
            undefined
        )
        expect(result.current.data).toEqual([
            { label: 'Playbook 1', value: 'pb-1' },
            { label: 'Playbook 2', value: 'pb-2' },
            { label: 'Playbook 3', value: 'pb-3' }
        ])
    })

    it('throws when the request fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500
        })

        const { result } = renderHook(() => usePlaybookTypesGenAi(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe(
            'Failed to fetch genai playbook types: 500'
        )
    })
})
