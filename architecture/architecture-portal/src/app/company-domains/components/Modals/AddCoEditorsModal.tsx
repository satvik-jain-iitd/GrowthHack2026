/* istanbul ignore file */
import {
    Button,
    HStack,
    Input,
    Box,
    Center,
    Dialog,
    Table,
    Flex
} from '@chakra-ui/react'
import {
    IconTrash,
    IconEdit,
    IconCheck,
    IconDeclined,
    IconSuccess
} from '@americanexpress/dls-icons'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { useState, useEffect, useCallback } from 'react'
import { useUserInfo } from '@/hooks'
import { UserAvatar } from '../UserAvatar'
import { ConfirmationSubmitModal } from './ConfirmationSubmitModal'
import { useEditCoEditors } from '@/app/company-domains/hooks'
import { Reviewer } from '@/app/company-domains/types'
import {
    isEmailValid,
    validateCoEditorEmails,
    coeditorTableColumns
} from '@/app/utils/utils'

export const AddCoEditorsModal = ({
    isOpen,
    closeDialog,
    coEditorsList,
    reviewers,
    data,
    reloadData,
    setCoEditorsData
}: {
    isOpen: boolean
    closeDialog: () => void
    coEditorsList: string[]
    reviewers: Reviewer | undefined
    data: { api_metadata_id: string }
    reloadData: () => void
    setCoEditorsData: (coEditors: string[]) => void
}) => {
    const [isConfirmationMessage, setIsConfirmationMessage] = useState({
        confirmation: false,
        isChanged: false
    })
    const [coeditorEmails, setCoeditorEmails] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [editEmail, setEditEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [updatedCoEditorsList, setUpdatedCoEditorsList] =
        useState(coEditorsList)
    const [isSaveCoeditorDisabled, setIsSaveCoeditorDisabled] = useState(true)
    const mutation = useEditCoEditors()

    const processInputEmails = (input: string) => {
        const { emails, invalidEmails } = validateCoEditorEmails(
            input,
            data.api_metadata_id
        )
        if (emails.length === 0) return

        const disallowedEmails = [reviewers?.email?.toLowerCase()].filter(
            Boolean
        )
        const filteredCoEditors = updatedCoEditorsList?.filter(
            item => item != editEmail
        )
        const existingEmails =
            filteredCoEditors?.map(e => e.toLowerCase()) ?? []

        const normalizedEmails = [
            ...new Set(emails.map(email => email.toLowerCase().trim()))
        ]
        const validEmails = []
        const duplicates = []
        const disallowed = []

        for (const email of normalizedEmails) {
            if (!isEmailValid(email)) continue
            if (existingEmails.includes(email)) {
                duplicates.push(email)
            } else if (disallowedEmails.includes(email)) {
                disallowed.push(email)
            } else {
                validEmails.push(email)
            }
        }

        if (validEmails.length === 0) {
            let message = ''
            if (invalidEmails.length) {
                message += `Invalid email: ${invalidEmails.join(', ')}. Please enter a valid email.`
            }
            if (duplicates.length) {
                message += `This email has already been added. Please enter a different email.`
            }
            if (
                disallowed.length &&
                disallowed?.includes(reviewers?.email?.toLowerCase() ?? '')
            ) {
                message += `You cannot assign yourself as co-editor.`
            } else if (disallowed.length) {
                message += `Cannot add reviewers / requestor as co-editor.`
            }

            setErrorMessage(message.trim())
            return
        }

        setErrorMessage('')
        setUpdatedCoEditorsList([...filteredCoEditors, ...validEmails])
        setCoeditorEmails('')
        setEditEmail('')
        setIsSaveCoeditorDisabled(false)
    }

    const handlePasteEmails = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedEmail = e.clipboardData.getData('Text')
        if (!pastedEmail) return
        setCoeditorEmails(pastedEmail)
    }

    const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            processInputEmails(coeditorEmails)
        }
        setIsSaveCoeditorDisabled(true)
    }

    const handleRemoveEmail = (index: number) => {
        const updated = [...updatedCoEditorsList]
        updated.splice(index, 1)
        setUpdatedCoEditorsList(updated)
        setErrorMessage('')
        setIsSaveCoeditorDisabled(false)
    }

    const handleEdit = (email: string) => {
        setEditEmail(email)
        setIsSaveCoeditorDisabled(true)
    }

    useEffect(() => {
        if (editEmail) {
            setCoeditorEmails(editEmail)
        }
    }, [editEmail])

    const CoEditorInfo = ({ email }: { email: string }) => {
        const { userInfo } = useUserInfo(email)
        return (
            <Flex
                alignItems='center'
                className={`co-editor-info ${styles.coEditorDetails}`}
            >
                <UserAvatar email={email} name={userInfo?.displayName} />
                <div className={styles.userEmail}>
                    {userInfo?.displayName || email}
                </div>
            </Flex>
        )
    }

    const getCoEditorsRows = useCallback(() => {
        return updatedCoEditorsList?.filter(item => item != editEmail)?.length >
            0 ? (
            updatedCoEditorsList
                ?.filter(item => item != editEmail)
                ?.map((item, index) => (
                    <Table.Row
                        className='tableRow logsModalTableRow'
                        key={index}
                    >
                        {coeditorTableColumns?.map(obj => {
                            if (obj.key === 'edit') {
                                return (
                                    <Table.Cell key={`${obj.key}_${index}`}>
                                        <IconEdit
                                            title='Edit'
                                            titleId='edit-icon-id'
                                            className={
                                                styles.coEditorsCheckIcon
                                            }
                                            onClick={() => handleEdit(item)}
                                        />
                                        <IconTrash
                                            title='Delete'
                                            titleId='trash-icon-id'
                                            className={
                                                styles.coEditorsDeleteIcon
                                            }
                                            style={{
                                                marginLeft: '10px'
                                            }}
                                            onClick={() =>
                                                handleRemoveEmail(index)
                                            }
                                        />
                                    </Table.Cell>
                                )
                            }
                            if (obj.key === 'coEditor') {
                                return (
                                    <Table.Cell key={`${obj.key}_${index}`}>
                                        <CoEditorInfo key={item} email={item} />
                                    </Table.Cell>
                                )
                            }
                            return (
                                <Table.Cell key={`${obj.key}_${index}`}>
                                    {item}
                                </Table.Cell>
                            )
                        })}
                    </Table.Row>
                ))
        ) : (
            <></>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedCoEditorsList])

    const cancelAddingCoeditor = () => {
        setCoeditorEmails('')
        setErrorMessage('')
        setEditEmail('')
        setIsSaveCoeditorDisabled(false)
    }

    const getCoeditorsList = () => {
        return (
            <>
                <Table.Root
                    variant='outline'
                    display='table'
                    id='domain-api-table'
                    stickyHeader
                >
                    <Table.Header top={0}>
                        <Table.Row className='tableRow theadTr'>
                            {coeditorTableColumns.map(column => {
                                return (
                                    <Table.ColumnHeader
                                        className={'history-modal-table-header'}
                                        key={column.key}
                                        title={column.title}
                                    >
                                        <Box textAlign={'left'}>
                                            {column?.name}
                                        </Box>
                                    </Table.ColumnHeader>
                                )
                            })}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row
                            className={`tableRow logsModalTableRow ${styles.coEditorsRow}`}
                        >
                            <Table.Cell colSpan={2}>
                                <Input
                                    placeholder='Add co-editor (e.g. user@aexp.com)'
                                    value={coeditorEmails}
                                    onChange={e => {
                                        const value = e.target.value
                                        setCoeditorEmails(value)
                                        if (!value.trim()) {
                                            setErrorMessage('')
                                        }
                                    }}
                                    onKeyDown={handleEmailKeyDown}
                                    onPaste={handlePasteEmails}
                                />
                                {errorMessage && (
                                    <div className={styles.errorMessage}>
                                        {errorMessage}
                                    </div>
                                )}
                            </Table.Cell>
                            <Table.Cell>
                                <IconCheck
                                    title='Check icon'
                                    titleId='check-icon-id'
                                    className={styles.coEditorsCheckIcon}
                                    onClick={() =>
                                        processInputEmails(coeditorEmails)
                                    }
                                />
                                <IconDeclined
                                    title='Declined icon'
                                    titleId='declined-icon-id'
                                    className={styles.coEditorsDeleteIcon}
                                    style={{
                                        marginLeft: '10px'
                                    }}
                                    onClick={() => cancelAddingCoeditor()}
                                />
                            </Table.Cell>
                        </Table.Row>
                        {getCoEditorsRows()}
                    </Table.Body>
                </Table.Root>
                {!(
                    updatedCoEditorsList?.filter(item => item != editEmail)
                        ?.length > 0
                ) && <Box fontWeight={700}>No Co-Editor(s) found</Box>}
            </>
        )
    }
    const handleAddCoeditors = async (coeditors: string[] = []) => {
        const requestBody = {
            api_metadata_id: data?.api_metadata_id,
            co_editors: coeditors
        }

        setLoading(true)

        mutation.mutate(requestBody, {
            onSuccess: (responseData: { data: { co_editors: string[] } }) => {
                setCoEditorsData(responseData?.data?.co_editors)
                setIsConfirmationMessage({
                    ...isConfirmationMessage,
                    confirmation: true
                })
                reloadData()
                setLoading(false)
            },
            onError: (error: Error) => {
                setErrorMessage(error.message || 'Failed to add co-editors')
                setLoading(false)
            }
        })

        setIsSaveCoeditorDisabled(true)
    }

    const isUpdated = () => {
        if (
            Array.isArray(updatedCoEditorsList) &&
            Array.isArray(coEditorsList)
        ) {
            const isChanged =
                JSON.stringify(updatedCoEditorsList) !=
                    JSON.stringify(coEditorsList) || coeditorEmails
            return !!isChanged
        } else {
            return false
        }
    }

    const handleClose = () => {
        if (isUpdated() && !isConfirmationMessage.isChanged) {
            setIsConfirmationMessage({
                ...isConfirmationMessage,
                isChanged: true
            })
            setIsSaveCoeditorDisabled(false)
        } else {
            setIsConfirmationMessage({ confirmation: false, isChanged: false })
            closeDialog()
            setCoeditorEmails('')
            setErrorMessage('')
            setUpdatedCoEditorsList(coEditorsList)
            setIsSaveCoeditorDisabled(true)
        }
    }

    return (
        <>
            <Dialog.Root
                open={isOpen}
                onOpenChange={e => !e.open && handleClose()}
                placement='center'
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        className={
                            isConfirmationMessage?.confirmation
                                ? styles.coEditorsConfirmation
                                : styles.coEditorsModal
                        }
                        style={{ width: '80%', maxWidth: '1700px' }}
                    >
                        {isConfirmationMessage?.confirmation ? (
                            <>
                                <Center margin={'20px 0px'} fontSize={'3rem'}>
                                    <IconSuccess color='success' size='xl' />
                                </Center>
                                <Dialog.Header
                                    className={styles.appDialogHeader}
                                >
                                    <Center w={'100%'}>
                                        {'Successfully Added!!'}
                                    </Center>
                                </Dialog.Header>
                                <Dialog.Body className={styles.modalBody}>
                                    {
                                        'You have successfully added Co-Editor(s) to this API'
                                    }
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Center w={'100%'}>
                                        <Button
                                            colorPalette={'blue'}
                                            onClick={handleClose}
                                            className={styles.closeButton}
                                        >
                                            Close
                                        </Button>
                                    </Center>
                                </Dialog.Footer>
                            </>
                        ) : (
                            <>
                                <Dialog.Header
                                    className={styles.appDialogHeader}
                                    _dark={{
                                        backgroundColor: '#111111 !important',
                                        color: 'white'
                                    }}
                                >
                                    Add / View Co-Editor(s)
                                </Dialog.Header>
                                <Button
                                    variant='ghost'
                                    position='absolute'
                                    top={4}
                                    right={4}
                                    aria-label='Close'
                                    onClick={closeDialog}
                                    className={styles.modalCloseButton}
                                >
                                    ×
                                </Button>
                                <Dialog.Body>{getCoeditorsList()}</Dialog.Body>
                                <Dialog.Footer justifyContent={'flex-start'}>
                                    <HStack
                                        gap={4}
                                        className={styles.actionsSection}
                                    >
                                        <Button
                                            color={'white'}
                                            colorPalette='blue'
                                            onClick={() => {
                                                handleAddCoeditors(
                                                    updatedCoEditorsList
                                                )
                                            }}
                                            disabled={isSaveCoeditorDisabled}
                                            className={styles.saveAction}
                                            loading={loading}
                                            loadingText='Save'
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant='outline'
                                            colorPalette='blue'
                                            onClick={handleClose}
                                            className={styles.cancelAction}
                                        >
                                            Cancel
                                        </Button>
                                    </HStack>
                                </Dialog.Footer>
                            </>
                        )}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
            <ConfirmationSubmitModal
                isOpen={isConfirmationMessage.isChanged}
                closeDialog={() => {
                    setIsConfirmationMessage({
                        ...isConfirmationMessage,
                        isChanged: false
                    })
                }}
                handleChanges={handleClose}
            />
        </>
    )
}
