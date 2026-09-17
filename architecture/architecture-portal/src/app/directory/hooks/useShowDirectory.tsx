/* istanbul ignore file */
import { featureFlags } from '@/constants'

export const useShowDirectory = () => {
    const showDirectory = featureFlags.enableDirectoryMVP1Changes
    return showDirectory
}
