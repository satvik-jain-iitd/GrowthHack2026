/* istanbul ignore file */
import { Dialog } from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { useState, useEffect, useRef } from 'react'
import { ConfirmationSubmitModal } from './ConfirmationSubmitModal'
import { useDelegateOwner } from '@/app/company-domains/hooks'
import { ErrorModal } from './ErrorModal'
import { USER_MESSAGES } from '@/app/company-domains/constants'
import DelegateConfirmationContent from './DelegateConfirmationContent'
import {
    Delegate,
    ConfirmationSummary,
    SelectOptions
} from '@/app/company-domains/types'
import {
    DelegateEditorContent,
    buildConfirmationSummary
} from './DelegateEditorContent'
import { isEmailValid } from '@/app/utils/utils'

interface DelegateModalProps {
    isOpen: boolean
    onClose: () => void
    domainId: string
    setDelegatesData: (delegates: string[]) => void
    delegateList: string[]
    domainName: string
}

interface DelegateOwner {
    email: string
    type: string
}

export const DelegateModal: React.FC<DelegateModalProps> = ({
    isOpen,
    onClose,
    domainId,
    setDelegatesData,
    delegateList,
    domainName
}) => {
    const [isConfirmationMessage, setIsConfirmationMessage] = useState({
        confirmation: false,
        isChanged: false
    })
    const [delegateEmails, setDelegateEmails] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [editEmail, setEditEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [updatedDelegateList, setUpdatedDelegateList] =
        useState<(string | Delegate)[]>(delegateList)
    const [isSaveDisabled, setIsSaveDisabled] = useState(true)
    const [delegateType, setDelegateType] = useState('')
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
    const [confirmationSummary, setConfirmationSummary] =
        useState<ConfirmationSummary>({
            title: 'Delegate Updates Saved',
            body: 'Your delegate updates were saved successfully.'
        })
    const { addDelegateOwner, getDelegateOwner } = useDelegateOwner()

    const lastLoadedDelegateListRef =
        useRef<(string | Delegate)[]>(delegateList)

    const validateDelegateEmails = (rawValue: string | string[]) => {
        const value = Array.isArray(rawValue)
            ? rawValue.join(',')
            : typeof rawValue === 'string'
              ? rawValue
              : ''

        const emails = value
            .split(/[\n,;]+/)
            .map(e => e.trim())
            .filter(Boolean)

        const invalidEmails = emails.filter(
            email =>
                !email.toLowerCase().endsWith('@aexp.com') ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        )
        return {
            isValid: invalidEmails.length === 0,
            invalidEmails,
            emails
        }
    }

    const processInputEmails = (input: string) => {
        if (!delegateType) {
            setErrorMessage('Please select a delegate role.')
            return
        }

        const { emails, invalidEmails } = validateDelegateEmails(input)
        if (emails.length === 0) {
            setErrorMessage('Please enter delegate email.')
            return
        }

        const existingEmails =
            updatedDelegateList?.map(e =>
                typeof e === 'string' ? e.toLowerCase() : e.email.toLowerCase()
            ) ?? []

        const normalizedEmails = [
            ...new Set(emails.map(email => email.toLowerCase().trim()))
        ]

        const validEmails: string[] = []
        const duplicates = []

        for (const email of normalizedEmails) {
            if (!isEmailValid(email)) continue

            if (
                existingEmails.includes(email) &&
                email !== editEmail.toLowerCase()
            ) {
                duplicates.push(email)
            } else {
                validEmails.push(email)
            }
        }

        if (validEmails.length === 0) {
            let message = ''
            if (invalidEmails.length) {
                message += `Invalid email: ${invalidEmails.join(
                    ', '
                )}. Please enter a valid email. `
            }
            if (duplicates.length) {
                message += `This person already has an assigned role. Please remove the existing role before assigning a new one. `
            }

            setErrorMessage(message.trim())
            return
        }

        setErrorMessage('')

        if (editEmail) {
            const updatedList = updatedDelegateList.map(email =>
                (typeof email === 'string'
                    ? email.toLowerCase()
                    : email.email.toLowerCase()) === editEmail.toLowerCase()
                    ? { email: validEmails[0], type: delegateType }
                    : email
            )
            setUpdatedDelegateList(updatedList)
            setEditEmail('')
        } else {
            const newDelegates = validEmails.map(email => ({
                email,
                type: delegateType
            }))
            setUpdatedDelegateList([...updatedDelegateList, ...newDelegates])
        }

        setDelegateEmails('')
        setDelegateType('')
        setIsSaveDisabled(false)
    }

    const handlePasteEmails = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedEmail = e.clipboardData.getData('Text')
        if (!pastedEmail) return
        setDelegateEmails(pastedEmail)
    }

    const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            processInputEmails(delegateEmails)
        }
        setIsSaveDisabled(true)
    }

    const handleRemoveEmail = (index: number) => {
        const updated = [...updatedDelegateList]
        updated.splice(index, 1)
        setUpdatedDelegateList(updated)
        setErrorMessage('')
        setIsSaveDisabled(false)
    }

    const handleEdit = (delegate: string | { email: string; type: string }) => {
        if (typeof delegate === 'string') {
            setEditEmail(delegate)
            setDelegateEmails(delegate)
            setDelegateType('')
        } else {
            setEditEmail(delegate.email)
            setDelegateEmails(delegate.email)
            setDelegateType(getDelegateTypeLabel(delegate.type))
        }
        setIsSaveDisabled(true)
    }

    const cancelAddingDelegate = () => {
        setDelegateEmails('')
        setErrorMessage('')
        setEditEmail('')
        setIsSaveDisabled(false)
    }

    const delegatePayloadValues = [
        { value: 'HEAD_ENGINEER_DELEGATE', label: 'Head Engineer' },
        {
            value: 'PRINCIPAL_ARCHITECT_DELEGATE',
            label: 'Principal Architect'
        },
        { value: 'EARB_DELEGATE', label: 'EARB Approver' }
    ]

    const handleAddDelegates = async (
        delegates: (string | { email: string; type: string })[] = []
    ) => {
        const summary = buildConfirmationSummary(
            lastLoadedDelegateListRef.current,
            delegates,
            delegatePayloadValues
        )
        const delegateOwners = delegates.map(delegate => {
            if (typeof delegate === 'string') {
                return {
                    email: delegate,
                    type: delegateType
                }
            } else {
                const delegateValue = delegatePayloadValues?.find(
                    type => type.label === delegate?.type
                )?.value
                return {
                    email: delegate.email,
                    type: delegateValue || delegate?.type
                }
            }
        })

        const payload = { domainId, delegateOwners }

        setLoading(true)

        try {
            await addDelegateOwner(domainId, payload)
            setDelegatesData(
                delegates.map(delegate =>
                    typeof delegate === 'string' ? delegate : delegate.email
                )
            )
            setConfirmationSummary(summary)
            lastLoadedDelegateListRef.current = delegates
            setIsConfirmationMessage({
                ...isConfirmationMessage,
                confirmation: true
            })
        } catch (error: unknown) {
            const apiErrorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to add delegates. Please try again.'

            setErrorMessage(apiErrorMessage)
            setIsErrorModalOpen(true)

            console.error('Delegate API Error:', error)
        } finally {
            setLoading(false)
            setIsSaveDisabled(true)
        }
    }

    const isUpdated = () => {
        if (Array.isArray(updatedDelegateList) && Array.isArray(delegateList)) {
            const isChanged =
                (delegateList.length > 0 &&
                    JSON.stringify(updatedDelegateList) !==
                        JSON.stringify(delegateList)) ||
                delegateEmails
            return !!isChanged
        } else {
            return false
        }
    }

    const handleClose = (triggerConfirmation = false) => {
        if (triggerConfirmation && isUpdated()) {
            setIsConfirmationMessage({
                ...isConfirmationMessage,
                isChanged: true
            })
            setIsSaveDisabled(false)
        } else {
            setIsConfirmationMessage({ confirmation: false, isChanged: false })
            onClose()
            setDelegateEmails('')
            setDelegateType('')
            setErrorMessage('')
            cancelAddingDelegate()
            setUpdatedDelegateList([])
            setIsSaveDisabled(true)
        }
    }

    const delegateTableColumns = [
        {
            key: 'delegates',
            name: 'Delegates',
            title: 'Delegates',
            width: '60%'
        },
        { key: 'role', name: 'Role', title: 'Role', width: '25%' },
        { key: 'actions', name: 'Actions', title: 'Actions', width: '15%' }
    ]
    const delegateTypes = [
        { value: 'HEAD_ENGINEER_DELEGATE', label: 'Head Engineer' },
        { value: 'PRINCIPAL_ARCHITECT_DELEGATE', label: 'Principal Architect' }
    ]

    const getDelegateTypeLabel = (typeValue: string) =>
        delegatePayloadValues?.find(type => type.value === typeValue)?.label ??
        typeValue

    const dropDownValue = (typeValue: string) => {
        const delegateData = delegatePayloadValues?.find(
            type => type.value === typeValue || type.label === typeValue
        )
        return delegateData?.label ? delegateData : typeValue
    }

    const handleChange = (value: SelectOptions) => {
        if (errorMessage === 'Please select a delegate role.') {
            setErrorMessage('')
        }
        setDelegateType(value?.value)
    }

    useEffect(() => {
        let isMounted = true
        const loadOwners = async () => {
            try {
                const owners = await getDelegateOwner(domainId)
                if (isMounted) {
                    const normalizedOwners = Array.isArray(owners)
                        ? owners
                        : owners
                          ? [owners]
                          : []
                    const mappedOwners = (
                        normalizedOwners as DelegateOwner[]
                    ).map(owner => ({
                        email: owner.email,
                        type: owner.type
                    }))
                    lastLoadedDelegateListRef.current = mappedOwners
                    setUpdatedDelegateList(mappedOwners)
                }
            } catch (error) {
                console.error(error)
            }
        }

        if (isOpen && domainId) void loadOwners()
        return () => {
            isMounted = false
        }
    }, [domainId, getDelegateOwner, isOpen])

    useEffect(() => {
        lastLoadedDelegateListRef.current = delegateList
    }, [delegateList])

    return (
        <>
            <ErrorModal
                isOpen={isErrorModalOpen}
                errorMessage={errorMessage}
                onClose={() => setIsErrorModalOpen(false)}
                modalTitle={USER_MESSAGES.DELEGATE_ERROR_TITLE}
            />
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
                                ? styles.delegatesConfirmation
                                : styles.delegatesModal
                        }
                        width={
                            isConfirmationMessage?.confirmation
                                ? {
                                      base: '90vw',
                                      md: '500px'
                                  }
                                : {
                                      base: '95vw',
                                      md: '80vw',
                                      lg: '70vw',
                                      xl: '60vw'
                                  }
                        }
                        maxW={
                            isConfirmationMessage?.confirmation
                                ? '520px'
                                : '1000px'
                        }
                    >
                        {isConfirmationMessage?.confirmation ? (
                            <DelegateConfirmationContent
                                confirmationSummary={confirmationSummary}
                                onClose={() => handleClose(false)}
                            />
                        ) : (
                            <DelegateEditorContent
                                cancelAddingDelegate={cancelAddingDelegate}
                                delegateEmails={delegateEmails}
                                delegateTableColumns={delegateTableColumns}
                                delegateType={delegateType}
                                delegateTypes={delegateTypes}
                                domainName={domainName}
                                dropDownValue={dropDownValue}
                                editEmail={editEmail}
                                errorMessage={errorMessage}
                                getDelegateTypeLabel={getDelegateTypeLabel}
                                handleAddDelegates={handleAddDelegates}
                                handleChange={handleChange}
                                handleClose={handleClose}
                                handleEdit={handleEdit}
                                handleEmailKeyDown={handleEmailKeyDown}
                                handlePasteEmails={handlePasteEmails}
                                handleRemoveEmail={handleRemoveEmail}
                                isSaveDisabled={isSaveDisabled}
                                loading={loading}
                                processInputEmails={processInputEmails}
                                setDelegateEmails={setDelegateEmails}
                                setDelegateType={setDelegateType}
                                setErrorMessage={setErrorMessage}
                                updatedDelegateList={updatedDelegateList}
                            />
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
                handleChanges={() => {
                    setIsConfirmationMessage({
                        confirmation: false,
                        isChanged: false
                    })
                    handleClose(false)
                }}
            />
        </>
    )
}
