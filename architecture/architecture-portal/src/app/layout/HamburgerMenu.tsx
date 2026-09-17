/* istanbul ignore file */
'use client'
import { IconMenu } from '@americanexpress/dls-icons'
import NavBarTabs from '@/app/layout/NavBarTabs'
import { IconButton, Drawer } from '@chakra-ui/react'

export default function HamburgerMenu() {
    return (
        <Drawer.Root placement='start'>
            <Drawer.Trigger asChild>
                <IconButton
                    display={{
                        base: 'inline-flex',
                        lg: 'none'
                    }}
                    variant='ghost'
                    borderRadius='50%'
                    mr={2}
                >
                    <IconMenu />
                </IconButton>
            </Drawer.Trigger>
            <Drawer.Backdrop />
            <Drawer.Positioner>
                <Drawer.Content>
                    <Drawer.CloseTrigger />
                    <Drawer.Header>
                        <Drawer.Title>Menu</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                        <NavBarTabs
                            css={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start'
                            }}
                        />
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Positioner>
        </Drawer.Root>
    )
}
