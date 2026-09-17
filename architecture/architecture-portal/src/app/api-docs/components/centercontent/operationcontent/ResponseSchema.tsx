/* istanbul ignore file */

import { Box, Text } from '@chakra-ui/react'
import type { OpenAPIV3 } from 'openapi-types'
import Styles from '@/app/api-docs/api-docs.module.scss'
import { ResponseCode } from './ResponseCode'

export function ResponseSchema({
    responses
}: {
    responses: OpenAPIV3.ResponsesObject
}) {
    return (
        <Box
            width='100%'
            textAlign='left'
            mt='1em'
            className={Styles.apiDocsFontSize}
        >
            <Text as='h4' fontWeight='600'>
                Responses
            </Text>
            {Object.entries(responses).map(([statusCode, response]) => {
                if (
                    typeof response !== 'object' ||
                    response === null ||
                    '$ref' in response ||
                    !/^(\d{3}|[1-5]XX)$/.test(statusCode)
                ) {
                    return null
                }
                return (
                    <ResponseCode
                        key={statusCode}
                        statusCode={statusCode}
                        response={response}
                    />
                )
            })}
        </Box>
    )
}
