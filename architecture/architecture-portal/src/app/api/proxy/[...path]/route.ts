/* istanbul ignore file */
import { NextRequest, NextResponse } from 'next/server'
import { fetchIdaasToken, Logger } from '@/utils/server'
import { ARCHITECTURE_API_URL } from '@/constants'

// Client bundles built before the /api/v* -> /arch-api/v* migration inline the old
// paths, so long-lived tabs (and any pod still serving a pre-migration bundle) keep
// sending them here. Rewrite so those clients keep working; drop this shim once the
// warning below stops firing.
const LEGACY_API_PREFIX = /^\/api\/v(\d)\//

async function handleProxy(req: NextRequest): Promise<NextResponse> {
    const requestedPath = req.nextUrl.pathname.replace(/^\/api\/proxy/, '')
    const forwardPath = requestedPath.replace(
        LEGACY_API_PREFIX,
        '/arch-api/v$1/'
    )
    const isLegacyPath = forwardPath !== requestedPath
    const search = req.nextUrl.search
    const targetUrl = `${ARCHITECTURE_API_URL}${forwardPath}${search}`
    const startedAt = Date.now()

    if (isLegacyPath) {
        Logger.warn('Proxy: rewrote legacy /api prefix to /arch-api', {
            'http.request.method': req.method,
            'http.route': forwardPath,
            'http.route.requested': requestedPath,
            'http.request.header.referer': req.headers.get('referer'),
            'http.request.header.sec_fetch_site':
                req.headers.get('sec-fetch-site'),
            'user_agent.original': req.headers.get('user-agent'),
            'client.address': req.headers.get('x-forwarded-for')
        })
    }

    let token: string

    try {
        token = await fetchIdaasToken()
    } catch (err) {
        Logger.error('Proxy: failed to fetch IDAAS token', {
            'http.route': forwardPath,
            'error.message': String(err)
        })
        return NextResponse.json(
            { error: 'Failed to retrieve auth token' },
            { status: 502 }
        )
    }

    const body =
        req.method !== 'GET' && req.method !== 'HEAD'
            ? await req.text()
            : undefined

    const forwardHeaders = new Headers(req.headers)
    // Strip hop-by-hop and body-framing headers from the inbound request.
    // We re-encode the body below, so the original content-length/transfer-encoding
    // no longer apply — forwarding them makes undici throw
    // `UND_ERR_INVALID_ARG: invalid content-length header`. Let fetch set them.
    forwardHeaders.delete('content-length')
    forwardHeaders.delete('transfer-encoding')
    forwardHeaders.delete('connection')
    forwardHeaders.delete('host')
    // The browser's cookies are scoped to *.aexp.com, so they reach the upstream
    // API too. Upstream prefers its cookie session over our Bearer token, so a
    // stale cookie 401s the request even when the token is valid.
    // To resolve this rename the cookies in header and delete the original
    forwardHeaders.set('authbluecookie', forwardHeaders.get('cookie') || '')
    forwardHeaders.delete('cookie')

    if (token) {
        forwardHeaders.set('Authorization', `Bearer ${token}`)
    }

    let upstreamResponse: Response
    try {
        upstreamResponse = await fetch(targetUrl, {
            method: req.method,
            headers: forwardHeaders,
            body
        })

        if (upstreamResponse.status === 401) {
            Logger.warn(
                'Proxy: upstream returned 401, retrying with a fresh token',
                {
                    'http.request.method': req.method,
                    'http.route': forwardPath
                }
            )
            const freshToken = await fetchIdaasToken({ refreshToken: true })
            if (freshToken) {
                forwardHeaders.set('Authorization', `Bearer ${freshToken}`)
            }
            upstreamResponse = await fetch(targetUrl, {
                method: req.method,
                headers: forwardHeaders,
                body
            })

            if (upstreamResponse.status === 401) {
                Logger.error('Proxy: upstream still 401 after token refresh', {
                    'http.request.method': req.method,
                    'http.route': forwardPath
                })
            }
        }
    } catch (err) {
        Logger.error('Proxy: upstream fetch failed', {
            'http.request.method': req.method,
            'http.route': forwardPath,
            'server.address': ARCHITECTURE_API_URL,
            'error.message': String(err)
        })
        return NextResponse.json(
            {
                error: 'Upstream request failed',
                target: targetUrl,
                detail: String(err)
            },
            { status: 502 }
        )
    }

    const responseBody = await upstreamResponse.arrayBuffer()
    const responseHasBody = responseBody.byteLength > 0

    Logger.info('Proxy: upstream request complete', {
        'http.request.method': req.method,
        'http.route': forwardPath,
        'http.route.legacy': isLegacyPath,
        'http.response.status_code': upstreamResponse.status,
        'http.response.body.size': responseBody.byteLength,
        'http.server.request.duration_ms': Date.now() - startedAt
    })

    if (!responseHasBody) {
        if (upstreamResponse.status >= 500) {
            return NextResponse.json(
                {
                    error: 'Upstream service returned an empty error response',
                    target: targetUrl
                },
                { status: upstreamResponse.status }
            )
        }

        return new NextResponse(null, { status: upstreamResponse.status })
    }

    const contentType = upstreamResponse.headers.get('content-type')
    // temp X-Proxy-Handled - remove this after dev and validations
    return new NextResponse(responseBody, {
        status: upstreamResponse.status,
        headers: {
            ...(contentType ? { 'Content-Type': contentType } : {}),
            'X-Proxy-Handled': 'true'
        }
    })
}

export const GET = handleProxy
export const POST = handleProxy
export const PUT = handleProxy
export const PATCH = handleProxy
export const DELETE = handleProxy
