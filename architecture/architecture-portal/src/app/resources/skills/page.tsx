import { Metadata } from 'next'
import { Box, Button, Text, HStack, VStack } from '@chakra-ui/react'
import { NoPrefetchLink } from '@/components/ui'
import { GitHubIcon } from '@/components/icons'
import {
    getGithubSkillsIndex,
    type SkillIndexEntry
} from '@/app/resources/skills/utils/getGithubSkillsDocument'
import { AMEX_SKILLS_REPO_URL } from '@/constants'
import { SkillsGrid } from './components/SkillsGrid'

export const metadata: Metadata = { title: 'Skills' }

export const revalidate = 60

function NoSkillsAvailable() {
    return (
        <div className='page-content'>
            <h1>No skills available</h1>
            <p>
                We could not load skills content right now. Please try again
                later.
            </p>
        </div>
    )
}

export default async function SkillsLanding() {
    let skillEntries: SkillIndexEntry[] = []

    try {
        skillEntries = await getGithubSkillsIndex()
    } catch {
        return <NoSkillsAvailable />
    }

    if (skillEntries.length === 0) {
        return <NoSkillsAvailable />
    }

    return (
        <Box className='page-content'>
            <Box
                w='100%'
                minH='180px'
                bg={{ base: '#00175a', _dark: '#1c1c1c' }}
                backgroundImage={{ base: 'none', md: "url('/admin/BKG.png')" }}
                backgroundRepeat='no-repeat'
                backgroundPosition='right'
                backgroundSize='contain'
            >
                <HStack
                    justifyContent='space-between'
                    alignItems='flex-start'
                    minH='180px'
                    px={{ base: 6, md: '10vw' }}
                    py={8}
                    gap={4}
                >
                    <VStack alignItems='flex-start' gap={2} flex={1}>
                        <HStack gap={3} alignItems='center'>
                            <Text
                                as='h1'
                                fontSize={{ base: '2xl', md: '4xl' }}
                                fontWeight={300}
                                color='white'
                                lineHeight='1.1'
                            >
                                Skills
                            </Text>
                        </HStack>
                        <Text fontSize='sm' color='whiteAlpha.800' maxW='2xl'>
                            Skills are reusable packages of instructions and
                            workflows that any AI agent can use to support
                            specialised tasks. Each skill covers a specific area
                            such as security, architecture review, or testing,
                            so teams can apply consistent and well-defined
                            guidance across their work. Browse the catalog to
                            find a skill that fits your needs.{' '}
                            <Text as='span' fontWeight='bold' color='white'>
                                Launched
                            </Text>{' '}
                            skills are available to use;{' '}
                            <Text as='span' fontWeight='bold' color='white'>
                                PR Submitted
                            </Text>{' '}
                            skills are under review and coming soon.
                        </Text>
                    </VStack>
                    <NoPrefetchLink
                        href={AMEX_SKILLS_REPO_URL}
                        target='_blank'
                        rel='noreferrer'
                        style={{ flexShrink: 0, alignSelf: 'center' }}
                    >
                        <Button
                            variant='solid'
                            colorPalette='blue'
                            size='sm'
                            gap={2}
                        >
                            <GitHubIcon width={15} height={15} />
                            amex-skills
                        </Button>
                    </NoPrefetchLink>
                </HStack>
            </Box>
            <Box w='100%' px={{ base: 6, md: '10vw' }} py={8}>
                <SkillsGrid entries={skillEntries} />
            </Box>
        </Box>
    )
}
