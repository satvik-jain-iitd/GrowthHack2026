/* istanbul ignore file */
import { NextRequest, NextResponse } from 'next/server'
import { fetchIdaasToken } from '@/utils/server'
import { METAMODEL_API_URL } from '@/constants'

// TODO HS - proper token handling required similar to genai. Currently using arch-api default tokens
async function handleProxy(req: NextRequest): Promise<NextResponse> {
    const forwardPath = req.nextUrl.pathname.replace(
        /^\/api\/metamodel\/proxy/,
        ''
    )
    const search = req.nextUrl.search
    const targetUrl = `${METAMODEL_API_URL}${forwardPath}${search}`

    let token: string

    try {
        token = await fetchIdaasToken()
    } catch (err) {
        console.error('Metamodel proxy: failed to fetch IDAAS token', err)
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
    forwardHeaders.delete('content-length')
    forwardHeaders.delete('transfer-encoding')
    forwardHeaders.delete('connection')
    forwardHeaders.delete('host')
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
            const freshToken = await fetchIdaasToken({ refreshToken: true })
            if (freshToken) {
                forwardHeaders.set('Authorization', `Bearer ${freshToken}`)
            }
            upstreamResponse = await fetch(targetUrl, {
                method: req.method,
                headers: forwardHeaders,
                body
            })
        }
    } catch (err) {
        console.error(
            `Metamodel proxy: upstream fetch failed for ${targetUrl}`,
            err
        )
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
