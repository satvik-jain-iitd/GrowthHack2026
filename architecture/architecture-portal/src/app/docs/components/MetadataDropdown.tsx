/* istanbul ignore file */
import { useState } from 'react'
import { Button } from '@chakra-ui/react'
import Select from 'react-select'
import styles from '@/app/docs/styles/metadata.module.css'

interface OptionType {
    label: string
    value: string | number
    tag_id?: string | number
    tag_nm?: string
    children?: OptionType[]
    [key: string]: unknown
}

interface TagType {
    tag_nm: string
    [key: string]: unknown
}

interface MetadataDropdownProps {
    options: OptionType[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addedTagList: any
    index: number | string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAddedTagList: (list: any) => void
    setIsMultilevelSelect: (val: boolean) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setMultiSelectValue: (val: any) => void
    isTagCategory?: boolean
    tags?: TagType[]
}

export const MetadataDropdown = ({
    options,
    addedTagList,
    index,
    setAddedTagList,
    setIsMultilevelSelect,
    setMultiSelectValue,
    isTagCategory = false,
    tags = []
}: MetadataDropdownProps) => {
    const [selected, setSelected] = useState<OptionType[]>([options[0]])
    const [lastSelected, setLastSelected] = useState<OptionType>(options[0])

    const onClickAdd = (): void => {
        if (!isTagCategory) {
            if (!addedTagList[index]) {
                addedTagList[index] = [lastSelected]
            } else {
                addedTagList[index].push(lastSelected)
            }
            setAddedTagList({ ...addedTagList })
        } else {
            if (!addedTagList[index].selectedOptions) {
                addedTagList[index].selectedOptions = [lastSelected]
            } else {
                addedTagList[index].selectedOptions!.push(lastSelected)
            }
            setAddedTagList([...addedTagList])
        }

        setIsMultilevelSelect(false)
        setMultiSelectValue(false)
    }

    // Get options for a given level
    const getOptions = (level: number): OptionType[] => {
        if (level === 0) return options
        let node = options?.find(opt => opt.tag_id === selected[0]?.value)
        for (let i = 1; i < level; i++) {
            if (!node?.children) return []
            node = node.children.find(opt => opt.tag_id === selected[i]?.value)
        }
        const selectedOptions = addedTagList[index]?.selectedOptions || []
        return (
            node?.children
                ?.map(opt => {
                    return {
                        ...opt,
                        label: opt?.tag_nm ?? '',
                        value: opt?.tag_id ?? ''
                    }
                })
                ?.filter(
                    opt =>
                        selectedOptions
                            ?.map((sop: OptionType) => sop.label)
                            .indexOf(opt.label) === -1 ||
                        (opt.children?.length ?? 0) > 0
                )
                ?.filter(
                    opt =>
                        tags
                            ?.map((t: TagType) => t.tag_nm)
                            .indexOf(opt.label) === -1
                ) || []
        )
    }

    return (
        <div style={{ maxWidth: 400 }}>
            {[...selected, {} as OptionType].map((sel, level) => {
                const opts = getOptions(level)
                if (!opts || opts?.length === 0) return null
                return (
                    <div
                        key={level}
                        style={{ marginTop: level === 0 ? 0 : 16 }}
                    >
                        <Select
                            options={opts}
                            value={selected[level] || null}
                            className={styles.cascadeSelectBox}
                            onChange={val => {
                                // When a selection is made, remove all deeper selections
                                const next = [
                                    ...selected.slice(0, level),
                                    val as OptionType
                                ]
                                setSelected(next)
                                setLastSelected(val as OptionType)
                            }}
                            placeholder={`Select `}
                        />
                    </div>
                )
            })}

            <Button size={'sm'} mt={2} variant={'solid'} onClick={onClickAdd}>
                Add
            </Button>
            <Button
                size={'sm'}
                mt={2}
                variant='outline'
                onClick={() => {
                    setIsMultilevelSelect(false)
                    setMultiSelectValue(lastSelected.value)
                }}
            >
                Cancel
            </Button>
        </div>
    )
}
