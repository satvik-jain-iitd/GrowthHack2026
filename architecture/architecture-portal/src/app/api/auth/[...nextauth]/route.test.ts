import { GET, POST } from './route'

jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn((options: unknown) => ({
        __authOptions: options,
        _isNextAuthHandler: true
    }))
}))

jest.mock('@/constants', () => ({
    GITHUB_ENTERPRISE_URL: 'https://github.example.com',
    GITHUB_ENTERPRISE_API_URL: 'https://github.example.com/api/v3',
    GITHUB_CLOUD_URL: 'https://github.com',
    GITHUB_CLOUD_API_URL: 'https://api.github.com',
    GITHUB_ENTERPRISE_PROVIDER_ID: 'github-enterprise',
    GITHUB_CLOUD_PROVIDER_ID: 'github-cloud'
}))

jest.mock('@/app/api/auth/[...nextauth]/AuthOptions', () => ({
    __esModule: true,
    default: { session: { strategy: 'jwt' } }
}))

// re-import to get a fresh module after mocks are in place
// eslint-disable-next-line @typescript-eslint/no-require-imports
const NextAuth = require('next-auth').default

describe('auth route', () => {
    it('creates the handler by calling NextAuth with AuthOptions', () => {
        expect(NextAuth).toHaveBeenCalledTimes(1)
        expect(NextAuth).toHaveBeenCalledWith({ session: { strategy: 'jwt' } })
    })

    it('exports GET', () => {
        expect(GET).toBeDefined()
    })

    it('exports POST', () => {
        expect(POST).toBeDefined()
    })

    it('GET and POST are the same handler', () => {
        expect(GET).toBe(POST)
    })
})
