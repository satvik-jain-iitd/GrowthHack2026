/* istanbul ignore file */
'use client'
import {
    Avatar,
    Box,
    Flex,
    Popover,
    Portal,
    Spinner,
    Text
} from '@chakra-ui/react'
import styles from '@/app/company-domains/display-user.module.css'
import { useUserInfo, useUserAvatar } from '@/hooks'

const getNameandRender = (email: string, heading?: string) => {
    const names = []
    const emails = (typeof email === 'string' && email?.split(',')) || []
    const loadingStates: boolean[] = []
    for (let i = 0; i < emails.length; i++) {
        // eslint-disable-next-line
        const { userInfo, isLoading } = useUserInfo(emails[i])
        names.push(userInfo?.displayName || emails[i]?.split('@')[0])
        loadingStates.push(isLoading)
    }
    if (loadingStates.some(Boolean)) {
        return (
            <Flex alignItems={'center'} gap={2}>
                <Spinner size='sm' />
            </Flex>
        )
    }
    return (
        <DisplayUsers
            name={names.join(',')}
            email={email}
            heading={heading}
            isRecalled={true}
        />
    )
}

export default function DisplayUsers({
    heading,
    name,
    email,
    isRecalled = false
}: {
    heading?: string
    name?: string
    email: string
    isRecalled?: boolean
}) {
    const names = name?.split(',') || []
    const { avatarUrl, isLoading } = useUserAvatar(email ?? '')

    if (!name && !isRecalled) {
        return getNameandRender(email, heading)
    }

    return (
        <Flex alignItems={'center'}>
            <Box className={styles.imageContainer}>
                <Avatar.Root height={'30px'} width={'30px'}>
                    <Avatar.Fallback
                        name={name != '-' && names.length == 1 ? name : ''}
                    />
                    {!isLoading && avatarUrl && (
                        <Avatar.Image src={avatarUrl} alt={email} />
                    )}
                </Avatar.Root>
            </Box>
            <Box ml={3}>
                <Box fontWeight='600' fontSize={'14px'}>
                    {heading}
                </Box>
                <Box>
                    {names.length > 1 ? (
                        <Popover.Root>
                            <Popover.Trigger asChild>
                                <Text className={styles.popoverTrigger}>
                                    Show {names.length} {heading}
                                </Text>
                            </Popover.Trigger>

                            <Portal>
                                <Popover.Positioner>
                                    <Popover.Content
                                        style={{
                                            border: '1px solid black'
                                        }}
                                        className={styles.popOver}
                                    >
                                        <Popover.Body>
                                            {email &&
                                                email
                                                    ?.split(',')
                                                    .map((element, index) => {
                                                        return (
                                                            <Box
                                                                className='popOver'
                                                                key={index}
                                                                mb={1}
                                                            >
                                                                <DisplayUsers
                                                                    key={index}
                                                                    email={
                                                                        element
                                                                    }
                                                                    name={
                                                                        names[
                                                                            index
                                                                        ]
                                                                    }
                                                                    heading={
                                                                        undefined
                                                                    }
                                                                />
                                                            </Box>
                                                        )
                                                    })}
                                        </Popover.Body>

                                        <Popover.CloseTrigger />
                                    </Popover.Content>
                                </Popover.Positioner>
                            </Portal>
                        </Popover.Root>
                    ) : (
                        name
                    )}
                </Box>
            </Box>
        </Flex>
    )
}
