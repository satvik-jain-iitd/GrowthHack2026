/* istanbul ignore file */
'use client'
import { Persona, UserPersona } from '@/types/Persona'
import { API_ENDPOINTS } from '@/constants'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUserContext } from './UserContext'
import { User } from '@/app/layout/AuthBlueSso'
import { showAdmin } from '@/app/admin/utils'
import { fetchWithToken } from '@/utils/client'

interface AdminPlaybook {
    playbook_id: string
    playbook_nm: string
}

interface Admin {
    selectedPlaybook: AdminPlaybook | undefined
    setSelectedPlaybook: (_playbook: AdminPlaybook) => void
    expandedPlaybook: string[] | undefined
    setExpandedPlaybook: (_playbook_id: string[]) => void
    selectedType: string | undefined
    setSelectedType: (_type: string) => void
    persona: Persona[] | undefined
    getUserData: () => void
    getCountOfPersona: (_persona_nm: string) => number
    playbookUsers: UserPersona[]
    setPlaybookUsers: (_userPersona: UserPersona[]) => void
    loading: boolean | string
    setLoading: (_loading: boolean) => void
    currentEditedUser: UserPersona | undefined
    setCurrentEditedUser: (_user: UserPersona) => void
    onClickSave: (_userIndex: number) => void
    deleteUser: (_userIndex: number) => void
}

export const AdminContext = createContext<Admin | undefined>(undefined)

export function useAdminContext(): Admin | undefined {
    const ctx = useContext(AdminContext)
    if (!ctx)
        throw new Error('useAdminContext must be used within UserProvider')
    return ctx
}

export function AdminProvider({
    children,
    selectedCategory
}: {
    children: React.ReactNode
    selectedCategory: string
}) {
    const [selectedPlaybook, setSelectedPlaybook] = useState<AdminPlaybook>()
    const [expandedPlaybook, setExpandedPlaybook] = useState<string[]>([])
    const [selectedType, setSelectedType] = useState<string>()
    const [persona, setPersona] = useState<Persona[]>()
    const [loading, setLoading] = useState<boolean | string>(false)
    const [playbookUsers, setPlaybookUsers] = useState<UserPersona[]>([])
    const [currentEditedUser, setCurrentEditedUser] = useState<UserPersona>()

    const user: User | undefined = useUserContext()
    const isAdminEnabled = showAdmin(user?.groups || [])

    const getPersona = () => {
        fetchWithToken(API_ENDPOINTS.GET_PERSONA)
            .then(res => res.json())
            .then(data => {
                setPersona(data.data)
            })
    }

    useEffect(() => {
        getPersona()
    }, [])

    useEffect(() => {
        if (selectedCategory != selectedType) {
            setSelectedType(selectedCategory)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory])

    const getUserData = () => {
        if (selectedPlaybook?.playbook_id) {
            setLoading(selectedPlaybook.playbook_id)
            fetchWithToken(
                API_ENDPOINTS.GET_USER_BY_PLAYBOOK_ID(
                    selectedPlaybook.playbook_id
                )
            )
                .then(res => res.json())
                .then(({ data }) => {
                    setPlaybookUsers(data)
                })
                .catch(e => console.error(e))
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    const getCountOfPersona = (personaName: string) => {
        return playbookUsers.filter(
            pu =>
                pu.email != '' && pu.persona_nm == personaName && !pu.fromParent
        ).length
    }

    const onClickSave = async (userIndex: number) => {
        setLoading(true)
        const {
            email,
            isEdit,
            fromParent,
            inherit,
            persona_id: editedUserPersonaId
        } = playbookUsers[userIndex]

        if (isEdit && !fromParent) {
            const payload = {
                playbookId: selectedPlaybook?.playbook_id,
                oldUserEmail: currentEditedUser?.email,
                newUserEmail: email,
                adminEmail: user?.attributes?.email,
                personaId: editedUserPersonaId,
                inherit: inherit
            }

            fetchWithToken(`${API_ENDPOINTS.ADMIN_USER}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(() => {
                    setLoading(selectedPlaybook?.playbook_id || '')
                    getPersona()
                    getUserData()
                })
                .catch(e => console.error(e))
        } else {
            const payload = {
                playbookId: selectedPlaybook?.playbook_id,
                userEmail: email,
                adminEmail: user?.attributes?.email,
                personaId: editedUserPersonaId,
                inherit: inherit
            }

            fetchWithToken(`${API_ENDPOINTS.ADMIN_USER}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(() => {
                    setLoading(selectedPlaybook?.playbook_id || '')
                    getPersona()
                    getUserData()
                })
                .catch(e => console.error(e))
        }
    }

    const deleteUser = async (userIndex: number) => {
        setLoading(true)

        const { email, persona_id } = playbookUsers[userIndex]

        const payload = {
            playbookId: selectedPlaybook?.playbook_id,
            adminEmail: user?.attributes?.email,
            emailId: email,
            personaId: persona_id
        }

        try {
            const response = await fetchWithToken(
                `${API_ENDPOINTS.ADMIN_USER}`,
                {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            )
            const data = await response.json()
            return data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
            getPersona()
            getUserData()
        }
    }

    return (
        <AdminContext.Provider
            value={{
                selectedPlaybook,
                setSelectedPlaybook,
                expandedPlaybook,
                setExpandedPlaybook,
                selectedType,
                setSelectedType,
                persona,
                getUserData,
                getCountOfPersona,
                playbookUsers,
                setPlaybookUsers,
                loading,
                setLoading,
                currentEditedUser,
                setCurrentEditedUser,
                onClickSave,
                deleteUser
            }}
        >
            {isAdminEnabled && children}
        </AdminContext.Provider>
    )
}
