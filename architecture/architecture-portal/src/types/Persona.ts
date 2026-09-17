export interface PersonaUserOptions {
    displayName: string
    userPrincipalName: string
}

export interface Persona {
    max_user_no: number
    persona_ds: string
    persona_id: string
    persona_nm: string
    userList: PersonaUserOptions[]
}

export interface UserPersona {
    persona_nm: string
    persona_id: string
    email: string
    name: string
    lastUpdatedTime: string
    max_user_limit?: number
    inherit: boolean
    showInput?: boolean
    fromParent?: boolean
    isEdit?: boolean
}
