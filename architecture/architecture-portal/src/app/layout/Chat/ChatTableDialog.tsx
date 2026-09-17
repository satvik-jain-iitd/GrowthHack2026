'use client'

import { JSX, useState } from 'react'
import { Box, Dialog, HStack, IconButton, Portal } from '@chakra-ui/react'
import { IconExpand, IconCollapse } from '@americanexpress/dls-icons'
import styles from './Chat.module.scss'

export default function ChatTableDialog({
    children
}: {
    children: React.ReactNode
}): JSX.Element {
    const [expanded, setExpanded] = useState(false)

    return (
        <>
            <Box className={styles.tableWrapper} position='relative'>
                <IconButton
                    className={`${styles.mermaidControls} ${styles.mermaidControlsHoverOnly}`}
                    variant='outline'
                    bg={{ base: 'bg.subtle', _hover: 'bg.muted' }}
                    size='xs'
                    boxShadow='md'
                    aria-label='Expand table'
                    title='Expand table'
                    onClick={() => setExpanded(true)}
                >
                    <IconExpand />
                </IconButton>
                <table>{children}</table>
            </Box>

            <Dialog.Root
                open={expanded}
                lazyMount
                unmountOnExit
                onOpenChange={e => setExpanded(e.open)}
            >
                <Portal>
                    <Dialog.Backdrop zIndex={10010} />
                    <Dialog.Positioner zIndex={10010}>
                        <Dialog.Content
                            w='auto'
                            maxW='92vw'
                            maxH='88vh'
                            overflow='auto'
                            padding='1rem'
                        >
                            <HStack justifyContent='flex-end' mb={2}>
                                <IconButton
                                    aria-label='Minimize table'
                                    title='Minimize'
                                    size='xs'
                                    variant='outline'
                                    bg={{
                                        base: 'bg.subtle',
                                        _hover: 'bg.muted'
                                    }}
                                    boxShadow='md'
                                    onClick={() => setExpanded(false)}
                                >
                                    <IconCollapse />
                                </IconButton>
                            </HStack>
                            <Box className={styles.markdownContent}>
                                <table>{children}</table>
                            </Box>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    )
}
