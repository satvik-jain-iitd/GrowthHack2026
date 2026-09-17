/* istanbul ignore file */
import {
    Box,
    Flex,
    Input,
    InputGroup,
    RadioGroup,
    Spacer,
    Text
} from '@chakra-ui/react'
import { IconSearch } from '@americanexpress/dls-icons'
import metricStyles from '../metrics.module.css'
import { CROSS_DOMAIN_GROUP_BY, CROSS_DOMAIN_TYPE_FILTERS } from '../constants'

export default function CrossDomainFilterBar({
    typeFilter,
    groupBy,
    search,
    onTypeChange,
    onGroupByChange,
    onSearchChange
}: {
    typeFilter: string
    groupBy: string
    search: string
    onTypeChange: (value: string) => void
    onGroupByChange: (value: string) => void
    onSearchChange: (value: string) => void
}) {
    const setTypeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        onTypeChange(event.target.value)
    }
    const setGroupBy = (event: React.ChangeEvent<HTMLInputElement>) => {
        onGroupByChange(event.target.value)
    }

    return (
        <Box
            display='flex'
            flex='1'
            alignItems={{ base: 'stretch', md: 'center' }}
            flexDirection={{ base: 'column', md: 'row' }}
        >
            <Flex
                direction={{ base: 'column', md: 'row' }}
                alignItems='center'
                gap={6}
            >
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    alignItems='center'
                    gap={4}
                >
                    <Text fontWeight='bold' justifyContent='center'>
                        Group By:{' '}
                    </Text>
                    <RadioGroup.Root
                        onChange={setGroupBy}
                        value={groupBy}
                        colorPalette={'blue'}
                        className={metricStyles.metricsGroupBy}
                    >
                        {CROSS_DOMAIN_GROUP_BY.map(option => (
                            <RadioGroup.Item
                                key={option.value || 'none'}
                                id={`radio-group-by-${option.value || 'none'}`}
                                value={option.value}
                                className={metricStyles.metricsRadio}
                            >
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator
                                    backgroundColor={
                                        option.value != groupBy ? 'white' : ''
                                    }
                                />
                                <RadioGroup.ItemText>
                                    {option.label}
                                </RadioGroup.ItemText>
                            </RadioGroup.Item>
                        ))}
                    </RadioGroup.Root>
                </Flex>
                {/* the aggregate is computed server-side across every initiative,
                    so a client-side ETP/ECMI filter cannot be applied to it */}
                {!groupBy && (
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        alignItems='center'
                        gap={4}
                    >
                        <Text fontWeight='bold' justifyContent='center'>
                            Type:{' '}
                        </Text>
                        <RadioGroup.Root
                            onChange={setTypeFilter}
                            value={typeFilter}
                            colorPalette={'blue'}
                            className={metricStyles.metricsGroupBy}
                        >
                            {CROSS_DOMAIN_TYPE_FILTERS.map(option => (
                                <RadioGroup.Item
                                    key={option.value}
                                    id={`radio-type-${option.value}`}
                                    value={option.value}
                                    className={metricStyles.metricsRadio}
                                >
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator
                                        backgroundColor={
                                            option.value != typeFilter
                                                ? 'white'
                                                : ''
                                        }
                                    />
                                    <RadioGroup.ItemText>
                                        {option.label}
                                    </RadioGroup.ItemText>
                                </RadioGroup.Item>
                            ))}
                        </RadioGroup.Root>
                    </Flex>
                )}
            </Flex>
            <Spacer />
            <InputGroup
                flex='1'
                startElement={<IconSearch />}
                backgroundColor={'rgb(247, 248, 249)'}
                _dark={{ backgroundColor: 'rgb(8,7,6)' }}
            >
                <Input
                    id='crossDomainSearch'
                    onChange={e => onSearchChange(e.target.value)}
                    value={search}
                    placeholder='Search'
                    focusRing={'none'}
                />
            </InputGroup>
        </Box>
    )
}
