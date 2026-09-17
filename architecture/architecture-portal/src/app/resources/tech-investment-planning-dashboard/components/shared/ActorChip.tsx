'use client'
import { Avatar, Flex, Text } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui/Tooltip'
import { useUserInfo } from '@/hooks/useUserInfo'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

interface Props {
    email: string
    /** 'chip' = avatar + name side-by-side (table cell, typeahead list)
     *  'avatar-only' = avatar with tooltip (stacked group)
     *  'activity' = avatar + name + email sub-label (audit log row) */
    variant?: 'chip' | 'avatar-only' | 'activity'
    size?: 'xs' | 'sm'
}

export function ActorChip({ email, variant = 'chip', size = 'xs' }: Props) {
    const { userInfo } = useUserInfo(email)
    const displayName = userInfo?.displayName ?? email

    const avatar = (
        <Avatar.Root size={size} flexShrink={0}>
            <Avatar.Fallback name={displayName} />
            <Avatar.Image src={API_ENDPOINTS.GET_USER_ICON(email)} />
        </Avatar.Root>
    )

    if (variant === 'avatar-only') {
        return <Tooltip content={displayName}>{avatar}</Tooltip>
    }

    if (variant === 'activity') {
        return (
            <Flex align='center' gap={2}>
                {avatar}
                <Flex direction='column' minW={0}>
                    <Text
                        fontSize='xs'
                        fontWeight='medium'
                        color='text.emphasis'
                        lineHeight='tight'
                    >
                        {displayName}
                    </Text>
                    {userInfo && userInfo.displayName !== email && (
                        <Text
                            fontSize='2xs'
                            color='text.subtle'
                            fontFamily='mono'
                            lineHeight='tight'
                        >
                            {email}
                        </Text>
                    )}
                </Flex>
            </Flex>
        )
    }

    // chip (default)
    return (
        <Flex align='center' gap={1.5} minW={0}>
            {avatar}
            <Text
                fontSize='xs'
                color='text.emphasis'
                overflow='hidden'
                textOverflow='ellipsis'
                whiteSpace='nowrap'
            >
                {displayName}
            </Text>
        </Flex>
    )
}
