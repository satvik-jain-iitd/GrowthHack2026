/* istanbul ignore file */

export function getPage<T>(array: T[], pageNumber: number, pageSize: number) {
    const startIndex = (pageNumber - 1) * pageSize
    const endIndex = pageNumber * pageSize
    return array.slice(startIndex, endIndex)
}
