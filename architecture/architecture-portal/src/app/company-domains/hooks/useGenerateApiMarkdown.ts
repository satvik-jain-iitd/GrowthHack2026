/* istanbul ignore file */
'use client'
import { ApiEndpoint, ApiMetadata } from '../types'
import { useState } from 'react'
import { useDirectoryContext } from '@/context'
import { toast } from 'react-toastify'

const formatMarkdownValue = (
    value: unknown
): { text: string; isCodeBlock: boolean } => {
    if (value === null || value === undefined) {
        return { text: 'N/A', isCodeBlock: false }
    }

    if (typeof value === 'object') {
        try {
            return {
                text: JSON.stringify(value, null, 2),
                isCodeBlock: true
            }
        } catch {
            return { text: 'N/A', isCodeBlock: false }
        }
    }

    if (typeof value === 'string') {
        const trimmed = value.trim()
        if (!trimmed) {
            return { text: 'N/A', isCodeBlock: false }
        }

        try {
            const parsed = JSON.parse(trimmed)
            return {
                text: JSON.stringify(parsed, null, 2),
                isCodeBlock: true
            }
        } catch {
            return { text: trimmed, isCodeBlock: false }
        }
    }

    return { text: String(value), isCodeBlock: false }
}

const formatField = (label: string, value: unknown): string => {
    const formatted = formatMarkdownValue(value)

    if (formatted.isCodeBlock) {
        return `- **${label}**:\n\`\`\`json\n${formatted.text}\n\`\`\``
    }

    return `- **${label}**: ${formatted.text}`
}

const endpointTemplate = (
    endpoint: ApiEndpoint,
    apiIndex: number,
    operationIndex: number
) => `#### ${apiIndex + 1}.${operationIndex + 1} Operation Name: ${endpoint.endpoint_operation || 'N/A'}
- **Operation Description**: ${endpoint.endpoint_ds || 'N/A'}
- **Operation Type**: ${endpoint.endpoint_type || 'N/A'}
- **Operation Status**: ${endpoint.status || 'N/A'}
- **Journey Link**: ${endpoint.journey_link ? `[Link](${endpoint.journey_link})` : 'N/A'}
- **HTTP Method**: ${endpoint.verb || 'N/A'}
- **URI**: ${endpoint.uri || 'N/A'}
- **Catalog URL**: ${endpoint.api_catalog_url ? `[Link](${endpoint.api_catalog_url})` : 'N/A'}
- **NFRs**:
    - **Response Time (P99)**: ${endpoint.slas?.response_time || 'N/A'}
    - **Average RPS**: ${endpoint.slas?.average_rps || 'N/A'}
    - **Peak RPS**: ${endpoint.slas?.peak_rps || 'N/A'}
    - **Error Rate (%)**: ${endpoint.slas?.error_rate || 'N/A'}
    - **Availability (%)**: ${endpoint.slas?.availability || 'N/A'}
- **Intended Markets**: ${endpoint.intended_markets?.map(market => market.label).join(', ') || 'N/A'}
- **Actual Markets**: ${endpoint.actual_markets?.map(market => market.label).join(', ') || 'N/A'}
${formatField('Input', endpoint.input)}
${formatField('Output', endpoint.output)}`

const ebcmNames = (api: ApiMetadata) =>
    api.ebcm_v10?.length
        ? api.ebcm_v10.map(capability => capability.capability_nm).join(', ')
        : api.ebcm_names?.join(', ')

const apiTemplate = (
    api: ApiMetadata,
    apiIndex: number
) => `## ${apiIndex + 1}. API Name: ${api.api_nm || 'N/A'}
- **Description**: ${api.api_ds || 'N/A'}
- **Resource**: ${api.api_resource || 'N/A'}
- **Provider Company Domain**: ${api.prim_company_domain_nm || 'N/A'}
- **Provider Sub Domain**: ${api.prim_company_sub_domain_nm || 'N/A'}
- **Consumer Company Domains**: ${api.consm_company_domain_nm?.join(', ') || 'N/A'}
- **EBCM Names**: ${ebcmNames(api) || 'N/A'}
- **API Status**: ${api.status || 'N/A'}

### ${apiIndex + 1}.0 API Operations
${api.api_endpoint.map((endpoint, operationIndex) => endpointTemplate(endpoint, apiIndex, operationIndex)).join('\n\n')}`

export const useGenerateApiMarkdown = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { apiData } = useDirectoryContext()

    const generateApiMarkdown = (dataParam: ApiMetadata[]) => {
        try {
            const data = dataParam.length > 0 ? dataParam : apiData
            if (!data || data.length === 0) {
                toast.info('No data available to generate markdown.')
                return
            }
            setIsLoading(true)
            let markdown = ''
            markdown += `# ${data[0]?.prim_company_domain_nm || 'N/A'} APIs\n\n`

            data.forEach((api, apiIndex) => {
                markdown += `${apiTemplate(api, apiIndex)}\n\n`
            })
            // also create a downloadable markdown file
            const blob = new Blob([markdown], { type: 'text/markdown' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const date = new Date().toISOString().split('T')[0]
            a.download = `${data[0]?.prim_company_domain_nm || 'N/A'}_APIs_${date}.md`
            a.click()
            URL.revokeObjectURL(url)
            toast.success('Markdown generated and downloaded successfully!')
            setIsLoading(false)
        } catch (error) {
            toast.error('Failed to generate markdown. Please try again.')
            console.error('Error generating markdown:', error)
            setIsLoading(false)
            return
        } finally {
            setIsLoading(false)
        }
    }

    return { generateApiMarkdown, isLoading }
}
