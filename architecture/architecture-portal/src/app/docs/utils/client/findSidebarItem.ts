/* istanbul ignore file */
import { SidebarItem } from '@/types/SidebarItem'

export function findSidebarItem(
    items: SidebarItem[],
    uuid: string,
    isAdr?: boolean
): SidebarItem | undefined {
    for (const item of items) {
        if (item.href === `/${isAdr ? 'adrs' : 'docs'}/${uuid}`) return item
        if (item.children) {
            const found = findSidebarItem(item.children, uuid, isAdr)
            if (found) return found
        }
    }
    return undefined
}
