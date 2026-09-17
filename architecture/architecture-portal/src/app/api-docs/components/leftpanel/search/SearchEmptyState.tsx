/* istanbul ignore file */

import React from 'react'
import { Box, HStack, Text, VStack, chakra } from '@chakra-ui/react'
import { domainsLeftNav } from '@/app/api-docs/types/apiDocs'
import { LinkButton } from './searchRowUtils'

export function SearchEmptyState({
    sidebarData,
    selectedDomains,
    onNavigate
}: {
    sidebarData: { [key: string]: domainsLeftNav }
    selectedDomains: domainsLeftNav[]
    onNavigate: (id: string) => void
}) {
    if (!Object.keys(sidebarData || {}).length) {
        return (
            <Box px={4} py={6} fontSize='sm' color='gray.500'>
                No API documentation matches the current status filter.
            </Box>
        )
    }

    if (!selectedDomains.length) {
        return (
            <Box px={4} py={6} fontSize='sm' color='gray.500'>
                Select a company domain to narrow your search, or start typing.
            </Box>
        )
    }

    return (
        <VStack
            align='stretch'
            gap={3}
            px={4}
            py={4}
            maxH='60vh'
            overflowY='auto'
        >
            {selectedDomains.map(domain => (
                <VStack key={domain.id} align='stretch' gap={1}>
                    <HStack justifyContent='space-between'>
                        <Text fontSize='xs' fontWeight='700' color='gray.500'>
                            {domain.name.toUpperCase()}
                        </Text>
                        <LinkButton onClick={() => onNavigate(domain.id)}>
                            Go to company domain
                        </LinkButton>
                    </HStack>
                    {Object.values(domain.apis || {}).map(api => (
                        <chakra.button
                            type='button'
                            key={api.id}
                            onClick={() => onNavigate(api.id)}
                            px={3}
                            py={1.5}
                            borderRadius='md'
                            _hover={{ bg: 'blue.50', _dark: { bg: '#243044' } }}
                        >
                            <HStack justifyContent='space-between' width='100%'>
                                <Text fontSize='sm' textAlign='left'>
                                    {api.name}
                                </Text>
                                <Text fontSize='xs' color='gray.500'>
                                    {Object.keys(api.operations || {}).length}{' '}
                                    {Object.keys(api.operations || {})
                                        .length === 1
                                        ? 'operation'
                                        : 'operations'}
                                </Text>
                            </HStack>
                        </chakra.button>
                    ))}
                </VStack>
            ))}
        </VStack>
    )
}
