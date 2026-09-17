/* istanbul ignore file */

import React, { useEffect, useRef } from 'react'
import { ContentSection } from './ContentSection'
import { OperationSectionMidContent } from './operationcontent/OperationSectionMidContent'
import { operationsLeftNav } from '@/app/api-docs/types/apiDocs'
import { getOperationComponents } from '@/app/api-docs/utils/parseSpecFile'
import { OperationRightSectionContent } from './operationcontent/OperationRightSectionContent'
import { Skeleton, Box } from '@chakra-ui/react'
import { useGetOperationData } from '@/app/api-docs/components/hooks/useGetOperationData'
import { useHash } from '@/app/api-docs/components/hooks/useHash'
import { useInView } from 'react-intersection-observer'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { OpenAPIV3 } from 'openapi-types'
import { NAVBAR_HEIGHT } from '@/constants/layout'

const SkeletonComponent = () => (
    <Skeleton height='200px' width='100%' borderRadius='lg' />
)

// Container wrapper to prevent layout shift when content loads
const SectionWrapper = ({
    children,
    id
}: {
    children: React.ReactNode
    id: string
}) => (
    <Box
        id={id}
        width='100%'
        minH='400px'
        scrollMarginTop={`calc(${NAVBAR_HEIGHT} + 1rem)`}
        style={
            {
                contentVisibility: 'auto',
                containIntrinsicSize: 'auto 400px'
            } as React.CSSProperties & { containIntrinsicSize?: string }
        }
    >
        {children}
    </Box>
)

export function OperationSection({
    operationId,
    operation,
    apiId
}: {
    operationId: string
    operation: operationsLeftNav
    apiId: string
}) {
    const title = operation.name
    const method =
        operation.method?.toLowerCase() as keyof OpenAPIV3.PathItemObject
    const ref = useRef<HTMLDivElement>(null)
    const { ref: inViewRef, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3
    })
    // Combine refs
    const setRefs = (node: HTMLDivElement) => {
        ref.current = node
        inViewRef(node)
    }

    // Reactive so a jump into an unloaded section starts fetching immediately
    // instead of waiting for the intersection observer.
    const currentHash = useHash()
    const isTargetSection = currentHash === operationId
    const reassertedFor = useRef<string | null>(null)

    const {
        data: operationData,
        loading: schemaLoading,
        isEnabled
    } = useGetOperationData(
        inView || isTargetSection ? apiId : '',
        inView || isTargetSection ? operationId : '',
        inView || isTargetSection
    )

    // The skeleton is 400px and the real content is several times that, so the
    // first scroll lands short. Re-assert once the content actually commits.
    useEffect(() => {
        if (!isTargetSection) return
        if (!operationData?.data?.schema) return
        if (reassertedFor.current === operationId) return
        reassertedFor.current = operationId
        document
            .getElementById(operationId)
            ?.scrollIntoView({ block: 'start', behavior: 'instant' })
    }, [isTargetSection, operationData, operationId])

    if (schemaLoading || !isEnabled) {
        return (
            <Box ref={setRefs}>
                <SectionWrapper id={operationId}>
                    <ContentSection
                        id={operationId}
                        midSection={<SkeletonComponent />}
                        rightSection={<SkeletonComponent />}
                    />
                </SectionWrapper>
            </Box>
        )
    }
    if (isEnabled && !schemaLoading && !operationData?.data?.schema) {
        return (
            <Box ref={setRefs}>
                <SectionWrapper id={operationId}>
                    <ContentSection
                        id={operationId}
                        midSection={
                            <Box p={4} bg='red.100' borderRadius='md'>
                                <Box fontWeight='bold' mb={2}>
                                    Error
                                </Box>
                                <Box>Unable to load operation details.</Box>
                            </Box>
                        }
                        rightSection={<SkeletonComponent />}
                    />
                </SectionWrapper>
            </Box>
        )
    }
    if (isEnabled && !schemaLoading && operationData?.data?.schema) {
        const operationComponents = getOperationComponents(
            operationData?.data?.schema,
            method
        )
        return (
            <Box ref={setRefs}>
                <SectionWrapper id={operationId}>
                    <ErrorBoundary>
                        <ContentSection
                            id={operationId}
                            midSection={
                                <OperationSectionMidContent
                                    id={operationId}
                                    title={title}
                                    operationComponents={operationComponents}
                                    loading={schemaLoading}
                                    metadata={operationData.data}
                                    status={operation.status}
                                />
                            }
                            rightSection={
                                <OperationRightSectionContent
                                    requestBody={
                                        operationComponents?.requestBody
                                    }
                                    responses={operationComponents?.responses}
                                    loading={schemaLoading}
                                />
                            }
                        />
                    </ErrorBoundary>
                </SectionWrapper>
            </Box>
        )
    }
}
