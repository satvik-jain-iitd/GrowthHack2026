'use client'
import React from 'react'
import { Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import { PTBInitiative } from '../../types'

interface InitiativeSummaryGridProps {
    initiativeData: PTBInitiative
}

export default function InitiativeSummaryGrid({
    initiativeData
}: InitiativeSummaryGridProps) {
    const items = [
        {
            label: 'ETP',
            value: initiativeData.clarityId || '-'
        },
        {
            label: 'Start Date',
            value: initiativeData.startDate
                ? new Date(initiativeData.startDate).toLocaleDateString()
                : '-'
        },
        {
            label: 'End Date',
            value: initiativeData.tentativeEndDate
                ? new Date(initiativeData.tentativeEndDate).toLocaleDateString()
                : '-'
        },
        {
            label: 'Years',
            value: initiativeData.years?.join(', ') || '-'
        }
    ]

    return (
        <Grid
            templateColumns={{ base: 'repeat(4, 1fr)' }}
            mt={4}
            gap={4}
            borderBottom='1px solid #ECEDEE'
        >
            {items.map((item, index) => (
                <GridItem
                    key={item.label}
                    borderRight={
                        index < items.length - 1
                            ? '1px solid #ECEDEE'
                            : undefined
                    }
                    paddingBottom={4}
                    paddingTop={4}
                >
                    <Flex flexDirection='column'>
                        <Text display='block' fontWeight='600' fontSize='14px'>
                            {item.label}
                        </Text>
                        <Text display='block'>{item.value}</Text>
                    </Flex>
                </GridItem>
            ))}
        </Grid>
    )
}
