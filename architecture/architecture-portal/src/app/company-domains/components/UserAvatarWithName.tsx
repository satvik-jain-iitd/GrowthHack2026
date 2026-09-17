/* istanbul ignore file */
import { UserAvatar } from '@/app/company-domains/components/UserAvatar'
import { useUserInfo } from '@/hooks/useUserInfo'
import { HStack } from '@chakra-ui/react'

export const UserAvatarWithName = ({
    email,
    nameFirst
}: {
    email?: string
    nameFirst?: boolean
}) => {
    const user = useUserInfo(email ?? '')
    if (email === null || email === undefined) {
        return null
    } else {
        return (
            <HStack gap={2}>
                {nameFirst && user?.userInfo?.displayName && (
                    <span>{user.userInfo.displayName}</span>
                )}
                <UserAvatar email={email} name={user?.userInfo?.displayName} />
                {!nameFirst && user?.userInfo?.displayName && (
                    <span>{user.userInfo.displayName}</span>
                )}
            </HStack>
        )
    }
}
