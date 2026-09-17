/* istanbul ignore file */
'use client'
import { useQuery } from '@tanstack/react-query'
import {
    Combobox,
    Field,
    GridItem,
    GridItemProps,
    Span,
    TagsInput,
    Text,
    useCombobox,
    useListCollection,
    useTagsInput,
    HStack,
    Spinner
} from '@chakra-ui/react'
import { useId, useEffect, useRef, useState } from 'react'
import { Tooltip } from '@/components/ui'
import { IconInfo } from '@americanexpress/dls-icons'
import {
    useController,
    Control,
    FieldValues,
    Path,
    RegisterOptions
} from 'react-hook-form'

export interface TypeaheadFieldProps<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
    TItem,
    TResponse
> {
    /** Hook-like function that internally calls useQuery */

    /** Map the query response to an array of items */
    mapResponseToItems: (response: TResponse | undefined) => TItem[]

    /** How to render the item as a string (for input & a11y) */
    itemToString: (item: TItem) => string

    /** Value used internally for selection (e.g. id, url) */
    itemToValue?: (item: TItem) => string

    /** Called with the full item whenever a user selects one from the list */
    onItemSelect?: (item: TItem) => void

    /** React key for each item */
    getItemKey?: (item: TItem, index: number) => string | number

    fetcher: (input: string) => Promise<TResponse>

    allowCustomValue?: boolean

    /** Label & placeholder text */
    label?: string
    placeholder?: string
    required?: boolean
    tooltip?: string

    /** RHF / controlled field props */
    name: TName
    control: Control<TFieldValues>
    rules?: RegisterOptions<TFieldValues, TName>
    colSpan?: GridItemProps['colSpan']
    autoFetch?: boolean
    disabled?: boolean
    width?: number
    border?: string
    borderRadius?: string
}

// simple debounce hook
function useDebouncedValue<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(id)
    }, [value, delay])

    return debounced
}

export function TypeaheadField<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
    TItem,
    TResponse
>({
    fetcher,
    mapResponseToItems,
    itemToString,
    itemToValue = itemToString,
    onItemSelect,
    getItemKey = (_item, index) => index,
    allowCustomValue = false,
    label = 'Search',
    placeholder = 'Type to search',
    name,
    control,
    required,
    tooltip,
    colSpan,
    rules,
    autoFetch,
    disabled,
    width,
    border,
    borderRadius
}: TypeaheadFieldProps<TFieldValues, TName, TItem, TResponse>) {
    const uid = useId()
    const controlRef = useRef<HTMLDivElement | null>(null)

    // RHF controller
    const { field, fieldState } = useController({ name, control, rules })

    const [inputValue, setInputValue] = useState('')

    const { collection, set } = useListCollection<TItem>({
        initialItems: [],
        itemToString,
        itemToValue
    })

    const debouncedInput = useDebouncedValue(inputValue, 300)

    const { data, isLoading, isFetched, error } = useQuery<TResponse>({
        queryKey: autoFetch ? [name] : [name, debouncedInput],
        queryFn: () => fetcher(debouncedInput),
        enabled: autoFetch || (!!debouncedInput && debouncedInput.length > 1)
    })

    useEffect(() => {
        let items = mapResponseToItems(data)
        if (inputValue) {
            const lower = inputValue.toLowerCase()
            items = items.filter(item =>
                itemToString(item).toLowerCase().includes(lower)
            )
        }
        set(items)
    }, [data, mapResponseToItems, set, inputValue, itemToString])

    const tags = useTagsInput({
        ids: { input: `input_${uid}`, control: `control_${uid}` },
        defaultValue: field.value ?? [],
        // when the value of tags changes, update the RHF field
        onValueChange(details) {
            field.onChange(details.value)
        },
        name
    })

    // Keep tags in sync with RHF value
    useEffect(() => {
        if (JSON.stringify(tags.value) !== JSON.stringify(field.value ?? [])) {
            tags.setValue(field.value ?? [])
        }
    }, [field.value, tags])

    const addTag = (item: string) => {
        tags.addValue(item)
    }

    const combobox = useCombobox({
        ids: { input: `input_${uid}`, control: `control_${uid}` },
        name,
        collection,
        allowCustomValue: allowCustomValue,
        value: [],
        onValueChange: e => {
            const value = e.value[0]
            if (!value) return
            addTag(value as string)
            if (onItemSelect) {
                const selected = collection.items.find(
                    item => itemToValue(item) === value
                )
                if (selected) onItemSelect(selected)
            }
        },
        onInputValueChange: e => {
            setInputValue(e.inputValue)
        },
        placeholder: placeholder,
        selectionBehavior: 'clear'
    })

    const getTagText = (value: string) => {
        if (name !== 'primaryCompanyDomains' && name !== 'companyDomain') {
            return value
        }

        const items = mapResponseToItems(data).filter(
            item => itemToValue(item).toLowerCase() == value.toLowerCase()
        )
        if (items.length > 0) {
            return itemToString(items[0])
        }

        return value
    }

    return (
        <GridItem colSpan={colSpan}>
            <Field.Root
                key={name}
                invalid={!!error || fieldState.invalid}
                required={required}
            >
                <Combobox.RootProvider value={combobox}>
                    <TagsInput.RootProvider value={tags}>
                        {label && (
                            <Field.Label>
                                <Text textStyle='sm' fontWeight='bold'>
                                    {label}
                                </Text>
                                {required && <Field.RequiredIndicator />}
                                {tooltip && (
                                    <Tooltip
                                        showArrow
                                        content={tooltip}
                                        contentProps={{
                                            css: { '--tooltip-bg': 'grey' }
                                        }}
                                    >
                                        <IconInfo size='xl' />
                                    </Tooltip>
                                )}
                            </Field.Label>
                        )}
                        <TagsInput.Control
                            ref={controlRef}
                            data-invalid={fieldState.invalid ? '' : undefined}
                            onBlur={field.onBlur}
                            width={width || '100%'}
                            border={border || undefined}
                            borderRadius={borderRadius || undefined}
                        >
                            {tags.value.map((tag, index) => (
                                <TagsInput.Item
                                    key={index}
                                    index={index}
                                    value={tag}
                                >
                                    <TagsInput.ItemPreview>
                                        <TagsInput.ItemText>
                                            {getTagText(tag)}
                                        </TagsInput.ItemText>
                                        {!disabled && (
                                            <TagsInput.ItemDeleteTrigger />
                                        )}
                                    </TagsInput.ItemPreview>
                                </TagsInput.Item>
                            ))}
                            <Combobox.Trigger
                                style={{ width: width || '100%' }}
                            >
                                <Combobox.Input
                                    disabled={disabled}
                                    unstyled
                                    asChild
                                >
                                    <TagsInput.Input
                                        style={{ width: width || '100%' }}
                                        placeholder={placeholder}
                                    />
                                </Combobox.Input>
                            </Combobox.Trigger>
                        </TagsInput.Control>
                        <Combobox.Positioner>
                            <Combobox.Content>
                                <Combobox.Empty>
                                    {isLoading ? (
                                        <HStack p='2'>
                                            <Spinner
                                                size='xs'
                                                borderWidth='1px'
                                            />
                                            <Span>Loading...</Span>
                                        </HStack>
                                    ) : error ? (
                                        <Span p='2' color='fg.error'>
                                            Error fetching
                                        </Span>
                                    ) : (
                                        <>
                                            {isFetched &&
                                                !error &&
                                                'No results'}
                                            {/* TODO this message needs to be grabbed from parent */}
                                            {!isFetched &&
                                                !isLoading &&
                                                'Type an email...'}
                                        </>
                                    )}
                                </Combobox.Empty>

                                {!isLoading &&
                                    collection.items?.map((item, index) => (
                                        <Combobox.Item
                                            key={getItemKey(item, index)}
                                            item={item}
                                        >
                                            <Span truncate>
                                                {itemToString(item)}
                                            </Span>
                                            <Combobox.ItemIndicator />
                                        </Combobox.Item>
                                    ))}
                            </Combobox.Content>
                        </Combobox.Positioner>
                    </TagsInput.RootProvider>
                    <Field.ErrorText>
                        {fieldState.error?.message}
                    </Field.ErrorText>
                </Combobox.RootProvider>
            </Field.Root>
        </GridItem>
    )
}
