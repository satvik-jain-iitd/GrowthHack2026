/* istanbul ignore file */
import React from 'react'
import { Popover, Box, IconButton, Stack, Text } from '@chakra-ui/react'
import { AvatarTableRow } from './AvatarTableRow'
import { IconClose } from '@americanexpress/dls-icons'

interface AvatarShowMoreProps {
    users: string[]
}

const AVATAR_ROW_WIDTH = 180

export const AvatarShowMore: React.FC<AvatarShowMoreProps> = ({ users }) => {
    return (
        <>
            <Popover.Root autoFocus={false}>
                <Popover.Trigger asChild>
                    <Text
                        as='span'
                        color='#006fcf'
                        _hover={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            color: '#33a0ff'
                        }}
                    >
                        show more...
                    </Text>
                </Popover.Trigger>
                <Popover.Positioner>
                    <Popover.Content minW={`${AVATAR_ROW_WIDTH}px`} p={2}>
                        <Box display='flex' justifyContent='flex-end'>
                            <Popover.CloseTrigger asChild>
                                <IconButton
                                    aria-label='Close'
                                    size='sm'
                                    variant='ghost'
                                    borderRadius='50%'
                                >
                                    <IconClose />
                                </IconButton>
                            </Popover.CloseTrigger>
                        </Box>
                        <Stack minW={`${AVATAR_ROW_WIDTH}px`}>
                            {users.map(owner => (
                                <AvatarTableRow
                                    key={owner}
                                    email={owner}
                                    stacked
                                />
                            ))}
                        </Stack>
                    </Popover.Content>
                </Popover.Positioner>
            </Popover.Root>
        </>
    )
}
