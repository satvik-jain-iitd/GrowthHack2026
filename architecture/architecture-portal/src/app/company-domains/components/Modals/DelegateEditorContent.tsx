/* istanbul ignore file */
/* eslint-disable react/no-danger */
import {
    Box,
    Button,
    Dialog,
    Flex,
    HStack,
    Input,
    Table
} from '@chakra-ui/react'
import Select from 'react-select'
import {
    IconCheck,
    IconDeclined,
    IconEdit,
    IconTrash
} from '@americanexpress/dls-icons'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { useUserInfo } from '@/hooks'
import { UserAvatar } from '../UserAvatar'
import { Delegate, ConfirmationSummary } from '@/app/company-domains/types'

interface DelegateTableColumn {
    key: string
    name: string
    title: string
    width: string
}

interface SelectOptions {
    label: string
    value: string
}

const pluralize = (count: number, noun: string) =>
    `${count} ${noun}${count === 1 ? '' : 's'}`

const roleUpdatePhrase = (count: number) =>
    `updated roles for ${pluralize(count, 'delegate')}`

const joinPhrases = (phrases: string[]) => {
    if (phrases.length === 0) return ''
    if (phrases.length === 1) return phrases[0]
    if (phrases.length === 2) return `${phrases[0]} and ${phrases[1]}`
    return `${phrases.slice(0, -1).join(', ')}, and ${phrases[phrases.length - 1]}`
}

const toCanonicalType = (
    type: string,
    delegatePayloadValues: { value: string; label: string }[]
) => {
    const byValue = delegatePayloadValues.find(item => item.value === type)
    if (byValue) return byValue.value

    const byLabel = delegatePayloadValues.find(item => item.label === type)
    if (byLabel) return byLabel.value

    return type
}

const buildConfirmationSummary = (
    previousDelegates: (string | Delegate)[],
    currentDelegates: (string | Delegate)[],
    delegatePayloadValues: { value: string; label: string }[]
): ConfirmationSummary => {
    const normalize = (delegates: (string | Delegate)[]) => {
        const map = new Map<string, string>()
        delegates.forEach(delegate => {
            if (typeof delegate === 'string') {
                map.set(delegate.toLowerCase(), '')
            } else {
                map.set(
                    delegate.email.toLowerCase(),
                    toCanonicalType(delegate.type, delegatePayloadValues)
                )
            }
        })
        return map
    }

    const previous = normalize(previousDelegates)
    const current = normalize(currentDelegates)

    const added = [...current.keys()].filter(email => !previous.has(email))
    const removed = [...previous.keys()].filter(email => !current.has(email))
    const roleChanged = [...current.keys()].filter(
        email =>
            previous.has(email) && previous.get(email) !== current.get(email)
    )

    if (added.length > 0 && removed.length === 0 && roleChanged.length === 0) {
        return {
            title: 'Delegates Added',
            body: `Added ${pluralize(added.length, 'delegate')} to this domain.`
        }
    }

    if (removed.length > 0 && added.length === 0 && roleChanged.length === 0) {
        return {
            title: 'Delegates Removed',
            body: `Removed ${pluralize(removed.length, 'delegate')} from this domain.`
        }
    }

    if (roleChanged.length > 0 && added.length === 0 && removed.length === 0) {
        return {
            title: 'Delegate Roles Updated',
            body: `${roleUpdatePhrase(roleChanged.length)} in this domain.`
        }
    }

    if (
        added.length === 0 &&
        removed.length === 0 &&
        roleChanged.length === 0
    ) {
        return {
            title: 'No Delegate Changes',
            body: 'No changes were made to delegates.'
        }
    }

    const phrases: string[] = []
    if (added.length > 0) {
        phrases.push(`added ${pluralize(added.length, 'delegate')}`)
    }
    if (removed.length > 0) {
        phrases.push(`removed ${pluralize(removed.length, 'delegate')}`)
    }
    if (roleChanged.length > 0) {
        phrases.push(roleUpdatePhrase(roleChanged.length))
    }

    return {
        title: 'Delegate Updates Saved',
        body: `Saved changes: ${joinPhrases(phrases)} in this domain.`
    }
}

const DelegateInfo = ({ email }: { email: string }) => {
    const { userInfo } = useUserInfo(email)

    return (
        <Flex alignItems='center'>
            <UserAvatar email={email} name={userInfo?.displayName} />
            <div className={styles.userEmail}>
                {userInfo?.displayName || email}
            </div>
        </Flex>
    )
}

interface DelegateTableRowProps {
    delegate: string | Delegate
    index: number
    getDelegateTypeLabel: (typeValue: string) => string
    onEdit: (delegate: string | Delegate) => void
    onRemove: (index: number) => void
}

const DelegateTableRow = ({
    delegate,
    index,
    getDelegateTypeLabel,
    onEdit,
    onRemove
}: DelegateTableRowProps) => {
    return (
        <Table.Row>
            <Table.Cell whiteSpace='normal' wordBreak='break-word'>
                {typeof delegate === 'string' ? (
                    delegate
                ) : (
                    <DelegateInfo key={delegate.email} email={delegate.email} />
                )}
            </Table.Cell>
            <Table.Cell>
                {typeof delegate === 'object' && 'type' in delegate
                    ? getDelegateTypeLabel(delegate.type)
                    : ''}
            </Table.Cell>
            <Table.Cell>
                <HStack justifyContent='flex'>
                    <IconEdit
                        title='Edit'
                        titleId='edit-icon-id'
                        className={styles.coEditorsCheckIcon}
                        onClick={() => onEdit(delegate)}
                    />
                    <IconTrash
                        title='Delete'
                        titleId='trash-icon-id'
                        className={styles.coEditorsDeleteIcon}
                        style={{ marginLeft: '10px' }}
                        onClick={() => onRemove(index)}
                    />
                </HStack>
            </Table.Cell>
        </Table.Row>
    )
}

interface DelegateEditorContentProps {
    cancelAddingDelegate: () => void
    delegateEmails: string
    delegateTableColumns: DelegateTableColumn[]
    delegateType: string
    delegateTypes: { value: string; label: string }[]
    domainName: string
    dropDownValue: (
        typeValue: string
    ) => { value: string; label: string } | string
    editEmail: string
    errorMessage: string
    getDelegateTypeLabel: (typeValue: string) => string
    handleAddDelegates: (delegates: (string | Delegate)[]) => void
    handleChange: (value: SelectOptions) => void
    handleClose: (triggerConfirmation?: boolean) => void
    handleEdit: (delegate: string | Delegate) => void
    handleEmailKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
    handlePasteEmails: (e: React.ClipboardEvent<HTMLInputElement>) => void
    handleRemoveEmail: (index: number) => void
    isSaveDisabled: boolean
    loading: boolean
    processInputEmails: (input: string) => void
    setDelegateEmails: (value: string) => void
    setDelegateType: (value: string) => void
    setErrorMessage: (value: string) => void
    updatedDelegateList: (string | Delegate)[]
}

const DelegateEditorContent = ({
    cancelAddingDelegate,
    delegateEmails,
    delegateTableColumns,
    delegateType,
    delegateTypes,
    domainName,
    dropDownValue,
    editEmail,
    errorMessage,
    getDelegateTypeLabel,
    handleAddDelegates,
    handleChange,
    handleClose,
    handleEdit,
    handleEmailKeyDown,
    handlePasteEmails,
    handleRemoveEmail,
    isSaveDisabled,
    loading,
    processInputEmails,
    setDelegateEmails,
    setDelegateType,
    setErrorMessage,
    updatedDelegateList
}: DelegateEditorContentProps) => {
    const visibleDelegates = updatedDelegateList.filter(
        item => item !== editEmail
    )
    return (
        <>
            <HStack margin='23px 0px 10px 23px'>
                <Dialog.Header
                    className={styles.appDelegateDialogHeader}
                    _dark={{ color: 'white' }}
                >
                    {`${domainName ? domainName + ' - ' : ''}`}
                </Dialog.Header>
                <span className={styles.appDialogSubHeader}>
                    Add / View Delegate(s)
                </span>
            </HStack>
            <Button
                variant='ghost'
                position='absolute'
                top={4}
                right={4}
                aria-label='Close'
                onClick={() => {
                    cancelAddingDelegate()
                    handleClose()
                }}
                className={styles.modalCloseButton}
            >
                ×
            </Button>
            <Dialog.Body overflowX='auto'>
                <Box width='100%' overflowX='auto'>
                    <Table.Root
                        variant='outline'
                        display='table'
                        id='domain-api-table'
                        stickyHeader
                        width='100%'
                        minWidth='640px'
                        tableLayout='fixed'
                    >
                        <Table.Header top={0}>
                            <Table.Row className='tableRow theadTr'>
                                {delegateTableColumns.map(column => (
                                    <Table.ColumnHeader
                                        className='history-modal-table-header'
                                        key={column.key}
                                        title={column.title}
                                        width={column.width}
                                    >
                                        <Box textAlign='center'>
                                            {column?.name}
                                        </Box>
                                    </Table.ColumnHeader>
                                ))}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row
                                className={`tableRow logsModalTableRow ${styles.coEditorsRow}`}
                            >
                                <Table.Cell colSpan={2}>
                                    <HStack gap={4} align='flex-start'>
                                        <Input
                                            width='650px'
                                            placeholder='Add delegate email'
                                            value={delegateEmails}
                                            onChange={e => {
                                                const value = e.target.value
                                                setDelegateEmails(value)
                                                if (!value.trim()) {
                                                    setErrorMessage('')
                                                }
                                            }}
                                            onKeyDown={handleEmailKeyDown}
                                            onPaste={handlePasteEmails}
                                        />
                                        <Select
                                            placeholder='Select Delegate Type'
                                            options={delegateTypes}
                                            value={dropDownValue(delegateType)}
                                            onChange={value =>
                                                handleChange(
                                                    value as SelectOptions
                                                )
                                            }
                                            className={
                                                styles.selectDelegateType
                                            }
                                            menuPosition='fixed'
                                            styles={{
                                                control: base => ({
                                                    ...base,
                                                    borderColor:
                                                        'var(--chakra-colors-gray-300)',
                                                    backgroundColor:
                                                        'var(--bgColor-default)'
                                                }),
                                                option: base => ({
                                                    ...base,
                                                    backgroundColor:
                                                        'var(--directory-content-BG)',
                                                    color: 'var(--directory-filter-color)'
                                                }),
                                                menu: base => ({
                                                    ...base,
                                                    backgroundColor:
                                                        'var(--directory-content-BG)'
                                                }),
                                                singleValue: base => ({
                                                    ...base,
                                                    color: 'var(--directory-filter-color)'
                                                })
                                            }}
                                            classNames={{
                                                menu: () =>
                                                    styles.selectDropdownMenu
                                            }}
                                        />
                                    </HStack>
                                    {errorMessage && (
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: errorMessage.replace(
                                                    /person\/s/gi,
                                                    "person's"
                                                )
                                            }}
                                            className={styles.errorMessage}
                                        />
                                    )}
                                </Table.Cell>
                                <Table.Cell display='block'>
                                    <HStack>
                                        <IconCheck
                                            title='Add Delegate'
                                            titleId='check-icon-id'
                                            className={
                                                styles.coEditorsCheckIcon
                                            }
                                            onClick={() =>
                                                processInputEmails(
                                                    delegateEmails
                                                )
                                            }
                                        />
                                        <IconDeclined
                                            title='Cancel'
                                            titleId='declined-icon-id'
                                            className={
                                                styles.coEditorsDeleteIcon
                                            }
                                            style={{ marginLeft: '10px' }}
                                            onClick={() => {
                                                setDelegateEmails('')
                                                setDelegateType('')
                                                setErrorMessage('')
                                            }}
                                        />
                                    </HStack>
                                </Table.Cell>
                            </Table.Row>
                            {visibleDelegates.length > 0
                                ? updatedDelegateList.map((delegate, index) => (
                                      <DelegateTableRow
                                          key={`${typeof delegate === 'string' ? delegate : delegate.email}-${index}`}
                                          delegate={delegate}
                                          index={index}
                                          getDelegateTypeLabel={
                                              getDelegateTypeLabel
                                          }
                                          onEdit={handleEdit}
                                          onRemove={handleRemoveEmail}
                                      />
                                  ))
                                : null}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Dialog.Body>
            <Dialog.Footer justifyContent={'flex-start'}>
                <HStack gap={4} className={styles.actionsSection}>
                    <Button
                        color={'white'}
                        colorPalette='blue'
                        onClick={() => handleAddDelegates(updatedDelegateList)}
                        disabled={isSaveDisabled}
                        className={styles.saveAction}
                        loading={loading}
                        loadingText='Save'
                    >
                        Save
                    </Button>
                    <Button
                        variant='outline'
                        colorPalette='blue'
                        onClick={() => handleClose(true)}
                        className={styles.cancelAction}
                    >
                        Cancel
                    </Button>
                </HStack>
            </Dialog.Footer>
        </>
    )
}

export default DelegateEditorContent

export { DelegateEditorContent, buildConfirmationSummary }
