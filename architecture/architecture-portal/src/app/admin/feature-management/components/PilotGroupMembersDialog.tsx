'use client'
import { useState } from 'react'
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Heading,
    IconButton,
    Separator,
    TagsInput,
    Text,
    VStack
} from '@chakra-ui/react'
import { IconTrash } from '@americanexpress/dls-icons'
import { toast } from 'react-toastify'
import { AvatarTableRow } from '@/components/ui'
import { useAddPilotGroupMembers, useRemovePilotGroupMembers } from '@/hooks'
import { FEATURE_MANAGEMENT_TEST_IDS } from '../test-ids'

type PilotGroupMembersDialogProps = {
    isOpen: boolean
    onClose: () => void
    groupId: string
    groupName: string
    members: string[]
}

export const PilotGroupMembersDialog = ({
    isOpen,
    onClose,
    groupId,
    groupName,
    members
}: PilotGroupMembersDialogProps) => {
    const addMembers = useAddPilotGroupMembers()
    const removeMembers = useRemovePilotGroupMembers()
    const [newEmails, setNewEmails] = useState<string[]>([])

    const handleRemove = (email: string) => {
        removeMembers.mutate(
            { groupId, memberEmails: [email] },
            {
                onSuccess: () =>
                    toast.success(`Removed ${email} from ${groupName}`),
                onError: () => toast.error(`Failed to remove ${email}`)
            }
        )
    }

    const handleAdd = () => {
        addMembers.mutate(
            { groupId, memberEmails: newEmails },
            {
                onSuccess: () => {
                    toast.success(`Added members to ${groupName}`)
                    setNewEmails([])
                },
                onError: () => toast.error('Failed to add members')
            }
        )
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={() => onClose()}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content
                    maxW='600px'
                    width='92vw'
                    data-testid={FEATURE_MANAGEMENT_TEST_IDS.membersDialog}
                >
                    <Dialog.Header px={6}>
                        <Dialog.Title asChild>
                            <Heading size='lg' fontWeight='700'>
                                Manage Members: {groupName}
                            </Heading>
                        </Dialog.Title>
                    </Dialog.Header>
                    <Separator />
                    <Dialog.Body px={6} overflowY='auto' maxH='60vh'>
                        <Text fontWeight={700} mb={2}>
                            Add Members
                        </Text>
                        <TagsInput.Root
                            value={newEmails}
                            onValueChange={details =>
                                setNewEmails(details.value)
                            }
                            data-testid={
                                FEATURE_MANAGEMENT_TEST_IDS.memberTagsInput
                            }
                        >
                            <TagsInput.Control>
                                {newEmails.map((email, index) => (
                                    <TagsInput.Item
                                        key={index}
                                        index={index}
                                        value={email}
                                    >
                                        <TagsInput.ItemPreview>
                                            <TagsInput.ItemText>
                                                {email}
                                            </TagsInput.ItemText>
                                            <TagsInput.ItemDeleteTrigger />
                                        </TagsInput.ItemPreview>
                                    </TagsInput.Item>
                                ))}
                                <TagsInput.Input placeholder='Type an email and press Enter' />
                            </TagsInput.Control>
                        </TagsInput.Root>
                        <Separator my={6} />
                        <Text fontWeight={700} mb={3}>
                            Current Members
                        </Text>
                        <VStack align='stretch' gap={3}>
                            {members.length === 0 ? (
                                <Text color='fg.muted'>No members yet.</Text>
                            ) : (
                                members.map(email => (
                                    <Box
                                        key={email}
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='space-between'
                                        data-testid={FEATURE_MANAGEMENT_TEST_IDS.memberRow(
                                            email
                                        )}
                                    >
                                        <AvatarTableRow email={email} />
                                        <IconButton
                                            variant='ghost'
                                            borderRadius='50%'
                                            size='sm'
                                            aria-label={`Remove ${email}`}
                                            data-testid={FEATURE_MANAGEMENT_TEST_IDS.memberRemoveBtn(
                                                email
                                            )}
                                            onClick={() => handleRemove(email)}
                                        >
                                            <IconTrash color='critical' />
                                        </IconButton>
                                    </Box>
                                ))
                            )}
                        </VStack>
                    </Dialog.Body>
                    <Separator />
                    <Dialog.Footer
                        px={6}
                        py={4}
                        display='flex'
                        gap={2}
                        justifyContent='flex-end'
                    >
                        <Button
                            colorPalette='blue'
                            onClick={handleAdd}
                            disabled={newEmails.length === 0}
                            data-testid={
                                FEATURE_MANAGEMENT_TEST_IDS.memberAddBtn
                            }
                        >
                            Add
                        </Button>
                        <Button variant='outline' onClick={onClose}>
                            Close
                        </Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size='sm' />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
