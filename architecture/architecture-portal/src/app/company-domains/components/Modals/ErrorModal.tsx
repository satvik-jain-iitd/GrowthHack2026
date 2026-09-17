/* eslint-disable react/no-danger */
/* istanbul ignore file */

import React from 'react'
import { Dialog, Button, Center } from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'

interface ErrorModalProps {
    isOpen: boolean
    errorMessage: string
    onClose: () => void
    modalTitle?: string
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
    isOpen,
    errorMessage,
    onClose,
    modalTitle = 'Error'
}) => {
    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={e => !e.open && onClose()}
            placement='center'
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content
                    className={styles.errorModal}
                    style={{ width: '40%', maxWidth: '600px' }}
                >
                    <Dialog.Header className={styles.appDialogHeader}>
                        {modalTitle}
                    </Dialog.Header>
                    <Dialog.Body>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: errorMessage.replace(
                                    /person\/s/gi,
                                    "person's"
                                )
                            }}
                        />
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Center>
                            <Button colorPalette='blue' onClick={onClose}>
                                Close
                            </Button>
                        </Center>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
