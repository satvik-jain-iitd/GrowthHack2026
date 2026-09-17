import React, { useMemo } from 'react'
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Text,
    SimpleGrid
} from '@chakra-ui/react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useUserContext } from '@/context'
import { TypeaheadField } from '@/app/onboarding-form/components'
import { TextField } from '@/app/onboarding-form/components/TextField'
import { NativeSelectField } from '@/app/onboarding-form/components/NativeSelectField'
import { DatepickerField } from '@/app/onboarding-form/components/DatepickerField'
import {
    fetchEmployeesAndContractorsByEmail,
    fetchStakeholdersByEmail,
    fetchEaArchitectByEmail
} from '@/app/onboarding-form/utils'
import { GraphAPIUser } from '@/app/onboarding-form/types'
import { useAddAdr } from '@/app/docs/hooks/useAddAdr'
import { ADR_TYPE_OPTIONS } from '@/constants/adrTypes'
import { usePlaybook } from '@/hooks'
import { PLAYBOOK_TYPE_IDS } from '@/constants'
import { getStatusByTask } from '@/app/build-vs-buys/components/StatusBadge'
import {
    ADR_ACTOR_OVERLAP_ERROR_MESSAGE,
    validateNoOverlap
} from '@/app/adrs/utils/adrValidation'

export default function RegisterADRButton({
    playbookId,
    repo,
    fileId,
    fileName,
    playbookTypeId
}: {
    playbookId: string
    repo: string
    fileId: string
    fileName: string
    playbookTypeId?: string
}) {
    const user = useUserContext()
    const [isOpen, setIsOpen] = useState(false)
    const [validatingFields, setValidatingFields] = useState<
        Record<string, boolean>
    >({})
    const setValidating = (name: string, v: boolean) =>
        setValidatingFields(s => ({ ...s, [name]: v }))

    const isBvB = playbookTypeId === PLAYBOOK_TYPE_IDS.BUILD_VS_BUY
    const { data: playbookData } = usePlaybook(playbookId)

    const bvbMetadata = useMemo(() => {
        if (!isBvB || !playbookData) return null
        const da = playbookData.add_da as Record<string, unknown>
        const jsonContent = JSON.parse(JSON.stringify(da))
        const workflow = (jsonContent.workflowData || {}) as Record<
            string,
            unknown
        >
        const actors = (workflow.actors || {}) as Record<string, string[]>
        let bvbStatus: string | undefined
        if (workflow.currentTask) {
            bvbStatus = getStatusByTask(
                (workflow.currentTask as Record<string, string>).step,
                workflow as Record<string, string | boolean>
            )
        } else {
            bvbStatus = jsonContent.status as string | undefined
        }
        const bvbToAdrStatus: Record<string, string> = {
            awaitingAcceptance: 'IN_PROGRESS',
            inProgress: 'IN_PROGRESS',
            inReview: 'UNDER_REVIEW',
            awaitingApproval: 'AWAITING_APPROVAL',
            approved: 'APPROVED',
            rejected: 'IN_PROGRESS'
        }
        return {
            reviewers: (actors.reviewers ??
                (jsonContent.reviewers as string[]) ??
                []) as string[],
            deciders: (actors.deciders ??
                (jsonContent.deciders as string[]) ??
                []) as string[],
            eaArchitects: ((jsonContent.eaArchitect as string[]) ??
                []) as string[],
            status: (bvbStatus && bvbToAdrStatus[bvbStatus]) || 'IN_PROGRESS',
            adrType: playbookTypeId || '',
            completedAt: (workflow.completedAt as string | null) ?? undefined
        }
    }, [isBvB, playbookData, playbookTypeId])

    const {
        control,
        register,
        handleSubmit,
        reset,
        trigger,
        formState: { errors }
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            adrName: fileName,
            reviewers: [] as string[],
            deciders: [] as string[],
            eaArchitects: [] as string[],
            status: 'IN_PROGRESS',
            approvedDate: undefined as Date | undefined,
            adrType: playbookTypeId || ''
        }
    })

    React.useEffect(() => {
        if (isOpen && bvbMetadata) {
            reset(prev => ({
                ...prev,
                reviewers: bvbMetadata.reviewers,
                deciders: bvbMetadata.deciders,
                eaArchitects: bvbMetadata.eaArchitects,
                status: bvbMetadata.status,
                adrType: bvbMetadata.adrType,
                approvedDate: bvbMetadata.completedAt
                    ? new Date(bvbMetadata.completedAt)
                    : prev.approvedDate
            }))
        }
    }, [isOpen, bvbMetadata, reset])

    const { mutate, isPending } = useAddAdr()

    const status = useWatch({ control, name: 'status' })
    const watchedReviewers = useWatch({ control, name: 'reviewers' })
    const watchedDeciders = useWatch({ control, name: 'deciders' })

    const onSubmit = (data: {
        adrName: string
        reviewers: string[]
        deciders: string[]
        eaArchitects: string[]
        status: string
        approvedDate?: Date
        adrType?: string
    }) => {
        mutate(
            {
                playbookId,
                repo,
                adrName: data.adrName,
                reviewers: data.reviewers,
                deciders: data.deciders,
                eaArchitects: data.eaArchitects,
                requester: user?.attributes.email || '',
                user: {
                    fullName: user?.attributes.fullName || '',
                    email: user?.attributes.email || ''
                },
                status: data.status,
                approvedDate: data.approvedDate
                    ? data.approvedDate.toISOString().slice(0, 10)
                    : undefined,
                fileId,
                adr_type: data.adrType
            },
            {
                onSuccess: () => {
                    setIsOpen(false)
                    reset()
                }
            }
        )
    }

    return (
        <>
            <Dialog.Root
                size={'xl'}
                placement={'top'}
                motionPreset={'slide-in-bottom'}
                open={isOpen}
            >
                <Dialog.Trigger>
                    <Box
                        data-testid={
                            !isOpen ? 'register-adr-trigger-button' : undefined
                        }
                        borderWidth='1px'
                        borderRadius='md'
                        transition='border-color 0.2s'
                        _dark={{ bg: 'bg.muted' }}
                        _hover={{ borderColor: 'fg.info' }}
                        width='100%'
                        height='100%'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        cursor={isPending ? 'not-allowed' : 'pointer'}
                        opacity={isPending ? 0.6 : 1}
                        onClick={() => setIsOpen(true)}
                        my={4}
                    >
                        <Text p={2} color={'fg'}>
                            {isPending ? 'Registering...' : 'Register ADR'}
                        </Text>
                    </Box>
                </Dialog.Trigger>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Register Existing ADR</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Box
                                as={'form'}
                                id='register-adr-form'
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <SimpleGrid columns={2} gap={8}>
                                    <TextField
                                        name='adrName'
                                        required={true}
                                        label='ADR Name'
                                        placeholder='e.g. Decision Record for X'
                                        register={register}
                                        validation={{
                                            required: 'ADR Name is required'
                                        }}
                                        error={
                                            errors['adrName']?.message as
                                                | string
                                                | undefined
                                        }
                                        trigger={trigger}
                                        setValidating={setValidating}
                                        isValidating={
                                            validatingFields['adrName']
                                        }
                                        disabled={!!bvbMetadata}
                                    />
                                    <TypeaheadField
                                        name='reviewers'
                                        required={true}
                                        placeholder='eg: amex.aexp.com'
                                        tooltip='Who will be reviewing your ADR and giving feedback?'
                                        label='Reviewer(s)'
                                        control={control}
                                        fetcher={
                                            fetchEmployeesAndContractorsByEmail
                                        }
                                        mapResponseToItems={response =>
                                            response ? response : []
                                        }
                                        itemToString={item =>
                                            (
                                                item as GraphAPIUser
                                            )?.userPrincipalName?.toLocaleLowerCase() ??
                                            ''
                                        }
                                        rules={{
                                            required:
                                                'At least one Reviewer is required',
                                            validate: (value: string[]) =>
                                                validateNoOverlap(
                                                    value,
                                                    watchedDeciders,
                                                    ADR_ACTOR_OVERLAP_ERROR_MESSAGE
                                                )
                                        }}
                                        disabled={!!bvbMetadata}
                                    />
                                    <TypeaheadField
                                        name='deciders'
                                        required={true}
                                        placeholder='eg: amex.aexp.com'
                                        tooltip='Who will be deciding if the ADR is approved or rejected?'
                                        label='Decider(s)'
                                        control={control}
                                        fetcher={fetchStakeholdersByEmail}
                                        mapResponseToItems={response =>
                                            response ? response : []
                                        }
                                        itemToString={item =>
                                            (
                                                item as GraphAPIUser
                                            )?.userPrincipalName?.toLocaleLowerCase() ??
                                            ''
                                        }
                                        rules={{
                                            required:
                                                'At least one Decider is required',
                                            validate: (value: string[]) =>
                                                validateNoOverlap(
                                                    value,
                                                    watchedReviewers,
                                                    ADR_ACTOR_OVERLAP_ERROR_MESSAGE
                                                )
                                        }}
                                        disabled={!!bvbMetadata}
                                    />
                                    <TypeaheadField
                                        name='eaArchitects'
                                        required={true}
                                        placeholder='eg: amex.aexp.com'
                                        tooltip='Which EA Architects will be working on this ADR?'
                                        label='EA Architect(s)'
                                        control={control}
                                        fetcher={fetchEaArchitectByEmail}
                                        mapResponseToItems={response =>
                                            response ? response : []
                                        }
                                        itemToString={item =>
                                            (
                                                item as GraphAPIUser
                                            )?.userPrincipalName?.toLocaleLowerCase() ??
                                            ''
                                        }
                                        rules={{
                                            required:
                                                'At least one EA Architect is required'
                                        }}
                                        disabled={!!bvbMetadata}
                                    />
                                    <NativeSelectField
                                        name='status'
                                        label='Status'
                                        required={true}
                                        register={register}
                                        validation={{
                                            required: 'Status is required'
                                        }}
                                        error={
                                            errors.status?.message as
                                                | string
                                                | undefined
                                        }
                                        disabled={!!bvbMetadata}
                                        options={[
                                            {
                                                value: '',
                                                displayText: 'Select status',
                                                disabled: true
                                            },
                                            {
                                                value: 'IN_PROGRESS',
                                                displayText: 'In progress'
                                            },
                                            {
                                                value: 'UNDER_REVIEW',
                                                displayText: 'Under review'
                                            },
                                            {
                                                value: 'AWAITING_APPROVAL',
                                                displayText: 'Awaiting approval'
                                            },
                                            {
                                                value: 'APPROVED',
                                                displayText: 'Approved'
                                            }
                                        ]}
                                    />
                                    <NativeSelectField
                                        name='adrType'
                                        label='ADR Type'
                                        required={true}
                                        register={register}
                                        validation={{
                                            required: 'ADR Type is required'
                                        }}
                                        error={
                                            errors.adrType?.message as
                                                | string
                                                | undefined
                                        }
                                        disabled={!!bvbMetadata}
                                        options={[
                                            {
                                                value: '',
                                                displayText: 'Select ADR Type',
                                                disabled: true
                                            },
                                            {
                                                value: PLAYBOOK_TYPE_IDS.BUILD_VS_BUY,
                                                displayText: 'Build vs Buy',
                                                disabled: !isBvB
                                            },
                                            ...ADR_TYPE_OPTIONS.filter(
                                                option =>
                                                    option.value !==
                                                    PLAYBOOK_TYPE_IDS.BUILD_VS_BUY
                                            )
                                        ]}
                                    />
                                    {status === 'APPROVED' && (
                                        <DatepickerField
                                            name='approvedDate'
                                            label='Approved Date'
                                            required={true}
                                            control={control}
                                            rules={{
                                                required:
                                                    'Approved date is required'
                                            }}
                                            colSpan={1}
                                            disabled={
                                                !!bvbMetadata?.completedAt
                                            }
                                        />
                                    )}
                                </SimpleGrid>
                            </Box>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    variant='outline'
                                    onClick={() => setIsOpen(false)}
                                >
                                    Close
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                type='submit'
                                colorPalette='blue'
                                variant='solid'
                                size='md'
                                disabled={
                                    isPending || Object.keys(errors).length > 0
                                }
                                form='register-adr-form'
                            >
                                {isPending ? 'Submitting...' : 'Submit'}
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size='sm' />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    )
}
