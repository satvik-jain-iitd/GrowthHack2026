/* istanbul ignore file */
'use client'
import { IconSearch } from '@americanexpress/dls-icons'
import { InputGroup, Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Application } from '@/app/company-domains/types'

export const ApplicationTableSearch = ({
    appData,
    setData
}: {
    appData: Application[]
    setData: (app: Application[]) => void
}) => {
    const [searchVal, setSearchVal] = useState('')

    const searchApplications = (searchValue: string) => {
        setSearchVal(searchValue)
    }

    useEffect(() => {
        if (searchVal?.length >= 3) {
            const lowerCaseSearch = searchVal.toLowerCase()
            const filteredData = appData.filter((item: Application) => {
                return (
                    item.application_id
                        ?.toLowerCase()
                        ?.includes(lowerCaseSearch) ||
                    item.application_nm
                        ?.toLowerCase()
                        ?.includes(lowerCaseSearch) ||
                    item.central_application_da?.ownershipInfo?.applicationOwner?.fullName
                        ?.toLowerCase()
                        ?.includes(lowerCaseSearch) ||
                    item.central_application_da?.ownershipInfo?.applicationOwnerLeader1?.fullName
                        ?.toLowerCase()
                        ?.includes(lowerCaseSearch) ||
                    item.central_application_da?.ownershipInfo?.applicationOwnerLeader2?.fullName
                        ?.toLowerCase()
                        ?.includes(lowerCaseSearch) ||
                    item.central_application_da?.ownershipInfo?.businessOwner?.fullName
                        ?.toLowerCase()
                        ?.includes(lowerCaseSearch)
                )
            })
            setData(filteredData)
        } else {
            setData(appData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchVal])

    return (
        <InputGroup
            flex='1'
            startElement={<IconSearch />}
            backgroundColor={'rgb(247, 248, 249)'}
            _dark={{ backgroundColor: 'rgb(8,7,6)' }}
        >
            <Input
                onChange={e => searchApplications(e.target.value)}
                value={searchVal}
                placeholder='Search'
                focusRing={'none'}
            />
        </InputGroup>
    )
}

// TODO: unify all search boxes, there are chakra, dls-react and bootstrap versions
