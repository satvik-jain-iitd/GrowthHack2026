export interface QueryField {
    id: string
    label: string
    description: string
    isDuration: boolean
}

export const QUERY_FIELDS: QueryField[] = [
    {
        id: 'aiecjs',
        label: 'AI_ECJs',
        description: 'Number of AI-recommended ECJs',
        isDuration: false
    },
    {
        id: 'savedecjs',
        label: 'Saved_ECJs',
        description: 'Number of ECJs the user saved',
        isDuration: false
    },
    {
        id: 'addedecj',
        label: 'Added_ECJ',
        description: 'ECJs added beyond the AI recommendation',
        isDuration: false
    },
    {
        id: 'retainedecj',
        label: 'Retained_ECJ',
        description: 'AI-recommended ECJs the user kept',
        isDuration: false
    },
    {
        id: 'aiebcs',
        label: 'AI_EBCs',
        description: 'Number of AI-recommended EBCs',
        isDuration: false
    },
    {
        id: 'savedebcs',
        label: 'Saved_EBCs',
        description: 'Number of EBCs the user saved',
        isDuration: false
    },
    {
        id: 'addedebc',
        label: 'Added_EBC',
        description: 'EBCs added beyond the AI recommendation',
        isDuration: false
    },
    {
        id: 'retainedebc',
        label: 'Retained_EBC',
        description: 'AI-recommended EBCs the user kept',
        isDuration: false
    },
    {
        id: 'timetaken',
        label: 'Time_Taken',
        description: 'Time from first action to submission',
        isDuration: true
    }
]

export interface QueryRow {
    recJourneyCount: number
    savedJourneyCount: number
    addedJourneys: number
    retainedJourneys: number
    recCapabilityCount: number
    savedCapabilityCount: number
    addedCapabilities: number
    retainedCapabilities: number
    timeSpentMs: number | null
}

export type ParseResult =
    | { ok: true; matches: (row: QueryRow) => boolean }
    | { ok: false; error: string }

type ComparisonOp = '>' | '>=' | '<' | '<=' | '=' | '==' | '!='

type AstNode =
    | { type: 'and'; left: AstNode; right: AstNode }
    | { type: 'or'; left: AstNode; right: AstNode }
    | { type: 'cmp'; field: QueryField; op: ComparisonOp; value: number }

type TokenType = 'LPAREN' | 'RPAREN' | 'OP' | 'IDENT' | 'NUMBER'

interface Token {
    type: TokenType
    value: string
    pos: number
}

const DURATION_UNIT_MS: Record<string, number> = {
    ms: 1,
    s: 1000,
    sec: 1000,
    secs: 1000,
    second: 1000,
    seconds: 1000,
    m: 60_000,
    min: 60_000,
    mins: 60_000,
    minute: 60_000,
    minutes: 60_000,
    h: 3_600_000,
    hr: 3_600_000,
    hrs: 3_600_000,
    hour: 3_600_000,
    hours: 3_600_000,
    d: 86_400_000,
    day: 86_400_000,
    days: 86_400_000
}

const TOKEN_PATTERNS: Array<{ type: TokenType | 'WS'; regex: RegExp }> = [
    { type: 'WS', regex: /\s+/y },
    { type: 'LPAREN', regex: /\(/y },
    { type: 'RPAREN', regex: /\)/y },
    { type: 'OP', regex: />=|<=|==|!=|=|>|</y },
    { type: 'NUMBER', regex: /\d+(?:\.\d+)?[a-zA-Z]*/y },
    { type: 'IDENT', regex: /[A-Za-z_][A-Za-z0-9_]*/y }
]

function normalize(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function tokenize(input: string): Token[] {
    const tokens: Token[] = []
    let pos = 0
    const len = input.length
    while (pos < len) {
        let matched = false
        for (const { type, regex } of TOKEN_PATTERNS) {
            regex.lastIndex = pos
            const m = regex.exec(input)
            if (m && m.index === pos) {
                if (type !== 'WS') {
                    tokens.push({ type, value: m[0], pos })
                }
                pos += m[0].length
                matched = true
                break
            }
        }
        if (!matched) {
            throw new Error(
                `Unexpected character '${input[pos]}' at position ${pos + 1}`
            )
        }
    }
    return tokens
}

function parseValue(field: QueryField, raw: string): number {
    const match = /^(\d+(?:\.\d+)?)([a-zA-Z]*)$/.exec(raw)
    if (!match) throw new Error(`Invalid numeric value '${raw}'`)
    const numPart = parseFloat(match[1])
    const unitPart = match[2].toLowerCase()

    if (!field.isDuration) {
        if (unitPart) {
            throw new Error(`${field.label} expects a plain number (no units)`)
        }
        return numPart
    }

    if (!unitPart) {
        throw new Error(
            `${field.label} requires a unit: ms, s, min, h, or d (e.g. ${field.label}<=2min)`
        )
    }
    const multiplier = DURATION_UNIT_MS[unitPart]
    if (multiplier === undefined) {
        throw new Error(
            `Unknown time unit '${unitPart}'. Supported units: ms, s, min, h, d`
        )
    }
    return numPart * multiplier
}

class Parser {
    private idx = 0
    constructor(private readonly tokens: Token[]) {}

    get position(): number {
        return this.idx
    }

    get length(): number {
        return this.tokens.length
    }

    slice(from: number): Token[] {
        return this.tokens.slice(from)
    }

    private peek(): Token | undefined {
        return this.tokens[this.idx]
    }

    private next(): Token | undefined {
        return this.tokens[this.idx++]
    }

    private peekKeyword(kw: string): boolean {
        const t = this.peek()
        return !!t && t.type === 'IDENT' && t.value.toLowerCase() === kw
    }

    parseOrExpr(): AstNode {
        let node = this.parseAndExpr()
        while (this.peekKeyword('or')) {
            this.next()
            const right = this.parseAndExpr()
            node = { type: 'or', left: node, right }
        }
        return node
    }

    private parseAndExpr(): AstNode {
        let node = this.parseAtom()
        while (this.peekKeyword('and')) {
            this.next()
            const right = this.parseAtom()
            node = { type: 'and', left: node, right }
        }
        return node
    }

    private parseAtom(): AstNode {
        const t = this.peek()
        if (!t) {
            throw new Error('Unexpected end of query, expected a condition')
        }
        if (t.type === 'LPAREN') {
            this.next()
            const node = this.parseOrExpr()
            const closing = this.next()
            if (!closing || closing.type !== 'RPAREN') {
                throw new Error(
                    closing
                        ? `Expected closing ')' but found '${closing.value}'`
                        : "Expected closing ')' but the query ended"
                )
            }
            return node
        }
        return this.parseComparison()
    }

    private parseComparison(): AstNode {
        const parts: string[] = []
        while (this.peek() && this.peek()!.type === 'IDENT') {
            parts.push(this.next()!.value)
        }
        if (parts.length === 0) {
            const t = this.peek()
            throw new Error(
                t
                    ? `Expected a field name but found '${t.value}'`
                    : 'Expected a field name but the query ended'
            )
        }
        const rawField = parts.join(' ')
        const normalized = normalize(rawField)
        const field = QUERY_FIELDS.find(f => f.id === normalized)
        if (!field) {
            throw new Error(
                `Unknown field '${rawField}'. Supported fields: ${QUERY_FIELDS.map(f => f.label).join(', ')}`
            )
        }

        const opTok = this.next()
        if (!opTok || opTok.type !== 'OP') {
            throw new Error(
                `Expected an operator (>, >=, <, <=, =, ==, !=) after '${field.label}'`
            )
        }

        const valueTok = this.next()
        if (!valueTok || valueTok.type !== 'NUMBER') {
            throw new Error(
                `Expected a numeric value after '${field.label} ${opTok.value}'`
            )
        }

        const value = parseValue(field, valueTok.value)
        return { type: 'cmp', field, op: opTok.value as ComparisonOp, value }
    }
}

function getFieldValue(field: QueryField, row: QueryRow): number | null {
    switch (field.id) {
        case 'aiecjs':
            return row.recJourneyCount
        case 'savedecjs':
            return row.savedJourneyCount
        case 'addedecj':
            return row.addedJourneys
        case 'retainedecj':
            return row.retainedJourneys
        case 'aiebcs':
            return row.recCapabilityCount
        case 'savedebcs':
            return row.savedCapabilityCount
        case 'addedebc':
            return row.addedCapabilities
        case 'retainedebc':
            return row.retainedCapabilities
        case 'timetaken':
            return row.timeSpentMs
        default:
            return null
    }
}

function compare(op: ComparisonOp, a: number, b: number): boolean {
    switch (op) {
        case '>':
            return a > b
        case '>=':
            return a >= b
        case '<':
            return a < b
        case '<=':
            return a <= b
        case '=':
        case '==':
            return a === b
        case '!=':
            return a !== b
    }
}

function evaluate(node: AstNode, row: QueryRow): boolean {
    if (node.type === 'and') {
        return evaluate(node.left, row) && evaluate(node.right, row)
    }
    if (node.type === 'or') {
        return evaluate(node.left, row) || evaluate(node.right, row)
    }
    const fieldValue = getFieldValue(node.field, row)
    if (fieldValue === null) return false
    return compare(node.op, fieldValue, node.value)
}

export function parseAdvancedQuery(query: string): ParseResult {
    const trimmed = query.trim()
    if (!trimmed) {
        return { ok: true, matches: () => true }
    }
    try {
        const tokens = tokenize(trimmed)
        const parser = new Parser(tokens)
        const ast = parser.parseOrExpr()
        if (parser.position < parser.length) {
            const leftover = parser
                .slice(parser.position)
                .map(t => t.value)
                .join(' ')
            throw new Error(`Unexpected text after valid query: '${leftover}'`)
        }
        return { ok: true, matches: row => evaluate(ast, row) }
    } catch (err) {
        return {
            ok: false,
            error: err instanceof Error ? err.message : String(err)
        }
    }
}
