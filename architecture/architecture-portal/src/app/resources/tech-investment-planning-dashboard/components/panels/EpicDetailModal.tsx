/* istanbul ignore file */
'use client'
import { memo, useEffect, useMemo, useState } from 'react'
import {
    Badge,
    Box,
    CloseButton,
    Dialog,
    Flex,
    Portal,
    SimpleGrid,
    Table,
    Tabs,
    Text
} from '@chakra-ui/react'
import { ActorChip } from '@/app/resources/tech-investment-planning-dashboard/components/shared/ActorChip'
import { formatDuration } from '@/app/resources/tech-investment-planning-dashboard/utils/formatDuration'
import type {
    AuditEvent,
    CapabilityItem,
    EpicDetailData,
    JourneyItem,
    StrategicEpic
} from '@/app/resources/tech-investment-planning-dashboard/types'

interface Props {
    open: boolean
    detail: EpicDetailData | null
    strategicEpic?: StrategicEpic | null
    onClose: () => void
}

type TabValue = 'info' | 'submissions' | 'recommendations' | 'activity'

const actionBadgeColor: Record<string, string> = {
    'ADD ASSOCIATED CAPABILITY': 'teal',
    'ADD ASSOCIATED JOURNEY': 'teal',
    'DELETE ASSOCIATED JOURNEY': 'red',
    'REMOVE ASSOCIATED CAPABILITY': 'red',
    'APPTIO DATA UPDATE SUCCESSFUL': 'green',
    'CAPABILITY RECOMMENDATIONS GENERATED': 'gray',
    'JOURNEY RECOMMENDATIONS GENERATED': 'gray'
}

const actionLabel: Record<string, string> = {
    'ADD ASSOCIATED CAPABILITY': 'Add Capability',
    'ADD ASSOCIATED JOURNEY': 'Add Journey',
    'DELETE ASSOCIATED JOURNEY': 'Remove Journey',
    'REMOVE ASSOCIATED CAPABILITY': 'Remove Capability',
    'APPTIO DATA UPDATE SUCCESSFUL': 'Saved',
    'CAPABILITY RECOMMENDATIONS GENERATED': 'Cap. Recommendations',
    'JOURNEY RECOMMENDATIONS GENERATED': 'Journey Recommendations'
}

export function EpicDetailModal({
    open,
    detail,
    strategicEpic,
    onClose
}: Props) {
    const [activeTab, setActiveTab] = useState<TabValue>('info')

    useEffect(() => {
        if (open) setActiveTab('info')
    }, [open])

    // Keep last-seen detail while the close animation plays so content doesn't vanish mid-animation
    const stableDetail = detail ?? undefined

    const auditEvents = useMemo(
        () => stableDetail?.audit?.events ?? [],
        [stableDetail]
    )

    return (
        <Dialog.Root
            open={open}
            onOpenChange={e => {
                if (!e.open) onClose()
            }}
            size='xl'
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW='5xl'
                        maxH='90vh'
                        display='flex'
                        flexDir='column'
                    >
                        <Dialog.Header
                            borderBottomWidth='1px'
                            borderColor='border.subtle'
                        >
                            <Box>
                                <Dialog.Title
                                    fontSize='lg'
                                    fontWeight='semibold'
                                    color='text.emphasis'
                                >
                                    {stableDetail?.epicName ?? ''}
                                </Dialog.Title>
                                <Text
                                    fontSize='xs'
                                    fontFamily='mono'
                                    color='text.subtle'
                                    mt={0.5}
                                >
                                    Epic ID: {stableDetail?.epicId ?? ''}
                                </Text>
                            </Box>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size='sm' />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body overflowY='auto' p={0}>
                            {stableDetail && (
                                <Tabs.Root
                                    value={activeTab}
                                    onValueChange={e =>
                                        setActiveTab(e.value as TabValue)
                                    }
                                >
                                    <Tabs.List px={6} pt={3}>
                                        <Tabs.Trigger value='info'>
                                            Epic Info
                                        </Tabs.Trigger>
                                        <Tabs.Trigger value='submissions'>
                                            Submissions
                                            <Badge
                                                ml={2}
                                                size='sm'
                                                variant='subtle'
                                                colorPalette='gray'
                                                borderRadius='full'
                                            >
                                                {
                                                    stableDetail.savedJourneys
                                                        .length
                                                }
                                                {' ECJ · '}
                                                {
                                                    stableDetail
                                                        .savedCapabilities
                                                        .length
                                                }
                                                {' EBC'}
                                            </Badge>
                                        </Tabs.Trigger>
                                        <Tabs.Trigger value='recommendations'>
                                            Recommendations
                                            <Badge
                                                ml={2}
                                                size='sm'
                                                variant='subtle'
                                                colorPalette='gray'
                                                borderRadius='full'
                                            >
                                                {
                                                    stableDetail.recJourneys
                                                        .length
                                                }
                                                {' ECJ · '}
                                                {
                                                    stableDetail.recCapabilities
                                                        .length
                                                }
                                                {' EBC'}
                                            </Badge>
                                        </Tabs.Trigger>
                                        <Tabs.Trigger value='activity'>
                                            Activity
                                            <Badge
                                                ml={2}
                                                size='sm'
                                                variant='subtle'
                                                colorPalette='gray'
                                                borderRadius='full'
                                            >
                                                {auditEvents.length}
                                            </Badge>
                                        </Tabs.Trigger>
                                    </Tabs.List>
                                    <Box px={6} pb={6} pt={4}>
                                        <Tabs.Content value='info'>
                                            <EpicInfoTab epic={strategicEpic} />
                                        </Tabs.Content>
                                        <Tabs.Content value='submissions'>
                                            <SubmissionsTab
                                                journeys={
                                                    stableDetail.savedJourneys
                                                }
                                                capabilities={
                                                    stableDetail.savedCapabilities
                                                }
                                            />
                                        </Tabs.Content>
                                        <Tabs.Content value='recommendations'>
                                            <RecommendationsTab
                                                journeys={
                                                    stableDetail.recJourneys
                                                }
                                                capabilities={
                                                    stableDetail.recCapabilities
                                                }
                                            />
                                        </Tabs.Content>
                                        <Tabs.Content value='activity'>
                                            <ActivityTab
                                                events={auditEvents}
                                                timeSpentMs={
                                                    stableDetail.timeSpentMs
                                                }
                                                onTabChange={setActiveTab}
                                            />
                                        </Tabs.Content>
                                    </Box>
                                </Tabs.Root>
                            )}
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

function MetaField({ label, value }: { label: string; value?: string }) {
    if (!value) return null
    return (
        <Box>
            <Text fontSize='xs' color='text.subtle' mb={0.5}>
                {label}
            </Text>
            <Text fontSize='sm' color='text.emphasis'>
                {value}
            </Text>
        </Box>
    )
}

function EpicInfoTab({ epic }: { epic: StrategicEpic | null | undefined }) {
    if (!epic) return <EmptyState text='Epic metadata not available' />

    const createdDateStr = (() => {
        try {
            return new Date(epic.createdDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        } catch {
            return epic.createdDate
        }
    })()

    return (
        <Box display='flex' flexDirection='column' gap={5}>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                <Box>
                    <Text fontSize='xs' color='text.subtle' mb={0.5}>
                        Created By
                    </Text>
                    <ActorChip
                        email={epic.createdBy}
                        variant='chip'
                        size='sm'
                    />
                </Box>
                <MetaField
                    label='Planning Cycle(s)'
                    value={epic.planningCycle.join(', ')}
                />
                <MetaField label='Created Date' value={createdDateStr} />
                <MetaField label='Requesting LOB' value={epic.requestingLOB} />
                <MetaField label='Impacted LOB' value={epic.impactedLOB} />
                <MetaField label='Sponsoring LOB' value={epic.sponsoringLOB} />
                <MetaField
                    label='Investment Category'
                    value={epic.investmentCategory}
                />
                <MetaField label='Demand Group' value={epic.demandGroup} />
            </SimpleGrid>

            {epic.description && (
                <Box>
                    <Text
                        fontSize='xs'
                        color='text.subtle'
                        mb={2}
                        fontWeight='medium'
                    >
                        Description
                    </Text>
                    <Box
                        fontSize='sm'
                        color='text.emphasis'
                        dangerouslySetInnerHTML={{ __html: epic.description }}
                        css={{
                            '& p': { marginBottom: '0.5rem' },
                            '& ul, & ol': { paddingLeft: '1.25rem' },
                            '& li': { marginBottom: '0.25rem' },
                            '& strong': { fontWeight: '600' },
                            '& a': {
                                color: 'var(--chakra-colors-blue-500)',
                                textDecoration: 'underline'
                            }
                        }}
                    />
                </Box>
            )}
        </Box>
    )
}

function SubmissionsTab({
    journeys,
    capabilities
}: {
    journeys: JourneyItem[]
    capabilities: CapabilityItem[]
}) {
    return (
        <Box display='flex' flexDirection='column' gap={6}>
            <Text color='text.subtle' fontSize='xs'>
                What the user saved for this epic, with AI recommendation flags.
                ECJs (Enterprise Customer Journeys) and EBCs (Enterprise
                Business Capabilities).
            </Text>
            <Section
                title='ECJs (Enterprise Customer Journeys)'
                count={journeys.length}
            >
                {journeys.length === 0 ? (
                    <EmptyState text='No ECJs saved' />
                ) : (
                    <Table.Root size='sm'>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>
                                    ECJ Statement
                                </Table.ColumnHeader>
                                <Table.ColumnHeader w='36'>
                                    AI Recommended?
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {journeys.map(j => (
                                <Table.Row
                                    key={j.journeyId}
                                    _hover={{ bg: 'surface.foreground' }}
                                >
                                    <Table.Cell color='text.emphasis'>
                                        {j.journeyStatement || j.journeyId}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {j.recommended ? (
                                            <Badge
                                                colorPalette='green'
                                                variant='subtle'
                                                borderRadius='full'
                                                fontSize='xs'
                                            >
                                                ✓ AI Suggested
                                            </Badge>
                                        ) : (
                                            <Badge
                                                colorPalette='blue'
                                                variant='subtle'
                                                borderRadius='full'
                                                fontSize='xs'
                                            >
                                                + Added by user
                                            </Badge>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                )}
            </Section>

            <Section
                title='EBCs (Enterprise Business Capabilities)'
                count={capabilities.length}
            >
                {capabilities.length === 0 ? (
                    <EmptyState text='No EBCs saved' />
                ) : (
                    <Table.Root size='sm'>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>
                                    EBC Name
                                </Table.ColumnHeader>
                                <Table.ColumnHeader w='16'>
                                    Level
                                </Table.ColumnHeader>
                                <Table.ColumnHeader w='36'>
                                    AI Recommended?
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {capabilities.map(c => (
                                <Table.Row
                                    key={c.capabilityId}
                                    _hover={{ bg: 'surface.foreground' }}
                                >
                                    <Table.Cell color='text.emphasis'>
                                        {c.capabilityName || c.capabilityId}
                                    </Table.Cell>
                                    <Table.Cell color='text.subtle'>
                                        {c.capabilityLevel}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {c.recommended ? (
                                            <Badge
                                                colorPalette='green'
                                                variant='subtle'
                                                borderRadius='full'
                                                fontSize='xs'
                                            >
                                                ✓ AI Suggested
                                            </Badge>
                                        ) : (
                                            <Badge
                                                colorPalette='blue'
                                                variant='subtle'
                                                borderRadius='full'
                                                fontSize='xs'
                                            >
                                                + Added by user
                                            </Badge>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                )}
            </Section>
        </Box>
    )
}

function RecommendationsTab({
    journeys,
    capabilities
}: {
    journeys: JourneyItem[]
    capabilities: CapabilityItem[]
}) {
    return (
        <Box display='flex' flexDirection='column' gap={6}>
            <Text color='text.subtle' fontSize='xs'>
                What AI suggested for this epic, with flags showing whether the
                user kept each ECJ (Enterprise Customer Journey) or EBC
                (Enterprise Business Capability).
            </Text>
            <Section
                title='ECJs (Enterprise Customer Journeys)'
                count={journeys.length}
            >
                {journeys.length === 0 ? (
                    <EmptyState text='No AI ECJ recommendations for this epic' />
                ) : (
                    <Table.Root size='sm'>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>
                                    ECJ Statement
                                </Table.ColumnHeader>
                                <Table.ColumnHeader w='36'>
                                    Saved by User?
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {journeys.map(j => (
                                <Table.Row
                                    key={j.journeyId}
                                    _hover={{ bg: 'surface.foreground' }}
                                >
                                    <Table.Cell color='text.emphasis'>
                                        {j.journeyStatement || j.journeyId}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {j.saved ? (
                                            <Badge
                                                colorPalette='green'
                                                variant='subtle'
                                                borderRadius='full'
                                                fontSize='xs'
                                            >
                                                ✓ Kept
                                            </Badge>
                                        ) : (
                                            <Badge
                                                colorPalette='red'
                                                variant='subtle'
                                                borderRadius='full'
                                                fontSize='xs'
                                            >
                                                ✗ Removed
                                            </Badge>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                )}
            </Section>

            <Section
                title='EBCs (Enterprise Business Capabilities)'
                count={capabilities.length}
            >
                {capabilities.length === 0 ? (
                    <EmptyState text='No AI EBC recommendations for this epic' />
                ) : (
                    <Table.Root size='sm'>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>
                                    EBC Name
                                </Table.ColumnHeader>
                                <Table.ColumnHeader w='16'>
                                    Level
                                </Table.ColumnHeader>
                                <Table.ColumnHeader w='36'>
                                    Saved by User?
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {capabilities.map(c => (
                                <Table.Row
                                    key={c.capabilityId}
                                    _hover={{ bg: 'surface.foreground' }}
                                >
                                    <Table.Cell color='text.emphasis'>
                                        {c.capabilityName || c.capabilityId}
                                    </Table.Cell>
                                    <Table.Cell color='text.subtle'>
                                        {c.capabilityLevel}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {c.saved ? (
                                            <Badge
                                                colorPalette='green'
                                                variant='subtle'
                                                borderRadius='full'
                                                fontSize='xs'
                                            >
                                                ✓ Kept
                                            </Badge>
                                        ) : (
                                            <Badge
                                                colorPalette='red'
                                                variant='subtle'
                                                borderRadius='full'
                                                fontSize='xs'
                                            >
                                                ✗ Removed
                                            </Badge>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                )}
            </Section>
        </Box>
    )
}

function ActivityTab({
    events,
    timeSpentMs,
    onTabChange
}: {
    events: AuditEvent[]
    timeSpentMs: number | null
    onTabChange: (tab: TabValue) => void
}) {
    if (events.length === 0) {
        return <EmptyState text='No audit activity recorded for this epic' />
    }

    return (
        <Box display='flex' flexDirection='column' gap={2}>
            {timeSpentMs !== null && (
                <Flex
                    align='center'
                    gap={3}
                    bg={{ base: 'blue.50', _dark: 'blue.900/30' }}
                    border='1px solid'
                    borderColor={{ base: 'blue.200', _dark: 'blue.800' }}
                    borderRadius='lg'
                    px={4}
                    py={3}
                    mb={2}
                >
                    <Text fontSize='xl'>⏱</Text>
                    <Box>
                        <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color={{ base: 'blue.700', _dark: 'blue.300' }}
                        >
                            {formatDuration(timeSpentMs)}
                        </Text>
                        <Text fontSize='xs' color='text.subtle'>
                            From first action to last submission
                        </Text>
                    </Box>
                </Flex>
            )}
            <Text color='text.subtle' fontSize='xs' mb={2}>
                Chronological audit log for this epic.
            </Text>
            {events.map((evt, i) => (
                <ActivityEventRow
                    key={i}
                    event={evt}
                    onTabChange={onTabChange}
                />
            ))}
        </Box>
    )
}

const ActivityEventRow = memo(function ActivityEventRow({
    event,
    onTabChange
}: {
    event: AuditEvent
    onTabChange: (tab: TabValue) => void
}) {
    const badgeColor = actionBadgeColor[event.actionSummary] ?? 'gray'
    const label = actionLabel[event.actionSummary] ?? event.actionSummary
    const itemCount = event.itemIds.length

    const isAddCapability = event.actionSummary === 'ADD ASSOCIATED CAPABILITY'
    const isAddJourney = event.actionSummary === 'ADD ASSOCIATED JOURNEY'
    const isCapRec =
        event.actionSummary === 'CAPABILITY RECOMMENDATIONS GENERATED'
    const isJourneyRec =
        event.actionSummary === 'JOURNEY RECOMMENDATIONS GENERATED'
    const isClickable =
        isAddCapability || isAddJourney || isCapRec || isJourneyRec

    const handleBadgeClick = () => {
        if (isAddCapability || isAddJourney) onTabChange('submissions')
        else if (isCapRec || isJourneyRec) onTabChange('recommendations')
    }

    const itemDescription = (() => {
        if (itemCount === 0) return null
        if (isAddCapability || isAddJourney) {
            const aiRec = event.isAiRecommended.filter(v => v === true).length
            const userAdded = event.isAiRecommended.filter(
                v => v === false || v === null
            ).length
            if (aiRec > 0 && userAdded > 0) {
                return `${itemCount} items: ${aiRec} AI recommended · ${userAdded} user added`
            } else if (aiRec === itemCount) {
                return `${itemCount} ${itemCount === 1 ? 'item' : 'items'} (all AI recommended)`
            } else {
                return `${itemCount} ${itemCount === 1 ? 'item' : 'items'} (all user added)`
            }
        }
        return `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
    })()

    const formattedTime = (() => {
        try {
            return new Date(event.time).toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        } catch {
            return event.time
        }
    })()

    return (
        <Flex
            align='flex-start'
            gap={3}
            py={3}
            borderBottomWidth='1px'
            borderColor='border.subtle'
            _last={{ borderBottom: 'none' }}
        >
            <Box
                flexShrink={0}
                w='40'
                display='flex'
                flexDirection='column'
                alignItems='flex-end'
            >
                <Text fontSize='xs' color='text.subtle'>
                    {formattedTime}
                </Text>
            </Box>
            <Box flex={1} minW={0}>
                <Flex wrap='wrap' align='center' gap={2} mb={1}>
                    <Badge
                        colorPalette={badgeColor}
                        variant='subtle'
                        borderRadius='full'
                        fontSize='xs'
                        cursor={isClickable ? 'pointer' : undefined}
                        _hover={isClickable ? { opacity: 0.8 } : undefined}
                        onClick={isClickable ? handleBadgeClick : undefined}
                    >
                        {label}
                    </Badge>
                    {itemDescription && (
                        <Text fontSize='xs' color='text.subtle'>
                            {itemDescription}
                        </Text>
                    )}
                </Flex>
                <ActorChip email={event.actor} variant='activity' size='xs' />
            </Box>
        </Flex>
    )
})

function Section({
    title,
    count,
    children
}: {
    title: string
    count: number
    children: React.ReactNode
}) {
    return (
        <Box>
            <Flex align='center' gap={2} mb={3}>
                <Text fontWeight='medium' fontSize='sm' color='text.emphasis'>
                    {title}
                </Text>
                <Badge
                    variant='subtle'
                    colorPalette='gray'
                    borderRadius='full'
                    fontSize='xs'
                >
                    {count}
                </Badge>
            </Flex>
            <Box
                borderRadius='lg'
                borderWidth='1px'
                borderColor='border.subtle'
                overflow='hidden'
            >
                <Box overflowX='auto'>{children}</Box>
            </Box>
        </Box>
    )
}

function EmptyState({ text }: { text: string }) {
    return (
        <Text color='text.disabled' fontSize='sm' px={3} py={4}>
            {text}
        </Text>
    )
}
