/* istanbul ignore file */
import { type Instrumentation } from 'next'

const normalizeToError = (x: unknown): Error => {
    if (x instanceof Error) return x
    try {
        if (typeof x === 'string') return new Error(x)
        return new Error(JSON.stringify(x))
    } catch {
        return new Error(String(x))
    }
}

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await import('@/otel')

        // Route outbound requests through a corporate proxy via env vars
        // (HTTPS_PROXY / HTTP_PROXY / NO_PROXY). Installing the proxy at the
        // global-dispatcher layer means every call site uses plain `fetch`,
        // which Next.js patches and caches. NO_PROXY (e.g. `.aexp.com`,
        // localhost) keeps internal traffic direct.
        const { setGlobalDispatcher, EnvHttpProxyAgent } = await import(
            'undici'
        )
        setGlobalDispatcher(new EnvHttpProxyAgent())

        const { Logger } = await import('@/utils/server')

        const handleFatal = (payload: unknown) => {
            try {
                const error = normalizeToError(payload)
                Logger.error(error)
            } catch (handlerErr) {
                console.error(handlerErr)
            }
        }

        process.on('uncaughtException', handleFatal)
        process.on('unhandledRejection', handleFatal)
    }
}

export const onRequestError: Instrumentation.onRequestError = async (
    err,
    request,
    context
) => {
    const { Logger } = await import('@/utils/server')
    try {
        const error = normalizeToError(err)
        Logger.error(error, { request, context })
    } catch (handlerErr) {
        console.error(handlerErr)
    }
}
