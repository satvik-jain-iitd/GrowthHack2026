/* istanbul ignore file */

import { SelectContentType } from './SelectContentType'
import { Box, Text } from '@chakra-ui/react'
import { SchemaPropertyRow } from './SchemaPropertyRow'
import { Markdown } from './Markdown'
import { CodeBlock } from './CodeBlock'
import { OpenAPIV3 } from 'openapi-types'

export function SchemaProperties({
    schema,
    level = 0
}: {
    schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined
    level?: number
}) {
    let content = <></>
    if (!schema || (typeof schema === 'object' && '$ref' in schema)) return null
    if (schema.oneOf && Array.isArray(schema.oneOf)) {
        if (schema.properties && Object.keys(schema.properties).length > 0) {
            content = <SelectContentType schema={schema} level={level} />
        } else {
            return <SelectContentType schema={schema} level={level} />
        }
    }
    // If this is an array item without properties, show its type, description, etc.
    if (!schema.properties && schema?.type !== 'object') {
        const minLength = 'minLength' in schema ? schema.minLength : undefined
        const maxLength = 'maxLength' in schema ? schema.maxLength : undefined
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
            <Box
                pl={level * 4}
                mt={level > 0 ? '0.5em' : undefined}
                boxSizing='border-box'
            >
                <Text fontWeight='bold'>
                    {schema.title || 'Item'}{' '}
                    {lengthInfo !== '' && (
                        <CodeBlock mx='0.25em' val={lengthInfo} />
                    )}
                    <CodeBlock
                        mx='0.25em'
                        val={(schema?.type && schema.type) || 'any'}
                    />
                </Text>
                {schema.description && (
                    <Markdown>{schema.description}</Markdown>
                )}
                {'example' in schema && (
                    <Text
                        fontSize='sm'
                        color='gray.500'
                        _dark={{ color: 'gray.300' }}
                    >
                        Example: {String(schema.example)}
                    </Text>
                )}
                {schema.enum && Array.isArray(schema.enum) && (
                    <Text
                        fontSize='sm'
                        color='gray.500'
                        _dark={{ color: 'gray.300' }}
                    >
                        Enum:{' '}
                        {schema.enum.map((val: string) => (
                            <CodeBlock
                                key={val}
                                mr='0.25em'
                                p='0.25em 0.4em'
                                val={val}
                            />
                        ))}
                    </Text>
                )}
                {/* If the array again contains oneOf handle the scenario */}
                {schema.type === 'array' &&
                (schema as OpenAPIV3.ArraySchemaObject).items &&
                typeof (schema as OpenAPIV3.ArraySchemaObject).items ===
                    'object' &&
                !('$ref' in (schema as OpenAPIV3.ArraySchemaObject).items) &&
                'oneOf' in (schema as OpenAPIV3.ArraySchemaObject).items &&
                Array.isArray(
                    (schema as OpenAPIV3.ArraySchemaObject).items &&
                        (schema as OpenAPIV3.SchemaObject).oneOf
                ) ? (
                    <SelectContentType
                        schema={
                            (schema as OpenAPIV3.ArraySchemaObject)
                                .items as OpenAPIV3.SchemaObject
                        }
                        level={level}
                    />
                ) : null}
                {schema.type === 'array' && (
                    <SchemaProperties
                        schema={
                            schema.items as
                                | OpenAPIV3.SchemaObject
                                | OpenAPIV3.ReferenceObject
                        }
                        level={level + 1}
                    />
                )}
            </Box>
        )
    }
    if (!schema.properties) return null
    return (
        <>
            {content}
            <Box pl={level * 4} mt={level > 0 ? '0.5em' : undefined}>
                {Object.entries(schema.properties).map(
                    ([key, prop]: [
                        string,
                        (
                            | OpenAPIV3.SchemaObject
                            | OpenAPIV3.ReferenceObject
                            | undefined
                        )
                    ]) => {
                        const isRequired =
                            Array.isArray(schema.required) &&
                            schema.required.includes(key)
                        return (
                            <SchemaPropertyRow
                                key={key}
                                keyName={key}
                                prop={prop}
                                level={level}
                                isRequired={isRequired}
                            />
                        )
                    }
                )}
            </Box>
        </>
    )
}
