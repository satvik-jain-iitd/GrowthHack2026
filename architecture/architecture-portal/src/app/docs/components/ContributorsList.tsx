import React from 'react'
import { Box, Spinner, Text, Stack, Avatar, Popover } from '@chakra-ui/react'
import { useGetContributors } from '@/app/docs/hooks/useGetContributors'
import { AvatarTableRow } from '@/components/ui'
import { useUserAvatar } from '@/hooks'

export type ContributorsListProps = {
    repo: string
    filePath: string
}

function ContributorAvatar({ email, idx }: { email: string; idx: number }) {
    const { avatarUrl, isLoading } = useUserAvatar(email)

    return (
        <Avatar.Root
            size='sm'
            ml={idx > 0 ? -2 : 0}
            borderWidth='2px'
            borderColor='white'
            boxSize='28px'
        >
            <Avatar.Fallback name={email} />
            {!isLoading && avatarUrl && (
                <Avatar.Image src={avatarUrl} alt={email} />
            )}
        </Avatar.Root>
    )
}

export default function ContributorsList({
    repo,
    filePath
}: ContributorsListProps) {
    const { data, isLoading, error } = useGetContributors(repo, filePath)

    const contributors = data?.data || []
    const maxDisplayedAvatars = 3
    const displayedContributors = contributors.slice(0, maxDisplayedAvatars)
    const remainingCount = contributors.length - maxDisplayedAvatars

    return (
        <Popover.Root positioning={{ placement: 'bottom-end' }}>
            <Popover.Trigger asChild>
                <Box
                    aria-label='View contributors'
                    role='button'
                    tabIndex={0}
                    cursor='pointer'
                    p={1}
                    borderRadius='md'
                    _hover={{ bg: 'bg.muted' }}
                    flexShrink={0}
                >
                    {isLoading ? (
                        <Spinner size='sm' />
                    ) : (
                        <Box display='flex' alignItems='center'>
                            {displayedContributors.map((contributor, idx) => (
                                <ContributorAvatar
                                    key={idx}
                                    email={contributor}
                                    idx={idx}
                                />
                            ))}
                            {remainingCount > 0 && (
                                <Avatar.Root
                                    size='sm'
                                    ml={-2}
                                    borderWidth='2px'
                                    borderColor='white'
                                    boxSize='28px'
                                    bg='bg.emphasized'
                                >
                                    <Avatar.Fallback
                                        name={`+${remainingCount}`}
                                    />
                                </Avatar.Root>
                            )}
                        </Box>
                    )}
                </Box>
            </Popover.Trigger>
            <Popover.Positioner>
                <Popover.Content>
                    <Popover.Arrow />
                    <Popover.Body>
                        {isLoading || !data ? (
                            <Box display='flex' justifyContent='center' p={2}>
                                <Spinner size='sm' />
                            </Box>
                        ) : error ? (
                            <Text color='red.500' fontSize='sm'>
                                Failed to load contributors.
                            </Text>
                        ) : (
                            <Stack gap={3} minW='200px'>
                                {data.data.length === 0 ? (
                                    <Text fontSize='sm'>
                                        No contributors found.
                                    </Text>
                                ) : (
                                    <>
                                        <Text fontWeight='bold' fontSize='sm'>
                                            Contributors
                                        </Text>
                                        {data.data.map((contributor, idx) => (
                                            <Box
                                                key={idx}
                                                display='flex'
                                                alignItems='center'
                                            >
                                                <AvatarTableRow
                                                    email={contributor}
                                                />
                                            </Box>
                                        ))}
                                    </>
                                )}
                            </Stack>
                        )}
                    </Popover.Body>
                </Popover.Content>
            </Popover.Positioner>
        </Popover.Root>
    )
}
