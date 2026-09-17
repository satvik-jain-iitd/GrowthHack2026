/* istanbul ignore file */

import { Box, Text, Badge } from '@chakra-ui/react'
import { Markdown } from './Markdown'
import Styles from '@/app/api-docs/api-docs.module.scss'
import type { OpenAPIV3 } from 'openapi-types'
import {
    PARAM_BOX_PROPS,
    PARAM_TEXT_PROPS,
    PARAM_LABEL_PROPS,
    PARAM_BADGE_PROPS
} from '../../../constants/styling'
import { CodeBlock } from './CodeBlock'
import Code from '@/app/api-docs/components/centercontent/CodeText'

export function Parameters({
    parameters
}: {
    parameters: (OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject)[]
}) {
    if (Array.isArray(parameters) && parameters.length === 0) {
        return null
    }
    // If there is only a body parameter/s, do not show the parameters section
    const nonBodyParams = Array.isArray(parameters)
        ? parameters.filter(
              (param): param is OpenAPIV3.ParameterObject =>
                  typeof param === 'object' &&
                  !('$ref' in param) &&
                  param.in !== 'body'
          )
        : []
    if (nonBodyParams.length === 0) {
        return null
    }

    return (
        <Box
            width='100%'
            textAlign='left'
            mt='1em'
            className={Styles.apiDocsFontSize}
        >
            <Text as='h4' fontWeight='600' mb='0.5em'>
                Parameters
            </Text>
            {nonBodyParams.map((param: OpenAPIV3.ParameterObject, index) => (
                <Box key={index} {...PARAM_BOX_PROPS}>
                    <Text fontWeight='600' ml={-1}>
                        <Code>{param.name}</Code>
                        <CodeBlock
                            mx='0.25em'
                            val={
                                param.schema && 'type' in param.schema
                                    ? (param.schema as OpenAPIV3.SchemaObject)
                                          .type || 'any'
                                    : 'any'
                            }
                        />
                        <Badge {...PARAM_BADGE_PROPS} variant='outline'>
                            {param.in}
                        </Badge>
                        {param.required && (
                            <Badge
                                ml='0.5em'
                                colorPalette='red'
                                variant='outline'
                            >
                                Required
                            </Badge>
                        )}
                    </Text>
                    {'default' in (param.schema ?? {}) &&
                        (param.schema as OpenAPIV3.SchemaObject).default !==
                            undefined && (
                            <Text {...PARAM_LABEL_PROPS}>
                                Default:{' '}
                                <CodeBlock
                                    val={
                                        (param.schema as OpenAPIV3.SchemaObject)
                                            .default
                                    }
                                />
                            </Text>
                        )}
                    {param.schema &&
                        (param.schema as OpenAPIV3.SchemaObject).enum && (
                            <Text {...PARAM_LABEL_PROPS}>
                                Possible values:{' '}
                                {(
                                    param.schema as OpenAPIV3.SchemaObject
                                ).enum?.map((val: string) => (
                                    <CodeBlock
                                        key={val}
                                        mr='0.25em'
                                        p='0.25em 0.4em'
                                        val={val}
                                    />
                                ))}
                            </Text>
                        )}
                    {param.description && (
                        <Text {...PARAM_TEXT_PROPS} as='div'>
                            <Markdown fontSize='xs'>
                                {param.description}
                            </Markdown>
                        </Text>
                    )}
                    {param.schema &&
                        (param.schema as OpenAPIV3.SchemaObject).example && (
                            <Text {...PARAM_LABEL_PROPS}>
                                Example:{' '}
                                <CodeBlock
                                    w='100%'
                                    overflowX='auto'
                                    padding='0.75em'
                                    borderWidth='0.6px'
                                    val={
                                        (param.schema as OpenAPIV3.SchemaObject)
                                            .example
                                    }
                                />
                            </Text>
                        )}
                </Box>
            ))}
        </Box>
    )
}
