import { Button, Box, Field, Tag } from '@chakra-ui/react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { IconPlusCircle } from '@americanexpress/dls-icons'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { EBCMFieldsProps, SelectOptions } from '@/app/company-domains/types'
import { DOMAIN_TEST_IDS } from '../../test-ids'

export const EBCMFields = ({
    formErrors,
    formValues,
    levels,
    onLevel1Change,
    onLevel2Change,
    onLevel3Change,
    onLevel4Change,
    onRemoveEBCM,
    selectedEBCM,
    sortedList1,
    selectStyles,
    setSelectedEBCM,
    setFormValues,
    setLevels
}: EBCMFieldsProps) => {
    const handleEBCM = () => {
        const exists = selectedEBCM.filter(
            item => item?.label === (formValues.ebcm as SelectOptions)?.label
        )
        if (!(exists.length > 0)) {
            setSelectedEBCM([...selectedEBCM, formValues.ebcm as SelectOptions])
        } else {
            toast.success(
                `${(formValues.ebcm as SelectOptions)?.label} is already Added.`
            )
        }
        setFormValues({
            ...formValues,
            ebcm: ''
        })
        setLevels({
            level1: null,
            level2: null,
            level3: null,
            level4: null,
            level2Options: [],
            level3Options: [],
            level4Options: []
        })
    }

    return (
        <div className={styles.apiFormFields}>
            <Field.Root
                className={styles.fields}
                data-testid={DOMAIN_TEST_IDS.ebcmLevel1Field}
            >
                <Field.Label>EBCM Level 1</Field.Label>
                <Select
                    className={styles.inputFields}
                    classNames={{
                        menu: () => styles.selectDropdownMenu
                    }}
                    name='ebcmLevel1'
                    options={sortedList1.map(item => ({
                        label: item.name,
                        value: item.id
                    }))}
                    isClearable={true}
                    value={levels.level1}
                    onChange={value =>
                        onLevel1Change((value as SelectOptions) || null)
                    }
                    data-testid='ebcm-level-1'
                    styles={selectStyles}
                />
            </Field.Root>
            <Field.Root
                className={styles.fields}
                data-testid={DOMAIN_TEST_IDS.ebcmLevel2Field}
            >
                <Field.Label>EBCM Level 2</Field.Label>
                <Select
                    className={styles.inputFields}
                    classNames={{
                        menu: () => styles.selectDropdownMenu
                    }}
                    name='ebcmLevel2'
                    options={levels.level2Options.map(item => ({
                        label: item?.name,
                        value: item?.id
                    }))}
                    isClearable={true}
                    value={levels.level2}
                    onChange={(newValue, action) =>
                        onLevel2Change(newValue as SelectOptions, action)
                    }
                    isDisabled={!levels.level1}
                    data-testid='ebcm-level-2'
                    styles={selectStyles}
                />
            </Field.Root>
            {levels.level1 && levels.level2 && (
                <Field.Root
                    className={styles.fields}
                    data-testid={DOMAIN_TEST_IDS.ebcmLevel3Field}
                >
                    <Field.Label>EBCM Level 3</Field.Label>
                    <Select
                        className={styles.inputFields}
                        classNames={{
                            menu: () => styles.selectDropdownMenu
                        }}
                        name='ebcmLevel3'
                        options={levels.level3Options.map(item => ({
                            label: item?.name,
                            value: item?.id
                        }))}
                        styles={selectStyles}
                        value={levels.level3}
                        isClearable={true}
                        onChange={(newValue, action) =>
                            onLevel3Change(
                                (newValue as SelectOptions) || '',
                                action
                            )
                        }
                        data-testid='ebcm-level-3'
                    />
                </Field.Root>
            )}
            {levels.level3 && levels.level4Options.length > 0 && (
                <Field.Root
                    className={styles.fields}
                    data-testid={DOMAIN_TEST_IDS.ebcmLevel4Field}
                >
                    <Field.Label>EBCM Level 4</Field.Label>
                    <Select
                        className={styles.inputFields}
                        classNames={{
                            menu: () => styles.selectDropdownMenu
                        }}
                        name='ebcmLevel4'
                        options={levels.level4Options.map(item => ({
                            label: item?.name,
                            value: item?.id
                        }))}
                        styles={selectStyles}
                        value={levels.level4}
                        isClearable={true}
                        onChange={value =>
                            onLevel4Change((value as SelectOptions) || null)
                        }
                        data-testid='ebcm-level-4'
                    />
                </Field.Root>
            )}
            {formErrors.ebcm?.error && (
                <div
                    className={styles.errorMessage}
                    data-testid={DOMAIN_TEST_IDS.addEbcmError}
                >
                    {formErrors.ebcm.message}
                </div>
            )}
            {formValues.ebcm && (
                <Button
                    size={'sm'}
                    onClick={handleEBCM}
                    data-testid='add-ebcm-button'
                    className={`${styles.addEBCM} ${formErrors?.ebcm?.error ? styles.addEBCMError : ''}`}
                >
                    <IconPlusCircle
                        color='brand'
                        size='md'
                        isFilled={false}
                        title='Example description applied to icon'
                        titleId='unique-id-for-IconPlusCircle-title'
                    />
                    Add EBCM
                </Button>
            )}
            <div className={styles.fields}>
                <Box
                    pt={2}
                    display='flex'
                    flexWrap='wrap'
                    alignItems='flex-start'
                    overflowX='hidden'
                    flexDirection='row'
                >
                    <div className={styles.ebcmContainer}>
                        <div className={styles.ebcmDetails}>
                            {selectedEBCM.map((item, index) => (
                                <Tag.Root
                                    key={index}
                                    variant='outline'
                                    colorScheme='blue'
                                    m={1}
                                    color='#333333'
                                    fontSize='12px'
                                    lineHeight='24px'
                                    borderRadius='full'
                                    backgroundColor='#ecf5fd'
                                    minHeight='32px'
                                >
                                    <Tag.Label
                                        p={1}
                                        title={item?.label}
                                        className={styles.ebcmTagLabel}
                                    >
                                        {item?.label}
                                    </Tag.Label>
                                    <Tag.CloseTrigger
                                        color='#006fcf'
                                        width='20px'
                                        cursor='pointer'
                                        pr={1}
                                        onClick={() =>
                                            onRemoveEBCM(item?.label)
                                        }
                                        data-testid='ebcm-close'
                                    />
                                </Tag.Root>
                            ))}
                        </div>
                    </div>
                </Box>
            </div>
        </div>
    )
}
