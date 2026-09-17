'use client'
import { Button, HStack, Text, VStack } from '@chakra-ui/react'
import { Admonition, NoPrefetchLink as Link } from '@/components/ui'
import { ARCH_PORTAL_HELP_SLACK_URL, SOURCE_HOST_CONFIG } from '@/constants'
import type { GithubFailure } from '@/utils/server/diagnoseGithubFailure'

const WARNING_REASONS = ['repo_inaccessible', 'file_not_found', 'rate_limited']

function getContent({
    reason,
    status,
    host,
    owner,
    repository,
    filePath
}: GithubFailure) {
    const repo = `${owner}/${repository}`
    const hostLabel = SOURCE_HOST_CONFIG[host].label

    switch (reason) {
        case 'repo_inaccessible':
            return {
                title: 'This document is in a repository we cannot read',
                message: `${repo} on ${hostLabel} is private or restricted, so the portal can't read this file.`
            }
        case 'file_not_found':
            return {
                title: 'This document no longer exists',
                message: `${filePath ?? 'The requested file'} was not found in ${repo} on ${hostLabel}. It has most likely been moved or deleted since it was last indexed.`
            }
        case 'rate_limited':
            return {
                title: 'GitHub rate limit reached',
                message: `${hostLabel} is currently rate limiting the portal, so this document can't be loaded. Please try again shortly.`
            }
        case 'unauthorized':
            return {
                title: 'The portal is not authorized to read this document',
                message: `${hostLabel} rejected the portal's credentials (status ${status}) while reading ${repo}. This needs a portal admin to refresh the GitHub token.`
            }
        default:
            return {
                title: 'This document could not be loaded',
                message: `${hostLabel} returned an unexpected status ${status} while reading ${filePath} from ${repo}.`
            }
    }
}

export default function DocumentUnavailable({
    error
}: {
    error: GithubFailure
}) {
    const { title, message } = getContent(error)

    return (
        <Admonition
            type={WARNING_REASONS.includes(error.reason) ? 'warning' : 'danger'}
            title={title}
        >
            <VStack align='flex-start' gap={3}>
                <Text>{message}</Text>
                <HStack gap={2}>
                    <Button
                        asChild
                        size='sm'
                        height='7'
                        variant='solid'
                        colorPalette='blue'
                        fontSize={14}
                    >
                        <Link target='_blank' href={error.repoUrl}>
                            Open repository
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size='sm'
                        height='7'
                        variant='outline'
                        colorPalette='blue'
                        fontSize={14}
                    >
                        <Link target='_blank' href={ARCH_PORTAL_HELP_SLACK_URL}>
                            #arch-portal-help
                        </Link>
                    </Button>
                </HStack>
            </VStack>
        </Admonition>
    )
}
