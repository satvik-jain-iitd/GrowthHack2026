/* istanbul ignore file */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Button, ButtonGroup, Dialog, Table } from '@chakra-ui/react'
import SearchableSelect, { MultiValue } from 'react-select'
import { AddEditOwnerSmeData } from '@/app/directory/constants'
import { Domain, SeletedOptionsTypes } from '@/app/company-domains/types'
import styles from '@/app/directory/directory.module.css'

export interface AddEditOwnerOption {
    fieldId: string
    value: string
    email: string
    label: string
}

interface DefaultOptionValue {
    label: string
    value: string
}

interface DefaultOptionValues {
    unit_cio: DefaultOptionValue
    tech_owner: DefaultOptionValue
    principal_ea_architect: DefaultOptionValue
    ea_architect: DefaultOptionValue
    head_engineer: DefaultOptionValue
}

interface AddEditOwnerDialogContentProps {
    canSave: boolean
    data: Domain
    defaultOptionValues: DefaultOptionValues
    getOptionsFromData: (
        optionsFromData: Record<string, string>[],
        fieldId: string
    ) => AddEditOwnerOption[]
    handleBlur: (event: any, fieldId: string) => void
    handleChange: (event: any) => void
    handleClose: () => void
    handleInputChange: (value: string) => void
    handleMultiSelect: (value: MultiValue<AddEditOwnerOption>) => void
    handleMultiSelectBlur: () => void
    handleSave: () => void
    inputValue: string
    multiSelectedOption: AddEditOwnerOption[]
    selectedOptions: SeletedOptionsTypes
    showErrorMessage: SeletedOptionsTypes
}

export const AddEditOwnerDialogContent = ({
    canSave,
    data,
    defaultOptionValues,
    getOptionsFromData,
    handleBlur,
    handleChange,
    handleClose,
    handleInputChange,
    handleMultiSelect,
    handleMultiSelectBlur,
    handleSave,
    inputValue,
    multiSelectedOption,
    selectedOptions,
    showErrorMessage
}: AddEditOwnerDialogContentProps) => {
    const getSingleSelectOptions = (
        optionsFromData: Record<string, string>[],
        fieldId: string
    ): AddEditOwnerOption[] => {
        if (!inputValue) {
            return getOptionsFromData(optionsFromData, fieldId)
        }

        return [
            ...getOptionsFromData(optionsFromData, fieldId),
            {
                fieldId,
                email: '',
                label: inputValue,
                value: inputValue
            }
        ]
    }

    const selectStyles = {
        control: (base: any) => ({
            ...base,
            backgroundColor: 'var(--bgColor-default)',
            borderColor: 'var(--chakra-colors-gray-300)',
            color: 'var(--fgColor-default)'
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: 'var(--bgColor-default)'
        }),
        option: (base: any) => ({
            ...base,
            backgroundColor: 'var(--bgColor-default)',
            color: 'var(--directory-filter-color)'
        }),
        input: (base: any) => ({
            ...base,
            color: 'var(--directory-filter-color)'
        }),
        singleValue: (base: any) => ({
            ...base,
            color: 'var(--directory-filter-color)'
        }),
        multiValue: (base: any) => ({
            ...base,
            backgroundColor: 'var(--directory-filter)'
        }),
        multiValueLabel: (base: any) => ({
            ...base,
            color: 'var(--fgColor-default)'
        })
    }

    const getSelectedValue = (
        fieldId:
            | 'tech_owner'
            | 'principal_ea_architect'
            | 'ea_architect'
            | 'head_engineer'
    ) => {
        if (!selectedOptions?.[fieldId]) {
            return defaultOptionValues[fieldId]
        }

        return {
            label: selectedOptions[fieldId],
            value: selectedOptions[`${fieldId}_email`]
        }
    }

    const renderSingleSelectRow = ({
        ariaLabel,
        defaultValue,
        errorKey,
        fieldId,
        optionsFromData,
        roleLabel
    }: {
        ariaLabel?: string
        defaultValue: DefaultOptionValue
        errorKey: keyof SeletedOptionsTypes
        fieldId:
            | 'unit_cio'
            | 'tech_owner'
            | 'principal_ea_architect'
            | 'ea_architect'
            | 'head_engineer'
        optionsFromData: Record<string, string>[]
        roleLabel: string
    }) => {
        const isSearchableField = fieldId !== 'unit_cio'

        return (
            <Table.Row id='add-edit-row'>
                <Table.Cell id='add-edit-role'>{roleLabel}</Table.Cell>
                <Table.Cell id='add-edit-sme'>
                    <SearchableSelect
                        name={fieldId}
                        aria-label={ariaLabel}
                        defaultValue={defaultValue}
                        options={
                            isSearchableField
                                ? getSingleSelectOptions(
                                      optionsFromData,
                                      fieldId
                                  )
                                : getOptionsFromData(optionsFromData, fieldId)
                        }
                        onChange={handleChange}
                        onInputChange={
                            isSearchableField ? handleInputChange : undefined
                        }
                        value={
                            isSearchableField
                                ? getSelectedValue(
                                      fieldId as
                                          | 'tech_owner'
                                          | 'principal_ea_architect'
                                          | 'ea_architect'
                                          | 'head_engineer'
                                  )
                                : undefined
                        }
                        onBlur={
                            isSearchableField
                                ? event => handleBlur(event, fieldId)
                                : undefined
                        }
                        styles={selectStyles}
                    />
                    {isSearchableField && (
                        <div className={styles.errorMessage}>
                            {showErrorMessage?.[errorKey]}
                        </div>
                    )}
                </Table.Cell>
            </Table.Row>
        )
    }

    return (
        <Dialog.Content className='add-edit-modal'>
            <Dialog.Header id='add-edit-modal-title' pb={1}>
                <Dialog.Title fontWeight='600' fontSize='18px'>
                    Add / Edit Owner / SME for {data?.domain_nm}
                </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pt={0} pb={0}>
                <Table.Root size='sm' mb={0}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader id='add-edit-role-header'>
                                Role
                            </Table.ColumnHeader>
                            <Table.ColumnHeader id='add-edit-sme-header'>
                                Owner / SME
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {renderSingleSelectRow({
                            defaultValue: defaultOptionValues.unit_cio,
                            errorKey: 'unit_cio',
                            fieldId: 'unit_cio',
                            optionsFromData: AddEditOwnerSmeData.unit_cios,
                            roleLabel: 'Unit CIO'
                        })}
                        {renderSingleSelectRow({
                            ariaLabel: 'tech_owner',
                            defaultValue: defaultOptionValues.tech_owner,
                            errorKey: 'tech_owner',
                            fieldId: 'tech_owner',
                            optionsFromData:
                                AddEditOwnerSmeData[
                                    'tech_owners&unit_cio_architects'
                                ],
                            roleLabel: 'Tech Owner'
                        })}
                        {renderSingleSelectRow({
                            defaultValue:
                                defaultOptionValues.principal_ea_architect,
                            errorKey: 'principal_ea_architect',
                            fieldId: 'principal_ea_architect',
                            optionsFromData:
                                AddEditOwnerSmeData.principal_architects,
                            roleLabel: 'Principal Architect'
                        })}
                        {renderSingleSelectRow({
                            defaultValue: defaultOptionValues.ea_architect,
                            errorKey: 'ea_architect',
                            fieldId: 'ea_architect',
                            optionsFromData:
                                AddEditOwnerSmeData.enterprise_architects,
                            roleLabel: 'Enterprise Architect'
                        })}
                        {renderSingleSelectRow({
                            defaultValue: defaultOptionValues.head_engineer,
                            errorKey: 'head_engineer',
                            fieldId: 'head_engineer',
                            optionsFromData: AddEditOwnerSmeData.head_engineers,
                            roleLabel: 'Head Engineer'
                        })}
                        <Table.Row id='add-edit-row'>
                            <Table.Cell id='add-edit-role'>
                                Unit CIO Architect (delegate)
                            </Table.Cell>
                            <Table.Cell id='add-edit-sme'>
                                <SearchableSelect
                                    aria-label='unit_cio_architects'
                                    className='pad-1-tb'
                                    menuPosition='fixed'
                                    isMulti
                                    options={getSingleSelectOptions(
                                        AddEditOwnerSmeData[
                                            'tech_owners&unit_cio_architects'
                                        ],
                                        'ea_architect_delegate'
                                    )}
                                    value={multiSelectedOption}
                                    onChange={handleMultiSelect}
                                    onInputChange={handleInputChange}
                                    onBlur={handleMultiSelectBlur}
                                    styles={selectStyles}
                                />
                                <div className={styles.errorMessage}>
                                    {showErrorMessage?.['unit_cio_architects']}
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            </Dialog.Body>
            <Dialog.Footer>
                <ButtonGroup className='buttonGroup'>
                    <Button
                        className='cancelButton'
                        variant='outline'
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        background='#006fcf'
                        color='white'
                        className='saveButton'
                        onClick={handleSave}
                        disabled={!canSave}
                    >
                        Save
                    </Button>
                </ButtonGroup>
            </Dialog.Footer>
        </Dialog.Content>
    )
}
