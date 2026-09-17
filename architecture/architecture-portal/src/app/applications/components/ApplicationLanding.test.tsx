import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import ApplicationLanding from './ApplicationLanding'
import { emptyRecommendedValueIds } from '@/app/shared/utils/recommendationDiff'

const mockUseMetamodelApplicationView = jest.fn()
const mockUseUpdateMetamodelApplication = jest.fn()
const mockUseMetamodelAdrOptions = jest.fn()
const mockUseMetamodelBvbOptions = jest.fn()
const mockUseMetamodelInitiativeOptions = jest.fn()
const mockUseTechStackOptions = jest.fn()
const mockUseFoundationalTechOptions = jest.fn()
const mockUseTechCapabilityOptions = jest.fn()
const mockUseCreateAttestation = jest.fn()
const mockUsePlaybookTypesGenAi = jest.fn()
const mockUseDomainContext = jest.fn()
const mockUseUserContext = jest.fn()
const mockCanEditApplication = jest.fn()
const mockGetApplicationAttestationRole = jest.fn()
const mockGetLowestApplicationAttester = jest.fn()
const mockPush = jest.fn()

jest.mock('@/hooks', () => ({
    useNavigation: () => ({ push: mockPush })
}))

jest.mock('@/context', () => ({
    useDomainContext: () => mockUseDomainContext(),
    useUserContext: () => mockUseUserContext()
}))

jest.mock('@/app/shared/hooks', () => ({
    useMetamodelApplicationView: (id: string) =>
        mockUseMetamodelApplicationView(id),
    useUpdateMetamodelApplication: (id: string) =>
        mockUseUpdateMetamodelApplication(id),
    useMetamodelAdrOptions: () => mockUseMetamodelAdrOptions(),
    useMetamodelBvbOptions: () => mockUseMetamodelBvbOptions(),
    useMetamodelInitiativeOptions: () => mockUseMetamodelInitiativeOptions(),
    useTechStackOptions: () => mockUseTechStackOptions(),
    useMetamodelFoundationalTechnologyOptions: () =>
        mockUseFoundationalTechOptions(),
    useMetamodelTechnicalCapabilityOptions: () =>
        mockUseTechCapabilityOptions(),
    useCreateAttestation: (type: string, id: string) =>
        mockUseCreateAttestation(type, id)
}))

jest.mock('../hooks', () => ({
    usePlaybookTypesGenAi: () => mockUsePlaybookTypesGenAi()
}))

jest.mock('../utils/metamodelApplicationMapper', () => ({
    mapMetamodelToApplication: () => ({
        application_id: 'app-1',
        application_nm: 'My App',
        metadata: [],
        central_application_da: { description: 'App description' }
    })
}))

jest.mock('../utils/applicationOwnership', () => ({
    canEditApplication: (...args: unknown[]) => mockCanEditApplication(...args),
    getApplicationAttestationRole: (...args: unknown[]) =>
        mockGetApplicationAttestationRole(...args),
    getLowestApplicationAttester: (...args: unknown[]) =>
        mockGetLowestApplicationAttester(...args),
    flattenMetadata: () => ({})
}))

jest.mock('./landing', () => ({
    ApplicationInfoGrid: () => <div>info-grid</div>,
    ApplicationOwnersGrid: () => <div>owners-grid</div>
}))

jest.mock('@/app/initiatives/components/SelectRadioGroup', () => ({
    __esModule: true,
    default: ({ name }: { name: string }) => <div>{`radio-${name}`}</div>
}))

jest.mock('@/app/initiatives/components/MarketsSelect', () => ({
    __esModule: true,
    default: () => <div>markets-select</div>
}))

jest.mock('@/app/shared/components', () => ({
    AttestationAccordion: () => <div>attestation-accordion</div>,
    CapabilityDrilldownSelect: () => <div>capability-drilldown</div>,
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

const metamodelEntity = {
    linkedCompanyDomain: { companyDomainId: 'cd-1' },
    linkedArchitectureDecisionRecords: [
        { isCore: true, title: 'ADR Core', adrId: 'adr-1' },
        { isCore: false, title: 'ADR Non Core', adrId: 'adr-2' }
    ],
    linkedBuildVsBuyAssessments: [
        { isCore: true, title: 'BvB Core', bvbId: 'bvb-1' },
        { isCore: false, title: 'BvB Non Core', bvbId: 'bvb-2' }
    ],
    linkedInitiatives: [
        { isCore: true, initiativeName: 'Init One', initiativeId: 'i-1' },
        { isCore: false, initiativeName: '', initiativeId: 'i-2' }
    ],
    businessCapabilities: ['bc-1'],
    linkedPlaybooks: ['pb-1', 'pb-unknown'],
    technologyStacks: ['ts-1', 'ts-unknown'],
    marketsSupported: ['US'],
    linkedFoundationalTechnologies: ['ft-1', 'ft-unknown'],
    techCapabilities: ['tc-1', 'tc-unknown']
}

const mutate = jest.fn()
const createMutate = jest.fn()
const refetch = jest.fn()

beforeEach(() => {
    jest.clearAllMocks()
    mockUseMetamodelApplicationView.mockReturnValue({
        data: metamodelEntity,
        isLoading: false,
        refetch,
        isStaged: false,
        recommendedValues: emptyRecommendedValueIds()
    })
    mockUseUpdateMetamodelApplication.mockReturnValue({ mutate })
    mockUseMetamodelAdrOptions.mockReturnValue({
        adrOptions: [{ id: 'adr-1', name: 'ADR Core' }]
    })
    mockUseMetamodelBvbOptions.mockReturnValue({
        bvbOptions: [{ id: 'bvb-1', title: 'BvB Core' }]
    })
    mockUseMetamodelInitiativeOptions.mockReturnValue({
        data: [{ label: 'Init One', value: 'i-1' }]
    })
    mockUseTechStackOptions.mockReturnValue({
        data: {
            options: [{ label: 'Node', value: 'ts-1' }],
            byId: { 'ts-1': 'Node' }
        }
    })
    mockUseFoundationalTechOptions.mockReturnValue({
        foundationalTechnologyOptions: [
            { foundationalTechnologyId: 'ft-1', name: 'Kafka' }
        ]
    })
    mockUseTechCapabilityOptions.mockReturnValue({
        technicalCapabilityOptions: [
            { technicalCapabilityId: 'tc-1', name: 'Streaming' }
        ]
    })
    mockUseCreateAttestation.mockReturnValue({
        mutate: createMutate,
        isPending: false
    })
    mockUsePlaybookTypesGenAi.mockReturnValue({
        data: [{ label: 'Playbook One', value: 'pb-1' }]
    })
    mockUseDomainContext.mockReturnValue({
        domains: [{ company_domain_id: 'cd-1', domain_nm: 'Domain One' }],
        loading: false
    })
    mockUseUserContext.mockReturnValue({
        attributes: { email: 'user@test.com', fullName: 'User Name' },
        groups: []
    })
    mockCanEditApplication.mockReturnValue(false)
    mockGetApplicationAttestationRole.mockReturnValue(null)
    mockGetLowestApplicationAttester.mockReturnValue(null)
})

describe('ApplicationLanding', () => {
    it('renders a spinner while the metamodel application is loading', () => {
        mockUseMetamodelApplicationView.mockReturnValue({
            data: undefined,
            isLoading: true,
            refetch,
            isStaged: false,
            recommendedValues: emptyRecommendedValueIds()
        })
        const { container } = render(<ApplicationLanding centralId='c1' />)
        expect(container.querySelector('.chakra-spinner')).toBeTruthy()
    })

    it('renders the application name and info grids in view mode', () => {
        render(<ApplicationLanding centralId='c1' />)
        expect(screen.getByText('MY APP')).toBeInTheDocument()
        expect(screen.getByText('info-grid')).toBeInTheDocument()
        expect(screen.getByText('owners-grid')).toBeInTheDocument()
    })

    it('falls back to EXPLORER when there is no metamodel entity', () => {
        mockUseMetamodelApplicationView.mockReturnValue({
            data: undefined,
            isLoading: false,
            refetch,
            isStaged: false,
            recommendedValues: emptyRecommendedValueIds()
        })
        render(<ApplicationLanding centralId='c1' />)
        expect(screen.getByText('EXPLORER')).toBeInTheDocument()
        expect(screen.queryByText('info-grid')).not.toBeInTheDocument()
    })

    it('opens the audit history modal when View Audit History is clicked', () => {
        render(<ApplicationLanding centralId='c1' />)
        expect(screen.getByText('audit-closed')).toBeInTheDocument()
        fireEvent.click(screen.getByText('View Audit History'))
        expect(screen.getByText('audit-open')).toBeInTheDocument()
    })

    it('renders the accordion and reattests for a principal architect', () => {
        mockGetApplicationAttestationRole.mockReturnValue('principal_architect')
        render(<ApplicationLanding centralId='c1' />)
        expect(screen.getByText('attestation-accordion')).toBeInTheDocument()
        fireEvent.click(screen.getByText('Reattest'))
        fireEvent.click(screen.getByText('confirm-attest'))
        expect(createMutate).toHaveBeenCalledWith(
            expect.objectContaining({
                attestationBy: { name: 'User Name', email: 'user@test.com' },
                attestationType: 'ATTEST'
            })
        )
    })

    it('shows the reattesting label while attestation is pending', () => {
        mockGetApplicationAttestationRole.mockReturnValue('principal_architect')
        mockUseCreateAttestation.mockReturnValue({
            mutate: createMutate,
            isPending: true
        })
        render(<ApplicationLanding centralId='c1' />)
        expect(screen.getByText('Reattesting...')).toBeInTheDocument()
    })

    it('switches to edit mode and saves the application', () => {
        mockCanEditApplication.mockReturnValue(true)
        render(<ApplicationLanding centralId='c1' />)

        fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
        expect(screen.getByText('radio-ADR')).toBeInTheDocument()
        expect(screen.getByText('radio-BVB')).toBeInTheDocument()
        expect(screen.getByText('radio-Linked Initiative')).toBeInTheDocument()
        expect(screen.getByText('capability-drilldown')).toBeInTheDocument()
        expect(screen.getByText('markets-select')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'Save' }))
        expect(mutate).toHaveBeenCalledTimes(1)
        const [body, opts] = mutate.mock.calls[0]
        expect(body).toEqual(
            expect.objectContaining({
                adrCore: ['adr-1'],
                adrNonCore: ['adr-2'],
                bvbCore: ['bvb-1'],
                linkedCompanyDomainId: 'cd-1',
                userEmail: 'user@test.com'
            })
        )
        opts.onSuccess()
        expect(refetch).toHaveBeenCalled()
    })

    it('navigates back to the directory', () => {
        render(<ApplicationLanding centralId='c1' />)
        fireEvent.click(
            screen.getByRole('button', { name: 'Back to Applications' })
        )
        expect(mockPush).toHaveBeenCalledWith('/directory')
    })

    it('hides the recommendation legend when there are no recommendations', () => {
        render(<ApplicationLanding centralId='c1' />)
        expect(
            screen.queryByText('recommendation-legend')
        ).not.toBeInTheDocument()
    })

    it('shows the recommendation legend when staged recommendations exist', () => {
        mockUseMetamodelApplicationView.mockReturnValue({
            data: metamodelEntity,
            isLoading: false,
            refetch,
            isStaged: true,
            recommendedValues: {
                ...emptyRecommendedValueIds(),
                techStacks: ['ts-unknown']
            }
        })
        render(<ApplicationLanding centralId='c1' />)
        expect(screen.getByText('recommendation-legend')).toBeInTheDocument()
    })

    it('cancels out of edit mode', () => {
        mockCanEditApplication.mockReturnValue(true)
        render(<ApplicationLanding centralId='c1' />)
        fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
        expect(screen.getByText('info-grid')).toBeInTheDocument()
    })
})
