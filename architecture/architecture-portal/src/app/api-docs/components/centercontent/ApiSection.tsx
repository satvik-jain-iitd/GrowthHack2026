/* istanbul ignore file */

import React from 'react'
import { apisLeftNav } from '@/app/api-docs/types/apiDocs'
import { ContentSection } from './ContentSection'
import { MidSectionContent } from './MidSectionContent'
import { ApiOperationList } from './ApiOperationsList'

function ApiSection({
    apiId,
    api,
    parentId
}: {
    apiId: string
    api: apisLeftNav
    parentId: string
}) {
    return (
        <ContentSection
            id={apiId}
            midSection={
                <MidSectionContent
                    title={api.name}
                    description={api.description}
                    metrics={[]}
                    id={apiId}
                    api={api}
                    parentId={parentId}
                />
            }
            rightSection={<ApiOperationList operations={api.operations} />}
        />
    )
}
export { ApiSection }
