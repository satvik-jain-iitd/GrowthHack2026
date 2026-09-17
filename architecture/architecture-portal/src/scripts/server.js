/* istanbul ignore file */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const LOCAL_ENV = path.join(__dirname, '../../.env')
const EPAAS_SECRETS = '/opt/epaas/vault/secrets/secrets'

/**
 * Parse dotenv-style text into an object
 */
function parseSecrets(text) {
    const env = {}
    for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim()
        if (!line || line.startsWith('#') || !line.includes('=')) continue
        const key = line.split('=')[0]
        const val = line.substring(line.indexOf('=') + 1)
        env[key] = val.replace(/^['"]|['"]$/g, '')
    }
    return env
}

/**
 * Get secrets from EPaaS (prod-time behavior)
 */
async function getProductionSecrets() {
    // If EPaaS secrets file does not exist, fall back to development secrets (assume we're running prod locally)
    if (!fs.existsSync(EPAAS_SECRETS)) {
        return await getDevelopmentSecrets()
    }

    const secrets = fs.readFileSync(EPAAS_SECRETS, 'utf8')
    return parseSecrets(secrets)
}

/**
 * Get secrets from Vault (dev-time behavior)
 */
async function getDevelopmentSecrets() {
    // If local .env exists, we assume it has the necessary secrets already
    if (fs.existsSync(LOCAL_ENV)) {
        const secrets = fs.readFileSync(LOCAL_ENV, 'utf8')
        return parseSecrets(secrets)
    }

    // Check if ADS_ID and ADS_PASSWORD are set and throw error if not, since we need env vars to build the project
    if (!process.env.ADS_ID || !process.env.ADS_PASSWORD) {
        throw new Error('ADS_ID / ADS_PASSWORD not provided for Vault fetch')
    }

    const {
        auth: { client_token }
    } = await fetch(
        `https://vaultcloud-dev.aexp.com/v1/hydra/cld-paas-d-eusw1/auth/ldap/login/${process.env.ADS_ID}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: process.env.ADS_PASSWORD })
        }
    ).then(res => res.json())

    const {
        data: { data }
    } = await fetch(
        `https://vaultcloud-dev.aexp.com/v1/hydra/cld-paas-d-eusw1/static_secrets/data/600002899_architecture-intra-hydra_architecture1`,
        {
            method: 'GET',
            headers: { 'X-Vault-Token': client_token }
        }
    ).then(res => res.json())

    const secrets = Object.entries(data)
        .map(([key, value]) => `${key}="${value}"`)
        .join('\n')

    fs.writeFileSync(LOCAL_ENV, secrets, 'utf-8')
    fs.accessSync(LOCAL_ENV, fs.constants.F_OK)
    return parseSecrets(secrets)
}

/**
 * Spawn a child process and forward signals
 */
function spawnCommand(cmd, args, env) {
    const child = spawn(cmd, args, {
        env,
        stdio: 'inherit',
        shell: false
    })

    function forward(sig) {
        if (!child.pid) return
        try {
            process.kill(child.pid, sig)
        } catch {}
    }

    process.on('SIGTERM', () => forward('SIGTERM'))
    process.on('SIGINT', () => forward('SIGINT'))

    child.on('exit', (code, signal) => {
        if (signal) {
            try {
                process.kill(process.pid, signal)
            } catch {}
        } else {
            process.exit(code)
        }
    })
}

/**
 * Main entrypoint to get secrets and spawn the child process
 */
async function main() {
    const argv = process.argv.slice(2)
    if (argv.length === 0) {
        console.error('Usage: node src/scripts/server.js <cmd> [args...]')
        process.exit(2)
    }

    const secrets = {
        ...(process.env.NODE_ENV === 'production' &&
            (await getProductionSecrets())),
        ...(process.env.NODE_ENV === 'development' &&
            (await getDevelopmentSecrets()))
    }

    // Merge secrets into new environment, secrets override existing process.env
    const env = Object.assign({}, process.env)
    for (const [k, v] of Object.entries(secrets)) {
        env[k] = v
    }

    const cmd = argv[0]
    const args = argv.slice(1)
    spawnCommand(cmd, args, env)
}

main().catch(err => {
    console.error(err && err.message ? err.message : err)
    process.exit(1)
})
