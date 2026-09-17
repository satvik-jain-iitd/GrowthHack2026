/* istanbul ignore file */
import { Dialog, Center, Button } from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { IconSuccess } from '@americanexpress/dls-icons'
import { DOMAIN_TEST_IDS } from '@/app/company-domains/test-ids'

interface ConfirmationSubmitModalProps {
    isOpen: boolean
    closeDialog: () => void
    handleChanges: () => void
    reviewSubmit?: boolean
    isChangesAdded?: boolean
    closeConfirmation?: () => void
    isEndpointRejected?: boolean
    setOpenReviewConfirmation?: () => void
    isApiAddConfirmation?: boolean
}

export const ConfirmationSubmitModal: React.FC<
    ConfirmationSubmitModalProps
> = ({
    isOpen,
    closeDialog,
    handleChanges,
    reviewSubmit = false,
    isChangesAdded = false,
    closeConfirmation,
    isEndpointRejected = false,
    setOpenReviewConfirmation,
    isApiAddConfirmation = false
}) => {
    return (
        <Dialog.Root open={isOpen} placement='center'>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                {reviewSubmit && !isEndpointRejected ? (
                    <Dialog.Content>
                        <Center margin={'20px 0px'} fontSize={'3rem'}>
                            <IconSuccess color='success' size='xl' />
                        </Center>
                        <Dialog.Header>
                            <Center
                                style={{ fontSize: '23px', fontWeight: '500' }}
                                w={'100%'}
                                data-testid={DOMAIN_TEST_IDS.modalSuccessHeader}
                            >
                                {isChangesAdded
                                    ? 'No changes found'
                                    : 'Successfully Submitted!!'}
                            </Center>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Center
                                fontSize={'17px'}
                                w={'100%'}
                                data-testid={DOMAIN_TEST_IDS.modalSuccessBody}
                            >
                                {isChangesAdded
                                    ? 'Everything is already up to date'
                                    : isApiAddConfirmation
                                      ? 'Operation has been registered and will appear in the list of operations'
                                      : 'Operation has been submitted for review.'}
                            </Center>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Center w={'100%'}>
                                <Button
                                    colorPalette={'blue'}
                                    onClick={
                                        isChangesAdded
                                            ? closeConfirmation
                                            : closeDialog
                                    }
                                    color={'#fff'}
                                    className={styles.Approve}
                                >
                                    Close
                                </Button>
                            </Center>
                        </Dialog.Footer>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                        <Dialog.Header
                            className={styles.appDialogHeader}
                            _dark={{
                                backgroundColor: '#111111 !important',
                                color: 'white'
                            }}
                            data-testid={
                                DOMAIN_TEST_IDS.modalConfirmationHeader
                            }
                        >
                            Confirmation
                        </Dialog.Header>
                        <Button
                            variant='ghost'
                            position='absolute'
                            top={4}
                            right={4}
                            aria-label='Close'
                            onClick={() =>
                                isEndpointRejected
                                    ? setOpenReviewConfirmation &&
                                      setOpenReviewConfirmation()
                                    : closeDialog()
                            }
                            className={styles.modalCloseButton}
                        >
                            ×
                        </Button>
                        <Dialog.Body>
                            {reviewSubmit ? (
                                <>
                                    <strong
                                        data-testid={
                                            DOMAIN_TEST_IDS.modalStartApprovalConfirmation
                                        }
                                    >
                                        Are you sure you want to start the
                                        approval process?
                                    </strong>
                                    <p
                                        data-testid={
                                            DOMAIN_TEST_IDS.modalStartApprovalDescription
                                        }
                                    >
                                        This will move the operation from the
                                        draft state and start the approval
                                        process.
                                    </p>
                                </>
                            ) : (
                                'Would you like to discard these changes?'
                            )}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                colorPalette='red'
                                mr={3}
                                onClick={
                                    reviewSubmit
                                        ? setOpenReviewConfirmation
                                        : closeDialog
                                }
                                className={styles.closeButton}
                            >
                                Cancel
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: '#006fcf',
                                    color: 'white'
                                }}
                                mr={3}
                                p='20px'
                                borderRadius='8px'
                                onClick={() => {
                                    closeDialog()
                                    handleChanges()
                                }}
                            >
                                Yes
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                )}
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
