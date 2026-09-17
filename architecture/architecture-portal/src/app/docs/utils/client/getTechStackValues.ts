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

export const getTechStackValues = (
    data: { label: string } | string = '',
    tagsList: { label: string; value: string }[] = []
): TagOption[] => {
    const selectedValue = typeof data === 'string' ? data : data?.label
    const techStack = tagsList
        ?.filter(item => {
            const [category, tech] = item.label.split('\\')
            return tech && selectedValue === category && item
        })
        ?.map(item => {
            const tech = item?.label.split('\\')?.[1]?.trimStart()
            return { label: tech, value: item.value }
        })
    return techStack
}
