/* istanbul ignore file */
'use client'

import { useState, useRef, ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import Sidebar from '@/app/docs/components/Sidebar'
import PrevNext from '@/app/docs/components/PrevNext'
import Breadcrumbs from '@/app/docs/components/Breadcrumbs'
import TableOfContents from '@/app/docs/components/TableOfContents'
import ShareMenuButton from '@/app/docs/components/ShareMenuButton'
import ContributorsList from '@/app/docs/components/ContributorsList'
import { ConditionalWrapper } from '@/components/ui'
import {
    DocumentProvider,
    TocProvider,
    SidebarContext,
    useSidebarOpen,
    NavbarTypeSetter,
    useDocumentContext
} from '@/context'
import { SidebarItem } from '@/types/SidebarItem'
import { Box, Button, Stack, VStack } from '@chakra-ui/react'
import { PrevNext as PrevNextProps } from '@/types/PrevNext'
import { NavLink } from '@/types/NavLink'
import MetadataTags from '@/app/docs/components/MetadataTags'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import '@/app/docs/styles/markdown.css'
import CJPrevNext from '@/app/enterprise-customer-journeys/components/CJPrevNext'

const SIDEBAR_WIDTH = 340
const SIDEBAR_COLLAPSED_WIDTH = 60

function DocumentContent({
    uuid,
    tableOfContents,
    breadcrumbs,
    download,
    prevNext,
    playbookId,
    fileId,
    children,
    isCustomerJourney,
    filePath,
    repo,
    artifact_id,
    isCompanyDomainApi,
    excludeMetadataTags
}: Readonly<{
    uuid?: string
    tableOfContents?: {
        level: number
        text: string
        anchor: string
    }[]
    breadcrumbs?: NavLink[]
    download?: boolean
    prevNext?: PrevNextProps
    playbookId: string | undefined
    fileId: string | undefined
    children: ReactNode
    isCustomerJourney?: boolean
    filePath?: string
    repo?: string
    artifact_id?: string
    isCompanyDomainApi?: boolean
    excludeMetadataTags?: boolean
}>) {
    const { fullWidth, maxWidth } = useDocumentContext()
    const { sidebarOpen } = useSidebarOpen()
    const [showMetadata, setShowMetadata] = useState<boolean>(false)

    const metadataRef = useRef<HTMLDivElement>(null)
    const handleJumpToMetadata = () => {
        if (metadataRef.current) {
            metadataRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }
    return (
        <Box as='main' flexGrow={1} p={5} pr={isCustomerJourney ? 0 : 5}>
            <Box className='page-content'>
                <Box display='flex' justifyContent='center' width='100%'>
                    {isCustomerJourney ? (
                        <VStack alignItems='flex-start'>
                            {breadcrumbs && (
                                <Box marginLeft={2}>
                                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                                </Box>
                            )}
                            <Box
                                mt={3}
                                width={
                                    isCustomerJourney
                                        ? sidebarOpen
                                            ? '77.3vw'
                                            : '93.5vw'
                                        : 'undefined'
                                }
                            >
                                {children}
                            </Box>
                            <Box alignSelf='center' width='55vw'>
                                {prevNext && <CJPrevNext prevNext={prevNext} />}
                            </Box>
                        </VStack>
                    ) : (
                        <Stack
                            flexBasis={{
                                base: '100%',
                                md: fullWidth ? '100%' : '80%'
                            }}
                            width={{
                                base: '100%',
                                md: fullWidth ? '100%' : '80%'
                            }}
                            maxW={maxWidth}
                        >
                            <Box>
                                {breadcrumbs && (
                                    <Box
                                        display='flex'
                                        alignItems='flex-start'
                                        justifyContent='space-between'
                                        mt={2}
                                    >
                                        <Breadcrumbs
                                            breadcrumbs={breadcrumbs}
                                        />
                                        <Box
                                            display='flex'
                                            alignItems='center'
                                            gap={2}
                                        >
                                            {repo && filePath && (
                                                <ContributorsList
                                                    repo={repo}
                                                    filePath={filePath}
                                                />
                                            )}
                                            <ShareMenuButton
                                                uuid={uuid}
                                                download={download}
                                                link={
                                                    breadcrumbs[
                                                        breadcrumbs.length - 1
                                                    ]
                                                }
                                                isCompanyDomainApi={
                                                    isCompanyDomainApi
                                                }
                                            />
                                        </Box>
                                    </Box>
                                )}
                                {showMetadata && (
                                    <Box
                                        mb={3}
                                        display='flex'
                                        justifyContent='flex-end'
                                    >
                                        <Button
                                            onClick={handleJumpToMetadata}
                                            size='sm'
                                            variant='outline'
                                            colorPalette='blue'
                                        >
                                            Jump to Metadata
                                        </Button>
                                    </Box>
                                )}
                                <Box mt={3}>{children}</Box>
                                {excludeMetadataTags ? null : (
                                    <Box ref={metadataRef} scrollMarginTop={96}>
                                        <MetadataTags
                                            playbookId={playbookId}
                                            fileId={fileId}
                                            artifact_id={artifact_id}
                                            setShowMetadata={setShowMetadata}
                                        />
                                    </Box>
                                )}
                            </Box>
                            {prevNext && <PrevNext prevNext={prevNext} />}
                        </Stack>
                    )}

                    <Box
                        flexBasis={{ base: '0%', md: '20%' }}
                        width={{ base: '0%', md: '20%' }}
                        minW={{ base: 0, md: 0 }}
                        display={{
                            base: 'none',
                            md: fullWidth ? 'none' : 'block'
                        }}
                        ml={{ base: 0, md: 6 }}
                    >
                        {!isCustomerJourney && tableOfContents && (
                            <TableOfContents toc={tableOfContents} />
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default function DocumentLayout({
    uuid,
    slug,
    label,
    sidebar,
    tableOfContents,
    breadcrumbs,
    prevNext,
    download,
    fullWidth,
    maxWidth,
    playbookId,
    fileId,
    children,
    isCustomerJourney,
    filePath,
    repo,
    artifact_id,
    isCompanyDomainApi,
    excludeMetadataTags
}: Readonly<{
    uuid?: string
    slug?: string
    label: string
    sidebar: SidebarItem[]
    tableOfContents?: {
        level: number
        text: string
        anchor: string
    }[]
    breadcrumbs?: NavLink[]
    prevNext?: PrevNextProps
    download?: boolean
    fullWidth?: boolean
    maxWidth?: number | string
    playbookId?: string | undefined
    fileId?: string | undefined
    children: ReactNode
    isCustomerJourney?: boolean
    filePath?: string
    repo?: string
    artifact_id?: string
    isCompanyDomainApi?: boolean
    excludeMetadataTags?: boolean
}>) {
    return (
        <SessionProvider>
            <NavbarTypeSetter slug={slug} label={label} />
            <DocumentProvider
                initialFullWidth={fullWidth}
                initialMaxWidth={maxWidth}
            >
                <SidebarContext.Provider value={{ sidebar }}>
                    <ConditionalWrapper
                        condition={!!tableOfContents}
                        wrapper={children => (
                            <TocProvider toc={tableOfContents!}>
                                {children}
                            </TocProvider>
                        )}
                    >
                        <DocumentLayoutContent
                            uuid={uuid}
                            tableOfContents={tableOfContents}
                            breadcrumbs={breadcrumbs}
                            download={download}
                            prevNext={prevNext}
                            isCustomerJourney={isCustomerJourney}
                            filePath={filePath}
                            repo={repo}
                            playbookId={playbookId}
                            fileId={fileId}
                            artifact_id={artifact_id}
                            isCompanyDomainApi={isCompanyDomainApi}
                            excludeMetadataTags={excludeMetadataTags}
                        >
                            {children}
                        </DocumentLayoutContent>
                    </ConditionalWrapper>
                </SidebarContext.Provider>
            </DocumentProvider>
        </SessionProvider>
    )
}

function DocumentLayoutContent({
    uuid,
    tableOfContents,
    breadcrumbs,
    download,
    prevNext,
    children,
    isCustomerJourney,
    filePath,
    repo,
    playbookId,
    fileId,
    artifact_id,
    isCompanyDomainApi,
    excludeMetadataTags
}: Readonly<{
    uuid?: string
    tableOfContents?: {
        level: number
        text: string
        anchor: string
    }[]
    breadcrumbs?: NavLink[]
    download?: boolean
    prevNext?: PrevNextProps
    children: ReactNode
    isCustomerJourney?: boolean
    filePath?: string
    repo?: string
    playbookId?: string
    fileId?: string
    artifact_id?: string
    isCompanyDomainApi?: boolean
    excludeMetadataTags?: boolean
}>) {
    const { sidebarOpen, toggleSidebar } = useSidebarOpen()

    return (
        <Box display='flex' alignItems='flex-start'>
            <Sidebar
                open={sidebarOpen}
                width={SIDEBAR_WIDTH}
                collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
                toggleDrawer={toggleSidebar}
            />
            <DocumentContent
                uuid={uuid}
                tableOfContents={tableOfContents}
                breadcrumbs={breadcrumbs}
                download={download}
                prevNext={prevNext}
                isCustomerJourney={isCustomerJourney}
                filePath={filePath}
                repo={repo}
                playbookId={playbookId}
                fileId={fileId}
                artifact_id={artifact_id}
                isCompanyDomainApi={isCompanyDomainApi}
                excludeMetadataTags={excludeMetadataTags}
            >
                {children}
            </DocumentContent>
        </Box>
    )
}
