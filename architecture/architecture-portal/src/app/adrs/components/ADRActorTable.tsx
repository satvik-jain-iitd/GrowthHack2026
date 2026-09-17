import { ADR } from '@/app/docs/hooks/useGetADR'
import {
    Box,
    SegmentGroup,
    Text,
    Table as ChakraTable,
    Icon,
    Popover,
    Box as ChakraBox
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { AvatarTableRow } from '@/components/ui'
import { IconFeedback } from '@americanexpress/dls-icons'

// FeedbackPopover component, modeled after BvBWorkflowActorTable
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
                    <ChakraBox p={4} maxW='300px'>
                        {feedback}
                    </ChakraBox>
                </Popover.Content>
            </Popover.Positioner>
        </Popover.Root>
    )
}

export type ADRActorTableProps = {
    adr: ADR
}

export default function ADRActorTable({ adr }: ADRActorTableProps) {
    const [actorType, setActorType] = useState<'REVIEWERS' | 'DECIDERS'>(
        'REVIEWERS'
    )

    // Select actors based on type
    const selectedActors: string[] =
        actorType === 'REVIEWERS' ? adr.rev_ctc_da : adr.aprv_ctc_da

    // Helper to get review/approval for an actor
    const getReviewForActor = (email: string) => {
        if (!Array.isArray(adr.reviews)) return undefined
        const type = actorType === 'REVIEWERS' ? 'REVIEW' : 'APPROVAL'
        return adr.reviews.find(
            r =>
                r.rev_email_ad_tx.toLowerCase() === email.toLowerCase() &&
                r.rev_type_nm === type
        )
    }

    return (
        <Box mt={4} px={2}>
            <Text
                height={4}
                fontSize='16px'
                fontStyle='normal'
                fontWeight={700}
                lineHeight={'normal'}
            >
                {adr.adr_nm
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}{' '}
                {actorType === 'REVIEWERS' ? 'Reviewers' : 'Deciders'}
            </Text>
            <Box my={4}>
                <SegmentGroup.Root
                    value={actorType}
                    onValueChange={e =>
                        setActorType(e.value as 'REVIEWERS' | 'DECIDERS')
                    }
                >
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Items
                        _checked={{ bg: 'bg.info' }}
                        items={['REVIEWERS', 'DECIDERS']}
                    />
                </SegmentGroup.Root>
            </Box>
            <Box width='100%'>
                <ChakraTable.Root variant={'outline'}>
                    <ChakraTable.Header backgroundColor={'bg.info'}>
                        <ChakraTable.Row>
                            <ChakraTable.ColumnHeader>
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
                                >
                                    No {actorType.toLowerCase()} found.
                                </ChakraTable.Cell>
                            </ChakraTable.Row>
                        ) : (
                            selectedActors.map(email => {
                                const review = getReviewForActor(email)
                                return (
                                    <ChakraTable.Row key={email} py={2}>
                                        <ChakraTable.Cell>
                                            <AvatarTableRow
                                                email={email}
                                                iconOnly={false}
                                            />
                                        </ChakraTable.Cell>
                                        <ChakraTable.Cell>
                                            {review?.rev_sta_nm}
                                        </ChakraTable.Cell>
                                        <ChakraTable.Cell>
                                            <FeedbackPopover
                                                feedback={
                                                    review?.rev_fdbk_tx || ''
                                                }
                                            />
                                        </ChakraTable.Cell>
                                    </ChakraTable.Row>
                                )
                            })
                        )}
                    </ChakraTable.Body>
                </ChakraTable.Root>
            </Box>
        </Box>
    )
}
