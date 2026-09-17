/* istanbul ignore file */
export const showAdmin = (groups: string[]): boolean => {
    return groups?.includes('GG-AXP-ARCH-PORTAL-ADMIN')
}
