import { renderHook } from '@testing-library/react'
import { useADRRoles } from './useADRRoles'
import { useUserContext } from '@/context'
import { ADR } from '@/app/docs/hooks/useGetADR'
import { User } from '@/app/layout/AuthBlueSso'

jest.mock('@/context')

const mockUseUserContext = useUserContext as jest.MockedFunction<
    typeof useUserContext
>

describe('useADRRoles', () => {
    const mockADR: ADR = {
        adr_mtda_id: 'adr-123',
        adr_nm: 'Test ADR',
        rev_ctc_da: ['reviewerEmail@aexp.com', 'reviewerEmail1@aexp.com'],
        aprv_ctc_da: ['approverEmail1@aexp.com'],
        entrpr_archt_ctc_da: ['eaArchitectEmail@aexp.com'],
        adr_req_email_ad_tx: 'requesterEmail@aexp.com',
        wkflow_sta_nm: 'IN PROGRESS',
        wkflow_id: 'wkflow-123',
        wkflow_step_id: 'step-123',
        reviews: []
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('identifies requester correctly', () => {
        mockUseUserContext.mockReturnValue({
            attributes: { email: 'requesterEmail@aexp.com' }
        } as User)

        const { result } = renderHook(() => useADRRoles(mockADR))

        expect(result.current.isRequester).toBe(true)
        expect(result.current.isReviewer).toBe(false)
        expect(result.current.isDecider).toBe(false)
        expect(result.current.isArchitect).toBe(false)
    })

    it('identifies reviewer correctly', () => {
        mockUseUserContext.mockReturnValue({
            attributes: { email: 'reviewerEmail@aexp.com' }
        } as User)

        const { result } = renderHook(() => useADRRoles(mockADR))

        expect(result.current.isRequester).toBe(false)
        expect(result.current.isReviewer).toBe(true)
        expect(result.current.isDecider).toBe(false)
        expect(result.current.isArchitect).toBe(false)
    })

    it('identifies decider correctly', () => {
        mockUseUserContext.mockReturnValue({
            attributes: { email: 'approverEmail1@aexp.com' }
        } as User)

        const { result } = renderHook(() => useADRRoles(mockADR))

        expect(result.current.isRequester).toBe(false)
        expect(result.current.isReviewer).toBe(false)
        expect(result.current.isDecider).toBe(true)
        expect(result.current.isArchitect).toBe(false)
    })

    it('identifies architect correctly', () => {
        mockUseUserContext.mockReturnValue({
            attributes: { email: 'eaArchitectEmail@aexp.com' }
        } as User)

        const { result } = renderHook(() => useADRRoles(mockADR))

        expect(result.current.isRequester).toBe(false)
        expect(result.current.isReviewer).toBe(false)
        expect(result.current.isDecider).toBe(false)
        expect(result.current.isArchitect).toBe(true)
    })

    it('identifies admin correctly with custom admin list', () => {
        mockUseUserContext.mockReturnValue({
            attributes: { email: 'userEmail@aexp.com' }
        } as User)

        const { result } = renderHook(() =>
            useADRRoles(mockADR, ['userEmail@aexp.com'])
        )

        expect(result.current.isAdmin).toBe(true)
    })

    it('returns all false when user has no roles', () => {
        mockUseUserContext.mockReturnValue({
            attributes: { email: 'userEmail@aexp.com' }
        } as User)

        const { result } = renderHook(() => useADRRoles(mockADR))

        expect(result.current.isRequester).toBe(false)
        expect(result.current.isReviewer).toBe(false)
        expect(result.current.isDecider).toBe(false)
        expect(result.current.isArchitect).toBe(false)
        expect(result.current.isAdmin).toBe(false)
    })

    it('handles undefined ADR gracefully', () => {
        mockUseUserContext.mockReturnValue({
            attributes: { email: 'userEmail@aexp.com' }
        } as User)

        const { result } = renderHook(() => useADRRoles(undefined))

        expect(result.current.isRequester).toBe(false)
        expect(result.current.isReviewer).toBe(false)
        expect(result.current.isDecider).toBe(false)
        expect(result.current.isArchitect).toBe(false)
    })

    it('handles missing user email', () => {
        mockUseUserContext.mockReturnValue({
            attributes: { email: '' }
        } as User)

        const { result } = renderHook(() => useADRRoles(mockADR))

        expect(result.current.isRequester).toBe(false)
        expect(result.current.isReviewer).toBe(false)
        expect(result.current.isDecider).toBe(false)
        expect(result.current.isArchitect).toBe(false)
    })

    it('handles user with multiple roles', () => {
        const adrWithMultipleRoles = {
            ...mockADR,
            rev_ctc_da: ['reviewerEmail2@aexp.com'],
            entrpr_archt_ctc_da: ['reviewerEmail2@aexp.com']
        }

        mockUseUserContext.mockReturnValue({
            attributes: { email: 'reviewerEmail2@aexp.com' }
        } as User)

        const { result } = renderHook(() => useADRRoles(adrWithMultipleRoles))

        expect(result.current.isReviewer).toBe(true)
        expect(result.current.isArchitect).toBe(true)
    })
})
