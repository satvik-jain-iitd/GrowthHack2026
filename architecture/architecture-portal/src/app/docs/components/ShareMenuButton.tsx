/* istanbul ignore file */
'use client'
import React, { useState } from 'react'
import { NavLink } from '@/types/NavLink'
import { IconButton, Menu, Stack, Text, Box } from '@chakra-ui/react'
import {
    IconPdf,
    IconShare,
    IconCopy,
    IconCheck,
    IconEmail,
    IconDownload
} from '@americanexpress/dls-icons'
import { useDownloadPDF } from '@/app/docs/hooks'
import { LoadingDots } from '@/components/ui'
import { useDirectoryContext } from '@/context'
import { useGenerateApiMarkdown } from '@/app/company-domains/hooks'

type ShareMenuButtonProps = {
    link: NavLink
    uuid?: string
    download?: boolean
    isCompanyDomainApi?: boolean
}

export default function ShareMenuButton({
    uuid,
    link: { label },
    download,
    isCompanyDomainApi
}: ShareMenuButtonProps) {
    const { downloadPDF, isDownloading } = useDownloadPDF()
    const { apiData } = useDirectoryContext()
    const handleMarkdownDownload = async () => {
        generateApiMarkdown(apiData)
    }
    const [isCopied, setIsCopied] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { generateApiMarkdown, isLoading: isMarkdownLoading } =
        useGenerateApiMarkdown()

    const handleCopyLink = async () => {
        try {
            const link = window.location.href
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([`<a href="${link}">${label}</a>`], {
                        type: 'text/html'
                    }),
                    'text/plain': new Blob([link], { type: 'text/plain' })
                })
            ])
            setIsCopied(true)
            setTimeout(() => {
                setMenuOpen(false)
                setIsCopied(false)
            }, 3000)
        } catch (e) {
            console.error(e)
        }
    }

    const handleDownload = async () => {
        try {
            await downloadPDF(uuid!)
        } catch (error) {
            console.error(error)
            alert('Failed to download PDF.')
        }
    }

    const handleEmail = () => {
        const link = window.location.href
        const body = encodeURIComponent(
            `Architecture Portal - ${label}:\n${link}`
        )
        window.location.href = `mailto:?subject=${label}&body=${body}`
        setMenuOpen(false)
    }

    return (
        <Menu.Root
            open={menuOpen}
            onOpenChange={details => setMenuOpen(details.open)}
            closeOnSelect={false}
        >
            <Menu.Trigger asChild>
                <IconButton
                    size='sm'
                    borderRadius='50%'
                    colorPalette='blue'
                    variant='ghost'
                    bg={menuOpen ? 'bg.muted' : undefined}
                    _hover={{ bg: 'bg.muted' }}
                >
                    <IconShare size='sm' />
                </IconButton>
            </Menu.Trigger>
            <Menu.Positioner>
                <Menu.Content minW='220px'>
                    <Menu.Item
                        onClick={handleCopyLink}
                        value='copy-link'
                        cursor='pointer'
                    >
                        <Stack direction='row' gap={2} align='center'>
                            <Box
                                as={isCopied ? IconCheck : IconCopy}
                                boxSize={4}
                            />
                            <Text fontSize={14}>
                                {isCopied ? 'Link Copied!' : 'Copy Link'}
                            </Text>
                        </Stack>
                    </Menu.Item>
                    {!!download && (
                        <Menu.Item
                            onClick={handleDownload}
                            disabled={isDownloading}
                            value='download-pdf'
                            cursor='pointer'
                        >
                            <Stack direction='row' gap={2} align='center'>
                                <Box as={IconPdf} boxSize={4} />
                                <Text fontSize={14}>
                                    {isDownloading ? (
                                        <>
                                            Downloading PDF
                                            <LoadingDots />
                                        </>
                                    ) : (
                                        'Download PDF'
                                    )}
                                </Text>
                            </Stack>
                        </Menu.Item>
                    )}
                    <Menu.Item
                        onClick={handleEmail}
                        value='email'
                        cursor='pointer'
                    >
                        <Stack direction='row' gap={2} align='center'>
                            <Box as={IconEmail} boxSize={4} />
                            <Text fontSize={14}>Email</Text>
                        </Stack>
                    </Menu.Item>
                    {!!isCompanyDomainApi && (
                        <Menu.Item
                            onClick={handleMarkdownDownload}
                            disabled={isMarkdownLoading}
                            value='download-markdown'
                            cursor='pointer'
                        >
                            <Stack direction='row' gap={2} align='center'>
                                <Box as={IconDownload} boxSize={4} />
                                <Text fontSize={14}>
                                    {isMarkdownLoading ? (
                                        <>
                                            Downloading Markdown
                                            <LoadingDots />
                                        </>
                                    ) : (
                                        'Download Markdown'
                                    )}
                                </Text>
                            </Stack>
                        </Menu.Item>
                    )}
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
    )
}
