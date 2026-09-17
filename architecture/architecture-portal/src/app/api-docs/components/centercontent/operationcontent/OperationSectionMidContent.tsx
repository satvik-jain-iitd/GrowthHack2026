/* istanbul ignore file */

import React from 'react'
import { Box, VStack, Skeleton } from '@chakra-ui/react'
import { getOperationComponents } from '@/app/api-docs/utils/parseSpecFile'
import { NameAndServers } from './NameAndServers'
import { Description } from './Description'
import { Parameters as Params } from './Parameters'
import { Schema } from './Schema'
import { ResponseSchema } from './ResponseSchema'
import { OperationMetadataBlock } from './OperationMetadataBlock'
import { OperationMetadata } from '@/app/api-docs/types/apiDocs'

export function OperationSectionMidContent({
    id,
    title,
    operationComponents,
    loading,
    metadata,
    status
}: {
    id: string
    title: string
    operationComponents: ReturnType<typeof getOperationComponents> | null
    loading: boolean
    metadata: OperationMetadata
    status?: string
}) {
    if (!operationComponents || loading) {
        return <Skeleton height='200px' />
    }
    const {
        path,
        method,
        opDescription,
        parameters,
        servers,
        requestBody,
        responses
    } = operationComponents
    return (
        <Box id={id} width='100%' boxSizing='border-box'>
            <OperationMetadataBlock
                title={title}
                metadata={metadata}
                status={status}
            />
            <VStack mt='1em' boxSizing='border-box'>
                <NameAndServers servers={servers} method={method} path={path} />
                <Description opDescription={opDescription} />
                <Params parameters={parameters} />
                <Schema requestBody={requestBody} schemaType='request' />
                <ResponseSchema responses={responses} />
            </VStack>
        </Box>
    )
}
