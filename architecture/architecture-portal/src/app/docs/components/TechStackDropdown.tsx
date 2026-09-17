/* istanbul ignore file */
import React, { useEffect, useState } from 'react'
import styles from '@/app/docs/styles/metadata.module.css'
import {
    getTechStackValues,
    getTechStackOptions
} from '@/app/docs/utils/client'
import Select, { components, CSSObjectWithLabel } from 'react-select'
import { Dispatch, SetStateAction } from 'react'

const selectStyles = {
    multiValue: (base: CSSObjectWithLabel) => {
        return {
            ...base,
            backgroundColor: 'white',
            color: '#b80606ff',
            border: '1px solid #006fcf',
            'border-radius': '5px'
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

interface TagOption {
    label: string
    value: string | number
    tag_id?: string | number
    tag_nm?: string
    __isNew__?: boolean
    [key: string]: unknown
}

interface TechStackDropdownProps {
    cat: {
        options: TagOption[]
        value: string | number
        [key: string]: unknown
    }
    index: number
    // setAddedTagList: (list: { selectedOptions?: TagOption[] }[]) => void
    setAddedTagList: Dispatch<
        SetStateAction<
            {
                label: string
                value: string | number
                options?: TagOption[]
                selectedOptions?: TagOption[]
            }[]
        >
    >
    // addedTagList: { selectedOptions?: TagOption[] }[]
    addedTagList: {
        label: string
        value: string | number
        options?: TagOption[]
        selectedOptions?: TagOption[]
    }[]
    setCustom_tags: (
        tags: { tag_nm: string; tag_category_id: string | number }[]
    ) => void
    techStack: string | TagOption | undefined
    setTechStack: React.Dispatch<
        React.SetStateAction<string | TagOption | undefined>
    >
    propagatedTagsList: TagOption[]
    techStackList?: (string | number)[]
}

export const TechStackDropdown = ({
    cat,
    index,
    setAddedTagList,
    addedTagList,
    setCustom_tags,
    techStack,
    setTechStack,
    propagatedTagsList,
    techStackList
}: TechStackDropdownProps) => {
    const [customTags, setCustomTags] = useState<TagOption[]>([])
    const [selectedTags, setSelectedTags] = useState<
        Record<string | number, TagOption[]>
    >({})
    const propagatedTagsListIds =
        propagatedTagsList?.map(item => item?.tag_id) || []
    const options = cat.options
        ?.filter(
            item =>
                !propagatedTagsListIds?.includes(item?.tag_id) &&
                item?.tag_id !== undefined &&
                !techStackList?.includes(item.tag_id)
        )
        ?.map(cat => ({
            label: cat.tag_nm as string,
            value: cat.tag_id as string | number
        }))

    useEffect(() => {
        if (
            techStack &&
            typeof techStack === 'object' &&
            selectedTags &&
            selectedTags[techStack.value]?.length > 0
        ) {
            addedTagList[index].selectedOptions = selectedTags[techStack.value]
            setAddedTagList([...addedTagList])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTags])

    useEffect(() => {
        setCustom_tags(
            customTags?.map(item => ({
                tag_nm: `${item.value}\\ ${item.label}`,
                tag_category_id: cat?.value
            }))
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customTags])

    const onChangeMultiSelect = (
        name: string | number,
        newValue: TagOption[] = [],
        categoryId: string | number = ''
    ) => {
        const customTagsList = newValue
            ?.filter(item => item?.__isNew__)
            ?.map(item => ({
                ...item,
                ...{
                    label: `${item.label}`,
                    value:
                        techStack && typeof techStack !== 'string'
                            ? techStack.label
                            : '',
                    categoryId
                }
            }))
        setSelectedTags({
            ...selectedTags,
            [name]: newValue?.filter(item => !item?.__isNew__)
        })
        setCustomTags(customTagsList)
    }

    return (
        <div className={styles.techStackSelectFields}>
            <Select
                className={styles.selectField}
                isClearable={true}
                placeholder='Select Tech Category...'
                options={getTechStackOptions(options)?.dataStack.map(opt => ({
                    ...opt,
                    value: String(opt.value)
                }))}
                styles={selectStyles}
                value={techStack}
                onChange={a => {
                    setCustomTags([])
                    setSelectedTags({})
                    setTechStack(a ?? '')
                }}
            />
            <Select
                isMulti
                className={styles.selectField}
                placeholder='Select Technology...'
                options={getTechStackValues(
                    techStack,
                    options.map(opt => ({ ...opt, value: String(opt.value) }))
                ).map(opt => ({
                    ...opt,
                    value: String(opt.value)
                }))}
                value={
                    typeof techStack === 'object' &&
                    techStack !== null &&
                    selectedTags?.[techStack.value]?.length > 0
                        ? [...selectedTags[techStack.value], ...customTags]
                        : customTags
                }
                styles={selectStyles}
                onChange={a => {
                    onChangeMultiSelect(
                        typeof techStack === 'object' && techStack !== null
                            ? techStack.value
                            : '',
                        [...a],
                        cat.value
                    )
                }}
                filterOption={(options, value) => {
                    if (
                        !(
                            typeof techStack === 'object' &&
                            techStack !== null &&
                            techStack.value
                        )
                    )
                        return false
                    return options.label
                        .toLowerCase()
                        .includes(value.toLowerCase())
                }}
                components={{
                    Option: props => {
                        if (props?.data?.__isNew__) {
                            return (
                                <div className={styles.techStackData}>
                                    <span>{props?.data?.value}</span>
                                    <button
                                        onClick={e => {
                                            e.stopPropagation()
                                            props?.selectOption(props.data)
                                        }}
                                        className={styles.techStackAddButton}
                                    >
                                        Add
                                    </button>
                                </div>
                            )
                        }
                        return <components.Option {...props} />
                    }
                }}
            />
        </div>
    )
}
