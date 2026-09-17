/* istanbul ignore file */
import { Metadata } from 'next'
import { PlaybookFile } from '@/types/PlaybookFile'
import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'

export async function getMetadata(uuid: string): Promise<Metadata> {
    try {
        const file: PlaybookFile = await fetchArchitecture(
            API_ENDPOINTS.GET_PLAYBOOK_FILE_BY_ID(uuid)
        )
            .then(res => res.json())
            .then(res => res.data)

        const { breadcrumbs } = file
        return {
            title: breadcrumbs![breadcrumbs!.length - 1].label
        }
    } catch {
        return {
            title: 'American Express'
        }
    }
}
