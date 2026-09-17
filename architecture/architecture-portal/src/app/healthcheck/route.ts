/* istanbul ignore file */
import { SOURCE_HOST } from '@/constants'
import { getTokenSnapshot } from '@/utils/server/githubTokenPool'
import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json(
        {
            status: 'ok',
            tokens: [
                ...getTokenSnapshot(SOURCE_HOST.GHE),
                ...getTokenSnapshot(SOURCE_HOST.GHC)
            ]
        },
        { status: 200 }
    )
}
