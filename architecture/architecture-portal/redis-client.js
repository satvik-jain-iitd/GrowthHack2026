/* istanbul ignore file */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const { createClient } = require('redis')
const { PHASE_PRODUCTION_BUILD } = require('next/constants')

const REDIS_CLIENTS = global.REDIS_CLIENTS || (global.REDIS_CLIENTS = new Map())
const REDIS_CONNECT_TIMEOUT_MS = 3000

// helper: connect with timeout (prevents startup hang)
async function connectWithTimeout(client, ms, name) {
    const promise = client.connect()
    return await Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error(`[Redis][${name}] connection timeout`)),
                ms
            )
        )
    ])
}

async function createRedisClient(name) {
    // use redis client during build could cause issue https://github.com/caching-tools/next-shared-cache/issues/284#issuecomment-1919145094
    if (
        PHASE_PRODUCTION_BUILD === process.env.NEXT_PHASE ||
        process.env.NODE_ENV !== 'production'
    ) {
        return null
    }

    try {
        // Create a Redis client with robust RedisClientOptions.
        const client = createClient({
            url: `rediss://${process.env.REDIS_HOST}:${process.env.REDIS_PORT ?? '6379'}`,
            username: 'svc.arptl-redis-user',
            password: process.env.REDIS_PWD,
            socket: {
                tls: true,
                ca: fs.readFileSync('./certs/AmexInternalRootCA.crt'),
                reconnectStrategy: retries => {
                    const delay = Math.min(retries * 500, 60000)
                    console.error(
                        `[Redis][${name}] retry attempt ${retries}, retrying in ${delay} ms`
                    )
                    return delay
                }
            }
        })

        // Redis won't work without error handling.
        client.on('error', e => {
            if (typeof process.env.NEXT_PRIVATE_DEBUG_CACHE !== 'undefined') {
                console.warn('Redis error', e)
            }
        })

        console.info(`[Redis][${name}] connecting client...`)
        await connectWithTimeout(client, REDIS_CONNECT_TIMEOUT_MS, name)
        console.info(`[Redis][${name}] client connected.`)

        REDIS_CLIENTS.set(name, client)

        // Register graceful shutdown handlers only once globally
        if (!global.signalHandlersInstalled) {
            global.signalHandlersInstalled = true

            const shutdownHandler = async signal => {
                console.info(
                    `[Redis] ${signal} received, closing ${REDIS_CLIENTS.size} clients...`
                )
                for (const [clientName, c] of REDIS_CLIENTS.entries()) {
                    try {
                        if (c && c.isOpen) {
                            await c.quit()
                            console.info(
                                `[Redis][${clientName}] client quit on`,
                                signal
                            )
                        } else {
                            console.info(
                                `[Redis][${clientName}] client already closed on`,
                                signal
                            )
                        }
                    } catch (err) {
                        console.warn(
                            `[Redis][${clientName}] error quitting client on ${signal}, trying disconnect`,
                            err
                        )
                        try {
                            if (c && c.isOpen) {
                                await c.disconnect?.()
                                console.info(
                                    `[Redis][${clientName}] client disconnect on`,
                                    signal
                                )
                            } else {
                                console.info(
                                    `[Redis][${clientName}] client already closed on`,
                                    signal
                                )
                            }
                        } catch (e) {
                            console.warn(
                                `[Redis][${clientName}] disconnect also failed`,
                                e
                            )
                        }
                    }
                }
            }

            process.on('SIGTERM', () => shutdownHandler('SIGTERM'))
            process.on('SIGINT', () => shutdownHandler('SIGINT'))
            console.info(`[Redis] registered shutdown handlers`)
        }

        return client
    } catch (error) {
        console.warn(`[Redis][${name}] failed to connect client:`, error)
        return null
    }
}

module.exports = { createRedisClient }
