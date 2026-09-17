/* istanbul ignore file */
import { CapabilitiesTree, Capability } from '../types'
import { alphanumericSort } from './alphanumericSort'

const findEBCMValueById = (
    data: CapabilitiesTree,
    id: string
): { label: string; value: string } | null => {
    for (const key in data) {
        if (data[key]?.id === id) {
            return { label: data[key]?.name, value: id }
        }
        if (data[key].children && Object.keys(data[key].children).length > 0) {
            const idExists = findEBCMValueById(data[key].children, id)
            if (idExists) return idExists
        }
    }
    return null
}

export const getEbcmValues = (
    ebcm_da: string[],
    ebcmList: CapabilitiesTree
) => {
    const ebcmData = ebcm_da?.map(id => findEBCMValueById(ebcmList, id))
    return ebcmData
}

export const getLevel1Value = (value: string, options: Capability[]) => {
    if (value) {
        const updatedLevel1 = options.filter(
            item =>
                item?.name?.slice(0, 1) === value?.slice(0, 1) &&
                item?.name[1] === ' '
        )
        if (updatedLevel1.length > 0) {
            return {
                label: updatedLevel1[0]['name'],
                value: updatedLevel1[0]['name']
            }
        }
        return null
    }
    return null
}

export const getLevel2Options = (value: string, ebcmList: CapabilitiesTree) => {
    if (value) {
        const selectedChildren = ebcmList[value]?.children || {}
        const sortedList2 = Object.values(selectedChildren).sort((a, b) =>
            alphanumericSort(a.name, b.name)
        )
        return sortedList2
    }
    return []
}

export const getEBCMLevelValue = (
    value: string,
    options: Capability[],
    index: number
) => {
    if (value) {
        const updatedLevel = options.filter(
            item =>
                item.name?.slice(0, index) === value?.slice(0, index) &&
                item.name[index] === ' '
        )
        if (updatedLevel.length > 0) {
            return {
                label: updatedLevel[0]?.name,
                value: updatedLevel[0]?.name
            }
        }
        return null
    }
    return null
}

export const getEBCMLevelOptions = (value: string, ebcmList: Capability[]) => {
    if (value) {
        const selectedSubChildren =
            ebcmList.find(child => child.name === value)?.children || {}
        const sortedList = Object.values(selectedSubChildren).sort((a, b) =>
            alphanumericSort(a.name, b.name)
        )
        return sortedList
    }
    return []
}
