/* istanbul ignore file */
import {
    Box,
    Button,
    Spacer,
    Flex,
    Text,
    RadioGroup,
    InputGroup,
    Input
} from '@chakra-ui/react'
import metricStyles from '../metrics.module.css'
import { IconSearch, IconLinkOut } from '@americanexpress/dls-icons'
import { RADIO_GROUPBY } from '../constants'
import Link from 'next/link'
import HoverableIconButton from './HoverableIconButton'

export default function MetricsActionBar({
    metricParams,
    handleGroupChange,
    handleSearch
}: {
    metricParams: { view: string; selectedGroup: string; search: string }
    handleGroupChange: (a: string) => void
    handleSearch: (value: string) => void
}) {
    const { view, selectedGroup, search } = metricParams || {}
    const handleReset = () => {
        handleGroupChange('')
    }

    const setSelectedGroup = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        handleGroupChange(value)
    }
    return (
        <Box
            display={'flex'}
            mb={4}
            paddingX='2rem'
            flexDirection={{ base: 'column', md: 'row' }}
        >
            {!!RADIO_GROUPBY[view as keyof typeof RADIO_GROUPBY]?.length && (
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    alignItems='center'
                    gap={4}
                >
                    <Text fontWeight='bold' justifyContent='center'>
                        Group By:{' '}
                    </Text>
                    <RadioGroup.Root
                        onChange={setSelectedGroup}
                        value={selectedGroup}
                        colorPalette={'blue'}
                        className={metricStyles.metricsGroupBy}
                    >
                        {RADIO_GROUPBY[view as keyof typeof RADIO_GROUPBY].map(
                            option => (
                                <RadioGroup.Item
                                    key={option.value}
                                    id={`radio-${option.value}`}
                                    value={option.value}
                                    className={metricStyles.metricsRadio}
                                >
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator
                                        backgroundColor={
                                            option.value != selectedGroup
                                                ? 'white'
                                                : ''
                                        }
                                    />
                                    <RadioGroup.ItemText>
                                        {option.label}
                                    </RadioGroup.ItemText>
                                </RadioGroup.Item>
                            )
                        )}
                    </RadioGroup.Root>

                    {selectedGroup && (
                        <Button
                            ml={4}
                            variant='plain'
                            _hover={{}}
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    )}
                </Flex>
            )}
            <Spacer />
            {view === 'metric2' && (
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    alignItems='center'
                    gap={4}
                    mt={{ base: 4, md: 0 }}
                    pr={2}
                >
                    <HoverableIconButton
                        href='/company-domains'
                        defaultIcon='/products/PlatformsLogo.png'
                        hoverIcon='/products/domain_fillicon.png'
                        iconAlt='Company Domains Icon'
                        label='Company Domains'
                        target='_blank'
                        rel='noopener noreferrer'
                    />
                    <HoverableIconButton
                        href='/api-docs'
                        defaultIcon='/company-domains/api-docs.svg'
                        hoverIcon='/company-domains/api-docs-hover.svg'
                        iconAlt='API Endpoints Icon'
                        label='API Docs'
                        target='_blank'
                        rel='noopener noreferrer'
                    />
                    {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                    <Link
                        href='https://github.aexp.com/pages/amex-eng/one-explorer-docs/'
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'underline'
                        }}
                    >
                        <IconLinkOut />
                        Developer Tooling Docs
                    </Link>
                </Flex>
            )}
            {!selectedGroup && (
                <InputGroup
                    flex='1'
                    startElement={<IconSearch />}
                    backgroundColor={'rgb(247, 248, 249)'}
                    _dark={{ backgroundColor: 'rgb(8,7,6)' }}
                >
                    <Input
                        id='metricsSearch'
                        onChange={e => handleSearch(e.target.value)}
                        value={search}
                        disabled={selectedGroup !== ''}
                        placeholder='Search'
                        focusRing={'none'}
                    />
                </InputGroup>
            )}
        </Box>
    )
}
