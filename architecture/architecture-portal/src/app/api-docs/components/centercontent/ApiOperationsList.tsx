/* istanbul ignore file */
import { Box, Text, Link, HStack } from '@chakra-ui/react'
import Styles from '@/app/api-docs/api-docs.module.scss'
import { operationsLeftNav } from '@/app/api-docs/types/apiDocs'
import { getMethodColor } from '@/app/api-docs/utils/'
import Code from '@/app/api-docs/components/centercontent/CodeText'

function ApiOperationList({
    operations
}: {
    operations: Record<string, operationsLeftNav>
}) {
    const operationList = Object.keys(operations).map(opId => {
        const operation = operations[opId]
        return {
            id: opId,
            name: operation.name,
            uri: operation.resource,
            method: operation.method
        }
    })
    return (
        <Box
            bg='gray.50'
            _dark={{ bg: '#1b1e25' }}
            borderRadius='lg'
            w='100%'
            borderColor='#D4DEE9'
            borderWidth='1px'
        >
            <Box
                className={Styles.endpointsHeader}
                borderTopRadius='inherit'
                _dark={{
                    color: '#c8c9c7',
                    bg: '#21252c'
                }}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                px={4}
                py={2}
                fontWeight='600'
            >
                <span>Operations</span>
                <Box
                    as='span'
                    bg='gray.200'
                    _dark={{ bg: '#333842', color: '#c8c9c7' }}
                    color='gray.700'
                    fontSize='sm'
                    borderRadius='full'
                    px={2}
                    py={0.5}
                    ml={2}
                    minW='24px'
                    textAlign='center'
                    title={`Number of Operations: ${operationList.length}`}
                    _hover={{ cursor: 'default' }}
                >
                    {operationList.length}
                </Box>
            </Box>
            {/* Create a list of operation links with the method in the start and the uri as the link */}
            <Box
                className={`${Styles.endpointsList} ${Styles.apiDocsFontSize}`}
                px='2'
                py='4'
                maxH={'400px'}
                overflowY='auto'
            >
                {operationList.map(op => (
                    <HStack className={Styles.endpointItem} gap={2} key={op.id}>
                        <Code>
                            <Text
                                as='span'
                                fontWeight='500'
                                color={getMethodColor(op?.method || '')}
                                textAlign={'right'}
                                minWidth='40px'
                            >
                                {op.method}
                            </Text>
                            <Text as='span' ml={2}>
                                {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                                <Link href={`#${op.id}`}>{op.uri}</Link>
                            </Text>
                        </Code>
                    </HStack>
                ))}
            </Box>
        </Box>
    )
}

export { ApiOperationList }
