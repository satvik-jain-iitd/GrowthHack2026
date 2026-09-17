/* istanbul ignore file */
'use client'
import React, { useState } from 'react'
import { Button, Dialog, Link, Portal, Text } from '@chakra-ui/react'
import { NoPrefetchLink as NextLink } from '@/components/ui'

type SuccessDialogProps = {
    title: string
    repoType: string
}

function SuccessDialog({ title, repoType }: SuccessDialogProps) {
    return (
        <Dialog.Root open={true}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header
                            backgroundColor={'#006fcf'}
                            borderRadius={'6px 6px 0 0'}
                        >
                            <Dialog.Title
                                fontSize={'25px'}
                                textAlign={'center'}
                                width={'100%'}
                                color={'white'}
                            >
                                Success!
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body
                            maxWidth='600px'
                            m='15px auto auto auto'
                            textAlign={'center'}
                        >
                            <Text fontSize='16px'>
                                Submitting request to onboard {repoType} {title}{' '}
                                was successful! It will be onboarded after the
                                EA-Portal Team approves the request. Please
                                check your email for further updates. If there
                                are any issues, you can contact the team at{' '}
                                {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                                <Link
                                    href={
                                        'https://my.slack.com/archives/C05655U6GMC'
                                    }
                                    style={{
                                        color: '#006fcf',
                                        cursor: 'pointer'
                                    }}
                                    _hover={{ textDecoration: 'underline' }}
                                    target='_blank'
                                    variant={'plain'}
                                >
                                    #arch-portal-help
                                </Link>
                                .
                            </Text>
                            <Button
                                backgroundColor={'#006fcf'}
                                width='100%'
                                display='block'
                                m='25px auto auto auto'
                                px={0}
                            >
                                <NextLink href={'/'}>
                                    <Text
                                        fontWeight='bold'
                                        textAlign='center'
                                        width='100%'
                                        height='100%'
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='center'
                                        color={'white'}
                                    >
                                        Return Home
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

type ErrorDialogProps = {
    error: string
    onClose: () => void
}

function ErrorDialog({ error, onClose }: ErrorDialogProps) {
    const [open, setOpen] = useState(true)
    // When dialog closes, call onClose
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
                                    width='100%'
                                    display='block'
                                    m='30px auto 10px auto'
                                    px={0}
                                    onClick={() => setOpen(false)}
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

export { SuccessDialog, ErrorDialog }
