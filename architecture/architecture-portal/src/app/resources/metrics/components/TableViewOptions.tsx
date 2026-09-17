/* istanbul ignore file */
import { Flex, HStack, Button, Stack, Separator } from '@chakra-ui/react'
import { getNumDomains, getCategoryName } from '@/app/company-domains/utils'
import { Domain, DomainCategory } from '@/app/company-domains/types'
import platformStyles from '../platform-page.module.css'
import { Tooltip } from '@/components/ui'
import { GridIcon, ListIcon } from '@/components/icons'
import metricStyles from '../metrics.module.css'

export default function TableViewOptions({
    domainCategories,
    tableViewOptions,
    handleTableViewChange,
    handleCardExpandAll,
    handleFilterChange,
    companyDomains,
    showFilters = true,
    showViewToggle = true
}: {
    domainCategories: DomainCategory[]
    tableViewOptions: {
        view: string
        filter?: string
        showAll?: boolean
        isHeatMapSelected?: boolean
        showApiOperation?: string[]
    }
    handleTableViewChange: (view: string) => void
    handleCardExpandAll: () => void
    handleFilterChange: (filter: string) => void
    handleHeatMapViewChange: (isChecked: boolean) => void
    companyDomains: Domain[] | undefined
    isHeatMapView: boolean
    showFilters?: boolean
    showViewToggle?: boolean
}) {
    const { view, filter = {}, showAll } = tableViewOptions || {}
    const domainCount = getNumDomains(companyDomains, false)

    const isActive = (v: string) => view === v
    const getColor = (v: string) =>
        isActive(v) ? 'var(--domains-subheading-color)' : '#8E9092'

    const filterButton = (id: string, label: string) => (
        <Button
            id={id}
            key={id}
            size={{ base: 'sm', md: 'md' }}
            variant='outline'
            onClick={() => handleFilterChange(id)}
            padding='1rem'
            className={
                filter === id
                    ? metricStyles.directoryTabsActive
                    : metricStyles.directoryTabsInactive
            }
        >
            {label}
        </Button>
    )

    return (
        <Stack
            justifyContent='space-between'
            position='relative'
            className={platformStyles.platformsViewOptions}
            bottom={{ base: '50px', sm: '25px' }}
            width='100%'
        >
            {showFilters && (
                <Stack
                    className={platformStyles.platformsViewOptions__filters}
                    direction='row'
                >
                    {filterButton(
                        'viewAll',
                        `View All (${domainCount['viewAll']})`
                    )}
                    {domainCategories?.map(group =>
                        filterButton(
                            group,
                            `${getCategoryName(group)} (${domainCount[group]})`
                        )
                    )}
                    <Separator
                        orientation='vertical'
                        height='auto'
                        width='0.5px'
                    />
                    {filterButton('withContributions', 'With Contributions')}
                </Stack>
            )}
            <Flex
                className={platformStyles.platformsViewOptions__viewControl}
                paddingBottom='4px'
                paddingRight='20px'
                marginLeft='2px'
                float='right'
            >
                <HStack
                    className={
                        platformStyles.platformsViewOptions__viewControlButtons
                    }
                    gap='1rem'
                    marginTop='4px'
                >
                    {view === 'cardView' && (
                        <Tooltip
                            showArrow
                            content={showAll ? 'Collapse All' : 'Expand All'}
                        >
                            <Button
                                variant='outline'
                                onClick={handleCardExpandAll}
                                colorScheme='blue'
                                size='sm'
                                padding='0.5rem'
                                border='solid 1px'
                                borderRadius='0.37rem'
                                color='#2B6CB0'
                                _hover={{ backgroundColor: '#EBF8FF' }}
                            >
                                {showAll ? 'Collapse All' : 'Expand All'}
                            </Button>
                        </Tooltip>
                    )}
                    {showViewToggle && (
                        <>
                            <Tooltip showArrow content='Domain Card View'>
                                <button
                                    onClick={() =>
                                        handleTableViewChange('cardView')
                                    }
                                    aria-label='Domain Card View'
                                >
                                    <GridIcon
                                        className={
                                            !isActive('cardView')
                                                ? 'platform-view-toggle-svg'
                                                : ''
                                        }
                                        color={getColor('cardView')}
                                    />
                                </button>
                            </Tooltip>
                            <Tooltip showArrow content='Domain List View'>
                                <button
                                    onClick={() =>
                                        handleTableViewChange('listView')
                                    }
                                    aria-label='Domain List View'
                                >
                                    <ListIcon
                                        className={
                                            !isActive('listView')
                                                ? 'platform-view-toggle-svg'
                                                : ''
                                        }
                                        color={getColor('listView')}
                                    />
                                </button>
                            </Tooltip>
                        </>
                    )}
                </HStack>
            </Flex>
        </Stack>
    )
}
