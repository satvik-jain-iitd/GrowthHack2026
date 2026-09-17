/* istanbul ignore file */
'use client'
import { useState } from 'react'
import { alphanumericSort } from '../utils'
import { CapabilitiesTree, Capability } from '../types'

export const useEBCMSearch = (ebcmLevelsList: CapabilitiesTree) => {
    const [level1, setLevel1] = useState<string>()
    const [level2, setLevel2] = useState<string>()
    const [level3, setLevel3] = useState<string>()
    const [level4, setLevel4] = useState<string>()
    const [filteredList2, setFilteredList2] = useState<Capability[]>([])
    const [filteredList3, setFilteredList3] = useState<Capability[]>([])
    const [filteredList4, setFilteredList4] = useState<Capability[]>([])

    const handleLevel1 = (value: string) => {
        setLevel1(value)
        setLevel3('')
        setLevel2('')
        setLevel4('')
        const selectedChildren =
            (ebcmLevelsList[value]?.children as CapabilitiesTree) || {}
        const sortedList2 = Object.values(selectedChildren).sort((a, b) =>
            alphanumericSort(a.name, b.name)
        ) as Capability[]
        setFilteredList2(sortedList2)
    }

    const handleLevel2 = (value: string) => {
        setLevel2(value)
        setLevel4('')
        const selectedSubChildren =
            filteredList2.find(child => child.name === value)?.children || {}
        const sortedList3 = Object.values(selectedSubChildren).sort((a, b) =>
            alphanumericSort(a.name, b.name)
        )
        setFilteredList3(sortedList3)
    }

    const handleLevel3 = (value: string) => {
        setLevel3(value)
        const selectedSubSubChildren =
            filteredList3.find(child => child.name === value)?.children || {}
        const sortedList4 = Object.values(selectedSubSubChildren).sort((a, b) =>
            alphanumericSort(a.name, b.name)
        )
        setFilteredList4(sortedList4)
    }

    const handleClear = () => {
        setLevel1('')
        setLevel2('')
        setLevel3('')
        setFilteredList2([])
        setFilteredList3([])
    }

    const sortedList1 = Object.keys(ebcmLevelsList)
        .sort((a, b) => {
            const A = parseInt(a.split(' ')[0], 10)
            const B = parseInt(b.split(' ')[0], 10)
            return A - B
        })
        .map(item => {
            const sortedList = ebcmLevelsList?.[item]
            return { name: sortedList.name, id: sortedList.id }
        })

    return {
        level1,
        level2,
        level3,
        level4,
        setLevel4,
        ebcmLevelsList,
        filteredList2,
        filteredList3,
        filteredList4,
        sortedList1,
        handleLevel1,
        handleLevel2,
        handleLevel3,
        handleClear
    }
}
