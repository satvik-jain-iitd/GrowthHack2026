/* istanbul ignore file */
import { Flex, Box, Table, Text, Spinner } from '@chakra-ui/react'
import { useSidebarOpen } from '@/context'
import { UserAvatar } from '@/app/company-domains/components/UserAvatar'
import { Application } from '@/app/company-domains/types'
import { NoPrefetchLink as Link } from '@/components/ui'

interface Props {
    applicationName: string
    centralId: string
    link: string
    applicationData?: Application
    isLoading?: boolean
}

export const ApplicationTableRow = ({
    applicationName,
    centralId,
    link,
    applicationData,
    isLoading = false
}: Props) => {
    const { sidebarOpen, toggleSidebar } = useSidebarOpen()

    const { central_application_da } = applicationData || {}

    return (
        <Table.Row
            backgroundColor={{ base: 'white', _dark: '#27272a' }}
            height='64px'
        >
            <Table.Cell height='64px' minW='15rem'>
                <Link
                    href={link}
                    onClick={e => {
                        e.stopPropagation()
                        if (sidebarOpen) toggleSidebar()
                    }}
                >
                    <Text
                        color='text.link'
                        whiteSpace='normal'
                        wordWrap='break-word'
                        fontSize='md'
                        _hover={{
                            textDecoration: 'underline',
                            cursor: 'pointer'
                        }}
                    >
                        {applicationName}
                    </Text>
                </Link>
            </Table.Cell>
            <Table.Cell color='fg'>
                <Text whiteSpace='normal' wordWrap='break-word' fontSize={'md'}>
                    {centralId}
                </Text>
            </Table.Cell>
            <Table.Cell color='fg'>
                {isLoading ? (
                    <Spinner size='sm' />
                ) : central_application_da?.ownershipInfo?.applicationOwner
                      ?.fullName ? (
                    <Flex align='center'>
                        <Box pr={'16px'}>
                            <UserAvatar
                                email={
                                    central_application_da?.ownershipInfo
                                        ?.applicationOwner?.email || ''
                                }
                                name={
                                    central_application_da?.ownershipInfo
                                        ?.applicationOwner?.fullName || ''
                                }
                            />
                        </Box>
                        <Box>
                            <Flex direction='column'>
                                <Text
                                    whiteSpace='normal'
                                    wordWrap='break-word'
                                    fontSize={'md'}
                                >
                                    {
                                        central_application_da?.ownershipInfo
                                            ?.applicationOwner?.fullName
                                    }
                                </Text>
                            </Flex>
                        </Box>
                    </Flex>
                ) : (
                    <Text
                        whiteSpace='normal'
                        wordWrap='break-word'
                        fontSize={'md'}
                    >
                        --
                    </Text>
                )}
            </Table.Cell>
            <Table.Cell color='fg'>
                {isLoading ? (
                    <Spinner size='sm' />
                ) : (
                    <Text
                        whiteSpace='normal'
                        wordWrap='break-word'
                        fontSize={'md'}
                    >
                        {applicationData?.domain_nm || '--'}
                    </Text>
                )}
            </Table.Cell>
        </Table.Row>
    )
}
