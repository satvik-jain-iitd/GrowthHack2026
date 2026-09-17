/* istanbul ignore file */
'use client'
import React, { useCallback } from 'react'
import Markdown from './Markdown'
import MDEditor, { commands } from '@uiw/react-md-editor'

type MarkdownEditorProps = {
    value?: string
    onChange?: (value?: string) => void
    filePath?: string
    repository?: string
    colorMode?: 'light' | 'dark' | undefined
    height?: string | number
}

export default function MarkdownEditor({
    value,
    onChange,
    filePath,
    repository,
    colorMode,
    height = '80vh'
}: MarkdownEditorProps) {
    const preview = useCallback(
        (source: string) => (
            <div className='markdown-body'>
                <Markdown
                    preview
                    md={source}
                    filePath={filePath}
                    repository={repository}
                />
            </div>
        ),
        [filePath, repository]
    )

    return (
        <MDEditor
            height={height}
            value={value}
            onChange={onChange}
            data-color-mode={colorMode}
            extraCommands={[commands.codeLive, commands.fullscreen]}
            components={{
                preview
            }}
        />
    )
}
