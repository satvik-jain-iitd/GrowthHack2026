/* istanbul ignore file */
import { Metadata } from 'next'
import { getStaticPaths } from './getStaticPaths'
import { getStaticBreadcrumbs } from './getStaticBreadcrumbs'

export async function getStaticMetadata(
    baseDir: string,
    relativePath: string
): Promise<Metadata> {
    const paths = await getStaticPaths(baseDir)
    const filePath = paths[relativePath]
    const breadcrumbs = getStaticBreadcrumbs(filePath)
    return {
        title: breadcrumbs[breadcrumbs.length - 1].label
    }
}
