/* istanbul ignore file */
'use client'
import { useState } from 'react'
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Portal,
    Table,
    Tabs,
    Text
} from '@chakra-ui/react'
import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
import type {
    CapabilityFrequency,
    JourneyFrequency
} from '@/app/resources/tech-investment-planning-dashboard/types'

export function TopItemsDialog() {
    const [open, setOpen] = useState(false)
    const { filteredMetrics: metrics } = useDashboard()

    return (
        <>
            <Button size='sm' variant='outline' onClick={() => setOpen(true)}>
                Top Journeys &amp; Capabilities
            </Button>

            <Dialog.Root
                open={open}
                onOpenChange={e => {
                    if (!e.open) setOpen(false)
                }}
                size='xl'
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content
                            maxW={{
                                base: 'calc(100vw - 24px)',
                                sm: '3xl',
                                lg: '5xl'
                            }}
                            maxH='90vh'
                            display='flex'
                            flexDir='column'
                        >
                            <Dialog.Header
                                borderBottomWidth='1px'
                                borderColor='border.subtle'
                            >
                                <Dialog.Title
                                    fontSize='lg'
                                    fontWeight='semibold'
                                    color='text.emphasis'
                                >
                                    Top Journeys &amp; Capabilities
                                </Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size='sm' />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>

                            <Dialog.Body overflowY='auto' p={0}>
                                <Tabs.Root defaultValue='recommended'>
                                    <Tabs.List px={6} pt={3}>
                                        <Tabs.Trigger value='recommended'>
                                            Recommended
                                        </Tabs.Trigger>
                                        <Tabs.Trigger value='saved'>
                                            Saved
                                        </Tabs.Trigger>
                                    </Tabs.List>

                                    <Tabs.Content
                                        value='recommended'
                                        px={{ base: 3, md: 6 }}
                                        pb={6}
                                    >
                                        <JourneyTable
                                            title='Top 10 Journeys by Recommendation Count'
                                            countHeader='Epics Recommended In'
                                            journeys={metrics.topRecJourneys}
                                        />
                                        <Box mt={8}>
                                            <CapabilityTable
                                                title='Top 10 Capabilities by Recommendation Count'
                                                countHeader='Epics Recommended In'
                                                capabilities={
                                                    metrics.topRecCapabilities
                                                }
                                            />
                                        </Box>
                                    </Tabs.Content>

                                    <Tabs.Content
                                        value='saved'
                                        px={{ base: 3, md: 6 }}
                                        pb={6}
                                    >
                                        <JourneyTable
                                            title='Top 10 Journeys by Saved Count'
                                            countHeader='Epics Saved In'
                                            journeys={metrics.topSavedJourneys}
                                        />
                                        <Box mt={8}>
                                            <CapabilityTable
                                                title='Top 10 Capabilities by Saved Count'
                                                countHeader='Epics Saved In'
                                                capabilities={
                                                    metrics.topSavedCapabilities
                                                }
                                            />
                                        </Box>
                                    </Tabs.Content>
                                </Tabs.Root>
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    )
}

function JourneyTable({
    title,
    countHeader,
    journeys
}: {
    title: string
    countHeader: string
    journeys: JourneyFrequency[]
}) {
    return (
        <Box>
            <Text
                fontWeight='semibold'
                fontSize='sm'
                color='text.emphasis'
                mb={3}
            >
                {title}
            </Text>
            {journeys.length === 0 ? (
                <Text fontSize='sm' color='text.subtle'>
                    No data
                </Text>
            ) : (
                <Box overflowX='auto'>
                    <Table.Root size='sm' variant='outline'>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader w='10'>
                                    Rank
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    Journey Statement
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign='right' w='44'>
                                    {countHeader}
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {journeys.map((j, i) => (
                                <Table.Row key={j.journeyId}>
                                    <Table.Cell color='text.subtle'>
                                        {i + 1}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {j.journeyStatement || j.journeyId}
                                    </Table.Cell>
                                    <Table.Cell
                                        textAlign='right'
                                        fontVariantNumeric='tabular-nums'
                                    >
                                        {j.epicCount.toLocaleString()}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}
        </Box>
    )
}

function CapabilityTable({
    title,
    countHeader,
    capabilities
}: {
    title: string
    countHeader: string
    capabilities: CapabilityFrequency[]
}) {
    return (
        <Box>
            <Text
                fontWeight='semibold'
                fontSize='sm'
                color='text.emphasis'
                mb={3}
            >
                {title}
            </Text>
            {capabilities.length === 0 ? (
                <Text fontSize='sm' color='text.subtle'>
                    No data
                </Text>
            ) : (
                <Box overflowX='auto'>
                    <Table.Root size='sm' variant='outline'>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader w='10'>
                                    Rank
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    Capability Name
                                </Table.ColumnHeader>
                                <Table.ColumnHeader w='16'>
                                    Level
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign='right' w='44'>
                                    {countHeader}
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {capabilities.map((c, i) => (
                                <Table.Row key={c.capabilityId}>
                                    <Table.Cell color='text.subtle'>
                                        {i + 1}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {c.capabilityName || c.capabilityId}
                                    </Table.Cell>
                                    <Table.Cell color='text.subtle'>
                                        {c.capabilityLevel}
                                    </Table.Cell>
                                    <Table.Cell
                                        textAlign='right'
                                        fontVariantNumeric='tabular-nums'
                                    >
                                        {c.epicCount.toLocaleString()}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}
        </Box>
    )
}
