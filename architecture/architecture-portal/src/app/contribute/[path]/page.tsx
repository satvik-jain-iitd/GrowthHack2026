/* istanbul ignore file */
import StaticDocument from '@/app/docs/components/StaticDocument'
import { getStaticPaths, getStaticMetadata } from '@/app/docs/utils/server'

const STATIC_DOCS_PATH = 'src/app/contribute/markdown'

export async function generateStaticParams() {
    const paths = await getStaticPaths(STATIC_DOCS_PATH)
    return Object.keys(paths).map(path => ({
        path
    }))
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ path: string }>
}) {
    const { path } = await params
    return await getStaticMetadata(STATIC_DOCS_PATH, path)
}

export default async function Contribute({
    params
}: {
    params: Promise<{ path: string }>
}) {
    const { path } = await params
    return (
        <StaticDocument
            route='contribute'
            label='How to Contribute'
            docs={STATIC_DOCS_PATH}
            path={path}
        />
    )
}
