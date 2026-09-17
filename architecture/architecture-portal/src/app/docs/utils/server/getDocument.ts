/* istanbul ignore file */
import matter from 'gray-matter'
import { PlaybookFile } from '@/types/PlaybookFile'
import { PrevNext } from '@/types/PrevNext'
import { API_ENDPOINTS, PLAYBOOK_TYPE_IDS, SOURCE_HOST } from '@/constants'
import {
    diagnoseGithubFailure,
    fetchArchitecture,
    fetchGithub
} from '@/utils/server'
import { sanitizeContent } from './sanitizeContent'
import { rewriteImports } from './rewriteImports'
import { getTableOfContents } from './getTableOfContents'

export async function getDocument({
    uuid,
    typeId
}: {
    uuid?: string
    typeId?: string
}) {
    // Kick off async tasks
    const isAdrs = typeId === PLAYBOOK_TYPE_IDS.ADR
    const tasks = [
        // Fetch the sidebar
        fetchArchitecture(API_ENDPOINTS.GET_SIDEBAR(uuid, typeId, isAdrs))
            .then(res => (res.ok ? res.json() : { data: [] }))
            .then(res => res.data ?? [])
    ]

    if (!uuid) {
        // Await async tasks - catch failures (e.g. missing auth at build time) so ISR can
        // still generate a static shell; the page will revalidate at runtime with real data.
        const [sidebar_hierarchy = []] = await Promise.all(
            tasks.map(t => t.catch(() => null))
        )
        return {
            isMdx: false,
            isBvB: typeId === PLAYBOOK_TYPE_IDS.BUILD_VS_BUY,
            isDomain: typeId === PLAYBOOK_TYPE_IDS.COMPANY_DOMAIN,
            isInitiative: typeId === PLAYBOOK_TYPE_IDS.INITIATIVE,
            isAdrs,
            isIndex: true,
            isPlaybook: false,
            sidebar_hierarchy,
            source_host: SOURCE_HOST.GHE
        }
    }

    // Fetch the file
    const file: PlaybookFile = await fetchArchitecture(
        API_ENDPOINTS.GET_PLAYBOOK_FILE_BY_ID(uuid, isAdrs)
    )
        .then(res => res.json())
        .then(res => res.data)

    const {
        fl_id,
        playbook_id,
        repst_nm,
        fl_path_tx,
        artifact_root_in,
        breadcrumbs,
        previous,
        next,
        workproduct,
        sidebar_details,
        domain_details,
        fl_mtda_da,
        artifact_id
    } = file

    const isPlaybook = uuid === playbook_id
    const playbook_type_id = isAdrs
        ? typeId!
        : sidebar_details!.playbook_type_id
    const repository = repst_nm || 'architecture-portal'
    const sidebar_slug = sidebar_details!.url_slug_tx
    const sidebar_label = isAdrs ? undefined : sidebar_details!.sidebar_label
    const isBvB = playbook_type_id === PLAYBOOK_TYPE_IDS.BUILD_VS_BUY
    const isDomain = playbook_type_id === PLAYBOOK_TYPE_IDS.COMPANY_DOMAIN
    const isInitiative = playbook_type_id === PLAYBOOK_TYPE_IDS.INITIATIVE
    const source_host = file.source_host || SOURCE_HOST.GHE
    const prevNext: PrevNext = {
        previous,
        next
    }

    const isIndex =
        !fl_path_tx || // No file path means we're at the playbook entry point (although sometimes playbooks have an index.md file)
        artifact_root_in || // Artifact root means this is a workproducts index page (e.g. /workproducts/1-business-vision/index.mdx)
        !!domain_details || // Domain details means this is a domain landing page
        (workproduct?.index === '2.3' && isDomain) // 2.3 Domain APIs page
    if (isIndex) {
        // Await async tasks
        const [sidebar_hierarchy = []] = await Promise.all(tasks)
        return {
            isMdx: false,
            isBvB,
            isDomain,
            isAdrs,
            isIndex,
            isPlaybook,
            playbook_id,
            domain_details,
            repository,
            breadcrumbs,
            workproduct,
            sidebar_slug,
            sidebar_label,
            sidebar_hierarchy,
            prevNext,
            isInitiative,
            isCompanyDomainApi: workproduct?.index === '2.3' && isDomain,
            source_host
        }
    }

    // Fetch the file content from GitHub
    const isMdx = fl_path_tx.endsWith('.mdx')
    const ref = fl_mtda_da?.sha ? `?ref=${fl_mtda_da.sha}` : ''
    const response = await fetchGithub(
        source_host,
        `/repos/amex-eng/${repository}/contents/${fl_path_tx}${ref}`
    )

    if (!response?.ok) {
        const documentError = await diagnoseGithubFailure({
            host: source_host,
            owner: 'amex-eng',
            repository,
            filePath: fl_path_tx,
            response
        })
        const [sidebar_hierarchy = []] = await Promise.all(
            tasks.map(t => t.catch(() => null))
        )
        return {
            isMdx,
            isBvB,
            isDomain,
            isAdrs,
            isIndex: false,
            isPlaybook,
            isInitiative,
            documentError,
            playbook_id,
            fl_id,
            repository,
            filePath: fl_path_tx,
            breadcrumbs,
            workproduct,
            sidebar_slug,
            sidebar_label,
            sidebar_hierarchy,
            prevNext,
            source_host
        }
    }

    const fileData = await response.json()
    const fileContents: string = Buffer.from(
        fileData.content,
        fileData.encoding
    ).toString('utf8')

    // Parse frontmatter
    const { content, data } = matter(fileContents)

    // Rewrite imports and sanitize content
    const markdown = sanitizeContent(rewriteImports(content))

    // Generate Table of Contents
    const toc = getTableOfContents(markdown, isMdx)

    // Await async tasks
    const [sidebar_hierarchy = []] = await Promise.all(tasks)

    return {
        isMdx,
        isBvB,
        isDomain,
        isAdrs,
        isIndex: false,
        isPlaybook,
        playbook_id,
        fl_id,
        frontmatter: data,
        markdown,
        sourceLink: fileData.html_url,
        commit_sha: fl_mtda_da?.sha,
        downloadPDF: true,
        repository,
        filePath: fl_path_tx,
        breadcrumbs,
        workproduct,
        sidebar_slug,
        sidebar_label,
        sidebar_hierarchy,
        prevNext,
        toc,
        filePlaybookTypeId: file.playbook_type_id,
        isInitiative,
        artifact_id,
        source_host
    }
}
