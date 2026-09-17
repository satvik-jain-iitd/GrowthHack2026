/* istanbul ignore file */
import { toTitleCase } from '@/utils/client'

export function getStaticBreadcrumbs(relativePath: string) {
    return relativePath
        .split('/')
        .filter(Boolean)
        .map(segment => ({
            label: toTitleCase(segment)
        }))
}
