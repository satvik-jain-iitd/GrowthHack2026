/* istanbul ignore file */
'use client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button, Grid, GridItem } from '@chakra-ui/react'
import { TextField } from './TextField'
import { NativeSelectField } from './NativeSelectField'
import { useEffect, useState } from 'react'
import {
    LayoutRenderer,
    InitiativeFormValues,
    GraphAPIUser
} from '@/app/onboarding-form/types'
import {
    useEtpList,
    useInitiativeCategoriesList,
    useBusinessUnitList,
    useRepoExists
} from '@/app/onboarding-form/hooks'
import { useCreatePlaybook } from '@/hooks'
import { TypeaheadField } from './TypeaheadField'
import {
    fetchUnitCioListByEmail,
    fetchEmployeesByEmail,
    fetchFoundationalTechnologyCategories,
    fetchEaLeads,
    extractEtpSelectOptions,
    extractBusinessUnitSelectOptions,
    extractInitiativeCategorySelectOptions,
    generateDocsRoot,
    generateInitiativePlaybook
} from '@/app/onboarding-form/utils'
import { PLAYBOOK_TYPE_IDS, SOURCE_HOST } from '@/constants'
import { ErrorDialog, SuccessDialog } from './OnboardingDialog'
import { LoadingSpinner } from '@/components/ui'

type InitiativeFormProps = {
    children: LayoutRenderer
    activeFormDisplayText: string
    adsId?: string
    email?: string
}

export const InitiativeForm: React.FC<InitiativeFormProps> = ({
    children,
    activeFormDisplayText,
    adsId = '',
    email = ''
}) => {
    const {
        control,
        register,
        handleSubmit,
        trigger,
        watch,
        reset,
        formState
    } = useForm<InitiativeFormValues>({
        mode: 'onBlur',
        defaultValues: { contactInfo: [email] }
    })
    const { errors, isSubmitting, isSubmitted } = formState

    // just to log form changes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/incompatible-library
        const subscription = watch(values => {
            console.log('Form values:', values)
        })
        return () => subscription.unsubscribe()
    }, [watch])

    // loaders for select dropdowns
    const { data: etpOptions, isLoading: isEtpLoading } = useEtpList()
    const etpSelectOptions = extractEtpSelectOptions(etpOptions)

    const {
        data: initiativeCategoryOptions,
        isLoading: isInitiativeCategoryLoading
    } = useInitiativeCategoriesList()
    const initiativeCategorySelectOptions =
        extractInitiativeCategorySelectOptions(initiativeCategoryOptions)

    const { data: businessUnitOptions, isLoading: isBusinessUnitLoading } =
        useBusinessUnitList()
    const businessUnitSelectOptions =
        extractBusinessUnitSelectOptions(businessUnitOptions)

    const title = watch('title')
    const repoName = watch('repoName')
    const docsRoot = watch('docsRoot')
    const { data: repoLookup, refetch: refetchRepo } = useRepoExists(
        'amex-eng',
        repoName,
        ''
    )
    const repoSourceHost = repoLookup?.sourceHost ?? SOURCE_HOST.GHC

    const { refetch: refetchDocsRoot } = useRepoExists(
        'amex-eng',
        repoName,
        generateDocsRoot(docsRoot, PLAYBOOK_TYPE_IDS.INITIATIVE),
        repoSourceHost
    )

    const mutation = useCreatePlaybook()
    const [showErrorDialog, setShowErrorDialog] = useState(false)
    const [errorDialogMessage, setErrorDialogMessage] = useState('')

    const onSubmit: SubmitHandler<InitiativeFormValues> = (
        values: InitiativeFormValues
    ) => {
        if (confirm('Confirm Onboarding Request Submission?')) {
            const playbook = generateInitiativePlaybook(
                values,
                adsId || '',
                activeFormDisplayText,
                repoSourceHost
            )
            console.log('submitting playbook: ', playbook)
            mutation
                .mutateAsync(playbook)
                .then(response => {
                    console.log('mutation response:', response)
                })
                .catch(error => {
                    setShowErrorDialog(true)
                    setErrorDialogMessage(
                        error.message || 'Unknown error occurred'
                    )
                    console.error('playbook onboarding error:', error)
                })
        }
    }
    const [validatingFields, setValidatingFields] = useState<
        Record<string, boolean>
    >({})

    const setValidating = (name: string, v: boolean) =>
        setValidatingFields(s => ({ ...s, [name]: v }))

    const isEtp = watch('isEtp')

    const firstField = (
        <NativeSelectField
            key={'isEtp'}
            name={'isEtp'}
            required={true}
            disabled={false}
            label={'ETP?'}
            tooltip={
                'Select yes if you are trying to onboard an Enterprise Top Program, no otherwise'
            }
            register={register}
            validation={{ required: 'ETP required' }}
            error={errors['isEtp']?.message as string | undefined}
            options={[
                { displayText: 'Yes', value: 'true' },
                { displayText: 'No', value: 'false' }
            ]}
            colSpan={{ base: 2, md: 1 }}
        />
    )

    useEffect(() => {
        const subscription = watch(values => {
            console.log('initiativeCategory value:', values.initiativeCategory)
        })
        return () => subscription.unsubscribe()
    }, [watch])

    const restFields = (
        <>
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={6}
            >
                {isEtp === 'true' ? (
                    <>
                        <NativeSelectField
                            key={'etp'}
                            name={'etp'}
                            required={true}
                            label={'Select ETP'}
                            tooltip={'Select the ETP you are trying to onboard'}
                            register={register}
                            placeholder='-- Choose one --'
                            validation={{ required: 'ETP required' }}
                            error={errors['etp']?.message as string | undefined}
                            options={etpSelectOptions}
                            colSpan={{ base: 2, md: 1 }}
                            isFetchingOptions={isEtpLoading}
                        />
                        <NativeSelectField
                            key={'ecmi'}
                            name={'ecmi'}
                            required={true}
                            label={'ECMI'}
                            tooltip={
                                'ECMI will be pre-populated once you select the ETP'
                            }
                            register={register}
                            validation={{ required: 'ECMI required' }}
                            error={
                                errors['ecmi']?.message as string | undefined
                            }
                            options={[
                                { displayText: 'Yes', value: true },
                                { displayText: 'No', value: false }
                            ]}
                            colSpan={{ base: 2, md: 1 }}
                        />
                    </>
                ) : null}
                <TextField
                    key={'title'}
                    name={'title'}
                    required={true}
                    label={'Initiative Title'}
                    placeholder='e.g. Buyer to Supplier Payments'
                    tooltip={'Title of item to onboard.'}
                    register={register}
                    validation={{ required: 'Title required' }}
                    trigger={trigger}
                    setValidating={setValidating}
                    isValidating={validatingFields['title'] === true}
                    error={errors['title']?.message as string | undefined}
                    runAsyncValidationOnBlur={false}
                    colSpan={{ base: 2, md: 1 }}
                />
                <TextField
                    key={'years'}
                    name={'years'}
                    required={true}
                    label={'Years'}
                    placeholder='e.g. 2023, 2024'
                    tooltip={'Enter the years for your Initiative'}
                    register={register}
                    validation={{
                        required: 'Years required',
                        validate: (value: string) => {
                            const years = value.split(',')
                            for (let i = 0; i < years.length; i++) {
                                if (years[i] === '') {
                                    continue
                                }
                                if (!/^[1-9]\d*$/.test(years[i].trim())) {
                                    return 'Please enter valid years.'
                                }
                            }
                            return true
                        }
                    }}
                    trigger={trigger}
                    setValidating={setValidating}
                    isValidating={validatingFields['years'] === true}
                    error={errors['years']?.message as string | undefined}
                    runAsyncValidationOnBlur={false}
                    colSpan={{ base: 2, md: 1 }}
                />
                <NativeSelectField
                    key={'initiativeCategory'}
                    name={'initiativeCategory'}
                    required={false}
                    label={'Initiative Category'}
                    tooltip={'Select a category (optional)'}
                    placeholder='-- Optional --'
                    register={register}
                    validation={{}}
                    error={
                        errors['initiativeCategory']?.message as
                            | string
                            | undefined
                    }
                    options={initiativeCategorySelectOptions}
                    colSpan={{ base: 2 }}
                    isFetchingOptions={isInitiativeCategoryLoading}
                />
                <NativeSelectField
                    key={'businessUnit'}
                    name={'businessUnit'}
                    required={true}
                    label={'Business Unit'}
                    tooltip={'Business Unit of item to onboard.'}
                    placeholder='-- Choose one --'
                    register={register}
                    validation={{ required: 'Business Unit required' }}
                    error={
                        errors['businessUnit']?.message as string | undefined
                    }
                    options={businessUnitSelectOptions}
                    colSpan={{ base: 2, md: 1 }}
                    isFetchingOptions={isBusinessUnitLoading}
                />
                <TypeaheadField
                    key={'unitCIO'}
                    name={'unitCIO'}
                    required={true}
                    placeholder={'eg: hilary.packer@aexp.com'}
                    tooltip={'Unit CIO of item to onboard.'}
                    label={'Unit CIO'}
                    control={control}
                    fetcher={fetchUnitCioListByEmail}
                    mapResponseToItems={response => {
                        return response ? response : []
                    }}
                    itemToString={item =>
                        (
                            item as GraphAPIUser
                        )?.userPrincipalName?.toLocaleLowerCase() ?? ''
                    }
                    colSpan={{ base: 2, md: 1 }}
                    rules={{
                        required: 'At least one Unit CIO is required'
                    }}
                    autoFetch={true}
                />
                <TypeaheadField
                    key={'eaLead'}
                    name={'eaLead'}
                    required={false}
                    label={'EA Lead'}
                    placeholder={'Alex Firsikov'}
                    tooltip={'Select the EA Lead(s)'}
                    control={control}
                    fetcher={fetchEaLeads}
                    mapResponseToItems={response => {
                        return response ? response : []
                    }}
                    itemToString={item => (item as string) ?? ''}
                    colSpan={{ base: 2, md: 1 }}
                    autoFetch={true}
                />
                <TypeaheadField
                    key={'engLead'}
                    name={'engLead'}
                    required={false}
                    label={'Engineering Lead'}
                    placeholder={'alex.firsikov@aexp.com'}
                    tooltip={'Engineering Lead(s) of item to onboard.'}
                    control={control}
                    fetcher={fetchEmployeesByEmail}
                    mapResponseToItems={response => {
                        return response ? response : []
                    }}
                    itemToString={item =>
                        (
                            item as GraphAPIUser
                        )?.userPrincipalName?.toLocaleLowerCase() ?? ''
                    }
                    colSpan={{ base: 2, md: 1 }}
                />
                <TextField
                    key={'repoName'}
                    name={'repoName'}
                    required={true}
                    label={'Repository Name'}
                    placeholder='repository-name'
                    tooltip={'Playbook Github Repository Name.'}
                    register={register}
                    validation={{
                        required: 'Repository name required',
                        validate: async (value: string) => {
                            const result = await refetchRepo()
                            const status = result.data?.status

                            if (status === 404) {
                                return 'Repository ' + value + ' not found'
                            } else if (status === 200) {
                                return true
                            } else {
                                return 'Error validating repository. Please try again later'
                            }
                        }
                    }}
                    trigger={trigger}
                    setValidating={setValidating}
                    isValidating={validatingFields['repoName'] === true}
                    error={errors['repoName']?.message as string | undefined}
                    runAsyncValidationOnBlur={true}
                    colSpan={{ base: 2, md: 1 }}
                />
                <TextField
                    key={'docsRoot'}
                    name={'docsRoot'}
                    required={false}
                    label={'EA Playbook Directory'}
                    placeholder='path/to/workproducts'
                    tooltip={'Path to Documentation Folder within Github Repo.'}
                    register={register}
                    validation={{
                        validate: async (value: string) => {
                            const result = await refetchDocsRoot()
                            const status = result.data?.status

                            if (status === 404) {
                                return (
                                    'Playbook directory ' +
                                    value +
                                    ' not found in repository ' +
                                    repoName
                                )
                            } else if (status === 200) {
                                return true
                            } else {
                                return 'Error validating playbook directory. Please try again later'
                            }
                        }
                    }}
                    trigger={trigger}
                    setValidating={setValidating}
                    isValidating={validatingFields['docsRoot'] === true}
                    error={errors['docsRoot']?.message as string | undefined}
                    runAsyncValidationOnBlur={false}
                    colSpan={{ base: 2, md: 1 }}
                />
                <TypeaheadField
                    key={'initiativeFrameworks'}
                    name={'initiativeFrameworks'}
                    required={false}
                    label={'Foundational Technologies'}
                    placeholder={
                        'eg: Admin & Security, Business Intelligence, Content Management'
                    }
                    tooltip={
                        'Select the tools (i.e. Foundational Technologies) that will be utilized in your initiative'
                    }
                    control={control}
                    fetcher={fetchFoundationalTechnologyCategories}
                    mapResponseToItems={response => {
                        return response ? response : []
                    }}
                    itemToString={item => (item as string) ?? ''}
                    colSpan={{ base: 2, md: 1 }}
                    autoFetch={true}
                />
                <TypeaheadField
                    key={'contactInfo'}
                    name={'contactInfo'}
                    required={true}
                    label={'Contact Information'}
                    placeholder={'employees@example.com'}
                    tooltip={
                        'Business emails of contacts & team distribution list.'
                    }
                    control={control}
                    fetcher={fetchEmployeesByEmail}
                    mapResponseToItems={response => {
                        return response ? response : []
                    }}
                    itemToString={item =>
                        (
                            item as GraphAPIUser
                        )?.userPrincipalName?.toLocaleLowerCase() ?? ''
                    }
                    colSpan={{ base: 2, md: 1 }}
                    rules={{
                        required: 'At least one contact is required'
                    }}
                />
                <GridItem colSpan={2}>
                    <Button
                        type='submit'
                        colorPalette='blue'
                        variant='solid'
                        size='sm'
                    >
                        Submit
                    </Button>
                </GridItem>
            </Grid>
            {isSubmitting && <LoadingSpinner />}
            {isSubmitted && mutation.isSuccess && (
                <SuccessDialog title={title} repoType={activeFormDisplayText} />
            )}
            {showErrorDialog && (
                <ErrorDialog
                    error={errorDialogMessage}
                    onClose={() => {
                        setShowErrorDialog(false)
                        setErrorDialogMessage('')
                        reset(undefined, { keepDirtyValues: true })
                    }}
                />
            )}
        </>
    )

    return children({
        firstField,
        restFields,
        onSubmit: handleSubmit(onSubmit)
    })
}
