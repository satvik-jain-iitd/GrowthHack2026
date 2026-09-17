/* istanbul ignore file */
import { ENVIRONMENT } from '@/constants'
import { getUserCountryCode } from './getUserCountryCode'
import { getUserLanguage } from './getUserLanguage'

const MAX_WAIT_MS = 10000 // 10 seconds

export function trackPage() {
    if (typeof window === 'undefined') return
    if (ENVIRONMENT === 'e0') {
        console.warn(
            '[trackPage] tracking is disabled in local environment (e0).'
        )
        return
    }

    const tryTrack = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (window as any)._satellite === 'undefined') {
            console.warn('[trackPage] _satellite not available after 10s.')
            return
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).digitalData = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...((window as any).digitalData ?? {}),
            version: '2.4',
            page: {
                pageInfo: {
                    country: getUserCountryCode(),
                    language: getUserLanguage(),
                    pageName: document.title
                },
                category: {
                    businessUnit: 'internal',
                    primaryCategory: 'explorer'
                },
                attributes: {
                    autotrack: false
                }
            }
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(window as any)._satellite.track('page')
        } catch (e) {
            console.error('failed to track page:', e)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (window as any)._satellite !== 'undefined') {
        tryTrack()
    } else {
        const interval = setInterval(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof (window as any)._satellite !== 'undefined') {
                clearTimeout(timeout)
                clearInterval(interval)
                tryTrack()
            }
        }, 100)
        const timeout = setTimeout(() => {
            clearInterval(interval)
            tryTrack()
        }, MAX_WAIT_MS)
    }
}
