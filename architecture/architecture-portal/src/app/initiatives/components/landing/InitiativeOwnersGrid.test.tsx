import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import InitiativeOwnersGrid from './InitiativeOwnersGrid'
import { PTBInitiative } from '../../types'

jest.mock('../DisplayUsers', () => ({
    __esModule: true,
    default: ({
        heading,
        email,
        name
    }: {
        heading?: string
        email: string
        name?: string
    }) => (
        <div data-heading={heading} data-name={name ?? ''}>
            {`${heading}:${email}`}
        </div>
    )
}))

const baseInitiative = {
    unitCIO: '',
    headEngineers: [],
    principalArchitects: [],
    techOwners: [],
    ucioDelegates: [],
    enterpriseArchitects: [],
    statusReportOwnerPrimary: [],
    statusReportOwnerSecondary: [],
    additionalArchitects: []
} as unknown as PTBInitiative

describe('InitiativeOwnersGrid', () => {
    it('renders every owner heading', () => {
        render(<InitiativeOwnersGrid initiativeData={baseInitiative} />)
        expect(screen.getByText('Owners')).toBeInTheDocument()
        expect(screen.getByText(/Unit CIO:/)).toBeInTheDocument()
        expect(screen.getByText(/Head Engineer:/)).toBeInTheDocument()
        expect(screen.getByText(/Principal Architect:/)).toBeInTheDocument()
        expect(screen.getByText(/Enterprise Architect:/)).toBeInTheDocument()
    })

    it('joins populated owner arrays into comma-separated emails', () => {
        render(
            <InitiativeOwnersGrid
                initiativeData={
                    {
                        ...baseInitiative,
                        unitCIO: 'cio@test.com',
                        headEngineers: ['he1@test.com', 'he2@test.com'],
                        principalArchitects: ['pa@test.com'],
                        enterpriseArchitects: ['ea@test.com']
                    } as unknown as PTBInitiative
                }
            />
        )
        expect(
            screen.getByText('Head Engineer:he1@test.com,he2@test.com')
        ).toBeInTheDocument()
        expect(screen.getByText('Unit CIO:cio@test.com')).toBeInTheDocument()
    })

    it('passes metamodel owner names to DisplayUsers when all are present', () => {
        render(
            <InitiativeOwnersGrid
                initiativeData={
                    {
                        ...baseInitiative,
                        unitCIO: 'cio@test.com',
                        headEngineers: ['he1@test.com', 'he2@test.com'],
                        ownerNames: {
                            unitCIO: ['CIO User'],
                            techOwners: [],
                            headEngineers: ['HE One', 'HE Two'],
                            principalArchitects: [],
                            enterpriseArchitects: [],
                            additionalArchitects: []
                        }
                    } as unknown as PTBInitiative
                }
            />
        )
        expect(screen.getByText('Unit CIO:cio@test.com')).toHaveAttribute(
            'data-name',
            'CIO User'
        )
        expect(
            screen.getByText('Head Engineer:he1@test.com,he2@test.com')
        ).toHaveAttribute('data-name', 'HE One,HE Two')
    })

    it('omits the name when any owner in a group lacks a metamodel name', () => {
        render(
            <InitiativeOwnersGrid
                initiativeData={
                    {
                        ...baseInitiative,
                        headEngineers: ['he1@test.com', 'he2@test.com'],
                        ownerNames: {
                            unitCIO: [],
                            techOwners: [],
                            headEngineers: ['HE One', ''],
                            principalArchitects: [],
                            enterpriseArchitects: [],
                            additionalArchitects: []
                        }
                    } as unknown as PTBInitiative
                }
            />
        )
        expect(
            screen.getByText('Head Engineer:he1@test.com,he2@test.com')
        ).toHaveAttribute('data-name', '')
    })
})
