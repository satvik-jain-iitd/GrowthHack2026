/* istanbul ignore file */
import {
    Dialog,
    Textarea,
    Button,
    Text,
    HStack,
    CloseButton,
    Center
} from '@chakra-ui/react'
import { useState } from 'react'
import { IconSuccess } from '@americanexpress/dls-icons'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { useApiUpdateStatus } from '@/app/company-domains/hooks'
import {
    REVIEW_LABELS,
    APPROVAL_MESSAGES,
    formatDelegateName
} from '@/app/company-domains/constants'
import { ErrorModal } from './ErrorModal'
import { Reviewer } from '@/app/company-domains/types'

interface ApiEndpointConfirmationModalProps {
    isApprove: boolean
    reloadData: () => void
    reviewLabel: string
    domainId: string
    api_endpoint_metadata_id?: string
    api_metadata_id: string
    isOpen: boolean
    closeDialog: () => void
    reviewers?: Reviewer | undefined
}

const getDialogTitleMessage = (
    isApprove: boolean,
    reviewLabel: string
): string => {
    if (isApprove) {
        switch (reviewLabel) {
            case REVIEW_LABELS.ENGINEER_REVIEW:
                return 'Engineer Review Approval'
            case REVIEW_LABELS.ARCHITECT_REVIEW:
                return 'Architect Review Approval'
            case REVIEW_LABELS.EARB_REVIEW:
                return 'E-ARB Review Approval'
            default:
                return 'Approve Proposed Operation'
        }
    } else {
        return 'Reject Proposed Operation'
    }
}

const getDialogBodyMessage = (
    isApprove: boolean,
    reviewLabel: string
): string => {
    if (isApprove) {
        switch (reviewLabel) {
            case REVIEW_LABELS.ENGINEER_REVIEW:
                return APPROVAL_MESSAGES.ENGINEER_REVIEW
            case REVIEW_LABELS.ARCHITECT_REVIEW:
                return APPROVAL_MESSAGES.ARCHITECT_REVIEW
            case REVIEW_LABELS.EARB_REVIEW:
                return APPROVAL_MESSAGES.EARB_REVIEW
            default:
                return 'You are providing your approval. Do you want to proceed?'
        }
    } else {
        return 'Rejecting this request will move this operation to "Rejected" state. Please provide a justification.'
    }
}

export const ApiEndpointConfirmationModal: React.FC<
    ApiEndpointConfirmationModalProps
> = ({
    isApprove,
    reloadData,
    reviewLabel,
    domainId,
    api_endpoint_metadata_id,
    api_metadata_id,
    isOpen,
    closeDialog,
    reviewers
}) => {
    const [comment, setComment] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [sessionError, setSessionError] = useState('')
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const { mutate, reset } = useApiUpdateStatus()

    const delegateTypes = [
        { value: 'HEAD_ENGINEER_DELEGATE', label: 'Head Engineer Delegate' },
        {
            value: 'PRINCIPAL_ARCHITECT_DELEGATE',
            label: 'Principal Architect Delegate'
        },
        { value: 'EARB_DELEGATE', label: 'Earb Delegate' }
    ]
    const delegateLabel = delegateTypes.find(
        type => type.value === reviewers?.delegateType
    )?.label

    const reviewerMails =
        reviewers?.isArchReviewer &&
        reviewers?.delegateType === 'PRINCIPAL_ARCHITECT_DELEGATE'
            ? reviewers?.principalArchitect
            : reviewers?.isEnggReviewer &&
                reviewers?.delegateType === 'HEAD_ENGINEER_DELEGATE'
              ? reviewers?.headEngineer
              : reviewers?.isEArbReviewer &&
                  reviewers?.delegateType === 'EARB_DELEGATE' &&
                  !reviewers?.isEnggReviewer &&
                  !reviewers?.isArchReviewer
                ? reviewers?.earbReviewers
                : []

    const reviewerMailsArray = Array.isArray(reviewerMails)
        ? reviewerMails
        : reviewerMails
          ? [reviewerMails]
          : []

    const formattedReviewerMails = reviewerMailsArray.map(item =>
        formatDelegateName(item)
    )
    const formattedReviewerMailsText = formattedReviewerMails.join(', ')

    const delegateMessage = reviewers?.delegateType
        ? `${isApprove ? 'Approving' : 'Rejecting'} on behalf of the ${formattedReviewerMailsText} (${(delegateLabel || reviewers.delegateType).replace(' Delegate', '') === 'Earb' ? 'EARB' : (delegateLabel || reviewers.delegateType).replace(' Delegate', '')}).`
        : ''

    const isDelegate = reviewers?.delegateType !== undefined
    const prePopulatedMessage = isDelegate ? delegateMessage : ''
    const approvalTitle = getDialogTitleMessage(isApprove, reviewLabel)
    const approvalMessage = getDialogBodyMessage(isApprove, reviewLabel)
    const commentError =
        comment.length > 1000
            ? 'Exceeds the maximum length of 1000 characters.'
            : null
    const displayError = commentError || error

    const handleDialogClose = () => {
        setComment('')
        setError(null)
        setShowSuccessMessage(false)
        reset()
        closeDialog()
    }

    const handleSuccessClose = () => {
        handleDialogClose()
    }

    const handleConfirm = async () => {
        // Validate the comment length
        if (commentError) {
            return
        }

        try {
            mutate(
                {
                    api_metadata_id,
                    domainId,
                    api_endpoint_metadata_id: api_endpoint_metadata_id!,
                    reviewLabel,
                    isApprove,
                    comment: `${prePopulatedMessage} ${comment}`
                },
                {
                    onSuccess: () => {
                        setError(null)
                        reloadData()
                        setShowSuccessMessage(true)
                    },
                    onError: () => {
                        setError(
                            'An error occurred while updating the status. Please try again / refresh the page.'
                        )
                        setSessionError('Session expired. Please log in again.')
                    }
                }
            )
        } catch (error) {
            console.error('Error posting status:', error)
        }
    }

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value

        setComment(newValue)
        if (error) {
            setError(null)
        }
    }
    return (
        <>
            <ErrorModal
                isOpen={sessionError?.length != 0}
                errorMessage={sessionError}
                onClose={() => setSessionError('')}
            />
            <Dialog.Root
                open={isOpen}
                onOpenChange={isOpen => {
                    if (!isOpen) handleDialogClose()
                }}
                placement='center'
            >
                <Dialog.Trigger />
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content className={styles.confirmationContent}>
                        {showSuccessMessage && (
                            <Center
                                margin={'20px 0px 0px 0px'}
                                fontSize={'3rem'}
                            >
                                <IconSuccess color='success' size='xl' />
                            </Center>
                        )}
                        <Dialog.Header
                            className={styles.appDialogHeader}
                            _dark={{
                                backgroundColor: '#111111 !important',
                                color: 'white'
                            }}
                            justifyContent={
                                showSuccessMessage ? 'center' : 'flex-start'
                            }
                            textAlign={showSuccessMessage ? 'center' : 'left'}
                        >
                            {showSuccessMessage
                                ? isApprove
                                    ? 'Approved Successfully'
                                    : 'Rejected Successfully'
                                : approvalTitle}
                        </Dialog.Header>
                        {!showSuccessMessage && (
                            <Dialog.CloseTrigger asChild>
                                <CloseButton onClick={handleDialogClose} />
                            </Dialog.CloseTrigger>
                        )}
                        <Dialog.Body>
                            {showSuccessMessage ? (
                                <Text
                                    className={styles.textConfirmation}
                                    textAlign='center'
                                >
                                    {isApprove
                                        ? 'The operation has been approved successfully.'
                                        : 'The operation has been rejected successfully.'}
                                </Text>
                            ) : (
                                <>
                                    <Text className={styles.textConfirmation}>
                                        {isApprove
                                            ? approvalMessage
                                            : 'Rejecting this request will move this operation to "Rejected" state. Please provide a justification.'}
                                    </Text>
                                    {(formattedReviewerMails || [])?.length >
                                        0 && (
                                        <Textarea
                                            placeholder={
                                                isApprove
                                                    ? 'Approval comment'
                                                    : 'Justification for rejection'
                                            }
                                            value={prePopulatedMessage}
                                            required={!isApprove}
                                            readOnly={true}
                                            variant='subtle'
                                            resize='none'
                                            maxH='2lh'
                                        />
                                    )}
                                    <Textarea
                                        placeholder={
                                            isApprove
                                                ? 'Approval comment'
                                                : 'Justification for rejection'
                                        }
                                        value={comment}
                                        onChange={handleCommentChange}
                                        required={!isApprove}
                                        variant='subtle'
                                        border='none'
                                        boxShadow='none'
                                        _hover={{ border: 'none' }}
                                        _focus={{
                                            border: 'none',
                                            boxShadow: 'none'
                                        }}
                                        _focusVisible={{
                                            border: 'none',
                                            boxShadow: 'none'
                                        }}
                                        _invalid={{
                                            border: 'none',
                                            boxShadow: 'none'
                                        }}
                                    />
                                    <HStack
                                        justifyContent='space-between'
                                        alignItems='center'
                                        w='100%'
                                        mt={1}
                                        gap={2}
                                    >
                                        <Text
                                            color='red.500'
                                            flex='1'
                                            lineHeight='1.2'
                                        >
                                            {displayError ?? ''}
                                        </Text>
                                        <Text
                                            className={styles.commentLength}
                                            color={
                                                commentError
                                                    ? 'red.500'
                                                    : undefined
                                            }
                                            lineHeight='1.2'
                                            whiteSpace='nowrap'
                                        >
                                            {comment?.length}/1000
                                        </Text>
                                    </HStack>
                                </>
                            )}
                        </Dialog.Body>
                        <Dialog.Footer justifyContent={'flex-start'}>
                            {showSuccessMessage ? (
                                <Center w={'100%'}>
                                    <Button
                                        colorPalette='blue'
                                        onClick={handleSuccessClose}
                                    >
                                        OK
                                    </Button>
                                </Center>
                            ) : (
                                <HStack gap={4}>
                                    <Button
                                        bg={isApprove ? '#008746' : '#B42C01'}
                                        color={'white'}
                                        _hover={{
                                            bg: isApprove
                                                ? '#006837'
                                                : '#9E2A01'
                                        }}
                                        padding='10px'
                                        borderRadius='8px'
                                        onClick={handleConfirm}
                                        disabled={
                                            (!isApprove && !comment.trim()) ||
                                            !!commentError
                                        }
                                    >
                                        {isApprove
                                            ? 'Yes, Approve'
                                            : 'Yes, Reject'}
                                    </Button>
                                    <Button
                                        variant='outline'
                                        colorScheme='blue'
                                        onClick={handleDialogClose}
                                        className={styles.closeButton}
                                    >
                                        No, Cancel
                                    </Button>
                                </HStack>
                            )}
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    )
}
