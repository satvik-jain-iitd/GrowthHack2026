import NextAuth from 'next-auth'
import AuthOptions from '@/app/api/auth/[...nextauth]/AuthOptions'

/**
 * NextAuth handler for App Router.
 * Export GET/POST so Next.js can route requests to NextAuth.
 */
const handler = NextAuth(AuthOptions)
export { handler as GET, handler as POST }
