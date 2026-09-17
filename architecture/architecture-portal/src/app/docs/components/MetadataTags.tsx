/* istanbul ignore file */
'use client'
import { useContext, useEffect, useRef, useState } from 'react'
import styles from '@/app/docs/styles/metadata.module.css'
import { UserContext } from '@/context/UserContext'
import {
    getMetadataTags,
    getTechStackValues,
    getTechStackOptions
} from '@/app/docs/utils/client'
import { IconRecentPoints } from '@americanexpress/dls-icons'
import { Box, Button, Flex, Tag } from '@chakra-ui/react'
import Select, { components, CSSObjectWithLabel } from 'react-select'
import { useMetadataTags } from '@/app/docs/hooks'
import { MetadataCategory } from '@/app/docs/components/MetadataCategory'
import { MetadataDropdown } from '@/app/docs/components/MetadataDropdown'
import { MetadataConfirmationDialog } from '@/app/docs/components/MetadataConfirmationDialog'
import { SafeFlag } from '@/components/ui'
import { NoPrefetchLink } from '@/components/ui'

// Type definitions
interface Artifact {
    playbook_artifact_id: string | number
    artifact_nm: string
    lvl_no: number | string
    [key: string]: unknown
}

interface TagOption {
    label: string
    value: string | number
    tag_id?: string | number
    tag_nm?: string
    hasDelete?: boolean
    categoryId?: string | number
    __isNew__?: boolean
    [key: string]: unknown
}

interface Category {
    tag_category_nm: string
    tag_category_id: string | number
    [key: string]: unknown
}
interface AddedTag {
    label: string
    value: string | number
    options?: TagOption[]
    selectedOptions?: TagOption[]
    [key: string]: unknown
}

interface PendingAdd {
    label: string
    categoryId: string | number
}

interface TagDaItem {
    file_id: string
    tag_id: string | number
    [key: string]: unknown
}

interface FetchMetadataResponse {
    artifact_id?: string | number
    tag_da?: TagDaItem[]
    propogatedArtifacts?: Artifact[]
    [key: string]: unknown
}

interface RoleData {
    isMetadataEdit?: boolean
    isMetadataTag?: boolean
}

const formatUnderscoreString = (inputString: string): string => {
    const words = inputString.split('_')
    const formattedWords = words.map(
        word => word.charAt(0).toUpperCase() + word.slice(1)
    )
    return formattedWords.join(' ')
}

const MetadataTags = ({
    playbookId,
    fileId,
    artifact_id,
    setShowMetadata
}: {
    playbookId: string | number | undefined
    fileId: string | undefined
    artifact_id?: string
    setShowMetadata?: (val: boolean) => void
}) => {
    const [expandKeywords, setExpandKeywords] = useState<string>('')
    const [expandCategory, setExpandCategory] = useState<string>('')
    const [openAddTagsForm, setOpenAddTagsForm] = useState<
        Record<string, boolean>
    >({})
    const [selectedTags, setSelectedTags] = useState<
        Record<string, TagOption[]>
    >({})
    const [tagsList, setTagsList] = useState<TagOption[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [tags, setTags] = useState<Record<string, TagOption[]>>({})
    const [pendingAdd, setPendingAdd] = useState<PendingAdd | null>(null)
    const [metadata, setMetadata] = useState<(string | number)[]>([])
    const [techStack, setTechStack] = useState<string | TagOption | null>('')
    const [customTags, setCustomTags] = useState<TagOption[]>([])
    const [artifactId, setArtifactId] = useState<string | number | undefined>(
        undefined
    )
    const [propagatedArtifacts, setPropagatedArtifacts] = useState<Artifact[]>(
        []
    )
    const [canEdit, setCanEdit] = useState<boolean>(false)
    const [isMultilevelSelect, setIsMultilevelSelect] = useState<
        TagOption[] | false
    >(false)
    const [dropdownText, setDropdownText] = useState<string>(
        'Add a Metadata Type'
    )
    const [selectedEditCategory, setSelectedEditCategory] = useState<string>('')
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState<boolean>(false)
    const [removedTags, setRemovedTags] = useState<
        (string | number | undefined)[]
    >([])
    const [showCategoriesSection, setShowCategoriesSection] =
        useState<boolean>(false)
    const [addedNewTags, setAddedNewTags] = useState<TagOption[]>([])
    const [addedTagList, setAddedTagList] = useState<AddedTag[]>([])
    const [categoryTags, setCategoryTags] = useState<AddedTag[]>([])
    const [addedCategories, setAddedCategories] = useState<TagOption[]>([])
    const [selectedCategory, setSelectedCategory] = useState<TagOption[]>([])
    const [custom_tags, setCustom_tags] = useState<TagOption[]>([])
    const [actionQueue, setActionQueue] = useState<unknown[]>([])
    const processingRef = useRef<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [showMetadataSection, setShowMetadataSection] =
        useState<boolean>(false)
    const techStackList =
        addedNewTags?.length > 0
            ? addedNewTags?.map(item => item?.value)
            : categoryTags
                  ?.filter(
                      item => item?.label?.toLowerCase() === 'tech stacks'
                  )?.[0]
                  ?.selectedOptions?.map(item => item.value)

    const handleConfirmationModal = () => {
        setIsConfirmationModalOpen(!isConfirmationModalOpen)
        setDropdownText('Add a Metadata Type')
        setIsEditing(false)
    }

    const user = useContext(UserContext)

    const {
        fetchMetadataTagsPOST,
        fetchMetadataTagsGET,
        checkUserRole,
        setValidTagCategories,
        fetchMetadataFile
    } = useMetadataTags()

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

    const processQueue = async () => {
        processingRef.current = true
        try {
            const selectedTags = categoryTags.flatMap(
                item => item.selectedOptions || []
            )
            const metadataTags = [
                ...(metadata || []),
                ...(selectedTags?.map(item => item.value) || []),
                ...(addedNewTags?.map(item => item.value) || [])
            ]
            const categoryIds = categoryTags.map(item => item?.value)
            const selectedListTags = Object.keys(tags || {}).map(item =>
                item.toLowerCase()
            )
            const filteredList = categories
                .filter(item =>
                    selectedListTags?.includes(
                        item.tag_category_nm?.toLowerCase()
                    )
                )
                ?.map(item => item?.tag_category_id)

            const updatedCategoriesList = [
                ...categoryIds,
                ...filteredList
            ]?.filter(
                (item, index) =>
                    [...categoryIds, ...filteredList].indexOf(item) === index
            )
            const validArtifactPayload = {
                artifact_id: artifactId,
                valid_tag_category_ids: updatedCategoriesList,
                mail_id: user?.attributes?.email,
                playbook_id: playbookId,
                propagated_artifact_ids:
                    propagatedArtifacts?.map(
                        artifact => artifact.playbook_artifact_id
                    ) ?? [],
                fileMetadata: {
                    file_id: fileId,
                    tag_da: metadataTags?.filter(
                        item => !removedTags.includes(item)
                    ),
                    custom_tags: custom_tags
                }
            }
            const data = await setValidTagCategories(validArtifactPayload)
            if (!data) {
                setErrorMessage('Please try again later.')
            } else {
                const resp = data as FetchMetadataResponse
                // Map resp.tag_da to Tag[] structure expected by getMetadataTags
                const tagDaArray = Array.isArray(resp?.tag_da)
                    ? resp.tag_da.map(item => {
                          // Map all values to string | boolean | undefined for Tag compatibility
                          const tag: {
                              [key: string]: string | boolean | undefined
                          } = {}
                          for (const key in item) {
                              const value = item[key]
                              if (
                                  typeof value === 'string' ||
                                  typeof value === 'boolean' ||
                                  typeof value === 'undefined'
                              ) {
                                  tag[key] = value
                              } else if (typeof value === 'number') {
                                  tag[key] = value.toString()
                              } else {
                                  tag[key] = undefined
                              }
                          }
                          return tag
                      })
                    : []
                setTags(
                    getMetadataTags(
                        { ...resp, tag_da: tagDaArray },
                        fileId ?? ''
                    )
                )
                setMetadata(
                    (Array.isArray(resp?.tag_da) ? resp.tag_da : [])
                        .filter(item => item?.file_id === fileId)
                        .map(item => item?.tag_id)
                )
            }
            setAddedTagList([])
            setAddedCategories([])
            setCategoryTags([])
            handleConfirmationModal()
            setOpenAddTagsForm({})
            setRemovedTags([])
        } catch (error) {
            console.error(error)
            setAddedTagList([])
            setAddedCategories([])
            setCategoryTags([])
            handleConfirmationModal()
            setErrorMessage('Please try again later.')
        } finally {
            setActionQueue(q => q.slice(1))
            processingRef.current = false
        }
    }

    const fetchMetadata = () => {
        if (!fileId) return
        fetchMetadataFile(fileId)
            .then((data: unknown) => {
                const resp = data as FetchMetadataResponse
                setArtifactId(artifact_id)
                const tagDaArray = Array.isArray(resp?.tag_da)
                    ? resp.tag_da.map(item => {
                          const tag: {
                              [key: string]: string | boolean | undefined
                          } = {}
                          for (const key in item) {
                              const value = item[key]
                              if (
                                  typeof value === 'string' ||
                                  typeof value === 'boolean' ||
                                  typeof value === 'undefined'
                              ) {
                                  tag[key] = value
                              } else if (typeof value === 'number') {
                                  tag[key] = value.toString()
                              } else {
                                  tag[key] = undefined
                              }
                          }
                          return tag
                      })
                    : []
                setTags(
                    getMetadataTags(
                        { ...resp, tag_da: tagDaArray },
                        fileId ?? ''
                    )
                )

                const metaIdsFromResp: (string | number)[] = (
                    Array.isArray(resp?.tag_da) ? resp.tag_da : []
                )
                    .filter(item => item?.file_id === fileId)
                    .map(item => item?.tag_id)
                    .filter(
                        (id): id is string | number =>
                            typeof id === 'string' || typeof id === 'number'
                    )
                setMetadata(metaIdsFromResp)
                setPropagatedArtifacts(
                    Array.isArray(resp?.propogatedArtifacts)
                        ? resp.propogatedArtifacts
                        : []
                )
            })
            .catch(error => {
                console.error(error)
            })
    }

    const onChangeMultiSelect = (
        name: string,
        newValue: TagOption[],
        categoryId: string | number = ''
    ) => {
        setTagsList(tagsList.filter(item => !newValue?.includes(item)))
        const customTagsList = newValue
            ?.filter((item: TagOption) => item?.__isNew__)
            ?.map((item: TagOption) => ({
                ...item,
                label: `${item.label}`,
                value:
                    typeof techStack === 'object' && techStack !== null
                        ? techStack.label
                        : '',
                categoryId
            }))
        setSelectedTags({
            ...selectedTags,
            [name]: newValue?.filter((item: TagOption) => !item?.__isNew__)
        })
        setCustomTags(customTagsList)
    }

    const handleAdd = (category: string, categoryId: string | number) => {
        const filteredTags = selectedTags[category]?.map(item => {
            if (category?.toLocaleLowerCase() === 'tech stacks') {
                return {
                    ...item,
                    hasDelete: true,
                    tag_nm: item.label,
                    tag_category_id: categoryId
                }
            }
            return { ...item, hasDelete: true }
        })

        setAddedNewTags([...addedNewTags, ...filteredTags])
        setSelectedTags({})
        setTechStack('')
    }

    const handleRemove = (tagId: string | number) => {
        const filteredTags = [...removedTags, tagId]
        setRemovedTags(filteredTags)
        setAddedNewTags(addedNewTags?.filter(item => item?.value != tagId))
    }

    const handleChange = async (category: string, tagId = '') => {
        let metadataTags = metadata
        let isPropagatedCategory = false
        if (tagId) {
            metadataTags = metadataTags?.filter(tag => tag != tagId)
            if (tags[category]?.length == 1) {
                const validArtifactPayload = {
                    artifact_id: artifactId,
                    valid_tag_category_ids: [
                        tags[category][0]['tag_category_id']
                    ],
                    mail_id: user?.attributes?.email,
                    playbook_id: playbookId,
                    propagated_artifact_ids:
                        propagatedArtifacts?.map(
                            artifact => artifact.playbook_artifact_id
                        ) ?? []
                }
                await setValidTagCategories(validArtifactPayload)
            }
        } else {
            isPropagatedCategory =
                tags[category]?.filter(({ hasDelete }) => hasDelete)?.length ==
                0

            metadataTags = [
                ...(metadataTags || []),
                ...(addedNewTags?.map(item => item.value) || [])
            ]
        }
        const hasKeywordsData =
            Object.keys(tags || {})?.filter(
                item => item?.toLocaleLowerCase() == 'keywords'
            )?.length > 0
        if (
            isPropagatedCategory ||
            (!hasKeywordsData && category?.toLocaleLowerCase() === 'keywords')
        ) {
            const validArtifactPayload = {
                artifact_id: artifactId,
                valid_tag_category_ids: [addedNewTags?.[0]['tag_category_id']],
                mail_id: user?.attributes?.email,
                playbook_id: playbookId,
                propagated_artifact_ids:
                    propagatedArtifacts?.map(
                        artifact => artifact.playbook_artifact_id
                    ) ?? [],
                fileMetadata: {
                    file_id: fileId,
                    tag_da: metadataTags,
                    custom_tags: customTags?.map(item => ({
                        tag_nm: `${item.value}\\ ${item.label}`,
                        tag_category_id: item?.categoryId
                    }))
                }
            }
            const data = await setValidTagCategories(validArtifactPayload)
            if (!data) {
                setErrorMessage('Please try again later.')
            } else {
                setTags(getMetadataTags(data, fileId ?? ''))
                type TagDaLike = { file_id?: string; tag_id?: string | number }
                const tagDaArr: TagDaLike[] =
                    typeof data === 'object' &&
                    data !== null &&
                    'tag_da' in data &&
                    Array.isArray((data as { tag_da?: unknown }).tag_da)
                        ? (data as { tag_da: unknown[] }).tag_da.filter(
                              (item): item is TagDaLike =>
                                  typeof item === 'object' &&
                                  item !== null &&
                                  'file_id' in item &&
                                  'tag_id' in item
                          )
                        : []
                setMetadata(
                    tagDaArr
                        .filter(item => item.file_id === fileId)
                        .map(item => item.tag_id as string | number)
                )
            }

            setSelectedTags({})
            setCustomTags([])
            if (!tagId) {
                setOpenAddTagsForm({
                    [`${category}-add-new`]: false
                })
            }
            handleConfirmationModal()
        } else {
            processQueue()
        }
    }

    useEffect(() => {
        if (pendingAdd) {
            const { label, categoryId } = pendingAdd
            fetchMetadataTagsGET(categoryId)
                .then(res => {
                    const metadataTags =
                        tags?.[label]?.map(item => item?.tag_id) || []
                    const arr = Array.isArray(res) ? res : []
                    const data = arr
                        .map(item => ({
                            label: item?.tag_nm,
                            value: item?.tag_id,
                            ...item
                        }))
                        .filter(item => !metadataTags?.includes(item?.value))

                    setTagsList(data)
                })
                .catch(error => {
                    console.error(error)
                })
            setTechStack('')
            setSelectedTags({})
            setCustomTags([])
            setOpenAddTagsForm({
                [`${label}-add-new`]: true
            })
            setPendingAdd(null)
        }
    }, [pendingAdd, fetchMetadataTagsGET, tags])

    useEffect(() => {
        if (playbookId && user?.attributes?.email) {
            const payload = {
                mail_id: user?.attributes?.email,
                playbook_id: playbookId,
                file_id: fileId
            }
            fetchMetadataTagsPOST(payload)
                .then(data => {
                    setCategories(data as Category[])
                    // Only proceed if categories are populated and fileId is truthy
                    if ((Array.isArray(data) && data.length === 0) || !fileId) {
                        setTags({ Keywords: [] })
                    }
                    checkUserRole({
                        mail_id: user?.attributes?.email,
                        playbookId,
                        artifactId: artifact_id
                    })
                        .then(data => {
                            const roleData = data as RoleData
                            fetchMetadata()
                            setCanEdit(roleData?.isMetadataEdit || false)
                            setShowMetadataSection(
                                roleData?.isMetadataTag || false
                            )
                            setShowMetadata?.(roleData?.isMetadataTag || false)
                        })
                        .catch(error => {
                            console.error('Role API error:', error)
                        })
                })
                .catch(error => {
                    console.error(error)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const filteredCategories = categories?.filter(
        item => item?.tag_category_nm?.toLowerCase() != 'keywords'
    )

    const handleKeywordSave = (category: string) => {
        setTechStack('')
        handleChange(category)
        setSelectedEditCategory('')
    }

    const editTagListData = () =>
        Object.keys(tags || {})
            ?.filter(item => item?.toLocaleLowerCase() != 'keywords')
            ?.sort((a, b) => a?.localeCompare(b))
            ?.concat(
                Object.keys(tags || {})?.filter(
                    item => item?.toLocaleLowerCase() == 'keywords'
                )?.length > 0
                    ? Object.keys(tags || {})?.filter(
                          item => item?.toLocaleLowerCase() == 'keywords'
                      )
                    : ['Keywords']
            )
            ?.filter(
                item =>
                    item?.toLocaleLowerCase() ===
                    selectedEditCategory?.toLocaleLowerCase()
            )
            ?.map((category, key) => {
                let len = 0
                let isVisibleShowMore = false
                const label = formatUnderscoreString(category)
                const categoryId: string | number = tags[category]?.[0]
                    ?.tag_category_id as string | number
                const isSaveButtonDisabled =
                    (!selectedTags[label] ||
                        selectedTags[label]?.length === 0) &&
                    (category.toLowerCase() != 'tech stacks' ||
                        customTags?.length === 0)
                const addedTagsIds = addedNewTags?.map(item => item?.tag_id)

                return (
                    <div className={styles.tagsContainer} key={key}>
                        {openAddTagsForm[`${label}-add-new`] && (
                            <div className={styles.formContainer}>
                                {category?.toLocaleLowerCase() ===
                                'tech stacks' ? (
                                    <div className={styles.techStackMetadata}>
                                        <Select
                                            className={styles.selectField}
                                            isClearable={true}
                                            placeholder='Select Tech Category...'
                                            options={
                                                getTechStackOptions(tagsList)
                                                    ?.dataStack
                                            }
                                            styles={selectStyles}
                                            value={techStack}
                                            onChange={a => {
                                                setCustomTags([])
                                                setSelectedTags({})
                                                setTechStack(a)
                                            }}
                                        />
                                        <Select
                                            isMulti
                                            className={styles.selectField}
                                            placeholder='Select Technology...'
                                            options={getTechStackValues(
                                                techStack === null
                                                    ? ''
                                                    : techStack,
                                                tagsList
                                                    ?.filter(
                                                        item =>
                                                            item?.tag_id !==
                                                                undefined &&
                                                            !techStackList?.includes(
                                                                item?.tag_id
                                                            )
                                                    )
                                                    .map(item => ({
                                                        label: String(
                                                            item.label
                                                        ),
                                                        value: String(
                                                            item.value
                                                        )
                                                    }))
                                            )}
                                            value={
                                                selectedTags?.[category]
                                                    ?.length > 0
                                                    ? [
                                                          ...selectedTags[
                                                              category
                                                          ],
                                                          ...customTags
                                                      ]
                                                    : customTags
                                            }
                                            styles={selectStyles}
                                            onChange={a => {
                                                onChangeMultiSelect(
                                                    label,
                                                    [...a],
                                                    categoryId !== undefined
                                                        ? String(categoryId)
                                                        : undefined
                                                )
                                            }}
                                            filterOption={(options, value) => {
                                                if (!techStack) return false
                                                return options.label
                                                    .toLowerCase()
                                                    .includes(
                                                        value.toLowerCase()
                                                    )
                                            }}
                                            components={{
                                                Option: props => {
                                                    if (
                                                        props?.data?.__isNew__
                                                    ) {
                                                        return (
                                                            <div
                                                                className={
                                                                    styles.techStackData
                                                                }
                                                            >
                                                                <span>
                                                                    {
                                                                        props
                                                                            ?.data
                                                                            ?.value
                                                                    }
                                                                </span>
                                                                <button
                                                                    onClick={e => {
                                                                        e.stopPropagation()
                                                                        props?.selectOption(
                                                                            props.data
                                                                        )
                                                                    }}
                                                                    className={
                                                                        styles.techStackAddButton
                                                                    }
                                                                >
                                                                    Add
                                                                </button>
                                                            </div>
                                                        )
                                                    }
                                                    return (
                                                        <components.Option
                                                            {...props}
                                                        />
                                                    )
                                                }
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        {isMultilevelSelect ? (
                                            <MetadataDropdown
                                                options={
                                                    Array.isArray(
                                                        isMultilevelSelect
                                                    )
                                                        ? isMultilevelSelect
                                                        : []
                                                }
                                                addedTagList={selectedTags}
                                                index={category}
                                                setAddedTagList={
                                                    setSelectedTags
                                                }
                                                setIsMultilevelSelect={(
                                                    val: boolean
                                                ) => {
                                                    if (val === false) {
                                                        setIsMultilevelSelect(
                                                            false
                                                        )
                                                    }
                                                }}
                                                setMultiSelectValue={() => {}}
                                                tags={(
                                                    tags[category] || []
                                                ).map(t => ({
                                                    ...t,
                                                    tag_nm: t.tag_nm ?? ''
                                                }))}
                                            />
                                        ) : (
                                            <Select
                                                isMulti
                                                placeholder={
                                                    dropdownText ===
                                                    'Categories'
                                                        ? `Select ${category}...`
                                                        : dropdownText !=
                                                            'Propagated Artifacts'
                                                          ? `Select ${dropdownText}...`
                                                          : 'Select Artifacts...'
                                                }
                                                options={
                                                    category?.toLowerCase() ===
                                                    'markets'
                                                        ? tagsList
                                                              ?.filter(
                                                                  item =>
                                                                      !addedTagsIds?.includes(
                                                                          item?.tag_id
                                                                      )
                                                              )
                                                              ?.map(option => {
                                                                  const flagCode =
                                                                      typeof option.add_da ===
                                                                      'string'
                                                                          ? JSON.parse(
                                                                                option.add_da
                                                                            )
                                                                                .code
                                                                          : null
                                                                  return {
                                                                      ...option,
                                                                      label:
                                                                          option.tag_nm ??
                                                                          '',
                                                                      value:
                                                                          option.tag_id ??
                                                                          '',
                                                                      flagCode
                                                                  }
                                                              })
                                                              .sort((a, b) =>
                                                                  (
                                                                      a.label ??
                                                                      ''
                                                                  ).localeCompare(
                                                                      b.label ??
                                                                          ''
                                                                  )
                                                              )
                                                        : tagsList
                                                              ?.filter(
                                                                  item =>
                                                                      !addedTagsIds?.includes(
                                                                          item?.tag_id
                                                                      )
                                                              )
                                                              ?.map(option => {
                                                                  const flagCode =
                                                                      typeof option.add_da ===
                                                                      'string'
                                                                          ? JSON.parse(
                                                                                option.add_da
                                                                            )
                                                                                .code
                                                                          : null
                                                                  return {
                                                                      ...option,
                                                                      label:
                                                                          option.tag_nm ??
                                                                          '',
                                                                      value:
                                                                          option.tag_id ??
                                                                          '',
                                                                      flagCode
                                                                  }
                                                              })
                                                }
                                                formatOptionLabel={option =>
                                                    category?.toLowerCase() ===
                                                    'markets' ? (
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center'
                                                            }}
                                                        >
                                                            {option.flagCode ? (
                                                                <SafeFlag
                                                                    code={
                                                                        typeof option.flagCode ===
                                                                        'string'
                                                                            ? option.flagCode
                                                                            : ''
                                                                    }
                                                                    alt={
                                                                        option.label
                                                                    }
                                                                />
                                                            ) : (
                                                                <span>
                                                                    {' '}
                                                                    {
                                                                        option.label
                                                                    }
                                                                </span>
                                                            )}
                                                            <span
                                                                className={
                                                                    styles.flagAlignList
                                                                }
                                                            >
                                                                {option.label}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        option.label
                                                    )
                                                }
                                                value={
                                                    selectedTags[category] || []
                                                }
                                                styles={selectStyles}
                                                onChange={(a, e) => {
                                                    if (
                                                        e.action ===
                                                        'remove-value'
                                                    ) {
                                                        setSelectedTags({
                                                            ...selectedTags,
                                                            [category]:
                                                                Array.isArray(a)
                                                                    ? a
                                                                    : []
                                                        })
                                                    }
                                                    const last =
                                                        a[a?.length - 1]
                                                    if (
                                                        Array.isArray(
                                                            last?.children
                                                        ) &&
                                                        last.children.length >
                                                            0 &&
                                                        e.action !==
                                                            'remove-value'
                                                    ) {
                                                        setIsMultilevelSelect([
                                                            last
                                                        ])
                                                    } else {
                                                        onChangeMultiSelect(
                                                            label,
                                                            [...a]
                                                        )
                                                    }
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                                <Button
                                    colorScheme='blue'
                                    size='sm'
                                    onClick={() => {
                                        handleAdd(category, categoryId)
                                    }}
                                    variant='outline'
                                    className={styles.addButton}
                                    disabled={isSaveButtonDisabled}
                                >
                                    Add
                                </Button>
                            </div>
                        )}
                        <div className={styles.tagsListEditable}>
                            <ul>
                                {tags[category]
                                    ?.filter(
                                        item =>
                                            item?.hasDelete &&
                                            !removedTags.includes(item?.tag_id)
                                    )
                                    ?.sort((a, b) =>
                                        (a?.tag_nm ?? '').localeCompare(
                                            b?.tag_nm ?? ''
                                        )
                                    )
                                    ?.concat(
                                        tags[category]
                                            ?.filter(item => !item?.hasDelete)
                                            ?.sort((a, b) =>
                                                (a?.tag_nm ?? '').localeCompare(
                                                    b?.tag_nm ?? ''
                                                )
                                            )
                                    )
                                    ?.concat(
                                        addedNewTags?.length > 0
                                            ? addedNewTags
                                            : []
                                    )
                                    ?.map((tag, i) => {
                                        len += tag?.tag_nm?.length ?? 0

                                        if (
                                            len > 53 &&
                                            expandKeywords != category
                                        ) {
                                            if (!isVisibleShowMore) {
                                                isVisibleShowMore = true
                                                return (
                                                    <div
                                                        className={
                                                            styles.showTags
                                                        }
                                                        key={i}
                                                    >
                                                        <Tag.Root
                                                            variant='outline'
                                                            className={
                                                                styles.showMore
                                                            }
                                                            onClick={() =>
                                                                setExpandKeywords(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            <Tag.Label
                                                                p={1}
                                                                title={label}
                                                                className={
                                                                    styles.tagsButton
                                                                }
                                                            >
                                                                {`+${tags[category]?.length + addedNewTags?.length - removedTags?.length - i} More`}
                                                            </Tag.Label>
                                                        </Tag.Root>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }

                                        const tagDesc = tag?.add_da
                                            ? typeof tag.add_da === 'string'
                                                ? JSON.parse(tag.add_da)
                                                : {}
                                            : {}
                                        const flagCode = tagDesc?.code || null

                                        return (
                                            <li
                                                key={`${tag?.tag_id}-${i}`}
                                                className={styles.editableTag}
                                            >
                                                <Tag.Root
                                                    variant='outline'
                                                    className={
                                                        styles.metadataTagsListFlag
                                                    }
                                                    _dark={{
                                                        bg: 'rgba(255, 255, 255, 0.1)'
                                                    }}
                                                >
                                                    {!tag?.hasDelete && (
                                                        <IconRecentPoints
                                                            isFilled={true}
                                                            title='Recent Points'
                                                            titleId='icon-recent-points'
                                                            className={`icon-blue-color ${styles.globalIcon}`}
                                                            size='sm'
                                                        />
                                                    )}
                                                    <Tag.Label
                                                        p={1}
                                                        title={tag?.tag_nm?.replace(
                                                            '\\',
                                                            ''
                                                        )}
                                                        className={
                                                            styles.tagLabel
                                                        }
                                                    >
                                                        {category?.toLowerCase() ===
                                                        'tech stacks' ? (
                                                            <>
                                                                {
                                                                    tag?.tag_nm?.split(
                                                                        '\\'
                                                                    )?.[0]
                                                                }
                                                                <b
                                                                    className={
                                                                        styles.techStackLabel
                                                                    }
                                                                >
                                                                    {
                                                                        tag?.tag_nm?.split(
                                                                            '\\'
                                                                        )?.[1]
                                                                    }
                                                                </b>
                                                            </>
                                                        ) : category?.toLowerCase() ===
                                                              'markets' &&
                                                          flagCode ? (
                                                            <>
                                                                <SafeFlag
                                                                    code={
                                                                        flagCode
                                                                    }
                                                                    alt={
                                                                        tag?.tag_nm ||
                                                                        'flag'
                                                                    }
                                                                />
                                                                <span
                                                                    className={
                                                                        styles.flagAlignEditable
                                                                    }
                                                                >
                                                                    {
                                                                        tag?.tag_nm
                                                                    }
                                                                </span>
                                                            </>
                                                        ) : (
                                                            tag?.tag_nm
                                                        )}
                                                    </Tag.Label>
                                                    {tag?.hasDelete &&
                                                        canEdit && (
                                                            <Tag.EndElement>
                                                                <Tag.CloseTrigger
                                                                    className={
                                                                        styles.tagCloseButton
                                                                    }
                                                                    onClick={() =>
                                                                        handleRemove(
                                                                            tag?.tag_id
                                                                                ? tag?.tag_id
                                                                                : tag?.value
                                                                        )
                                                                    }
                                                                />
                                                            </Tag.EndElement>
                                                        )}
                                                </Tag.Root>
                                            </li>
                                        )
                                    })}
                                {expandKeywords == category && (
                                    <div className={styles.showTags}>
                                        <Tag.Root
                                            variant='outline'
                                            className={styles.showMore}
                                            onClick={e => {
                                                e.stopPropagation()
                                                setExpandKeywords('')
                                            }}
                                        >
                                            <Tag.Label
                                                p={1}
                                                title={label}
                                                className={styles.tagsButton}
                                            >
                                                Show Less
                                            </Tag.Label>
                                        </Tag.Root>
                                    </div>
                                )}
                            </ul>
                        </div>
                        {addedTagList?.length === 0 && (
                            <div className={styles.keywordBtnGroup}>
                                <Button
                                    className={styles.saveButton}
                                    colorScheme='blue'
                                    disabled={
                                        (removedTags?.length ?? 0) === 0 &&
                                        (addedNewTags?.length ?? 0) === 0
                                    }
                                    variant='solid'
                                    onClick={() => {
                                        handleKeywordSave(category)
                                        setShowCategoriesSection(false)
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowCategoriesSection(false)
                                        setTechStack('')
                                        setCustomTags([])
                                        setSelectedTags({})
                                        setRemovedTags([])
                                        setAddedNewTags([])
                                        setOpenAddTagsForm({
                                            [`${label}-add-new`]: false
                                        })
                                        setSelectedEditCategory('')
                                        setIsEditing(false)
                                    }}
                                    colorScheme='blue'
                                    variant='outline'
                                    className={styles.button}
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                )
            })

    const showTagListData = () =>
        Object.keys(tags || {})
            ?.filter(item => {
                const lower = item?.toLocaleLowerCase()
                // Hide both 'business capabilities' and 'keywords' categories
                if (lower === 'business capabilities' || lower === 'keywords')
                    return false
                return tags[item]?.length > 0
            })
            ?.sort((a, b) => a?.localeCompare(b))
            ?.map((category, key) => {
                let len = 0
                let isVisibleShowMore = false
                const label = formatUnderscoreString(category)
                const isMarkets = category?.toLowerCase() === 'markets'
                const categoryId: string | number = tags[category]?.[0]
                    ?.tag_category_id as string | number

                return (
                    <div className={styles.tagsContainer} key={key}>
                        <div>
                            <Tag.Root
                                variant='surface'
                                className={styles.metadataCategory}
                            >
                                <Tag.Label
                                    p={1}
                                    title={label}
                                    className={styles.tagLabel}
                                    _dark={{ color: 'white' }}
                                >
                                    {`${label}`}
                                </Tag.Label>
                            </Tag.Root>
                        </div>
                        <div className={styles.tagsList}>
                            <ul>
                                {tags[category]
                                    ?.filter(item => item?.hasDelete)
                                    ?.sort((a, b) =>
                                        (a?.tag_nm ?? '').localeCompare(
                                            b?.tag_nm ?? ''
                                        )
                                    )
                                    ?.concat(
                                        tags[category]
                                            ?.filter(item => !item?.hasDelete)
                                            ?.sort((a, b) =>
                                                (a?.tag_nm ?? '').localeCompare(
                                                    b?.tag_nm ?? ''
                                                )
                                            )
                                    )
                                    ?.map((tag, i) => {
                                        if (isMarkets) {
                                            return null
                                        }
                                        len += tag?.tag_nm?.length ?? 0

                                        if (
                                            len > 53 &&
                                            expandCategory != category
                                        ) {
                                            if (!isVisibleShowMore) {
                                                isVisibleShowMore = true
                                                return (
                                                    <div
                                                        className={
                                                            styles.showTags
                                                        }
                                                        key={i}
                                                    >
                                                        <Tag.Root
                                                            variant='outline'
                                                            className={
                                                                styles.showMore
                                                            }
                                                            onClick={() =>
                                                                setExpandCategory(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            <Tag.Label
                                                                p={1}
                                                                title={label}
                                                                className={
                                                                    styles.tagsButton
                                                                }
                                                            >
                                                                {`+${tags[category]?.length - i} More`}
                                                            </Tag.Label>
                                                        </Tag.Root>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }

                                        return (
                                            <li
                                                key={tag.tag_id}
                                                className={styles.editableTag}
                                            >
                                                <Tag.Root
                                                    variant='outline'
                                                    className={
                                                        styles.metadataTagsList
                                                    }
                                                    _dark={{
                                                        bg: 'rgba(255, 255, 255, 0.1)'
                                                    }}
                                                >
                                                    {!tag.hasDelete && (
                                                        <IconRecentPoints
                                                            isFilled={true}
                                                            title='Recent Points'
                                                            titleId='icon-recent-point'
                                                            className={`icon-blue-color ${styles.globalIcon}`}
                                                            size='sm'
                                                        />
                                                    )}
                                                    <Tag.Label
                                                        p={1}
                                                        title={tag?.tag_nm?.replace(
                                                            '\\',
                                                            ''
                                                        )}
                                                        className={
                                                            styles.tagLabel
                                                        }
                                                    >
                                                        {category?.toLocaleLowerCase() ===
                                                        'tech stacks' ? (
                                                            !tag.hasDelete ? (
                                                                <NoPrefetchLink
                                                                    href={
                                                                        Array.isArray(
                                                                            tag.file_id
                                                                        )
                                                                            ? tag
                                                                                  .file_id[0]
                                                                            : tag.file_id
                                                                    }
                                                                    target='_blank'
                                                                    rel='noopener noreferrer'
                                                                >
                                                                    <>
                                                                        {
                                                                            tag.tag_nm?.split(
                                                                                '\\'
                                                                            )?.[0]
                                                                        }
                                                                        <b
                                                                            className={
                                                                                styles.techStackLabel
                                                                            }
                                                                        >
                                                                            {
                                                                                tag.tag_nm?.split(
                                                                                    '\\'
                                                                                )?.[1]
                                                                            }
                                                                        </b>
                                                                    </>
                                                                </NoPrefetchLink>
                                                            ) : (
                                                                <>
                                                                    {
                                                                        tag.tag_nm?.split(
                                                                            '\\'
                                                                        )?.[0]
                                                                    }
                                                                    <b
                                                                        className={
                                                                            styles.techStackLabel
                                                                        }
                                                                    >
                                                                        {
                                                                            tag.tag_nm?.split(
                                                                                '\\'
                                                                            )?.[1]
                                                                        }
                                                                    </b>
                                                                </>
                                                            )
                                                        ) : !tag.hasDelete ? (
                                                            <NoPrefetchLink
                                                                href={`${tag.file_id}`}
                                                                target='_blank'
                                                                rel='noopener noreferrer'
                                                            >
                                                                {tag.tag_nm}
                                                            </NoPrefetchLink>
                                                        ) : (
                                                            tag.tag_nm
                                                        )}
                                                    </Tag.Label>
                                                </Tag.Root>
                                            </li>
                                        )
                                    })}
                                {isMarkets &&
                                    tags[category]?.map((tag, index) => {
                                        const tagDesc =
                                            typeof tag?.add_da === 'string'
                                                ? JSON.parse(tag.add_da)
                                                : {}
                                        const code = tagDesc?.code || undefined
                                        len += tag?.tag_nm?.length ?? 0
                                        if (
                                            len > 53 &&
                                            expandCategory !== category
                                        ) {
                                            if (!isVisibleShowMore) {
                                                isVisibleShowMore = true
                                                return (
                                                    <div
                                                        className={
                                                            styles.showTags
                                                        }
                                                        key={`show-more-${index}`}
                                                    >
                                                        <Tag.Root
                                                            colorScheme='blue'
                                                            variant='outline'
                                                            className={
                                                                styles.showMore
                                                            }
                                                            onClick={() =>
                                                                setExpandCategory(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            <Tag.Label
                                                                p={1}
                                                                title={label}
                                                                className={
                                                                    styles.tagsButton
                                                                }
                                                            >
                                                                {`+${tags[category]?.length - index} More`}
                                                            </Tag.Label>
                                                        </Tag.Root>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }
                                        return (
                                            <li
                                                key={index}
                                                className={styles.tag}
                                            >
                                                <Tag.Root
                                                    variant='outline'
                                                    className={
                                                        styles.metadataTagsListFlag
                                                    }
                                                    _dark={{
                                                        bg: 'rgba(255, 255, 255, 0.1)'
                                                    }}
                                                >
                                                    {code ? (
                                                        <>
                                                            <SafeFlag
                                                                code={code}
                                                                alt={
                                                                    tag?.tag_nm ||
                                                                    'flag'
                                                                }
                                                            />
                                                            <span
                                                                className={
                                                                    styles.flagAlign
                                                                }
                                                            >
                                                                {tag?.tag_nm}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span>
                                                            {tag?.tag_nm}
                                                        </span>
                                                    )}
                                                </Tag.Root>
                                            </li>
                                        )
                                    })}
                                {expandCategory == category && (
                                    <div className={styles.showTags}>
                                        <Tag.Root
                                            colorScheme='blue'
                                            variant='outline'
                                            className={styles.showMore}
                                            onClick={e => {
                                                e.stopPropagation()
                                                setExpandCategory('')
                                            }}
                                        >
                                            <Tag.Label
                                                p={1}
                                                title={label}
                                                className={styles.tagsButton}
                                            >
                                                Show Less
                                            </Tag.Label>
                                        </Tag.Root>
                                    </div>
                                )}
                                {!openAddTagsForm?.[`${label}-add-new`] &&
                                    canEdit &&
                                    label !== 'Keywords' && (
                                        <Button
                                            title={`Edit ${category}`}
                                            className={`${styles.editKeywords} ${
                                                category?.toLowerCase() ===
                                                'markets'
                                                    ? styles.marketsMargin
                                                    : ''
                                            }`}
                                            size='sm'
                                            variant='plain'
                                            onClick={() => {
                                                setRemovedTags([])
                                                setAddedNewTags([])
                                                setPendingAdd({
                                                    label,
                                                    categoryId: categoryId
                                                })
                                                setSelectedEditCategory(label)
                                                setShowCategoriesSection(true)
                                                setIsEditing(true)
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    )}
                            </ul>
                        </div>
                    </div>
                )
            })

    // Wrapper for setCustom_tags to match AddTagCategory's expected signature
    const handleSetCustomTags = (
        tags: { tag_nm: string; tag_category_id: string | number }[]
    ) => {
        setCustom_tags(
            tags.map(tag => ({
                ...tag,
                label: tag.tag_nm,
                value: tag.tag_category_id
            }))
        )
    }

    return (
        <>
            {showMetadataSection && (
                <div>
                    <span className={styles.heading}>Metadata Tags</span>
                    <div>
                        <div className={styles.metadataUpperSection}>
                            <div className={styles.metadataLabels}>
                                <IconRecentPoints
                                    isFilled={true}
                                    title='Recent Points'
                                    titleId='icon-recent-points'
                                    className='icon-blue-color'
                                    id={styles.recentPointsIcon}
                                    size='xs'
                                />
                                <span className={styles.metadataLabelsText}>
                                    = Originated from another artifact
                                </span>
                            </div>
                            {canEdit && (
                                <div className={styles.metadataDropdown}>
                                    <Button
                                        className={
                                            styles.metadataDropdownButton
                                        }
                                        onClick={() => {
                                            setShowCategoriesSection(true)
                                            setAddedCategories([])
                                            setAddedTagList([])
                                            setSelectedEditCategory('')
                                            setIsEditing(false)
                                        }}
                                        disabled={isEditing}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            )}
                        </div>
                        {showCategoriesSection ? (
                            <Box
                                className={styles.metadataContent}
                                bg={{ _dark: '#333333' }}
                            >
                                <MetadataCategory
                                    categories={filteredCategories}
                                    tags={tags}
                                    canEdit={canEdit}
                                    setShowCategoriesSection={
                                        setShowCategoriesSection
                                    }
                                    isConfirmationModalOpen={
                                        isConfirmationModalOpen
                                    }
                                    handleConfirmationModal={
                                        handleConfirmationModal
                                    }
                                    setOpenAddTagsForm={setOpenAddTagsForm}
                                    addedTagList={addedTagList}
                                    setAddedTagList={setAddedTagList}
                                    categoryTags={categoryTags}
                                    setCategoryTags={setCategoryTags}
                                    processQueue={processQueue}
                                    addedCategories={addedCategories}
                                    setAddedCategories={setAddedCategories}
                                    selectedCategory={selectedCategory}
                                    setSelectedCategory={setSelectedCategory}
                                    custom_tags={custom_tags}
                                    setCustom_tags={handleSetCustomTags}
                                    actionQueue={actionQueue}
                                    errorMessage={errorMessage}
                                    setErrorMessage={setErrorMessage}
                                    techStackList={techStackList}
                                    isEditing={isEditing}
                                />
                                {editTagListData()}
                                {addedTagList?.length > 0 && (
                                    <Flex mb={4} mt={8}>
                                        <Button
                                            colorScheme='blue'
                                            size='sm'
                                            onClick={e => {
                                                e.preventDefault()
                                                processQueue()
                                            }}
                                            variant='solid'
                                            className={
                                                styles.saveCategoryButton
                                            }
                                            disabled={
                                                !(
                                                    categoryTags.flatMap(
                                                        item =>
                                                            item.selectedOptions
                                                    )?.length > 0
                                                ) &&
                                                (removedTags?.length ?? 0) ===
                                                    0 &&
                                                (addedNewTags?.length ?? 0) ===
                                                    0
                                            }
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            colorScheme='blue'
                                            size='sm'
                                            variant='outline'
                                            className={styles.cancelButton}
                                            onClick={() => {
                                                setAddedCategories([])
                                                setCategoryTags([])
                                                setAddedTagList([])
                                                setSelectedCategory([])
                                                setOpenAddTagsForm({})
                                                setShowCategoriesSection(false)
                                                setIsEditing(false)
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Flex>
                                )}
                            </Box>
                        ) : null}
                        <div>{showTagListData()}</div>
                    </div>
                </div>
            )}
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

export default MetadataTags
