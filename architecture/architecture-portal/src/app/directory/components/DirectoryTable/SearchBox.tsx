/* istanbul ignore file */
import { Box, Input, InputGroup } from '@chakra-ui/react'
import { IconSearch } from '@americanexpress/dls-icons'
import { useState } from 'react'
import { Domain } from '@/app/company-domains/types'

export const SearchBox = ({
    domains,
    setDomains
}: {
    domains: Domain[] | undefined
    setDomains: (result: Domain[] | undefined) => void
}) => {
    const [searchVal, setSearchVal] = useState('')

    const searchDomains = (searchValue: string) => {
        setSearchVal(searchValue)

        const lowerCaseSearch = searchValue.toLowerCase()

        const filteredData = domains?.filter(item => {
            return (
                item.domain_nm?.toLowerCase()?.includes(lowerCaseSearch) ||
                item.ea_architect_nm
                    ?.toLowerCase()
                    ?.includes(lowerCaseSearch) ||
                item.ea_architect_delegate_nm
                    ?.toLowerCase()
                    ?.includes(lowerCaseSearch) ||
                item.head_engineer_nm
                    ?.toLowerCase()
                    ?.includes(lowerCaseSearch) ||
                item.principal_ea_architect_nm
                    ?.toLowerCase()
                    ?.includes(lowerCaseSearch) ||
                item.tech_owner_nm?.toLowerCase()?.includes(lowerCaseSearch) ||
                item.unit_cio_nm?.toLowerCase()?.includes(lowerCaseSearch) ||
                item.domain_ds?.toLowerCase()?.includes(lowerCaseSearch)
            )
        })
        setDomains(filteredData)
    }

    return (
        <Box marginBottom='20px' width='40%'>
            <InputGroup
                startElement={<IconSearch id='company-domain-search-icon' />}
            >
                <Input
                    className='companySearchBox'
                    placeholder='Search'
                    size='md'
                    type='search'
                    onChange={e => searchDomains(e.target.value)}
                    value={searchVal}
                    border='1px solid'
                />
            </InputGroup>
        </Box>
    )
}
