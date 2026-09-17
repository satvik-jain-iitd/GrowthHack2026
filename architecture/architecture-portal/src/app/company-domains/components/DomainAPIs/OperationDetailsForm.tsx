import { Field, Input, Text } from '@chakra-ui/react'
import Select from 'react-select'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { OperationSlas } from './OperationSlas'
import { CustomMultiValueLabel, formatOptionLabel } from './MarketSelectHelpers'
import {
    OperationDetailsFormProps,
    Markets,
    SelectedOptionAction,
    SelectOptions
} from '@/app/company-domains/types'
import { countryOptions } from '@/app/company-domains/constants'
import { DOMAIN_TEST_IDS } from '../../test-ids'
import { EBCMFields } from './EBCMFields'
import { inputThemeProps } from '../../utils/reactSelectStyles'

export const OperationDetailsForm = ({
    apiEndpoints,
    consumerDomainOptions,
    formErrors,
    formValues,
    hasLockedApiSelection,
    levels,
    onChange,
    onChangeMultiSelect,
    onChangeSelectSingle,
    onLevel1Change,
    onLevel2Change,
    onLevel3Change,
    onLevel4Change,
    onRemoveEBCM,
    selectedEBCM,
    showRegisterMessage,
    sortedList1,
    selectStyles,
    setSelectedEBCM,
    setFormValues,
    setLevels
}: OperationDetailsFormProps) => {
    return (
        <>
            {showRegisterMessage && (
                <Text paddingLeft='16px'>Register an Operation below</Text>
            )}
            <div className={styles.formContainer}>
                <div className={styles.apiFormFields}>
                    <Field.Root className={styles.fields} required>
                        <Field.Label>
                            API <Field.RequiredIndicator />
                        </Field.Label>
                        <Select
                            value={formValues.api}
                            options={apiEndpoints}
                            className={`${styles.inputFields} ${
                                formErrors.api?.error && styles.errorField
                            }`}
                            onChange={value =>
                                onChangeSelectSingle(
                                    'api',
                                    value as SelectOptions
                                )
                            }
                            styles={selectStyles}
                            name='api'
                            isDisabled={hasLockedApiSelection}
                        />
                        {formErrors.api?.error && (
                            <Field.ErrorText
                                className={styles.errorMessage}
                                data-testid={DOMAIN_TEST_IDS.apiError}
                            >
                                {formErrors.api.message}
                            </Field.ErrorText>
                        )}
                    </Field.Root>
                    <Field.Root
                        whiteSpace={'pre-wrap'}
                        className={styles.fields}
                        invalid={!!formErrors.operation?.error}
                        required
                    >
                        <Field.Label>
                            Operation <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            value={formValues.operation}
                            title='Operation'
                            className={styles.inputFields}
                            onChange={onChange}
                            name='operation'
                            {...inputThemeProps}
                        />
                        {formErrors.operation?.error && (
                            <Field.ErrorText
                                className={styles.errorMessage}
                                data-testid={DOMAIN_TEST_IDS.operationError}
                            >
                                {formErrors.operation.message}
                            </Field.ErrorText>
                        )}
                    </Field.Root>
                    <Field.Root
                        className={styles.descriptionField}
                        invalid={!!formErrors.endpoint_ds?.error}
                        required
                    >
                        <Field.Label>
                            Description <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            className={styles.textAreaInput}
                            value={formValues.endpoint_ds}
                            onChange={onChange}
                            name='endpoint_ds'
                            resize='none'
                            minHeight='110px'
                            {...inputThemeProps}
                        />
                        {formErrors.endpoint_ds?.error && (
                            <Field.ErrorText
                                className={styles.errorMessage}
                                data-testid={DOMAIN_TEST_IDS.descriptionError}
                            >
                                {formErrors.endpoint_ds.message}
                            </Field.ErrorText>
                        )}
                    </Field.Root>
                    <OperationSlas
                        formValues={formValues}
                        formErrors={formErrors}
                        onChange={onChange}
                    />
                </div>
                <div className={styles.apiFormFields}>
                    <Field.Root
                        className={styles.fields}
                        required
                        data-testid={DOMAIN_TEST_IDS.consumerDomainField}
                    >
                        <Field.Label>
                            Consumer Company Domain <Field.RequiredIndicator />
                        </Field.Label>
                        <Select
                            isMulti
                            options={consumerDomainOptions}
                            className={
                                formErrors.cnsmDomain?.error
                                    ? styles.errorField
                                    : ''
                            }
                            classNames={{
                                menu: () => styles.selectDropdownMenu
                            }}
                            value={formValues.cnsmDomain}
                            onChange={(value, action) =>
                                onChangeMultiSelect(
                                    'cnsmDomain',
                                    value as SelectOptions[],
                                    action as SelectedOptionAction
                                )
                            }
                            data-testid='consumer-company-domain'
                            styles={selectStyles}
                        />
                        {formErrors.cnsmDomain?.error && (
                            <div
                                className={styles.errorMessage}
                                data-testid={
                                    DOMAIN_TEST_IDS.consumerDomainError
                                }
                            >
                                {formErrors.cnsmDomain.message}
                            </div>
                        )}
                    </Field.Root>
                    <Field.Root
                        className={styles.fields}
                        required
                        data-testid={DOMAIN_TEST_IDS.apiTypeField}
                    >
                        <Field.Label>
                            API Type <Field.RequiredIndicator />
                        </Field.Label>
                        <Select
                            className={
                                formErrors.apiType?.error
                                    ? styles.errorField
                                    : ''
                            }
                            classNames={{
                                menu: () => styles.selectDropdownMenu
                            }}
                            name='apiType'
                            options={[
                                { label: 'Type A', value: 'typeA' },
                                { label: 'Type B', value: 'typeB' }
                            ]}
                            styles={selectStyles}
                            value={formValues.apiType}
                            onChange={value =>
                                onChangeSelectSingle(
                                    'apiType',
                                    value as SelectOptions
                                )
                            }
                            data-testid='api-type'
                        />
                        {formErrors.apiType?.error && (
                            <div
                                className={styles.errorMessage}
                                data-testid={DOMAIN_TEST_IDS.apiTypeError}
                            >
                                {formErrors.apiType.message}
                            </div>
                        )}
                    </Field.Root>
                    <Field.Root
                        className={styles.fields}
                        invalid={!!formErrors.journeyLink?.error}
                        required
                    >
                        <Field.Label>
                            Journey Link <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            className={styles.inputFields}
                            value={formValues.journeyLink}
                            onChange={onChange}
                            name='journeyLink'
                            data-testid={DOMAIN_TEST_IDS.journeyLink}
                            {...inputThemeProps}
                        />
                        {formErrors.journeyLink?.error && (
                            <Field.ErrorText
                                className={styles.errorMessage}
                                data-testid={DOMAIN_TEST_IDS.journeyLinkError}
                            >
                                <span>{formErrors.journeyLink.message}</span>
                            </Field.ErrorText>
                        )}
                    </Field.Root>
                    <Field.Root
                        required
                        className={styles.fields}
                        data-testid={DOMAIN_TEST_IDS.intendedMarketsField}
                    >
                        <Field.Label>
                            Intended Markets <Field.RequiredIndicator />
                        </Field.Label>
                        <Select
                            isMulti
                            className={
                                formErrors.intendedMarkets?.error
                                    ? styles.errorField
                                    : ''
                            }
                            classNames={{
                                menu: () => styles.selectDropdownMenu
                            }}
                            name='intendedMarkets'
                            value={formValues.intendedMarkets}
                            onChange={(value, action) =>
                                onChangeMultiSelect(
                                    'intendedMarkets',
                                    value as Markets[],
                                    action as SelectedOptionAction
                                )
                            }
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            styles={selectStyles as any}
                            options={countryOptions}
                            placeholder='Select countries'
                            formatOptionLabel={formatOptionLabel}
                            components={{
                                MultiValueLabel: CustomMultiValueLabel
                            }}
                            data-testid='intended-markets'
                        />
                        {formErrors.intendedMarkets?.error && (
                            <div
                                className={styles.errorMessage}
                                data-testid={
                                    DOMAIN_TEST_IDS.intendedMarketsError
                                }
                            >
                                {formErrors.intendedMarkets.message}
                            </div>
                        )}
                    </Field.Root>
                </div>
                <div className={styles.apiFormFields}>
                    <Field.Root
                        className={styles.fields}
                        data-testid={
                            DOMAIN_TEST_IDS.currentlySupportedMarketsField
                        }
                    >
                        <Field.Label>Currently Supported Markets</Field.Label>
                        <Select
                            isMulti
                            className={styles.fields}
                            classNames={{
                                menu: () => styles.selectDropdownMenu
                            }}
                            name='actualMarkets'
                            value={formValues.actualMarkets}
                            onChange={(value, action) =>
                                onChangeMultiSelect(
                                    'actualMarkets',
                                    value as Markets[],
                                    action as unknown as SelectedOptionAction
                                )
                            }
                            options={countryOptions}
                            placeholder='Select countries'
                            formatOptionLabel={formatOptionLabel}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            styles={selectStyles as any}
                            components={{
                                MultiValueLabel: CustomMultiValueLabel
                            }}
                            data-testid='actual-markets'
                        />
                        {formErrors.actualMarkets?.error && (
                            <div className={styles.errorMessage}>
                                {formErrors.actualMarkets.message}
                            </div>
                        )}
                    </Field.Root>
                    <Field.Root
                        className={styles.fields}
                        invalid={!!formErrors.input?.error}
                        required
                    >
                        <Field.Label>
                            Input <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            title='Operation Input'
                            className={styles.inputFields}
                            value={formValues.input}
                            onChange={onChange}
                            name='input'
                            resize='none'
                            minHeight='70px'
                            {...inputThemeProps}
                        />
                        {formErrors.input?.error && (
                            <Field.ErrorText
                                className={styles.errorMessage}
                                data-testid={DOMAIN_TEST_IDS.inputError}
                            >
                                {formErrors.input.message}
                            </Field.ErrorText>
                        )}
                    </Field.Root>
                    <Field.Root
                        className={styles.fields}
                        invalid={!!formErrors.output?.error}
                        required
                    >
                        <Field.Label>
                            Output <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            title='Operation Output'
                            className={styles.inputFields}
                            value={formValues.output}
                            onChange={onChange}
                            name='output'
                            resize='none'
                            minHeight='70px'
                            {...inputThemeProps}
                        />
                        {formErrors.output?.error && (
                            <Field.ErrorText
                                className={styles.errorMessage}
                                data-testid={DOMAIN_TEST_IDS.outputError}
                            >
                                {formErrors.output.message}
                            </Field.ErrorText>
                        )}
                    </Field.Root>
                </div>
                <EBCMFields
                    formErrors={formErrors}
                    formValues={formValues}
                    levels={levels}
                    onLevel1Change={onLevel1Change}
                    onLevel2Change={onLevel2Change}
                    onLevel3Change={onLevel3Change}
                    onLevel4Change={onLevel4Change}
                    onRemoveEBCM={onRemoveEBCM}
                    selectedEBCM={selectedEBCM}
                    sortedList1={sortedList1}
                    selectStyles={selectStyles}
                    setSelectedEBCM={setSelectedEBCM}
                    setFormValues={setFormValues}
                    setLevels={setLevels}
                />
            </div>
        </>
    )
}
