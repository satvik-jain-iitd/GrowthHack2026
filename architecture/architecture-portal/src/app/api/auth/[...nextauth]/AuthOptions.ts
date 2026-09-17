import {
    GITHUB_ENTERPRISE_URL,
    GITHUB_ENTERPRISE_API_URL,
    GITHUB_CLOUD_URL,
    GITHUB_CLOUD_API_URL,
    GITHUB_ENTERPRISE_PROVIDER_ID,
    GITHUB_CLOUD_PROVIDER_ID
} from '@/constants'
import { NextAuthOptions, Session, User } from 'next-auth'

/* --- Types augmentation for token/session --- */
declare module 'next-auth' {
    interface Session {
        accessToken?: string | null
        // you can add other fields here if desired (e.g., username, ghId)
    }

    interface User {
        // github profile fields if you want them strongly typed
        id?: string
        login?: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string
        // Store tokens indexed by provider (e.g., { 'github-enterprise': '...', 'github-cloud': '...' })
        tokens?: Record<string, string>
        // optionally store expiry/refresh token if available
        accessTokenExpires?: number
        refreshToken?: string
    }
}

export default {
    providers: [
        {
            // custom OAuth provider configuration for GitHub Enterprise
            id: GITHUB_ENTERPRISE_PROVIDER_ID,
            name: 'GitHub Enterprise',
            type: 'oauth',
            version: '2.0',
            // explicit authorization object with params ensures scope is sent on the initial redirect
            authorization: {
                url: `${GITHUB_ENTERPRISE_URL}/login/oauth/authorize`,
                params: { scope: 'repo user:email' }
            },
            token: `${GITHUB_ENTERPRISE_URL}/login/oauth/access_token`,
            userinfo: `${GITHUB_ENTERPRISE_API_URL}/user`,
            clientId: process.env.GITHUB_ENTERPRISE_CLIENT_ID,
            clientSecret: process.env.GITHUB_ENTERPRISE_CLIENT_SECRET,
            // request repo scope so user can fork/create branches/PRs
            scope: 'repo user:email',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            profile(profile: any) {
                // map the GHE user object to NextAuth user object
                return {
                    id: profile.id?.toString(),
                    name: profile.name ?? profile.login,
                    email: profile.email,
                    image: profile.avatar_url
                } as User
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any, // cast to any because NextAuth types for custom provider are flexible
        {
            // OAuth provider configuration for GitHub Cloud
            id: GITHUB_CLOUD_PROVIDER_ID,
            name: 'GitHub Cloud',
            type: 'oauth',
            version: '2.0',
            authorization: {
                url: `${GITHUB_CLOUD_URL}/login/oauth/authorize`,
                params: { scope: 'repo user:email' }
            },
            token: {
                url: `${GITHUB_CLOUD_URL}/login/oauth/access_token`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                async request(context: any) {
                    const tokenUrl = `${GITHUB_CLOUD_URL}/login/oauth/access_token`
                    const tokenParams = new URLSearchParams()
                    Object.entries(context?.params || {}).forEach(([k, v]) => {
                        if (v !== undefined && v !== null) {
                            tokenParams.set(k, String(v))
                        }
                    })

                    // In custom token request mode, ensure client credentials are present.
                    if (
                        !tokenParams.has('client_id') &&
                        process.env.GITHUB_CLOUD_CLIENT_ID
                    ) {
                        tokenParams.set(
                            'client_id',
                            process.env.GITHUB_CLOUD_CLIENT_ID
                        )
                    }
                    if (
                        !tokenParams.has('client_secret') &&
                        process.env.GITHUB_CLOUD_CLIENT_SECRET
                    ) {
                        tokenParams.set(
                            'client_secret',
                            process.env.GITHUB_CLOUD_CLIENT_SECRET
                        )
                    }
                    if (!tokenParams.has('grant_type')) {
                        tokenParams.set('grant_type', 'authorization_code')
                    }

                    const response = await fetch(tokenUrl, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: tokenParams.toString()
                    })

                    if (!response.ok) {
                        const detail = await response.text().catch(() => '')
                        throw new Error(
                            `GitHub Cloud token request failed with status ${response.status}${detail ? `: ${detail}` : ''}`
                        )
                    }

                    const tokens = await response.json()
                    return { tokens }
                }
            },
            userinfo: {
                url: `${GITHUB_CLOUD_API_URL}/user`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                async request(context: any) {
                    const accessToken =
                        context?.tokens?.access_token || context?.access_token

                    if (!accessToken) {
                        throw new Error(
                            'GitHub Cloud userinfo request failed: missing access token'
                        )
                    }
                    const requestInit: RequestInit = {
                        headers: {
                            Accept: 'application/vnd.github+json',
                            Authorization: `Bearer ${accessToken}`
                        }
                    }

                    const response = await fetch(
                        `${GITHUB_CLOUD_API_URL}/user`,
                        requestInit
                    )

                    if (!response.ok) {
                        const detail = await response.text().catch(() => '')
                        throw new Error(
                            `GitHub Cloud userinfo request failed with status ${response.status}${detail ? `: ${detail}` : ''}`
                        )
                    }

                    return response.json()
                }
            },
            clientId: process.env.GITHUB_CLOUD_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLOUD_CLIENT_SECRET,
            // request repo scope so user can fork/create branches/PRs
            scope: 'repo user:email',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            profile(profile: any) {
                // map the GitHub Cloud user object to NextAuth user object
                return {
                    id: profile.id?.toString(),
                    name: profile.name ?? profile.login,
                    email: profile.email,
                    image: profile.avatar_url
                } as User
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any // cast to any because NextAuth types for custom provider are flexible
    ],
    // Keep sessions as JWT (default). If you use a DB adapter, you can persist accounts there.
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        /**
         * jwt callback runs when encoding/decoding JWT.
         * We store tokens indexed by provider so users can authenticate with both GHE and Cloud.
         */
        async jwt({ token, account }) {
            // If this is a sign-in (account present), store the provider's token
            if (account?.access_token) {
                const provider = account.provider || 'github-enterprise'
                // Initialize tokens object if it doesn't exist
                if (!token.tokens) token.tokens = {}
                // Store this provider's token
                token.tokens[provider] = account.access_token as string
                // Keep accessToken for backwards compatibility (use the most recent one)
                token.accessToken = account.access_token as string
            }
            return token
        },
        /**
         * session callback exposes token fields to the client `useSession()` hook.
         * We expose both the current accessToken and the full tokens map.
         */
        async session({ session, token }) {
            session.accessToken = token.accessToken
            // Expose tokens map so client can check which providers are available
            if (token.tokens) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(session as any).tokens = token.tokens
            }
            return session as Session
        }
    },
    // Security: required for NextAuth to sign/encrypt tokens
    secret: process.env.NEXTAUTH_SECRET
} as NextAuthOptions
