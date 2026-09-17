/* istanbul ignore file */
import React from 'react'
import Document from '@/app/docs/components/Document'
import { fetchArchitecture } from '@/utils/server'
import { API_ENDPOINTS } from '@/constants'

export default async function page({
    params
}: {
    params: Promise<{ initiativeId: string }>
}) {
    const { initiativeId } = await params

    const initiativeDetails = await fetchArchitecture(
        API_ENDPOINTS.GET_PTB_INITIATIVE(initiativeId)
    )
        .then(res => res.json())
        .then(res => res.data)

    const { playbookId } = initiativeDetails || {}

    return <Document uuid={playbookId} isInitiativeLanding={true} />
}
