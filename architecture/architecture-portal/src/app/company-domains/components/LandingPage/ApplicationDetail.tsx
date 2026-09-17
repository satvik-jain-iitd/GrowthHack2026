import {
    IconInsurance,
    IconLaptop,
    IconBank,
    IconProcessing,
    IconGlobal,
    IconLink
} from '@americanexpress/dls-icons'
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    useDisclosure
} from '@chakra-ui/react'
import { UserAvatar } from '../UserAvatar'
import { Application } from '@/app/company-domains/types'
import { User } from '@/app/layout/AuthBlueSso'
import { useUserContext } from '@/context'
import Image from 'next/image'
import { useState } from 'react'
import ApplicationMapping from './ApplicationMapping'
import LinkApplication from '@/app/directory/components/ApplicationTable/LinkApplication'
import { DomainProvider } from '@/context/DomainContext'
import { useNavigation } from '@/hooks'
import { showAdmin } from '@/app/admin/utils'

export const ApplicationDetail = ({
    applicationData,
    setOpenModal
}: {
    applicationData: Application | null
    setOpenModal: (isOpen: boolean) => void
}) => {
    const router = useNavigation()
    const { central_application_da, application_id } = applicationData || {}

    const user: User | undefined = useUserContext()
    const isAdmin = showAdmin(user?.groups || [])
    const domainId = applicationData?.company_domain_id
    const domainName = applicationData?.domain_nm
    const userDomains = user?.userDirectoryAccess?.domains

    const [modalDetails, setModalDetails] = useState<{
        name?: string
        data?: string
        isLinked?: boolean
    }>({})
    const { open: isOpen, onOpen, onClose } = useDisclosure()

    const appInfo = [
        {
            icon: IconInsurance,
            label: 'Central ID',
            value: application_id
        },
        {
            icon: IconBank,
            label: 'Line of Business 2',
            value:
                central_application_da?.lineOfBusiness?.lineOfBusiness2 || '--'
        },
        {
            icon: IconProcessing,
            label: 'Lifecycle Status',
            value: central_application_da?.lifeCycleStatus
        },
        {
            icon: IconGlobal,
            label: 'Countries Support',
            value: 'Global'
        },
        {
            icon: IconLaptop,
            label: 'App Type',
            value: central_application_da?.appType
        }
    ]

    const owners = [
        {
            label: 'Owner',
            name: central_application_da?.ownershipInfo?.applicationOwner
                ?.fullName,
            email: central_application_da?.ownershipInfo?.applicationOwner
                ?.email
        },
        {
            label: 'Unit CIO',
            name: central_application_da?.ownershipInfo?.unitCIO?.fullName,
            email: central_application_da?.ownershipInfo?.unitCIO?.email
        },
        {
            label: 'SVP',
            name: central_application_da?.ownershipInfo?.ownerSVP?.fullName,
            email: central_application_da?.ownershipInfo?.ownerSVP?.email
        },
        {
            label: 'VP2',
            name: central_application_da?.ownershipInfo?.applicationOwnerLeader2
                ?.fullName,
            email: central_application_da?.ownershipInfo
                ?.applicationOwnerLeader2?.email
        },
        {
            label: 'Business Owner',
            name: central_application_da?.ownershipInfo?.businessOwner
                ?.fullName,
            email: central_application_da?.ownershipInfo?.businessOwner?.email
        },
        {
            label: 'PMO',
            name: central_application_da?.ownershipInfo?.pmo?.fullName,
            email: central_application_da?.ownershipInfo?.pmo?.email
        },
        {
            label: 'VP 1',
            name: central_application_da?.ownershipInfo?.applicationOwnerLeader1
                ?.fullName,
            email: central_application_da?.ownershipInfo
                ?.applicationOwnerLeader1?.email
        },
        {
            label: 'Business VP',
            name: central_application_da?.ownershipInfo?.businessOwnerLeader1
                ?.fullName,
            email: central_application_da?.ownershipInfo?.businessOwnerLeader1
                ?.email
        },
        {
            label: 'Production Support Owner',
            name: central_application_da?.ownershipInfo?.productionSupportOwner
                ?.fullName,
            email: central_application_da?.ownershipInfo?.productionSupportOwner
                ?.email
        },
        {
            label: 'Production Support VP',
            name: central_application_da?.ownershipInfo
                ?.productionSupportOwnerLeader1?.fullName,
            email: central_application_da?.ownershipInfo
                ?.productionSupportOwnerLeader1?.email
        }
    ]

    const onClickModal = (
        e: React.MouseEvent<HTMLButtonElement>,
        label: string,
        isLinked: boolean
    ) => {
        e.stopPropagation()
        onOpen()

        setModalDetails({
            name: label,
            data: domainName,
            isLinked
        })
    }

    const handleEdit = (application_id: string) => {
        router.push(`/applications/${application_id}`)
    }

    return (
        <>
            <Grid templateColumns='repeat(5, 1fr)' gap={8}>
                <GridItem
                    w='100%'
                    colSpan={3}
                    paddingRight='40px'
                    borderRight='1px solid #c8c9c7'
                >
                    <Box textWrap='auto'>
                        {central_application_da?.description}
                    </Box>

                    <Grid
                        templateColumns={{
                            base: 'repeat(3, 1fr)'
                        }}
                        mt={8}
                        gap={4}
                        width='80%'
                    >
                        {appInfo.map((app, index) => {
                            const { icon: Icon, label, value } = app
                            return (
                                <Flex key={index}>
                                    <Box>
                                        <Icon
                                            style={{ fontSize: '1.375rem' }}
                                        />
                                    </Box>
                                    <Box ml='2'>
                                        <Flex direction='column'>
                                            <Box fontWeight='700'>{label}</Box>
                                            <Box>{value}</Box>
                                        </Flex>
                                    </Box>
                                </Flex>
                            )
                        })}
                    </Grid>
                </GridItem>
                <GridItem w='100%' colSpan={2}>
                    <div>
                        <div>Owner / SMEs</div>
                        <Grid
                            templateColumns={{
                                base: 'repeat(2, 1fr)'
                            }}
                            mt={4}
                            gap={4}
                        >
                            {owners.map((owner, index) => {
                                return (
                                    <Flex key={index}>
                                        <Box pr={1}>
                                            <UserAvatar
                                                email={owner?.email || ''}
                                                name={owner?.name}
                                            />
                                        </Box>
                                        <Box>
                                            <Flex direction='column'>
                                                <Box fontWeight='700'>
                                                    {owner.label}
                                                </Box>
                                                <Box>{owner?.name}</Box>
                                            </Flex>
                                        </Box>
                                    </Flex>
                                )
                            })}
                        </Grid>
                    </div>
                </GridItem>
            </Grid>
            <Box mt='10'>
                <Button
                    onClick={() => handleEdit(application_id || '')}
                    colorPalette={'blue'}
                    mr={2}
                >
                    Show More
                </Button>
                {domainId &&
                domainName &&
                (userDomains?.includes(domainId) || isAdmin) ? (
                    <Button
                        variant='outline'
                        colorPalette={'red'}
                        border='1px solid'
                        onClick={e => onClickModal(e, 'Company Domain', true)}
                    >
                        <Image
                            src='/unlink-svgrepo-com.png'
                            alt='Icon'
                            width={20}
                            height={20}
                        />
                        Unlink Company Domain
                    </Button>
                ) : (
                    (!domainId || domainName === '') &&
                    ((userDomains?.length || 0) > 0 || isAdmin) && (
                        <Button
                            variant='outline'
                            color='#2b6cb0'
                            border='1px solid #2b6cb0'
                            fontWeight='600'
                            onClick={e =>
                                onClickModal(e, 'Company Domain', false)
                            }
                        >
                            <IconLink />
                            Link Company Domain
                        </Button>
                    )
                )}
                <Button
                    variant='outline'
                    color='#2b6cb0'
                    border='1px solid #2b6cb0'
                    fontWeight='600'
                    fontSize='1rem'
                    onClick={() => {
                        setOpenModal(false)
                    }}
                    ml={2}
                >
                    Close
                </Button>
            </Box>
            {modalDetails.isLinked ? (
                <ApplicationMapping
                    modalDetails={modalDetails}
                    applicationData={
                        applicationData as Application & {
                            id: string
                            name: string
                            application_name: string
                        }
                    }
                    isLinked={modalDetails.isLinked}
                    isOpen={isOpen}
                    onClose={onClose}
                    domainName={{ id: domainId || '' }}
                />
            ) : (
                <DomainProvider>
                    <LinkApplication
                        data={applicationData}
                        modalDetails={modalDetails}
                        isOpen={isOpen}
                        onClose={onClose}
                    />
                </DomainProvider>
            )}
        </>
    )
}
