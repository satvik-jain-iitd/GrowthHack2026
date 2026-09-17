/* istanbul ignore file */
import React from 'react'
import {
    Avatar,
    HStack,
    Text,
    SkeletonCircle,
    SkeletonText,
    Box
} from '@chakra-ui/react'
import { useUserInfo, useUserAvatar } from '@/hooks'

export function getAvatarName(
    userInfo: { displayName?: string } | undefined,
    email: string
): string {
    const filteredName = userInfo?.displayName?.replace(/[0-9]/g, '')
    if (filteredName && filteredName.trim().length > 0) {
        return filteredName.trim()
    }
    if (!email) return ''
    const localPart = email.split('@')[0]
    const cleaned = localPart.replace(/[0-9]/g, '').replace(/\./g, ' ')
    const split = cleaned.split(' ').filter(Boolean)
    if (split.length === 0) return ''
    const first = split[0]
    const last = split.length > 1 ? split[split.length - 1] : split[0]
    const capitalize = (s: string) =>
        s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
    return `${capitalize(first)} ${capitalize(last)}`
}

interface AvatarTableRowProps {
    email: string
    showOpen?: boolean
    iconOnly?: boolean
    stacked?: boolean
    testId?: string
    nameWidth?: string
    bgColor?: string
    color?: string
    portalLogo?: boolean
}

const AVATAR_SIZE = '32px'

export const AvatarTableRow: React.FC<AvatarTableRowProps> = ({
    email,
    showOpen = false,
    iconOnly = false,
    stacked = false,
    testId,
    nameWidth = '220px',
    bgColor = 'bg.emphasized',
    color = 'fg',
    portalLogo = false
}) => {
    const shouldShowOpen = showOpen && email?.toLowerCase() === 'open'
    const shouldFetchUserData = !portalLogo && !shouldShowOpen

    const { userInfo, isLoading } = useUserInfo(
        shouldFetchUserData ? email : ''
    )
    const { avatarUrl, isLoading: isAvatarLoading } = useUserAvatar(
        shouldFetchUserData ? email : ''
    )

    const avatarName = portalLogo
        ? 'Architecture Portal'
        : shouldShowOpen
          ? 'Open'
          : getAvatarName(userInfo ?? undefined, email)

    const isDataLoading = shouldFetchUserData && (isLoading || isAvatarLoading)

    // Render "Open" special case
    if (shouldShowOpen) {
        return (
            <HStack align='center' minH={AVATAR_SIZE} gap={iconOnly ? 0 : 1}>
                <Avatar.Root
                    boxSize={AVATAR_SIZE}
                    mr={1.5}
                    flexShrink={0}
                    bg={bgColor}
                >
                    <Avatar.Fallback name='O' />
                </Avatar.Root>
                {!iconOnly && (
                    <Text fontStyle='italic' color={color}>
                        Open
                    </Text>
                )}
            </HStack>
        )
    }

    // Render main avatar (user or portal logo)
    return (
        <>
            <HStack align='center' minH={AVATAR_SIZE} gap={iconOnly ? 0 : 1}>
                {isDataLoading ? (
                    <SkeletonCircle
                        boxSize={AVATAR_SIZE}
                        mr={1.5}
                        flexShrink={0}
                    />
                ) : (
                    <Avatar.Root
                        boxSize={AVATAR_SIZE}
                        mr={1.5}
                        flexShrink={0}
                        bg={portalLogo ? 'transparent' : bgColor}
                    >
                        {portalLogo ? (
                            <Avatar.Image
                                objectFit='contain'
                                src='/ArchitecturePortalLogo.svg'
                                alt='Architecture Portal'
                            />
                        ) : (
                            <>
                                <Avatar.Fallback name={avatarName} />
                                {avatarUrl && (
                                    <Avatar.Image
                                        src={avatarUrl}
                                        alt={avatarName}
                                    />
                                )}
                            </>
                        )}
                    </Avatar.Root>
                )}
                {!iconOnly && email && (
                    <Box
                        minW='120px'
                        maxW={nameWidth}
                        flexShrink={1}
                        overflow='hidden'
                        textOverflow='ellipsis'
                        whiteSpace='normal'
                        wordBreak='break-word'
                    >
                        {isDataLoading ? (
                            <SkeletonText noOfLines={1} width={nameWidth} />
                        ) : (
                            <Text color={color} data-testid={testId}>
                                {avatarName}
                            </Text>
                        )}
                    </Box>
                )}
            </HStack>
            {stacked && <Box height='16px' />}
        </>
    )
}
