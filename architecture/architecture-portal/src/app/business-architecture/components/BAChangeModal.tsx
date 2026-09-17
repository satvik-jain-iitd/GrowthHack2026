/* istanbul ignore file */
'use client'
import React, { useEffect, useState } from 'react'
import { Box, Button, CloseButton, Dialog, Separator } from '@chakra-ui/react'
import styles from '@/app/business-architecture/business-architecture.module.scss'
import { useUserContext } from '@/context/UserContext'
import { useForm, useWatch } from 'react-hook-form'
import {
    NativeSelectField,
    TextareaField,
    TextField
} from '@/app/onboarding-form/components'

interface BAChangeModalProps {
    isOpen: boolean
    setIsOpenChangeModal: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (payload: BAChangeModalSubmitPayload) => void | Promise<void>
    isSubmitting?: boolean
    capabilityName?: string
    capabilityKeyTx?: string
}

export interface BAChangeModalFormValues {
    changeType: string
    capabilityName?: string
    capabilityKeyTx?: string
    impactedCustomerSegment: string
    associatedSystems: string
    impactedMarkets: string
    impactedAmexProducts: string
    impactedChannels: string
    customerJourneyContext: string
    additionalInformation: string
}

export interface BAChangeModalSubmitPayload {
    values: BAChangeModalFormValues
    displayName: string
    userPrincipalName: string
}

export const CHANGE_TYPE_OPTIONS = [
    {
        value: "Make a change to a capability's details",
        displayText: "Make a change to a capability's details"
    },
    {
        value: 'Propose a new capability',
        displayText: 'Propose a new capability'
    },
    { value: 'Retire a capability', displayText: 'Retire a capability' },
    { value: 'General inquiry', displayText: 'General inquiry' }
]

export const CUSTOMER_SEGMENT_OPTIONS = [
    {
        value: 'Merchant',
        displayText: 'Merchant'
    },
    {
        value: 'Network',
        displayText: 'Network'
    },
    {
        value: 'Consumer',
        displayText: 'Consumer'
    },
    {
        value: 'Commercial',
        displayText: 'Commercial'
    },
    {
        value: 'Colleagues',
        displayText: 'Colleagues'
    }
]

export function BAChangeModal({
    isOpen,
    setIsOpenChangeModal,
    onSubmit,
    isSubmitting = false,
    capabilityKeyTx,
    capabilityName
}: BAChangeModalProps) {
    const user = useUserContext()
    const { displayName = '', userPrincipalName = '' } = user?.userInfo ?? {}
    const normalizedCapabilityName = capabilityName?.trim() ?? ''
    const normalizedCapabilityKeyTx = capabilityKeyTx?.trim() ?? ''
    const hasCapabilityContext =
        normalizedCapabilityName.length > 0 &&
        normalizedCapabilityKeyTx.length > 0
    const availableChangeTypeOptions = hasCapabilityContext
        ? CHANGE_TYPE_OPTIONS
        : CHANGE_TYPE_OPTIONS.filter(
              option =>
                  option.value === CHANGE_TYPE_OPTIONS[1].value ||
                  option.value === CHANGE_TYPE_OPTIONS[3].value
          )

    const {
        control,
        register,
        handleSubmit,
        reset,
        trigger,
        setValue,
        formState: { errors }
    } = useForm<BAChangeModalFormValues>({
        mode: 'onBlur',
        defaultValues: {
            changeType: CHANGE_TYPE_OPTIONS[3].value,
            capabilityName: normalizedCapabilityName,
            capabilityKeyTx: normalizedCapabilityKeyTx,
            impactedCustomerSegment: CUSTOMER_SEGMENT_OPTIONS[0].value,
            associatedSystems: '',
            impactedMarkets: '',
            impactedAmexProducts: '',
            impactedChannels: '',
            customerJourneyContext: '',
            additionalInformation: ''
        }
    })
    const [validatingFields, setValidatingFields] = useState<
        Record<string, boolean>
    >({})

    const setValidating = (name: string, v: boolean) =>
        setValidatingFields(s => ({ ...s, [name]: v }))

    const changeType = useWatch({
        control,
        name: 'changeType'
    })

    const requiresCapabilityKeyTx =
        hasCapabilityContext &&
        (changeType === CHANGE_TYPE_OPTIONS[0].value ||
            changeType === CHANGE_TYPE_OPTIONS[2].value)

    const requiresCapabilityName =
        (hasCapabilityContext &&
            (changeType === CHANGE_TYPE_OPTIONS[0].value ||
                changeType === CHANGE_TYPE_OPTIONS[2].value)) ||
        changeType === CHANGE_TYPE_OPTIONS[1].value ||
        false

    useEffect(() => {
        if (changeType === CHANGE_TYPE_OPTIONS[1].value) {
            setValue('capabilityName', '')
        } else if (
            hasCapabilityContext &&
            (changeType === CHANGE_TYPE_OPTIONS[0].value ||
                changeType === CHANGE_TYPE_OPTIONS[2].value)
        ) {
            setValue('capabilityName', normalizedCapabilityName)
            setValue('capabilityKeyTx', normalizedCapabilityKeyTx)
        } else {
            setValue('capabilityKeyTx', '')
        }
    }, [
        changeType,
        hasCapabilityContext,
        normalizedCapabilityKeyTx,
        normalizedCapabilityName,
        setValue
    ])

    const onValidSubmit = async (values: BAChangeModalFormValues) => {
        const submissionValues = requiresCapabilityKeyTx
            ? values
            : {
                  ...values,
                  capabilityKeyTx: ''
              }
        submissionValues.capabilityName = requiresCapabilityName
            ? values.capabilityName
            : ''

        await onSubmit({
            values: submissionValues,
            displayName,
            userPrincipalName
        })
        reset()
        setIsOpenChangeModal(false)
    }

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={details => {
                setIsOpenChangeModal(details.open)
            }}
            scrollBehavior={'inside'}
            placement='center'
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content
                    width={{
                        base: 'calc(100vw - 32px)',
                        md: 'min(92vw, 720px)'
                    }}
                    maxWidth='720px'
                    borderRadius='16px'
                    overflow='hidden'
                    boxShadow='0 24px 64px rgba(0, 23, 90, 0.16)'
                    _dark={{
                        borderColor: '#53565a',
                        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45)'
                    }}
                    background='surface.white'
                    maxHeight='80vh'
                >
                    <Dialog.Header
                        ps={{ base: '20px', md: '24px' }}
                        pe={{ base: '48px', md: '24px' }}
                        pb={{ base: '18px', md: '16px' }}
                        color='text.emphasis'
                        fontSize={{ base: '1.2rem', md: '1.375rem' }}
                        fontWeight='700'
                        lineHeight='1.3'
                        letterSpacing='-0.01em'
                    >
                        Propose a Change
                    </Dialog.Header>
                    <Dialog.Body>
                        <Box
                            as='form'
                            display='flex'
                            flexDirection='column'
                            gap='24px'
                            ps={{ base: '20px', md: '0px' }}
                            pe={{ base: '20px', md: '10%' }}
                            _dark={{ background: '#2d3748' }}
                            onSubmit={handleSubmit(onValidSubmit)}
                        >
                            <NativeSelectField
                                name='changeType'
                                label='Change Type'
                                required={true}
                                register={register}
                                validation={{
                                    required: 'Change Type is required'
                                }}
                                className={styles.baChangeModal__field}
                                labelClassName={styles.baChangeModal__label}
                                selectFieldClassName={
                                    styles.baChangeModal__nativeSelectField
                                }
                                error={
                                    errors.changeType?.message as
                                        | string
                                        | undefined
                                }
                                options={[
                                    {
                                        value: '',
                                        displayText: 'Select Change Type',
                                        disabled: true
                                    },
                                    ...availableChangeTypeOptions
                                ]}
                            />
                            {requiresCapabilityKeyTx ? (
                                <TextField
                                    name='capabilityKeyTx'
                                    required={true}
                                    label='Capability Key'
                                    placeholder=''
                                    register={register}
                                    className={styles.baChangeModal__field}
                                    labelClassName={styles.baChangeModal__label}
                                    inputClassName={styles.baChangeModal__text}
                                    error={
                                        errors['capabilityKeyTx']?.message as
                                            | string
                                            | undefined
                                    }
                                    trigger={trigger}
                                    validation={{
                                        required: 'Capability Key is required'
                                    }}
                                    setValidating={setValidating}
                                    isValidating={
                                        validatingFields['capabilityKeyTx']
                                    }
                                />
                            ) : null}
                            {requiresCapabilityName ? (
                                <TextField
                                    name='capabilityName'
                                    required={true}
                                    label='Capability Name'
                                    placeholder=''
                                    register={register}
                                    className={styles.baChangeModal__field}
                                    labelClassName={styles.baChangeModal__label}
                                    inputClassName={styles.baChangeModal__text}
                                    error={
                                        errors['capabilityName']?.message as
                                            | string
                                            | undefined
                                    }
                                    trigger={trigger}
                                    validation={{
                                        required: 'Capability Name is required'
                                    }}
                                    setValidating={setValidating}
                                    isValidating={
                                        validatingFields['capabilityName']
                                    }
                                />
                            ) : null}
                            <NativeSelectField
                                name='impactedCustomerSegment'
                                label='Impacted Customer Segment'
                                required={
                                    changeType === CHANGE_TYPE_OPTIONS[3].value
                                        ? false
                                        : true
                                }
                                register={register}
                                validation={{
                                    required:
                                        'Impacted Customer Segment is required'
                                }}
                                className={styles.baChangeModal__field}
                                labelClassName={styles.baChangeModal__label}
                                selectFieldClassName={
                                    styles.baChangeModal__nativeSelectField
                                }
                                error={
                                    errors.impactedCustomerSegment?.message as
                                        | string
                                        | undefined
                                }
                                options={[
                                    {
                                        value: '',
                                        displayText:
                                            'Select Impacted Customer Segment',
                                        disabled: true
                                    },
                                    ...CUSTOMER_SEGMENT_OPTIONS
                                ]}
                            />
                            <TextField
                                name='associatedSystems'
                                required={false}
                                label='Associated Systems / Applications / Processes'
                                placeholder='e.g. Product Composer'
                                register={register}
                                className={styles.baChangeModal__field}
                                labelClassName={styles.baChangeModal__label}
                                inputClassName={styles.baChangeModal__text}
                                error={
                                    errors['associatedSystems']?.message as
                                        | string
                                        | undefined
                                }
                                trigger={trigger}
                                setValidating={setValidating}
                                isValidating={
                                    validatingFields['associatedSystems']
                                }
                            />
                            <TextField
                                name='impactedMarkets'
                                required={
                                    changeType === CHANGE_TYPE_OPTIONS[3].value
                                        ? false
                                        : true
                                }
                                label='Impacted Market(s)'
                                placeholder='e.g. US, AU, CA'
                                register={register}
                                validation={{
                                    required: 'Impacted Market(s) are required'
                                }}
                                className={styles.baChangeModal__field}
                                labelClassName={styles.baChangeModal__label}
                                inputClassName={styles.baChangeModal__text}
                                error={
                                    errors['impactedMarkets']?.message as
                                        | string
                                        | undefined
                                }
                                trigger={trigger}
                                setValidating={setValidating}
                                isValidating={
                                    validatingFields['impactedMarkets']
                                }
                            />
                            <TextField
                                name='impactedAmexProducts'
                                required={
                                    changeType === CHANGE_TYPE_OPTIONS[3].value
                                        ? false
                                        : true
                                }
                                label='Impacted Amex Product(s)'
                                placeholder='e.g. Plan It'
                                register={register}
                                validation={{
                                    required:
                                        'Impacted Amex Product(s) are required'
                                }}
                                className={styles.baChangeModal__field}
                                labelClassName={styles.baChangeModal__label}
                                inputClassName={styles.baChangeModal__text}
                                error={
                                    errors['impactedAmexProducts']?.message as
                                        | string
                                        | undefined
                                }
                                trigger={trigger}
                                setValidating={setValidating}
                                isValidating={
                                    validatingFields['impactedAmexProducts']
                                }
                            />
                            <TextField
                                name='impactedChannels'
                                required={
                                    changeType === CHANGE_TYPE_OPTIONS[3].value
                                        ? false
                                        : true
                                }
                                label='Impacted Channel(s)'
                                placeholder='e.g. MYCA, Mobile'
                                register={register}
                                validation={{
                                    required: 'Impacted Channel(s) are required'
                                }}
                                className={styles.baChangeModal__field}
                                labelClassName={styles.baChangeModal__label}
                                inputClassName={styles.baChangeModal__text}
                                error={
                                    errors['impactedChannels']?.message as
                                        | string
                                        | undefined
                                }
                                trigger={trigger}
                                setValidating={setValidating}
                                isValidating={
                                    validatingFields['impactedChannels']
                                }
                            />
                            <TextareaField
                                key={'customerJourneyContext'}
                                name={'customerJourneyContext'}
                                required={false}
                                label={'Customer Journey Context'}
                                placeholder='Enter any relevant Customer Journey context here...'
                                height={'100px'}
                                register={register}
                                trigger={trigger}
                                setValidating={setValidating}
                                className={styles.baChangeModal__field}
                                labelClassName={styles.baChangeModal__label}
                                textareaClassName={
                                    styles.baChangeModal__textarea
                                }
                                error={
                                    errors['customerJourneyContext']
                                        ?.message as string | undefined
                                }
                                runAsyncValidationOnBlur={false}
                                colSpan={{ base: 2 }}
                            />
                            <TextareaField
                                key={'additionalInformation'}
                                name={'additionalInformation'}
                                required={
                                    changeType === CHANGE_TYPE_OPTIONS[3].value
                                        ? true
                                        : false
                                }
                                label={'Additional Information'}
                                placeholder='Enter any additional details about the proposed change here...'
                                height={'100px'}
                                register={register}
                                trigger={trigger}
                                setValidating={setValidating}
                                className={styles.baChangeModal__field}
                                labelClassName={styles.baChangeModal__label}
                                textareaClassName={
                                    styles.baChangeModal__textarea
                                }
                                error={
                                    errors['additionalInformation']?.message as
                                        | string
                                        | undefined
                                }
                                runAsyncValidationOnBlur={false}
                                colSpan={{ base: 2 }}
                            />
                            <Separator size='md' mx='24px' />
                            <Dialog.Footer
                                display='flex'
                                justifyContent='flex-start'
                                gap='12px'
                                pt='20px'
                                px={{ base: '20px', md: '24px' }}
                                pb='24px'
                                flexDirection={{
                                    base: 'column-reverse',
                                    md: 'row'
                                }}
                                _dark={{ background: '#1a202c' }}
                                backgroundColor='surface.white'
                            >
                                <Button
                                    type='submit'
                                    loading={isSubmitting}
                                    background='interactive.primary.default'
                                    color='interactive.secondary.default'
                                    borderRadius='10px'
                                    fontWeight='510'
                                    minHeight='48px'
                                    minWidth='48px'
                                    transition='transform 0.2s ease, box-shadow 0.2s ease'
                                    width={{ base: '100%', md: 'auto' }}
                                >
                                    Submit Change
                                </Button>
                                <Dialog.ActionTrigger asChild>
                                    <Button
                                        variant='outline'
                                        borderColor='border.regular'
                                        color='text.brand'
                                        background='transparent'
                                        borderRadius='10px'
                                        fontWeight='510'
                                        minHeight='48px'
                                        minWidth='48px'
                                        transition='transform 0.2s ease, box-shadow 0.2s ease'
                                        width={{ base: '100%', md: 'auto' }}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                </Dialog.ActionTrigger>
                            </Dialog.Footer>
                        </Box>
                    </Dialog.Body>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton
                            color='interactive.primary.default'
                            size={'2xl'}
                        />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
