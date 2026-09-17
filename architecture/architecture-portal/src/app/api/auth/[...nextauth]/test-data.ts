// NOTE: AUTH_TEST_URLS.githubEnterpriseApiUrl must match the literal used in
// jest.mock('@/constants', ...) inside AuthOptions.test.ts, because mock factory
// functions cannot reference imported variables.
export const AUTH_TEST_URLS = {
    githubEnterpriseApiUrl: 'https://github.example.com',
    authorizePath: '/login/oauth/authorize',
    tokenPath: '/login/oauth/access_token',
    userinfoPath: '/api/v3/user'
}

export const AUTH_TEST_PROVIDER = {
    id: 'github-enterprise',
    name: 'GitHub Enterprise',
    type: 'oauth',
    scope: 'repo user:email'
}

export const AUTH_TEST_PROFILE = {
    withName: {
        id: 123,
        login: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        avatar_url: 'https://github.example.com/avatars/testuser'
    },
    withoutName: {
        id: 456,
        login: 'otheruser',
        name: null as null,
        email: 'other@example.com',
        avatar_url: 'https://github.example.com/avatars/otheruser'
    }
}

export const AUTH_TEST_TOKEN = {
    accessToken: 'ghp_test_access_token_abc123'
}
