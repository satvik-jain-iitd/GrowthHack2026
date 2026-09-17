/* istanbul ignore file */
import React, { useEffect } from 'react'
import { Box, Field, Flex, Input, InputGroup, Text } from '@chakra-ui/react'
import Select from 'react-select'
import { ApplicationTableInfo } from '../../types'
import { IconSearch } from '@americanexpress/dls-icons'
import styles from '@/app/directory/search.module.css'

const options = [
    { value: 'mapped', label: 'Mapped' },
    { value: 'com_dom_orphaned', label: 'Unmapped' }
]

const ApplicationDirectorySearch = ({
    tableInput,
    setTableInput,
    setPage
}: {
    tableInput: ApplicationTableInfo
    setTableInput: (value: ApplicationTableInfo) => void
    setPage: (value: number) => void
}) => {
    const [checkboxes, setCheckboxes] = React.useState(options)

    useEffect(() => {
        const tempTableInput = {
            ...tableInput,
            filterOptions: {
                ...tableInput.filterOptions,
                mapped: checkboxes.map(({ value }) => value).includes('mapped')
                    ? 'true'
                    : 'false',
                com_dom_orphaned: checkboxes
                    .map(({ value }) => value)
                    .includes('com_dom_orphaned')
                    ? 'true'
                    : 'false'
            },
            pageNum: 1
        }
        setTableInput(tempTableInput)
        setPage(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkboxes])

    const handleSearch = (val: string) => {
        const tempTableInput = {
            ...tableInput,
            searchVal: val,
            pageNum: 1
        }
        setPage(1)
        setTableInput(tempTableInput)
    }

    return (
        <Flex className={styles.searchContainer}>
            <Box className={styles.searchBox}>
                <Box ml={1} mt={4} mb={4}>
                    <Text fontWeight={'bold'}>
                        To view any Application Directory please start by
                        searching by Application ID, Name, Owner or Company
                        Domain
                    </Text>
                </Box>

                <InputGroup
                    flex='1'
                    startElement={<IconSearch />}
                    backgroundColor={'rgb(247, 248, 249)'}
                    _dark={{ backgroundColor: 'rgb(8,7,6)' }}
                >
                    <Input
                        onChange={e => handleSearch(e.target.value)}
                        value={tableInput?.searchVal}
                        placeholder='Search'
                        focusRing={'none'}
                        id='applicationSearch'
                    />
                </InputGroup>
            </Box>
            <Flex className={styles.filterSection}>
                <Field.Root className={styles.filterField}>
                    <Field.Label
                        htmlFor='multiselect-1'
                        id='multiselect-1-label'
                        className={styles.filterLabel}
                    >
                        Filter by:
                    </Field.Label>
                    <Select
                        isMulti
                        isClearable={false}
                        id='history-multiselect'
                        className='multi-select-container'
                        onChange={selectedOptions => {
                            setCheckboxes([...selectedOptions])
                        }}
                        value={checkboxes}
                        styles={{
                            container: base => ({
                                ...base,
                                width: '100%'
                            }),
                            multiValueRemove: base => {
                                return checkboxes.length == 1
                                    ? { ...base, display: 'none' }
                                    : {
                                          ...base,
                                          color: 'var(--directory-filter-color)'
                                      }
                            },
                            control: base => ({
                                ...base,
                                borderColor: 'var(--chakra-colors-gray-300)',
                                minHeight: '40px',
                                width: '100%',
                                backgroundColor: 'var(--bgColor-default)'
                            }),
                            valueContainer: base => ({
                                ...base,
                                width: '100%'
                            }),
                            input: base => ({
                                ...base,
                                color: 'var(--directory-filter-color)'
                            }),
                            menu: base => ({
                                ...base,
                                backgroundColor: 'var(--bgColor-default)'
                            }),
                            option: base => ({
                                ...base,
                                backgroundColor: 'var(--bgColor-default)'
                            }),
                            multiValue: base => ({
                                ...base,
                                backgroundColor: 'var(--directory-filter)'
                            }),
                            multiValueLabel: base => ({
                                ...base,
                                color: 'var(--directory-filter-color)'
                            })
                        }}
                        options={options}
                        placeholder='Select'
                    />
                </Field.Root>
            </Flex>
        </Flex>
    )
}
export default ApplicationDirectorySearch
