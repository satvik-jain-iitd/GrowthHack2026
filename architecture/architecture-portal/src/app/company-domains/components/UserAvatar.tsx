import React from 'react'
import { Avatar, Badge, Float } from '@chakra-ui/react'
import { IconAccount } from '@americanexpress/dls-icons'
import { useUserAvatar } from '@/hooks'

export const UserAvatar = ({
    email,
    name
}: {
    email?: string
    name?: string
}) => {
    const { avatarUrl, isLoading } = useUserAvatar(email ?? '')
    if (email === null || email === undefined) {
        return (
            <Avatar.Root size='sm'>
                <Avatar.Fallback name={name} />
            </Avatar.Root>
        )
    } else {
        return !((name ?? '').split(',')?.length > 1) ? (
            <Avatar.Root size='sm'>
                <Avatar.Fallback name={name} />
                {!isLoading && avatarUrl && (
                    <Avatar.Image src={avatarUrl} alt={email} />
                )}
            </Avatar.Root>
        ) : (
            <Avatar.Root size='sm' style={{ background: '#bdbdbd' }}>
                <Avatar.Fallback>
                    <IconAccount style={{ color: 'white' }} />
                </Avatar.Fallback>
                <Float placement='bottom-end' offsetX='1' offsetY='1'>
                    <Badge
                        style={{
                            height: '20px',
                            width: '20px',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                        variant='solid'
                        colorPalette='blue'
                    >
                        {name?.split(',')?.length}
                    </Badge>
                </Float>
            </Avatar.Root>
        )
    }
}
