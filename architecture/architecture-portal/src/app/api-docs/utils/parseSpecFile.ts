/* istanbul ignore file */
import * as OpenAPISampler from 'openapi-sampler'
import type { OpenAPI, OpenAPIV3 } from 'openapi-types'

export function getOperationComponents(
    schema: OpenAPI.Document,
    method: keyof OpenAPIV3.PathItemObject
) {
    try {
        const paths = schema?.paths ?? {}
        const path = Object.keys(paths)[0] || ''
        const methods: OpenAPIV3.PathItemObject = (paths[path] ||
            {}) as OpenAPIV3.PathItemObject
        const operationObject =
            ((methods as OpenAPIV3.PathItemObject)[method] as
                | OpenAPIV3.OperationObject
                | undefined) ||
            (methods[
                Object.keys(methods)[0] as keyof OpenAPIV3.PathItemObject
            ] as OpenAPIV3.OperationObject | undefined)
        const description = operationObject?.description || ''
        const parameters = operationObject?.parameters || []
        const servers =
            'servers' in schema &&
            Array.isArray((schema as OpenAPIV3.Document).servers)
                ? ((schema as OpenAPIV3.Document)
                      .servers as OpenAPIV3.ServerObject[])
                : []
        const requestBody = operationObject?.requestBody as
            | OpenAPIV3.RequestBodyObject
            | undefined
        const responses = operationObject?.responses || {}

        return {
            path,
            method,
            opDescription: description,
            parameters,
            requestBody,
            responses,
            servers
        }
    } catch (error) {
        console.log(`Error parsing OpenAPI schema: ${JSON.stringify(error)}`, {
            isApiDocsError: true
        })
        return {
            path: '',
            method: '',
            opDescription: '',
            parameters: [],
            requestBody: undefined,
            responses: {},
            servers: []
        }
    }
}

export function getSchemaExample(
    schema:
        | OpenAPIV3.RequestBodyObject
        | OpenAPIV3.ResponseObject
        | OpenAPIV3.ReferenceObject
        | undefined
) {
    const extractSchema = (
        schemaObj:
            | OpenAPIV3.RequestBodyObject
            | OpenAPIV3.ResponseObject
            | OpenAPIV3.ReferenceObject
            | undefined
    ): object => {
        try {
            if (!schemaObj) return {}
            if ('$ref' in schemaObj) return schemaObj
            if ('content' in schemaObj && schemaObj.content) {
                const mediaType = Object.keys(schemaObj.content)[0]
                return schemaObj.content[mediaType]?.schema || {}
            }
            return schemaObj
        } catch (error) {
            console.log(
                `Error parsing OpenAPI schema sample: ${JSON.stringify(error)}`,
                {
                    isApiDocsError: true
                }
            )
            return {}
        }
    }

    const extractedSchema = extractSchema(schema)
    const sample = OpenAPISampler.sample(extractedSchema, {
        skipWriteOnly: false,
        skipReadOnly: false
    })

    return sample
}
