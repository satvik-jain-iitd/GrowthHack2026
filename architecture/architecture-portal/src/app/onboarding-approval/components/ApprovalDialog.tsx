/* istanbul ignore file */
'use client'
import React, { useState } from 'react'
import { Button, Dialog, Portal, Text } from '@chakra-ui/react'
import { NoPrefetchLink as NextLink } from '@/components/ui'
import { TextareaField } from '@/app/onboarding-form/components/TextareaField'
import { RejectFormValues } from '@/app/onboarding-approval/types'
import { useForm } from 'react-hook-form'

type SuccessDialogProps = {
    message: string
    onClose: () => void
}

function SuccessDialog({ message, onClose }: SuccessDialogProps) {
    const [open, setOpen] = useState(true)
    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (!nextOpen) onClose()
    }

    return (
        <Dialog.Root open={open} onOpenChange={e => handleOpenChange(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header
                            backgroundColor='#006fcf'
                            borderRadius='6px 6px 0 0'
                        >
                            <Dialog.Title
                                fontSize='25px'
                                textAlign='center'
                                width='100%'
                                color='white'
                            >
                                Success!
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body
                            maxWidth='600px'
                            m='15px auto auto auto'
                            textAlign={'center'}
                        >
                            <Text fontSize='16px'>{message}</Text>
                            <Button
                                backgroundColor='#006fcf'
                                display='block'
                                m='25px auto auto auto'
                            >
                                <NextLink href='/onboarding-approval'>
                                    <Text
                                        fontWeight='bold'
                                        textAlign='center'
                                        width='100%'
                                        height='100%'
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='center'
                                        color='white'
                                    >
                                        Return to Approvals
                                    </Text>
                                </NextLink>
                            </Button>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

type RejectDialogProps = {
    onSubmit: (values: RejectFormValues) => void
    onClose: () => void
}

function RejectDialog({ onSubmit, onClose }: RejectDialogProps) {
    const [open, setOpen] = useState(true)
    const { register, handleSubmit, trigger, formState } =
        useForm<RejectFormValues>({
            mode: 'onSubmit'
        })

    const handleSubmitForm = handleSubmit(onSubmit)
    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (!nextOpen) onClose()
    }

    return (
        <Dialog.Root open={open} onOpenChange={e => handleOpenChange(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header
                            backgroundColor='#006fcf'
                            borderRadius='6px 6px 0 0'
                        >
                            <Dialog.Title
                                fontSize='25px'
                                textAlign='center'
                                width='100%'
                                color='white'
                            >
                                Reject Onboarding
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body
                            width='100%'
                            m='15px auto auto auto'
                            textAlign='center'
                        >
                            <TextareaField
                                key='comments'
                                name='comments'
                                required={true}
                                label='Feedback'
                                placeholder=''
                                tooltip='Feedback will get emailed to the requester'
                                height='100px'
                                register={register}
                                validation={{ required: 'Feedback required' }}
                                trigger={trigger}
                                setValidating={() => {}}
                                error={
                                    formState.errors.comments?.message as
                                        | string
                                        | undefined
                                }
                                runAsyncValidationOnBlur={false}
                            />
                            <Button
                                mr={2}
                                size='lg'
                                variant='solid'
                                colorPalette='blue'
                                onClick={handleSubmitForm}
                            >
                                Submit
                            </Button>
                            <Button
                                size='lg'
                                variant='outline'
                                colorPalette='blue'
                                onClick={() => handleOpenChange(false)}
                            >
                                Cancel
                            </Button>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

type ErrorDialogProps = {
    error: string
    onClose: () => void
}

function ErrorDialog({ error, onClose }: ErrorDialogProps) {
    const [open, setOpen] = useState(true)
    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (!nextOpen) onClose()
    }

    return (
        <Dialog.Root open={open} onOpenChange={e => handleOpenChange(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header
                            backgroundColor={'#B42C01'}
                            borderRadius={'6px 6px 0 0'}
                        >
                            <Dialog.Title
                                fontSize={'25px'}
                                textAlign={'center'}
                                width={'100%'}
                                color={'white'}
                            >
                                Error!
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body
                            maxWidth='600px'
                            m='15px auto auto auto'
                            textAlign='center'
                        >
                            <Text fontSize='16px'>{error}</Text>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    backgroundColor={'#B42C01'}
                                    display='block'
                                    m='30px auto 10px auto'
                                    onClick={() => handleOpenChange(false)}
                                >
                                    <Text fontWeight='bold'>Close</Text>
                                </Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export { SuccessDialog, RejectDialog, ErrorDialog }
