/* istanbul ignore file */
interface TagOption {
    label: string
    value: string | number
    tag_id?: string | number
    tag_nm?: string
    hasDelete?: boolean
    categoryId?: string | number
    __isNew__?: boolean
    [key: string]: unknown
}

export const getTechStackOptions = (
    tagsList: { label: string }[] = []
): { dataStack: TagOption[]; techStack: TagOption[] } => {
    const dataStack: TagOption[] = []
    const techStack: TagOption[] = []
    tagsList?.forEach(({ label }) => {
        const [category, item] = label.split('\\')
        if (category && !dataStack.some(obj => obj.label === category)) {
            dataStack.push({ label: category, value: category })
        }
        if (item && !techStack.some(obj => obj.label === item)) {
            techStack.push({ label: item, value: item })
        }
    })
    return { dataStack, techStack }
}
