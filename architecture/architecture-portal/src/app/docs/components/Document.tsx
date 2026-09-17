/* istanbul ignore file */
'use server'
import React from 'react'
import Mdx from '@/app/docs/components/Mdx'
import Markdown from '@/app/docs/components/Markdown'
import MarkdownPanel from '@/app/docs/components/MarkdownPanel'
import Index from '@/app/docs/components/Index'
import DocumentLayout from '@/app/docs/components/DocumentLayout'
import DocumentUnavailable from '@/app/docs/components/DocumentUnavailable'
import BvBWorkflow from '@/app/build-vs-buys/components/bvb-workflow/BvBWorkflow'
import ADRWorkflow from '@/app/adrs/components/ADRWorkflow'
import { getDocument, rewriteLinks } from '@/app/docs/utils/server'
import { DomainProvider } from '@/context'
import InitiativeLanding from '@/app/initiatives/components/InitiativeLanding'

export default async function Document({
    uuid,
    label,
    typeId,
    isInitiativeLanding
}: {
    uuid?: string
    label?: string
    typeId?: string
    isInitiativeLanding?: boolean
}) {
    const {
        isMdx,
        isBvB,
        isDomain,
        isAdrs,
        isIndex,
        playbook_id,
        fl_id,
        domain_details,
        sourceLink,
        commit_sha,
        downloadPDF,
        repository,
        filePath,
        markdown,
        frontmatter,
        breadcrumbs,
        workproduct,
        sidebar_slug,
        sidebar_label,
        sidebar_hierarchy,
        prevNext,
        toc,
        filePlaybookTypeId,
        isInitiative,
        isPlaybook,
        artifact_id,
        isCompanyDomainApi,
        source_host,
        documentError
    } = await getDocument({ uuid, typeId })

    if (documentError) {
        return (
            <DocumentLayout
                uuid={uuid}
                slug={sidebar_slug}
                label={sidebar_label ?? label!}
                sidebar={sidebar_hierarchy}
                breadcrumbs={breadcrumbs}
                prevNext={prevNext}
                excludeMetadataTags
            >
                <DocumentUnavailable error={documentError} />
            </DocumentLayout>
        )
    }

    const md = await rewriteLinks(markdown, playbook_id, filePath)
    const canEdit = !commit_sha
    const isInitiativeConsumerApi = workproduct?.index === '2.3' && isInitiative
    const excludeMetadataTags =
        isInitiativeLanding || isInitiativeConsumerApi || isCompanyDomainApi
    const fullWidth =
        !!domain_details ||
        (workproduct?.index === '2.3' && isDomain) ||
        (isInitiativeLanding && isPlaybook) ||
        isInitiativeConsumerApi
    const maxWidth = fullWidth ? 'unset' : undefined

    const path = filePath?.toLowerCase() || ''
    const normalizedPath = path.replaceAll('-', '')
    const isAdrPath =
        isAdrs ||
        path.includes('adr') ||
        normalizedPath.includes('architecturedecisionrecord')

    const isIndexOutsideAdrDir =
        path.includes('index') &&
        !normalizedPath.includes('architecturedecisionrecord') &&
        !normalizedPath.includes('adr')
    const showAdrHeader =
        isAdrPath &&
        !isIndexOutsideAdrDir &&
        !path.endsWith('architecturedecisionrecord/index.md') &&
        Boolean(playbook_id)

    const fileName = breadcrumbs?.pop()?.label ?? ''

    return (
        <DocumentLayout
            uuid={uuid}
            slug={sidebar_slug}
            label={sidebar_label ?? label!}
            sidebar={sidebar_hierarchy}
            tableOfContents={toc}
            breadcrumbs={breadcrumbs}
            prevNext={prevNext}
            download={downloadPDF}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            filePath={filePath}
            repo={repository}
            playbookId={playbook_id}
            fileId={fl_id}
            artifact_id={artifact_id}
            isCompanyDomainApi={isCompanyDomainApi}
            excludeMetadataTags={excludeMetadataTags}
        >
            {isInitiativeLanding ? (
                <DomainProvider>
                    <InitiativeLanding uuid={uuid} />
                </DomainProvider>
            ) : isIndex ? (
                <Index
                    uuid={uuid}
                    playbookId={playbook_id}
                    workproduct={workproduct}
                    domain={domain_details}
                    prevNext={prevNext}
                    isDomain={isDomain}
                    isAdrs={isAdrs}
                    isBvB={isBvB}
                    repo={repository}
                    isInitiativeConsumerApi={isInitiativeConsumerApi}
                />
            ) : (
                <>
                    {isBvB && playbook_id && (
                        <BvBWorkflow playbookId={playbook_id} />
                    )}

                    {showAdrHeader && repository && filePath && uuid && (
                        <ADRWorkflow
                            fileId={uuid}
                            playbookId={playbook_id}
                            repo={repository}
                            fileName={fileName}
                            filePlaybookTypeId={filePlaybookTypeId}
                        />
                    )}

                    <MarkdownPanel
                        md={markdown}
                        frontmatter={frontmatter}
                        sourceLink={sourceLink}
                        repository={repository}
                        filePath={filePath}
                        canEdit={canEdit}
                        sourceHost={source_host}
                    >
                        {isMdx ? (
                            <Mdx
                                md={md}
                                toc={toc}
                                filePath={filePath}
                                repository={repository}
                                sourceHost={source_host}
                            />
                        ) : (
                            <Markdown
                                md={md}
                                toc={toc}
                                filePath={filePath}
                                repository={repository}
                                sourceHost={source_host}
                            />
                        )}
                    </MarkdownPanel>
                </>
            )}
        </DocumentLayout>
    )
}
