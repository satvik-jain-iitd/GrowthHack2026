/* istanbul ignore file */
import { Box, Flex, HStack, Portal } from '@chakra-ui/react'
import { Menu } from '@chakra-ui/react'
import { UserAvatar } from '../UserAvatar'
import { IconMoreVertical } from '@americanexpress/dls-icons'
import { Domain } from '@/app/company-domains/types'
import { Application } from '@/app/company-domains/types'

const featureFlags = {
    enableDirectoryMVP1Changes: true,
    enableEBCM: true,
    showDynamicApiPage: true,
    enableDashboard: false
}

export const DetailTableRow = ({
    application,
    HandleClick,
    allowUnlink,
    isAdmin,
    userDomains,
    domain,
    width
}: {
    application: Application
    HandleClick: (action: string, application: Application) => void
    allowUnlink: boolean
    isAdmin: boolean | undefined
    userDomains: string[] | null
    domain: Domain
    width: string
}) => {
    return (
        <Box
            key={application.application_id}
            borderBottom='1px solid #E4E4E7'
            height='70px'
        >
            <HStack
                justifyContent='space-between'
                minWidth={width}
                textAlign='left'
                paddingY='16px'
            >
                <Box width='8%' paddingX='12px'>
                    {application.application_id}
                </Box>
                <Box width='17.4%' paddingX='12px' whiteSpace='wrap'>
                    {application.application_nm}
                </Box>
                <Box width='17.4%' paddingX='12px'>
                    <Flex alignItems={'center'}>
                        <div style={{ marginRight: '5px' }}>
                            <UserAvatar
                                email={
                                    application?.central_application_da
                                        ?.ownershipInfo?.applicationOwner?.email
                                }
                                name={
                                    application?.central_application_da
                                        ?.ownershipInfo?.applicationOwner
                                        ?.fullName
                                }
                            />
                        </div>
                        <div>
                            {' '}
                            {
                                application?.central_application_da
                                    ?.ownershipInfo?.applicationOwner?.fullName
                            }
                        </div>
                    </Flex>
                </Box>
                <Box width='17.4%' paddingX='12px'>
                    <Flex alignItems={'center'}>
                        <div style={{ marginRight: '5px' }}>
                            <UserAvatar
                                email={
                                    application?.central_application_da
                                        ?.ownershipInfo?.applicationOwnerLeader1
                                        ?.email
                                }
                                name={
                                    application?.central_application_da
                                        ?.ownershipInfo?.applicationOwnerLeader1
                                        ?.fullName
                                }
                            />
                        </div>
                        <div>
                            {' '}
                            {
                                application?.central_application_da
                                    ?.ownershipInfo?.applicationOwnerLeader1
                                    ?.fullName
                            }
                        </div>
                    </Flex>
                </Box>
                <Box width='17.4%' paddingX='12px'>
                    <Flex alignItems={'center'}>
                        <div style={{ marginRight: '5px' }}>
                            <UserAvatar
                                email={
                                    application?.central_application_da
                                        ?.ownershipInfo?.applicationOwnerLeader2
                                        ?.email
                                }
                                name={
                                    application?.central_application_da
                                        ?.ownershipInfo?.applicationOwnerLeader2
                                        ?.fullName
                                }
                            />
                        </div>
                        <div>
                            {' '}
                            {
                                application?.central_application_da
                                    ?.ownershipInfo?.applicationOwnerLeader2
                                    ?.fullName
                            }
                        </div>
                    </Flex>
                </Box>
                <Box width='17.4%' paddingX='12px'>
                    <Flex alignItems={'center'}>
                        <div style={{ marginRight: '5px' }}>
                            <UserAvatar
                                email={
                                    application?.central_application_da
                                        ?.ownershipInfo?.businessOwner?.email
                                }
                                name={
                                    application?.central_application_da
                                        ?.ownershipInfo?.businessOwner?.fullName
                                }
                            />
                        </div>
                        <div>
                            {' '}
                            {
                                application?.central_application_da
                                    ?.ownershipInfo?.businessOwner?.fullName
                            }{' '}
                        </div>
                    </Flex>
                </Box>
                <Box
                    width='5%'
                    paddingX='12px'
                    textAlign='center'
                    position={'relative'}
                >
                    <div
                        style={{
                            alignSelf: application ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <Menu.Root positioning={{ hideWhenDetached: true }}>
                            <Menu.Trigger aria-label='Options'>
                                <IconMoreVertical size='md' />
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content
                                        style={{
                                            zIndex: 1
                                        }}
                                    >
                                        <Menu.Item
                                            value='applicationDetail'
                                            onClick={() =>
                                                HandleClick(
                                                    'Application Detail',
                                                    application
                                                )
                                            }
                                        >
                                            Application Details
                                        </Menu.Item>

                                        {((application.ebc_level_4_nm &&
                                            application.ebc_level_4_nm !==
                                                'null') ||
                                            (application.ebc_level_3_nm &&
                                                application.ebc_level_3_nm !==
                                                    'null')) &&
                                            featureFlags.enableEBCM && (
                                                <Menu.Item
                                                    value='ebcmDetail'
                                                    onClick={() => {
                                                        HandleClick(
                                                            'EBCM Details',
                                                            application
                                                        )
                                                    }}
                                                    disabled={
                                                        (!application.ebc_level_4_nm ||
                                                            application.ebc_level_4_nm ===
                                                                'null') &&
                                                        (!application.ebc_level_3_nm ||
                                                            application.ebc_level_3_nm ===
                                                                'null')
                                                    }
                                                >
                                                    EBCM Details
                                                </Menu.Item>
                                            )}

                                        {allowUnlink &&
                                            (isAdmin ||
                                                userDomains?.includes(
                                                    domain.company_domain_id
                                                )) && (
                                                <Menu.Item
                                                    value='unlinkApplication'
                                                    onClick={() => {
                                                        HandleClick(
                                                            'Unlink Application',
                                                            application
                                                        )
                                                    }}
                                                    disabled={
                                                        !(
                                                            isAdmin ||
                                                            userDomains?.includes(
                                                                domain.company_domain_id
                                                            )
                                                        )
                                                    }
                                                >
                                                    Unlink Application
                                                </Menu.Item>
                                            )}
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    </div>
                </Box>
            </HStack>
        </Box>
    )
}
