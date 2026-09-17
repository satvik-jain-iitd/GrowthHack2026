'use client'
import * as React from 'react'
import {
    Box,
    Button,
    Spinner,
    Input,
    Text,
    Checkbox,
    Table,
    Combobox,
    Portal,
    VStack,
    useListCollection,
    IconButton
} from '@chakra-ui/react'
import { IconEdit, IconTrash } from '@americanexpress/dls-icons'
import { useAdminContext } from '@/context'
import { Persona, PersonaUserOptions, UserPersona } from '@/types/Persona'
import { ADMIN_TEST_IDS } from '../test-ids'

function ComboboxSelect<T>({
    options,
    getOptionLabel,
    getOptionDisabled,
    value,
    onChange,
    renderOption,
    placeholder,
    width = '100%',
    filterOptions
}: {
    options: T[]
    getOptionLabel: (opt: T) => string
    getOptionDisabled?: (opt: T) => boolean
    value: T | null
    onChange: (v: T | null) => void
    renderOption?: (opt: T) => React.ReactNode
    placeholder?: string
    width?: string | number
    filterOptions?: boolean
}) {
    const [inputValue, setInputValue] = React.useState(() =>
        value ? getOptionLabel(value) : ''
    )

    // Filter options as user types
    const filteredOptions = React.useMemo(() => {
        if (!filterOptions || !inputValue) return options
        return options.filter(opt =>
            getOptionLabel(opt).toLowerCase().includes(inputValue.toLowerCase())
        )
    }, [filterOptions, options, inputValue, getOptionLabel])

    // Provide a collection for the combobox and keep it in sync when filteredOptions change
    const { collection, set } = useListCollection<T>({
        initialItems: filteredOptions,
        itemToString: (item: T | null) => (item ? getOptionLabel(item) : ''),
        itemToValue: (item: T | null) => (item ? getOptionLabel(item) : '')
    })

    React.useEffect(() => {
        set(filteredOptions)
    }, [filteredOptions, set])

    React.useEffect(() => {
        setInputValue(value ? getOptionLabel(value) : '')
    }, [value, getOptionLabel])

    return (
        <Box width={width} position='relative'>
            <Combobox.Root
                collection={collection}
                placeholder={placeholder}
                inputValue={inputValue}
                inputBehavior='autohighlight'
                onInputValueChange={e => setInputValue(e.inputValue)}
                positioning={{ sameWidth: false, placement: 'bottom-start' }}
                onSelect={details => {
                    const itemLabel = details.itemValue
                    const selected = collection.items?.find(
                        item => getOptionLabel(item) === itemLabel
                    )
                    if (selected) {
                        onChange(selected)
                        setInputValue(getOptionLabel(selected))
                    } else {
                        onChange(null)
                    }
                }}
            >
                <Combobox.Control>
                    <Combobox.Input
                        value={inputValue}
                        placeholder={placeholder}
                        autoComplete='off'
                    />
                    <Combobox.IndicatorGroup>
                        <Combobox.ClearTrigger
                            onClick={() => {
                                setInputValue('')
                                onChange(null)
                            }}
                        />
                        <Combobox.Trigger />
                    </Combobox.IndicatorGroup>
                </Combobox.Control>
                <Portal>
                    <Combobox.Positioner>
                        <Combobox.Content
                            css={{
                                width:
                                    typeof width === 'number'
                                        ? `${width}px`
                                        : (width as string),
                                maxHeight: 220,
                                overflowY: 'auto',
                                background: 'bg.subtle',
                                border: '1px solid',
                                borderColor: 'border.muted',
                                borderRadius: 8,
                                boxShadow: 'var(--chakra-shadows-sm)',
                                zIndex: 20
                            }}
                        >
                            {!collection.items ||
                            collection.items.length === 0 ? (
                                <Combobox.Empty>
                                    <Box p={2}>
                                        <Text fontSize='sm' color='fg.muted'>
                                            No options
                                        </Text>
                                    </Box>
                                </Combobox.Empty>
                            ) : (
                                collection.items.map((opt, i) => {
                                    const disabled =
                                        getOptionDisabled?.(opt) ?? false
                                    return (
                                        <Combobox.Item
                                            key={i}
                                            item={opt}
                                            onClick={() => {
                                                if (disabled) return
                                                onChange(opt)
                                                setInputValue(
                                                    getOptionLabel(opt)
                                                )
                                            }}
                                            style={{
                                                padding: 0,
                                                borderRadius: 6,
                                                cursor: disabled
                                                    ? 'not-allowed'
                                                    : 'pointer'
                                            }}
                                            aria-disabled={
                                                disabled || undefined
                                            }
                                        >
                                            <VStack align='left'>
                                                {renderOption ? (
                                                    renderOption(opt)
                                                ) : (
                                                    <Text
                                                        truncate
                                                        fontSize='sm'
                                                    >
                                                        {getOptionLabel(opt)}
                                                    </Text>
                                                )}
                                            </VStack>
                                            <Combobox.ItemIndicator />
                                        </Combobox.Item>
                                    )
                                })
                            )}
                        </Combobox.Content>
                    </Combobox.Positioner>
                </Portal>
            </Combobox.Root>
        </Box>
    )
}

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
}

export const AdminUsers = () => {
    const adminContext = useAdminContext()
    const {
        persona,
        selectedPlaybook,
        getUserData = () => {},
        getCountOfPersona = () => {},
        playbookUsers = [],
        setPlaybookUsers = () => {},
        loading = false,
        currentEditedUser,
        setCurrentEditedUser = () => {},
        onClickSave = () => {},
        deleteUser = () => {}
    } = adminContext || {}

    React.useEffect(() => {
        getUserData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPlaybook])

    const addRow = () => {
        const tempPersonaOptions = persona?.filter(po => {
            return (getCountOfPersona(po.persona_nm) ?? 0) < po.max_user_no
        })
        setPlaybookUsers([
            ...playbookUsers,
            {
                persona_nm:
                    (tempPersonaOptions && tempPersonaOptions[0]?.persona_nm) ||
                    '',
                email: '',
                name: '',
                showInput: true,
                inherit: false,
                persona_id:
                    (tempPersonaOptions && tempPersonaOptions[0]?.persona_id) ||
                    '',
                lastUpdatedTime: new Date().toISOString()
            }
        ])
    }

    const onClickEdit = (userIndex: number) => {
        setCurrentEditedUser(playbookUsers[userIndex])
        const updatedUsers = playbookUsers?.map((user, index) =>
            index === userIndex
                ? {
                      ...user,
                      showInput: true,
                      isEdit: true
                  }
                : user
        )
        setPlaybookUsers(updatedUsers)
    }

    const onClickCancel = (userIndex: number) => {
        if (playbookUsers[userIndex]['isEdit']) {
            const updatedUsers = playbookUsers?.map((user, index) =>
                index === userIndex
                    ? { ...currentEditedUser, showInput: false, isEdit: false }
                    : user
            )
            setPlaybookUsers(updatedUsers as UserPersona[])
            setCurrentEditedUser({} as UserPersona)
        } else {
            const updatedUsers = playbookUsers?.filter(
                (_, index) => index !== userIndex
            )
            setPlaybookUsers(updatedUsers)
        }
    }

    if (loading) {
        return (
            <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                py={8}
            >
                <Spinner data-testid={ADMIN_TEST_IDS.adminUsersLoading} />
            </Box>
        )
    }

    return (
        <Box>
            {playbookUsers.length > 0 ? (
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader
                                {...columnHeaderCommon}
                                data-testid={ADMIN_TEST_IDS.personaHeader}
                            >
                                Persona
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                                {...columnHeaderCommon}
                                data-testid={ADMIN_TEST_IDS.emailHeader}
                            >
                                Email
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                                {...columnHeaderCommon}
                                data-testid={ADMIN_TEST_IDS.nameHeader}
                            >
                                Name
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                                {...columnHeaderCommon}
                                data-testid={ADMIN_TEST_IDS.inheritHeader}
                            >
                                Inherit
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                                {...columnHeaderCommon}
                                data-testid={ADMIN_TEST_IDS.actionsHeader}
                            >
                                Actions
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {playbookUsers?.map((user, index) => {
                            if (user.showInput) {
                                const selectedPersona =
                                    persona?.find(
                                        p => p.persona_id === user.persona_id
                                    ) || null
                                const selectedUser =
                                    selectedPersona?.userList?.find(
                                        u => u.userPrincipalName === user.email
                                    ) || null

                                return (
                                    <Table.Row
                                        key={index}
                                        _dark={{ bg: 'bg.emphasized' }}
                                    >
                                        <Table.Cell
                                            {...cellCommon}
                                            data-testid={ADMIN_TEST_IDS.personaCombobox(
                                                index
                                            )}
                                        >
                                            <ComboboxSelect<Persona>
                                                options={persona || []}
                                                getOptionLabel={opt =>
                                                    opt.persona_nm.replaceAll(
                                                        '_',
                                                        ' '
                                                    )
                                                }
                                                getOptionDisabled={opt =>
                                                    (getCountOfPersona(
                                                        opt.persona_nm
                                                    ) ?? 0) >= opt.max_user_no
                                                }
                                                value={selectedPersona}
                                                onChange={(
                                                    newValue: Persona | null
                                                ) => {
                                                    playbookUsers[
                                                        index
                                                    ].persona_id =
                                                        newValue?.persona_id ||
                                                        ''
                                                    playbookUsers[
                                                        index
                                                    ].persona_nm =
                                                        newValue?.persona_nm ||
                                                        ''
                                                    setPlaybookUsers([
                                                        ...playbookUsers
                                                    ])
                                                }}
                                                renderOption={opt => (
                                                    <Box
                                                        borderRadius='8px'
                                                        m='5px'
                                                        px={2}
                                                        py={1}
                                                        wordBreak='break-all'
                                                    >
                                                        {opt.persona_nm.replaceAll(
                                                            '_',
                                                            ' '
                                                        )}
                                                    </Box>
                                                )}
                                                width='220px'
                                                placeholder='Select persona'
                                            />
                                        </Table.Cell>
                                        <Table.Cell
                                            {...cellCommon}
                                            data-testid={ADMIN_TEST_IDS.userCombobox(
                                                index
                                            )}
                                        >
                                            <ComboboxSelect<PersonaUserOptions>
                                                filterOptions
                                                options={
                                                    selectedPersona?.userList ||
                                                    []
                                                }
                                                getOptionLabel={opt =>
                                                    opt.userPrincipalName
                                                }
                                                value={selectedUser}
                                                onChange={(
                                                    newValue: PersonaUserOptions | null
                                                ) => {
                                                    playbookUsers[index].name =
                                                        newValue?.displayName ||
                                                        ''
                                                    playbookUsers[index].email =
                                                        newValue?.userPrincipalName ||
                                                        ''
                                                    setPlaybookUsers([
                                                        ...playbookUsers
                                                    ])
                                                }}
                                                renderOption={opt => (
                                                    <Box
                                                        borderRadius='8px'
                                                        m='5px'
                                                        px={2}
                                                        py={1}
                                                        wordBreak='break-all'
                                                    >
                                                        {opt.userPrincipalName}
                                                    </Box>
                                                )}
                                                width='250px'
                                                placeholder='Select user'
                                            />
                                        </Table.Cell>
                                        <Table.Cell {...cellCommon}>
                                            <Input
                                                disabled
                                                defaultValue={
                                                    selectedUser?.displayName ||
                                                    ''
                                                }
                                            />
                                        </Table.Cell>
                                        <Table.Cell {...cellCommon}>
                                            <Box
                                                display='flex'
                                                alignItems='center'
                                            >
                                                <Checkbox.Root
                                                    size='sm'
                                                    colorPalette='blue'
                                                    checked={!!user.inherit}
                                                    onCheckedChange={e => {
                                                        playbookUsers[
                                                            index
                                                        ].inherit = !!e.checked
                                                        setPlaybookUsers([
                                                            ...playbookUsers
                                                        ])
                                                    }}
                                                >
                                                    <Checkbox.HiddenInput />
                                                    <Checkbox.Control
                                                        _hover={{
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                </Checkbox.Root>
                                            </Box>
                                        </Table.Cell>
                                        <Table.Cell
                                            {...cellCommon}
                                            style={{ width: '220px' }}
                                        >
                                            <Button
                                                data-testid={ADMIN_TEST_IDS.saveRowBtn(
                                                    index
                                                )}
                                                size='sm'
                                                height='7'
                                                colorPalette='blue'
                                                fontSize={11}
                                                onClick={() =>
                                                    onClickSave(index)
                                                }
                                                mr={2}
                                            >
                                                SAVE
                                            </Button>
                                            <Button
                                                data-testid={ADMIN_TEST_IDS.cancelRowBtn(
                                                    index
                                                )}
                                                size='sm'
                                                height='7'
                                                fontSize={11}
                                                variant='outline'
                                                colorPalette='blue'
                                                _hover={{ bg: 'bg.muted' }}
                                                onClick={() =>
                                                    onClickCancel(index)
                                                }
                                            >
                                                CANCEL
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            } else {
                                return (
                                    <Table.Row
                                        key={index}
                                        _dark={{ bg: 'bg.emphasized' }}
                                    >
                                        <Table.Cell
                                            {...cellCommon}
                                            data-testid={ADMIN_TEST_IDS.displayPersonaCell(
                                                index
                                            )}
                                        >
                                            {user.persona_nm.replaceAll(
                                                '_',
                                                ' '
                                            )}
                                        </Table.Cell>
                                        <Table.Cell
                                            {...cellCommon}
                                            data-testid={ADMIN_TEST_IDS.displayEmailCell(
                                                index
                                            )}
                                        >
                                            {user.email}
                                        </Table.Cell>
                                        <Table.Cell
                                            {...cellCommon}
                                            data-testid={ADMIN_TEST_IDS.displayNameCell(
                                                index
                                            )}
                                        >
                                            {user.name}
                                        </Table.Cell>
                                        <Table.Cell {...cellCommon}>
                                            <Box
                                                display='flex'
                                                alignItems='center'
                                            >
                                                <Checkbox.Root
                                                    readOnly
                                                    size='sm'
                                                    colorPalette='blue'
                                                    checked={!!user.inherit}
                                                >
                                                    <Checkbox.HiddenInput />
                                                    <Checkbox.Control />
                                                </Checkbox.Root>
                                            </Box>
                                        </Table.Cell>
                                        <Table.Cell {...cellCommon}>
                                            <Box display='inline-flex' gap={2}>
                                                <IconButton
                                                    variant='ghost'
                                                    borderRadius='50%'
                                                    size='sm'
                                                >
                                                    <IconEdit
                                                        color='information'
                                                        onClick={() => {
                                                            onClickEdit(index)
                                                        }}
                                                    />
                                                </IconButton>
                                                <IconButton
                                                    variant='ghost'
                                                    borderRadius='50%'
                                                    size='sm'
                                                >
                                                    <IconTrash
                                                        color='critical'
                                                        onClick={() => {
                                                            deleteUser(index)
                                                        }}
                                                    />
                                                </IconButton>
                                            </Box>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                        })}
                    </Table.Body>
                </Table.Root>
            ) : (
                <Text data-testid={ADMIN_TEST_IDS.noDataPresent}>
                    No Data Present
                </Text>
            )}
            <Box mt={6} width='100%' textAlign='right'>
                <Button
                    data-testid={ADMIN_TEST_IDS.addRowBtn}
                    size='sm'
                    height='7'
                    fontSize={11}
                    onClick={addRow}
                    colorPalette='blue'
                >
                    ADD
                </Button>
            </Box>
        </Box>
    )
}
