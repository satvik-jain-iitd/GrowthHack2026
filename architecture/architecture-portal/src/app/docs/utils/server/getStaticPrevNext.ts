/* istanbul ignore file */
import { PrevNext } from '@/types/PrevNext'
import { toTitleCase } from '@/utils/client'

export function getStaticPrevNext(
    paths: Record<string, string>,
    baseRoute: string,
    relativePath: string
): PrevNext {
    const keys = Object.keys(paths)
    const idx = keys.indexOf(relativePath)
    return {
        previous:
            idx > 0
                ? {
                      label: toTitleCase(keys[idx - 1].split('/').pop()!),
                      href: `/${baseRoute}/${keys[idx - 1]}`
                  }
                : undefined,
        next:
            idx !== -1 && idx < keys.length - 1
                ? {
                      label: toTitleCase(keys[idx + 1].split('/').pop()!),
                      href: `/${baseRoute}/${keys[idx + 1]}`
                  }
                : undefined
    }
}
