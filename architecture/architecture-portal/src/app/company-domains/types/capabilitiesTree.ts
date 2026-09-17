export interface Capability {
    name: string
    id: string
    children?: CapabilitiesTree
    parent?: string
}

export interface CapabilitiesTree {
    [key: string]: Capability
}
