/* istanbul ignore file */
import {
    Box,
    Input,
    InputGroup,
    Stack,
    Text,
    Portal,
    Select,
    createListCollection
} from '@chakra-ui/react'
import Image from 'next/image'

type FilterState = Record<string, boolean>

interface BvBTrackerHeaderProps {
    search: string
    onSearchChange: (_value: string) => void
    filterState: FilterState
    onChangeColumnFilter: (_selected: string[]) => void
    filterOptions: string[]
    keyToLabel: (_key: string) => string
    cardBgSrc: string
}

const CloseButton = (
    search: string,
    onSearchChange: (_input: string) => void
) => {
    if (!search) return null
    return (
        <Box
            as='button'
            onClick={() => onSearchChange('')}
            background='none'
            border='none'
            cursor='pointer'
            color='#000'
            fontSize='16px'
            ml={1}
            aria-label='Clear Text'
        >
            ×
        </Box>
    )
}
export default function BvBTrackerHeader({
    search,
    onSearchChange,
    filterState,
    onChangeColumnFilter,
    filterOptions,
    keyToLabel,
    cardBgSrc
}: BvBTrackerHeaderProps) {
    const selectedColumns = filterOptions.filter(opt => filterState[opt])
    const allSelected = selectedColumns.length === filterOptions.length

    return (
        <Box
            height={{ base: '250px', md: '180px' }}
            pt='4.5rem'
            pb={6}
            px={5}
            bg='#00175a'
            position='relative'
            overflow='hidden'
        >
            <Box
                position='absolute'
                right={0}
                top={0}
                height='100%'
                zIndex={0}
                display={{ base: 'none', md: 'block' }}
                pointerEvents='none'
            >
                <Image
                    src={cardBgSrc}
                    alt='Card Background'
                    style={{
                        objectFit: 'cover',
                        height: '100%',
                        width: 'auto'
                    }}
                    fill={false as boolean}
                    width={250}
                    height={180}
                    priority
                />
            </Box>
            <Stack
                direction='row'
                justify='space-between'
                align='center'
                flexWrap='wrap'
                minWidth={100}
                height='100%'
                position='relative'
                zIndex={1}
            >
                <Box textAlign='center' mr={8}>
                    <Text
                        color='#fff'
                        fontWeight={300}
                        fontSize={37}
                        lineHeight={1.2}
                    >
                        Build vs Buy Tracker
                    </Text>
                </Box>
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    width={{ base: '100%', md: 'auto' }}
                    flexWrap='wrap'
                    gap={2}
                    ml={0}
                    position='relative'
                >
                    <Stack
                        direction={{ base: 'column-reverse', md: 'row' }}
                        gap={1}
                        zIndex={1}
                        alignItems='center'
                        justify='center'
                    >
                        <InputGroup
                            endElement={CloseButton(search, onSearchChange)}
                        >
                            <Input
                                id='search-input'
                                placeholder='Search'
                                variant='outline'
                                value={search}
                                onChange={e => onSearchChange(e.target.value)}
                                minW='240px'
                                maxW='267px'
                                minH={'53px'}
                                bg='#fff'
                                borderRadius='8px'
                                color='#000'
                                fontWeight='500'
                                borderColor='#000'
                                borderWidth='2px'
                                _hover={{ borderColor: '#000' }}
                                _focus={{ borderColor: '#000' }}
                                _placeholder={{ color: '#888' }}
                            />
                        </InputGroup>
                        <Box
                            minW='240px'
                            maxW='267px'
                            bg='#fff'
                            borderRadius='8px'
                            border='2px solid #000'
                            color='#000'
                            fontWeight='500'
                        >
                            <Select.Root
                                multiple
                                collection={createListCollection({
                                    items: [
                                        {
                                            label: 'Select All',
                                            value: 'select-all'
                                        },
                                        ...filterOptions.map(opt => ({
                                            label: keyToLabel(opt),
                                            value: opt
                                        }))
                                    ]
                                })}
                                size='lg'
                                width='100%'
                                value={selectedColumns}
                                onValueChange={details => {
                                    if (details.value.includes('select-all')) {
                                        onChangeColumnFilter(
                                            allSelected
                                                ? []
                                                : [...filterOptions]
                                        )
                                    } else {
                                        onChangeColumnFilter(details.value)
                                    }
                                }}
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText
                                            placeholder={`0 of ${filterOptions.length} selected`}
                                        />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {[
                                                {
                                                    label: 'Select All',
                                                    value: 'select-all'
                                                },
                                                ...filterOptions.map(opt => ({
                                                    label: keyToLabel(opt),
                                                    value: opt
                                                }))
                                            ].map(item => (
                                                <Select.Item
                                                    item={item}
                                                    key={item.value}
                                                    color={'fg'}
                                                >
                                                    {item.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        </Box>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )
}
