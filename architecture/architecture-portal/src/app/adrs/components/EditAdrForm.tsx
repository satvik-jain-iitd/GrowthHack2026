'use client'

import React, { useState, useEffect } from 'react'
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Text,
    SimpleGrid
} from '@chakra-ui/react'
import { IconEdit } from '@americanexpress/dls-icons'
import { useEditAdr } from '@/app/adrs/hooks/useEditAdr'
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
import { ADR_TYPE_OPTIONS } from '@/constants/adrTypes'
import { ADR } from '@/app/docs/hooks/useGetADR'
import { useADRRoles } from '@/app/adrs/hooks/useADRRoles'
import { useUserContext } from '@/context'
import {
    ADR_ACTOR_OVERLAP_ERROR_MESSAGE,
    validateNoOverlap
} from '@/app/adrs/utils/adrValidation'

type EditAdrFormProps = {
    adr: ADR
    fileId: string
}

export default function EditAdrForm({ adr, fileId }: EditAdrFormProps) {
    const { mutate, isPending } = useEditAdr()
    const [isOpen, setIsOpen] = useState(false)
    const user = useUserContext()
    const { isRequester, isArchitect } = useADRRoles(adr)

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
            adrName: adr.adr_nm || '',
            reviewers: adr.rev_ctc_da || [],
            deciders: adr.aprv_ctc_da || [],
            eaArchitects: adr.entrpr_archt_ctc_da || [],
            adr_type: adr.adr_type_nm || ''
        }
    })
    const [validatingFields, setValidatingFields] = useState<
        Record<string, boolean>
    >({})

    const setValidating = (name: string, v: boolean) =>
        setValidatingFields(s => ({ ...s, [name]: v }))

    const watchedReviewers = useWatch({ control, name: 'reviewers' })
    const watchedDeciders = useWatch({ control, name: 'deciders' })

    // Reset form with updated ADR data when it changes
    useEffect(() => {
        reset({
            adrName: adr.adr_nm || '',
            reviewers: adr.rev_ctc_da || [],
            deciders: adr.aprv_ctc_da || [],
            eaArchitects: adr.entrpr_archt_ctc_da || [],
            adr_type: adr.adr_type_nm || ''
        })
    }, [adr, reset])

    // Determine which fields can be edited based on workflow status
    const isApproved = adr.wkflow_sta_nm === 'APPROVED'
    const isAwaitingApprovalOrLater =
        adr.wkflow_sta_nm === 'AWAITING APPROVAL' || isApproved
    const isUnderReviewOrLater =
        adr.wkflow_sta_nm === 'UNDER REVIEW' || isAwaitingApprovalOrLater

    const canEdit = isArchitect || isRequester

    if (isApproved || !canEdit) {
        return null
    }

    const onSubmit = (data: {
        adrName: string
        reviewers: string[]
        deciders: string[]
        eaArchitects: string[]
        adr_type?: string
    }) => {
        // Build the update payload only with fields that can be edited
        const updatePayload: {
            adrId: string
            fileId: string
            adrName: string
            reviewers?: string[]
            deciders?: string[]
            eaArchitects: string[]
            adr_type?: string
            user?: string
        } = {
            adrId: adr.adr_mtda_id,
            fileId: fileId,
            adrName: data.adrName,
            eaArchitects: data.eaArchitects,
            adr_type: data.adr_type || '',
            user: user?.attributes.email || '',
            reviewers: adr.rev_ctc_da,
            deciders: adr.aprv_ctc_da
        }

        // Only include reviewers if not locked (not under review or later)
        if (!isUnderReviewOrLater) {
            updatePayload.reviewers = data.reviewers
        }

        // Only include deciders if not locked (not awaiting approval or later)
        if (!isAwaitingApprovalOrLater) {
            updatePayload.deciders = data.deciders
        }

        mutate(updatePayload, {
            onSuccess: () => {
                setIsOpen(false)
                reset()
            }
        })
    }

    return (
        <>
            <Dialog.Root
                size={'xl'}
                placement={'top'}
                motionPreset={'slide-in-bottom'}
                open={isOpen}
                onOpenChange={e => setIsOpen(e.open)}
            >
                <Dialog.Trigger asChild>
                    <Button
                        variant='outline'
                        colorPalette='blue'
                        size='sm'
                        onClick={() => setIsOpen(true)}
                        disabled={isPending}
                        mt={4}
                    >
                        <IconEdit />
                        <Text ml={2}>
                            {isPending ? 'Updating...' : 'Edit ADR'}
                        </Text>
                    </Button>
                </Dialog.Trigger>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Edit ADR</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Box
                                as={'form'}
                                id='edit-adr-form'
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                {(isUnderReviewOrLater ||
                                    isAwaitingApprovalOrLater) && (
                                    <Box
                                        p={3}
                                        mb={4}
                                        bg={{
                                            base: 'blue.50',
                                            _dark: 'blue.950'
                                        }}
                                        borderRadius='md'
                                        borderLeft='4px solid'
                                        borderColor={{
                                            base: 'blue.500',
                                            _dark: 'blue.600'
                                        }}
                                    >
                                        <Text
                                            fontSize='sm'
                                            color={{
                                                base: 'blue.700',
                                                _dark: 'blue.200'
                                            }}
                                            fontWeight='medium'
                                        >
                                            {isAwaitingApprovalOrLater
                                                ? 'Some fields are locked because this ADR is awaiting approval or has been approved.'
                                                : 'Reviewer field is locked because this ADR is under review.'}
                                        </Text>
                                    </Box>
                                )}
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
                                        placeholder='eg: amex@aexp.com'
                                        tooltip={
                                            isUnderReviewOrLater
                                                ? 'Reviewers cannot be changed once ADR is under review'
                                                : 'Who will be reviewing your ADR and giving feedback?'
                                        }
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
                                        disabled={isUnderReviewOrLater}
                                    />
                                    <TypeaheadField
                                        name='deciders'
                                        required={true}
                                        placeholder='eg: amex@aexp.com'
                                        tooltip={
                                            isAwaitingApprovalOrLater
                                                ? 'Deciders cannot be changed once ADR is awaiting approval'
                                                : 'Who will be deciding if the ADR is approved or rejected?'
                                        }
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
                                        disabled={isAwaitingApprovalOrLater}
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
                                    />
                                    <NativeSelectField
                                        name='adr_type'
                                        label='ADR Type'
                                        required={false}
                                        register={register}
                                        error={
                                            errors.adr_type?.message as
                                                | string
                                                | undefined
                                        }
                                        options={[
                                            {
                                                value: '',
                                                displayText: 'Select ADR Type',
                                                disabled: true
                                            },
                                            ...ADR_TYPE_OPTIONS
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
                                form='edit-adr-form'
                            >
                                {isPending ? 'Updating...' : 'Update'}
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
