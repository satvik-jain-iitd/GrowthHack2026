/* istanbul ignore file */
'use client'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'
import { useEffect, useState } from 'react'

export const useUserPrivileges = (email: string) => {
    const [userDirectoryAccess, setUserDirectoryAccess] = useState({
        domains: [],
        ebc: [],
        admin: false
    })

    useEffect(() => {
        if (!email) return
        let isMounted = true
        fetchWithToken(API_ENDPOINTS.DIRECTORY_USER, {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(resp => resp.json())
            .then(access => {
                if (isMounted) {
                    setUserDirectoryAccess(prev => ({
                        domains: access?.data?.[0]?.domains ?? prev.domains,
                        ebc: access?.data?.[1]?.capabilities ?? prev.ebc,
                        admin: access?.data?.[2]?.admin ?? prev.admin
                    }))
                }
            })
        return () => {
            isMounted = false
        }
    }, [email])

    return userDirectoryAccess
}
