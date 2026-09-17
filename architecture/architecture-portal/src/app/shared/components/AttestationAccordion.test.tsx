import React from 'react'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import AttestationAccordion from './AttestationAccordion'
import {
    useAttestationsList,
    useAttestationDetail,
    useCreateAttestation
} from '../hooks/useAttestations'

jest.mock('../hooks/useAttestations')

jest.mock('@/constants/attestationConfig', () => ({
    resolveAttestationType: (entityType: string) =>
        entityType === 'initiative'
            ? 'INITIATIVE_PRE_BUILD'
            : 'APPLICATION_PRE_BUILD',
    getAttestationsForType: () => [
        {
            id: 'TEST_ITEM',
            name: 'Test Item',
            description: 'Test description'
        }
    ]
}))

jest.mock('@americanexpress/dls-icons', () => ({
    IconWarning: (props: Record<string, unknown>) => (
        <span data-testid='icon-warning' {...props} />
    )
}))

jest.mock('@/app/initiatives/components/PtbTags', () => ({
    __esModule: true,
    default: ({
        item,
        isCore
    }: {
        item: { name: string; id: string }
        isCore?: boolean
    }) => (
        <span data-testid='ptb-tag'>
            {isCore ? '[core] ' : ''}
            {item.name}
        </span>
    )
}))

const mockUseAttestationsList = useAttestationsList as jest.MockedFunction<
    typeof useAttestationsList
>
const mockUseAttestationDetail = useAttestationDetail as jest.MockedFunction<
    typeof useAttestationDetail
>
const mockUseCreateAttestation = useCreateAttestation as jest.MockedFunction<
    typeof useCreateAttestation
>
describe('AttestationAccordion', () => {
    const defaultProps = {
        entityType: 'initiative' as const,
        entityId: 'init-123',
        currentEntity: {
            impactedCompanyDomains: [{ companyDomainName: 'Domain A' }],
            buildVsBuyAssessments: ['bvb1'],
            architectureDecisionRecords: ['adr1'],
            linkedInitiatives: ['init2']
        },
        role: 'principal_architect' as const,
        userEmail: 'user@example.com'
    }

    beforeEach(() => {
        jest.clearAllMocks()
        window.localStorage.clear()
        mockUseCreateAttestation.mockReturnValue({
            mutate: jest.fn(),
            isPending: false
        } as unknown as ReturnType<typeof useCreateAttestation>)
    })

    it('renders accordion when no attestations exist (needs attestation)', () => {
        mockUseAttestationsList.mockReturnValue({
            data: [],
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationsList>)
        mockUseAttestationDetail.mockReturnValue({
            data: undefined,
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationDetail>)

        render(<AttestationAccordion {...defaultProps} />)

        expect(
            screen.getByText('Change Request Attestation Needed')
        ).toBeInTheDocument()
    })

    it('renders accordion when snapshot is stale', async () => {
        mockUseAttestationsList.mockReturnValue({
            data: [{ attestationId: 'a1', attestationDate: '2024-01-15' }],
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationsList>)
        mockUseAttestationDetail.mockReturnValue({
            data: {
                attestationId: 'a1',
                attestationDate: '2024-01-15',
                attestationBy: 'user@example.com',
                attestationSnapshot: {
                    impactedCompanyDomains: [
                        { companyDomainName: 'Old Domain' }
                    ],
                    buildVsBuyAssessments: ['bvb1'],
                    architectureDecisionRecords: ['adr1'],
                    linkedInitiatives: ['init2']
                },
                additionalDetails: []
            },
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationDetail>)

        render(<AttestationAccordion {...defaultProps} />)

        await waitFor(() => {
            expect(
                screen.getByText('Change Request Attestation Needed')
            ).toBeInTheDocument()
        })
    })

    it('renders nothing when snapshot matches current data', async () => {
        mockUseAttestationsList.mockReturnValue({
            data: [{ attestationId: 'a1', attestationDate: '2024-01-15' }],
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationsList>)
        mockUseAttestationDetail.mockReturnValue({
            data: {
                attestationId: 'a1',
                attestationDate: '2024-01-15',
                attestationBy: 'user@example.com',
                attestationSnapshot: {
                    impactedCompanyDomains: [{ companyDomainName: 'Domain A' }],
                    buildVsBuyAssessments: ['bvb1'],
                    architectureDecisionRecords: ['adr1'],
                    linkedInitiatives: ['init2']
                },
                additionalDetails: []
            },
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationDetail>)

        const { container } = render(<AttestationAccordion {...defaultProps} />)

        await waitFor(() => {
            expect(container.firstChild).toBeNull()
        })
    })

    it('shows submit button for principal architect without checkbox', () => {
        mockUseAttestationsList.mockReturnValue({
            data: [],
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationsList>)
        mockUseAttestationDetail.mockReturnValue({
            data: undefined,
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationDetail>)

        render(
            <AttestationAccordion
                {...defaultProps}
                role='principal_architect'
            />
        )

        expect(screen.getByText('Submit Attestation')).toBeInTheDocument()
        expect(
            screen.queryByText('Yes, I attest to these changes')
        ).not.toBeInTheDocument()
    })

    it('shows spinner while loading attestations list', () => {
        mockUseAttestationsList.mockReturnValue({
            data: undefined,
            isLoading: true
        } as unknown as ReturnType<typeof useAttestationsList>)
        mockUseAttestationDetail.mockReturnValue({
            data: undefined,
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationDetail>)

        render(<AttestationAccordion {...defaultProps} />)
        expect(document.querySelector('[class*="spinner"]')).toBeTruthy()
    })

    it('renders tracked field rows (Company Domain, BVBs, ADRs, Linked Initiatives)', () => {
        mockUseAttestationsList.mockReturnValue({
            data: [],
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationsList>)
        mockUseAttestationDetail.mockReturnValue({
            data: undefined,
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationDetail>)

        render(<AttestationAccordion {...defaultProps} />)

        expect(
            screen.getAllByText(/Company Domain:/).length
        ).toBeGreaterThanOrEqual(1)
        expect(screen.getAllByText(/BVBs:/).length).toBeGreaterThanOrEqual(1)
        expect(screen.getAllByText(/ADRs:/).length).toBeGreaterThanOrEqual(1)
        expect(
            screen.getAllByText(/Linked Initiatives:/).length
        ).toBeGreaterThanOrEqual(1)
    })

    it('renders PtbTags for all tracked tag fields (current)', () => {
        mockUseAttestationsList.mockReturnValue({
            data: [],
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationsList>)
        mockUseAttestationDetail.mockReturnValue({
            data: undefined,
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationDetail>)

        const propsWithRefs = {
            ...defaultProps,
            currentEntity: {
                impactedCompanyDomains: [
                    {
                        companyDomainId: 'cd-1',
                        companyDomainName: 'Domain A'
                    }
                ],
                buildVsBuyAssessments: [
                    { bvbId: 'bvb-1', title: 'BVB Alpha', isCore: true }
                ],
                architectureDecisionRecords: [
                    { adrId: 'adr-1', title: 'ADR Alpha', isCore: false }
                ],
                linkedInitiatives: [
                    {
                        initiativeId: 'init2',
                        initiativeName: 'Init Two',
                        isCore: true
                    }
                ]
            }
        }

        render(<AttestationAccordion {...propsWithRefs} />)

        const tags = screen.getAllByTestId('ptb-tag')
        expect(tags.length).toBe(4)
        expect(tags[0]).toHaveTextContent('Domain A')
        expect(tags[1]).toHaveTextContent('BVB Alpha')
        expect(tags[2]).toHaveTextContent('ADR Alpha')
        expect(tags[3]).toHaveTextContent('Init Two')
    })

    it('does not call mutate directly when Submit Attestation is clicked (opens modal instead)', () => {
        const mutateFn = jest.fn()
        mockUseAttestationsList.mockReturnValue({
            data: [],
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationsList>)
        mockUseAttestationDetail.mockReturnValue({
            data: undefined,
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationDetail>)
        mockUseCreateAttestation.mockReturnValue({
            mutate: mutateFn,
            isPending: false
        } as unknown as ReturnType<typeof useCreateAttestation>)

        render(
            <AttestationAccordion
                {...defaultProps}
                role='principal_architect'
            />
        )

        const submitButton = screen.getByText('Submit Attestation')
        fireEvent.click(submitButton)

        expect(mutateFn).not.toHaveBeenCalled()
    })

    it('renders PtbTags in both from and to columns when snapshot has tracked fields', async () => {
        mockUseAttestationsList.mockReturnValue({
            data: [{ attestationId: 'a1', attestationDate: '2024-01-15' }],
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationsList>)
        mockUseAttestationDetail.mockReturnValue({
            data: {
                attestationId: 'a1',
                attestationDate: '2024-01-15',
                attestationBy: 'user@example.com',
                attestationSnapshot: {
                    impactedCompanyDomains: [
                        {
                            companyDomainId: 'cd-1',
                            companyDomainName: 'Domain A'
                        }
                    ],
                    buildVsBuyAssessments: [
                        {
                            bvbId: 'bvb-old',
                            title: 'BVB Old',
                            isCore: false
                        }
                    ],
                    architectureDecisionRecords: [
                        {
                            adrId: 'adr-old',
                            title: 'ADR Old',
                            isCore: true
                        }
                    ],
                    linkedInitiatives: [
                        {
                            initiativeId: 'init2',
                            initiativeName: 'Init Two',
                            isCore: true
                        }
                    ]
                },
                additionalDetails: []
            },
            isLoading: false
        } as unknown as ReturnType<typeof useAttestationDetail>)

        const propsWithRefs = {
            ...defaultProps,
            currentEntity: {
                impactedCompanyDomains: [
                    {
                        companyDomainId: 'cd-2',
                        companyDomainName: 'Domain B'
                    }
                ],
                buildVsBuyAssessments: [
                    { bvbId: 'bvb-new', title: 'BVB New', isCore: true }
                ],
                architectureDecisionRecords: [
                    { adrId: 'adr-new', title: 'ADR New', isCore: false }
                ],
                linkedInitiatives: [
                    {
                        initiativeId: 'init3',
                        initiativeName: 'Init Three',
                        isCore: false
                    }
                ]
            }
        }

        render(<AttestationAccordion {...propsWithRefs} />)

        await waitFor(() => {
            const tags = screen.getAllByTestId('ptb-tag')
            expect(tags.length).toBe(8)
            expect(tags[0]).toHaveTextContent('Domain A')
            expect(tags[1]).toHaveTextContent('Domain B')
            expect(tags[2]).toHaveTextContent('BVB Old')
            expect(tags[3]).toHaveTextContent('BVB New')
            expect(tags[4]).toHaveTextContent('ADR Old')
            expect(tags[5]).toHaveTextContent('ADR New')
            expect(tags[6]).toHaveTextContent('Init Two')
            expect(tags[7]).toHaveTextContent('Init Three')
        })
    })
})
