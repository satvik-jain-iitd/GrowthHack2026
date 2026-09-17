import { useMemo } from 'react'
import { useUserContext } from '@/context'
import { User } from '@/app/layout/AuthBlueSso'
import { showAdmin } from '@/app/admin/utils'

export const useUserDetails = () => {
    const user: User | undefined = useUserContext()

    return useMemo(() => {
        const isAdmin =
            (user?.userDirectoryAccess?.admin ||
                showAdmin(user?.groups || [])) ??
            false
        const domainOwner = user?.userDirectoryAccess?.domains ?? []
        const loggedInUserEmail = user?.attributes?.email?.toLowerCase() || ''

        return {
            user,
            isAdmin,
            domainOwner,
            loggedInUserEmail
        }
    }, [user])
}
