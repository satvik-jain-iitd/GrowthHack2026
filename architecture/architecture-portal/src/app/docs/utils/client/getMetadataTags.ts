/* istanbul ignore file */
interface Tag {
    [key: string]: string | undefined | boolean
    tag_category_nm?: string
    file_id?: string
}

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

export const getMetadataTags = (
    tags: { tag_da?: Tag[] },
    fileId: string
): Record<string, TagOption[]> => {
    const validatedTags: Record<string, TagOption[]> = {}
    const tagData = tags?.tag_da || []

    for (const tag of tagData) {
        const categoryName = tag['tag_category_nm']
        if (categoryName?.toLowerCase() === 'keywords') {
        }
        if (categoryName) {
            if (!validatedTags[categoryName]) {
                validatedTags[categoryName] = []
            }
            // Ensure all TagOption fields are present
            const tagValue: TagOption = {
                label: typeof tag.tag_nm === 'string' ? tag.tag_nm : '',
                value: tag.tag_id !== undefined ? String(tag.tag_id) : '',
                tag_id:
                    tag.tag_id !== undefined ? String(tag.tag_id) : undefined,
                tag_nm: typeof tag.tag_nm === 'string' ? tag.tag_nm : undefined,
                hasDelete: tag?.file_id === fileId,
                categoryId:
                    tag.tag_category_id !== undefined
                        ? String(tag.tag_category_id)
                        : undefined,
                __isNew__: false,
                ...tag
            }
            validatedTags[categoryName].push(tagValue)
        }
    }
    return validatedTags
}
