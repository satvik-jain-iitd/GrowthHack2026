/* istanbul ignore file */

import { Box, Text, HStack, Button, Badge } from '@chakra-ui/react'
import { useState } from 'react'
import { IconPlus, IconMinus } from '@americanexpress/dls-icons'
import { CodeBlock } from './CodeBlock'
import { PARAM_BOX_PROPS } from '@/app/api-docs/constants/styling'
import { Markdown } from './Markdown'
import { SchemaProperties } from './SchemaProperties'
import type { OpenAPIV3 } from 'openapi-types'
import ExpandableText from '@/app/company-domains/components/LandingPage/ExpandableText'
import Code from '@/app/api-docs/components/centercontent/CodeText'

export function SchemaPropertyRow({
    keyName,
    prop,
    level,
    isRequired
}: {
    keyName: string
    prop: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined
    level: number
    isRequired: boolean
}) {
    const [open, setOpen] = useState(false)
    if (!prop || (typeof prop === 'object' && '$ref' in prop)) return null
    const isObject = prop.properties
    const isArrayOfObjects =
        prop.type === 'array' &&
        prop.items &&
        typeof prop.items === 'object' &&
        !('$ref' in prop.items) &&
        prop.items.type === 'object'
    const minLength = 'minLength' in prop ? prop.minLength : undefined
    const maxLength = 'maxLength' in prop ? prop.maxLength : undefined
    let lengthInfo = ''
    if (minLength !== undefined && maxLength !== undefined) {
        if (minLength === maxLength) {
            lengthInfo = `= ${minLength}`
        } else {
            lengthInfo = `between ${minLength} and ${maxLength}`
        }
    } else if (minLength !== undefined) {
        lengthInfo = `>= ${minLength}`
    } else if (maxLength !== undefined) {
        lengthInfo = `<= ${maxLength}`
    }
    return (
        <Box key={keyName} {...PARAM_BOX_PROPS}>
            <HStack align='start' alignItems={'center'}>
                <Box flex={1} width='100%'>
                    <Text fontWeight='bold'>
                        <Code pl={0}>{keyName}</Code>{' '}
                        {lengthInfo !== '' && (
                            <CodeBlock mx='0.25em' val={lengthInfo} />
                        )}
                        <CodeBlock
                            mx='0.25em'
                            val={
                                prop?.type && prop.type
                                    ? prop.type === 'array' && isArrayOfObjects
                                        ? 'Array of objects'
                                        : prop?.type
                                    : 'any'
                            }
                        />
                        {isRequired && (
                            <Badge
                                ml='0.5em'
                                colorPalette='red'
                                variant='outline'
                            >
                                Required
                            </Badge>
                        )}
                    </Text>
                    {prop.description && (
                        <Markdown fontSize='xs'>{prop.description}</Markdown>
                    )}
                    {'example' in prop && (
                        <ExpandableText>
                            <Text
                                color='gray.500'
                                _dark={{ color: 'gray.300' }}
                                whiteSpace='word-break'
                                wordBreak='break-word'
                                as='div'
                                fontSize='xs'
                            >
                                Example: {String(prop.example)}
                            </Text>
                        </ExpandableText>
                    )}
                    {prop.enum && Array.isArray(prop.enum) && (
                        <Text
                            fontSize='xs'
                            color='gray.500'
                            _dark={{ color: 'gray.300' }}
                        >
                            Enum:{' '}
                            {prop.enum.map((val: string) => (
                                <CodeBlock
                                    key={val}
                                    mr='0.25em'
                                    p='0.25em 0.4em'
                                    val={val}
                                />
                            ))}
                        </Text>
                    )}
                </Box>
                {(isObject || isArrayOfObjects) && (
                    <Button
                        aria-label={open ? 'Collapse' : 'Expand'}
                        size='xs'
                        variant='outline'
                        onClick={() => setOpen(o => !o)}
                    >
                        {open ? (
                            <>
                                <IconMinus />
                                Collapse Properties
                            </>
                        ) : (
                            <>
                                <IconPlus />
                                Expand Properties
                            </>
                        )}
                    </Button>
                )}
            </HStack>
            {/* Collapsible for nested object */}
            {isObject && open && (
                <SchemaProperties schema={prop} level={level + 1} />
            )}
            {/* Array handling */}
            {prop.type === 'array' && prop.items && (
                <Box mt='0.5em'>
                    {isArrayOfObjects && open && (
                        <>
                            <Text fontSize='sm'>Array [</Text>
                            <SchemaProperties
                                schema={prop.items}
                                level={level + 1}
                            />
                            <Text fontSize='sm'>]</Text>
                        </>
                    )}
                    {!isArrayOfObjects && (
                        <>
                            <Text fontSize='sm'>[</Text>
                            <SchemaProperties
                                schema={prop.items}
                                level={level + 1}
                            />
                            <Text fontSize='sm'>]</Text>
                        </>
                    )}
                </Box>
            )}
        </Box>
    )
}
