import { OwnerPersona } from '@/app/shared/hooks'
import { InitiativeOwnerMM } from '@/app/shared/types/metamodel'

/**
 * Builds a lower-cased email -> display name lookup from metamodel owners.
 * Callers may layer additional selections on top of the returned map.
 */
export function buildNameByEmail(
    owners: InitiativeOwnerMM[] | undefined
): Map<string, string> {
    const nameByEmail = new Map<string, string>()
    owners?.forEach(owner => {
        if (owner.email && owner.name) {
            nameByEmail.set(owner.email.toLowerCase(), owner.name)
        }
    })
    return nameByEmail
}

/** Resolves an email into an owner persona, sourcing the name from the map. */
export function toOwnerPersona(
    email: string | null | undefined,
    nameByEmail: Map<string, string>
): OwnerPersona | null {
    if (!email) return null
    return { name: nameByEmail.get(email.toLowerCase()) ?? null, email }
}
