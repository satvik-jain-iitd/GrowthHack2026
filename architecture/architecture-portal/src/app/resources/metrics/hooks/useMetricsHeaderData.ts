/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { HeaderData } from '../types'
import { fetchWithToken } from '@/utils/client'

const fetchMetrics = async (view: string): Promise<HeaderData | undefined> => {
    if (view) {
        const endpoints = []
        if (view === 'metric1') {
            endpoints.push(API_ENDPOINTS.GET_ECMI_MAPPED_APPS_BY_GROUP('all'))
            const responses = await Promise.all(
                endpoints.map(url => fetchWithToken(url))
            )
            const data = await Promise.all(responses.map(res => res.json()))
            const ecmiAllData = data[0]
            const headerCount = {
                appCount: ecmiAllData.data?.[0]?.denominator || 0,
                mappedAppCount: ecmiAllData.data?.[0]?.numerator || 0,
                percentage: parseFloat(
                    ecmiAllData.data?.[0]?.percentage || 0
                ).toFixed(2)
            }
            return headerCount
        }
        if (view === 'metric2') {
            endpoints.push(API_ENDPOINTS.GET_API_METRICS_DASHBOARD)
            const [response] = await Promise.all(
                endpoints.map(url => fetchWithToken(url))
            )
            const { data = {} } = await response.json()
            const darb_apis =
                (+data.darb_approved_apis || 0) +
                (+data.earb_approved_apis || 0) +
                (+data.onboarded_catalog_apis || 0) +
                (+data.design_certified_apis || 0) +
                (+data.prod_certified_apis || 0)
            const earb_apis =
                (+data.earb_approved_apis || 0) +
                (+data.onboarded_catalog_apis || 0) +
                (+data.design_certified_apis || 0) +
                (+data.prod_certified_apis || 0)
            const onboarded_apis =
                (+data.onboarded_catalog_apis || 0) +
                (+data.design_certified_apis || 0) +
                (+data.prod_certified_apis || 0)
            const design_apis =
                (+data.design_certified_apis || 0) +
                (+data.prod_certified_apis || 0)
            const prod_apis = +data.prod_certified_apis || 0

            const darb_ops =
                (+data.darb || 0) +
                (+data.onboarded || 0) +
                (+data.earb || 0) +
                (+data.design || 0) +
                (+data.prod || 0)
            const earb_ops =
                (+data.earb || 0) +
                (+data.onboarded || 0) +
                (+data.design || 0) +
                (+data.prod || 0)
            const onboarded_ops =
                (+data.onboarded || 0) + (+data.design || 0) + (+data.prod || 0)
            const design_ops = (+data.design || 0) + (+data.prod || 0)
            const prod_ops = +data.prod || 0
            const approvedTypeACount =
                (+data.typea_earb || 0) +
                (+data.typea_onboarded || 0) +
                (+data.typea_design || 0) +
                (+data.typea_prod || 0)
            const typeACount =
                (+data.typea_earb || 0) +
                (+data.typea_onboarded || 0) +
                (+data.typea_design || 0) +
                (+data.typea_prod || 0) +
                (+data.typea_darb || 0) +
                (+data.typea_proposed || 0)
            const percentage = typeACount
                ? ((approvedTypeACount / typeACount) * 100).toFixed(2)
                : '0.00'

            const headerCount = {
                darb_apis,
                earb_apis,
                onboarded_apis,
                design_apis,
                prod_apis,
                darb_ops,
                earb_ops,
                onboarded_ops,
                design_ops,
                prod_ops,
                approvedTypeACount,
                typeACount,
                percentage,
                domainCount: data.domainCount || 0
            }
            return headerCount
        }
    }
    return undefined
}

export const useMetricsHeaderData = (view: string) => {
    // metric3 has no header counts. Letting the query run would make fetchMetrics
    // resolve undefined, which react-query v5 rejects as an errored query.
    const hasHeaderData = view === 'metric1' || view === 'metric2'
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['metricsHeader', view],
        queryFn: () => fetchMetrics(view),
        enabled: hasHeaderData
    })

    useEffect(() => {
        if (hasHeaderData) refetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view])

    return { headerCount: data, loading: isLoading, error, refetch }
}
