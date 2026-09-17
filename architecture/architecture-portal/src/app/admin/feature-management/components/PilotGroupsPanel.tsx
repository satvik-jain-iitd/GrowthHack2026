'use client'
import { useState } from 'react'
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    IconButton,
    Input,
    Separator,
    Spinner,
    Table,
    Text
} from '@chakra-ui/react'
import {
    IconAccount,
    IconPlus,
    IconTime,
    IconTrash
} from '@americanexpress/dls-icons'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { AvatarTableRow } from '@/components/ui'
import {
    useCreatePilotGroup,
    useDeletePilotGroup,
    usePilotGroupAuditLogs,
    usePilotGroups
} from '@/hooks'
import { AuditLogDialog } from './AuditLogDialog'
import { PilotGroupMembersDialog } from './PilotGroupMembersDialog'
import { FEATURE_MANAGEMENT_TEST_IDS } from '../test-ids'

const cellCommon = { px: 4, py: 2 }
const columnHeaderCommon = {
    bg: { base: '#ecedee', _dark: '#1c1c1c' },
    color: { base: '#333', _dark: '#f0f0f0' },
    textTransform: 'uppercase',
    fontWeight: 700,
    fontSize: '0.75rem',
    px: 4,
    py: 2,
    textAlign: 'left'
} as const

export const PilotGroupsPanel = () => {
    const { data: groups = [], isLoading } = usePilotGroups()
    const createPilotGroup = useCreatePilotGroup()
    const deletePilotGroup = useDeletePilotGroup()

    const [membersGroupId, setMembersGroupId] = useState<string | null>(null)
    const [historyGroupId, setHistoryGroupId] = useState<string | null>(null)
    const { data: auditLogs = [], isLoading: isAuditLoading } =
        usePilotGroupAuditLogs(historyGroupId ?? '')

    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newGroupName, setNewGroupName] = useState('')

    const handleDelete = (groupId: string, groupName: string) => {
        deletePilotGroup.mutate(
            { groupId },
            {
                onSuccess: () =>
                    toast.success(`Pilot group "${groupName}" deleted`),
                onError: () =>
                    toast.error(`Failed to delete pilot group "${groupName}"`)
            }
        )
    }

    const handleAddGroup = () => {
        const groupName = newGroupName.trim()
        createPilotGroup.mutate(
            { groupName },
            {
                onSuccess: () => {
                    toast.success(`Pilot group "${groupName}" created`)
                    setNewGroupName('')
                    setIsAddOpen(false)
                },
                onError: () => toast.error('Failed to create pilot group')
            }
        )
    }

    const historyGroup = groups.find(group => group.group_id === historyGroupId)
    const membersGroup = groups.find(group => group.group_id === membersGroupId)

    const sortedPilotGroups = new Array(...groups).sort((a, b) =>
        a.group_nm.localeCompare(b.group_nm)
    )

    if (isLoading) {
        return (
            <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                py={8}
            >
                <Spinner
                    data-testid={FEATURE_MANAGEMENT_TEST_IDS.groupsLoading}
                />
            </Box>
        )
    }

    return (
        <Box>
            {sortedPilotGroups.length > 0 ? (
                <Table.Root
                    variant='outline'
                    data-testid={FEATURE_MANAGEMENT_TEST_IDS.groupsTable}
                >
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader {...columnHeaderCommon}>
                                Group Name
                            </Table.ColumnHeader>
                            <Table.ColumnHeader {...columnHeaderCommon}>
                                Group ID
                            </Table.ColumnHeader>
                            <Table.ColumnHeader {...columnHeaderCommon}>
                                Members
                            </Table.ColumnHeader>
                            <Table.ColumnHeader {...columnHeaderCommon}>
                                Last Edited By
                            </Table.ColumnHeader>
                            <Table.ColumnHeader {...columnHeaderCommon}>
                                Last Edited On
                            </Table.ColumnHeader>
                            <Table.ColumnHeader {...columnHeaderCommon}>
                                Actions
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {sortedPilotGroups.map(group => (
                            <Table.Row key={group.group_id}>
                                <Table.Cell
                                    {...cellCommon}
                                    data-testid={FEATURE_MANAGEMENT_TEST_IDS.groupNameCell(
                                        group.group_id
                                    )}
                                >
                                    {group.group_nm}
                                </Table.Cell>
                                <Table.Cell {...cellCommon}>
                                    {group.group_id}
                                </Table.Cell>
                                <Table.Cell {...cellCommon}>
                                    {group.members?.length ?? 0}
                                </Table.Cell>
                                <Table.Cell {...cellCommon}>
                                    {group.last_edited_by && (
                                        <AvatarTableRow
                                            email={group.last_edited_by}
                                        />
                                    )}
                                </Table.Cell>
                                <Table.Cell {...cellCommon}>
                                    {group.last_edited_on_ts
                                        ? dayjs(group.last_edited_on_ts).format(
                                              'MMM D, YYYY h:mm A'
                                          )
                                        : ''}
                                </Table.Cell>
                                <Table.Cell {...cellCommon}>
                                    <Box display='inline-flex' gap={2}>
                                        <IconButton
                                            variant='ghost'
                                            borderRadius='50%'
                                            size='sm'
                                            aria-label={`Manage members for ${group.group_nm}`}
                                            data-testid={FEATURE_MANAGEMENT_TEST_IDS.groupMembersBtn(
                                                group.group_id
                                            )}
                                            onClick={() =>
                                                setMembersGroupId(
                                                    group.group_id
                                                )
                                            }
                                        >
                                            <IconAccount color='information' />
                                        </IconButton>
                                        <IconButton
                                            variant='ghost'
                                            borderRadius='50%'
                                            size='sm'
                                            aria-label={`View history for ${group.group_nm}`}
                                            data-testid={FEATURE_MANAGEMENT_TEST_IDS.groupHistoryBtn(
                                                group.group_id
                                            )}
                                            onClick={() =>
                                                setHistoryGroupId(
                                                    group.group_id
                                                )
                                            }
                                        >
                                            <IconTime color='information' />
                                        </IconButton>
                                        <IconButton
                                            variant='ghost'
                                            borderRadius='50%'
                                            size='sm'
                                            aria-label={`Delete ${group.group_nm}`}
                                            data-testid={FEATURE_MANAGEMENT_TEST_IDS.groupDeleteBtn(
                                                group.group_id
                                            )}
                                            onClick={() =>
                                                handleDelete(
                                                    group.group_id,
                                                    group.group_nm
                                                )
                                            }
                                        >
                                            <IconTrash color='critical' />
                                        </IconButton>
                                    </Box>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            ) : (
                <Text data-testid={FEATURE_MANAGEMENT_TEST_IDS.groupsEmpty}>
                    No pilot groups present
                </Text>
            )}
            <Box mt={6} display='flex' justifyContent='flex-end'>
                <Button
                    size='sm'
                    colorPalette='blue'
                    onClick={() => setIsAddOpen(true)}
                    data-testid={FEATURE_MANAGEMENT_TEST_IDS.addGroupTriggerBtn}
                >
                    <IconPlus color='white' />
                    Add Pilot Group
                </Button>
            </Box>
            <Dialog.Root
                open={isAddOpen}
                onOpenChange={e => setIsAddOpen(e.open)}
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW='420px'
                        width='92vw'
                        data-testid={FEATURE_MANAGEMENT_TEST_IDS.addGroupDialog}
                    >
                        <Dialog.Header px={6}>
                            <Dialog.Title fontSize='lg' fontWeight='700'>
                                Add Pilot Group
                            </Dialog.Title>
                        </Dialog.Header>
                        <Separator />
                        <Dialog.Body px={6}>
                            <Input
                                placeholder='New group name'
                                value={newGroupName}
                                onChange={e => setNewGroupName(e.target.value)}
                                data-testid={
                                    FEATURE_MANAGEMENT_TEST_IDS.addGroupNameInput
                                }
                            />
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
                                onClick={handleAddGroup}
                                disabled={!newGroupName.trim()}
                                data-testid={
                                    FEATURE_MANAGEMENT_TEST_IDS.addGroupBtn
                                }
                            >
                                Add
                            </Button>
                            <Button
                                variant='outline'
                                onClick={() => setIsAddOpen(false)}
                                data-testid={
                                    FEATURE_MANAGEMENT_TEST_IDS.addGroupCancelBtn
                                }
                            >
                                Cancel
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size='sm' />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
            {membersGroup && (
                <PilotGroupMembersDialog
                    isOpen={membersGroupId !== null}
                    onClose={() => setMembersGroupId(null)}
                    groupId={membersGroup.group_id}
                    groupName={membersGroup.group_nm}
                    members={membersGroup.members ?? []}
                />
            )}
            <AuditLogDialog
                isOpen={historyGroupId !== null}
                onClose={() => setHistoryGroupId(null)}
                entries={auditLogs}
                isLoading={isAuditLoading}
                title={`Audit History: ${historyGroup?.group_nm ?? ''}`}
            />
        </Box>
    )
}
