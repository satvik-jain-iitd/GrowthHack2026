'use client'
import { useState } from 'react'
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    HStack,
    IconButton,
    Input,
    RadioGroup,
    Separator,
    Spinner,
    Table,
    Text
} from '@chakra-ui/react'
import { IconPlus, IconTime, IconTrash } from '@americanexpress/dls-icons'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { AvatarTableRow } from '@/components/ui'
import {
    useDeleteFeatureFlag,
    useFeatureFlagAuditLogs,
    useFeatureFlags,
    useSetFeatureFlag
} from '@/hooks'
import { AuditLogDialog } from './AuditLogDialog'
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

export const FeatureFlagsPanel = () => {
    const { data: flags = [], isLoading } = useFeatureFlags()
    const setFeatureFlag = useSetFeatureFlag()
    const deleteFeatureFlag = useDeleteFeatureFlag()

    const [historyFlagName, setHistoryFlagName] = useState<string | null>(null)
    const { data: auditLogs = [], isLoading: isAuditLoading } =
        useFeatureFlagAuditLogs(historyFlagName ?? '')

    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newFlagName, setNewFlagName] = useState('')
    const [newFlagValue, setNewFlagValue] = useState(false)

    const handleToggle = (name: string, value: boolean) => {
        setFeatureFlag.mutate(
            { name, value },
            {
                onSuccess: () =>
                    toast.success(`Feature flag "${name}" updated`),
                onError: () =>
                    toast.error(`Failed to update feature flag "${name}"`)
            }
        )
    }

    const handleDelete = (name: string) => {
        deleteFeatureFlag.mutate(
            { name },
            {
                onSuccess: () =>
                    toast.success(`Feature flag "${name}" deleted`),
                onError: () =>
                    toast.error(`Failed to delete feature flag "${name}"`)
            }
        )
    }

    const handleAddFlag = () => {
        const name = newFlagName.trim()
        setFeatureFlag.mutate(
            { name, value: newFlagValue },
            {
                onSuccess: () => {
                    toast.success(`Feature flag "${name}" created`)
                    setNewFlagName('')
                    setNewFlagValue(false)
                    setIsAddOpen(false)
                },
                onError: () => toast.error(`Failed to create feature flag`)
            }
        )
    }

    const sortedFeatureFlags = new Array(...flags).sort((a, b) =>
        a.name.localeCompare(b.name)
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
                    data-testid={FEATURE_MANAGEMENT_TEST_IDS.flagsLoading}
                />
            </Box>
        )
    }

    return (
        <Box>
            {sortedFeatureFlags.length > 0 ? (
                <Table.Root
                    variant='outline'
                    data-testid={FEATURE_MANAGEMENT_TEST_IDS.flagsTable}
                >
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader {...columnHeaderCommon}>
                                Name
                            </Table.ColumnHeader>
                            <Table.ColumnHeader {...columnHeaderCommon}>
                                Status
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
                        {sortedFeatureFlags.map(flag => (
                            <Table.Row key={flag.name}>
                                <Table.Cell
                                    {...cellCommon}
                                    data-testid={FEATURE_MANAGEMENT_TEST_IDS.flagNameCell(
                                        flag.name
                                    )}
                                >
                                    {flag.name}
                                </Table.Cell>
                                <Table.Cell {...cellCommon}>
                                    <RadioGroup.Root
                                        value={flag.value ? 'on' : 'off'}
                                        onValueChange={e =>
                                            handleToggle(
                                                flag.name,
                                                e.value === 'on'
                                            )
                                        }
                                        data-testid={FEATURE_MANAGEMENT_TEST_IDS.flagValueSwitch(
                                            flag.name
                                        )}
                                    >
                                        <HStack gap={4}>
                                            <RadioGroup.Item value='on'>
                                                <RadioGroup.ItemHiddenInput />
                                                <RadioGroup.ItemIndicator />
                                                <RadioGroup.ItemText>
                                                    On
                                                </RadioGroup.ItemText>
                                            </RadioGroup.Item>
                                            <RadioGroup.Item value='off'>
                                                <RadioGroup.ItemHiddenInput />
                                                <RadioGroup.ItemIndicator />
                                                <RadioGroup.ItemText>
                                                    Off
                                                </RadioGroup.ItemText>
                                            </RadioGroup.Item>
                                        </HStack>
                                    </RadioGroup.Root>
                                </Table.Cell>
                                <Table.Cell {...cellCommon}>
                                    {flag.lastEditedBy && (
                                        <AvatarTableRow
                                            email={flag.lastEditedBy}
                                        />
                                    )}
                                </Table.Cell>
                                <Table.Cell {...cellCommon}>
                                    {flag.lastEditedOn
                                        ? dayjs(flag.lastEditedOn).format(
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
                                            aria-label={`View history for ${flag.name}`}
                                            data-testid={FEATURE_MANAGEMENT_TEST_IDS.flagHistoryBtn(
                                                flag.name
                                            )}
                                            onClick={() =>
                                                setHistoryFlagName(flag.name)
                                            }
                                        >
                                            <IconTime color='information' />
                                        </IconButton>
                                        <IconButton
                                            variant='ghost'
                                            borderRadius='50%'
                                            size='sm'
                                            aria-label={`Delete ${flag.name}`}
                                            data-testid={FEATURE_MANAGEMENT_TEST_IDS.flagDeleteBtn(
                                                flag.name
                                            )}
                                            onClick={() =>
                                                handleDelete(flag.name)
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
                <Text data-testid={FEATURE_MANAGEMENT_TEST_IDS.flagsEmpty}>
                    No feature flags present
                </Text>
            )}
            <Box mt={6} display='flex' justifyContent='flex-end'>
                <Button
                    size='sm'
                    colorPalette='blue'
                    onClick={() => setIsAddOpen(true)}
                    data-testid={FEATURE_MANAGEMENT_TEST_IDS.addFlagTriggerBtn}
                >
                    <IconPlus color='white' />
                    Add Feature Flag
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
                        data-testid={FEATURE_MANAGEMENT_TEST_IDS.addFlagDialog}
                    >
                        <Dialog.Header px={6}>
                            <Dialog.Title fontSize='lg' fontWeight='700'>
                                Add Feature Flag
                            </Dialog.Title>
                        </Dialog.Header>
                        <Separator />
                        <Dialog.Body
                            px={6}
                            display='flex'
                            flexDirection='column'
                            gap={4}
                        >
                            <Input
                                placeholder='New flag name'
                                value={newFlagName}
                                onChange={e => setNewFlagName(e.target.value)}
                                data-testid={
                                    FEATURE_MANAGEMENT_TEST_IDS.addFlagNameInput
                                }
                            />
                            <RadioGroup.Root
                                value={newFlagValue ? 'on' : 'off'}
                                onValueChange={e =>
                                    setNewFlagValue(e.value === 'on')
                                }
                                data-testid={
                                    FEATURE_MANAGEMENT_TEST_IDS.addFlagValueSwitch
                                }
                            >
                                <HStack gap={4}>
                                    <Text fontSize='sm' color='fg.muted'>
                                        Status:
                                    </Text>
                                    <RadioGroup.Item value='on'>
                                        <RadioGroup.ItemHiddenInput />
                                        <RadioGroup.ItemIndicator />
                                        <RadioGroup.ItemText>
                                            On
                                        </RadioGroup.ItemText>
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value='off'>
                                        <RadioGroup.ItemHiddenInput />
                                        <RadioGroup.ItemIndicator />
                                        <RadioGroup.ItemText>
                                            Off
                                        </RadioGroup.ItemText>
                                    </RadioGroup.Item>
                                </HStack>
                            </RadioGroup.Root>
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
                                onClick={handleAddFlag}
                                disabled={!newFlagName.trim()}
                                data-testid={
                                    FEATURE_MANAGEMENT_TEST_IDS.addFlagBtn
                                }
                            >
                                Add
                            </Button>
                            <Button
                                variant='outline'
                                onClick={() => setIsAddOpen(false)}
                                data-testid={
                                    FEATURE_MANAGEMENT_TEST_IDS.addFlagCancelBtn
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
            <AuditLogDialog
                isOpen={historyFlagName !== null}
                onClose={() => setHistoryFlagName(null)}
                entries={auditLogs}
                isLoading={isAuditLoading}
                title={`Audit History: ${historyFlagName ?? ''}`}
            />
        </Box>
    )
}
