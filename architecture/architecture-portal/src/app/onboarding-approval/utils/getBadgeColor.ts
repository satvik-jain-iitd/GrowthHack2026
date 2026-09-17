/* istanbul ignore file */

export function getBadgeColor(playbookStatus: string) {
    if (playbookStatus === 'REJECTED') {
        return 'red'
    } else if (playbookStatus === 'PENDING') {
        return 'blue'
    }
    return 'green'
}
