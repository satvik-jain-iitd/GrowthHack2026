/* istanbul ignore file */
import path from 'path'
import fs from 'fs/promises'
import matter from 'gray-matter'
import { getStaticPaths } from './getStaticPaths'
import { getTableOfContents } from './getTableOfContents'
import { getStaticSidebar } from './getStaticSidebar'
import { getStaticBreadcrumbs } from './getStaticBreadcrumbs'
import { getStaticPrevNext } from './getStaticPrevNext'

export async function getStaticDocument(
    baseRoute: string,
    baseDir: string,
    relativePath: string
) {
    const paths = await getStaticPaths(baseDir)
    const filePath = paths[relativePath]
    const isMdx = filePath.endsWith('.mdx')
    const absolutePath = path.join(process.cwd(), baseDir, filePath)
    const fileContents = await fs.readFile(absolutePath, 'utf-8')

    // Parse frontmatter
    const { content: markdown, data: frontmatter } = matter(fileContents)

    // Generate Table of Contents
    const toc = getTableOfContents(markdown, isMdx)

    // Get static sidebar
    const sidebar = await getStaticSidebar(baseRoute, baseDir, filePath)

    // Generate breadcrumbs
    const breadcrumbs = getStaticBreadcrumbs(filePath)

    // Get previous and next links
    const prevNext = getStaticPrevNext(paths, baseRoute, relativePath)

    return {
        isMdx,
        frontmatter,
        markdown,
        sidebar,
        toc,
        breadcrumbs,
        prevNext
    }
}
