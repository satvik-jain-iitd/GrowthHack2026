/* istanbul ignore file */
import { Markets } from '../types'

export const parseMarketEnablement = (marketEnablement: Markets[]) => {
    const res = Array.isArray(marketEnablement)
        ? marketEnablement
        : marketEnablement && typeof marketEnablement === 'string'
          ? (() => {
                try {
                    return JSON.parse(marketEnablement ?? '[]')
                } catch {
                    return []
                }
            })()
          : []
    return res
}
