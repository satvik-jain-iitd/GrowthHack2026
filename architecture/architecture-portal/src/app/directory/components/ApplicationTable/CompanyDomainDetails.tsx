/* istanbul ignore file */
import React from 'react'
import {
    Button,
    Dialog,
    CloseButton,
    Box,
    Text,
    Grid,
    Flex
} from '@chakra-ui/react'

import { UserAvatar } from '@/app/company-domains/components/UserAvatar'
import Image from 'next/image'
import { Domain } from '@/app/company-domains/types'

const CompanyDomainDetails = ({
    data,
    isOpen,
    onClose
}: {
    data: Domain | null
    isOpen: boolean
    onClose: () => void
}) => {
    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={isOpen => {
                if (!isOpen) onClose()
            }}
            size='xl'
            placement='center'
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content color={{ base: 'black', _dark: 'white' }}>
                    <Dialog.Header>
                        <Dialog.Title>{data?.domain_nm}</Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton onClick={onClose} />
                        </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Flex justifyContent={'space-between'}>
                            <Box w='75%'>
                                <Text>{data?.domain_ds}</Text>
                                <Grid
                                    mt='5'
                                    templateColumns='repeat(3, 1fr)'
                                    gap='6'
                                >
                                    <Flex>
                                        <UserAvatar
                                            email={
                                                data
                                                    ?.unit_cio_email_ad_da?.[0] ||
                                                ''
                                            }
                                            name={data?.unit_cio_nm || ''}
                                        />
                                        <Box ml='2'>
                                            <Text>Unit CIO</Text>
                                            <Text>
                                                {data?.unit_cio_nm || '--'}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <Flex>
                                        <UserAvatar
                                            email={
                                                data
                                                    ?.head_engnr_email_ad_da?.[0] ||
                                                ''
                                            }
                                            name={data?.head_engineer_nm || ''}
                                        />
                                        <Box ml='2'>
                                            <Text>Head Engineer</Text>
                                            <Text>
                                                {data?.head_engineer_nm || '--'}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <Flex>
                                        <UserAvatar
                                            email={
                                                data
                                                    ?.princ_ea_archt_email_ad_da?.[0] ||
                                                ''
                                            }
                                            name={
                                                data?.principal_ea_architect_nm ||
                                                ''
                                            }
                                        />
                                        <Box ml='2'>
                                            <Text>Principal Architect</Text>
                                            <Text>
                                                {data?.principal_ea_architect_nm ||
                                                    '--'}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <Flex>
                                        <UserAvatar
                                            email={
                                                data
                                                    ?.tech_own_email_ad_da?.[0] ||
                                                ''
                                            }
                                            name={data?.tech_owner_nm || ''}
                                        />
                                        <Box ml='2'>
                                            <Text>Tech Owner</Text>
                                            <Text>
                                                {data?.tech_owner_nm || '--'}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <Flex>
                                        <UserAvatar
                                            email={
                                                data
                                                    ?.ea_archt_dlgte_email_ad_da?.[0] ||
                                                ''
                                            }
                                            name={
                                                data?.ea_architect_delegate_nm ||
                                                ''
                                            }
                                        />
                                        <Box ml='2'>
                                            <Text>
                                                Unit CIO Architect (delegate)
                                            </Text>

                                            <Text>
                                                {data?.ea_architect_delegate_nm ||
                                                    '--'}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <Flex>
                                        <UserAvatar
                                            email={
                                                data
                                                    ?.ea_archt_email_ad_da?.[0] ||
                                                ''
                                            }
                                            name={data?.ea_architect_nm || ''}
                                        />
                                        <Box ml='2'>
                                            <Text>Enterprise Architect</Text>
                                            <Text>
                                                {data?.ea_architect_nm || '--'}
                                            </Text>
                                        </Box>
                                    </Flex>
                                </Grid>
                            </Box>
                            <Flex w='20%'>
                                <Box mr='2'>
                                    <Image
                                        src='/application-coding-web-code-write-svgrepo.png'
                                        alt='Icon'
                                        width={50}
                                        height={50}
                                    />
                                </Box>
                                <Box>
                                    <Text
                                        color=' #006fcf'
                                        fontSize='40px'
                                        fontWeight='700'
                                        lineHeight='44px'
                                    >
                                        {data?.app_count}
                                    </Text>
                                    <Text
                                        color='#006fcf'
                                        fontSize='16px'
                                        fontWeight='600'
                                    >
                                        APPLICATIONS
                                    </Text>
                                </Box>
                            </Flex>
                        </Flex>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button onClick={onClose}>Close</Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default CompanyDomainDetails
