import React from 'react'
import { usePlaybookAnalytics } from '@/hooks'
import { Badge, Image, HStack, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export const NoContributionsDomainStatusBadge = () => {
    return (
        <Badge
            background='rgba(234, 112, 11, 1)'
            borderRadius={10}
            py={1}
            px={2}
        >
            <HStack>
                <Image
                    alt='Contribution Pending'
                    boxSize='16px'
                    src='/company-domains/PendingContributionIcon.png'
                ></Image>
                <Text
                    as='p'
                    textAlign={'center'}
                    color='#fff'
                    fontFamily='BentonSans'
                    lineHeight='16px'
                    fontWeight='500'
                >
                    Contribution Pending
                </Text>
            </HStack>
        </Badge>
    )
}

export const LastUpdateDomainStatusBadge = ({
    playbookId
}: {
    playbookId: string
}) => {
    const { playbook } = usePlaybookAnalytics(playbookId)
    return (
        <HStack>
            <Badge
                background='rgba(58, 171, 165, 1)'
                borderRadius={10}
                py={1}
                px={2}
            >
                <HStack>
                    <Image
                        alt='Last Updated'
                        boxSize='16px'
                        src='/company-domains/LastUpdateIcon.png'
                    ></Image>
                    <Text
                        as='p'
                        textAlign={'center'}
                        color='#fff'
                        fontFamily='BentonSans'
                        lineHeight='16px'
                        fontWeight='500'
                        opacity='100%'
                    >
                        <em>
                            {dayjs(playbook?.lastCommitDate ?? 0).fromNow()}
                        </em>
                    </Text>
                </HStack>
            </Badge>
            <Badge
                background='rgba(58, 171, 165, 1)'
                borderRadius={10}
                maxWidth='40%'
                p={1}
                px={2}
            >
                <HStack>
                    <Image
                        alt='Page Views'
                        boxSize='16px'
                        src='/company-domains/PageViewIcon.png'
                    ></Image>
                    <Text
                        as='p'
                        textAlign={'center'}
                        color='#fff'
                        fontFamily='BentonSans'
                        lineHeight='16px'
                        fontWeight='500'
                        opacity='100%'
                    >
                        {playbook?.pageViews ?? 0}
                    </Text>
                </HStack>
            </Badge>
        </HStack>
    )
}

export const DomainStatusBadge = ({
    playbookId,
    noContributionStatus
}: {
    playbookId: string
    noContributionStatus: boolean
}) => {
    return noContributionStatus ? (
        <NoContributionsDomainStatusBadge />
    ) : (
        <LastUpdateDomainStatusBadge playbookId={playbookId} />
    )
}
