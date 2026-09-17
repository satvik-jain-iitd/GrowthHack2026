import { SOURCE_HOST_CONFIG, SourceHost } from '@/constants'
import { fetchGithub } from './fetchGithub'
import { Logger } from './logger'

export type GithubFailureReason =
    | 'repo_inaccessible'
    | 'file_not_found'
    | 'rate_limited'
    | 'unauthorized'
    | 'unknown'

export type GithubFailure = {
    reason: GithubFailureReason
    status: number
    host: SourceHost
    owner: string
    repository: string
    filePath?: string
    repoUrl: string
}

// GitHub returns 404 (not 403) for repos a token cannot see, so a 404 needs a
// second call against the repo itself to tell "private" apart from "deleted".
async function probeRepository(
    host: SourceHost,
    owner: string,
    repository: string
): Promise<GithubFailureReason> {
    try {
        const probe = await fetchGithub(host, `/repos/${owner}/${repository}`, {
            next: { revalidate: 300 }
        })
        if (probe.ok) return 'file_not_found'
        if (probe.status === 404 || probe.status === 403)
            return 'repo_inaccessible'
        return 'unknown'
    } catch {
        return 'unknown'
    }
}

export async function diagnoseGithubFailure({
    host,
    owner,
    repository,
    filePath,
    response
}: {
    host: SourceHost
    owner: string
    repository: string
    filePath?: string
    response: Response
}): Promise<GithubFailure> {
    const status = response.status
    let reason: GithubFailureReason

    if (status === 403) {
        reason =
            response.headers.get('x-ratelimit-remaining') === '0'
                ? 'rate_limited'
                : 'repo_inaccessible'
    } else if (status === 401) {
        reason = 'unauthorized'
    } else if (status === 404) {
        reason = await probeRepository(host, owner, repository)
    } else {
        reason = 'unknown'
    }

    const failure: GithubFailure = {
        reason,
        status,
        host,
        owner,
        repository,
        filePath,
        repoUrl: `${SOURCE_HOST_CONFIG[host].url}/${owner}/${repository}`
    }

    const resource = filePath
        ? `/repos/${owner}/${repository}/contents/${filePath}`
        : `/repos/${owner}/${repository}`

    Logger.error(
        `Failed to fetch file content from GitHub: [${host}] ${resource} [${status}]`,
        failure
    )

    return failure
}
