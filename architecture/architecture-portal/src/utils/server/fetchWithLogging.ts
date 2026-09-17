/* istanbul ignore file */
import { Logger } from './logger'
import { fetchWithToken } from './fetchWithToken'

// ANSI escape sequences
const RESET = '\x1b[0m'
const GRAY = '\x1b[90m'
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'

// Generic wrap helper
const wrap = (code: string, text: string): string => `${code}${text}${RESET}`

// Simple color helpers
const gray = (text: string) => wrap(GRAY, text)
const red = (text: string) => wrap(RED, text)
const green = (text: string) => wrap(GREEN, text)
const yellow = (text: string) => wrap(YELLOW, text)
const cyan = (text: string) => wrap(CYAN, text)

/**
 * Colorizes the HTTP status code.
 * @param status The HTTP status code.
 * @returns The colorized status code, 2xx=green, 3xx=cyan, 4xx=yellow, 5xx=red
 */
export function colorStatus(status: number): string {
    const s = String(status)

    if (status >= 500) return red(s) // server errors
    if (status >= 400) return yellow(s) // client errors
    if (status >= 300) return cyan(s) // redirects
    if (status >= 200) return green(s) // success

    return s // fallback (1xx or unknown)
}

/**
 * Fetches a resource and logs the request details.
 * @param input The resource to fetch.
 * @param init The request options.
 * @returns The response from the fetch call.
 */
export async function fetchWithLogging(
    input: string,
    init?: RequestInit
): Promise<Response> {
    const start = performance.now()
    const response = await fetchWithToken(input, init)
    const durationMs = (performance.now() - start).toFixed(0)
    const method = init?.method?.toUpperCase() || 'GET'
    const timestamp = new Date().toISOString()
    console.log(
        `${gray(timestamp)} ${method} ${input} ${colorStatus(response.status)} in ${durationMs}ms`
    )
    Logger.info(
        `${timestamp} ${method} ${input} ${response.status} in ${durationMs}ms`
    )
    return response
}
