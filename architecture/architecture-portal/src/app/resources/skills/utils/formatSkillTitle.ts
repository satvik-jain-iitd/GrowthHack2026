/* istanbul ignore file */

const TOKEN_OVERRIDES: Record<string, string> = {
    api: 'API',
    mcp: 'MCP'
}

function isTypeAApiSequence(tokens: string[], index: number): boolean {
    return (
        tokens[index]?.toLowerCase() === 'a' &&
        tokens[index - 1]?.toLowerCase() === 'type' &&
        tokens[index + 1]?.toLowerCase() === 'api'
    )
}

function formatSkillToken(
    token: string,
    index: number,
    tokens: string[]
): string {
    if (!token) {
        return token
    }

    const normalizedToken = token.toLowerCase()

    if (normalizedToken === 'a') {
        return index === 0 || isTypeAApiSequence(tokens, index) ? 'A' : 'a'
    }

    const override = TOKEN_OVERRIDES[normalizedToken]

    if (override) {
        return override
    }

    if (/[A-Z]/.test(token)) {
        return token
    }

    return token.charAt(0).toUpperCase() + token.slice(1)
}

export function formatSkillTitle(value: string): string {
    return value
        .replace(/^([0-9]+-)/, '')
        .replace(/\.(md|mdx)$/i, '')
        .replace(/-/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((token, index, tokens) => formatSkillToken(token, index, tokens))
        .join(' ')
}
