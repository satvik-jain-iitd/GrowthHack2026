/* istanbul ignore file */
import type { Redirect } from 'next/dist/lib/load-custom-routes'

const METRICS_PATH = '/resources/metrics/2370f164-af18-411b-92e1-5f5213b07c82'

/**
 * This function returns all legacy redirects (imported in next.config.ts)
 * Please be aware that order matters for wildcard patterns
 * @returns Redirect[]
 */
export async function redirects() {
    const redirects: Redirect[] = []
    const mappings: Record<string, string> = {
        '/architecture-docs': '/',
        '/architecture-docs/initiatives': '/initiatives',
        '/architecture-docs/initiatives/:path*': '/docs/:path*',
        '/architecture-docs/company-domains': '/company-domains',
        '/architecture-docs/company-domains/29a284f9-785b-4050-aca9-b29b41390e92/prescriptiveADR':
            '/docs/588a9a00-2f53-49d6-a44d-1e191030aadc',
        '/architecture-docs/company-domains/3e552ba7-ff3f-460a-958a-359b0a79ca8c/prescriptiveADR':
            '/docs/46ed218e-cb4d-45e8-ba28-ed4e12870517',
        '/architecture-docs/company-domains/d5efc1d0-34f0-4dc0-ac1b-3cd0f052b06c/prescriptiveADR':
            '/docs/6350593a-0c33-4cbe-ab3a-564b3b1441f1',
        '/architecture-docs/company-domains/3e571748-7ff5-4f39-9704-54abc687e0cf/prescriptiveADR':
            '/docs/62461060-29a0-4bf2-a1b0-b0da52511feb',
        '/architecture-docs/company-domains/f014bf0a-1003-483e-a3a6-ff84c3a16998/prescriptiveADR':
            '/docs/6726cc42-1b7d-4c38-8ea8-87813a5c40fb',
        '/architecture-docs/company-domains/c5190b28-b13d-4f7b-a7f6-1e78c3e9c21f/prescriptiveADR':
            '/docs/03a09aa3-9b22-4b26-99ca-fa475c0f0f27',
        '/architecture-docs/company-domains/b3645ce4-3d23-402e-b466-b17191e7d9d4/Design-Language-System-prescriptiveADR':
            '/docs/a5b75b95-2336-4b8e-8bc0-4f00e2563698',
        '/architecture-docs/company-domains/b3645ce4-3d23-402e-b466-b17191e7d9d4/One-App-prescriptiveADR':
            '/docs/035b3a7b-006b-4b76-8cde-1fe3b6b590c6',
        '/architecture-docs/company-domains/2dfeccd8-14cf-4353-8a1e-f25fd5c561fb/workproducts/detailed-design/4.5-data-protection/4.5.1-component-level-detailed-design/detailed-design':
            '/docs/504325c5-abbb-4b43-b2d0-d177655f3f3d',
        '/architecture-docs/company-domains/2dfeccd8-14cf-4353-8a1e-f25fd5c561fb/workproducts/detailed-design/4.3-data-transformation/4.3.1-component-level-detailed-design/detailed-design':
            '/docs/b5a17f65-0dc7-4ba4-8ade-827c83934291',
        '/architecture-docs/company-domains/2dfeccd8-14cf-4353-8a1e-f25fd5c561fb/workproducts/detailed-design/4.2-universal-data-movement/4.2.1-data-ingestion/component-level-detailed-design/deploy-design':
            '/docs/5f26795c-4c8f-469b-8949-05b78003fbfd',
        '/architecture-docs/company-domains/f57c2df2-60d2-4525-ab12-ba9f5567e195/workproducts/technical-architecture/3.4 SDE Test Data Generation/3.4.1-platform-technical-architecture/SDE-Technical-Architecture':
            '/docs/02fea62f-86ba-4339-b7d7-13009cc6f904',
        '/architecture-docs/company-domains/f57c2df2-60d2-4525-ab12-ba9f5567e195/workproducts/detailed-design/4.5 TDM Optim/4.5.1-component-level-detailed-design/Component-Level-Detailed-Design':
            '/docs/91fbc221-9042-4345-a2bd-5984cfafc221',
        '/architecture-docs/company-domains/f57c2df2-60d2-4525-ab12-ba9f5567e195/workproducts/detailed-design/4.2 Google Lumi TDM/4.2.1-component-level-detailed-design/Lumi-TDM-Detailed-Design':
            '/docs/81349eed-ab87-4029-9333-db8f23a84f9c',
        '/architecture-docs/company-domains/:path*': '/docs/:path*',
        '/architecture-docs/foundational-technologies':
            '/foundational-technologies',
        '/architecture-docs/foundational-technologies/:path*': '/docs/:path*',
        '/architecture-docs/BuildvsBuy': '/build-vs-buys',
        '/architecture-docs/BuildvsBuy/20b6dc99-4fb6-4df0-b298-8ba830cd8a48/bvbGuidebook':
            '/docs/0f95a9e2-fd12-42f2-bec5-00e547097e43',
        '/architecture-docs/BuildvsBuy/:path*': '/docs/:path*',
        '/architecture-docs/standards-&-compliance':
            '/standards-and-compliance',
        '/architecture-docs/standards-&-compliance/category/api-design-patterns':
            '/docs/c06ce305-0a49-4d65-b2e3-24a0349cb889',
        '/architecture-docs/standards-&-compliance/category/api-design-principles':
            '/docs/d9cbeabf-0180-4d63-9164-1f95ee3e78f8',
        '/architecture-docs/standards-&-compliance/category/api-endpoint-and-protocol-standards':
            '/docs/3a6306ba-faa6-4e99-b818-30c5c99bedd3',
        '/architecture-docs/standards-&-compliance/category/api-payload-standards':
            '/docs/642f0fc5-9034-41a1-84a6-c56c4461efd5',
        '/architecture-docs/standards-&-compliance/category/b2b-api-standards':
            '/docs/c7d815c4-f297-4bec-8912-6c435ab182cb',
        '/architecture-docs/standards-&-compliance/category/data-standards':
            '/docs/02db0c81-7acd-4b87-968c-864f887d09f7',
        '/architecture-docs/standards-&-compliance/category/define':
            '/docs/5197c71d-f762-445d-abc6-2c5edeaf5dba',
        '/architecture-docs/standards-&-compliance/category/deploy':
            '/docs/87a97099-f787-4860-a294-d1758eddc2ac',
        '/architecture-docs/standards-&-compliance/category/design':
            '/docs/fd347b1e-fb79-4e93-8abb-e8a13ca090e6',
        '/architecture-docs/standards-&-compliance/category/design-1':
            '/docs/098a8b70-36ab-4e00-a647-96e742628ac9',
        '/architecture-docs/standards-&-compliance/category/develop':
            '/docs/be7a9cc1-7742-49de-806d-f97152b07b29',
        '/architecture-docs/standards-&-compliance/category/distribute':
            '/docs/8aaccbb5-df36-4b05-bc1f-ea898c1e03a5',
        '/architecture-docs/standards-&-compliance/category/graphql-api-standards':
            '/docs/645328d0-eba1-4f0c-a2fc-49d624db3144',
        '/architecture-docs/standards-&-compliance/category/internal-api-standards':
            '/docs/39e0f4e1-d0f9-4d3d-b491-bdc9916deede',
        '/architecture-docs/standards-&-compliance/category/meta-standards':
            '/docs/7d46cf7a-6628-48d1-bc97-1e6618a77dc2',
        '/architecture-docs/standards-&-compliance/category/observe':
            '/docs/0b3538be-d648-4f3a-9325-33fa4b37cb9b',
        '/architecture-docs/standards-&-compliance/category/references':
            '/docs/80426816-b46c-4cdd-8f4b-3560fc1c828e',
        '/architecture-docs/standards-&-compliance/category/references-1':
            '/docs/fa286fd8-cbbe-4c89-b680-970dda09e7f0',
        '/architecture-docs/standards-&-compliance/category/rest-api-standards':
            '/docs/525db395-b79c-4685-9954-02958415d40d',
        '/architecture-docs/standards-&-compliance/category/secure':
            '/docs/79d06a9c-ae2a-491a-8205-8be280d40ab8',
        '/architecture-docs/standards-&-compliance/category/test':
            '/docs/14ce8c73-ef57-4e18-a133-917288360e9a',
        '/architecture-docs/standards-&-compliance/:path*': '/docs/:path*',
        '/architecture-docs/reference-architecture': '/reference-architecture',
        '/architecture-docs/reference-architecture/:path*': '/docs/:path*',
        '/architecture-docs/papers': '/papers',
        '/architecture-docs/papers/:path*': '/docs/:path*',
        '/architecture-docs/products/resources': '/resources',
        '/architecture-docs/BvBTracker': '/resources/bvb-tracker',
        '/architecture-docs/metrics': '/resources/metrics',
        '/architecture-docs/apis': '/resources/apis',
        '/architecture-docs/OnboardingRequest': '/onboarding-form',
        '/architecture-docs/OnboardingApproval': '/onboarding-approval',
        '/architecture-docs/contribute/faqs': '/faqs',
        '/architecture-docs/contribute/bvb-faqs':
            '/contribute/build-vs-buy-faqs',
        '/architecture-docs/contribute/edit-pages':
            '/contribute/how-to-propose-edits',
        '/architecture-docs/contribute/how-to-contribute-bvb':
            '/contribute/getting-started-with-build-vs-buy',
        '/architecture-docs/contribute/subdomain-onboarding-guideline':
            '/contribute/subdomain-onboarding-guidelines',
        '/architecture-docs/contribute/:path*': '/contribute/getting-started',
        '/architecture-docs/strategy/EAStrategy':
            '/strategy/ea-vision-and-strategy',
        '/architecture-docs/strategy/:path*':
            '/strategy/authoritative-domain-api-lifecycle',
        '/architecture-docs/:path*': '/:path*',
        '/governance/:path*': 'https://architecture.aexp.com/governance/:path*',
        '/docs/0b194847-4d13-47c3-81d2-ce9eb06c22aa':
            '/initiatives/93aaaa3b-907c-4b29-9a31-7f65b934be1a',
        '/docs/3892d0a9-3fc7-4fa3-a61f-ea467808fc13':
            '/initiatives/5ae02885-7f7b-48a9-b9d6-8a2a1dc0f62d',
        '/docs/ad53b8f1-4eb6-4a9e-bfa1-d38478ca183a':
            '/initiatives/d3553f46-62b8-48f6-bd27-cb71fc4aa7bd'
    }

    // short-lived link-shortener style redirects, kept non-permanent so browsers don't cache them indefinitely
    const linksMappings: Record<string, string> = {
        '/links/api-certification-training':
            '/contribute/api-end-to-end-workflow',
        '/links/domain-apis/heatmap': `${METRICS_PATH}?view=list`,
        '/links/domain-apis/heatmap/unitcio': `${METRICS_PATH}?group=unitcio&view=list`,
        '/links/docs/initiative-management':
            '/contribute/initiatives-management-page-guide',
        '/links/docs/application-management':
            '/contribute/applications-management-page-guide',
        '/links/domain-apis/heatmap/burr-report': `${METRICS_PATH}?view=list&burrReport=true`,
        '/links/skills-guide': '/resources/skills'
    }

    // catches browsers that already cached the old 308 for the /links/* entries above and
    // landed on their previous (now stale) destination; `has` is required since `source` only matches the pathname
    const legacyMetricsQueryRedirects: Redirect[] = [
        {
            source: '/resources/metrics',
            has: [
                { type: 'query', key: 'heatmap', value: 'true' },
                { type: 'query', key: 'group', value: 'unitcio' }
            ],
            permanent: false,
            destination: `${METRICS_PATH}?group=unitcio&view=list`
        },
        {
            source: '/resources/metrics',
            has: [
                { type: 'query', key: 'heatmap', value: 'true' },
                { type: 'query', key: 'burrReport', value: 'true' }
            ],
            permanent: false,
            destination: `${METRICS_PATH}?view=list&burrReport=true`
        },
        {
            source: '/resources/metrics',
            has: [{ type: 'query', key: 'heatmap', value: 'true' }],
            permanent: false,
            destination: `${METRICS_PATH}?view=list`
        }
    ]

    for (const [source, destination] of Object.entries(mappings)) {
        redirects.push({
            source,
            destination,
            permanent: true
        })
    }

    for (const [source, destination] of Object.entries(linksMappings)) {
        redirects.push({
            source,
            destination,
            permanent: false
        })
    }

    redirects.push(...legacyMetricsQueryRedirects)

    return redirects
}
