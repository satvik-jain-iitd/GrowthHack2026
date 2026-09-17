/* istanbul ignore file */
'use client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button, Grid, GridItem } from '@chakra-ui/react'
import { TextField } from './TextField'
import { NativeSelectField } from './NativeSelectField'
import { useEffect, useState } from 'react'
import {
    LayoutRenderer,
    BuildBuyFormValues,
    GraphAPIUser,
    Option
} from '@/app/onboarding-form/types'
import {
    useGetBvBPlaybooksTitles,
    useRepoExists
} from '@/app/onboarding-form/hooks'
import { useCreatePlaybook } from '@/hooks'
import { TypeaheadField } from './TypeaheadField'
import {
    fetchEmployeesAndContractorsByEmail,
    fetchStakeholdersByEmail,
    fetchOwnersByEmail,
    fetchEaArchitectByEmail,
    fetchPrimaryCompanyDomains,
    generateDocsRoot,
    generateBuildBuyPlaybook
} from '@/app/onboarding-form/utils'
import { PLAYBOOK_TYPE_IDS, SOURCE_HOST } from '@/constants'
import { ErrorDialog, SuccessDialog } from './OnboardingDialog'
import { TextareaField } from './TextareaField'
import { DatepickerField } from './DatepickerField'
import { LoadingSpinner } from '@/components/ui'

type BuildBuyFormProps = {
    children: LayoutRenderer
    activeFormDisplayText: string
    adsId?: string
    email?: string
}

export const BuildBuyForm: React.FC<BuildBuyFormProps> = ({
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
    } = useForm<BuildBuyFormValues>({
        mode: 'onBlur',
        defaultValues: { isExistingDocs: 'false', prim_pfrm_nm: [] }
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

    const isExistingDocs = watch('isExistingDocs')

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
        generateDocsRoot(docsRoot, PLAYBOOK_TYPE_IDS.BUILD_VS_BUY),
        repoSourceHost
    )

    const { bvbTitlesSet } = useGetBvBPlaybooksTitles()

    const mutation = useCreatePlaybook()
    const [showErrorDialog, setShowErrorDialog] = useState(false)
    const [errorDialogMessage, setErrorDialogMessage] = useState('')

    const onSubmit: SubmitHandler<BuildBuyFormValues> = (
        values: BuildBuyFormValues
    ) => {
        if (confirm('Confirm Onboarding Request Submission?')) {
            const playbook = generateBuildBuyPlaybook(
                values,
                adsId || '',
                email,
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

    const firstField = (
        // TODO title needs validation.. detailed in onenote
        <TextField
            key={'title'}
            name={'title'}
            required={true}
            label={'BuildBuy Title'}
            placeholder='e.g. Buyer to Supplier Payments'
            tooltip={'Title of item to onboard.'}
            register={register}
            validation={{
                required: 'Title required',
                validate: (value: string) => {
                    if (
                        bvbTitlesSet.has(
                            value
                                .trim()
                                .replaceAll(' ', '-')
                                .toLowerCase()
                                .replace(/[^a-zA-Z0-9._-]/g, '')
                                .replace(/\s/g, '')
                        )
                    ) {
                        return 'A Build vs Buy with this title already exists'
                    }
                }
            }}
            trigger={trigger}
            setValidating={setValidating}
            isValidating={validatingFields['title'] === true}
            error={errors['title']?.message as string | undefined}
            runAsyncValidationOnBlur={false}
            colSpan={{ base: 2, md: 1 }}
        />
    )

    const title = watch('title')

    const restFields = (
        <>
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={6}
            >
                <NativeSelectField
                    key={'etpImpacting'}
                    name={'etpImpacting'}
                    required={false}
                    label={'ECMI/ETP Impacting?'}
                    placeholder='-- Optional --'
                    tooltip={'Does this impact a ETP or ECMI?'}
                    register={register}
                    error={
                        errors['etpImpacting']?.message as string | undefined
                    }
                    options={[
                        { displayText: 'Yes', value: true },
                        { displayText: 'No', value: false }
                    ]}
                    colSpan={{ base: 2, md: 1 }}
                />
                <NativeSelectField
                    key={'overallRisk'}
                    name={'overallRisk'}
                    required={false}
                    label={'Preliminary Inherent Risk'}
                    placeholder='-- Optional --'
                    tooltip={'Overall preliminary inherent risk level.'}
                    register={register}
                    error={errors['overallRisk']?.message as string | undefined}
                    options={[
                        { displayText: 'Critical', value: 'critical' },
                        { displayText: 'High', value: 'high' },
                        { displayText: 'Medium', value: 'medium' },
                        { displayText: 'Low', value: 'low' }
                    ]}
                    colSpan={{ base: 2, md: 1 }}
                />
                <TextField
                    key={'estimatedCost'}
                    name={'estimatedCost'}
                    required={true}
                    label={'Estimated Cost'}
                    placeholder='e.g. 100000'
                    tooltip={'What is the estimated Build/Procurement cost'}
                    register={register}
                    validation={{
                        required: 'Estimated cost required',
                        validate: (value: string) => {
                            const isNumber =
                                !isNaN(Number(value)) && value.trim() !== ''
                            if (!isNumber) {
                                return 'Estimated Cost must be a valid number'
                            }
                        }
                    }}
                    trigger={trigger}
                    setValidating={setValidating}
                    isValidating={validatingFields['estimatedCost'] === true}
                    error={
                        errors['estimatedCost']?.message as string | undefined
                    }
                    runAsyncValidationOnBlur={false}
                    colSpan={{ base: 2, md: 1 }}
                />
                <NativeSelectField
                    key={'isExistingDocs'}
                    name={'isExistingDocs'}
                    required={true}
                    label={'Existing Documentation?'}
                    tooltip={
                        'Do you have a repo with existing Build vs Buy documentation?'
                    }
                    register={register}
                    error={
                        errors['isExistingDocs']?.message as string | undefined
                    }
                    options={[
                        { displayText: 'No', value: 'false' },
                        { displayText: 'Yes', value: 'true' }
                    ]}
                    colSpan={{ base: 2, md: 1 }}
                />
                {isExistingDocs === 'true' && (
                    <>
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
                                        return (
                                            'Repository ' + value + ' not found'
                                        )
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
                            error={
                                errors['repoName']?.message as
                                    | string
                                    | undefined
                            }
                            runAsyncValidationOnBlur={true}
                            colSpan={{ base: 2, md: 1 }}
                        />
                        <TextField
                            key={'docsRoot'}
                            name={'docsRoot'}
                            required={false}
                            label={'EA Playbook Directory'}
                            placeholder='path/to/workproducts'
                            tooltip={
                                'Path to Documentation Folder within Github Repo.'
                            }
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
                            error={
                                errors['docsRoot']?.message as
                                    | string
                                    | undefined
                            }
                            runAsyncValidationOnBlur={false}
                            colSpan={{ base: 2, md: 1 }}
                        />
                    </>
                )}
                <DatepickerField
                    key={'targetedEndDate'}
                    name={'targetedEndDate'}
                    required={true}
                    label={'Targeted End Date'}
                    tooltip={'Select the targeted end date'}
                    control={control}
                    rules={{ required: 'Targeted End Date is required' }}
                    colSpan={{ base: 2, md: 1 }}
                />
                <TypeaheadField
                    key={'requester'}
                    name={'requester'}
                    required={true}
                    placeholder={'eg: contact1@aexp.com'}
                    tooltip={
                        'Email of the person who requested the Build vs Buy'
                    }
                    label={'Requester'}
                    control={control}
                    fetcher={fetchEmployeesAndContractorsByEmail}
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
                        required: 'At least one Requester is required'
                    }}
                />
                <TypeaheadField
                    key={'reviewers'}
                    name={'reviewers'}
                    required={true}
                    placeholder={'eg: contact1@aexp.com'}
                    tooltip={
                        'Who will be reviewing your Build vs Buy and giving feedback?'
                    }
                    label={'Reviewer(s)'}
                    control={control}
                    fetcher={fetchEmployeesAndContractorsByEmail}
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
                        required: 'At least one Reviewer is required'
                    }}
                />
                <TypeaheadField
                    key={'deciders'}
                    name={'deciders'}
                    required={true}
                    placeholder={'eg: contact1@aexp.com'}
                    tooltip={
                        'Who will be deciding if the Build vs Buy is approved or rejected?'
                    }
                    label={'Decider(s)'}
                    control={control}
                    fetcher={fetchStakeholdersByEmail}
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
                        required: 'At least one Decider is required'
                    }}
                />
                <TypeaheadField
                    key={'owners'}
                    name={'owners'}
                    required={true}
                    placeholder={'eg: hilary.packer@aexp.com'}
                    tooltip={'Who will own this Build vs Buy?'}
                    label={'Owner(s)'}
                    control={control}
                    fetcher={fetchOwnersByEmail}
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
                        required: 'At least one Owner is required'
                    }}
                />
                <TypeaheadField
                    key={'stakeholders'}
                    name={'stakeholders'}
                    required={true}
                    placeholder={'eg: contact1@aexp.com'}
                    tooltip={'Band 45+ who are invested in this Build vs Buy'}
                    label={'Stakeholders'}
                    control={control}
                    fetcher={fetchStakeholdersByEmail}
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
                        required: 'At least one Stakeholder is required'
                    }}
                />
                <TypeaheadField
                    key={'eaArchitects'}
                    name={'eaArchitects'}
                    required={true}
                    placeholder={'eg: contact1@aexp.com'}
                    tooltip={
                        'Which EA Architects will be working on this Build vs Buy?'
                    }
                    label={'EA Architect(s)'}
                    control={control}
                    fetcher={fetchEaArchitectByEmail}
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
                        required: 'At least one EA Architect is required'
                    }}
                />
                <TypeaheadField
                    key={'prim_pfrm_nm'}
                    name={'prim_pfrm_nm'}
                    required={false}
                    placeholder={'eg: Digital Acquisition (Consumer)'}
                    tooltip={'Primary company domains of item to onboard.'}
                    label={'Primary Company Domains'}
                    control={control}
                    fetcher={fetchPrimaryCompanyDomains}
                    mapResponseToItems={response => {
                        return response ? response : []
                    }}
                    itemToString={item =>
                        (item as Option)?.displayText?.toLocaleLowerCase() ?? ''
                    }
                    itemToValue={item => {
                        const value = (item as Option)?.value
                        return typeof value === 'string'
                            ? value.toLocaleLowerCase()
                            : String(value ?? '')
                    }}
                    colSpan={{ base: 2 }}
                    autoFetch={true}
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
