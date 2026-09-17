/* istanbul ignore file */

import { useMemo } from 'react'
import { domainsLeftNav } from '@/app/api-docs/types/apiDocs'
import { buildSearchIndex } from '@/app/api-docs/utils/buildSearchIndex'

// Keyed on object identity: getFilteredData returns sidebarData untouched for
// the "all" filter, and LandingPage memoizes the filtered tree otherwise.
export const useApiDocsSearchIndex = (
    sidebarData?: { [key: string]: domainsLeftNav } | null
) => useMemo(() => buildSearchIndex(sidebarData), [sidebarData])
