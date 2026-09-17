import React, { useState } from 'react'
import { Playbook } from '@/types/Playbook'
import {
    Box,
    Icon,
    Popover,
    SegmentGroup,
    Table as ChakraTable,
    Text
} from '@chakra-ui/react'
import { AvatarTableRow } from '@/components/ui'
import { IconFeedback } from '@americanexpress/dls-icons'

import { Review } from '@/types/Review'

type BvBWorkflowActorTableProps = {
    playbook: Playbook
}

const FeedbackPopover = ({ feedback }: { feedback: string }) => {
    if (!feedback || feedback.trim() === '') {
        return null
    }
    return (
        <Popover.Root positioning={{ placement: 'bottom-end' }}>
            <Popover.Trigger>
                <Icon as={IconFeedback} fontSize={24} cursor='pointer' />
            </Popover.Trigger>
            <Popover.Positioner>
                <Popover.Content>
                    <Box p={4} maxW='300px'>
                        {feedback}
                    </Box>
                </Popover.Content>
            </Popover.Positioner>
        </Popover.Root>
    )
}

export default function BvBWorkflowActorTable({
    playbook
}: BvBWorkflowActorTableProps) {
    const [actorType, setActorType] = useState<'REVIEWERS' | 'DECIDERS'>(
        'REVIEWERS'
    )
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const workflowData = (playbook.add_da as any).workflowData || {}
    const actors = workflowData.actors || {}
    const reviews = workflowData.reviews || []
    const approvals = workflowData.approvals || []
    const selectedActors: string[] = actors[actorType.toLowerCase()] || []

    // Helper to get review info for an actor
    const getReviewForActor = (email: string) => {
        if (!Array.isArray(reviews)) return {}

        const reviewSet = actorType === 'REVIEWERS' ? reviews : approvals || []
        return (
            reviewSet.find(
                (r: Review) => r.reviewer.toLowerCase() === email.toLowerCase()
            ) || {}
        )
    }

    return (
        <Box mt={4} px={2}>
            <Text
                data-testid='actor-table-heading'
                height={10}
                fontSize='16px'
                fontStyle='normal'
                fontWeight={700}
                lineHeight={'normal'}
            >
                {playbook.playbook_nm} Assessment Reviewers
            </Text>
            <Text
                data-testid='actor-table-description'
                fontSize='16px'
                fontStyle='normal'
                fontWeight={400}
                lineHeight={'normal'}
            >
                These are the current selected reviewers for{' '}
                {playbook.playbook_nm}. If you would like to remove or edit a
                selected reviewer you can do so below.
            </Text>
            <Box my={4}>
                <SegmentGroup.Root
                    value={actorType}
                    onValueChange={e =>
                        setActorType(e.value as 'REVIEWERS' | 'DECIDERS')
                    }
                >
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Item
                        value='REVIEWERS'
                        data-testid='reviewers-segment'
                        _checked={{ bg: 'bg.info' }}
                    >
                        <SegmentGroup.ItemText>REVIEWERS</SegmentGroup.ItemText>
                        <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                    <SegmentGroup.Item
                        value='DECIDERS'
                        data-testid='deciders-segment'
                        _checked={{ bg: 'bg.info' }}
                    >
                        <SegmentGroup.ItemText>DECIDERS</SegmentGroup.ItemText>
                        <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                </SegmentGroup.Root>
            </Box>
            <Box width='100%'>
                <ChakraTable.Root variant={'outline'}>
                    <ChakraTable.Header backgroundColor={'bg.info'}>
                        <ChakraTable.Row>
                            <ChakraTable.ColumnHeader data-testid='actor-table-column-header'>
                                {actorType === 'REVIEWERS'
                                    ? 'Reviewers'
                                    : 'Deciders'}
                            </ChakraTable.ColumnHeader>
                            <ChakraTable.ColumnHeader>
                                Review Status
                            </ChakraTable.ColumnHeader>
                            <ChakraTable.ColumnHeader>
                                Feedback
                            </ChakraTable.ColumnHeader>
                        </ChakraTable.Row>
                    </ChakraTable.Header>
                    <ChakraTable.Body>
                        {selectedActors.length === 0 ? (
                            <ChakraTable.Row>
                                <ChakraTable.Cell
                                    colSpan={3}
                                    textAlign='center'
                                    data-testid='actor-table-empty-state'
                                >
                                    No {actorType} found.
                                </ChakraTable.Cell>
                            </ChakraTable.Row>
                        ) : (
                            selectedActors.map(email => {
                                const review = getReviewForActor(email)
                                return (
                                    <ChakraTable.Row
                                        bg={'bg.muted'}
                                        key={email}
                                        py={2}
                                    >
                                        <ChakraTable.Cell>
                                            <AvatarTableRow
                                                email={email}
                                                iconOnly={false}
                                            />
                                        </ChakraTable.Cell>
                                        <ChakraTable.Cell
                                            data-testid={`actor-status-${email}`}
                                        >
                                            {review.approvedOrRejected || ''}
                                        </ChakraTable.Cell>
                                        <ChakraTable.Cell>
                                            <FeedbackPopover
                                                feedback={review.reviewFeedback}
                                            />
                                        </ChakraTable.Cell>
                                    </ChakraTable.Row>
                                )
                            })
                        )}
                    </ChakraTable.Body>
                </ChakraTable.Root>
            </Box>
            <Box width={'100%'}></Box>
        </Box>
    )
}
