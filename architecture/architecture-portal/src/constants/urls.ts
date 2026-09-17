/* istanbul ignore file */
import { ENVIRONMENT } from './env'

export const GITHUB_ENTERPRISE_URL = 'https://github.aexp.com'
export const GITHUB_ENTERPRISE_API_URL = 'https://github.aexp.com/api/v3'
export const GITHUB_ENTERPRISE_PROVIDER_ID = 'github-enterprise'
export const GITHUB_CLOUD_URL = 'https://github.com'
export const GITHUB_CLOUD_API_URL = 'https://api.github.com'
export const GITHUB_CLOUD_PROVIDER_ID = 'github-cloud'
export const AMEX_SKILLS_REPO_URL = 'https://github.com/amex-eng/amex-skills'

export const SOURCE_HOST = {
    GHE: 'ghe',
    GHC: 'ghc'
} as const

export type SourceHost = (typeof SOURCE_HOST)[keyof typeof SOURCE_HOST]
export const isSourceHost = (value: unknown): value is SourceHost =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values(SOURCE_HOST).includes(value as any)

export const SOURCE_HOST_CONFIG: Record<
    SourceHost,
    {
        providerId: string
        url: string
        apiUrl: string
        tokenKey: string
        label: string
    }
> = {
    [SOURCE_HOST.GHE]: {
        providerId: GITHUB_ENTERPRISE_PROVIDER_ID,
        url: GITHUB_ENTERPRISE_URL,
        apiUrl: GITHUB_ENTERPRISE_API_URL,
        tokenKey: 'GITHUB_TOKENS_JSON',
        label: 'GitHub Enterprise'
    },
    [SOURCE_HOST.GHC]: {
        providerId: GITHUB_CLOUD_PROVIDER_ID,
        url: GITHUB_CLOUD_URL,
        apiUrl: GITHUB_CLOUD_API_URL,
        tokenKey: 'GITHUB_CLOUD_TOKENS_JSON',
        label: 'GitHub Cloud'
    }
}

export const ARCH_PORTAL_HELP_SLACK_URL =
    'https://aexp-architecture.slack.com/archives/C05655U6GMC'
export const TBM_MAPPING_HELP_SLACK_URL =
    'https://aexp.enterprise.slack.com/archives/C0B4G48Q96J'

export const ARCH_PORTAL_ENTITLEMENT = 'GG-ARCHITECTURE-PORTAL-USER'

const ARCHITECTURE = {
    e3: 'https://architecture1.aexp.com',
    e2: 'https://architecture1-qa.aexp.com',
    e1: 'https://architecture1-dev.aexp.com',
    e0: 'https://architecture1-dev.aexp.com'
}

export const ARCHITECTURE_URL = ARCHITECTURE[ENVIRONMENT] || ARCHITECTURE.e0

export const EDAAAT_FAQ_URL =
    'https://aexp.atlassian.net/wiki/spaces/EDAA/pages/2003477609/FAQ+-+EDA+Artifact+Automation+Tool?atlOrigin=eyJpIjoiOWZhNjhlNWQ4OTI3NGRiYThjYWY3NDI0ZWQ4YTNhYmEiLCJwIjoiY29uZmx1ZW5jZS1jaGF0cy1pbnQifQ'
export const EDAAAT_DATA_FLOW_DIAGRAM =
    'https://github.aexp.com/amex-eng/ea-design-playbook/raw/main/workproducts/5-information-architecture/5.1-data-arch-data-life-cycle-mgmt/img/data-flow-template-company-domain.xlsx'
export const EDAAAT_CONCEPTUAL_MODAL =
    'https://github.aexp.com/amex-eng/ea-design-playbook/raw/main/workproducts/5-information-architecture/5.2-logical-data-design/img/conceptual-data-model-template-company-domain.xlsx'

const EDAAAT_URL = {
    e3: 'https://edaaat.aexp.com',
    e2: 'https://edaaat-qa.aexp.com',
    e1: 'https://edaaat-dev.aexp.com',
    e0: 'https://edaaat-dev.aexp.com'
}

export const EDAAAT_API_URL = EDAAAT_URL[ENVIRONMENT] || EDAAAT_URL.e0

const AUTH_BLUE_API = {
    e3: 'https://authbluetokens.aexp.com',
    e2: 'https://authbluetokens-qa.aexp.com',
    e1: 'https://authbluetokens-dev.aexp.com',
    e0: 'https://authbluetokens-dev.aexp.com'
}

export const AUTH_BLUE_API_URL = AUTH_BLUE_API[ENVIRONMENT] || AUTH_BLUE_API.e0

const ARCHITECTURE_API = {
    e3: 'https://architectureportalapi.aexp.com',
    e2: 'https://architectureportalapi-qa.aexp.com',
    e1: 'https://architectureportalapi-dev.aexp.com',
    e0: 'https://architectureportalapi-dev.aexp.com'
}

const METAMODEL_API = {
    e3: 'https://metamodel.aexp.com',
    e2: 'https://metamodel-qa.aexp.com',
    e1: 'https://metamodel-dev.aexp.com',
    e0: 'https://metamodel-dev.aexp.com'
}

export const ARCHITECTURE_API_URL =
    ARCHITECTURE_API[ENVIRONMENT] || ARCHITECTURE_API.e0

export const METAMODEL_API_URL = METAMODEL_API[ENVIRONMENT] || METAMODEL_API.e0

const ARCHITECTURE_INTELLIGENCE_API = {
    e3: 'https://archintelligence.aexp.com',
    e2: 'https://archintelligence-qa.aexp.com',
    e1: 'https://archintelligence-dev.aexp.com',
    e0: 'https://archintelligence-dev.aexp.com'
}

export const ARCHITECTURE_INTELLIGENCE_API_URL =
    ARCHITECTURE_INTELLIGENCE_API[ENVIRONMENT] ||
    ARCHITECTURE_INTELLIGENCE_API.e0

const ARCHITECTURE_SEARCH = {
    e3: 'architecturesearch.aexp.com',
    e2: 'architecturesearch-qa.aexp.com',
    e1: 'architecturesearch-dev.aexp.com',
    e0: 'architecturesearch-dev.aexp.com'
}

export const ARCHITECTURE_SEARCH_HOST =
    ARCHITECTURE_SEARCH[ENVIRONMENT] || ARCHITECTURE_SEARCH.e0

const ONE_IDENTITY_API = {
    e3: 'https://oneidentityapi.aexp.com/',
    e2: 'https://oneidentityapi-qa.aexp.com/',
    e1: 'https://oneidentityapi-dev.aexp.com/',
    e0: 'https://oneidentityapi-dev.aexp.com/'
}

export const ONE_IDENTITY_API_HOST =
    ONE_IDENTITY_API[ENVIRONMENT] || ONE_IDENTITY_API.e0

const FOUNDATIONAL_ASSETS_IFRAME = {
    e3: 'https://architecture.aexp.com/architecture-foundational-assets?catagory=Foundational-Platform',
    e2: 'https://architecture-qa.aexp.com/architecture-foundational-assets?catagory=Foundational-Platform',
    e1: 'https://architecture-dev.aexp.com/architecture-foundational-assets?catagory=Foundational-Platform',
    e0: 'https://architecture.aexp.com/architecture-foundational-assets?catagory=Foundational-Platform'
}

export const FOUNDATIONAL_ASSETS_IFRAME_URL =
    FOUNDATIONAL_ASSETS_IFRAME[ENVIRONMENT] || FOUNDATIONAL_ASSETS_IFRAME.e0

export const CDAAS = {
    e3: 'https://cdaas.aexp.com',
    e2: 'https://cdaas-test.aexp.com',
    e1: 'https://cdaas-dev.aexp.com',
    e0: 'https://cdaas-dev.aexp.com'
}

export const CDAAS_URL = CDAAS[ENVIRONMENT] || CDAAS.e0

const SCRIPT_SUPPLIER = {
    e3: {
        src: 'https://www.aexp-static.com/cdaas/one/axp-script-supplier/6.0.5/script-supplier.js',
        integrity: 'sha256-q0IeF4SZx1Plg+tjFlB2Jf7Ij4LKfYYg7ESpLTkW35c='
    },
    e2: {
        src: 'https://qwww.aexp-static.com/cdaas/one/axp-script-supplier/6.0.6/script-supplier.js',
        integrity: 'sha256-ZhRfoIpFLXtdG91yW91P44IbT8vMuuXS82mVIbi1Hx4='
    },
    e1: {
        src: 'https://cdaas-dev.americanexpress.com/one/axp-script-supplier/6.0.6/script-supplier.js',
        integrity: 'sha256-9nJ3bCuL/oml747jpVx3PSjQ79WGbuED8nUd2L4TuoE='
    },
    e0: {
        src: 'https://cdaas-dev.americanexpress.com/one/axp-script-supplier/6.0.6/script-supplier.js',
        integrity: 'sha256-9nJ3bCuL/oml747jpVx3PSjQ79WGbuED8nUd2L4TuoE='
    }
}

export const SCRIPT_SUPPLIER_URL =
    SCRIPT_SUPPLIER[ENVIRONMENT] || SCRIPT_SUPPLIER.e0

export const EXPLORER_URL = {
    e3: 'https://explorer.aexp.com',
    e2: 'https://explorer-qa.aexp.com',
    e1: 'https://explorer-dev.aexp.com',
    e0: 'https://explorer-dev.aexp.com'
}
