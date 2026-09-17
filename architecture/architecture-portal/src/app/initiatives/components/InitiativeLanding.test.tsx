import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import InitiativeLanding from './InitiativeLanding'
import { emptyRecommendedValueIds } from '@/app/shared/utils/recommendationDiff'

const mockUsePlaybook = jest.fn()
const mockUseUserContext = jest.fn()
const mockUseMetamodelInitiativeView = jest.fn()
const mockUseCreateAttestation = jest.fn()
const mockCanEditInitiative = jest.fn()
const mockGetAttestationRole = jest.fn()
const mockGetLowestInitiativeAttester = jest.fn()

jest.mock('@/hooks', () => ({
    usePlaybook: (uuid: string) => mockUsePlaybook(uuid)
}))

jest.mock('@/context', () => ({
    useUserContext: () => mockUseUserContext()
}))

jest.mock('@/app/shared/hooks', () => ({
    useMetamodelInitiativeView: (id: string) =>
        mockUseMetamodelInitiativeView(id)
}))

jest.mock('@/app/shared/hooks/useAttestations', () => ({
    useCreateAttestation: (type: string, id: string) =>
        mockUseCreateAttestation(type, id)
}))

jest.mock('../utils/metamodelMapper', () => ({
    mapMetamodelToInitiative: (entity: { name: string }) => ({
        name: entity.name,
        metadata: []
    })
}))

jest.mock('../utils/initiativeOwnership', () => ({
    canEditInitiative: (...args: unknown[]) => mockCanEditInitiative(...args),
    getAttestationRole: (...args: unknown[]) => mockGetAttestationRole(...args),
    getLowestInitiativeAttester: (...args: unknown[]) =>
        mockGetLowestInitiativeAttester(...args),
    flattenMetadata: () => ({})
}))

jest.mock('@/components/ui', () => ({
    LoadingSpinner: () => <div>loading-spinner</div>
}))

jest.mock('./InitiativeEditForm', () => ({
    __esModule: true,
    default: () => <div>edit-form</div>
}))

jest.mock('./landing', () => ({
    InitiativeSummaryGrid: () => <div>summary-grid</div>,
    InitiativeOwnersGrid: () => <div>owners-grid</div>,
    InitiativeAdditionalInfo: () => <div>additional-info</div>
}))

jest.mock('@/app/shared/components', () => ({
    AttestationAccordion: () => <div>attestation-accordion</div>,
    RecommendationLegend: () => <div>recommendation-legend</div>,
    MetamodelAuditHistoryModal: ({ isOpen }: { isOpen: boolean }) => (
        <div>{isOpen ? 'audit-open' : 'audit-closed'}</div>
    )
}))

jest.mock('@/app/shared/components/AttestationConfirmationModal', () => ({
    __esModule: true,
    default: ({
        isOpen,
        onConfirm
    }: {
        isOpen: boolean
        onConfirm: (p: {
            attestationType: string
            capturedAttestations: unknown[]
        }) => void
    }) =>
        isOpen ? (
            <button
                onClick={() =>
                    onConfirm({
                        attestationType: 'ATTEST',
                        capturedAttestations: []
                    })
                }
            >
                confirm-attest
            </button>
        ) : null
}))

const mutate = jest.fn()

beforeEach(() => {
    jest.clearAllMocks()
    mockUseUserContext.mockReturnValue({
        attributes: { email: 'user@test.com', fullName: 'User Name' },
        groups: []
    })
    mockUsePlaybook.mockReturnValue({
        data: { initiative_id: 'init-1' },
        isLoading: false
    })
    mockUseMetamodelInitiativeView.mockReturnValue({
        data: { name: 'My Initiative' },
        isLoading: false,
        refetch: jest.fn(),
        isStaged: false,
        recommendedValues: emptyRecommendedValueIds()
    })
    mockUseCreateAttestation.mockReturnValue({ mutate, isPending: false })
    mockCanEditInitiative.mockReturnValue(false)
    mockGetAttestationRole.mockReturnValue(null)
    mockGetLowestInitiativeAttester.mockReturnValue(null)
})

describe('InitiativeLanding', () => {
    it('renders the loading spinner while playbook is loading', () => {
        mockUsePlaybook.mockReturnValue({ data: undefined, isLoading: true })
        render(<InitiativeLanding uuid='abc' />)
        expect(screen.getByText('loading-spinner')).toBeInTheDocument()
    })

    it('renders default header and no accordion when there is no metamodel entity', () => {
        mockUseMetamodelInitiativeView.mockReturnValue({
            data: undefined,
            isLoading: false,
            refetch: jest.fn(),
            isStaged: false,
            recommendedValues: emptyRecommendedValueIds()
        })
        render(<InitiativeLanding uuid='abc' />)
        expect(
            screen.queryByText('attestation-accordion')
        ).not.toBeInTheDocument()
        expect(screen.queryByText('summary-grid')).not.toBeInTheDocument()
    })

    it('renders the initiative name and summary grids when data is present', () => {
        render(<InitiativeLanding uuid='abc' />)
        expect(screen.getByText('MY INITIATIVE')).toBeInTheDocument()
        expect(screen.getByText('summary-grid')).toBeInTheDocument()
        expect(screen.getByText('owners-grid')).toBeInTheDocument()
        expect(screen.getByText('additional-info')).toBeInTheDocument()
    })

    it('shows the Edit button and switches to the edit form when the user can edit', () => {
        mockCanEditInitiative.mockReturnValue(true)
        render(<InitiativeLanding uuid='abc' />)
        const editButton = screen.getByRole('button', { name: 'Edit' })
        fireEvent.click(editButton)
        expect(screen.getByText('edit-form')).toBeInTheDocument()
    })

    it('opens the audit history modal when View Audit History is clicked', () => {
        render(<InitiativeLanding uuid='abc' />)
        expect(screen.getByText('audit-closed')).toBeInTheDocument()
        fireEvent.click(screen.getByText('View Audit History'))
        expect(screen.getByText('audit-open')).toBeInTheDocument()
    })

    it('renders the accordion and triggers reattestation for a principal architect', () => {
        mockGetAttestationRole.mockReturnValue('principal_architect')
        render(<InitiativeLanding uuid='abc' />)
        expect(screen.getByText('attestation-accordion')).toBeInTheDocument()
        fireEvent.click(screen.getByText('Reattest'))
        fireEvent.click(screen.getByText('confirm-attest'))
        expect(mutate).toHaveBeenCalledWith(
            expect.objectContaining({
                attestationBy: { name: 'User Name', email: 'user@test.com' },
                attestationType: 'ATTEST'
            })
        )
    })

    it('shows the reattesting label while attestation is pending', () => {
        mockGetAttestationRole.mockReturnValue('principal_architect')
        mockUseCreateAttestation.mockReturnValue({ mutate, isPending: true })
        render(<InitiativeLanding uuid='abc' />)
        expect(screen.getByText('Reattesting...')).toBeInTheDocument()
    })

    it('hides the recommendation legend when there are no recommendations', () => {
        render(<InitiativeLanding uuid='abc' />)
        expect(
            screen.queryByText('recommendation-legend')
        ).not.toBeInTheDocument()
    })

    it('shows the recommendation legend when staged recommendations exist', () => {
        mockUseMetamodelInitiativeView.mockReturnValue({
            data: { name: 'My Initiative' },
            isLoading: false,
            refetch: jest.fn(),
            isStaged: true,
            recommendedValues: {
                ...emptyRecommendedValueIds(),
                markets: ['US']
            }
        })
        render(<InitiativeLanding uuid='abc' />)
        expect(screen.getByText('recommendation-legend')).toBeInTheDocument()
    })
})
