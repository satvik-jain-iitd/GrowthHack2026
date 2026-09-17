/* istanbul ignore file */
import { useMutation } from '@tanstack/react-query'
import {
    JsonValue,
    PreviousArtifactsParams,
    PreviousArtifactsResult
} from '../utils/types'
import { fetchWithToken } from '@/utils/client'

const parseFileName = (contentDisposition: string | null): string | null => {
    if (!contentDisposition) {
        return null
    }

    const utf8FileNameMatch = contentDisposition.match(
        /filename\*=UTF-8''([^;]+)/i
    )
    if (utf8FileNameMatch?.[1]) {
        return decodeURIComponent(utf8FileNameMatch[1])
    }

    const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i)
    return fileNameMatch?.[1] || null
}

const fetchPreviousArtifacts = async (
    apiBaseUrl: string,
    params: PreviousArtifactsParams
): Promise<PreviousArtifactsResult> => {
    const standardErrorMessage = 'Usage metrics request failed'

    try {
        const formData = new FormData()

        formData.append('ads_id', params.ads_id)
        formData.append('artifact_name', params.artifact_name)
        formData.append('diagram_type', params.diagram_type)
        formData.append('diagram_level', params.diagram_level)
        if (params.file_name) {
            formData.append('file_name', params.file_name)
        }
        if (params.status_name) {
            formData.append('status_name', params.status_name)
        }
        if (params.error_text) {
            formData.append('error_text', params.error_text)
        }
        if (params.generated_diagrams) {
            formData.append(
                'generated_diagrams',
                JSON.stringify(params.generated_diagrams)
            )
        }
        if (params.input_file instanceof File) {
            formData.append('input_file', params.input_file)
        } else if (params.input_file) {
            formData.append('input_file', JSON.stringify(params.input_file))
        }

        const usageMetricsRequest =
            '/technology/operations/v1/previous-artifacts'
        const response = await fetchWithToken(
            apiBaseUrl + usageMetricsRequest,
            {
                method: 'POST',
                body: formData,
                credentials: 'include'
            }
        )

        if (!response.ok) {
            let errorMessage = standardErrorMessage

            try {
                const data = await response.json()
                if (data?.detail) {
                    errorMessage = `${standardErrorMessage}: ${JSON.stringify(data.detail)}`
                }
            } catch {
                // Ignore JSON parse errors and use default message
            }

            const error = new Error(errorMessage) as Error & {
                status?: number
            }
            error.status = response.status
            throw error
        }

        const contentType = response.headers.get('Content-Type') || ''
        const contentDisposition = response.headers.get('Content-Disposition')
        const responseBlob = await response.blob()
        const responseFileName = parseFileName(contentDisposition)
        const isExcelContentType =
            contentType.includes(
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ) ||
            contentType.includes('application/vnd.ms-excel') ||
            contentType.includes('application/octet-stream')
        const hasExcelFileName =
            responseFileName?.endsWith('.xlsx') ||
            responseFileName?.endsWith('.xls')

        if (responseBlob.size > 0 && (isExcelContentType || hasExcelFileName)) {
            return {
                fileBlob: responseBlob,
                fileName: responseFileName || 'usage-metrics.xlsx',
                data: null
            }
        }

        if (responseBlob.size > 0) {
            try {
                const responseText = await responseBlob.text()
                const parsedData = JSON.parse(responseText) as JsonValue
                return {
                    fileBlob: null,
                    fileName: null,
                    data: parsedData
                }
            } catch {
                // Non-JSON response body with no known file metadata.
            }
        }

        return {
            fileBlob: null,
            fileName: null,
            data: null
        }
    } catch (error) {
        if (error instanceof Error) {
            throw error
        }
        throw new Error(standardErrorMessage)
    }
}

export const usePreviousArtifacts = (apiBaseUrl: string) => {
    return useMutation({
        mutationFn: async (params: PreviousArtifactsParams) => {
            return fetchPreviousArtifacts(apiBaseUrl, params)
        }
    })
}
