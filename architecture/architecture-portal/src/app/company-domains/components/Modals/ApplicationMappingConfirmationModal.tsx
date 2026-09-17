/* istanbul ignore file */
import React from 'react'
import { Button, Center, Dialog } from '@chakra-ui/react'
import { IconCancelCircle, IconSuccess } from '@americanexpress/dls-icons'
import styles from '@/app/company-domains/modals.module.css'
import { useUserContext } from '@/context'

interface ApplicationMappingConfirmationModalProps {
    label: string
    isOpen: boolean
    onClose: () => void
    modalClose: () => void
    errorMessage: string | null
    setErrorMessage: (err: string | null) => void
    onConfirm?: () => Promise<void> | void
}

export const ApplicationMappingConfirmationModal: React.FC<
    ApplicationMappingConfirmationModalProps
> = ({
    label,
    isOpen,
    onClose,
    modalClose,
    errorMessage,
    setErrorMessage,
    onConfirm
}) => {
    const user = useUserContext()
    const handleClose = async () => {
        if (!errorMessage && label !== 'Updated') {
            user?.setAppUnlinkedCD(true)
        } else if (['Linked', 'Unlinked'].includes(label)) {
            window.location.reload()
        } else if (errorMessage && label === 'Updated') {
            window.location.reload()
        }
        try {
            if (onConfirm) {
                await onConfirm()
            }
        } catch (err) {
            console.error('onConfirm handler failed', err)
        }

        modalClose()
        onClose()
        setErrorMessage(null)
    }

    const isSuccessMessage =
        (label === 'Linked' || label === 'Updated') && !errorMessage

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={isOpen => {
                if (!isOpen) handleClose()
            }}
            size='xl'
            placement={'center'}
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content className={styles.modalContent}>
                    <Dialog.Header
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        gap='8px'
                        fontSize='20px'
                        fontWeight='600'
                        color={isSuccessMessage ? 'green' : 'red'}
                        className={
                            isSuccessMessage
                                ? styles.linkedMessage
                                : styles.unlinkedMessage
                        }
                    >
                        {errorMessage ? (
                            <IconCancelCircle
                                className={styles.errorMessage}
                                title='Example icon'
                                titleId='example-icon-id'
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    flexShrink: 0
                                }}
                            />
                        ) : label === 'Linked' || label === 'Updated' ? (
                            <IconSuccess
                                isFilled
                                color='success'
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    flexShrink: 0
                                }}
                            />
                        ) : (
                            <IconSuccess
                                isFilled
                                color='critical'
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    flexShrink: 0
                                }}
                            />
                        )}
                        {errorMessage
                            ? errorMessage
                            : (label === 'Linked' || 'Unlinked') &&
                                label !== 'Updated'
                              ? `Successfully ${label}`
                              : 'Domain role(s) have been updated successfully.'}
                    </Dialog.Header>
                    {label !== 'Updated' && !errorMessage && (
                        <Dialog.Body
                            className={styles.modalBody}
                            fontSize='15px'
                        >
                            {`The Application has been successfully ${label}`}
                        </Dialog.Body>
                    )}
                    <Dialog.Footer>
                        <Center w={'100%'}>
                            <Button
                                colorScheme={isSuccessMessage ? 'green' : 'red'}
                                onClick={handleClose}
                                border='1px solid'
                                borderRadius={10}
                                padding='8px 16px'
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                                color='white'
                                backgroundColor={
                                    isSuccessMessage ? 'green' : 'red'
                                }
                                _hover={{
                                    backgroundColor: isSuccessMessage
                                        ? '#008000'
                                        : '#cc0000'
                                }}
                            >
                                Okay
                            </Button>
                        </Center>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
