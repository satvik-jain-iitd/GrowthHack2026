/* istanbul ignore file */
export function formatDuration(ms: number): string {
    if (!isFinite(ms) || ms < 0) return 'unknown'
    const totalSeconds = Math.round(ms / 1000)
    if (totalSeconds < 60)
        return `${totalSeconds} second${totalSeconds === 1 ? '' : 's'}`
    const totalMinutes = Math.floor(totalSeconds / 60)
    if (totalMinutes < 60)
        return `${totalMinutes} minute${totalMinutes === 1 ? '' : 's'}`
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    if (hours < 24) {
        return mins > 0
            ? `${hours}h ${mins}m`
            : `${hours} hour${hours === 1 ? '' : 's'}`
    }
    const days = Math.floor(hours / 24)
    const remHours = hours % 24
    return remHours > 0
        ? `${days}d ${remHours}h`
        : `${days} day${days === 1 ? '' : 's'}`
}
