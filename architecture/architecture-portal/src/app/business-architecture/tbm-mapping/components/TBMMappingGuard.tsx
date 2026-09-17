'use client'
import React, { PropsWithChildren, FC } from 'react'
import { useAuthBlueSso } from 'use-authblue-sso'
import { useUserContext } from '@/context/UserContext'
import { showAdmin } from '@/app/admin/utils'
import { AccessDeniedState } from './AccessDeniedState'
import { CapabilityLoadingSpinner } from './CapabilityLoadingSpinner'
import { TBM_ALLOWED_GROUPS } from '@/app/business-architecture/tbm-mapping/constants'

export const TBMMappingGuard: FC<PropsWithChildren> = ({ children }) => {
    const { isLoaded } = useAuthBlueSso()
    const user = useUserContext()
    const groups = user?.groups || []
    const userHasAccess =
        showAdmin(groups) || TBM_ALLOWED_GROUPS.some(g => groups.includes(g))

    if (!isLoaded) {
        return (
            <CapabilityLoadingSpinner text='Loading Enterprise Customer Journeys...' />
        )
    }

    return userHasAccess ? <>{children}</> : <AccessDeniedState />
}
