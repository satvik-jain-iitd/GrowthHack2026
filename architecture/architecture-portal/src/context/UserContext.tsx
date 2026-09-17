/* istanbul ignore file */
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthBlueSso } from 'use-authblue-sso'
import { useAuthBlueSession, User } from '@/app/layout/AuthBlueSso'
import { useUserPrivileges } from '@/app/company-domains/hooks/useUserPrivileges'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export const UserContext = createContext<User | undefined>(undefined)

export function useUserContext(): User | undefined {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error('useUserContext must be used within UserProvider')
    return ctx
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuthBlueSso()
    const userDirectoryAccess = useUserPrivileges(user?.attributes?.email)
    const [userInfo, setUserInfo] = useState()
    const [isApplicationUnlinkedCD, setAppUnlinkedCD] = useState(false)
    const [isAddEditOwnerUpdated, setIsAddEditOwnerUpdated] = useState(false)
    const email = user?.attributes?.email

    useEffect(() => {
        if (email) {
            fetchWithToken(API_ENDPOINTS.GET_USER_INFO(email))
                .then(res => res.json())
                .then(data => {
                    setUserInfo(data)
                })
        }
    }, [email])

    useAuthBlueSession()

    return (
        <UserContext.Provider
            value={{
                ...user,
                userDirectoryAccess,
                userInfo,
                isApplicationUnlinkedCD,
                setAppUnlinkedCD,
                isAddEditOwnerUpdated,
                setIsAddEditOwnerUpdated
            }}
        >
            {children}
        </UserContext.Provider>
    )
}
