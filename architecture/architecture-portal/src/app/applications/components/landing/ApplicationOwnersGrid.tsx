'use client'
import React from 'react'
import { Box, Flex, Grid } from '@chakra-ui/react'
import { UserAvatar } from '@/app/company-domains/components/UserAvatar'
import { Application } from '@/app/company-domains/types'

interface ApplicationOwnersGridProps {
    applicationData: Application
}

export default function ApplicationOwnersGrid({
    applicationData
}: ApplicationOwnersGridProps) {
    const { central_application_da } = applicationData
    const ownershipInfo = central_application_da?.ownershipInfo

    const owners = [
        {
            label: 'Owner',
            name: ownershipInfo?.applicationOwner?.fullName,
            email: ownershipInfo?.applicationOwner?.email
        },
        {
            label: 'Business Owner',
            name: ownershipInfo?.businessOwner?.fullName,
            email: ownershipInfo?.businessOwner?.email
        },
        {
            label: 'Business VP',
            name: ownershipInfo?.businessOwnerLeader1?.fullName,
            email: ownershipInfo?.businessOwnerLeader1?.email
        },
        {
            label: 'Production Support Owner',
            name: ownershipInfo?.productionSupportOwner?.fullName,
            email: ownershipInfo?.productionSupportOwner?.email
        },
        {
            label: 'Production Support VP',
            name: ownershipInfo?.productionSupportOwnerLeader1?.fullName,
            email: ownershipInfo?.productionSupportOwnerLeader1?.email
        },
        {
            label: 'PMO',
            name: ownershipInfo?.pmo?.fullName,
            email: ownershipInfo?.pmo?.email
        },
        {
            label: 'VP 1',
            name: ownershipInfo?.applicationOwnerLeader1?.fullName,
            email: ownershipInfo?.applicationOwnerLeader1?.email
        },
        {
            label: 'VP 2',
            name: ownershipInfo?.applicationOwnerLeader2?.fullName,
            email: ownershipInfo?.applicationOwnerLeader2?.email
        },
        {
            label: 'SVP',
            name: ownershipInfo?.ownerSVP?.fullName,
            email: ownershipInfo?.ownerSVP?.email
        },
        {
            label: 'Unit CIO',
            name: ownershipInfo?.unitCIO?.fullName,
            email: ownershipInfo?.unitCIO?.email
        }
    ]

    return (
        <div>
            <div>Owner / SMEs</div>
            <Grid templateColumns={{ base: 'repeat(2, 1fr)' }} mt={4} gap={4}>
                {owners.map((owner, index) => (
                    <Flex key={index}>
                        <Box pr={1}>
                            <UserAvatar
                                email={owner.email || ''}
                                name={owner.name}
                            />
                        </Box>
                        <Box>
                            <Flex direction='column'>
                                <Box fontWeight='700'>{owner.label}</Box>
                                <Box>{owner.name}</Box>
                            </Flex>
                        </Box>
                    </Flex>
                ))}
            </Grid>
        </div>
    )
}
