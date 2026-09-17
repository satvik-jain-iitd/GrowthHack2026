/* istanbul ignore file */
import { Menu, Button, IconButton } from '@chakra-ui/react'
import { IconFilter } from '@americanexpress/dls-icons'
import metricStyles from '../metrics.module.css'
import { StatusBadge } from '@/app/company-domains/components/LandingPage/Status'
import { statusMap } from '@/app/company-domains/constants'

export default function TableFilterIcon({
    column,
    handleStatusFilter
}: {
    column:
        | {
              filterTitle: string
              key: string
              filterType: string
              filterableValues: string[]
          }
        | undefined
    handleStatusFilter: (filterType: string, status: string) => void
}) {
    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Button as={IconButton} variant='plain'>
                    <IconFilter
                        size={'sm'}
                        className={metricStyles.filterIcon}
                        title={column?.filterTitle || 'Filter'}
                        titleId={`statusFilter_${column?.key}`}
                    />
                </Button>
            </Menu.Trigger>
            <Menu.Positioner>
                <Menu.Content minW={0} p={0} w='auto'>
                    {column?.filterableValues?.map((status, index) => (
                        <Menu.Item
                            onClick={() =>
                                handleStatusFilter(column?.filterType, status)
                            }
                            key={status}
                            value={index.toString()}
                            className={
                                status === 'viewAll'
                                    ? metricStyles.viewAllOption
                                    : metricStyles.StatusBadge
                            }
                        >
                            {status === 'viewAll' ? (
                                'VIEW ALL'
                            ) : (
                                <StatusBadge
                                    status={status as keyof typeof statusMap}
                                    rowExpanded={false}
                                />
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
    )
}
