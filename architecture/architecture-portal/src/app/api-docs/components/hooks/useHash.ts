/* istanbul ignore file */

import { useSyncExternalStore } from 'react'

const subscribe = (onChange: () => void) => {
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
}

const getSnapshot = () => window.location.hash.slice(1)

const getServerSnapshot = () => ''

export const useHash = () =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
