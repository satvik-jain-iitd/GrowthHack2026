'use client'
import React, { useState } from 'react'
import {
    Box,
    Button,
    Checkbox,
    CloseButton,
    Dialog,
    Flex,
    Text
} from '@chakra-ui/react'
import {
    getAttestationsForType,
    type AttestationType,
    type CapturedAttestationItem
} from '@/constants/attestationConfig'

interface AttestationConfirmationModalProps {
    isOpen: boolean
    attestationType: AttestationType
    onConfirm: (payload: {
        attestationType: string
        capturedAttestations: CapturedAttestationItem[]
    }) => void
    onCancel: () => void
}

export default function AttestationConfirmationModal({
    isOpen,
    attestationType,
    onConfirm,
    onCancel
}: AttestationConfirmationModalProps) {
    const items = getAttestationsForType(attestationType)
    const [attested, setAttested] = useState(false)

    const handleConfirm = () => {
        onConfirm({
            attestationType,
            capturedAttestations: items
        })
        setAttested(false)
    }

    const typeLabel = attestationType.replace(/_/g, ' ')

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={e => {
                if (!e.open) onCancel()
            }}
            placement='center'
            size='xl'
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content maxW='800px' w='90vw' borderRadius='12px' p={6}>
                    <Dialog.Header p={0} mb={4}>
                        <Flex
                            justifyContent='space-between'
                            alignItems='center'
                            w='100%'
                        >
                            <Text fontSize='xl' fontWeight='bold'>
                                Attestation Confirmation
                            </Text>
                            <CloseButton onClick={onCancel} />
                        </Flex>
                    </Dialog.Header>

                    <Dialog.Body p={0}>
                        <Text fontSize='sm' color='gray.600' mb={4}>
                            You are about to submit an attestation of type{' '}
                            <Text as='span' fontWeight='600'>
                                {typeLabel}
                            </Text>
                            . By confirming, you attest to the following items:
                        </Text>

                        <Box
                            maxH='400px'
                            overflowY='auto'
                            border='1px solid'
                            borderColor='gray.200'
                            borderRadius='8px'
                        >
                            {items.map((item, index) => (
                                <Box
                                    key={item.id}
                                    px={4}
                                    py={3}
                                    borderBottom={
                                        index < items.length - 1
                                            ? '1px solid'
                                            : 'none'
                                    }
                                    borderColor='gray.200'
                                >
                                    <Text
                                        fontSize='sm'
                                        fontWeight='600'
                                        color='gray.800'
                                    >
                                        {item.name}
                                    </Text>
                                    <Text fontSize='xs' color='gray.500' mt={1}>
                                        {item.description}
                                    </Text>
                                </Box>
                            ))}
                        </Box>
                    </Dialog.Body>

                    <Dialog.Footer p={0} mt={6}>
                        <Flex
                            justifyContent='space-between'
                            alignItems='center'
                            w='100%'
                        >
                            <Checkbox.Root
                                checked={attested}
                                onCheckedChange={e => setAttested(!!e.checked)}
                                colorPalette='blue'
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control
                                    borderWidth='2px'
                                    borderColor='blue.500'
                                    _checked={{
                                        bg: 'blue.500',
                                        borderColor: 'blue.500'
                                    }}
                                />
                                <Checkbox.Label>
                                    <Text fontSize='sm' fontWeight='600'>
                                        Yes, I attest to these changes
                                    </Text>
                                </Checkbox.Label>
                            </Checkbox.Root>
                            <Flex gap={3}>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    borderRadius='full'
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    colorPalette='blue'
                                    size='sm'
                                    borderRadius='full'
                                    disabled={!attested}
                                    onClick={handleConfirm}
                                >
                                    Confirm & Submit
                                </Button>
                            </Flex>
                        </Flex>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
