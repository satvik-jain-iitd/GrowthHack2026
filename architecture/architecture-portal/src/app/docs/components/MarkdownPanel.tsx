/* istanbul ignore file */
'use client'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import Dialog from '@/app/docs/components/Dialog'
import { useDocumentContext } from '@/context'
import { LoadingSpinner } from '@/components/ui'
import { IconEdit, IconSource } from '@americanexpress/dls-icons'
import { useMermaid } from '@/hooks'
import { signIn, useSession } from 'next-auth/react'
import { Box, Button, Link } from '@chakra-ui/react'
import {
    DEFAULT_DOCUMENT_WIDTH,
    DOCUMENT_MAX_WIDTH,
    SOURCE_HOST_CONFIG,
    SourceHost
} from '@/constants'
import yaml from 'js-yaml'
import { fetchWithToken } from '@/utils/client'

const MarkdownEditor = dynamic(() => import('./MarkdownEditor'), { ssr: false })

type ColorMode = 'light' | 'dark' | undefined

type Props = {
    md?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    frontmatter?: Record<string, any>
    sourceLink?: string
    repository?: string
    filePath?: string
    canEdit?: boolean
    children?: React.ReactNode
    sourceHost?: SourceHost
}

function createMarkdown({
    frontmatter,
    mdContent
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    frontmatter?: Record<string, any>
    mdContent?: string
}) {
    if (frontmatter !== undefined && Object.keys(frontmatter).length > 0) {
        return `---\n${yaml.dump(frontmatter)}---\n` + mdContent
    }
    return mdContent
}

export default function MarkdownPanel({
    md,
    frontmatter,
    sourceLink,
    repository,
    filePath,
    canEdit,
    children,
    sourceHost = 'ghe'
}: Props) {
    const { theme } = useTheme()
    const { data: session } = useSession()
    const storageKey = `markdownPanel:amex-eng/${repository}/contents/${filePath}`
    const editorColorMode =
        theme === 'system' ? undefined : (theme as ColorMode)
    const [saving, setSaving] = useState(false)
    const [mdContent, setMdContent] = useState<string | undefined>(md || '')
    const [tab, setTab] = useState<'write' | 'preview'>('preview')
    const [action, setAction] = useState<'save' | 'cancel' | undefined>(
        undefined
    )
    const [prUrl, setPrUrl] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | undefined>(undefined)
    const { setLayout } = useDocumentContext()

    useMermaid()

    const handleWrite = () => {
        const providerId = SOURCE_HOST_CONFIG[sourceHost].providerId
        if (!session) {
            signIn(providerId)
            return
        }

        // Check if user has a token for the required host
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tokens = (session as any)?.tokens || {}
        if (!tokens[providerId]) {
            // User is authenticated but not with the required provider
            signIn(providerId)
            return
        }

        const saved = sessionStorage.getItem(storageKey)
        if (saved !== null) setMdContent(saved)
        setTab('write')
        setLayout({ fullWidth: true, maxWidth: DOCUMENT_MAX_WIDTH })
    }

    const handleCancel = () => {
        setMdContent(md || '')
        setTab('preview')
        setLayout({ fullWidth: false, maxWidth: DEFAULT_DOCUMENT_WIDTH })
        setAction(undefined)
        sessionStorage.removeItem(storageKey)
    }

    const handleSave = async () => {
        setAction(undefined)
        setSaving(true)
        try {
            const res = await fetchWithToken(
                `/api/v3/repos/amex-eng/${repository}/contents/${filePath}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: createMarkdown({ frontmatter, mdContent }),
                        host: sourceHost
                    })
                }
            )

            const data = await res.json()
            if (!res.ok) {
                setError(data?.error || 'Failed to create pull request.')
                return
            }

            if (data?.pr?.html_url) {
                setPrUrl(data.pr.html_url)
                setMdContent(md || '')
                setTab('preview')
                setLayout({
                    fullWidth: false,
                    maxWidth: DEFAULT_DOCUMENT_WIDTH
                })
                sessionStorage.removeItem(storageKey)
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || 'Failed to create pull request.')
            } else {
                setError('Failed to create pull request.')
            }
        } finally {
            setSaving(false)
        }
    }

    const onChange = (value: string | undefined) => {
        setMdContent(value)
        sessionStorage.setItem(storageKey, value ?? '')
    }

    return (
        <>
            {tab === 'write' ? (
                <MarkdownEditor
                    value={mdContent}
                    onChange={onChange}
                    filePath={filePath}
                    repository={repository}
                    colorMode={editorColorMode}
                    height='80vh'
                />
            ) : (
                <div className='markdown-body'>{children}</div>
            )}
            <Box
                mt={6}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
            >
                {sourceLink && (
                    <Button
                        asChild
                        colorPalette='blue'
                        variant='ghost'
                        _hover={{ bg: 'bg.muted', textDecoration: 'none' }}
                        _focus={{
                            outline: 'none',
                            boxShadow: 'none'
                        }}
                    >
                        {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                        <Link
                            href={sourceLink}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <IconSource color='information' /> View Source
                        </Link>
                    </Button>
                )}
                {canEdit && (
                    <Box>
                        {tab === 'preview' && (
                            <Button
                                colorPalette='blue'
                                variant='ghost'
                                disabled={saving}
                                onClick={handleWrite}
                                _hover={{
                                    bg: 'bg.muted',
                                    textDecoration: 'none'
                                }}
                                _focus={{
                                    outline: 'none',
                                    boxShadow: 'none'
                                }}
                            >
                                <IconEdit color='information' /> Edit Page
                            </Button>
                        )}
                        {tab === 'write' && (
                            <>
                                <Button
                                    size='sm'
                                    height='7'
                                    variant='solid'
                                    colorPalette='blue'
                                    onClick={() => setAction('save')}
                                    disabled={saving}
                                    fontSize={11}
                                    mr={1}
                                >
                                    SAVE
                                </Button>
                                <Button
                                    size='sm'
                                    height='7'
                                    variant='outline'
                                    colorPalette='blue'
                                    onClick={() => setAction('cancel')}
                                    _hover={{ bg: 'bg.muted' }}
                                    disabled={saving}
                                    fontSize={11}
                                >
                                    CANCEL
                                </Button>
                            </>
                        )}
                    </Box>
                )}
            </Box>
            {action && (
                <Dialog
                    title={
                        action === 'save'
                            ? 'Propose Changes?'
                            : 'Discard Changes?'
                    }
                    content={
                        action === 'save'
                            ? 'Are you sure you want to propose your changes? This will create a pull request on the remote repository.'
                            : 'Are you sure you want to discard your changes? Your progress will be lost.'
                    }
                    onConfirm={action === 'save' ? handleSave : handleCancel}
                    onClose={() => setAction(undefined)}
                />
            )}
            {prUrl && (
                <Dialog
                    title='Success!'
                    content={
                        <>
                            Your changes have been proposed. Here is the{' '}
                            {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                            <Link
                                href={prUrl}
                                variant='underline'
                                colorPalette='blue'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                link to the pull request
                            </Link>
                            . Once it has been reviewed and merged, your changes
                            will be live.
                        </>
                    }
                    onClose={() => setPrUrl(undefined)}
                />
            )}
            {error && (
                <Dialog
                    title='An error occurred when attempting to propose changes...'
                    content={error}
                    onClose={() => setError(undefined)}
                />
            )}
            {saving && <LoadingSpinner />}
        </>
    )
}
