/* istanbul ignore file */
import { SidebarItem } from '@/types/SidebarItem'

export function getSidebarKey({ type, name, playbook_id, path }: SidebarItem) {
    return `${type}:${name}:${playbook_id}:${path}`
}
