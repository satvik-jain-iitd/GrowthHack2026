/* istanbul ignore file */

import { Box, HStack } from '@chakra-ui/react'
import { Schema } from './Schema'
import { IconChevronRight, IconChevronUp } from '@americanexpress/dls-icons'
import { useState } from 'react'
import type { OpenAPIV3 } from 'openapi-types'

export function ResponseCode({
    statusCode,
    response
}: {
    statusCode: string
    response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject
}) {
    // Handles the open/close state of the response details for different status codes
    const [isOpen, setIsOpen] = useState(false)

    if (response && typeof response === 'object' && '$ref' in response)
        return null

    const color = statusCode.startsWith('2') ? '#1e8127' : '#d4201c'
    const darkModeColor = statusCode.startsWith('2') ? '#6fcf97' : '#ff7b72'

    return (
        <Box key={statusCode} mt='0.4em'>
            <Box
                bg={statusCode.startsWith('2') ? '#f0f6f1' : '#fdf1f0'}
                _dark={{
                    bg: statusCode.startsWith('2') ? '#023524' : '#4b1a16',
                    borderColor: isOpen ? darkModeColor : 'none'
                }}
                _hover={{
                    cursor: 'pointer'
                }}
                border={
                    isOpen
                        ? statusCode.startsWith('2')
                            ? '1px solid #1e8127'
                            : '1px solid #d4201c'
                        : 'none'
                }
                borderRadius={isOpen ? 'md' : 'none'}
                onClick={() => setIsOpen(!isOpen)}
                gap='1em'
                padding={'0.5em 1em'}
            >
                <HStack gap='1em' alignItems={'center'}>
                    <HStack
                        fontWeight='600'
                        color={color}
                        alignItems={'center'}
                        _dark={{ color: darkModeColor }}
                    >
                        {isOpen ? (
                            <IconChevronUp
                                isFilled={true}
                                size='sm'
                                style={{
                                    marginRight: '0.2em',
                                    marginBottom: '0.2em'
                                }}
                            />
                        ) : (
                            <IconChevronRight
                                isFilled={true}
                                size='sm'
                                style={{
                                    marginRight: '0.2em',
                                    marginBottom: '0.2em'
                                }}
                            />
                        )}
                        {statusCode}
                    </HStack>
                    <Box
                        as='span'
                        color={color}
                        _dark={{ color: darkModeColor }}
                        dangerouslySetInnerHTML={{
                            __html: response.description
                        }}
                    ></Box>
                </HStack>
            </Box>
            {/* Render schema properties if schema is present */}
            {response && 'content' in response && (
                <Box
                    pl={6}
                    maxH={isOpen ? '100%' : '0px'}
                    opacity={isOpen ? 1 : 0}
                    transform={isOpen ? 'translateY(0)' : 'translateY(-4px)'}
                    overflow='hidden'
                    pointerEvents={isOpen ? 'auto' : 'none'}
                    aria-hidden={!isOpen}
                    transition='max-height 300ms ease, opacity 220ms ease, transform 220ms ease'
                >
                    <Schema responseBody={response} schemaType='response' />
                </Box>
            )}
        </Box>
    )
}
