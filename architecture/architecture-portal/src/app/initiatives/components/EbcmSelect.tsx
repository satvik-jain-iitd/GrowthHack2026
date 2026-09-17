/* istanbul ignore file */

import { useEBCMLevels, useEBCMSearch } from '@/app/company-domains/hooks'
import {
    CapabilitiesTree,
    Capability,
    SelectOptions
} from '@/app/company-domains/types'
import {
    getEBCMLevelOptions,
    getEBCMLevelValue,
    getLevel1Value,
    getLevel2Options
} from '@/app/company-domains/utils'
import { User } from '@/app/layout/AuthBlueSso'
import { IconPlusCircle } from '@americanexpress/dls-icons'
import { Box, Button, Field, Tag } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'

function EbcmSelect({
    user,
    ebcmFormValues,
    setEbcmFormValues
}: {
    user: User
    ebcmFormValues: SelectOptions[]
    setEbcmFormValues: (values: SelectOptions[]) => void
}) {
    const { fetchData: getEBCMLevels, ebcmLevelsData } = useEBCMLevels()

    const { sortedList1 } = useEBCMSearch(
        ebcmLevelsData || ({} as CapabilitiesTree)
    )

    const ebcmLevel1 = getLevel1Value('', sortedList1)
    const ebcmLevel2Options = getLevel2Options(
        ebcmLevel1?.label || '',
        ebcmLevelsData || ({} as CapabilitiesTree)
    )
    const ebcmLevel2 = getEBCMLevelValue('', ebcmLevel2Options, 3)
    const ebcmLevel3Options = getEBCMLevelOptions(
        ebcmLevel2?.label || '',
        ebcmLevel2Options
    )
    const ebcmLevel3 = getEBCMLevelValue('', ebcmLevel3Options, 5)
    const ebcmLevel4Options = getEBCMLevelOptions(
        ebcmLevel3?.label || '',
        ebcmLevel3Options
    )

    const ebcmLevel4 = getEBCMLevelValue('', ebcmLevel4Options, 7)

    const [levels, setLevels] = useState({
        level1: ebcmLevel1,
        level2: ebcmLevel2,
        level3: ebcmLevel3,
        level4: ebcmLevel4,
        level2Options: [] as Capability[],
        level3Options: [] as Capability[],
        level4Options: [] as Capability[]
    })

    const [selectedEbcm, setSelectedEbcm] = useState<{
        label: string
        value: string
    } | null>(null)

    useEffect(() => {
        if (user?.attributes?.email) {
            getEBCMLevels()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleLevel2Change = (
        newValue: SelectOptions,
        actionMeta: { action: string }
    ) => {
        if (actionMeta.action === 'clear') {
            setLevels({
                ...levels,
                level2: null,
                level3: null,
                level4: null,
                level3Options: [],
                level4Options: []
            })
            setSelectedEbcm(levels.level1)
        } else {
            setLevels({
                ...levels,
                level2: newValue,
                level3: null,
                level4: null,
                level3Options: getEBCMLevelOptions(
                    typeof newValue != 'string' ? newValue?.label : '',
                    levels.level2Options
                ),
                level4Options: []
            })
            setSelectedEbcm(newValue)
        }
    }

    const handleLevel3Change = (
        newValue: SelectOptions,
        actionMeta: { action: string }
    ) => {
        if (actionMeta.action === 'clear') {
            setLevels({
                ...levels,
                level3: null,
                level4: null,
                level4Options: []
            })
            setSelectedEbcm(levels.level2)
        } else {
            setLevels({
                ...levels,
                level3: newValue as SelectOptions,
                level4: null,
                level4Options: getEBCMLevelOptions(
                    typeof newValue != 'string' ? newValue?.label : '',
                    levels.level3Options
                )
            })
            setSelectedEbcm(newValue)
        }
    }

    const handleAddEBCM = () => {
        const ebcms = ebcmFormValues
        const isAlreadyExist = ebcms?.find(
            ebcm => ebcm.value === selectedEbcm?.value
        )
        if (isAlreadyExist) {
            toast.error(
                `${(selectedEbcm as SelectOptions)?.label} is already Added.`
            )
            return
        }
        setEbcmFormValues([...(ebcms || []), selectedEbcm as SelectOptions])

        setSelectedEbcm(null)
        setLevels({
            level1: null,
            level2: null,
            level3: null,
            level4: null,
            level2Options: [],
            level3Options: [],
            level4Options: []
        })
    }

    return (
        <>
            <Field.Root>
                <Field.Label>EBCM Level 1</Field.Label>
                <Select
                    name='ebcmLevel1'
                    options={sortedList1?.map(item => ({
                        label: item.name,
                        value: item.id
                    }))}
                    isClearable={true}
                    value={levels.level1}
                    onChange={value => {
                        setLevels({
                            level1: (value as SelectOptions) || null,
                            level2: null,
                            level3: null,
                            level4: null,
                            level2Options: getLevel2Options(
                                value?.label || '',
                                ebcmLevelsData || ({} as CapabilitiesTree)
                            ),
                            level3Options: [],
                            level4Options: []
                        })
                        setSelectedEbcm(value)
                    }}
                    data-testid='ebcm-level-1'
                    styles={{
                        container: provided => ({
                            ...provided,
                            width: '100%',
                            maxWidth: '500px'
                        })
                    }}
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>EBCM Level 2</Field.Label>
                <Select
                    name='ebcmLevel2'
                    options={levels.level2Options?.map(item => ({
                        label: item?.name,
                        value: item?.id
                    }))}
                    isClearable={true}
                    value={levels.level2}
                    onChange={(newValue, action) =>
                        handleLevel2Change(newValue as SelectOptions, action)
                    }
                    isDisabled={!levels.level1}
                    data-testid='ebcm-level-2'
                    styles={{
                        container: provided => ({
                            ...provided,
                            width: '100%',
                            maxWidth: '500px'
                        })
                    }}
                />
            </Field.Root>
            {levels.level1 && levels.level2 && (
                <Field.Root>
                    <Field.Label>EBCM Level 3</Field.Label>
                    <Select
                        name='ebcmLevel3'
                        options={levels.level3Options?.map(item => ({
                            label: item?.name,
                            value: item?.id
                        }))}
                        styles={{
                            container: provided => ({
                                ...provided,
                                width: '100%',
                                maxWidth: '500px'
                            })
                        }}
                        value={levels.level3}
                        isClearable={true}
                        onChange={(newValue, action) =>
                            handleLevel3Change(
                                newValue as SelectOptions,
                                action
                            )
                        }
                        data-testid='ebcm-level-3'
                    />
                </Field.Root>
            )}
            {levels.level3 && levels.level4Options?.length > 0 && (
                <Field.Root>
                    <Field.Label>EBCM Level 4</Field.Label>
                    <Select
                        name='ebcmLevel4'
                        options={levels.level4Options?.map(item => ({
                            label: item?.name,
                            value: item?.id
                        }))}
                        styles={{
                            container: provided => ({
                                ...provided,
                                width: '100%',
                                maxWidth: '500px'
                            })
                        }}
                        value={levels.level4}
                        isClearable={true}
                        onChange={value => {
                            setLevels({
                                ...levels,
                                level4: value
                            })
                            setSelectedEbcm(value)
                        }}
                        data-testid='ebcm-level-4'
                    />
                </Field.Root>
            )}
            {selectedEbcm && (
                <Button
                    size={'sm'}
                    onClick={handleAddEBCM}
                    variant={'plain'}
                    mt={'1'}
                >
                    <IconPlusCircle
                        color='brand'
                        size='md'
                        isFilled={false}
                        title='Example description applied to icon'
                        titleId='unique-id-for-IconPlusCircle-title'
                    />
                    Add EBCM
                </Button>
            )}

            <Box display={'block'} mt={1}>
                {(ebcmFormValues || [])?.map((item, index) => (
                    <Tag.Root
                        key={index}
                        variant='outline'
                        colorScheme='blue'
                        m={1}
                        color='#333333'
                        fontSize='12px'
                        lineHeight='24px'
                        borderRadius='full'
                        backgroundColor='#ecf5fd'
                        minHeight='32px'
                    >
                        <Tag.Label p={1} title={item?.label}>
                            {item?.label}
                        </Tag.Label>
                        <Tag.CloseTrigger
                            color='#006fcf'
                            width='20px'
                            cursor='pointer'
                            pr={1}
                            onClick={() => {
                                const ebcms = ebcmFormValues
                                const filtered = (ebcms || []).filter(
                                    val => val?.value != item?.value
                                )
                                setEbcmFormValues([...filtered])
                            }}
                            data-testid='ebcm-close'
                        />
                    </Tag.Root>
                ))}
            </Box>
        </>
    )
}

export default EbcmSelect
