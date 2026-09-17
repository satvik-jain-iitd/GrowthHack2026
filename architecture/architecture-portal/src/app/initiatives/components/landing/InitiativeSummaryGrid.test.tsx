import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import InitiativeSummaryGrid from './InitiativeSummaryGrid'
import { PTBInitiative } from '../../types'

const mockInitiative: PTBInitiative = {
    actualOnboardingDate: '',
    adrCore: [],
    adrNonCore: [],
    applicationsImpacted: [],
    bvbCore: [],
    bvbNonCore: [],
    eaLead: [],
    engineeringLead: [],
    etp_id: '',
    initiativeCategory: '',
    initiativeId: 'i1',
    metadata: [],
    name: 'Test Initiative',
    startDate: '2024-01-15',
    tentativeEndDate: '2025-06-30',
    unitCIO: '',
    years: ['2024', '2025'],
    companyDomainId: [],
    companyDomainName: [],
    clarityId: 'ETP-123',
    initiativeFrameworks: [],
    playbookCore: [],
    playbookNonCore: [],
    techOwners: [],
    principalArchitects: [],
    enterpriseArchitects: [],
    ucioDelegates: [],
    headEngineers: [],
    delegates: [],
    statusReportOwnerPrimary: [],
    statusReportOwnerSecondary: [],
    additionalArchitects: [],
    markets: [],
    companyDomains: [],
    ebc: []
}

describe('InitiativeSummaryGrid', () => {
    it('renders ETP value', () => {
        render(<InitiativeSummaryGrid initiativeData={mockInitiative} />)
        expect(screen.getByText('ETP')).toBeInTheDocument()
        expect(screen.getByText('ETP-123')).toBeInTheDocument()
    })

    it('renders Start Date', () => {
        render(<InitiativeSummaryGrid initiativeData={mockInitiative} />)
        expect(screen.getByText('Start Date')).toBeInTheDocument()
    })

    it('renders End Date', () => {
        render(<InitiativeSummaryGrid initiativeData={mockInitiative} />)
        expect(screen.getByText('End Date')).toBeInTheDocument()
    })

    it('renders Years', () => {
        render(<InitiativeSummaryGrid initiativeData={mockInitiative} />)
        expect(screen.getByText('Years')).toBeInTheDocument()
        expect(screen.getByText('2024, 2025')).toBeInTheDocument()
    })

    it('renders "-" for missing values', () => {
        const initiative = {
            ...mockInitiative,
            clarityId: '',
            startDate: '',
            tentativeEndDate: '',
            years: []
        }
        render(<InitiativeSummaryGrid initiativeData={initiative} />)
        const dashes = screen.getAllByText('-')
        expect(dashes.length).toBeGreaterThanOrEqual(2)
    })
})
