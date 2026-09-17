/* istanbul ignore file */
'use client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button, Grid, GridItem } from '@chakra-ui/react'
import { TextField } from './TextField'
import { NativeSelectField } from './NativeSelectField'
import { useEffect, useState } from 'react'
import {
    LayoutRenderer,
    FoundationalTechnologyFormValues,
    GraphAPIUser
} from '@/app/onboarding-form/types'
import {
    useBusinessUnitList,
    useRepoExists,
    useFrameworkCategories
} from '@/app/onboarding-form/hooks'
import { useCreatePlaybook } from '@/hooks'
import { TypeaheadField } from './TypeaheadField'
import {
    fetchUnitCioListByEmail,
    fetchEmployeesByEmail,
    fetchEaLeads,
    extractFrameworkCategorySelectOptions,
    extractBusinessUnitSelectOptions,
    generateDocsRoot,
    generateFoundationalTechnologyPlaybook
} from '@/app/onboarding-form/utils'
import { PLAYBOOK_TYPE_IDS, SOURCE_HOST } from '@/constants'
import { ErrorDialog, SuccessDialog } from './OnboardingDialog'
import { LoadingSpinner } from '@/components/ui'

type FoundationalTechnologyFormProps = {
    children: LayoutRenderer
    activeFormDisplayText: string
    adsId?: string
    email?: string
}

export const FoundationalTechnologyForm: React.FC<
    FoundationalTechnologyFormProps
> = ({ children, activeFormDisplayText, adsId = '', email = '' }) => {
    const {
        control,
        register,
        handleSubmit,
        trigger,
        watch,
        reset,
        formState
    } = useForm<FoundationalTechnologyFormValues>({
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

    const { data: ftCategory, isLoading: isFtCategoryLoading } =
        useFrameworkCategories()
    const ftCategorySelectOptions =
        extractFrameworkCategorySelectOptions(ftCategory)

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
        generateDocsRoot(docsRoot, PLAYBOOK_TYPE_IDS.FOUNDATIONAL_TECHNOLOGY),
        repoSourceHost
    )

    const mutation = useCreatePlaybook()
    const [showErrorDialog, setShowErrorDialog] = useState(false)
    const [errorDialogMessage, setErrorDialogMessage] = useState('')

    const onSubmit: SubmitHandler<FoundationalTechnologyFormValues> = (
        values: FoundationalTechnologyFormValues
    ) => {
        if (confirm('Confirm Onboarding Request Submission?')) {
            const ftCategoryName =
                ftCategory?.find(x => x.value === values.ftCategory)
                    ?.displayText || ''
            const playbook = generateFoundationalTechnologyPlaybook(
                values,
                adsId || '',
                activeFormDisplayText,
                ftCategoryName,
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
            key={'ftCategory'}
            name={'ftCategory'}
            required={true}
            label={'Foundational Technology Category'}
            placeholder='-- Choose one --'
            tooltip={'Select a category'}
            register={register}
            validation={{
                required: 'Foundational Technology Category required'
            }}
            error={errors['ftCategory']?.message as string | undefined}
            options={ftCategorySelectOptions}
            colSpan={{ base: 2, md: 1 }}
            isFetchingOptions={isFtCategoryLoading}
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
                    label={'Foundational Technology Title'}
                    placeholder='e.g. Buyer to Supplier Payments'
                    tooltip={'Title of item to onboard.'}
                    register={register}
                    validation={{ required: 'Title required' }}
                    trigger={trigger}
                    setValidating={setValidating}
                    isValidating={validatingFields['title'] === true}
                    error={errors['title']?.message as string | undefined}
                    runAsyncValidationOnBlur={false}
                    colSpan={{ base: 2 }}
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
                    colSpan={{ base: 2 }}
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
