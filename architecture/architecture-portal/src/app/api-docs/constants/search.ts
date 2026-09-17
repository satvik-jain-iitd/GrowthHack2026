const FIELD_WEIGHTS = {
    OPERATION_NAME: 100,
    URI: 80,
    API_NAME: 60,
    DOMAIN_NAME: 40,
    OPERATION_DESCRIPTION: 20,
    API_DESCRIPTION: 10
} as const

const MATCH_QUALITY = {
    NONE: 0,
    SUBSTRING: 1,
    WORD_BOUNDARY: 2,
    PREFIX: 3,
    EXACT: 4
} as const

const METHOD_TOKENS = ['get', 'post', 'put', 'patch', 'delete']

// Only the three certification tiers are ranked; everything else shares the
// bottom bucket and keeps its tree order.
const STATUS_RANK: { [key: string]: number } = {
    prodCert: 0, // Production Certified
    preCert: 1, // Design Certified
    catalog: 2 // Onboarded to Catalog
}
const STATUS_RANK_DEFAULT = 3

const MAX_APIS_PER_DOMAIN = 5
const MAX_OPS_PER_API = 5
const MAX_GROUPS = 8
const INHERIT_FACTOR = 0.5
const DESCRIPTION_CLAMP = 120

export {
    FIELD_WEIGHTS,
    MATCH_QUALITY,
    METHOD_TOKENS,
    STATUS_RANK,
    STATUS_RANK_DEFAULT,
    MAX_APIS_PER_DOMAIN,
    MAX_OPS_PER_API,
    MAX_GROUPS,
    INHERIT_FACTOR,
    DESCRIPTION_CLAMP
}
