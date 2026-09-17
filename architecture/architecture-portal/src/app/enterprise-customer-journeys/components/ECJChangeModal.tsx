/* istanbul ignore file */
'use client'
import React, { useCallback } from 'react'
import { Box, Button, CloseButton, Dialog, Separator } from '@chakra-ui/react'
import styles from '@/app/business-architecture/business-architecture.module.scss'
import { useUserContext } from '@/context/UserContext'
import { useForm } from 'react-hook-form'
import { TextareaField } from '@/app/onboarding-form/components'

interface ECJChangeModalProps {
    isOpen: boolean
    setIsOpenChangeModal: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (payload: ECJChangeModalSubmitPayload) => void | Promise<void>
    isSubmitting?: boolean
    journeyStatement: string
    journeyDesc: string
}

export interface ECJChangeModalFormValues {
    changeDetails: string
}

export interface ECJChangeModalSubmitPayload {
    values: ECJChangeModalFormValues
    displayName: string
    userPrincipalName: string
    journeyStatement: string
    journeyDesc: string
}

export function ECJChangeModal({
    isOpen,
    setIsOpenChangeModal,
    onSubmit,
    isSubmitting = false,
    journeyStatement,
    journeyDesc
}: ECJChangeModalProps) {
    const user = useUserContext()
    const { displayName = '', userPrincipalName = '' } = user?.userInfo ?? {}

    const {
        register,
        handleSubmit,
        reset,
        trigger,
        formState: { errors }
    } = useForm<ECJChangeModalFormValues>({
        mode: 'onBlur',
        defaultValues: {
            changeDetails: ''
        }
    })

    const setValidating = useCallback((_name: string, _v: boolean) => {}, [])

    const onValidSubmit = async (values: ECJChangeModalFormValues) => {
        await onSubmit({
            values,
            displayName,
            userPrincipalName,
            journeyStatement,
            journeyDesc
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
                            <TextareaField
                                key={'changeDetails'}
                                name={'changeDetails'}
                                required={true}
                                label={'Change Details'}
                                placeholder='Enter the details about the proposed change here...'
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
                                    errors['changeDetails']?.message as
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
