/* istanbul ignore file */

import { VStack } from '@chakra-ui/react'
import type { OpenAPIV3 } from 'openapi-types'
import { RequestSample } from './RequestSample'
import { ResponseSample } from './ResponseSample'

export function OperationRightSectionContent({
    requestBody,
    responses,
    loading
}: {
    requestBody: OpenAPIV3.RequestBodyObject | undefined
    responses: OpenAPIV3.ResponsesObject | undefined
    loading: boolean
}) {
    if (!requestBody && !responses) {
        return null
    }
    let height = '85vh'
    if (!requestBody || !responses) {
        height = '100%'
    }
    return (
        <VStack width='100%' alignItems='stretch' gap='2em' height={height}>
            {requestBody && (
                <RequestSample requestBody={requestBody} loading={loading} />
            )}
            {responses && (
                <ResponseSample responses={responses} loading={loading} />
            )}
        </VStack>
    )
}
