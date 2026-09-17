import mime from 'mime'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { fetchGithub, Logger } from '@/utils/server'
import { SOURCE_HOST, SOURCE_HOST_CONFIG, SourceHost } from '@/constants'
import AuthOptions from '@/app/api/auth/[...nextauth]/AuthOptions'

export async function GET(
    request: Request,
    context: {
        params: Promise<{ owner: string; repo: string; path?: string[] }>
    }
) {
    const { owner, repo, path } = await context.params
    // Build the file path
    let filePath = ''
    if (Array.isArray(path) && path.length > 0) {
        filePath = path.join('/')
    }

    // Resolve the GitHub host from the query param (default: ghe)
    const host = (new URL(request.url).searchParams.get('host') ??
        'ghe') as SourceHost

    const response = await fetchGithub(
        host,
        `/repos/${owner}/${repo}/contents/${filePath}`,
        {
            next: {
                revalidate: 3600 // 1 hour (in seconds), matches Redis TTL
            },
            headers: {
                Accept: 'application/vnd.github.v3.raw'
            }
        }
    )

    if (!response?.ok) {
        return NextResponse.json(
            {
                error: 'Failed to fetch content from GitHub'
            },
            {
                status: response?.status
            }
        )
    }

    // Stream the response body for binary files
    return new NextResponse(response.body, {
        status: 200,
        headers: {
            'content-type':
                mime.getType(filePath) || 'application/octet-stream',
            'cache-control': 'public, max-age=3600, immutable' // 1 hour (in seconds)
        }
    })
}

export async function POST(
    request: Request,
    context: {
        params: Promise<{ owner: string; repo: string; path?: string[] }>
    }
) {
    try {
        const session = await getServerSession(AuthOptions)

        const { owner, repo, path } = await context.params
        const {
            content,
            host = 'ghe'
        }: { content: string; host?: SourceHost } = await request.json()

        // Select the token for the specific host
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tokens = (session as any)?.tokens || {}
        const providerForHost = SOURCE_HOST_CONFIG[host].providerId
        const token = tokens[providerForHost] || session?.accessToken
        const baseUrl = SOURCE_HOST_CONFIG[host].url

        if (!token) {
            Logger.error(
                `[WYSIWYG] Not authenticated (401): no token for host=${host}`,
                {
                    request,
                    context
                }
            )
            return NextResponse.json(
                {
                    error: `Not authenticated for ${host === SOURCE_HOST.GHC ? 'GitHub Cloud' : 'GitHub Enterprise'}`
                },
                { status: 401 }
            )
        }

        let filePath = ''
        if (Array.isArray(path) && path.length > 0) {
            filePath = path.join('/')
        }

        Logger.info(
            `[WYSIWYG] Start: owner=${owner} repo=${repo} path=${filePath} host=${host}`
        )

        // 0) get current user's login (needed to check for existing fork and naming)
        const meRes = await fetchGithub(host, `/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json'
            },
            next: {
                revalidate: 0
            }
        })

        if (!meRes?.ok) {
            const txt = await (meRes
                ? meRes.text()
                : Promise.resolve('no-response'))
            Logger.error(
                `[WYSIWYG] Failed to fetch current user: ${meRes?.status} ${txt}`,
                {
                    request,
                    context
                }
            )
            return NextResponse.json(
                { error: 'Failed to read current user', details: txt },
                { status: meRes?.status || 500 }
            )
        }

        const me = await meRes.json()
        const myLogin = me.login
        Logger.info(`[WYSIWYG] Current user: ${myLogin}`)

        // 1) Check if a fork already exists for this user -> GET /repos/:myLogin/:repo
        const forkOwner = myLogin
        const forkCheck = await fetchGithub(
            host,
            `/repos/${forkOwner}/${repo}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json'
                },
                next: {
                    revalidate: 0
                }
            }
        )

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let forkMeta: any = undefined
        if (forkCheck && forkCheck.ok) {
            forkMeta = await forkCheck.json()
            Logger.info(
                `[WYSIWYG] Fork already exists for user: ${forkOwner}/${repo}`
            )
        } else {
            // 1b) Create fork because it doesn't exist
            Logger.info(
                `[WYSIWYG] Creating fork for ${owner}/${repo} -> user ${forkOwner}`
            )
            const forkRes = await fetchGithub(
                host,
                `/repos/${owner}/${repo}/forks`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/vnd.github+json'
                    },
                    next: {
                        revalidate: 0
                    }
                }
            )

            if (!forkRes?.ok && forkRes?.status !== 202) {
                const txt = await (forkRes
                    ? forkRes.text()
                    : Promise.resolve('no-response'))
                Logger.error(
                    `[WYSIWYG] Fork creation failed: ${forkRes?.status} ${txt}`,
                    {
                        request,
                        context
                    }
                )
                return NextResponse.json(
                    { error: 'Failed to fork repo', details: txt },
                    { status: forkRes?.status || 500 }
                )
            }

            // 1c) poll until fork exists (forking is occasionally async)
            const maxAttempts = 10
            let attempt = 0
            let forkReady = false
            const sleep = (ms: number) =>
                new Promise(resolve => setTimeout(resolve, ms))
            while (attempt < maxAttempts) {
                const check = await fetchGithub(
                    host,
                    `/repos/${forkOwner}/${repo}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/vnd.github+json'
                        },
                        next: {
                            revalidate: 0
                        }
                    }
                )

                if (check?.ok) {
                    forkMeta = await check.json()
                    forkReady = true
                    Logger.info(
                        `[WYSIWYG] Fork ready after ${attempt} attempts`
                    )
                    break
                }

                const waitMs = 700 + attempt * 200
                Logger.info(
                    `[WYSIWYG] Fork not ready, attempt=${attempt}, waiting ${waitMs}ms`
                )
                await sleep(waitMs)
                attempt++
            }

            if (!forkReady) {
                Logger.error(
                    '[WYSIWYG] Timed out waiting for fork to be ready',
                    {
                        request,
                        context
                    }
                )
                return NextResponse.json(
                    {
                        error: `Timed out waiting for fork to be ready: <a href="${baseUrl}/${forkOwner}/${repo}" target="_blank" rel="noopener noreferrer" style="cursor: pointer; color: var(--chakra-colors-blue-fg); text-decoration: underline; text-decoration-color: color-mix(in srgb, currentColor 20%, transparent);">${forkOwner}/${repo}</a>`
                    },
                    { status: 500 }
                )
            }
        }

        // Fork metadata checks: archived
        if (forkMeta && forkMeta.archived) {
            Logger.error(`[WYSIWYG] Fork is archived: ${forkOwner}/${repo}`, {
                request,
                context
            })
            return NextResponse.json(
                {
                    error: `Fork is archived and cannot be edited - you must unarchive it in order to propose changes: <a href="${baseUrl}/${forkOwner}/${repo}" target="_blank" rel="noopener noreferrer" style="cursor: pointer; color: var(--chakra-colors-blue-fg); text-decoration: underline; text-decoration-color: color-mix(in srgb, currentColor 20%, transparent);">${forkOwner}/${repo}</a>`
                },
                { status: 400 }
            )
        }

        // 1d) Ensure fork git refs are readable before creating branch (important — fork population can be eventual)
        {
            const maxRefAttempts = 12
            let refAttempt = 0
            let refsReady = false
            const sleep = (ms: number) =>
                new Promise(resolve => setTimeout(resolve, ms))

            while (refAttempt < maxRefAttempts) {
                const refsCheck = await fetchGithub(
                    host,
                    `/repos/${forkOwner}/${repo}/git/refs`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/vnd.github+json'
                        },
                        next: {
                            revalidate: 0
                        }
                    }
                )

                if (refsCheck?.ok) {
                    refsReady = true
                    Logger.info(
                        `[WYSIWYG] Fork git/refs readable after ${refAttempt} attempts`
                    )
                    break
                }

                // if 404 during early fork propagation, keep retrying; if it's 5xx, also retry but log
                const hdrInfo = refsCheck
                    ? {
                          status: refsCheck.status,
                          requestId:
                              refsCheck.headers?.get?.('x-github-request-id') ??
                              null
                      }
                    : { status: 'no-response' }
                Logger.info(
                    `[WYSIWYG] git/refs not readable yet attempt=${refAttempt} ${JSON.stringify(hdrInfo)}`
                )
                await sleep(500 + refAttempt * 300)
                refAttempt++
            }

            if (!refsReady) {
                Logger.error(
                    '[WYSIWYG] Timed out waiting for fork git/refs to be readable',
                    {
                        request,
                        context
                    }
                )
                return NextResponse.json(
                    { error: 'Timed out waiting for fork refs to be readable' },
                    { status: 500 }
                )
            }
        }

        // 2) Get base SHA for 'main' branch from upstream
        const baseBranch = 'main'
        Logger.info(
            `[WYSIWYG] Fetching base ref for ${owner}/${repo} branch=${baseBranch}`
        )
        const refRes = await fetchGithub(
            host,
            `/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json'
                },
                next: {
                    revalidate: 0
                }
            }
        )

        if (!refRes?.ok) {
            const txt = await (refRes
                ? refRes.text()
                : Promise.resolve('no-response'))
            Logger.error(
                `[WYSIWYG] Failed to get upstream base ref: ${refRes?.status} ${txt}`,
                {
                    request,
                    context
                }
            )
            return NextResponse.json(
                { error: 'Failed to get base ref from upstream', details: txt },
                { status: refRes?.status || 500 }
            )
        }

        const refJson = await refRes.json()
        const baseSha = refJson?.object?.sha
        if (!baseSha) {
            Logger.error(
                `[WYSIWYG] Base SHA missing in ref response: ${JSON.stringify(refJson)}`,
                {
                    request,
                    context
                }
            )
            return NextResponse.json(
                {
                    error: 'Base SHA missing in upstream ref response',
                    details: refJson
                },
                { status: 500 }
            )
        }

        Logger.info(`[WYSIWYG] Upstream baseSha = ${baseSha}`)

        // 2b) Check for base SHA in fork; if missing, try to merge upstream immediately
        const shaCheck = await fetchGithub(
            host,
            `/repos/${forkOwner}/${repo}/git/commits/${baseSha}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json'
                },
                next: {
                    revalidate: 0
                }
            }
        )
        if (!shaCheck?.ok) {
            if (shaCheck?.status === 404) {
                Logger.info(
                    '[WYSIWYG] Fork missing base SHA, attempting to update fork from upstream'
                )
                const updateRes = await fetchGithub(
                    host,
                    `/repos/${forkOwner}/${repo}/merge-upstream`,
                    {
                        method: 'POST',
                        body: JSON.stringify({ branch: 'main' }),
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            Accept: 'application/vnd.github+json'
                        },
                        next: {
                            revalidate: 0
                        }
                    }
                )
                if (updateRes?.ok) {
                    Logger.info(
                        '[WYSIWYG] Fork main branch updated from upstream, retrying SHA check'
                    )
                    const shaCheck2 = await fetchGithub(
                        host,
                        `/repos/${forkOwner}/${repo}/git/commits/${baseSha}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: 'application/vnd.github+json'
                            },
                            next: {
                                revalidate: 0
                            }
                        }
                    )
                    if (!shaCheck2?.ok) {
                        Logger.error(
                            '[WYSIWYG] Fork still missing base SHA after update',
                            {
                                request,
                                context
                            }
                        )
                        return NextResponse.json(
                            {
                                error: `Your fork <a href="${baseUrl}/${forkOwner}/${repo}" target="_blank" rel="noopener noreferrer" style="cursor: pointer; color: var(--chakra-colors-blue-fg); text-decoration: underline; text-decoration-color: color-mix(in srgb, currentColor 20%, transparent);">${forkOwner}/${repo}</a> is out of date with upstream. Please sync your fork with the latest changes from the main repository before editing.`
                            },
                            { status: 409 }
                        )
                    }
                } else {
                    Logger.error(
                        '[WYSIWYG] Failed to update fork from upstream',
                        {
                            request,
                            context
                        }
                    )
                    return NextResponse.json(
                        {
                            error: `Your fork <a href="${baseUrl}/${forkOwner}/${repo}" target="_blank" rel="noopener noreferrer" style="cursor: pointer; color: var(--chakra-colors-blue-fg); text-decoration: underline; text-decoration-color: color-mix(in srgb, currentColor 20%, transparent);">${forkOwner}/${repo}</a> is out of date with upstream. Please sync your fork with the latest changes from the main repository before editing.`
                        },
                        { status: 409 }
                    )
                }
            } else {
                Logger.error(
                    `[WYSIWYG] Error checking fork for base SHA: status=${shaCheck?.status}`,
                    {
                        request,
                        context
                    }
                )
                return NextResponse.json(
                    { error: 'Failed to check fork for base SHA' },
                    { status: shaCheck?.status || 500 }
                )
            }
        }

        // 3) Create a short branch name (timestamp included)
        const newBranch = `edit-${Date.now()}`
        Logger.info(`[WYSIWYG] Target branch name: ${newBranch}`)

        // 4) Check if branch already exists on the fork; create only if missing (with robust retries for create)
        const checkBranchRes = await fetchGithub(
            host,
            `/repos/${forkOwner}/${repo}/git/ref/heads/${encodeURIComponent(newBranch)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json'
                },
                next: {
                    revalidate: 0
                }
            }
        )

        if (checkBranchRes?.ok) {
            Logger.info(
                `[WYSIWYG] Branch already exists on fork: ${forkOwner}/${repo}#${newBranch}`
            )
        } else {
            Logger.info(
                `[WYSIWYG] Creating branch ${newBranch} on fork ${forkOwner}/${repo} from sha ${baseSha}`
            )

            // Try to create branch with retries on 5xx (transient GHE errors), bail on 4xx
            const maxCreateAttempts = 6
            let createAttempt = 0
            let created = false
            const sleepCreate = (ms: number) =>
                new Promise(resolve => setTimeout(resolve, ms))

            while (createAttempt < maxCreateAttempts) {
                const createBranchRes = await fetchGithub(
                    host,
                    `/repos/${forkOwner}/${repo}/git/refs`,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            ref: `refs/heads/${newBranch}`,
                            sha: baseSha
                        }),
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            Accept: 'application/vnd.github+json'
                        },
                        next: {
                            revalidate: 0
                        }
                    }
                )

                if (createBranchRes?.ok) {
                    Logger.info(
                        `[WYSIWYG] Branch ${newBranch} created on fork (attempt=${createAttempt})`
                    )
                    created = true
                    break
                }

                // If 5xx, log details and retry with backoff
                const status = createBranchRes?.status || 0
                const respText = await (createBranchRes
                    ? createBranchRes.text()
                    : Promise.resolve('no-response'))
                const reqId =
                    createBranchRes?.headers?.get?.('x-github-request-id') ??
                    null
                const ghVersion =
                    createBranchRes?.headers?.get?.(
                        'x-github-enterprise-version'
                    ) ?? null

                if (status >= 500) {
                    Logger.info(
                        `[WYSIWYG] Create branch transient server error: ${JSON.stringify(
                            {
                                status,
                                reqId,
                                ghVersion,
                                attempt: createAttempt,
                                body: respText
                            }
                        )}`
                    )
                    // backoff
                    const backoffMs = 500 + createAttempt * 700
                    await sleepCreate(backoffMs)
                    createAttempt++
                    continue
                }

                // For 4xx, don't retry — return the error to caller
                Logger.error(
                    `[WYSIWYG] Create branch failed (non-retryable): ${JSON.stringify(
                        {
                            status,
                            body: respText
                        }
                    )}`,
                    {
                        request,
                        context
                    }
                )
                return NextResponse.json(
                    {
                        error: 'Failed to create branch on fork',
                        details: respText,
                        status
                    },
                    { status: status || 500 }
                )
            }

            if (!created) {
                Logger.error('[WYSIWYG] Create branch failed after retries', {
                    request,
                    context
                })
                return NextResponse.json(
                    { error: 'Failed to create branch on fork after retries' },
                    { status: 500 }
                )
            }
        }

        // 5) Get the file's SHA on the fork branch (may not exist)
        const fileRes = await fetchGithub(
            host,
            `/repos/${forkOwner}/${repo}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(newBranch)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json'
                },
                next: {
                    revalidate: 0
                }
            }
        )

        let fileSha: string | undefined = undefined
        if (fileRes?.ok) {
            const fileJson = await fileRes.json()
            fileSha = fileJson?.sha
            Logger.info(`[WYSIWYG] File exists on fork branch, sha=${fileSha}`)
        } else {
            Logger.info(
                `[WYSIWYG] File does not exist on fork branch (will create) status=${fileRes?.status}`
            )
        }

        // 6) Update (create or modify) the file on the fork branch
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const putBody: any = {
            message: `Update ${filePath.split('/').pop()}`,
            content: Buffer.from(content).toString('base64'),
            branch: newBranch
        }

        if (fileSha) putBody.sha = fileSha
        const updateRes = await fetchGithub(
            host,
            `/repos/${forkOwner}/${repo}/contents/${encodeURIComponent(filePath)}`,
            {
                method: 'PUT',
                body: JSON.stringify(putBody),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.github+json'
                },
                next: {
                    revalidate: 0
                }
            }
        )

        if (!updateRes?.ok) {
            const txt = await (updateRes
                ? updateRes.text()
                : Promise.resolve('no-response'))
            Logger.error(
                `[WYSIWYG] Update file failed: ${updateRes?.status} ${txt}`,
                {
                    request,
                    context
                }
            )
            return NextResponse.json(
                { error: 'Failed to update/create file on fork', details: txt },
                { status: updateRes?.status || 500 }
            )
        }

        Logger.info(
            `[WYSIWYG] File updated on fork: ${forkOwner}/${repo}@${newBranch}`
        )

        // 7) Create a PR from forkOwner:newBranch -> owner:main
        const prBody = {
            title: `Update ${filePath.split('/').pop()}`,
            head: `${forkOwner}:${newBranch}`,
            base: 'main',
            body: `Proposing changes via the Architecture Portal WYSIWYG.`
        }

        const prRes = await fetchGithub(host, `/repos/${owner}/${repo}/pulls`, {
            method: 'POST',
            body: JSON.stringify(prBody),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github+json'
            },
            next: {
                revalidate: 0
            }
        })

        const prData = prRes ? await prRes.json() : null
        if (!prRes?.ok) {
            Logger.error(
                `[WYSIWYG] Create PR failed: ${prRes?.status} ${JSON.stringify(prData)}`,
                {
                    request,
                    context
                }
            )
            return NextResponse.json(
                { error: 'Failed to create PR', details: prData },
                { status: prRes?.status || 500 }
            )
        }

        Logger.info(
            `[WYSIWYG] PR created: ${prData?.html_url || prData?.url || JSON.stringify(prData)}`
        )

        return NextResponse.json({ pr: prData })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        Logger.error(err, { request, context })
        return NextResponse.json({ error: String(err) }, { status: 500 })
    }
}
