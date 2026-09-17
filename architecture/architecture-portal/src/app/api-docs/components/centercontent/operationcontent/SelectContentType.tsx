/* istanbul ignore file */

import { Box, Button, HStack } from '@chakra-ui/react'
import { useState } from 'react'
import { SchemaProperties } from './SchemaProperties'
import type { OpenAPIV3 } from 'openapi-types'

export function SelectContentType({
    schema,
    level
}: {
    schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined
    level: number
}) {
    const [selectedSchema, setSelectedSchema] = useState<number>(0)
    const handleSchemaSelect = (subSchema: number) => {
        setSelectedSchema(subSchema)
    }
    const options = schema && 'oneOf' in schema ? schema.oneOf : []
    if (!schema || (typeof schema === 'object' && '$ref' in schema)) return null
    return (
        <Box pl={level * 4} mt={level > 0 ? '0.5em' : undefined}>
            <HStack mb='0.5em' gap='1em' alignItems='center'>
                One of:
                <Box>
                    {options?.map(
                        (
                            subSchema:
                                | OpenAPIV3.SchemaObject
                                | OpenAPIV3.ReferenceObject
                                | undefined,
                            index: number
                        ) => (
                            <Button
                                key={index}
                                onClick={() => handleSchemaSelect(index)}
                                mr='0.5em'
                                size='xs'
                                variant={
                                    selectedSchema === index
                                        ? 'solid'
                                        : 'outline'
                                }
                            >
                                {'title' in (subSchema ?? {}) &&
                                (subSchema as OpenAPIV3.SchemaObject).title
                                    ? (subSchema as OpenAPIV3.SchemaObject)
                                          .title
                                    : `Option ${index + 1}`}
                            </Button>
                        )
                    )}
                </Box>
            </HStack>
            <SchemaProperties
                schema={options?.[selectedSchema]}
                level={level}
            />
        </Box>
    )
}
