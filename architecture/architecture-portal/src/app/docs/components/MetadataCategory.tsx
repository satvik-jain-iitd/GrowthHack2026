/* istanbul ignore file */
import {
    Dispatch,
    SetStateAction,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'
import { Button, CloseButton, Tag } from '@chakra-ui/react'
import Select, {
    components,
    CSSObjectWithLabel,
    OptionProps,
    ValueContainerProps
} from 'react-select'
import { useMetadataTags } from '@/app/docs/hooks'
import { TechStackDropdown } from './TechStackDropdown'
import { MetadataDropdown } from './MetadataDropdown'
import styles from '@/app/docs/styles/metadata.module.css'
import { MetadataConfirmationDialog } from './MetadataConfirmationDialog'
import { SafeFlag } from '@/components/ui'

interface Category {
    tag_category_nm: string
    tag_category_id: string | number
    [key: string]: unknown
}

interface TagOption {
    label: string
    value: string | number
    tag_nm?: string
    tag_id?: string | number
    children?: TagOption[]
    add_da?: string
    formattedLabel?: React.ReactNode
    tag_category_nm?: string
    [key: string]: unknown
}

interface AddedTag {
    label: string
    value: string | number
    options?: TagOption[]
    selectedOptions?: TagOption[]
    [key: string]: unknown
}

interface MetadataCategoryProps {
    categories: Category[]
    tags: Record<string, TagOption[]>
    canEdit: boolean
    setShowCategoriesSection: Dispatch<SetStateAction<boolean>>
    isConfirmationModalOpen: boolean
    handleConfirmationModal: () => void
    setOpenAddTagsForm: Dispatch<SetStateAction<Record<string, boolean>>>
    addedTagList: AddedTag[]
    setAddedTagList: Dispatch<SetStateAction<AddedTag[]>>
    categoryTags: AddedTag[]
    setCategoryTags: (list: AddedTag[]) => void
    processQueue: () => void
    addedCategories: TagOption[]
    setAddedCategories: Dispatch<SetStateAction<TagOption[]>>
    selectedCategory: TagOption[]
    setSelectedCategory: (list: TagOption[]) => void
    custom_tags: TagOption[]
    setCustom_tags: (
        tags: { tag_nm: string; tag_category_id: string | number }[]
    ) => void
    actionQueue: unknown[]
    errorMessage: string
    setErrorMessage: (msg: string) => void
    techStackList: (string | number)[] | undefined
    isEditing: boolean
}

const CheckboxOption = (props: OptionProps<TagOption, true>) => (
    <components.Option {...props}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
                type='checkbox'
                checked={props.isSelected}
                onChange={() => null}
                className={styles.categoryCheckBoxes}
            />
            <label>{props.label}</label>
        </div>
    </components.Option>
)

const CustomValueContainer = (props: ValueContainerProps<TagOption, true>) => {
    const { children } = props
    const selected = props.getValue()

    return (
        <components.ValueContainer {...props}>
            {selected.length === 0 ? (
                children
            ) : (
                <div className={styles.selectedCheckboxesText}>
                    {`${selected.length} Selected`}
                </div>
            )}
        </components.ValueContainer>
    )
}

export const MetadataCategory = ({
    categories,
    tags,
    canEdit,
    setShowCategoriesSection,
    isConfirmationModalOpen,
    handleConfirmationModal,
    setOpenAddTagsForm,
    addedTagList,
    setAddedTagList,
    categoryTags,
    setCategoryTags,
    processQueue,
    addedCategories,
    setAddedCategories,
    selectedCategory,
    setSelectedCategory,
    custom_tags,
    setCustom_tags,
    actionQueue,
    errorMessage,
    setErrorMessage,
    techStackList,
    isEditing
}: MetadataCategoryProps) => {
    const { fetchMetadataTagsGET } = useMetadataTags()
    const [isMultilevelSelect, setIsMultilevelSelect] = useState<
        TagOption[] | boolean
    >(false)
    const [multiSelectValue, setMultiSelectValue] = useState<
        string | number | null
    >(null)
    const processingRef = useRef<boolean>(false)
    const [showSelectedTags, setShowSelectedTags] = useState<boolean>(false)
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [techStack, setTechStack] = useState<string | TagOption | undefined>(
        ''
    )

    const selectStyles = {
        multiValue: (base: CSSObjectWithLabel) => {
            return {
                ...base,
                backgroundColor: 'white',
                color: '#b80606ff',
                border: '1px solid #006fcf',
                borderRadius: '5px'
            }
        },
        multiValueLabel: (base: CSSObjectWithLabel) => {
            return { ...base, color: '#006fcf' }
        },
        menuList: (base: CSSObjectWithLabel) => ({
            ...base,
            maxHeight: '160px',
            overflowY: 'auto' as const,
            color: 'black'
        })
    }

    useEffect(() => {
        if (addedCategories.length > 0) {
            const fetchAllTags = async () => {
                try {
                    const results = await Promise.all(
                        addedCategories.map(async cat => {
                            const res = await fetchMetadataTagsGET(cat.value)
                            return {
                                ...cat,
                                options: Array.isArray(res)
                                    ? (res as TagOption[])
                                    : [],
                                selectedOptions:
                                    addedTagList.find(v => v.value == cat.value)
                                        ?.selectedOptions || []
                            }
                        })
                    )
                    setAddedTagList(results)
                } catch (error) {
                    console.error(error)
                }
            }
            fetchAllTags()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addedCategories])

    const onClickClose = (
        itemValue: string | number,
        categoryLabel: string
    ) => {
        const updatedAddedTagList = addedTagList.map(item => {
            if (item.label === categoryLabel) {
                return {
                    ...item,
                    selectedOptions: item.selectedOptions?.filter(
                        option => option.value !== itemValue
                    )
                }
            }
            return item
        })
        const updatedCategoryTags = categoryTags.map(cat => {
            if (cat.label === categoryLabel) {
                return {
                    ...cat,
                    selectedOptions: cat.selectedOptions?.filter(
                        option => option.value !== itemValue
                    )
                }
            }
            return cat
        })
        setAddedTagList(updatedAddedTagList)
        setCategoryTags(updatedCategoryTags)
    }

    const onClickAddCategory = () => {
        if (selectedCategory && selectedCategory.length > 0) {
            setAddedCategories((prev: TagOption[]) => [
                ...prev,
                ...selectedCategory.filter(
                    cat => !prev.some(a => a.value === cat.value)
                )
            ])
            setSelectedCategory([])
            setIsMenuOpen(false)
        }
    }

    useEffect(() => {
        if (actionQueue.length > 0 && !processingRef.current) {
            processQueue()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionQueue])

    const onClickAdd = (category: TagOption) => {
        const updatedCategoryList = addedTagList?.filter(
            item => item?.label === category?.label
        )
        if (categoryTags?.some(item => item?.label === category?.label)) {
            setCategoryTags(
                categoryTags?.map(cat => {
                    if (cat?.label === category?.label) {
                        const existingOptions = cat?.selectedOptions || []
                        const newOptions =
                            updatedCategoryList?.[0]?.selectedOptions || []
                        const mergedOptions = [
                            ...existingOptions,
                            ...newOptions.filter(
                                option =>
                                    !existingOptions.some(
                                        existing =>
                                            existing.value === option.value
                                    )
                            )
                        ]
                        return {
                            ...cat,
                            selectedOptions: mergedOptions
                        }
                    }
                    return cat
                })
            )
        } else {
            setCategoryTags([...categoryTags, ...updatedCategoryList])
        }
        const updatedAddedTagList = addedTagList.map(item =>
            item.label === category.label
                ? { ...item, selectedOptions: [] }
                : item
        )
        setAddedTagList(updatedAddedTagList)
        setSelectedCategory([])
        if (category.label === 'Tech Stacks') {
            setTechStack('')
        }
    }

    const filteredTags = useMemo(() => {
        if (canEdit) {
            return categories?.filter(cat => {
                const tagArr = (tags || {})[cat.tag_category_nm]
                if (
                    tagArr &&
                    Array.isArray(tagArr) &&
                    tagArr.length === 1 &&
                    tagArr[0]?.hasDelete === false
                ) {
                    // Do NOT filter out this category, allow it to remain
                    return true
                }
                // Default: filter out if tag_category_nm exists in tags
                return !Object.keys(tags || {}).includes(cat.tag_category_nm)
            })
        }
        return categories?.filter(cat => {
            if (cat.tag_category_nm?.toLowerCase() === 'keywords') {
                const tagArr = (tags || {})[cat.tag_category_nm]
                if (
                    tagArr &&
                    Array.isArray(tagArr) &&
                    tagArr.length === 1 &&
                    tagArr[0]?.hasDelete === false
                ) {
                    return true
                }
                return !Object.keys(tags || {}).includes(cat.tag_category_nm)
            }
            return false
        })
    }, [categories, canEdit, tags])

    return (
        <>
            <div>
                <p className={styles.helperText}>
                    Add or merge Categories below. You may use the dropdown
                    above to add additional types before saving.
                </p>
            </div>
            {!isEditing && (
                <div className={styles.categoryForm} style={{ padding: 0 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <Select
                            options={filteredTags
                                ?.filter(
                                    cat =>
                                        !addedCategories.some(
                                            a =>
                                                String(a.value) ===
                                                String(cat.tag_category_id)
                                        )
                                )
                                .map(cat => ({
                                    label: cat.tag_category_nm,
                                    value: cat.tag_category_id
                                }))}
                            placeholder='Select Category...'
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            onMenuOpen={() => setIsMenuOpen(true)}
                            onMenuClose={() => setIsMenuOpen(false)}
                            menuIsOpen={isMenuOpen}
                            components={{
                                Option: CheckboxOption,
                                ValueContainer: CustomValueContainer
                            }}
                            onChange={val => {
                                setSelectedCategory(
                                    Array.isArray(val) ? [...val] : []
                                )
                            }}
                            value={selectedCategory}
                            styles={{
                                control: base => ({
                                    ...base,
                                    minWidth: 0,
                                    minHeight: 30,
                                    fontSize: 18,
                                    width: '100%'
                                }),
                                container: base => ({ ...base, width: '100%' }),
                                ...selectStyles,
                                option: base => ({
                                    ...base,
                                    backgroundColor: 'white',
                                    color: 'black'
                                })
                            }}
                        />
                    </div>
                    <div className={styles.categoryFormButtonGroup}>
                        <Button
                            colorScheme='blue'
                            variant='outline'
                            onClick={onClickAddCategory}
                            className={styles.addButton}
                        >
                            Add
                        </Button>
                        <Button
                            onClick={() => {
                                setOpenAddTagsForm({})
                                setShowCategoriesSection(false)
                                setAddedCategories([])
                                setAddedTagList([])
                            }}
                            colorScheme='blue'
                            variant='outline'
                            className={styles.cancelButton}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
            {addedTagList.map((cat, i) => {
                const propagatedTagsList: TagOption[] =
                    tags?.[cat?.label]
                        ?.filter(
                            item =>
                                typeof item?.tag_nm === 'string' &&
                                item?.tag_id !== undefined
                        )
                        .map(item => ({
                            ...item,
                            label: item.tag_nm as string,
                            value: item.tag_id as string | number
                        })) || []
                const matchedCategory = categoryTags?.find(
                    item => item.label === cat?.label
                )

                return (
                    <div key={cat.value}>
                        <div key={cat.value} className={styles.metadataTags}>
                            <div className={styles.categoryLabel}>
                                {`${cat.label} :`}
                            </div>
                            <>
                                {cat.label?.toLocaleLowerCase() ===
                                'tech stacks' ? (
                                    <TechStackDropdown
                                        cat={{
                                            ...cat,
                                            options: cat.options || []
                                        }}
                                        index={i}
                                        setAddedTagList={setAddedTagList}
                                        addedTagList={addedTagList}
                                        setCustom_tags={setCustom_tags}
                                        techStack={techStack}
                                        setTechStack={setTechStack}
                                        propagatedTagsList={propagatedTagsList}
                                        techStackList={techStackList}
                                    />
                                ) : (
                                    <>
                                        {multiSelectValue != cat.value && (
                                            <Select
                                                isMulti
                                                placeholder={`Add items for ${cat.label}...`}
                                                options={cat.options
                                                    ?.filter(option => {
                                                        const tempSelected =
                                                            cat.selectedOptions ||
                                                            []
                                                        const savedCat =
                                                            categoryTags.find(
                                                                ct =>
                                                                    ct.label ===
                                                                    cat.label
                                                            )
                                                        const alreadyAdded =
                                                            savedCat?.selectedOptions ||
                                                            []
                                                        return ![
                                                            ...tempSelected,
                                                            ...alreadyAdded,
                                                            ...propagatedTagsList
                                                        ].some(
                                                            item =>
                                                                String(
                                                                    item.value
                                                                ) ===
                                                                String(
                                                                    option.tag_id
                                                                )
                                                        )
                                                    })
                                                    ?.map(option => {
                                                        const flagCode =
                                                            option.add_da
                                                                ? JSON.parse(
                                                                      option.add_da
                                                                  ).code
                                                                : null
                                                        return {
                                                            ...option,
                                                            label:
                                                                option.tag_nm ??
                                                                '',
                                                            value:
                                                                option.tag_id !==
                                                                undefined
                                                                    ? String(
                                                                          option.tag_id
                                                                      )
                                                                    : '',
                                                            tag_id:
                                                                option.tag_id !==
                                                                undefined
                                                                    ? String(
                                                                          option.tag_id
                                                                      )
                                                                    : undefined,
                                                            text: option.tag_nm,
                                                            formattedLabel:
                                                                cat.label?.toLowerCase() ===
                                                                'markets' ? (
                                                                    <>
                                                                        <SafeFlag
                                                                            code={
                                                                                flagCode
                                                                            }
                                                                            alt={
                                                                                option.tag_nm ||
                                                                                'flag'
                                                                            }
                                                                        />
                                                                        <span
                                                                            className={
                                                                                styles.flagAlign
                                                                            }
                                                                        >
                                                                            {
                                                                                option.tag_nm
                                                                            }
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    option.tag_nm
                                                                )
                                                        }
                                                    })
                                                    .sort((a, b) => {
                                                        if (
                                                            cat.label?.toLowerCase() ===
                                                            'markets'
                                                        ) {
                                                            return (
                                                                a.text ?? ''
                                                            ).localeCompare(
                                                                b.text ?? ''
                                                            )
                                                        }
                                                        return 0
                                                    })}
                                                formatOptionLabel={option => {
                                                    const flagCode =
                                                        option.add_da
                                                            ? JSON.parse(
                                                                  option.add_da
                                                              ).code
                                                            : null
                                                    return cat.label?.toLowerCase() ===
                                                        'markets' ? (
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                gap: '5px'
                                                            }}
                                                        >
                                                            <SafeFlag
                                                                code={flagCode}
                                                                alt={
                                                                    option.tag_nm ||
                                                                    'flag'
                                                                }
                                                            />
                                                            <span
                                                                className={
                                                                    styles.flagAlign
                                                                }
                                                            >
                                                                {option.tag_nm}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        option.tag_nm
                                                    )
                                                }}
                                                value={cat.selectedOptions}
                                                onChange={(
                                                    selected,
                                                    actionMeta
                                                ) => {
                                                    if (
                                                        actionMeta.action !==
                                                        'select-option'
                                                    ) {
                                                        addedTagList[
                                                            i
                                                        ].selectedOptions =
                                                            Array.isArray(
                                                                selected
                                                            )
                                                                ? [...selected]
                                                                : []
                                                        setAddedTagList([
                                                            ...addedTagList
                                                        ])
                                                        return
                                                    }
                                                    const lastSelected =
                                                        selected?.[
                                                            selected.length - 1
                                                        ]
                                                    if (!lastSelected) return
                                                    if (
                                                        Array.isArray(
                                                            lastSelected.children
                                                        ) &&
                                                        lastSelected.children
                                                            .length > 0
                                                    ) {
                                                        setIsMultilevelSelect([
                                                            lastSelected
                                                        ])
                                                        setMultiSelectValue(
                                                            cat.value
                                                        )
                                                        return
                                                    }
                                                    addedTagList[
                                                        i
                                                    ].selectedOptions =
                                                        Array.isArray(selected)
                                                            ? [...selected]
                                                            : []
                                                    setAddedTagList([
                                                        ...addedTagList
                                                    ])
                                                }}
                                                styles={{
                                                    control: base => ({
                                                        ...base,
                                                        minWidth: 0,
                                                        minHeight: 30,
                                                        fontSize: 18,
                                                        width: '100%'
                                                    }),
                                                    container: base => ({
                                                        ...base,
                                                        width: '100%'
                                                    }),
                                                    ...selectStyles,
                                                    option: base => ({
                                                        ...base,
                                                        backgroundColor:
                                                            'white',
                                                        color: 'black'
                                                    })
                                                }}
                                            />
                                        )}
                                        {multiSelectValue == cat.value && (
                                            <div className={styles.selectForm}>
                                                <MetadataDropdown
                                                    tags={[]}
                                                    options={
                                                        Array.isArray(
                                                            isMultilevelSelect
                                                        )
                                                            ? isMultilevelSelect
                                                            : []
                                                    }
                                                    addedTagList={addedTagList}
                                                    index={i}
                                                    setAddedTagList={
                                                        setAddedTagList
                                                    }
                                                    setIsMultilevelSelect={
                                                        setIsMultilevelSelect
                                                    }
                                                    setMultiSelectValue={
                                                        setMultiSelectValue
                                                    }
                                                    isTagCategory={true}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                            {multiSelectValue != cat.value && (
                                <>
                                    <Button
                                        colorScheme='blue'
                                        size='sm'
                                        onClick={() => {
                                            setShowSelectedTags(true)
                                            onClickAdd(cat)
                                        }}
                                        variant='outline'
                                        className={styles.addButton}
                                        disabled={
                                            cat.selectedOptions &&
                                            cat.selectedOptions.length == 0 &&
                                            !(
                                                cat.label.toLowerCase() ===
                                                    'tech stacks' &&
                                                custom_tags.length > 0
                                            )
                                        }
                                    >
                                        Add
                                    </Button>
                                </>
                            )}
                            <CloseButton
                                className={styles.closeButton}
                                onClick={() => {
                                    const removedCategory = addedTagList[i]
                                    setAddedTagList((prev: AddedTag[]) =>
                                        prev?.filter((_, index) => index !== i)
                                    )
                                    setAddedCategories(
                                        prev =>
                                            prev?.filter(
                                                cat =>
                                                    cat.value !==
                                                    removedCategory.value
                                            ) // Remove from addedCategories
                                    )
                                    setCategoryTags(
                                        categoryTags?.filter(
                                            item => item.label != cat.label
                                        )
                                    )
                                }}
                            />
                        </div>
                        {matchedCategory?.selectedOptions &&
                            matchedCategory.selectedOptions.length > 0 &&
                            showSelectedTags && (
                                <div className={styles.tagsList}>
                                    <ul>
                                        {categoryTags
                                            ?.filter(
                                                item =>
                                                    item.label === cat?.label
                                            )?.[0]
                                            ?.selectedOptions?.map(
                                                (item, i) => {
                                                    return (
                                                        <li
                                                            className={
                                                                styles.tag
                                                            }
                                                            key={i}
                                                        >
                                                            <Tag.Root
                                                                colorScheme='blue'
                                                                variant='outline'
                                                                className={
                                                                    styles.showMore
                                                                }
                                                            >
                                                                <Tag.Label
                                                                    style={
                                                                        cat.label?.toLowerCase() ===
                                                                        'markets'
                                                                            ? {
                                                                                  display:
                                                                                      'flex',
                                                                                  gap: '8px'
                                                                              }
                                                                            : {}
                                                                    }
                                                                >
                                                                    {cat.label?.toLowerCase() ===
                                                                    'markets'
                                                                        ? item?.formattedLabel
                                                                        : item?.label}
                                                                </Tag.Label>
                                                                <Tag.EndElement>
                                                                    <Tag.CloseTrigger
                                                                        className={
                                                                            styles.tagCloseButton
                                                                        }
                                                                        onClick={() =>
                                                                            onClickClose(
                                                                                item.value,
                                                                                item.tag_category_nm ||
                                                                                    'Tech Stacks'
                                                                            )
                                                                        }
                                                                    />
                                                                </Tag.EndElement>
                                                            </Tag.Root>
                                                        </li>
                                                    )
                                                }
                                            )}
                                    </ul>
                                </div>
                            )}
                    </div>
                )
            })}
            {isConfirmationModalOpen && (
                <MetadataConfirmationDialog
                    isOpen={isConfirmationModalOpen}
                    closeDialog={() => {
                        handleConfirmationModal()
                        setErrorMessage('')
                    }}
                    message={errorMessage}
                    title={errorMessage && 'Something went wrong'}
                />
            )}
        </>
    )
}
