/* istanbul ignore file */

import { Box, Checkbox, HStack, Text } from '@chakra-ui/react'
import { ApiType } from './ConsumerApiAdd.types'

export function ConsumerApiTypeFilter({
    options,
    selectedApiTypes,
    typeValidationError,
    onFilterChange
}: {
    options: readonly ApiType[]
    selectedApiTypes: ApiType[]
    typeValidationError: string
    onFilterChange: (type: ApiType, checked: boolean) => void
}) {
    return (
        <Box>
            <Text fontSize='14px' fontWeight={500} mb={2}>
                API Type Filter
            </Text>
            <HStack gap={4}>
                {options.map(type => (
                    <Checkbox.Root
                        key={type}
                        checked={selectedApiTypes.includes(type)}
                        onCheckedChange={e => onFilterChange(type, !!e.checked)}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>{type}</Checkbox.Label>
                    </Checkbox.Root>
                ))}
            </HStack>
            {typeValidationError && (
                <Text color='red.500' fontSize='12px' mt={1}>
                    {typeValidationError}
                </Text>
            )}
        </Box>
    )
}
