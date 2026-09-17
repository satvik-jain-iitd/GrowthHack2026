import { buildNameByEmail, toOwnerPersona } from './ownerPersona'
import { InitiativeOwnerMM } from '@/app/shared/types/metamodel'

describe('buildNameByEmail', () => {
    it('maps lower-cased emails to names, skipping entries missing either field', () => {
        const owners: InitiativeOwnerMM[] = [
            { title: 'Unit CIO', name: 'CIO User', email: 'CIO@test.com' },
            { title: 'Tech VP', name: null, email: 'vp@test.com' },
            { title: 'Head Engineer', name: 'HE User', email: null }
        ]
        const map = buildNameByEmail(owners)
        expect(map.get('cio@test.com')).toBe('CIO User')
        expect(map.has('vp@test.com')).toBe(false)
        expect(map.size).toBe(1)
    })

    it('returns an empty map when owners are undefined', () => {
        expect(buildNameByEmail(undefined).size).toBe(0)
    })
})

describe('toOwnerPersona', () => {
    const map = new Map<string, string>([['cio@test.com', 'CIO User']])

    it('returns null for empty email', () => {
        expect(toOwnerPersona('', map)).toBeNull()
        expect(toOwnerPersona(null, map)).toBeNull()
        expect(toOwnerPersona(undefined, map)).toBeNull()
    })

    it('resolves the name from the map, case-insensitively', () => {
        expect(toOwnerPersona('CIO@test.com', map)).toEqual({
            name: 'CIO User',
            email: 'CIO@test.com'
        })
    })

    it('returns a null name when the email is not in the map', () => {
        expect(toOwnerPersona('new@test.com', map)).toEqual({
            name: null,
            email: 'new@test.com'
        })
    })
})
