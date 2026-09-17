/* istanbul ignore file */
import { IconArrowDown, IconArrowUp } from '@americanexpress/dls-icons'
import { Flex } from '@chakra-ui/react'

export default function TableSortIcon({
    selectedGroup,
    tableParams,
    columnKey,
    color
}: {
    selectedGroup: string
    tableParams: { sortBy?: string; sortOrder?: string }
    columnKey: string
    /** DLS icons default to brand blue, which is invisible on a brand blue
     *  header. Pass 'white' to match white header text. */
    color?: 'brand' | 'white'
}) {
    if (selectedGroup) return null
    if (
        tableParams?.sortBy === columnKey ||
        (columnKey === 'prim_company_domain_name' &&
            tableParams?.sortBy === 'domain')
    ) {
        return tableParams?.sortOrder === 'asc' ? (
            <IconArrowUp
                color={color}
                titleId='Ascending Order'
                title='Ascending Order'
            />
        ) : (
            <IconArrowDown
                color={color}
                titleId='Descending Order'
                title='Descending Order'
            />
        )
    }
    // white needs more opacity than brand blue to stay legible on the header
    const inactiveOpacity = color === 'white' ? 0.55 : 0.3
    return (
        <Flex direction={'column'} alignItems='center'>
            <IconArrowUp color={color} style={{ opacity: inactiveOpacity }} />
            <IconArrowDown color={color} style={{ opacity: inactiveOpacity }} />
        </Flex>
    )
}
