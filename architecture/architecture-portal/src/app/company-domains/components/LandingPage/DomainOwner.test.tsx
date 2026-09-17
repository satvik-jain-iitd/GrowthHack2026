import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { DomainOwners } from './DomainOwner'
import { Domain } from '@/app/company-domains/types'

jest.mock('@chakra-ui/react', () => {
    const actual = jest.requireActual('@chakra-ui/react')
    return {
        ...actual,
        Avatar: {
            Root: ({ children }: { children: React.ReactNode }) => (
                <div data-testid='avatar-root'>{children}</div>
            ),
            Fallback: ({ name }: { name?: string }) => (
                <span data-testid='avatar-fallback'>
                    {name ? 'fallback' : ''}
                </span>
            ),
            Image: ({ src }: { src?: string }) => <img alt='avatar' src={src} />
        }
    }
})

jest.mock('@/constants', () => ({
    API_ENDPOINTS: {
        GET_USER_ICON: (email: string) => `https://example.com/avatar/${email}`
    }
}))

jest.mock('@/app/company-domains/display-user.module.css', () => ({
    userDisplayContainer: 'userDisplayContainer',
    imageContainer: 'imageContainer',
    textContainer: 'textContainer',
    textHeading: 'textHeading',
    textName: 'textName',
    popoverTrigger: 'popoverTrigger',
    popOver: 'popOver',
    domainOwners: 'domainOwners'
}))

const baseDomain = {
    unit_cio_nm: 'Unit CIO Name',
    tech_owner_nm: 'Tech Owner Name',
    principal_ea_architect_nm: 'Principal Architect Name',
    ea_architect_nm: 'Enterprise Architect Name',
    head_engineer_nm: 'Head Engineer Name',
    ea_architect_delegate_nm: 'Delegate One',
    unit_cio_email_ad_da: ['unit-cio@example.com'],
    tech_own_email_ad_da: ['tech-owner@example.com'],
    princ_ea_archt_email_ad_da: ['principal-architect@example.com'],
    ea_archt_email_ad_da: ['enterprise-architect@example.com'],
    head_engnr_email_ad_da: ['head-engineer@example.com'],
    ea_archt_dlgte_email_ad_da: ['delegate-one@example.com']
} as Domain

describe('DomainOwners', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders owner headings and names', () => {
        render(<DomainOwners domain={baseDomain} />)

        expect(screen.getByText('Unit CIO')).toBeInTheDocument()
        expect(screen.getByText('Tech Owner')).toBeInTheDocument()
        expect(screen.getByText('Principal Architect')).toBeInTheDocument()
        expect(screen.getByText('Enterprise Architect')).toBeInTheDocument()
        expect(screen.getByText('Head Engineer')).toBeInTheDocument()
        expect(
            screen.getByText('Unit CIO Architect (delegate)')
        ).toBeInTheDocument()

        expect(screen.getByText('Unit CIO Name')).toBeInTheDocument()
        expect(screen.getByText('Tech Owner Name')).toBeInTheDocument()
        expect(screen.getByText('Principal Architect Name')).toBeInTheDocument()
        expect(
            screen.getByText('Enterprise Architect Name')
        ).toBeInTheDocument()
        expect(screen.getByText('Head Engineer Name')).toBeInTheDocument()
        expect(screen.getByText('Delegate One')).toBeInTheDocument()
    })

    it('shows delegate count trigger when multiple delegates are provided', () => {
        const domainWithMultipleDelegates = {
            ...baseDomain,
            ea_architect_delegate_nm: 'Delegate One,Delegate Two',
            ea_archt_dlgte_email_ad_da: [
                'delegate-one@example.com',
                'delegate-two@example.com'
            ]
        } as Domain

        render(<DomainOwners domain={domainWithMultipleDelegates} />)

        expect(screen.getByText('Show 2 Delegates')).toBeInTheDocument()
    })

    it('renders owner headings when domain is undefined', () => {
        render(<DomainOwners domain={undefined} />)

        expect(screen.getByText('Unit CIO')).toBeInTheDocument()
        expect(screen.getByText('Tech Owner')).toBeInTheDocument()
        expect(screen.getByText('Principal Architect')).toBeInTheDocument()
        expect(screen.getByText('Enterprise Architect')).toBeInTheDocument()
        expect(screen.getByText('Head Engineer')).toBeInTheDocument()
        expect(
            screen.getByText('Unit CIO Architect (delegate)')
        ).toBeInTheDocument()
    })
})
