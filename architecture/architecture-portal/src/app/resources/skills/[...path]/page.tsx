import { Metadata } from 'next'
import { Box, HStack, Text } from '@chakra-ui/react'
import Mdx from '@/app/docs/components/Mdx'
import Markdown from '@/app/docs/components/Markdown'
import DocumentLayout from '@/app/docs/components/DocumentLayout'
import { GitHubIcon } from '@/components/icons'
import { NoPrefetchLink } from '@/components/ui'
import {
    getGithubSkillsPaths,
    getGithubSkillsMetadata,
    getGithubSkillsDocument
} from '@/app/resources/skills/utils/getGithubSkillsDocument'
function NoSkillsAvailable() {
    return (
        <div className='page-content'>
            <h1>No skills available</h1>
            <p>
                We could not load this skill right now. Please try again later.
            </p>
        </div>
    )
}
function SkillsStatusTracker({
    status,
    skillGithubUrl
}: {
    status?: string | null
    skillGithubUrl?: string | null
}) {
    if (!status && !skillGithubUrl) {
        return null
    }
    const isLaunched = status?.toLowerCase() === 'launched'
    return (
        <Box
            border='1px solid'
            borderColor='border.subtle'
            borderRadius='md'
            p={4}
            mb={6}
            bg='bg.surface'
        >
            <HStack
                justify='space-between'
                align='center'
                flexWrap='wrap'
                gap={3}
            >
                {status && (
                    <HStack gap={3} align='center'>
                        <Text
                            as='span'
                            display='inline-flex'
                            alignItems='center'
                            fontSize='sm'
                            lineHeight='1'
                            fontWeight='semibold'
                            color='fg.muted'
                        >
                            Skill Status
                        </Text>
                        <Box
                            as='span'
                            display='inline-flex'
                            alignItems='center'
                            px={3}
                            py={1}
                            borderRadius='full'
                            fontSize='sm'
                            lineHeight='1'
                            fontWeight='semibold'
                            bg={isLaunched ? 'green.700' : 'green.100'}
                            color={isLaunched ? 'white' : 'green.800'}
                            border='1px solid'
                            borderColor={isLaunched ? 'green.700' : 'green.300'}
                        >
                            {status}
                        </Box>
                    </HStack>
                )}
                {skillGithubUrl && (
                    <HStack gap={2}>
                        <NoPrefetchLink
                            href={skillGithubUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                border: '1px solid',
                                borderRadius: '0.375rem',
                                padding: '0.375rem 0.75rem',
                                fontSize: '0.875rem',
                                textDecoration: 'none'
                            }}
                        >
                            <GitHubIcon width={14} height={14} />
                            View Skill on GitHub
                        </NoPrefetchLink>
                    </HStack>
                )}
            </HStack>
        </Box>
    )
}
export const revalidate = 60
export const dynamicParams = true
function normalizeSkillsRoutePath(pathSegments: string[]): string {
    return pathSegments.map(segment => decodeURIComponent(segment)).join('/')
}
export async function generateStaticParams() {
    try {
        const paths = await getGithubSkillsPaths()
        return Object.keys(paths).map(path => ({ path: path.split('/') }))
    } catch {
        return []
    }
}
export async function generateMetadata({
    params
}: {
    params: Promise<{ path: string[] }>
}): Promise<Metadata> {
    try {
        const { path } = await params
        return await getGithubSkillsMetadata(normalizeSkillsRoutePath(path))
    } catch {
        return { title: 'No skills available' }
    }
}
export default async function Skills({
    params
}: {
    params: Promise<{ path: string[] }>
}) {
    let viewModel: Awaited<ReturnType<typeof getGithubSkillsDocument>> | null =
        null
    let decodedPath = ''
    try {
        const { path } = await params
        decodedPath = normalizeSkillsRoutePath(path)
        viewModel = await getGithubSkillsDocument(decodedPath)
    } catch (error) {
        console.error('Failed to load GitHub skills document:', error)
    }
    if (!viewModel) {
        return <NoSkillsAvailable />
    }
    const headingToc = viewModel.headingToc || viewModel.toc
    return (
        <DocumentLayout
            label='Skills'
            sidebar={viewModel.sidebar}
            tableOfContents={viewModel.toc}
            prevNext={viewModel.prevNext}
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Skills', href: '/resources/skills' },
                ...viewModel.breadcrumbs
            ]}
        >
            <div className='markdown-body'>
                <SkillsStatusTracker
                    status={viewModel.status}
                    skillGithubUrl={viewModel.skillGithubUrl}
                />
                {viewModel.isMdx ? (
                    <Mdx md={viewModel.markdown} toc={headingToc} />
                ) : (
                    <Markdown md={viewModel.markdown} toc={headingToc} />
                )}
            </div>
        </DocumentLayout>
    )
}
