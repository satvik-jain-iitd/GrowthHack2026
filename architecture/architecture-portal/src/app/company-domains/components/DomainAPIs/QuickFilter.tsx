/* istanbul ignore file */

import { useEffect } from 'react'
import { Button, Group, Menu, IconButton, Portal, Box } from '@chakra-ui/react'
import { IconChevronDown } from '@americanexpress/dls-icons'
import {
    QUERY_PARAMS,
    getStatusFiltersfromUrl
} from '@/app/company-domains/utils'
import { USER_MESSAGES } from '@/app/company-domains/constants'

export function QuickFilter({
    filter,
    setQuickFilter
}: {
    filter: string
    setQuickFilter: (value: string) => void
}) {
    const quickFilterByStatus = (status: string) => {
        const link = new URL(window.location.href)
        link.search = ''
        let filterValue = ''
        if (status === 'proposed') {
            filterValue = QUERY_PARAMS.APPROVAL_FILTER_VALUES.ARB_APPROVAL
        } else if (status === 'darbAppr') {
            filterValue = QUERY_PARAMS.APPROVAL_FILTER_VALUES.EARB_APPROVAL
        }
        filterValue &&
            link.searchParams.set(QUERY_PARAMS.APPROVAL_FILTER, filterValue)
        window.history.replaceState(null, '', link.toString())
        setQuickFilter(status)
    }
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const statusFilter = getStatusFiltersfromUrl()
            if (statusFilter.length > 0) {
                setQuickFilter(statusFilter[0])
            }
        }
    }, [])
    return (
        <Box mt={1}>
            {filter === '' ? (
                <Menu.Root
                    positioning={{ placement: 'bottom-end' }}
                    onSelect={e => quickFilterByStatus(e.value)}
                >
                    <Menu.Trigger asChild>
                        <Group attached>
                            <Button
                                variant='outline'
                                size='sm'
                                border='1px solid #006fcf'
                                backgroundColor='#fff'
                                color='#006fcf'
                                title={USER_MESSAGES.QUICK_FILTER_TOOLTIP}
                            >
                                Quick Filters:
                            </Button>
                            <IconButton
                                variant='outline'
                                size='sm'
                                border='1px solid #006fcf'
                                backgroundColor='#fff'
                                color='#006fcf'
                                title={USER_MESSAGES.QUICK_FILTER_TOOLTIP}
                            >
                                <IconChevronDown />
                            </IconButton>
                        </Group>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                {[
                                    {
                                        label: 'Ready for ARB Review',
                                        value: 'proposed',
                                        title: USER_MESSAGES.QUICK_FILTER_PROPOSED
                                    },
                                    {
                                        label: 'Ready for EARB Review',
                                        value: 'darbAppr',
                                        title: USER_MESSAGES.QUICK_FILTER_DARB_APPROVED
                                    }
                                ].map(item => (
                                    <Menu.Item
                                        key={item.value}
                                        value={item.value}
                                        title={item.title}
                                    >
                                        {item.label}
                                    </Menu.Item>
                                ))}
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            ) : (
                <Button
                    variant='outline'
                    size='sm'
                    border='1px solid #006fcf'
                    backgroundColor='#fff'
                    color='#006fcf'
                    onClick={() => quickFilterByStatus('')}
                >
                    Clear Filter
                </Button>
            )}
        </Box>
    )
}
