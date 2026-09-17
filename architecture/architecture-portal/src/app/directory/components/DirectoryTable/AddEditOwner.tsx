/* istanbul ignore file */
// Refactor in future
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Dialog } from '@chakra-ui/react'
import { MultiValue } from 'react-select'
import { useAddEditOwner } from '@/app/directory/hooks'
import { ConfirmationModal } from './ConfirmationModal'
import { Domain, SeletedOptionsTypes } from '@/app/company-domains/types'
import { useGetDomains } from '@/app/company-domains/hooks'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import {
    AddEditOwnerDialogContent,
    type AddEditOwnerOption
} from './AddEditOwnerDialogContent'
import { fetchWithToken } from '@/utils/client'

export const AddEditOwner = ({
    data,
    isOpen,
    onClose
}: {
    data: Domain
    isOpen: boolean
    onClose: () => void
}) => {
    const { refetch } = useGetDomains()
    const [multiSelectedOption, setMultiSelectedOption] = useState<
        AddEditOwnerOption[]
    >([])
    const [selectedOptions, setSelectedOptions] = useState<SeletedOptionsTypes>(
        {}
    )
    const { addEditOwnerData, serverError, fetchData, setServerError } =
        useAddEditOwner()
    const [isConformationOpen, setIsConformationOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const isSuccess = useMemo(() => {
        if (serverError) {
            return false
        }
        if (addEditOwnerData) {
            return true
        }
        return false
    }, [serverError, addEditOwnerData])

    const defaultOptionValues = useMemo(() => {
        return {
            unit_cio: { label: data.unit_cio_nm, value: data.unit_cio_nm },
            tech_owner: {
                label: data.tech_owner_nm,
                value: data.tech_owner_nm
            },
            principal_ea_architect: {
                label: data.principal_ea_architect_nm,
                value: data.principal_ea_architect_nm
            },
            ea_architect: {
                label: data.ea_architect_nm,
                value: data.ea_architect_nm
            },
            head_engineer: {
                label: data.head_engineer_nm,
                value: data.head_engineer_nm
            }
        }
    }, [data])

    const getOptionsFromData = (
        optionsFromData: Record<string, string>[],
        fieldId: string
    ): AddEditOwnerOption[] => {
        const options = [
            {
                fieldId,
                value: 'Open',
                email: '',
                label: 'Open'
            }
        ]

        const optionData = optionsFromData?.map(item => {
            return {
                fieldId,
                value: item.displayName,
                email: item.userPrincipalName,
                label: item.displayName
            }
        })

        const newOp = optionData.sort((a, b) => a.value.localeCompare(b.value))
        const sortedOption = [...options, ...newOp]
        return sortedOption
    }
    const getDefaultValuesForEADelegate = (names: string, emails: string[]) => {
        const namesArray = names?.split(',')
        if (names && emails[0] !== 'undefined') {
            return emails?.map(
                (item, index): AddEditOwnerOption => ({
                    fieldId: 'ea_architect_delegate',
                    value: namesArray[index],
                    email: item,
                    label: namesArray[index]
                })
            )
        }
    }

    interface UserInfo {
        userId: string
        displayName: string
        jobTitle: string
        userPrincipalName: string
    }

    const fetchUserInfo = async (email: string): Promise<UserInfo | null> => {
        if (!email) return null
        const res = await fetchWithToken(API_ENDPOINTS.GET_USER_INFO(email))
        if (!res.ok) return null
        return res.json()
    }
    const [inputValue, setInputValue] = useState('')
    const [showErrorMessage, setShowErrorMessage] =
        useState<SeletedOptionsTypes>({})

    const handleInputChange = (value: string) => {
        setInputValue(value)
    }

    /* eslint-disable-next-line */
    const handleBlur = (e: any, fieldId: string) => {
        if (inputValue) {
            fetchUserInfo(inputValue).then(data => {
                if (data?.displayName) {
                    const nameKey = `${fieldId}`
                    const emailKey = `${fieldId}_email`
                    setSelectedOptions(state => ({
                        ...state,
                        [nameKey]: data?.displayName,
                        [emailKey]: data?.userPrincipalName
                    }))
                    setShowErrorMessage(state => ({
                        ...state,
                        [fieldId]: ''
                    }))
                } else {
                    const nameKey = `${fieldId}`
                    const emailKey = `${fieldId}_email`
                    setShowErrorMessage(state => ({
                        ...state,
                        [fieldId]:
                            'User not found, please remove the selected data'
                    }))
                    setSelectedOptions(state => ({
                        ...state,
                        [nameKey]: inputValue,
                        [emailKey]: inputValue
                    }))
                }
            })
        }
    }

    /* eslint-disable-next-line */
    const handleChange = (e: any) => {
        const { fieldId, value, email } = e
        setShowErrorMessage(state => ({
            ...state,
            [fieldId]: ''
        }))
        // Graph API
        if (inputValue && email === '') {
            fetchUserInfo(value).then(data => {
                if (data?.displayName) {
                    const nameKey = `${fieldId}`
                    const emailKey = `${fieldId}_email`
                    setSelectedOptions(state => ({
                        ...state,
                        [nameKey]: data?.displayName,
                        [emailKey]: data?.userPrincipalName
                    }))
                } else {
                    const nameKey = `${fieldId}`
                    const emailKey = `${fieldId}_email`
                    setShowErrorMessage(state => ({
                        ...state,
                        [fieldId]:
                            'User not found, please remove the selected data'
                    }))
                    setSelectedOptions(state => ({
                        ...state,
                        [nameKey]: value,
                        [emailKey]: value
                    }))
                }
            })
        } else {
            const nameKey = `${fieldId}`
            const emailKey = `${fieldId}_email`
            setSelectedOptions(state => ({
                ...state,
                [nameKey]: value,
                [emailKey]: email
            }))
        }
    }

    const setEAObjectValueFromSelected = (selected: AddEditOwnerOption[]) => {
        const names: Array<string | string[]> = []
        const emails: Array<string> = []
        const ea_architect_delegate_options = selected?.reduce<
            Record<string, string | string[]>
        >((acc, item) => {
            const nameKey = `${item.fieldId}`
            const emailKey = `${item.fieldId}_email`
            names.push(item.value)
            emails.push(item.email)
            acc[nameKey] = names.join(',')
            acc[emailKey] = emails
            return acc
        }, {})

        if (Object.keys(ea_architect_delegate_options).length < 1) {
            const oldSelectedOptions: SeletedOptionsTypes = {
                ...selectedOptions
            }
            oldSelectedOptions['ea_architect_delegate'] = ['Open']
            oldSelectedOptions['ea_architect_delegate_email'] = ['']
            setSelectedOptions(oldSelectedOptions)
            return
        }

        setSelectedOptions(state => ({
            ...state,
            ...ea_architect_delegate_options
        }))
    }

    const handleMultiSelectBlur = () => {
        let newOptions: AddEditOwnerOption[] = []
        if (inputValue) {
            fetchUserInfo(inputValue).then(data => {
                if (data?.displayName) {
                    newOptions = [
                        ...multiSelectedOption,
                        {
                            fieldId: 'ea_architect_delegate',
                            email: data?.userPrincipalName,
                            label: data?.displayName,
                            value: data?.displayName
                        }
                    ]
                    const updatedValues = newOptions?.filter(
                        item =>
                            item.email === '' &&
                            item.value != inputValue &&
                            item.value !== 'Open'
                    )
                    if (updatedValues?.length > 0) {
                        setShowErrorMessage(state => ({
                            ...state,
                            ['unit_cio_architects']:
                                'User not found, please remove the selected data'
                        }))
                    } else {
                        setShowErrorMessage(state => ({
                            ...state,
                            ['unit_cio_architects']: ''
                        }))
                    }
                } else {
                    setShowErrorMessage(state => ({
                        ...state,
                        ['unit_cio_architects']:
                            'User not found, please remove the selected data'
                    }))
                    newOptions = [
                        ...multiSelectedOption,
                        {
                            fieldId: 'ea_architect_delegate',
                            email: '',
                            label: inputValue,
                            value: inputValue
                        }
                    ]
                }
                setEAObjectValueFromSelected(newOptions)
                setMultiSelectedOption(newOptions)
            })
        }
    }

    const handleMultiSelect = (value: MultiValue<AddEditOwnerOption>) => {
        setShowErrorMessage(state => ({
            ...state,
            ['unit_cio_architects']: ''
        }))
        let newOptions: AddEditOwnerOption[] = []
        const hasOpen = multiSelectedOption?.some(
            option => option.label === 'Open'
        )
        const hasNoDefaultOpen = multiSelectedOption?.every(
            option => option.label !== 'Open'
        )

        const hasOpenSelected = value?.some(option => option.label === 'Open')
        const hasNoSelectedOpen = value?.every(
            option => option.label !== 'Open'
        )

        if (hasOpen && value?.length >= 1) {
            newOptions = value?.filter(option => option.label !== 'Open')
        }
        if (hasNoDefaultOpen && hasOpenSelected) {
            newOptions = value?.filter(option => option.label === 'Open')
        }
        if (hasNoDefaultOpen && hasNoSelectedOpen) {
            newOptions = [...value]
        }

        if (inputValue && value?.[value?.length - 1]?.email === '') {
            fetchUserInfo(inputValue).then(data => {
                if (data?.displayName) {
                    const updatedValues = value?.map(item =>
                        item?.value === inputValue
                            ? {
                                  ...item,
                                  label: data?.displayName,
                                  value: data?.displayName,
                                  email: data?.userPrincipalName
                              }
                            : item
                    )
                    setMultiSelectedOption([...updatedValues])
                    setEAObjectValueFromSelected([...updatedValues])
                } else {
                    setShowErrorMessage(state => ({
                        ...state,
                        ['unit_cio_architects']:
                            'User not found, please remove the selected data'
                    }))
                    newOptions = [...value]
                }
            })
        }
        const updatedValues = value?.filter(
            item =>
                item.email === '' &&
                item.value != inputValue &&
                item.value !== 'Open'
        )
        if (updatedValues?.length > 0) {
            setShowErrorMessage(state => ({
                ...state,
                ['unit_cio_architects']:
                    'User not found, please remove the selected data'
            }))
        }

        setEAObjectValueFromSelected(newOptions)
        setMultiSelectedOption(newOptions)
    }

    const handleSave = async () => {
        const payload = {
            ...selectedOptions
        }
        try {
            if (!data.company_domain_id) {
                throw new Error('Domain ID is missing')
            }
            await fetchData(payload, data.company_domain_id)

            setIsConformationOpen(true)
            setSelectedOptions({})
            setErrorMessage(null)
            refetch()
        } catch (error) {
            setServerError(error as Error)
            setErrorMessage(
                (error as Error).message || 'An error occurred while saving.'
            )
            setIsConformationOpen(true)
        }
    }

    const handleClose = () => {
        setSelectedOptions({})
        onClose()
        setDefaultEADelegateValues()
    }

    const setDefaultEADelegateValues = useCallback(() => {
        const defaultValues =
            getDefaultValuesForEADelegate(
                data?.ea_architect_delegate_nm,
                data?.ea_archt_dlgte_email_ad_da
            ) || []
        setMultiSelectedOption(defaultValues)
    }, [data])

    const handleError = (error: Error | null) => {
        if (!error) {
            setErrorMessage(null)
            return
        }
        setErrorMessage(error?.message || 'An error occurred while saving.')
    }

    useEffect(() => {
        setSelectedOptions({})
        if (serverError) {
            setErrorMessage(
                serverError.message || 'An error occurred while saving.'
            )
        }
    }, [onClose, serverError])

    useEffect(() => {
        setDefaultEADelegateValues()
    }, [data, setDefaultEADelegateValues])

    const canSave =
        Object.keys(selectedOptions).length !== 0 &&
        !Object.values(showErrorMessage).some(value => value !== '')

    return (
        <>
            <Dialog.Root
                open={isOpen}
                onOpenChange={isOpen => {
                    if (!isOpen) handleClose()
                }}
                size='xl'
                placement='center'
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <AddEditOwnerDialogContent
                        canSave={canSave}
                        data={data}
                        defaultOptionValues={defaultOptionValues}
                        getOptionsFromData={getOptionsFromData}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        handleClose={handleClose}
                        handleInputChange={handleInputChange}
                        handleMultiSelect={handleMultiSelect}
                        handleMultiSelectBlur={handleMultiSelectBlur}
                        handleSave={handleSave}
                        inputValue={inputValue}
                        multiSelectedOption={multiSelectedOption}
                        selectedOptions={selectedOptions}
                        showErrorMessage={showErrorMessage}
                    />
                </Dialog.Positioner>
            </Dialog.Root>
            <ConfirmationModal
                label={isSuccess ? 'No Updates' : 'Updated'}
                isOpen={isConformationOpen}
                onClose={() => setIsConformationOpen(false)}
                modalClose={onClose}
                errorMessage={errorMessage}
                setErrorMessage={handleError}
            />
        </>
    )
}
