'use client'
import React from 'react'
import { Accordion, Box, Flex, Text } from '@chakra-ui/react'
import { IconWarning } from '@americanexpress/dls-icons'
import { AttestationRole } from '../utils/attestationState'

interface AttestationBannerProps {
    role: AttestationRole
}

export default function AttestationBanner({ role }: AttestationBannerProps) {
    const title = 'Change Request Attestation Needed'
    const description =
        role === 'principal_architect'
            ? 'The details of this record have been requested to be changed. Please review the changes below and attest to the proposed changes.'
            : 'The details of this record have been requested to be changed. Please review the changes below and provide attestation.'

    return (
        <Box bg='orange.50' p={4} borderRadius='8px' w='100%'>
            <Flex justifyContent='space-between' alignItems='center'>
                <Flex alignItems='center' gap={3}>
                    <IconWarning
                        isFilled={true}
                        color='caution'
                        size='xl'
                        style={{ fontSize: '22px' }}
                    />
                    <Box>
                        <Text fontWeight='bold' fontSize='md'>
                            {title}
                        </Text>
                        <Text fontSize='sm' color='gray.600'>
                            {description}
                        </Text>
                    </Box>
                </Flex>
                <Flex alignItems='center' gap={1}>
                    <IconWarning
                        isFilled={true}
                        color='caution'
                        size='xl'
                        style={{ fontSize: '18px' }}
                    />
                    <Text fontSize='sm'>= proposed change</Text>
                </Flex>
                <Accordion.ItemIndicator mr={4} />
            </Flex>
        </Box>
    )
}
