/* istanbul ignore file */
'use client'

import { Box } from '@chakra-ui/react'

interface ResizeHandleProps {
    onMouseDown: (e: React.MouseEvent) => void
    onTouchStart: (e: React.TouchEvent) => void
    isResizing: boolean
}

/** Absolute-positioned right-edge handle that turns blue while a column is being resized. */
export function ResizeHandle({
    onMouseDown,
    onTouchStart,
    isResizing
}: ResizeHandleProps) {
    return (
        <Box
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            position='absolute'
            right={0}
            top={0}
            h='100%'
            w='4px'
            borderRadius='sm'
            bg={isResizing ? 'blue.400' : 'transparent'}
            cursor='col-resize'
            userSelect='none'
            style={{ touchAction: 'none' }}
            _hover={{ bg: 'blue.300' }}
            transition='background 0.1s'
        />
    )
}
