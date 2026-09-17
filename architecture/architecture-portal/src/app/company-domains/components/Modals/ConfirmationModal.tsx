/* istanbul ignore file */
import { Dialog, Center, Button, Textarea, Box, Text } from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { IconSuccess } from '@americanexpress/dls-icons'
import { useState } from 'react'
import { ApiMetadata, ApiEndpoint } from '@/app/company-domains/types'
import {
    useDeleteApiData,
    useRestoreApiData,
    useRevertApiData
} from '../../hooks'

interface ConfirmationModalProps {
    isOpen: boolean
    closeDialog: () => void
    data?: ApiMetadata | ApiEndpoint
    isApiData?: boolean
    isRevert?: boolean
    reloadData?: () => void
    status?: string
    domainId: string
    api_metadata_id?: string
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    closeDialog,
    data,
    isApiData,
    isRevert,
    status,
    reloadData = () => {},
    domainId,
    api_metadata_id = ''
}) => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [comment, setComment] = useState('')
    const [error, setError] = useState('')
    const deleteMutation = useDeleteApiData()
    const revertMutation = useRevertApiData()
    const restoreMutation = useRestoreApiData()

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setComment(newValue)
        setError('')
    }

    const handleClick = async () => {
        if (comment.length > 1000) {
            setError('Maximum 1000 characters allowed.')
        }

        const metadataID = isApiData
            ? data?.api_metadata_id
            : data?.api_endpoint_metadata_id

        const requestBody = {
            comment: comment
        }

        try {
            const response = isRevert
                ? await revertMutation.mutateAsync({
                      domainID: domainId,
                      apiID: api_metadata_id,
                      operationID: data?.api_endpoint_metadata_id || '',
                      requestBody: {
                          comment: comment || '',
                          api_endpoint_metadata_id:
                              data?.api_endpoint_metadata_id || '',
                          pageLink: window.location.href
                      }
                  })
                : status === 'DELETE'
                  ? await deleteMutation.mutateAsync({
                        domainID: domainId,
                        apiID: api_metadata_id,
                        metadataID: metadataID || '',
                        isApiData: isApiData || false,
                        requestBody
                    })
                  : await restoreMutation.mutateAsync({
                        domainID: domainId,
                        apiID: api_metadata_id,
                        metadataID: metadataID || '',
                        isApiData: isApiData || false,
                        requestBody
                    })
            if (response?.ok) {
                reloadData()
                setShowSuccessMessage(true)
                setError('')
            } else {
                response.json().then(data => setError(data?.message))
            }
        } catch (error) {
            console.error('Error posting status:', error)
        }
    }

    return (
        <Dialog.Root open={isOpen} placement='center'>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    {showSuccessMessage && (
                        <Center margin={'20px 0px 0px 0px'} fontSize={'3rem'}>
                            <IconSuccess color='success' size='xl' />
                        </Center>
                    )}
                    <Dialog.Header>
                        <Box
                            style={{ fontSize: '20px', fontWeight: '500' }}
                            w={'100%'}
                            color={'black'}
                            _dark={{ color: 'white' }}
                            ml={showSuccessMessage ? '30%' : '0px'}
                            lineHeight={'30px'}
                        >
                            {showSuccessMessage
                                ? isRevert
                                    ? 'Reverted Successfully'
                                    : status === 'DELETE'
                                      ? 'Deleted Successfully'
                                      : 'Restored Successfully'
                                : isRevert
                                  ? 'Are you sure you want to revert this operation to draft state?'
                                  : `Are you sure you want to ${status?.toLowerCase()} this item?`}
                        </Box>
                    </Dialog.Header>
                    {!showSuccessMessage && (
                        <Dialog.Body>
                            <Box
                                w={'100%'}
                                color={'black'}
                                _dark={{ color: 'white' }}
                            >
                                <Textarea
                                    placeholder={
                                        isRevert
                                            ? 'Reason for Revert'
                                            : status === 'DELETE'
                                              ? 'Reason for Deletion'
                                              : 'Reason for Restore'
                                    }
                                    value={comment}
                                    required={true}
                                    color={'black'}
                                    onChange={handleCommentChange}
                                    _dark={{ color: 'white' }}
                                />
                                <Text
                                    className={`${styles.commentLength} ${
                                        comment.length > 1000
                                            ? styles.error
                                            : ''
                                    }`}
                                    float={'right'}
                                >
                                    {comment?.length}/1000
                                </Text>
                                {error && (
                                    <Text color='red.500' mt={2}>
                                        {error}
                                    </Text>
                                )}
                            </Box>
                        </Dialog.Body>
                    )}
                    {showSuccessMessage && status === 'DELETE' && (
                        <Dialog.Body>
                            <p>
                                Deleted item is hidden from the table, so please
                                use the Deleted status filter to view it in the
                                list.
                            </p>
                        </Dialog.Body>
                    )}
                    <Dialog.Footer>
                        {showSuccessMessage && (
                            <Center w={'100%'}>
                                <Button
                                    colorPalette={'blue'}
                                    onClick={closeDialog}
                                    color={'#fff'}
                                    className={styles.Approve}
                                >
                                    Close
                                </Button>
                            </Center>
                        )}
                        {!showSuccessMessage && (
                            <>
                                <Button
                                    variant='outline'
                                    colorScheme='blue'
                                    onClick={closeDialog}
                                    className={styles.closeButton}
                                >
                                    No, Cancel
                                </Button>
                                <Button
                                    style={{
                                        backgroundColor:
                                            isRevert || status === 'RESTORE'
                                                ? '#006fcf'
                                                : '#B42C01',
                                        color: 'white'
                                    }}
                                    mr={3}
                                    p='20px'
                                    borderRadius='8px'
                                    disabled={!comment}
                                    onClick={handleClick}
                                >
                                    {isRevert
                                        ? 'Confirm'
                                        : status === 'RESTORE'
                                          ? 'Yes, Restore'
                                          : 'Yes, Delete'}
                                </Button>
                            </>
                        )}
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
