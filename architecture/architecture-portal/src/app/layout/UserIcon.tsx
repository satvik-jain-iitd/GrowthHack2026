/* istanbul ignore file */
'use client'
import { User } from '@/app/layout/AuthBlueSso'
import { useUserContext } from '@/context'
import { Avatar, Box, IconButton, Menu, Text } from '@chakra-ui/react'
import { showAdmin } from '@/app/admin/utils'
import { IconAccount, IconDesktop } from '@americanexpress/dls-icons'
import { useNavigation, useUserAvatar } from '@/hooks'

export default function UserIcon() {
    const router = useNavigation()
    const user: User | undefined = useUserContext()
    const { email, fullName } = user?.attributes || {}
    const { jobTitle } = user?.userInfo || {}
    const isAdminEnabled = showAdmin(user?.groups || [])
    const { avatarUrl, isLoading } = useUserAvatar(email ?? '')

    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <IconButton
                    borderRadius='50%'
                    variant='ghost'
                    display={{ base: 'none', md: 'flex' }}
                    mr={2}
                    _focus={{
                        outline: 'none',
                        boxShadow: 'none'
                    }}
                >
                    <Avatar.Root>
                        <Avatar.Fallback name={fullName} />
                        {!isLoading && avatarUrl && (
                            <Avatar.Image src={avatarUrl} alt={email} />
                        )}
                    </Avatar.Root>
                </IconButton>
            </Menu.Trigger>
            <Menu.Positioner>
                <Menu.Content style={{ minWidth: '180px' }}>
                    <Menu.Item
                        value=''
                        style={{
                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                        }}
                        _hover={{ bg: 'bg.panel', cursor: 'default' }}
                    >
                        <IconAccount
                            color='neutral'
                            style={{ marginRight: '10px' }}
                        />
                        <Box>
                            <Text color='fg'>{fullName}</Text>
                            <Text textStyle='xs' color='fg.muted'>
                                {jobTitle}
                            </Text>
                        </Box>
                    </Menu.Item>
                    {isAdminEnabled && (
                        <Menu.Item
                            value='admin'
                            onClick={() => router.push('/admin')}
                            _hover={{ cursor: 'pointer' }}
                        >
                            <IconDesktop
                                color='neutral'
                                style={{ marginRight: '10px' }}
                            />
                            <Text color='fg'>Admin</Text>
                        </Menu.Item>
                    )}
                    {isAdminEnabled && (
                        <Menu.Item
                            value='feature-management'
                            onClick={() =>
                                router.push('/admin/feature-management')
                            }
                            _hover={{ cursor: 'pointer' }}
                        >
                            <IconDesktop
                                color='neutral'
                                style={{ marginRight: '10px' }}
                            />
                            <Text color='fg'>Feature Management</Text>
                        </Menu.Item>
                    )}
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
    )
}
