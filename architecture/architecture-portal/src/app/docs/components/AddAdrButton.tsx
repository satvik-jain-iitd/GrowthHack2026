import React, { useState, useMemo } from 'react'
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Text,
    SimpleGrid
} from '@chakra-ui/react'
import { IconPlusCircle } from '@americanexpress/dls-icons'
import { useAddAdr } from '@/app/docs/hooks/useAddAdr'
import { useForm, useWatch } from 'react-hook-form'
import {
    fetchEmployeesAndContractorsByEmail,
    fetchStakeholdersByEmail,
    fetchEaArchitectByEmail
} from '@/app/onboarding-form/utils'
import { GraphAPIUser } from '@/app/onboarding-form/types'
import { TypeaheadField } from '@/app/onboarding-form/components'
import { TextField } from '@/app/onboarding-form/components/TextField'
import { NativeSelectField } from '@/app/onboarding-form/components/NativeSelectField'
import { useUserContext } from '@/context'
import { ADR_TYPE_OPTIONS } from '@/constants/adrTypes'
import { usePlaybook } from '@/hooks'
import { PLAYBOOK_TYPE_IDS } from '@/constants'
import {
    ADR_ACTOR_OVERLAP_ERROR_MESSAGE,
    validateNoOverlap
} from '@/app/adrs/utils/adrValidation'

export default function AddAdrButton({
    playbookId,
    repo,
    text,
    playbookTypeId
}: {
    playbookId: string
    repo: string
    text?: boolean
    playbookTypeId?: string
}) {
    const { mutate, isPending } = useAddAdr()
    const user = useUserContext()
    const [isOpen, setIsOpen] = useState(false)

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
        return {
            reviewers: (actors.reviewers ??
                (jsonContent.reviewers as string[]) ??
                []) as string[],
            deciders: (actors.deciders ??
                (jsonContent.deciders as string[]) ??
                []) as string[],
            eaArchitects: ((jsonContent.eaArchitect as string[]) ??
                []) as string[]
        }
    }, [isBvB, playbookData])

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
            adrName: '',
            reviewers: [] as string[],
            deciders: [] as string[],
            eaArchitects: [] as string[],
            adr_type: playbookTypeId ?? ''
        }
    })

    React.useEffect(() => {
        if (isOpen && bvbMetadata) {
            reset(prev => ({
                ...prev,
                reviewers: bvbMetadata.reviewers,
                deciders: bvbMetadata.deciders,
                eaArchitects: bvbMetadata.eaArchitects
            }))
        }
    }, [isOpen, bvbMetadata, reset])
    const [validatingFields, setValidatingFields] = useState<
        Record<string, boolean>
    >({})

    const setValidating = (name: string, v: boolean) =>
        setValidatingFields(s => ({ ...s, [name]: v }))

    const watchedReviewers = useWatch({ control, name: 'reviewers' })
    const watchedDeciders = useWatch({ control, name: 'deciders' })

    const onSubmit = (data: {
        adrName: string
        reviewers: string[]
        deciders: string[]
        eaArchitects: string[]
        adr_type?: string
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
                adr_type: data.adr_type || ''
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
                    {text ? (
                        <Text
                            textAlign={'left'}
                            color={'blue.600'}
                            cursor={isPending ? 'not-allowed' : 'pointer'}
                            _hover={
                                isPending ? {} : { textDecoration: 'underline' }
                            }
                            opacity={isPending ? 0.6 : 1}
                            onClick={() => setIsOpen(true)}
                        >
                            {isPending ? 'Adding ADR...' : 'Add ADR'}
                        </Text>
                    ) : (
                        <Box
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
                        >
                            <IconPlusCircle />
                            <Text p={2} color={'fg'}>
                                {isPending ? 'Adding...' : 'Add ADR'}
                            </Text>
                        </Box>
                    )}
                </Dialog.Trigger>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Add new ADR</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Box
                                as={'form'}
                                id='add-adr-form'
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
                                        name='adr_type'
                                        label='ADR Type'
                                        required={true}
                                        register={register}
                                        validation={{
                                            required: 'ADR Type is required'
                                        }}
                                        error={
                                            errors.adr_type?.message as
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
                                form='add-adr-form'
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
