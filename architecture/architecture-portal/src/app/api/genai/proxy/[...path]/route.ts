/* istanbul ignore file */
import { NextRequest, NextResponse } from 'next/server'
import { fetchIdaasToken, Logger } from '@/utils/server'
import { ARCHITECTURE_INTELLIGENCE_API_URL } from '@/constants'
async function handleProxy(req: NextRequest): Promise<NextResponse> {
    const forwardPath = req.nextUrl.pathname.replace(/^\/api\/genai\/proxy/, '')
    const search = req.nextUrl.search
    const targetUrl = `${ARCHITECTURE_INTELLIGENCE_API_URL}${forwardPath}${search}`
    const startedAt = Date.now()

    let token: string

    try {
        token = await fetchIdaasToken({ isGenAi: true })
    } catch (err) {
        Logger.error('GenAI proxy: failed to fetch IDAAS token', {
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
                'GenAI proxy: upstream returned 401, retrying with a fresh token',
                {
                    'http.request.method': req.method,
                    'http.route': forwardPath
                }
            )
            const freshToken = await fetchIdaasToken({
                refreshToken: true,
                isGenAi: true
            })
            if (freshToken) {
                forwardHeaders.set('Authorization', `Bearer ${freshToken}`)
            }
            upstreamResponse = await fetch(targetUrl, {
                method: req.method,
                headers: forwardHeaders,
                body
            })

            if (upstreamResponse.status === 401) {
                Logger.error(
                    'GenAI proxy: upstream still 401 after token refresh',
                    {
                        'http.request.method': req.method,
                        'http.route': forwardPath
                    }
                )
            }
        }
    } catch (err) {
        Logger.error('GenAI proxy: upstream fetch failed', {
            'http.request.method': req.method,
            'http.route': forwardPath,
            'server.address': ARCHITECTURE_INTELLIGENCE_API_URL,
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

    Logger.info('GenAI proxy: upstream response received', {
        'http.request.method': req.method,
        'http.route': forwardPath,
        'http.response.status_code': upstreamResponse.status,
        'http.server.request.duration_ms': Date.now() - startedAt
    })

    if (!upstreamResponse.body) {
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
    const responseHeaders = new Headers(upstreamResponse.headers)
    responseHeaders.set('X-Proxy-Handled', 'true')

    // Stream upstream body directly so SSE/event-stream responses are not buffered.
    return new NextResponse(upstreamResponse.body, {
        status: upstreamResponse.status,
        headers: responseHeaders
    })
}

export const GET = handleProxy
export const POST = handleProxy
export const PUT = handleProxy
export const PATCH = handleProxy
export const DELETE = handleProxy
