import authOptions from './AuthOptions'
import type { Account, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import { AUTH_TEST_PROFILE, AUTH_TEST_TOKEN } from './test-data'

// next-auth's dependency chain (openid-client → jose) uses ESM syntax which
// Babel cannot transform from node_modules. Mock the entire package so Jest
// never attempts to load it; all imported values are TypeScript-only types
// that get erased after Babel compilation anyway.
jest.mock('next-auth', () => ({}))

// Literal must match AUTH_TEST_URLS.githubEnterpriseApiUrl — mock factories cannot
// reference imported variables because they are hoisted before module resolution.
jest.mock('@/constants', () => ({
    GITHUB_ENTERPRISE_URL: 'https://github.example.com',
    GITHUB_ENTERPRISE_API_URL: 'https://github.example.com/api/v3',
    GITHUB_CLOUD_URL: 'https://github.com',
    GITHUB_CLOUD_API_URL: 'https://api.github.com',
    GITHUB_ENTERPRISE_PROVIDER_ID: 'github-enterprise',
    GITHUB_CLOUD_PROVIDER_ID: 'github-cloud'
}))

// OAuthConfig is the correct type for a custom OAuth provider in next-auth
const gheProvider = authOptions.providers[0] as {
    id: string
    name: string
    type: string
    authorization: { url: string; params: { scope: string } }
    token: string
    userinfo: string
    clientId: string | undefined
    clientSecret: string | undefined
    profile: (profile: Record<string, unknown>) => {
        id: string
        name: string
        email: string
        image: string
    }
}

const ghcProvider = authOptions.providers[1] as {
    id: string
    name: string
    type: string
    authorization: { url: string; params: { scope: string } }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    token: string | { url: string; request: (...args: any[]) => Promise<any> }
    userinfo:
        | string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | { url: string; request: (...args: any[]) => Promise<any> }
    clientId: string | undefined
    clientSecret: string | undefined
    profile: (profile: Record<string, unknown>) => {
        id: string
        name: string
        email: string
        image: string
    }
}

const jwtCallback = authOptions.callbacks?.jwt as (params: {
    token: JWT
    account: Account | null
}) => Promise<JWT>

const sessionCallback = authOptions.callbacks?.session as (params: {
    session: Session
    token: JWT
}) => Promise<Session>

describe('AuthOptions', () => {
    describe('provider configuration', () => {
        it('registers two providers', () => {
            expect(authOptions.providers).toHaveLength(2)
        })

        describe('GitHub Enterprise provider', () => {
            it('has the correct provider id', () => {
                expect(gheProvider.id).toBe('github-enterprise')
            })

            it('has the correct provider name', () => {
                expect(gheProvider.name).toBe('GitHub Enterprise')
            })

            it('has the correct provider type', () => {
                expect(gheProvider.type).toBe('oauth')
            })

            it('builds the authorization URL correctly', () => {
                expect(gheProvider.authorization.url).toBe(
                    'https://github.example.com/login/oauth/authorize'
                )
            })

            it('includes the correct authorization scope params', () => {
                expect(gheProvider.authorization.params.scope).toBe(
                    'repo user:email'
                )
            })

            it('builds the token URL correctly', () => {
                expect(gheProvider.token).toBe(
                    'https://github.example.com/login/oauth/access_token'
                )
            })

            it('builds the userinfo URL correctly', () => {
                expect(gheProvider.userinfo).toBe(
                    'https://github.example.com/api/v3/user'
                )
            })

            it('reads clientId from process.env.GITHUB_ENTERPRISE_CLIENT_ID', () => {
                expect(gheProvider.clientId).toBe(
                    process.env.GITHUB_ENTERPRISE_CLIENT_ID
                )
            })

            it('reads clientSecret from process.env.GITHUB_ENTERPRISE_CLIENT_SECRET', () => {
                expect(gheProvider.clientSecret).toBe(
                    process.env.GITHUB_ENTERPRISE_CLIENT_SECRET
                )
            })
        })

        describe('GitHub Cloud provider', () => {
            it('has the correct provider id', () => {
                expect(ghcProvider.id).toBe('github-cloud')
            })

            it('has the correct provider name', () => {
                expect(ghcProvider.name).toBe('GitHub Cloud')
            })

            it('has the correct provider type', () => {
                expect(ghcProvider.type).toBe('oauth')
            })

            it('builds the authorization URL correctly', () => {
                expect(ghcProvider.authorization.url).toBe(
                    'https://github.com/login/oauth/authorize'
                )
            })

            it('includes the correct authorization scope params', () => {
                expect(ghcProvider.authorization.params.scope).toBe(
                    'repo user:email'
                )
            })

            it('builds the token URL correctly', () => {
                expect(typeof ghcProvider.token).toBe('object')
                expect((ghcProvider.token as { url: string }).url).toBe(
                    'https://github.com/login/oauth/access_token'
                )
            })

            it('builds the userinfo URL correctly', () => {
                expect(typeof ghcProvider.userinfo).toBe('object')
                expect((ghcProvider.userinfo as { url: string }).url).toBe(
                    'https://api.github.com/user'
                )
            })

            it('reads clientId from process.env.GITHUB_CLOUD_CLIENT_ID', () => {
                expect(ghcProvider.clientId).toBe(
                    process.env.GITHUB_CLOUD_CLIENT_ID
                )
            })

            it('reads clientSecret from process.env.GITHUB_CLOUD_CLIENT_SECRET', () => {
                expect(ghcProvider.clientSecret).toBe(
                    process.env.GITHUB_CLOUD_CLIENT_SECRET
                )
            })
        })
    })

    describe('provider.profile()', () => {
        it('maps id as a string for GHE', () => {
            const result = gheProvider.profile(AUTH_TEST_PROFILE.withName)
            expect(result.id).toBe(String(AUTH_TEST_PROFILE.withName.id))
        })

        it('uses profile.name when present for GHE', () => {
            const result = gheProvider.profile(AUTH_TEST_PROFILE.withName)
            expect(result.name).toBe(AUTH_TEST_PROFILE.withName.name)
        })

        it('falls back to profile.login when name is null for GHE', () => {
            const result = gheProvider.profile(AUTH_TEST_PROFILE.withoutName)
            expect(result.name).toBe(AUTH_TEST_PROFILE.withoutName.login)
        })

        it('maps email from profile.email for GHE', () => {
            const result = gheProvider.profile(AUTH_TEST_PROFILE.withName)
            expect(result.email).toBe(AUTH_TEST_PROFILE.withName.email)
        })

        it('maps image from profile.avatar_url for GHE', () => {
            const result = gheProvider.profile(AUTH_TEST_PROFILE.withName)
            expect(result.image).toBe(AUTH_TEST_PROFILE.withName.avatar_url)
        })

        it('maps id as a string for GHC', () => {
            const result = ghcProvider.profile(AUTH_TEST_PROFILE.withName)
            expect(result.id).toBe(String(AUTH_TEST_PROFILE.withName.id))
        })

        it('uses profile.name when present for GHC', () => {
            const result = ghcProvider.profile(AUTH_TEST_PROFILE.withName)
            expect(result.name).toBe(AUTH_TEST_PROFILE.withName.name)
        })
    })

    describe('session configuration', () => {
        it('uses JWT session strategy', () => {
            expect(authOptions.session?.strategy).toBe('jwt')
        })
    })

    describe('jwt callback', () => {
        it('stores access_token from account into the JWT indexed by provider', async () => {
            const token: JWT = {}
            const account: Account = {
                access_token: AUTH_TEST_TOKEN.accessToken,
                providerAccountId: 'test-id',
                type: 'oauth',
                provider: 'github-enterprise'
            }
            const result = await jwtCallback({ token, account })
            // Should store in tokens object indexed by provider
            expect(result.tokens?.['github-enterprise']).toBe(
                AUTH_TEST_TOKEN.accessToken
            )
            // Should also keep accessToken for backwards compatibility
            expect(result.accessToken).toBe(AUTH_TEST_TOKEN.accessToken)
        })

        it('handles multiple provider tokens in the same JWT', async () => {
            let token: JWT = {}

            // First sign-in with GHE
            const gheAccount: Account = {
                access_token: 'ghe-token-123',
                providerAccountId: 'ghe-id',
                type: 'oauth',
                provider: 'github-enterprise'
            }
            token = await jwtCallback({ token, account: gheAccount })
            expect(token.tokens?.['github-enterprise']).toBe('ghe-token-123')

            // Second sign-in with GHC
            const ghcAccount: Account = {
                access_token: 'ghc-token-456',
                providerAccountId: 'ghc-id',
                type: 'oauth',
                provider: 'github-cloud'
            }
            token = await jwtCallback({ token, account: ghcAccount })
            // Both tokens should be present
            expect(token.tokens?.['github-enterprise']).toBe('ghe-token-123')
            expect(token.tokens?.['github-cloud']).toBe('ghc-token-456')
        })

        it('returns token unchanged when account has no access_token', async () => {
            const token: JWT = { sub: 'user-123' }
            const account: Account = {
                providerAccountId: 'test-id',
                type: 'oauth',
                provider: 'github-enterprise'
            }
            const result = await jwtCallback({ token, account })
            expect(result).toEqual(token)
        })

        it('returns token unchanged when account is null', async () => {
            const token: JWT = { sub: 'user-123' }
            const result = await jwtCallback({ token, account: null })
            expect(result).toEqual(token)
        })

        it('returns token unchanged when no account is provided', async () => {
            const token: JWT = { sub: 'user-123' }
            const result = await jwtCallback({ token, account: null })
            expect(result).toEqual(token)
        })
    })

    describe('session callback', () => {
        it('exposes accessToken from JWT to the client session', async () => {
            const session: Session = { user: {}, expires: '2099-01-01' }
            const token: JWT = { accessToken: AUTH_TEST_TOKEN.accessToken }
            const result = await sessionCallback({ session, token })
            expect(result.accessToken).toBe(AUTH_TEST_TOKEN.accessToken)
        })

        it('exposes tokens map from JWT to the client session', async () => {
            const session: Session = { user: {}, expires: '2099-01-01' }
            const token: JWT = {
                tokens: {
                    'github-enterprise': 'ghe-token-123',
                    'github-cloud': 'ghc-token-456'
                }
            }
            const result = await sessionCallback({ session, token })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((result as any).tokens?.['github-enterprise']).toBe(
                'ghe-token-123'
            )
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((result as any).tokens?.['github-cloud']).toBe(
                'ghc-token-456'
            )
        })
    })

    describe('secret', () => {
        it('reads secret from process.env.NEXTAUTH_SECRET', () => {
            expect(authOptions.secret).toBe(process.env.NEXTAUTH_SECRET)
        })
    })
})
