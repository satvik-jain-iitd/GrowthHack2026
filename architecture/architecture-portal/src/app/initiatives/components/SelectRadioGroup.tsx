/* istanbul ignore file */
import {
    Box,
    Button,
    Combobox,
    Field,
    Flex,
    GridItem,
    Group,
    Span,
    TagsInput,
    Text,
    useCombobox,
    useFilter,
    useListCollection,
    useTagsInput
} from '@chakra-ui/react'
import PtbTags from './PtbTags'
import { useEffect } from 'react'

function SelectRadioGroup({
    options,
    name,
    selection,
    setSelection,
    width = '600px'
}: {
    options: { label: string; value: string }[]
    width?: string
    name: string
    selection: {
        core: { label: string; value: string }[]
        nonCore: { label: string; value: string }[]
        selected: null | { label: string; value: string }
        type: null | string
    }
    setSelection: (select: {
        core: { label: string; value: string }[]
        nonCore: { label: string; value: string }[]
        selected: null | { label: string; value: string }
        type: null | string
    }) => void
}) {
    const { contains } = useFilter({ sensitivity: 'base' })

    const { collection, filter, set } = useListCollection({
        initialItems: options,
        filter: contains,
        limit: 10,
        itemToString: item => item.label,
        itemToValue: item => item.value
    })

    const onClickClose = (item: { value: string }) => {
        setSelection({
            ...selection,
            core: selection.core.filter(i => i.value !== item.value),
            nonCore: selection.nonCore.filter(i => i.value !== item.value)
        })
    }

    const combobox = useCombobox({
        ids: { input: `input_${name}`, control: `control_${name}` },
        name,
        collection: collection,
        allowCustomValue: true,
        value: [],
        placeholder: `Select ${name}`,
        selectionBehavior: 'clear',
        onInputValueChange: e => filter(e.inputValue),
        closeOnSelect: false
    })

    const tags = useTagsInput({
        ids: { input: `input_${name}`, control: `control_${name}` },
        name
    })

    const onClickCore = (
        item: { label: string; value: string },
        isCore: boolean,
        isNonCore: boolean
    ) => {
        if (!isCore) {
            setSelection({
                ...selection,
                core: [...selection.core, item!],
                selected: null,
                type: null,
                nonCore: isNonCore
                    ? selection.nonCore.filter(i => i.value !== item.value)
                    : selection.nonCore
            })
        }
    }

    const onClickNonCore = (
        item: { label: string; value: string },
        isCore: boolean,
        isNonCore: boolean
    ) => {
        if (!isNonCore) {
            setSelection({
                ...selection,
                nonCore: [...selection.nonCore, item!],
                selected: null,
                type: null,
                core: isCore
                    ? selection.core.filter(i => i.value !== item.value)
                    : selection.core
            })
        }
    }

    useEffect(() => {
        if (options && options.length > 0) {
            set(options)
        }
    }, [options])

    return (
        <Flex direction={'column'} gap={4}>
            <GridItem>
                <Field.Root>
                    <Field.Label>
                        <Text textStyle='sm' fontWeight='bold'>
                            {name}
                        </Text>
                    </Field.Label>
                    <Box>
                        <Combobox.RootProvider value={combobox} width={width}>
                            <TagsInput.RootProvider value={tags}>
                                <TagsInput.Control
                                    style={{ width: width }}
                                    border={'1px solid #8C8C8C'}
                                    borderRadius={'5px'}
                                >
                                    <Combobox.Trigger style={{ width: '100%' }}>
                                        <Combobox.Input unstyled asChild>
                                            <TagsInput.Input
                                                style={{ width: '100%' }}
                                                placeholder={`Select ${name}`}
                                            />
                                        </Combobox.Input>
                                    </Combobox.Trigger>
                                </TagsInput.Control>
                                <Combobox.Positioner>
                                    <Combobox.Content>
                                        {collection?.items?.map(
                                            (item, index) => {
                                                const isCore =
                                                    selection.core.find(
                                                        ({ value }) =>
                                                            value == item.value
                                                    )
                                                const isNonCore =
                                                    selection.nonCore.find(
                                                        ({ value }) =>
                                                            value == item.value
                                                    )
                                                return (
                                                    <Combobox.Item
                                                        key={`${item.value}_${index}_${name}`}
                                                        item={item}
                                                    >
                                                        <Span truncate>
                                                            {item.label}
                                                        </Span>
                                                        <Group>
                                                            <Button
                                                                size={'xs'}
                                                                colorPalette={
                                                                    'blue'
                                                                }
                                                                variant={
                                                                    isCore
                                                                        ? 'solid'
                                                                        : 'outline'
                                                                }
                                                                onClick={() => {
                                                                    onClickCore(
                                                                        item,
                                                                        !!isCore,
                                                                        !!isNonCore
                                                                    )
                                                                }}
                                                            >
                                                                Core
                                                            </Button>
                                                            <Button
                                                                size={'xs'}
                                                                colorPalette={
                                                                    'blue'
                                                                }
                                                                variant={
                                                                    isNonCore
                                                                        ? 'solid'
                                                                        : 'outline'
                                                                }
                                                                onClick={() =>
                                                                    onClickNonCore(
                                                                        item,
                                                                        !!isCore,
                                                                        !!isNonCore
                                                                    )
                                                                }
                                                            >
                                                                Non Core
                                                            </Button>
                                                        </Group>
                                                    </Combobox.Item>
                                                )
                                            }
                                        )}
                                    </Combobox.Content>
                                </Combobox.Positioner>
                            </TagsInput.RootProvider>
                        </Combobox.RootProvider>
                        <Box mb={2}>
                            {[...(selection?.core || [])]?.map(item => {
                                return (
                                    <PtbTags
                                        item={{
                                            name: item.label,
                                            id: item.value
                                        }}
                                        key={item.value}
                                        isCore={true}
                                        isEdit={true}
                                        onClickClose={() => onClickClose(item)}
                                    />
                                )
                            })}
                            {[...(selection?.nonCore || [])]?.map(item => {
                                return (
                                    <PtbTags
                                        item={{
                                            name: item.label,
                                            id: item.value
                                        }}
                                        key={item.value}
                                        isEdit={true}
                                        onClickClose={() => onClickClose(item)}
                                    />
                                )
                            })}
                        </Box>
                    </Box>
                </Field.Root>
            </GridItem>
        </Flex>
    )
}

export default SelectRadioGroup
