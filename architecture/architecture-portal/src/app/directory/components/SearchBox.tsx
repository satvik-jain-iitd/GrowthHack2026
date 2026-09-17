/* istanbul ignore file */
import { Box, Input, InputGroup } from '@chakra-ui/react'
import { IconSearch } from '@americanexpress/dls-icons'
import React, { useState } from 'react'
import { Domain } from '@/app/company-domains/types'
import { DIRECTORY_TEST_IDS } from '../test-ids'
import styles from '@/app/directory/search.module.css'

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
        <Box
            marginBottom={{ base: '0', md: '20px' }}
            width={{ base: '100%', md: '40%' }}
            className={styles.searchBox}
        >
            <InputGroup startElement={<IconSearch />}>
                <Input
                    className='companySearchBox'
                    placeholder='Search'
                    size='md'
                    type='search'
                    onChange={e => searchDomains(e.target.value)}
                    value={searchVal}
                    border='1px solid'
                    data-testid={DIRECTORY_TEST_IDS.searchBox}
                />
            </InputGroup>
        </Box>
    )
}
