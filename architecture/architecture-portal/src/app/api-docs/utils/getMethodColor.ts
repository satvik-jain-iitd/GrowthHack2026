/* istanbul ignore file */

export function getMethodColor(method: string): string {
    switch (method?.toLowerCase()) {
        case 'get':
            return '#186faf'
        case 'post':
            return '#2f8132'
        case 'put':
        case 'patch':
            return '#ff8f3c'
        case 'delete':
            return '#ff5c5c'
        default:
            return '#000000'
    }
}
