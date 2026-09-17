/* istanbul ignore file */
import { API_ENDPOINTS, ARCHITECTURE_URL } from '@/constants'
import { Playbook } from '@/types/Playbook'
import { PlaybookFile } from '@/types/PlaybookFile'
import { fetchArchitecture } from '@/utils/server'
import {
    DEFAULT_METRIC_VIEW,
    metricsPathFor
} from '@/app/resources/metrics/constants/metricRoutes'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { data: playbooks } = await fetchArchitecture(
        API_ENDPOINTS.GET_PLAYBOOKS,
        { next: { revalidate: 0 } }
    ).then(res => res.json())
    const { data: files } = await fetchArchitecture(
        API_ENDPOINTS.GET_PLAYBOOKS_FILES,
        { next: { revalidate: 0 } }
    ).then(res => res.json())
    const paths = [
        '/',
        '/company-domains',
        '/foundational-technologies',
        '/directory',
        '/onboarding-form',
        '/contribute/getting-started',
        '/contribute/getting-started-with-build-vs-buy',
        '/contribute/subdomain-onboarding-guidelines',
        '/contribute/build-vs-buy-faqs',
        '/contribute/how-to-propose-edits',
        '/resources',
        '/resources/apis',
        '/resources/bvb-tracker',
        '/resources/edaaat',
        metricsPathFor(DEFAULT_METRIC_VIEW),
        '/faqs',
        ...playbooks.map((x: Playbook) => `/docs/${x.playbook_id}`),
        ...files.map((x: PlaybookFile) => `/docs/${x.fl_id}`)
    ]

    return paths.map(path => ({
        url: `${ARCHITECTURE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: path === '/' ? 1 : 0.7
    }))
}
