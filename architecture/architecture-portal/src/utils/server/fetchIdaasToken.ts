/* istanbul ignore file */
'use server'
import CryptoJS from 'crypto-js'
import { ONE_IDENTITY_API_HOST } from '@/constants'
import { Logger } from './logger'

const TOKEN_TTL_MS = 10 * 60_000
const REFRESH_INTERVAL_MS = 8 * 60_000

let authToken: string
let authTokenExpiresAt = 0
let genAiAuthToken: string
let genAiTokenExpiresAt = 0
let interval: NodeJS.Timeout | null = null
let genAiInterval: NodeJS.Timeout | null = null
let authFetchPromise: Promise<string> | null = null
let genAiFetchPromise: Promise<string> | null = null

const generateHash = (message: string, secret: CryptoJS.lib.WordArray) => {
    const hash = CryptoJS.HmacSHA256(message, secret)
    return CryptoJS.enc.Base64.stringify(hash)
        .replace(/\//g, '_')
        .replace(/\+/g, '-')
        .replace(/\=/g, '')
}

const getMacID = (
    secret: CryptoJS.lib.WordArray,
    version: string,
    appID: string,
    timeStamp: number
) => {
    return generateHash(`${appID}-${version}-${timeStamp}`, secret)
}

// TODO HS - proper token handling required for metamodel similar to genai. Currently using arch-api default tokens
export async function fetchIdaasToken(
    params?: { refreshToken?: boolean; isGenAi?: boolean } | undefined
): Promise<string> {
    const { refreshToken = false, isGenAi = false } = params || {}

    const IDAAS_VERSION =
        process.env[`${isGenAi ? 'GENAI_' : ''}IDAAS_VERSION`] ?? '2'
    const IDAAS_SECRET =
        process.env[`${isGenAi ? 'GENAI_' : ''}IDAAS_SECRET`] ?? ''
    const IDAAS_HOST = (
        process.env[`${isGenAi ? 'GENAI_' : ''}IDAAS_HOST`] ??
        ONE_IDENTITY_API_HOST
    ).replace(/\/?$/, '/')
    const IDAAS_APP_ID =
        process.env[`${isGenAi ? 'GENAI_' : ''}IDAAS_APP_ID`] ?? ''

    const expiresAtTs = isGenAi ? genAiTokenExpiresAt : authTokenExpiresAt
    const isTokenExpired = refreshToken || Date.now() >= expiresAtTs
    const cachedToken = isGenAi ? genAiAuthToken : authToken
    const hasCachedToken =
        cachedToken != undefined &&
        Boolean(cachedToken) &&
        cachedToken?.length > 0

    // Check if a cached token should be returned
    const shouldReturnCachedToken = hasCachedToken && !isTokenExpired

    // Return the cached token if required
    if (shouldReturnCachedToken) {
        return cachedToken || ''
    }

    // Single-flight: if a mint is already in progress, join it instead of
    // firing a duplicate request to IDAAS.
    const inFlight = await (isGenAi ? genAiFetchPromise : authFetchPromise)
    if (inFlight) {
        return inFlight
    }

    const fetchPromise = (async () => {
        const timestamp = Date.now()
        const decodedSecret = CryptoJS.enc.Base64.parse(IDAAS_SECRET)
        const mac = getMacID(
            decodedSecret,
            IDAAS_VERSION,
            IDAAS_APP_ID,
            timestamp
        )

        const scope = isGenAi
            ? ['/app/v1/agent::POST']
            : [
                  '/arch-api/v1/**::GET|POST|PUT|DELETE|PATCH',
                  '/arch-api/v2/**::GET|POST|PUT|DELETE|PATCH',
                  '/arch-api/v3/**::GET,PUT,POST,DELETE,PATCH',
                  '/arch-api/v4/**::GET,PUT,POST,DELETE,PATCH'
              ]

        const token = await fetch(
            `${IDAAS_HOST}security/digital/v1/application/token`,
            {
                method: 'POST',
                headers: {
                    'X-Auth-AppID': IDAAS_APP_ID,
                    'X-Auth-Version': IDAAS_VERSION,
                    'X-Auth-Timestamp': timestamp.toString(),
                    'X-Auth-Signature': mac,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    scope: scope
                })
            }
        ).then(async res => {
            const data = await res.json()
            const mintedToken = data?.authorization_token
            Logger.info('IDAAS: token minted', {
                'idaas.audience': isGenAi ? 'genai' : 'architecture',
                'idaas.app_id': IDAAS_APP_ID,
                'idaas.forced_refresh': refreshToken,
                'http.response.status_code': res.status,
                'idaas.token_received': Boolean(mintedToken),
                'idaas.mint.duration_ms': Date.now() - timestamp
            })
            return mintedToken
        })

        // update the relevant token
        if (isGenAi) {
            genAiAuthToken = token
            genAiTokenExpiresAt = Date.now() + TOKEN_TTL_MS
        } else {
            authToken = token
            authTokenExpiresAt = Date.now() + TOKEN_TTL_MS
        }

        return token || ''
    })()

    if (isGenAi) {
        genAiFetchPromise = fetchPromise
    } else {
        authFetchPromise = fetchPromise
    }

    try {
        const token = await fetchPromise
        // set up the timer to renew token every 8 mins, as token expiry time is
        // 10 mins. This is a proactive keep-warm refresh; if it ever fails or is
        // delayed, the expiry check above makes the next request self-heal.
        if (!interval) {
            interval = setInterval(() => {
                fetchIdaasToken({ refreshToken: true }).catch(err => {
                    Logger.error('IDAAS: proactive token refresh failed', {
                        'idaas.audience': 'architecture',
                        'error.message': String(err)
                    })
                })
            }, REFRESH_INTERVAL_MS)
        }
        if (!genAiInterval) {
            genAiInterval = setInterval(() => {
                fetchIdaasToken({
                    refreshToken: true,
                    isGenAi: true
                }).catch(err => {
                    Logger.error('IDAAS: proactive token refresh failed', {
                        'idaas.audience': 'genai',
                        'error.message': String(err)
                    })
                })
            }, REFRESH_INTERVAL_MS)
        }

        return token
    } finally {
        if (isGenAi) {
            genAiFetchPromise = null
        } else {
            authFetchPromise = null
        }
    }
}
