/* istanbul ignore file */
/* eslint-disable @typescript-eslint/no-require-imports */
const { CacheHandler } = require('@neshca/cache-handler')
const createRedisHandler = require('@neshca/cache-handler/redis-stack').default
const createLruHandler = require('@neshca/cache-handler/local-lru').default
const { createRedisClient } = require('./redis-client')

/*
To see the cache logs use NEXT_PRIVATE_DEBUG_CACHE=1
https://caching-tools.github.io/next-shared-cache/troubleshooting
*/

/* from https://caching-tools.github.io/next-shared-cache/redis */
CacheHandler.onCreation(async () => {
    const client = await createRedisClient('cache-handler')

    /** @type {import("@neshca/cache-handler").Handler | null} */
    let redisHandler = null
    if (client?.isReady) {
        // Create the `redis-stack` Handler if the client is available and connected.
        redisHandler = createRedisHandler({
            client,
            keyPrefix: 'architecture-portal:',
            timeoutMs: 5000
        })
    }

    return {
        // The order of the handlers is important.
        // The CacheHandler will run get methods in the order of the handlers array.
        // Other methods will be run in parallel.
        handlers: [createLruHandler(), redisHandler].filter(Boolean),
        ttl: {
            // Fallback staleAge if Next.js didn't provide one (optional)
            defaultStaleAge: 60, // seconds
            // Global TTL (expireAge) for all items: fixed 3600 seconds (1 hour)
            estimateExpireAge: _staleAge => 3600 // seconds
        }
    }
})

module.exports = CacheHandler
