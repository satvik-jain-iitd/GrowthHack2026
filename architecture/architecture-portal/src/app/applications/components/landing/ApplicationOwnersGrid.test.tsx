import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import ApplicationOwnersGrid from './ApplicationOwnersGrid'
import { Application } from '@/app/company-domains/types'

jest.mock('@/app/company-domains/components/UserAvatar', () => ({
    UserAvatar: ({ name, email }: { name?: string; email: string }) => (
        <div>{`avatar:${name ?? ''}:${email}`}</div>
    )
}))

const baseApplication = {
    application_nm: 'Test App',
    application_id: 'app-1',
    domain_nm: 'Domain'
} as unknown as Application

describe('ApplicationOwnersGrid', () => {
    it('renders all owner labels', () => {
        render(<ApplicationOwnersGrid applicationData={baseApplication} />)
        expect(screen.getByText('Owner / SMEs')).toBeInTheDocument()
        expect(screen.getByText('Owner')).toBeInTheDocument()
        expect(screen.getByText('Business Owner')).toBeInTheDocument()
        expect(screen.getByText('Business VP')).toBeInTheDocument()
        expect(screen.getByText('Production Support Owner')).toBeInTheDocument()
        expect(screen.getByText('Production Support VP')).toBeInTheDocument()
        expect(screen.getByText('SVP')).toBeInTheDocument()
        expect(screen.getByText('Unit CIO')).toBeInTheDocument()
    })

    it('renders owner names and emails when ownership info is present', () => {
        const withOwners = {
            ...baseApplication,
            central_application_da: {
                ownershipInfo: {
                    applicationOwner: {
                        fullName: 'Owner Name',
                        email: 'owner@test.com'
                    },
                    ownerSVP: {
                        fullName: 'SVP Name',
                        email: 'svp@test.com'
                    },
                    businessOwnerLeader1: {
                        fullName: 'Business VP Name',
                        email: 'businessvp@test.com'
                    },
                    productionSupportOwnerLeader1: {
                        fullName: 'Prod Support VP Name',
                        email: 'prodsupportvp@test.com'
                    }
                }
            }
        } as unknown as Application

        render(<ApplicationOwnersGrid applicationData={withOwners} />)
        expect(screen.getByText('Owner Name')).toBeInTheDocument()
        expect(
            screen.getByText('avatar:Owner Name:owner@test.com')
        ).toBeInTheDocument()
        expect(
            screen.getByText('avatar:SVP Name:svp@test.com')
        ).toBeInTheDocument()
        expect(
            screen.getByText('avatar:Business VP Name:businessvp@test.com')
        ).toBeInTheDocument()
        expect(
            screen.getByText(
                'avatar:Prod Support VP Name:prodsupportvp@test.com'
            )
        ).toBeInTheDocument()
    })
})
