import { Field, Input } from '@chakra-ui/react'
import Select, { type StylesConfig } from 'react-select'
import styles from '@/app/company-domains/domain-api-page.module.css'
import type {
    ApiFormType,
    SelectedOptionAction,
    SelectOptions
} from '@/app/company-domains/types'
import { DOMAIN_TEST_IDS } from '../../test-ids'
import type { ErrorType } from './DomainApiAddItem.types'
import { inputThemeProps } from '../../utils/reactSelectStyles'

interface ApiDetailsFormProps {
    domainId: string
    domainOptions: SelectOptions[]
    formErrors: { [key: string]: ErrorType }
    formValues: ApiFormType
    onChange: (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | { target: { name: string; value: SelectOptions } }
    ) => void
    onChangeMultiSelect: (
        name: string,
        newValue: SelectOptions[],
        actionMeta: SelectedOptionAction
    ) => void
    onChangeSelectSingle: (name: string, value: SelectOptions) => void
    selectStyles: StylesConfig<SelectOptions, boolean>
    subDomainOptions: SelectOptions[]
}

export const ApiDetailsForm = ({
    domainId,
    domainOptions,
    formErrors,
    formValues,
    onChange,
    onChangeMultiSelect,
    onChangeSelectSingle,
    selectStyles,
    subDomainOptions
}: ApiDetailsFormProps) => {
    return (
        <div className={styles.formContainer}>
            <div className={styles.apiFormFields}>
                <Field.Root
                    whiteSpace={'pre-wrap'}
                    className={styles.fields}
                    invalid={!!formErrors.apiName?.error}
                    required
                >
                    <Field.Label>
                        API Name <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                        value={formValues.apiName}
                        title='Api Name'
                        className={styles.inputFields}
                        onChange={onChange}
                        name='apiName'
                        {...inputThemeProps}
                    />
                    {formErrors.apiName?.error && (
                        <Field.ErrorText
                            className={styles.errorMessage}
                            data-testid={DOMAIN_TEST_IDS.apiNameError}
                        >
                            {formErrors.apiName.message}
                        </Field.ErrorText>
                    )}
                </Field.Root>
                <Field.Root
                    whiteSpace={'pre-wrap'}
                    className={styles.fields}
                    invalid={!!formErrors.apiResource?.error}
                >
                    <Field.Label>API Resource </Field.Label>
                    <Input
                        value={formValues.apiResource}
                        title='Api Resource'
                        className={styles.inputFields}
                        onChange={onChange}
                        name='apiResource'
                        {...inputThemeProps}
                    />
                    {formErrors.apiResource?.error && (
                        <Field.ErrorText className={styles.errorMessage}>
                            {formErrors.apiResource.message}
                        </Field.ErrorText>
                    )}
                </Field.Root>
                <Field.Root
                    className={styles.descriptionField}
                    invalid={!!formErrors.apiDesc?.error}
                    required
                >
                    <Field.Label>
                        API Description <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                        className={styles.textAreaInput}
                        value={formValues.apiDesc}
                        onChange={onChange}
                        name='apiDesc'
                        resize='none'
                        minHeight='110px'
                        {...inputThemeProps}
                    />
                    {formErrors.apiDesc?.error && (
                        <Field.ErrorText
                            className={styles.errorMessage}
                            data-testid={DOMAIN_TEST_IDS.apiDescriptionError}
                        >
                            {formErrors.apiDesc.message}
                        </Field.ErrorText>
                    )}
                </Field.Root>
            </div>
            <div className={styles.apiFormFields}>
                <Field.Root
                    className={styles.fields}
                    required
                    data-testid={DOMAIN_TEST_IDS.providerDomainField}
                >
                    <Field.Label>
                        Provider Company Domain <Field.RequiredIndicator />
                    </Field.Label>
                    <Select
                        isMulti
                        options={domainOptions}
                        isClearable={formValues.prvdDomain.some(
                            (value: SelectOptions) =>
                                !value?.isFixed &&
                                value?.company_domain_id != domainId
                        )}
                        className={
                            formErrors.prvdDomain?.error
                                ? styles.errorField
                                : styles.inputField
                        }
                        classNames={{
                            menu: () => styles.selectDropdownMenu
                        }}
                        value={formValues.prvdDomain}
                        onChange={(value, action) =>
                            onChangeMultiSelect(
                                'prvdDomain',
                                value as SelectOptions[],
                                action as SelectedOptionAction
                            )
                        }
                        styles={selectStyles}
                        data-testid='company-domain'
                    />
                    {formErrors.prvdDomain?.error && (
                        <Field.ErrorText
                            className={styles.errorMessage}
                            data-testid={DOMAIN_TEST_IDS.providerDomainError}
                        >
                            {formErrors.prvdDomain.message}
                        </Field.ErrorText>
                    )}
                </Field.Root>
                <Field.Root className={styles.fields}>
                    <Field.Label>Sub Domain Name</Field.Label>
                    <Select
                        value={formValues.subDomain}
                        options={subDomainOptions}
                        className={styles.inputFields}
                        onChange={value =>
                            onChangeSelectSingle(
                                'subDomain',
                                value as SelectOptions
                            )
                        }
                        classNames={{
                            menu: () => styles.selectDropdownMenu
                        }}
                        name='subDomain'
                        isClearable={true}
                        data-testid='sub-company-domain'
                        styles={selectStyles}
                    />
                </Field.Root>
            </div>
        </div>
    )
}
