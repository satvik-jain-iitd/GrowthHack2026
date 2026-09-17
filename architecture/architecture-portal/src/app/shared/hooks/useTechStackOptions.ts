import { API_ENDPOINTS, TAG_CATEGORY_IDS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

interface TechStackTag {
    tag_id: string
    tag_nm: string
    children?: TechStackTag[]
}

export interface TechStackOptions {
    options: { label: string; value: string }[]
    byId: Record<string, string>
}

const flattenTags = (
    tags: TechStackTag[],
    options: { label: string; value: string }[],
    byId: Record<string, string>
) => {
    tags.forEach(tag => {
        if (tag.tag_id) {
            byId[tag.tag_id] = tag.tag_nm
            const children = tag.children ?? []
            if (children.length === 0) {
                options.push({ label: tag.tag_nm, value: tag.tag_id })
            } else {
                flattenTags(children, options, byId)
            }
        }
    })
}

export const TECH_STACK_OPTIONS_QUERY_KEY = ['tech_stack_options']

export function useTechStackOptions() {
    return useQuery<TechStackOptions, Error>({
        queryKey: TECH_STACK_OPTIONS_QUERY_KEY,
        queryFn: async () => {
            const res = await fetchWithToken(
                API_ENDPOINTS.GET_METADATA_TAGS(TAG_CATEGORY_IDS.TECH_STACKS),
                { credentials: 'include' }
            )
            if (!res.ok) {
                throw new Error('Failed to fetch tech stack options')
            }
            const { data } = await res.json()
            const options: { label: string; value: string }[] = []
            const byId: Record<string, string> = {}
            if (Array.isArray(data)) {
                flattenTags(data as TechStackTag[], options, byId)
            }
            return { options, byId }
        }
    })
}
