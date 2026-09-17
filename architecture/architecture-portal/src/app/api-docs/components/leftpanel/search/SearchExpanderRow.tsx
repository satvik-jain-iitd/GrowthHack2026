/* istanbul ignore file */

import React from 'react'
import { Box } from '@chakra-ui/react'
import { optionDomId } from './searchRowUtils'

export function SearchExpanderRow({
    rowKey,
    label,
    indent,
    active,
    onSelect,
    onHover
}: {
    rowKey: string
    label: string
    indent: number
    active: boolean
    onSelect: () => void
    onHover: () => void
}) {
    return (
        <Box
            role='option'
            id={optionDomId(rowKey)}
            aria-selected={active}
            onClick={onSelect}
            onMouseMove={onHover}
            cursor='pointer'
            pl={indent}
            pr={3}
            py={1}
            borderRadius='md'
            fontSize='xs'
            fontWeight='600'
            color='#006fcf'
            _dark={{
                color: '#8ec7ff',
                bg: active ? '#243044' : 'transparent'
            }}
            bg={active ? 'blue.50' : 'transparent'}
        >
            {label}
        </Box>
    )
}
