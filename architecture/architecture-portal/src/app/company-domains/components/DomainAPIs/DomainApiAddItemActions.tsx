import { AvatarGroup, Box, Button, Text } from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { ConfirmationSubmitModal, ErrorModal } from '../Modals'
import { CoEditorInfo } from './CoEditorInfo'
import type { ApiFormType } from '@/app/company-domains/types'

interface DomainApiAddItemActionsProps {
    cancelAdd: () => void
    data: { isrejected?: string; status?: string }
    formValues: ApiFormType
    handleSave: (actionLevel: string, submitContinue?: boolean) => Promise<void>
    isApiEdit: boolean
    isApiFormEnabled: boolean
    isChangesAdded: boolean
    isDraftStatus: boolean
    isEditRowApiId: string
    isFormValid: () => boolean
    isSubmitReviewAction: boolean
    loading: string | boolean
    openCoEditorsModal: {
        coEditorsList: boolean
        addCoEditors: boolean
    }
    openReviewConfirmation: boolean
    reloadData: () => void
    sessionError: string
    setIsChangesAdded: (value: boolean) => void
    setIsSubmitReviewAction: (value: boolean) => void
    setIsValuesChanged: (value: boolean) => void
    setOpenCoEditorsModal: (value: {
        coEditorsList: boolean
        addCoEditors: boolean
    }) => void
    setOpenReviewConfirmation: (value: boolean) => void
    setSessionError: (value: string) => void
}

export const DomainApiAddItemActions = ({
    cancelAdd,
    data,
    formValues,
    handleSave,
    isApiEdit,
    isApiFormEnabled,
    isChangesAdded,
    isDraftStatus,
    isEditRowApiId,
    isFormValid,
    isSubmitReviewAction,
    loading,
    openCoEditorsModal,
    openReviewConfirmation,
    reloadData,
    sessionError,
    setIsChangesAdded,
    setIsSubmitReviewAction,
    setIsValuesChanged,
    setOpenCoEditorsModal,
    setOpenReviewConfirmation,
    setSessionError
}: DomainApiAddItemActionsProps) => {
    return (
        <>
            <div className={styles.apiFormButtons}>
                <Box className={styles.actionsContainer}>
                    <Box className={styles.actionsButtons}>
                        {data?.isrejected === 'true' && isEditRowApiId ? (
                            <Button
                                onClick={() => {
                                    if (!isFormValid()) {
                                        return
                                    }
                                    setIsSubmitReviewAction(true)
                                    setOpenReviewConfirmation(true)
                                }}
                                backgroundColor={'#006fcf'}
                                color={'white'}
                                className={styles.submitButton}
                                size={'sm'}
                            >
                                Submit for review
                            </Button>
                        ) : !isApiEdit && data?.status && !isDraftStatus ? (
                            ''
                        ) : (
                            <Button
                                onClick={() => handleSave('SUBMIT')}
                                backgroundColor={'#006fcf'}
                                color={'#fff'}
                                loading={loading == 'SUBMIT_ADD'}
                                loadingText={
                                    isApiFormEnabled
                                        ? 'Submit'
                                        : 'Propose Operation'
                                }
                            >
                                {isApiFormEnabled
                                    ? 'Submit'
                                    : 'Propose Operation'}
                            </Button>
                        )}
                        {!isApiEdit && (
                            <Button
                                onClick={() =>
                                    handleSave(
                                        isApiFormEnabled ? 'SUBMIT' : 'SAVE',
                                        true
                                    )
                                }
                                loading={loading == 'SUBMIT'}
                                loadingText={
                                    isApiFormEnabled
                                        ? 'Submit and Add Operation'
                                        : 'Save'
                                }
                                backgroundColor={'white'}
                                color={'#006fcf'}
                                className={styles.AddEndpointButton}
                            >
                                {isApiFormEnabled
                                    ? 'Submit and Add Operation'
                                    : 'Save'}
                            </Button>
                        )}
                        <Button
                            onClick={() => {
                                setIsChangesAdded(false)
                                cancelAdd()
                            }}
                            backgroundColor={'white'}
                            className={styles.cancelButton}
                            color={'#006fcf'}
                            size={'sm'}
                        >
                            Cancel
                        </Button>
                    </Box>
                    <Box className={styles.actionsButtons}>
                        <Text
                            onClick={() =>
                                setOpenCoEditorsModal({
                                    ...openCoEditorsModal,
                                    coEditorsList: true
                                })
                            }
                        >
                            {Array.isArray(formValues.apiCoeditors) &&
                                formValues.apiCoeditors.length > 0 && (
                                    <AvatarGroup>
                                        {formValues.apiCoeditors.map(email => (
                                            <CoEditorInfo
                                                key={email}
                                                email={email}
                                            />
                                        ))}
                                    </AvatarGroup>
                                )}
                        </Text>
                    </Box>
                </Box>
            </div>
            <ConfirmationSubmitModal
                isOpen={openReviewConfirmation}
                closeDialog={() => {
                    setOpenReviewConfirmation(false)
                    cancelAdd()
                    reloadData()
                    setIsValuesChanged(false)
                    setIsSubmitReviewAction(false)
                }}
                handleChanges={() => handleSave('SUBMIT')}
                reviewSubmit={true}
                isEndpointRejected={isSubmitReviewAction}
                isChangesAdded={isChangesAdded}
                setOpenReviewConfirmation={() => {
                    setOpenReviewConfirmation(false)
                    setIsSubmitReviewAction(false)
                }}
                closeConfirmation={() => {
                    setIsChangesAdded(false)
                    setOpenReviewConfirmation(false)
                    cancelAdd()
                }}
            />
            <ErrorModal
                isOpen={sessionError.length != 0}
                errorMessage={sessionError}
                onClose={() => setSessionError('')}
            />
        </>
    )
}
