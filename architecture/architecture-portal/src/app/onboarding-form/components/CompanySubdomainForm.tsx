/* istanbul ignore file */
'use client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button, Grid, GridItem } from '@chakra-ui/react'
import { TextField } from './TextField'
import { NativeSelectField } from './NativeSelectField'
import { useEffect, useState } from 'react'
import {
    LayoutRenderer,
    CompanySubdomainFormValues,
    GraphAPIUser
} from '@/app/onboarding-form/types'
import {
    useBusinessUnitList,
    useRepoExists,
    useCompanyDomainList
} from '@/app/onboarding-form/hooks'
import { useCreatePlaybook } from '@/hooks'
import { TypeaheadField } from './TypeaheadField'
import {
    fetchTechOwnersByEmail,
    fetchEmployeesByEmail,
    extractCompanyDomainSelectOptions,
    extractBusinessUnitSelectOptions,
    generateDocsRoot,
    generateCompanySubdomainPlaybook
} from '@/app/onboarding-form/utils'
import { PLAYBOOK_TYPE_IDS, SOURCE_HOST } from '@/constants'
import { ErrorDialog, SuccessDialog } from './OnboardingDialog'
import { TextareaField } from './TextareaField'
import { LoadingSpinner } from '@/components/ui'

type CompanySubdomainFormProps = {
    children: LayoutRenderer
    activeFormDisplayText: string
    adsId?: string
    email?: string
    bandLevel?: string
}

export const CompanySubdomainForm: React.FC<CompanySubdomainFormProps> = ({
    children,
    activeFormDisplayText,
    adsId = '',
    email = '',
    bandLevel = ''
}) => {
    const {
        control,
        register,
        handleSubmit,
        trigger,
        watch,
        reset,
        formState
    } = useForm<CompanySubdomainFormValues>({
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

    const { data: companyDomainOptions, isLoading: isCompanyDomainLoading } =
        useCompanyDomainList()
    const companyDomainSelectOptions =
        extractCompanyDomainSelectOptions(companyDomainOptions)

    const { data: businessUnitOptions, isLoading: isBusinessUnitLoading } =
        useBusinessUnitList()
    const businessUnitSelectOptions =
        extractBusinessUnitSelectOptions(businessUnitOptions)

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
        generateDocsRoot(docsRoot, PLAYBOOK_TYPE_IDS.COMPANY_SUBDOMAIN),
        repoSourceHost
    )

    const mutation = useCreatePlaybook()
    const [showErrorDialog, setShowErrorDialog] = useState(false)
    const [errorDialogMessage, setErrorDialogMessage] = useState('')

    const onSubmit: SubmitHandler<CompanySubdomainFormValues> = (
        values: CompanySubdomainFormValues
    ) => {
        if (confirm('Confirm Onboarding Request Submission?')) {
            const companyDomainName =
                companyDomainOptions?.find(
                    x => x.value === values.companyDomain
                )?.displayText || ''
            const playbook = generateCompanySubdomainPlaybook(
                values,
                adsId || '',
                activeFormDisplayText,
                companyDomainName,
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

    const firstField = (
        <NativeSelectField
            key={'companyDomain'}
            name={'companyDomain'}
            required={true}
            label={'Company Domain'}
            placeholder='-- Choose one --'
            tooltip={'Select a Company Domain'}
            register={register}
            validation={{
                required: 'Company Domain required'
            }}
            error={errors['companyDomain']?.message as string | undefined}
            options={companyDomainSelectOptions}
            colSpan={{ base: 2, md: 1 }}
            isFetchingOptions={isCompanyDomainLoading}
        />
    )

    const title = watch('title')

    const restFields = (
        <>
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={6}
            >
                <TextField
                    key={'title'}
                    name={'title'}
                    required={true}
                    label={'Company Subdomain Title'}
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
                <TypeaheadField
                    key={'techOwner'}
                    name={'techOwner'}
                    required={true}
                    placeholder={'Email of Tech Owner: Band 40+'}
                    tooltip={'Inherited from Company Domain if blank'}
                    label={'Tech Owner'}
                    control={control}
                    fetcher={fetchTechOwnersByEmail}
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
                        required: 'At least one Tech Owner is required'
                    }}
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
                <TextareaField
                    key={'shortDescription'}
                    name={'shortDescription'}
                    required={true}
                    label={'Short Description'}
                    placeholder=''
                    tooltip={
                        'Subdomain description with less than 100 characters'
                    }
                    helperText={'Maximum 100 characters'}
                    height={'50px'}
                    register={register}
                    validation={{
                        required: 'Short Description required',
                        validate: (value: string) => {
                            if (value.length > 100) {
                                return 'Short Description must be less than 100 characters'
                            }
                            return true
                        }
                    }}
                    trigger={trigger}
                    setValidating={setValidating}
                    error={
                        errors['shortDescription']?.message as
                            | string
                            | undefined
                    }
                    runAsyncValidationOnBlur={false}
                    colSpan={{ base: 2 }}
                />
                <TextareaField
                    key={'description'}
                    name={'description'}
                    required={true}
                    label={'Description'}
                    placeholder=''
                    tooltip={'Subdomain Description'}
                    height={'100px'}
                    register={register}
                    validation={{ required: 'Description required' }}
                    trigger={trigger}
                    setValidating={setValidating}
                    error={errors['description']?.message as string | undefined}
                    runAsyncValidationOnBlur={false}
                    colSpan={{ base: 2 }}
                />
                <GridItem colSpan={2}>
                    <Button
                        type='submit'
                        colorPalette='blue'
                        variant='solid'
                        size='sm'
                        disabled={
                            bandLevel === '' || parseInt(bandLevel, 10) < 40
                        }
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
