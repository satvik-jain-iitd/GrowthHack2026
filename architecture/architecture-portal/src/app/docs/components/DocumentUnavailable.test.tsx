import React from 'react'
import { render, screen } from '@/test/utils/test-utils'
import DocumentUnavailable from './DocumentUnavailable'
import type {
    GithubFailure,
    GithubFailureReason
} from '@/utils/server/diagnoseGithubFailure'

jest.mock('@/context', () => ({
    useNavigationContext: () => ({ startNavigation: jest.fn() })
}))

const makeError = (
    reason: GithubFailureReason,
    overrides: Partial<GithubFailure> = {}
): GithubFailure => ({
    reason,
    status: 404,
    host: 'ghe',
    owner: 'amex-eng',
    repository: 'gmnst-architecture',
    filePath: 'workproducts/vision.md',
    repoUrl: 'https://github.aexp.com/amex-eng/gmnst-architecture',
    ...overrides
})

describe('DocumentUnavailable', () => {
    it('explains that the repository is private', () => {
        render(<DocumentUnavailable error={makeError('repo_inaccessible')} />)

        expect(
            screen.getByText(
                /amex-eng\/gmnst-architecture on GitHub Enterprise/
            )
        ).toHaveTextContent('is private or restricted')
    })

    it('names the missing file path', () => {
        render(<DocumentUnavailable error={makeError('file_not_found')} />)

        expect(
            screen.getByText(/workproducts\/vision.md was not found/)
        ).toBeInTheDocument()
        expect(
            screen.getByText('This document no longer exists')
        ).toBeInTheDocument()
    })

    it('asks the user to retry when rate limited', () => {
        render(
            <DocumentUnavailable
                error={makeError('rate_limited', { status: 403 })}
            />
        )

        expect(screen.getByText(/try again shortly/)).toBeInTheDocument()
    })

    it('shows the status code when unauthorized', () => {
        render(
            <DocumentUnavailable
                error={makeError('unauthorized', { status: 401 })}
            />
        )

        expect(screen.getByText(/status 401/)).toBeInTheDocument()
    })

    it('shows the status code for an unknown failure', () => {
        render(
            <DocumentUnavailable
                error={makeError('unknown', { status: 500 })}
            />
        )

        expect(screen.getByText(/unexpected status 500/)).toBeInTheDocument()
    })

    it('links to the enterprise repository for a ghe document', () => {
        render(<DocumentUnavailable error={makeError('repo_inaccessible')} />)

        expect(screen.getByText('Open repository')).toHaveAttribute(
            'href',
            'https://github.aexp.com/amex-eng/gmnst-architecture'
        )
    })

    it('links to the cloud repository for a ghc document', () => {
        render(
            <DocumentUnavailable
                error={makeError('repo_inaccessible', {
                    host: 'ghc',
                    repository: 'amex-skills',
                    repoUrl: 'https://github.com/amex-eng/amex-skills'
                })}
            />
        )

        expect(
            screen.getByText(/amex-eng\/amex-skills on GitHub Cloud/)
        ).toBeInTheDocument()
        expect(screen.getByText('Open repository')).toHaveAttribute(
            'href',
            'https://github.com/amex-eng/amex-skills'
        )
    })

    it('links to the help slack channel', () => {
        render(<DocumentUnavailable error={makeError('repo_inaccessible')} />)

        expect(screen.getByText('#arch-portal-help')).toHaveAttribute(
            'href',
            expect.stringContaining('slack.com')
        )
    })
})
