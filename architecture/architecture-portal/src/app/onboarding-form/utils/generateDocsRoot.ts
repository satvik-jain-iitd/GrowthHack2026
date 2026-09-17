/* istanbul ignore file */
import { PLAYBOOK_TYPE_IDS } from '@/constants'

export function generateDocsRoot(
    docsRoot: string | undefined,
    playbookTypeId: string
) {
    if (docsRoot === undefined) {
        if (playbookTypeId === PLAYBOOK_TYPE_IDS.BUILD_VS_BUY) {
            return '/buildvsbuy'
        }
        return '/workproducts'
    }
    const root =
        playbookTypeId === PLAYBOOK_TYPE_IDS.BUILD_VS_BUY
            ? 'buildvsbuy'
            : 'workproducts'
    let cleanedDocumentationFolder = docsRoot.trim()
    if (!cleanedDocumentationFolder.startsWith('/')) {
        cleanedDocumentationFolder = '/' + cleanedDocumentationFolder
    }
    const lowerCaseDocsFolder = cleanedDocumentationFolder.toLowerCase()
    let documentationFolder = cleanedDocumentationFolder

    const containsRoot =
        lowerCaseDocsFolder.includes(`/${root}/`) ||
        lowerCaseDocsFolder.endsWith(`/${root}`)

    if (!containsRoot) {
        if (lowerCaseDocsFolder.endsWith('/')) {
            documentationFolder = cleanedDocumentationFolder + root
        } else {
            documentationFolder = cleanedDocumentationFolder + `/${root}`
        }
    } else if (lowerCaseDocsFolder.endsWith(`/${root}/`)) {
        documentationFolder = cleanedDocumentationFolder.slice(0, -1)
    }

    return documentationFolder
}
