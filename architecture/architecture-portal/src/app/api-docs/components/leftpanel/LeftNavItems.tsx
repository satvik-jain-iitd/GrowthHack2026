/* istanbul ignore file */

import { Box } from '@chakra-ui/react'
import {
    domainsLeftNav,
    apisLeftNav,
    operationsLeftNav,
    Domains
} from '@/app/api-docs/types/apiDocs'
import LeftNavItem from './LeftNavItem'

export default function LeftNavItems({
    items,
    level = 0,
    selectedId,
    setSelectedId,
    expandPath,
    domains
}: {
    items: { [key: string]: domainsLeftNav | apisLeftNav | operationsLeftNav }
    level?: number
    selectedId?: string
    setSelectedId: React.Dispatch<React.SetStateAction<string | undefined>>
    expandPath: string[] | null
    domains: Domains
}) {
    if (!items) return null
    const getChildrenKey = (lvl: number) => {
        if (lvl === 0) return 'apis'
        if (lvl === 1) return 'operations'
        return null
    }
    return (
        <>
            <Box as='nav' aria-label='API Documentation Navigation'>
                {Object.entries(items).map(
                    ([key, value]: [
                        string,
                        domainsLeftNav | apisLeftNav | operationsLeftNav
                    ]) => {
                        const label = value.name || key
                        const childrenKey = getChildrenKey(level)
                        let childItems: {
                            [key: string]: apisLeftNav | operationsLeftNav
                        } | null = null
                        if (childrenKey === 'apis' && 'apis' in value) {
                            childItems = value.apis
                        } else if (
                            childrenKey === 'operations' &&
                            'operations' in value
                        ) {
                            childItems = value.operations
                        }
                        return (
                            <Box key={key}>
                                <LeftNavItem
                                    label={label}
                                    id={value.id}
                                    expandPath={expandPath}
                                    isDomain={level === 0}
                                    childItems={childItems}
                                    level={level}
                                    selectedId={selectedId}
                                    setSelectedId={setSelectedId}
                                    domains={domains}
                                />
                            </Box>
                        )
                    }
                )}
            </Box>
        </>
    )
}
