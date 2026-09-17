/* istanbul ignore file */

import React, { useState } from 'react'
import JsonView from '@uiw/react-json-view'
import { vscodeTheme } from '@uiw/react-json-view/vscode'
import { Button, HStack, Box, VStack } from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import Code from '@/app/api-docs/components/centercontent/CodeText'

export function JsonViewer({ value }: { value: object }) {
    const [collapsed, setCollapsed] = useState<number | false>(2)
    const [copied, setCopied] = useState(false)
    const { theme } = useTheme()

    const isDarkMode = theme === 'dark'
    const jsonString = JSON.stringify(value, null, 2)

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonString)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }
    const handleExpand = () => {
        setCollapsed(prev => (prev === false ? 1 : false))
    }
    return (
        <>
            <VStack
                gap={1}
                align='stretch'
                py={4}
                px={8}
                height={'100%'}
                width='100%'
            >
                <HStack mb={2} ml='auto'>
                    <Button
                        size='xs'
                        onClick={handleExpand}
                        variant='subtle'
                        bg='#ECEDEE'
                        _dark={{
                            bg: '#262626'
                        }}
                    >
                        {collapsed ? 'Expand All' : 'Collapse All'}
                    </Button>
                    <Button
                        size='xs'
                        onClick={handleCopy}
                        variant='subtle'
                        bg='#ECEDEE'
                        _dark={{
                            bg: '#262626'
                        }}
                    >
                        {copied ? 'Copied!' : 'Copy JSON'}
                    </Button>
                </HStack>
                <Box
                    overflow='auto'
                    maxHeight={'calc(100% - 110px)'}
                    minHeight={'200px'}
                    width='100%'
                >
                    <Code isSample>
                        <JsonView
                            value={value}
                            collapsed={collapsed}
                            enableClipboard={true}
                            displayDataTypes={false}
                            displayObjectSize={true}
                            shortenTextAfterLength={50}
                            stringEllipsis={100}
                            style={{
                                width: '100%',
                                ...(isDarkMode ? vscodeTheme : {})
                            }}
                        />
                    </Code>
                </Box>
            </VStack>
        </>
    )
}
