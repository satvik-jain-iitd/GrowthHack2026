/* istanbul ignore file */

import { Box, Text, HStack, NativeSelect, Skeleton } from '@chakra-ui/react'
import Styles from '@/app/api-docs/api-docs.module.scss'
import { JsonViewer } from './JsonViewer'
import {
    PARAMS_SAMPLE_BOX,
    PARAM_RIGHTPANEL_HEADER
} from '@/app/api-docs/constants'
import type { OpenAPIV3 } from 'openapi-types'
import { getSchemaExample } from '@/app/api-docs/utils/parseSpecFile'
import { useState } from 'react'

export function ResponseSample({
    responses,
    loading
}: {
    responses: OpenAPIV3.ResponsesObject | undefined
    loading: boolean
}) {
    const statusCodes = Object.keys(responses || {})
    const [selectedResponse, setSelectedResponse] = useState<string>(
        statusCodes[0]
    )

    const responseSample = getSchemaExample(
        responses?.[selectedResponse] as OpenAPIV3.ResponseObject | undefined
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
                        <Text fontWeight='600'>Response Sample</Text>
                        <HStack ml='auto' gap='0.5em'>
                            <Text>Status Code:</Text>
                            <NativeSelect.Root size='sm' width='80px'>
                                <NativeSelect.Field
                                    value={selectedResponse}
                                    onChange={e =>
                                        setSelectedResponse(
                                            e.currentTarget.value
                                        )
                                    }
                                    color={
                                        selectedResponse?.startsWith('2')
                                            ? '#1e8127'
                                            : '#d4201c'
                                    }
                                    fontWeight={'600'}
                                >
                                    {statusCodes.map(
                                        statusCode =>
                                            // Only include valid status codes (e.g., "2XX") in the dropdown
                                            /^(\d{3}|[1-5]XX)$/.test(
                                                statusCode
                                            ) && (
                                                <option
                                                    key={statusCode}
                                                    value={statusCode}
                                                >
                                                    {statusCode}
                                                </option>
                                            )
                                    )}
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        </HStack>
                    </Box>
                    <JsonViewer value={responseSample || {}} />
                </>
            )}
        </Box>
    )
}
