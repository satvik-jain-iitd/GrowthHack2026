/* istanbul ignore file */
import React from 'react'
import { Button, CloseButton, Dialog } from '@chakra-ui/react'

type Props = {
    title: string
    content: string | React.ReactNode
    onConfirm?: () => void
    onClose: () => void
}

export default function AppDialog({
    title,
    content,
    onConfirm,
    onClose
}: Props) {
    return (
        <Dialog.Root
            open
            lazyMount
            onOpenChange={open => {
                if (!open) onClose()
            }}
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size='sm' onClick={onClose} />
                    </Dialog.CloseTrigger>
                    <Dialog.Header>
                        <Dialog.Title color='fg'>{title}</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body color='fg.muted'>
                        {typeof content === 'string' ? (
                            <span
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        ) : (
                            content
                        )}
                    </Dialog.Body>
                    <Dialog.Footer>
                        {onConfirm ? (
                            <>
                                <Button
                                    size='sm'
                                    height='7'
                                    variant='solid'
                                    colorPalette='blue'
                                    onClick={onConfirm}
                                    fontSize={11}
                                >
                                    YES
                                </Button>
                                <Button
                                    size='sm'
                                    height='7'
                                    variant='outline'
                                    colorPalette='blue'
                                    onClick={onClose}
                                    _hover={{ bg: 'bg.muted' }}
                                    fontSize={11}
                                >
                                    NO
                                </Button>
                            </>
                        ) : (
                            <Button
                                size='sm'
                                height='7'
                                variant='solid'
                                colorPalette='blue'
                                onClick={onClose}
                                fontSize={11}
                            >
                                OK
                            </Button>
                        )}
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
