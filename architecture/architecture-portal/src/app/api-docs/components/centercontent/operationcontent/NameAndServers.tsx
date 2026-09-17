/* istanbul ignore file */

import {
    Box,
    Text,
    Popover,
    Button,
    Portal,
    Input,
    VStack,
    Badge,
    Field
} from '@chakra-ui/react'
import { IconChevronDown, IconChevronUp } from '@americanexpress/dls-icons'
import { getMethodColor } from '@/app/api-docs/utils'
import type { OpenAPIV3 } from 'openapi-types'
import { useState } from 'react'
import Code from '@/app/api-docs/components/centercontent/CodeText'

export function NameAndServers({
    servers,
    method,
    path
}: {
    servers: OpenAPIV3.ServerObject[]
    method: string
    path: string
}) {
    const [serversIsOpen, setServersOpen] = useState(false)
    return (
        <>
            <Popover.Root positioning={{ sameWidth: true }}>
                <Popover.Trigger asChild>
                    <Button
                        variant='outline'
                        onClick={() => setServersOpen(!serversIsOpen)}
                        w='100%'
                        borderColor='#D4DEE9'
                        pl='0'
                    >
                        <Box
                            display={'flex'}
                            justifyContent='space-between'
                            w='100%'
                        >
                            <Box gap={1}>
                                <Code>
                                    <Badge
                                        variant={'solid'}
                                        bgColor={getMethodColor(method)}
                                        _dark={{
                                            color: 'gray.300'
                                        }}
                                        mr='0.5em'
                                    >
                                        {method?.toUpperCase()}
                                    </Badge>{' '}
                                    {path}{' '}
                                </Code>
                            </Box>
                            {serversIsOpen ? (
                                <IconChevronUp />
                            ) : (
                                <IconChevronDown />
                            )}
                        </Box>
                    </Button>
                </Popover.Trigger>
                <Portal>
                    <Popover.Positioner>
                        <Popover.Content w='100%'>
                            <Popover.Body>
                                {servers?.length > 0 ? (
                                    <VStack align='start' w={'100%'}>
                                        {servers.map(
                                            (
                                                server: OpenAPIV3.ServerObject
                                            ) => (
                                                <Field.Root
                                                    required
                                                    key={
                                                        server.url +
                                                        server.description
                                                    }
                                                >
                                                    <Field.Label>
                                                        {server.description}
                                                    </Field.Label>
                                                    <Input
                                                        placeholder='Enter your email'
                                                        readOnly
                                                        value={server.url}
                                                        fontFamily='mono'
                                                        fontSize={'xs'}
                                                        color={'#686565'}
                                                    />
                                                </Field.Root>
                                            )
                                        )}
                                    </VStack>
                                ) : (
                                    <Text>
                                        No servers information available
                                    </Text>
                                )}
                            </Popover.Body>
                        </Popover.Content>
                    </Popover.Positioner>
                </Portal>
            </Popover.Root>
        </>
    )
}
