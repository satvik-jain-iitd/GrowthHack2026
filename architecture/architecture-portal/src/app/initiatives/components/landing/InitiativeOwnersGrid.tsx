'use client'
import React from 'react'
import { Grid, Heading } from '@chakra-ui/react'
import DisplayUsers from '../DisplayUsers'
import { PTBInitiative } from '../../types'

interface InitiativeOwnersGridProps {
    initiativeData: PTBInitiative
}

export default function InitiativeOwnersGrid({
    initiativeData
}: InitiativeOwnersGridProps) {
    // Only use metamodel-supplied names when every owner in the group has one,
    // so the remaining rows keep their directory-lookup fallback in DisplayUsers.
    const joinedName = (names?: string[]): string | undefined =>
        names && names.length > 0 && names.every(Boolean)
            ? names.join(',')
            : undefined

    const owners = [
        {
            heading: 'Unit CIO',
            email: initiativeData.unitCIO || '',
            name: joinedName(initiativeData.ownerNames?.unitCIO)
        },
        {
            heading: 'Head Engineer',
            email: initiativeData.headEngineers?.join(',') || '',
            name: joinedName(initiativeData.ownerNames?.headEngineers)
        },
        {
            heading: 'Principal Architect',
            email: initiativeData.principalArchitects?.join(',') || '',
            name: joinedName(initiativeData.ownerNames?.principalArchitects)
        },
        {
            heading: 'Tech Owner',
            email: initiativeData.techOwners?.join(',') || '',
            name: joinedName(initiativeData.ownerNames?.techOwners)
        },
        {
            heading: 'UCIO Delegate',
            email: initiativeData.ucioDelegates?.join(',') || '',
            name: undefined
        },
        {
            heading: 'Enterprise Architect',
            email: initiativeData.enterpriseArchitects?.join(',') || '',
            name: joinedName(initiativeData.ownerNames?.enterpriseArchitects)
        },
        {
            heading: 'Status Report Owner(Primary)',
            email: initiativeData.statusReportOwnerPrimary?.join(',') || '',
            name: undefined
        },
        {
            heading: 'Status Report Owner(Secondary)',
            email: initiativeData.statusReportOwnerSecondary?.join(',') || '',
            name: undefined
        },
        {
            heading: 'Additional Delegates',
            email: initiativeData.additionalArchitects?.join(',') || '',
            name: joinedName(initiativeData.ownerNames?.additionalArchitects)
        }
    ]

    return (
        <>
            <Heading size='lg' marginBottom={3} mt={4}>
                Owners
            </Heading>
            <Grid
                templateColumns={{ base: 'repeat(3, 1fr)' }}
                gap={4}
                borderBottom='1px solid #ECEDEE'
                pb={8}
                mt={4}
            >
                {owners.map(owner => (
                    <DisplayUsers
                        key={owner.heading}
                        heading={owner.heading}
                        email={owner.email}
                        name={owner.name}
                    />
                ))}
            </Grid>
        </>
    )
}
