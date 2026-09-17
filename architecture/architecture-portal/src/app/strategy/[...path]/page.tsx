/* istanbul ignore file */
import StaticDocument from '@/app/docs/components/StaticDocument'
import { getStaticPaths, getStaticMetadata } from '@/app/docs/utils/server'

const STATIC_DOCS_PATH = 'src/app/strategy/markdown'

export async function generateStaticParams() {
    const paths = await getStaticPaths(STATIC_DOCS_PATH)
    return Object.keys(paths).map(path => ({
        path: path.split('/')
    }))
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ path: string[] }>
}) {
    const { path } = await params
    return await getStaticMetadata(STATIC_DOCS_PATH, path.join('/'))
}

export default async function Strategy({
    params
}: {
    params: Promise<{ path: string[] }>
}) {
    const { path } = await params
    return (
        <StaticDocument
            route='strategy'
            label='Strategy'
            docs={STATIC_DOCS_PATH}
            path={path.join('/')}
        />
    )
}
