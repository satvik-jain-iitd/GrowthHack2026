export type SidebarItem = {
    type: 'file' | 'folder' | 'playbook'
    name: string
    path?: string
    href?: string
    playbook_id?: string
    playbook_type_id?: string
    isAdrs?: boolean
    expanded: boolean
    children?: SidebarItem[]
}
