/* istanbul ignore file */

import React from 'react'
import { Box } from '@chakra-ui/react'
import { DomainSection, ApiSection, OperationSection } from './centercontent/'
import { Domains, domainsLeftNav } from '@/app/api-docs/types/apiDocs'

export default function CenterContent({
    domains,
    sidebarData
}: {
    domains: Domains
    sidebarData: { [key: string]: domainsLeftNav }
}) {
    return (
        <Box height={'100%'} width='100%' maxW={'110rem'} id='centerContent'>
            {Object.keys(sidebarData).map(domainId => {
                const domainGroup = sidebarData[domainId]
                const apisGroup = domainGroup.apis
                return (
                    <React.Fragment key={domainId}>
                        <DomainSection
                            key={domainId}
                            domainId={domainId}
                            data={domains}
                            domainGroup={domainGroup}
                        />
                        {Object.keys(apisGroup).map(apiId => {
                            const api = apisGroup[apiId]
                            const operations = api.operations
                            return (
                                <React.Fragment key={apiId}>
                                    <ApiSection
                                        key={apiId}
                                        apiId={apiId}
                                        api={api}
                                        parentId={domainId}
                                    />
                                    {Object.keys(operations).map(
                                        operationId => {
                                            const operation =
                                                operations[operationId]
                                            return (
                                                <OperationSection
                                                    key={operationId}
                                                    operationId={operationId}
                                                    operation={operation}
                                                    apiId={apiId}
                                                />
                                            )
                                        }
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </React.Fragment>
                )
            })}
        </Box>
    )
}
