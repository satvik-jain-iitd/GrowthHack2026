/* istanbul ignore file */
import { useMutation } from '@tanstack/react-query'
import {
    DiagramApiResult,
    DBFootprintParams,
    DBFootprintApiPayload
} from '../utils/types'
import { fetchWithToken } from '@/utils/client'

const standardErrorMessage = 'Something went wrong, Please try again.'

const toErrorResult = (error_description: string): DiagramApiResult => ({
    type: 'error',
    errors: [{ error_description }]
})

const parseDiagramResponse = (
    apiResponse: DBFootprintApiPayload
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

const parseDBFootprintResponse = (
    apiResponse: DBFootprintApiPayload
): DiagramApiResult => {
    if (Array.isArray(apiResponse?.consolidated)) {
        return {
            type: 'db-footprint',
            company_domain_id: apiResponse.company_domain_id || '',
            company_domain_name: apiResponse.company_domain_name || '',
            consolidated: apiResponse.consolidated
        }
    }

    return parseDiagramResponse(apiResponse)
}

const fetchDBFootprint = async (
    apiBaseUrl: string,
    params: DBFootprintParams
): Promise<DiagramApiResult> => {
    try {
        const queryParams = new URLSearchParams({
            car_id: String(params.car_id),
            company_domain_id: params.company_domain_id,
            company_domain_name: params.company_domain_name,
            env: params.env,
            include_details_per_car_id: String(
                params.include_details_per_car_id
            )
        })
        const dbFootprintRequest = `/technology/operations/v1/db-footprint?${queryParams.toString()}`
        const response = await fetchWithToken(apiBaseUrl + dbFootprintRequest, {
            method: 'GET',
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

        const apiResponse = (await response.json()) as DBFootprintApiPayload
        return parseDBFootprintResponse(apiResponse)
    } catch {
        return toErrorResult(standardErrorMessage)
    }
}

export const useDBFootprint = (apiBaseUrl: string) => {
    return useMutation({
        mutationFn: async (params: DBFootprintParams) => {
            return fetchDBFootprint(apiBaseUrl, params)
        }
    })
}
