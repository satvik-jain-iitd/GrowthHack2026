/* istanbul ignore file */
import { useMutation } from '@tanstack/react-query'
import {
    DiagramApiResult,
    DiagramFormApiParams,
    DiagramApiPayload
} from '../utils/types'
import { fetchWithToken } from '@/utils/client'

const standardErrorMessage = 'Something went wrong, Please try again.'

const toErrorResult = (error_description: string): DiagramApiResult => ({
    type: 'error',
    errors: [{ error_description }]
})

const parseDiagramResponse = (
    apiResponse: DiagramApiPayload
): DiagramApiResult => {
    const diagramB64 = apiResponse?.diagram?.base64_encoded_image
    const diagramImage = diagramB64
        ? `data:image/png;base64,${diagramB64}`
        : null
    const diagramFileName = apiResponse?.diagram?.file_name || 'diagram.png'

    const diagramDetailB64 = apiResponse?.diagram_detail?.base64_encoded_image
    const diagramDetailImage = diagramDetailB64
        ? `data:image/png;base64,${diagramDetailB64}`
        : null
    const diagramDetailFileName =
        apiResponse?.diagram_detail?.file_name || 'diagram_detail.png'

    if (diagramImage && diagramDetailImage) {
        return {
            type: 'image',
            diagramImage,
            diagramFileName,
            diagramDetailImage,
            diagramDetailFileName
        }
    }

    if (diagramDetailImage) {
        return toErrorResult("Diagram image couldn't be generated")
    }

    if (diagramImage) {
        return toErrorResult("Diagram detail image couldn't be generated")
    }
    return toErrorResult(standardErrorMessage)
}

const submitDiagramFormData = async (
    apiBaseUrl: string,
    params: DiagramFormApiParams
): Promise<DiagramApiResult> => {
    const formData = new FormData()

    formData.append('artifact_name', params.artifact_name)
    formData.append('diagram_level', params.diagram_level)
    formData.append('diagram_type', params.diagram_type)
    formData.append('file', params.file)
    formData.append('ads_id', params.ads_id)
    formData.append('responseType', 'json')

    if (params.subdomains && Array.isArray(params.subdomains)) {
        params.subdomains.forEach(subdomain => {
            formData.append('subdomains', subdomain)
        })
    }

    try {
        const generateDiagram = '/technology/operations/v1/artifacts'
        const response = await fetchWithToken(apiBaseUrl + generateDiagram, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })

        if (!response.ok) {
            try {
                const data = await response.json()
                if (Array.isArray(data?.errors)) {
                    return { type: 'error', errors: data.errors }
                }
            } catch {
                // Non-JSON error response, fallback to standard error
            }
            return toErrorResult(standardErrorMessage)
        }

        const contentType = response.headers.get('Content-Type') || ''
        if (!contentType.startsWith('application/json')) {
            return toErrorResult(standardErrorMessage)
        }

        const apiResponse = (await response.json()) as DiagramApiPayload
        return parseDiagramResponse(apiResponse)
    } catch {
        return toErrorResult(standardErrorMessage)
    }
}

export const useSubmitDiagramFormData = (apiBaseUrl: string) => {
    return useMutation({
        mutationFn: async (params: DiagramFormApiParams) => {
            return submitDiagramFormData(apiBaseUrl, params)
        }
    })
}
