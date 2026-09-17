/* istanbul ignore file */
import fs from 'fs/promises'

export async function getStaticDirectory(directory: string) {
    const entries = await fs
        .readdir(directory, { withFileTypes: true })
        .catch(() => [])
    // Sort: folders first, then files, both by number prefix
    return entries.sort((a, b) => {
        // Folders first
        if (a.isDirectory() && !b.isDirectory()) return -1
        if (!a.isDirectory() && b.isDirectory()) return 1
        // Both folders or both files: sort by number prefix
        const aNum = a.name.match(/^([0-9]+)-/)
        const bNum = b.name.match(/^([0-9]+)-/)
        if (aNum && bNum) return Number(aNum[1]) - Number(bNum[1])
        if (aNum) return -1
        if (bNum) return 1
        return a.name.localeCompare(b.name)
    })
}
