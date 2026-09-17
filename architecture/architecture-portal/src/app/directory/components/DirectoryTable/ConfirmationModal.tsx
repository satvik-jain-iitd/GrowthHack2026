/* istanbul ignore file */
import React, { useContext } from 'react'
import { Button, Center, Dialog } from '@chakra-ui/react'
import { UserContext } from '@/context/UserContext'
import { IconCancelCircle, IconSuccess } from '@americanexpress/dls-icons'

export const ConfirmationModal = ({
    label,
    isOpen,
    onClose,
    modalClose,
    errorMessage,
    setErrorMessage
}: {
    label: string
    isOpen: boolean
    onClose: () => void
    modalClose: () => void
    errorMessage: string | null
    setErrorMessage: (error: Error | null) => void
}) => {
    const user = useContext(UserContext)

    const handleClose = () => {
        if (!errorMessage && label != 'Updated') {
            user?.setAppUnlinkedCD(true)
        } else if (['Linked', 'Unlinked'].includes(label)) {
            window.location.reload()
        }
        if (!errorMessage && label === 'Updated') {
            user?.setIsAddEditOwnerUpdated(true)
        } else if (errorMessage && label === 'Updated') {
            window.location.reload()
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
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Center w={'100%'}>
                        {errorMessage ? (
                            <IconCancelCircle
                                isFilled={true}
                                title='Example icon'
                                titleId='example-icon-id'
                            />
                        ) : (
                            <IconSuccess
                                color={
                                    label === 'Linked' || label === 'Updated'
                                        ? 'green'
                                        : 'red'
                                }
                                size='md'
                                isFilled={true}
                                title='Example description applied to icon'
                                titleId='unique-id-for-IconSuccess-title'
                            />
                        )}
                    </Center>
                    <Dialog.Header
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        fontSize='20px'
                        fontWeight='600'
                        color={isSuccessMessage ? 'green' : 'red'}
                    >
                        {errorMessage
                            ? errorMessage
                            : (label === 'Linked' || 'Unlinked') &&
                                label !== 'Updated'
                              ? `Successfully ${label}`
                              : 'Domain role(s) have been updated successfully.'}
                    </Dialog.Header>
                    {label !== 'Updated' && !errorMessage && (
                        <Dialog.Body fontSize='15px'>
                            {`The Application has been successfully ${label}`}
                        </Dialog.Body>
                    )}
                    <Dialog.Footer>
                        <Center w={'100%'}>
                            <Button
                                type='button'
                                aria-label='Okay'
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
