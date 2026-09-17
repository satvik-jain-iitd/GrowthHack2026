import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    useAttestationsList,
    useAttestationDetail,
    useRequestAttestationEmail,
    useCreateAttestation,
    ATTESTATIONS_LIST_KEY
} from './useAttestations'
import { METAMODEL_INITIATIVE_QUERY_KEY } from './useMetamodelInitiative'
import { API_ENDPOINTS, ARCHITECTURE_API_URL } from '@/constants'

const architectureProxy = (url: string) =>
    url.replace(ARCHITECTURE_API_URL, '/api/proxy')

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

describe('useAttestationsList', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('fetches the initiative attestations list', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => [{ attestationId: 'att-1' }]
        })

        const { result } = renderHook(
            () => useAttestationsList('initiative', 'i-1'),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_LIST_INITIATIVE_ATTESTATIONS('i-1'),
            undefined
        )
        expect(result.current.data).toEqual([{ attestationId: 'att-1' }])
    })

    it('fetches the application attestations list', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => []
        })

        const { result } = renderHook(
            () => useAttestationsList('application', 'app-1'),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_LIST_APPLICATION_ATTESTATIONS('app-1'),
            undefined
        )
    })

    it('returns an empty list on 404', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404
        })

        const { result } = renderHook(
            () => useAttestationsList('initiative', 'i-2'),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual([])
    })

    it('throws on other errors', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Server Error'
        })

        const { result } = renderHook(
            () => useAttestationsList('initiative', 'i-3'),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe(
            'Failed to fetch attestations: 500 Server Error'
        )
    })

    it('is disabled when entityId is empty', () => {
        const { result } = renderHook(
            () => useAttestationsList('initiative', ''),
            { wrapper: createWrapper() }
        )

        expect(result.current.fetchStatus).toBe('idle')
        expect(global.fetch).not.toHaveBeenCalled()
    })
})

describe('useAttestationDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('fetches an initiative attestation detail', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ attestationId: 'att-1' })
        })

        const { result } = renderHook(
            () => useAttestationDetail('initiative', 'i-1', 'att-1'),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_GET_INITIATIVE_ATTESTATION('i-1', 'att-1'),
            undefined
        )
        expect(result.current.data).toEqual({ attestationId: 'att-1' })
    })

    it('fetches an application attestation detail', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ attestationId: 'att-2' })
        })

        const { result } = renderHook(
            () => useAttestationDetail('application', 'app-1', 'att-2'),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_GET_APPLICATION_ATTESTATION(
                'app-1',
                'att-2'
            ),
            undefined
        )
    })

    it('throws when the request fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Server Error'
        })

        const { result } = renderHook(
            () => useAttestationDetail('initiative', 'i-1', 'att-1'),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe(
            'Failed to fetch attestation detail: 500 Server Error'
        )
    })

    it('is disabled when the attestationId is missing', () => {
        const { result } = renderHook(
            () => useAttestationDetail('initiative', 'i-1', ''),
            { wrapper: createWrapper() }
        )

        expect(result.current.fetchStatus).toBe('idle')
        expect(global.fetch).not.toHaveBeenCalled()
    })
})

describe('useRequestAttestationEmail', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('posts the attestation request email', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ ok: true })
        })

        const { result } = renderHook(() => useRequestAttestationEmail(), {
            wrapper: createWrapper()
        })

        result.current.mutate({
            entityType: 'initiative',
            entityId: 'i-1',
            entityName: 'Initiative One',
            requesterEmail: 'requester@example.com',
            recipientEmail: 'recipient@example.com'
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            architectureProxy(API_ENDPOINTS.POST_ATTESTATION_REQUEST_EMAIL),
            expect.objectContaining({ method: 'POST' })
        )
    })

    it('throws when the email request fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Server Error'
        })

        const { result } = renderHook(() => useRequestAttestationEmail(), {
            wrapper: createWrapper()
        })

        result.current.mutate({
            entityType: 'initiative',
            entityId: 'i-1',
            entityName: 'Initiative One',
            requesterEmail: 'requester@example.com',
            recipientEmail: 'recipient@example.com'
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe(
            'Failed to send attestation request email: 500 Server Error'
        )
    })
})

describe('useCreateAttestation', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('creates an initiative attestation and invalidates related queries', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ attestationId: 'att-new' })
        })
        const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')

        const { result } = renderHook(
            () => useCreateAttestation('initiative', 'i-1'),
            { wrapper: createWrapper() }
        )

        result.current.mutate({ attestationBy: 'user@example.com' })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_CREATE_INITIATIVE_ATTESTATION('i-1'),
            expect.objectContaining({ method: 'POST' })
        )
        expect(invalidateSpy).toHaveBeenCalledWith({
            queryKey: ATTESTATIONS_LIST_KEY('initiative', 'i-1')
        })
        expect(invalidateSpy).toHaveBeenCalledWith({
            queryKey: METAMODEL_INITIATIVE_QUERY_KEY('i-1')
        })
    })

    it('creates an application attestation', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ attestationId: 'att-new' })
        })

        const { result } = renderHook(
            () => useCreateAttestation('application', 'app-1'),
            { wrapper: createWrapper() }
        )

        result.current.mutate({ attestationBy: 'user@example.com' })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_CREATE_APPLICATION_ATTESTATION('app-1'),
            expect.objectContaining({ method: 'POST' })
        )
    })

    it('throws when creation fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Server Error'
        })

        const { result } = renderHook(
            () => useCreateAttestation('initiative', 'i-1'),
            { wrapper: createWrapper() }
        )

        result.current.mutate({ attestationBy: 'user@example.com' })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe(
            'Failed to create attestation: 500 Server Error'
        )
    })
})
