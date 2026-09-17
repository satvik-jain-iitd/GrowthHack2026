/* istanbul ignore file */

import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { SearchIndex } from '@/app/api-docs/types/search'
import {
    flattenSearchRows,
    groupSearchResults,
    parseSearchQuery
} from '@/app/api-docs/utils'

const NO_EXPANSIONS: ReadonlySet<string> = new Set<string>()

type ExpansionState = {
    query: string
    index: SearchIndex | null
    scope: ReadonlySet<string> | undefined
    keys: ReadonlySet<string>
}

export const useSearchResults = (
    index: SearchIndex,
    query: string,
    scope?: ReadonlySet<string>
) => {
    const deferredQuery = useDeferredValue(query)
    const [expansion, setExpansion] = useState<ExpansionState>({
        query: '',
        index: null,
        scope: undefined,
        keys: NO_EXPANSIONS
    })

    // A new query, a narrowed scope, or a refetched tree — any of them rebuild
    // the groups, so every expander key is invalidated.
    const expansionIsCurrent =
        expansion.query === deferredQuery &&
        expansion.index === index &&
        expansion.scope === scope
    const expandedKeys = expansionIsCurrent ? expansion.keys : NO_EXPANSIONS

    const toggleExpanded = useCallback(
        (key: string) => {
            const next = new Set(expandedKeys)
            if (!next.delete(key)) next.add(key)
            setExpansion({ query: deferredQuery, index, scope, keys: next })
        },
        [deferredQuery, expandedKeys, index, scope]
    )

    const parsed = useMemo(
        () => parseSearchQuery(deferredQuery),
        [deferredQuery]
    )
    const grouped = useMemo(
        () => groupSearchResults(index, parsed, scope),
        [index, parsed, scope]
    )
    const rows = useMemo(
        () => flattenSearchRows(grouped, expandedKeys),
        [grouped, expandedKeys]
    )

    return {
        parsed,
        grouped,
        rows,
        toggleExpanded,
        isStale: query !== deferredQuery
    }
}
