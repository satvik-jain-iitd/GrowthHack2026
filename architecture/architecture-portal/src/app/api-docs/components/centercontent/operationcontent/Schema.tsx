/* istanbul ignore file */

import { Box, Text, HStack, NativeSelect } from '@chakra-ui/react'
import Styles from '@/app/api-docs/api-docs.module.scss'
import { useState } from 'react'
import { PARAM_LABEL_PROPS } from '@/app/api-docs/constants/styling'
import { SchemaProperties } from './SchemaProperties'
import { OpenAPIV3 } from 'openapi-types'

export function Schema({
    requestBody,
    responseBody,
    schemaType
}: {
    requestBody?: OpenAPIV3.RequestBodyObject | undefined
    responseBody?: OpenAPIV3.ResponseObject | undefined
    schemaType?: 'request' | 'response'
}) {
    const content =
        schemaType === 'request' ? requestBody?.content : responseBody?.content
    const contentTypes = Object.keys(content || {}).map(type => type)
    const [selectedContentType, setSelectedContentType] = useState<string>(
        contentTypes?.[0]
    )
    const schema = content?.[selectedContentType]?.schema

    if (contentTypes.length === 0) {
        return null
    }

    return (
        <Box
            width='100%'
            textAlign='left'
            mt='1em'
            className={Styles.apiDocsFontSize}
        >
            <HStack gap='1em'>
                <Text as='h4' fontWeight='600'>
                    {schemaType === 'request'
                        ? 'Request Body Schema'
                        : 'Response Body Schema'}
                </Text>
                {/*  if the there is only one content type no need for a select component */}
                {contentTypes.length === 1 ? (
                    <Text {...PARAM_LABEL_PROPS}>{contentTypes[0]}</Text>
                ) : (
                    <NativeSelect.Root
                        size='xs'
                        width='160px'
                        variant='outline'
                    >
                        <NativeSelect.Field
                            value={selectedContentType}
                            onChange={e =>
                                setSelectedContentType(e.currentTarget.value)
                            }
                        >
                            {contentTypes.map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                )}
            </HStack>
            {/* Render schema properties */}
            <SchemaProperties schema={schema} />
        </Box>
    )
}
