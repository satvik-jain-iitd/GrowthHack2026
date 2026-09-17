/* istanbul ignore file */
'use client'
import React, { useEffect } from 'react'
import { adsUserAttributes, AuthBlueProvider } from 'use-authblue-sso'
import { AUTH_BLUE_API_URL, ENVIRONMENT } from '@/constants'
import { fetchWithToken } from '@/utils/client'

/**
 * Please review the scope documentation and configure the scope according to your application's needs
 * @see https://github.aexp.com/pages/amex-eng/authblue-documentation/docs/software/use-authblue-sso/
 */
const userAttributesAndGroupsToCollect = {
    attributes: [
        adsUserAttributes.fullName,
        adsUserAttributes.firstName,
        adsUserAttributes.department,
        adsUserAttributes.email,
        adsUserAttributes.managerDistinguishedName,
        adsUserAttributes.adsId,
        adsUserAttributes.guid
    ],
    groups: [
        'Arch_Portal_Eng',
        'GG-AXP-ARCH-PORTAL-ADMIN',
        'GG-AXP-ARCH-PORTAL-PILOT',
        'GG-Apptio-Target-Process-Admin',
        'GG-Apptio-Target-Process-Central-Financial-Planning',
        'GG-Apptio-Target-Process-User-Demand-Approver',
        'GG-Apptio-Target-Process-User-Governance-Approver',
        'GG-Apptio-Target-Process-User-Idea-Submitter',
        'GG-Apptio-Target-Process-User-Portfolio',
        'GG-Apptio-Target-Process-User-Product-Tooling',
        'GG-Apptio-Target-Process-User-Sizing-Contributor',
        'GG-Apptio-Target-Process-User-Central-Financial-Planning',
        'E1_PTB_TEST_GROUP'
    ]
}

export type User = {
    attributes: {
        fullName: string
        department: string
        email: string
        managerDistinguishedName: string
        adsId: string
        guid: string
        firstName: string
    }
    userDirectoryAccess: { admin: boolean; domains: string[]; ebc: string[] }
    groups: string[]
    userInfo: {
        jobTitle: string
        displayName: string
        userPrincipalName: string
        extension_ee871ce5fcfd4b20869cbd9d712306f7_axppband: string
    }
    isApplicationUnlinkedCD: boolean
    setAppUnlinkedCD: (value: boolean) => void
    isAddEditOwnerUpdated: boolean
    setIsAddEditOwnerUpdated: (value: boolean) => void
}

export const useAuthBlueSession = () => {
    useEffect(() => {
        let intervalId = null

        const refreshSession = () => {
            fetchWithToken(
                `${AUTH_BLUE_API_URL}/v1/session?refreshNeeded=true`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            )
                .then(response => response.json())
                .catch(error => {
                    console.error('Error fetching user session:', error)
                })
        }

        if (!intervalId) {
            intervalId = setInterval(refreshSession, 1000 * 60 * 20)
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [])
}

export default function AuthBlueSso({
    children
}: {
    children: React.ReactNode
}) {
    function LoaderComponent() {
        return children
    }

    return (
        <AuthBlueProvider
            env={ENVIRONMENT}
            scope={userAttributesAndGroupsToCollect}
            customLoaderComponent={LoaderComponent}
        >
            {children}
        </AuthBlueProvider>
    )
}
