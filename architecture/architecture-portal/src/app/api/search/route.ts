import { ARCHITECTURE_SEARCH_HOST } from '@/constants'
import { Logger } from '@/utils/server'
import { NextResponse } from 'next/server'
import Typesense from 'typesense'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    if (!q) {
        return NextResponse.json({ hits: [] })
    }

    try {
        const typesense = new Typesense.Client({
            nodes: [
                {
                    host: ARCHITECTURE_SEARCH_HOST,
                    port: 443,
                    protocol: 'https'
                }
            ],
            apiKey: process.env.TYPESENSE_API_KEY!,
            connectionTimeoutSeconds: 5
        })

        const searchResults = await typesense
            .collections('documents')
            .documents()
            .search({
                q,
                query_by: 'title,playbook_nm,content,repo,playbook_type_nm',
                query_by_weights: '5,3,2,1,1',
                per_page: 10
            })
        return NextResponse.json(searchResults)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        Logger.error(error)
        return NextResponse.json(
            { error: error.message || String(error) },
            { status: 500 }
        )
    }
}
