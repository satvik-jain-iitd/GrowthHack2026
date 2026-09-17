export const CONTENTS_TEST_PARAMS = {
    owner: 'test-org',
    repo: 'test-repo',
    filePath: 'docs/guide.md',
    pathParts: ['docs', 'guide.md'],
    emptyPath: undefined as undefined,
    newBranchPrefix: 'edit-'
}

export const CONTENTS_TEST_AUTH = {
    accessToken: 'ghp_test_token_abc123',
    userLogin: 'testuser'
}

export const CONTENTS_TEST_SHAS = {
    baseSha: 'abc123sha456',
    fileSha: 'fileSha789'
}

export const CONTENTS_TEST_URLS = {
    userEndpoint: '/user',
    forkCheck: `/repos/${CONTENTS_TEST_AUTH.userLogin}/${CONTENTS_TEST_PARAMS.repo}`,
    repoForks: `/repos/${CONTENTS_TEST_PARAMS.owner}/${CONTENTS_TEST_PARAMS.repo}/forks`,
    baseRef: `/repos/${CONTENTS_TEST_PARAMS.owner}/${CONTENTS_TEST_PARAMS.repo}/git/ref/heads/main`,
    upstreamPulls: `/repos/${CONTENTS_TEST_PARAMS.owner}/${CONTENTS_TEST_PARAMS.repo}/pulls`,
    fileContent: `/repos/${CONTENTS_TEST_PARAMS.owner}/${CONTENTS_TEST_PARAMS.repo}/contents/${CONTENTS_TEST_PARAMS.filePath}`
}

export const CONTENTS_TEST_ERRORS = {
    fetchGithubFailed: 'Failed to fetch content from GitHub',
    notAuthenticated: 'Not authenticated',
    failedReadUser: 'Failed to read current user',
    failedForkRepo: 'Failed to fork repo',
    timedOutFork: 'Timed out waiting for fork to be ready',
    timedOutForkRefs: 'Timed out waiting for fork refs to be readable',
    failedBaseRef: 'Failed to get base ref from upstream',
    baseSHAMissing: 'Base SHA missing in upstream ref response',
    failedCreateBranch: 'Failed to create branch on fork after retries',
    failedUpdateFile: 'Failed to update/create file on fork',
    failedCreatePR: 'Failed to create PR',
    failedCheckForkSha: 'Failed to check fork for base SHA'
}

export const CONTENTS_TEST_PR = {
    htmlUrl: 'https://github.example.com/test-org/test-repo/pull/42',
    number: 42
}
