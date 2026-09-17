/* istanbul ignore file */
import React from 'react'
import { Box, Button, Text } from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { IconTime } from '@americanexpress/dls-icons'
import { ApiEndpoint, ApiMetadata, Reviewer } from '@/app/company-domains/types'

interface OperationalDataActionsProps {
    reviewers: Reviewer | undefined
    setIsEditRow: (
        id: string,
        data: ApiMetadata & ApiEndpoint,
        name: string
    ) => void
    showEditAction: boolean
    api_nm: string
    api_metadata_id: string
    api_endpoint_metadata_id: string
    tableData: ApiMetadata
    allowedUsers?: boolean
    isRestoreVisible?: boolean
    isDeleteVisible?: boolean
    handleClick?: (value: string) => void
    isDeletedApi?: boolean
    isDeletedApiOperation?: boolean
    handleDialog: (value: string) => void
    setShowRevert: (value: boolean) => void
    handleShowHistory: () => void
}

const OperationalDataActions: React.FC<OperationalDataActionsProps> = ({
    reviewers,
    setIsEditRow,
    showEditAction,
    api_nm,
    api_metadata_id,
    api_endpoint_metadata_id,
    tableData,
    allowedUsers,
    isRestoreVisible,
    isDeleteVisible,
    handleClick = () => {},
    isDeletedApi,
    isDeletedApiOperation,
    handleDialog,
    setShowRevert,
    handleShowHistory
}) => {
    const data =
        tableData?.api_endpoint.find(
            (endpoint: ApiEndpoint) =>
                endpoint.api_endpoint_metadata_id === api_endpoint_metadata_id
        ) ?? ({} as ApiMetadata & ApiEndpoint)

    let reviewerLabel = null

    const darbEngApproved = data?.darb_eng === 'APPROVED'
    const darbArchApproved = data?.darb_arch === 'APPROVED'

    if (!darbEngApproved || !darbArchApproved) {
        reviewerLabel = { text: 'ARB' }
    } else if (
        darbEngApproved &&
        darbArchApproved &&
        data?.earb !== 'APPROVED'
    ) {
        reviewerLabel = { text: 'EARB' }
    }

    const isRevertVisible =
        data?.status?.toLowerCase() === 'proposed' &&
        allowedUsers &&
        data?.darb_eng?.toLowerCase() != 'approved' &&
        data?.darb_arch?.toLowerCase() != 'approved'

    return (
        <Box ml={5} className={styles.showButton}>
            <Box display='flex' gap='16px'>
                {(data?.proposed &&
                    reviewers?.isEnggReviewer &&
                    !reviewers?.isArchReviewer &&
                    !data?.darb_eng) ||
                (data?.proposed &&
                    reviewers?.isArchReviewer &&
                    !reviewers?.isEnggReviewer &&
                    !data?.darb_arch) ||
                (reviewers?.isEArbReviewer &&
                    !reviewers?.isEnggReviewer &&
                    !reviewers?.isArchReviewer &&
                    !data?.earb &&
                    data?.darb_arch &&
                    data?.darb_eng) ||
                (data?.darb_eng &&
                    data?.darb_arch &&
                    !data?.earb &&
                    reviewers?.isEArbReviewer) ? (
                    <div>
                        <Button
                            className={styles.Approve}
                            mr={4}
                            size={'sm'}
                            onClick={() => handleDialog('approve')}
                            color={'#fff'}
                            disabled={isDeletedApiOperation}
                        >
                            Approve
                            {reviewerLabel && (
                                <Text as='span' color={'white'}>
                                    {reviewerLabel.text}
                                </Text>
                            )}
                        </Button>
                        <Button
                            className={styles.reject}
                            mr={4}
                            size={'sm'}
                            onClick={() => handleDialog('reject')}
                            disabled={isDeletedApiOperation}
                        >
                            Reject
                            {reviewerLabel && (
                                <Text as='span' color='#006FCF'>
                                    {reviewerLabel.text}
                                </Text>
                            )}
                        </Button>
                    </div>
                ) : (
                    <> </>
                )}
                {showEditAction && (
                    <div>
                        <Button
                            className={styles.reject}
                            size={'sm'}
                            border='2px solid blue'
                            onClick={() => {
                                setIsEditRow(
                                    api_metadata_id,
                                    {
                                        ...data,
                                        apiData: tableData
                                    } as ApiEndpoint & ApiMetadata,
                                    api_nm
                                )
                            }}
                            variant={'plain'}
                            disabled={isDeletedApiOperation || isDeletedApi}
                        >
                            Edit
                        </Button>
                    </div>
                )}
                {((data?.proposed &&
                    !data.earb &&
                    reviewers?.isEnggReviewer &&
                    data?.darb_eng &&
                    !reviewers?.isEArbReviewer) ||
                    (data?.proposed &&
                        !data.earb &&
                        reviewers?.isArchReviewer &&
                        data?.darb_arch &&
                        !reviewers?.isEArbReviewer) ||
                    (reviewers?.isEArbReviewer && data?.earb)) &&
                    !showEditAction && (
                        <Button disabled size={'sm'}>
                            No Actions Available
                        </Button>
                    )}
                {isRevertVisible && (
                    <Button
                        className={styles.Approve}
                        mr={4}
                        size={'sm'}
                        onClick={() => setShowRevert(true)}
                        color={'#fff'}
                        disabled={isDeletedApiOperation}
                    >
                        Revert to Draft
                    </Button>
                )}
                {isDeleteVisible && (
                    <Button
                        backgroundColor={'white'}
                        color={'#ab0303'}
                        border='1px solid #ab0303'
                        size='sm'
                        onClick={() => handleClick('DELETE')}
                    >
                        Delete
                    </Button>
                )}
                {isRestoreVisible && (
                    <Button
                        className={styles.reject}
                        border='1px solid blue'
                        size='sm'
                        onClick={() => handleClick('RESTORE')}
                    >
                        Restore
                    </Button>
                )}
            </Box>
            <Button
                className={styles.apiShowHistory}
                color={'#3182ce'}
                variant='plain'
                onClick={handleShowHistory}
                mr={6}
                size={'sm'}
                fontWeight={600}
                fontSize={'1rem'}
                _hover={{ textDecoration: 'underline' }}
            >
                <IconTime className={styles.showHistoryIcon} />
                Show History
            </Button>
        </Box>
    )
}

export default OperationalDataActions
