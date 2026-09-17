import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTechStackOptions } from './useTechStackOptions'
import {
    API_ENDPOINTS,
    ARCHITECTURE_API_URL,
    TAG_CATEGORY_IDS
} from '@/constants'

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

describe('useTechStackOptions', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('fetches from the tech stacks metadata category endpoint', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [] })
        })

        const { result } = renderHook(() => useTechStackOptions(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            architectureProxy(
                API_ENDPOINTS.GET_METADATA_TAGS(TAG_CATEGORY_IDS.TECH_STACKS)
            ),
            { credentials: 'include' }
        )
    })

    it('flattens leaf tags into options and builds a byId map', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: [
                    {
                        tag_id: 'parent-1',
                        tag_nm: 'Languages',
                        children: [
                            { tag_id: 'child-1', tag_nm: 'Node.js' },
                            { tag_id: 'child-2', tag_nm: 'Java' }
                        ]
                    },
                    { tag_id: 'leaf-1', tag_nm: 'Kubernetes' }
                ]
            })
        })

        const { result } = renderHook(() => useTechStackOptions(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.options).toEqual([
            { label: 'Node.js', value: 'child-1' },
            { label: 'Java', value: 'child-2' },
            { label: 'Kubernetes', value: 'leaf-1' }
        ])
        expect(result.current.data?.byId).toEqual({
            'parent-1': 'Languages',
            'child-1': 'Node.js',
            'child-2': 'Java',
            'leaf-1': 'Kubernetes'
        })
    })

    it('returns empty options when the response data is not an array', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: null })
        })

        const { result } = renderHook(() => useTechStackOptions(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.options).toEqual([])
        expect(result.current.data?.byId).toEqual({})
    })

    it('throws when the request fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500
        })

        const { result } = renderHook(() => useTechStackOptions(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe(
            'Failed to fetch tech stack options'
        )
    })
})
