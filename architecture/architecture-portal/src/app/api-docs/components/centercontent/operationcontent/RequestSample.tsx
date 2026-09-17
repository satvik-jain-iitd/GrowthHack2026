/* istanbul ignore file */

import { Box, Text, NativeSelect, HStack, Skeleton } from '@chakra-ui/react'
import Styles from '@/app/api-docs/api-docs.module.scss'
import { JsonViewer } from './JsonViewer'
import {
    PARAMS_SAMPLE_BOX,
    PARAM_RIGHTPANEL_HEADER
} from '@/app/api-docs/constants'
import type { OpenAPIV3 } from 'openapi-types'
import { getSchemaExample } from '@/app/api-docs/utils/parseSpecFile'
import { useState, useMemo } from 'react'

export function RequestSample({
    requestBody,
    loading
}: {
    requestBody: OpenAPIV3.RequestBodyObject | undefined
    loading: boolean
}) {
    const contentTypes = useMemo(
        () => Object.keys(requestBody?.content || {}),
        [requestBody]
    )
    const [selectedContentType, setSelectedContentType] = useState(
        contentTypes[0]
    )

    // Update selectedContentType if contentTypes change
    // (prevents stale selection if requestBody changes)
    if (!contentTypes.includes(selectedContentType)) {
        setSelectedContentType(contentTypes[0])
    }

    const schema = requestBody?.content?.[selectedContentType]?.schema

    const { hasAnyOf, hasOneOf, examplesKeys } = useMemo(() => {
        if (
            schema &&
            typeof schema === 'object' &&
            !('$ref' in schema) &&
            (Array.isArray((schema as OpenAPIV3.SchemaObject).anyOf) ||
                Array.isArray((schema as OpenAPIV3.SchemaObject).oneOf))
        ) {
            const anyOf = (schema as OpenAPIV3.SchemaObject).anyOf
            const oneOf = (schema as OpenAPIV3.SchemaObject).oneOf
            const arr = anyOf || oneOf || []
            return {
                hasAnyOf: Array.isArray(anyOf),
                hasOneOf: Array.isArray(oneOf),
                examples: arr,
                examplesKeys: arr.map((ex, idx) =>
                    'title' in (ex ?? {}) &&
                    (ex as OpenAPIV3.SchemaObject).title
                        ? (ex as OpenAPIV3.SchemaObject).title!
                        : `Option ${idx + 1}`
                )
            }
        }
        return {
            hasAnyOf: false,
            hasOneOf: false,
            examples: [],
            examplesKeys: []
        }
    }, [schema])

    const [example, setExample] = useState<string | undefined>(
        examplesKeys?.[0] || undefined
    )

    // Keep example in sync with examplesKeys
    if (examplesKeys.length && !examplesKeys.includes(example!)) {
        setExample(examplesKeys[0])
    }

    // Prepare requestBody for sample extraction if there are anyOf/oneOf schemas and an example is selected
    const selectedRequestBody = useMemo(() => {
        if (!requestBody) return undefined
        const content = requestBody.content
        if (!content) return undefined
        const newContent = {
            [selectedContentType]: { ...content[selectedContentType] }
        }
        const temp = { ...requestBody, content: newContent }
        if ((hasAnyOf || hasOneOf) && example) {
            const exampleIndex = examplesKeys.indexOf(example)
            if (
                exampleIndex !== -1 &&
                temp.content?.[selectedContentType]?.schema &&
                typeof temp.content[selectedContentType].schema === 'object' &&
                !('$ref' in temp.content[selectedContentType].schema)
            ) {
                const schemaObj = temp.content[selectedContentType]
                    .schema as OpenAPIV3.SchemaObject
                const selectedSchema = hasAnyOf
                    ? (schemaObj.anyOf as OpenAPIV3.SchemaObject[])[
                          exampleIndex
                      ]
                    : (schemaObj.oneOf as OpenAPIV3.SchemaObject[])[
                          exampleIndex
                      ]
                temp.content[selectedContentType].schema = selectedSchema
            }
        }
        return temp as OpenAPIV3.RequestBodyObject
    }, [
        requestBody,
        selectedContentType,
        hasAnyOf,
        hasOneOf,
        example,
        examplesKeys
    ])

    const requestSample = useMemo(
        () => getSchemaExample(selectedRequestBody),
        [selectedRequestBody]
    )

    return (
        <Box {...PARAMS_SAMPLE_BOX}>
            {loading && <Skeleton loading={loading} />}
            {!loading && (
                <>
                    <Box
                        className={Styles.endpointsHeader}
                        {...PARAM_RIGHTPANEL_HEADER}
                    >
                        <HStack gap='1em' justify='space-between' width='100%'>
                            <Text fontWeight='600'>Request Sample</Text>
                            <Box
                                gap='0.5em'
                                ml='auto'
                                display='flex'
                                alignItems='center'
                            >
                                <HStack gap='0.5em' display='inline-flex'>
                                    {contentTypes.length > 1 ? (
                                        <>
                                            <Text>Content Type:</Text>
                                            <NativeSelect.Root
                                                size='sm'
                                                width='150px'
                                            >
                                                <NativeSelect.Field
                                                    value={selectedContentType}
                                                    onChange={e =>
                                                        setSelectedContentType(
                                                            e.currentTarget
                                                                .value
                                                        )
                                                    }
                                                >
                                                    {contentTypes.map(
                                                        contentType => (
                                                            <option
                                                                key={
                                                                    contentType
                                                                }
                                                                value={
                                                                    contentType
                                                                }
                                                            >
                                                                {contentType}
                                                            </option>
                                                        )
                                                    )}
                                                </NativeSelect.Field>
                                                <NativeSelect.Indicator />
                                            </NativeSelect.Root>
                                        </>
                                    ) : (
                                        <Text fontWeight={'400'}>
                                            {selectedContentType}
                                        </Text>
                                    )}
                                </HStack>
                                {examplesKeys.length > 1 && (
                                    <HStack gap='0.5em' display='inline-flex'>
                                        <Text>Example:</Text>
                                        <NativeSelect.Root
                                            size='sm'
                                            width='150px'
                                        >
                                            <NativeSelect.Field
                                                value={example}
                                                onChange={e =>
                                                    setExample(
                                                        e.currentTarget.value
                                                    )
                                                }
                                            >
                                                {examplesKeys.map(ex => (
                                                    <option key={ex} value={ex}>
                                                        {ex}
                                                    </option>
                                                ))}
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>
                                    </HStack>
                                )}
                            </Box>
                        </HStack>
                    </Box>
                    <JsonViewer value={requestSample || {}} />
                </>
            )}
        </Box>
    )
}
