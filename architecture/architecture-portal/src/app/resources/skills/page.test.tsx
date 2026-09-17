import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import SkillsLanding from './page'
import type { SkillIndexEntry } from '@/app/resources/skills/utils/getGithubSkillsDocument'

const mockGetGithubSkillsIndex = jest.fn()

jest.mock('@/app/resources/skills/utils/getGithubSkillsDocument', () => ({
    getGithubSkillsIndex: (...args: unknown[]) =>
        mockGetGithubSkillsIndex(...args)
}))

jest.mock('@/components/ui', () => ({
    NoPrefetchLink: ({
        href,
        children,
        ...props
    }: {
        href: string
        children: React.ReactNode
    }) => mockReact.createElement('a', { href, ...props }, children)
}))

jest.mock('@americanexpress/dls-icons', () => ({
    IconDocument: () => null,
    IconLightBulb: () => null
}))

jest.mock('./components/SkillsGrid', () => ({
    SkillsGrid: ({ entries }: { entries: SkillIndexEntry[] }) => (
        <div data-testid='skills-grid'>
            {entries.map(entry =>
                mockReact.createElement(
                    'a',
                    {
                        key: entry.route,
                        href: `/resources/skills/${encodeURIComponent(entry.route)}`
                    },
                    entry.route
                )
            )}
        </div>
    )
}))

const mockReact = React

import React from 'react'

describe('SkillsLanding page', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders skill cards for each route', async () => {
        mockGetGithubSkillsIndex.mockResolvedValue([
            {
                route: 'type-a-api-reuse-check',
                status: 'Launched',
                description: 'Type A API reuse governance recommendations.'
            },
            {
                route: 'amex-go-style-guide',
                status: 'PR Submitted',
                description: 'Go style guidance for engineering teams.'
            }
        ])

        const jsx = await SkillsLanding()
        render(jsx)

        expect(screen.getByText('Skills')).toBeInTheDocument()
        expect(
            screen.getAllByText('type-a-api-reuse-check').length
        ).toBeGreaterThan(0)
        expect(
            screen.getAllByText('amex-go-style-guide').length
        ).toBeGreaterThan(0)
        expect(
            screen.getByRole('link', { name: /type-a-api-reuse-check/i })
        ).toHaveAttribute('href', '/resources/skills/type-a-api-reuse-check')
    })

    it('renders fallback when skills list is empty', async () => {
        mockGetGithubSkillsIndex.mockResolvedValue([])

        const jsx = await SkillsLanding()
        render(jsx)

        expect(screen.getByText('No skills available')).toBeInTheDocument()
    })

    it('renders fallback on fetch failure', async () => {
        mockGetGithubSkillsIndex.mockRejectedValue(new Error('boom'))

        const jsx = await SkillsLanding()
        render(jsx)

        expect(screen.getByText('No skills available')).toBeInTheDocument()
    })
})
