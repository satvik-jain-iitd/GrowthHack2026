/* istanbul ignore file */
import { Dialog, Portal, Button, Text } from '@chakra-ui/react'
import styles from '@/app/docs/styles/metadata.module.css'

interface MetadataConfirmationDialogProps {
    isOpen: boolean
    closeDialog: () => void
    title?: string
    message?: string
}

export const MetadataConfirmationDialog = ({
    isOpen,
    closeDialog,
    title = '',
    message = ''
}: MetadataConfirmationDialogProps) => {
    return (
        <Dialog.Root open={isOpen} onExitComplete={closeDialog}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner className={styles.dialogPositioner}>
                    <Dialog.Content>
                        <Dialog.Header>{title || 'Success!'}</Dialog.Header>
                        <Dialog.CloseTrigger />
                        <Dialog.Body>
                            <Text className={styles.popupMessage}>
                                {message ||
                                    'Successfully updated the tags for the page.'}
                            </Text>
                        </Dialog.Body>
                        <Dialog.Footer justifyContent={'flex-start'}>
                            <Button
                                variant='solid'
                                background='#006FCF'
                                onClick={closeDialog}
                            >
                                Close
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
