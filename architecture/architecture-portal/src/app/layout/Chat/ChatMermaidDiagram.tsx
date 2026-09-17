'use client'

import { JSX, useEffect, useId, useState } from 'react'
import {
    Box,
    Dialog,
    HStack,
    Button,
    IconButton,
    Portal
} from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import {
    TransformComponent,
    TransformWrapper,
    useControls
} from 'react-zoom-pan-pinch'
import {
    IconPlus,
    IconMinus,
    IconExpand,
    IconCollapse
} from '@americanexpress/dls-icons'
import styles from './Chat.module.scss'

type BindFunctions = (element: Element) => void

const Controls = ({
    expand,
    onToggleExpand
}: {
    expand: boolean
    onToggleExpand: () => void
}): JSX.Element => {
    const { zoomIn, zoomOut, resetTransform } = useControls()
    return (
        <HStack
            className={
                expand
                    ? styles.mermaidControls
                    : `${styles.mermaidControls} ${styles.mermaidControlsHoverOnly}`
            }
            justifyContent='right'
            onClick={e => e.stopPropagation()}
        >
            <IconButton
                variant='outline'
                bg={{ base: 'bg.subtle', _hover: 'bg.muted' }}
                boxShadow='md'
                size='xs'
                aria-label='Zoom in'
                title='Zoom in'
                onClick={() => zoomIn()}
            >
                <IconPlus />
            </IconButton>
            <IconButton
                variant='outline'
                bg={{ base: 'bg.subtle', _hover: 'bg.muted' }}
                boxShadow='md'
                size='xs'
                aria-label='Zoom out'
                title='Zoom out'
                onClick={() => zoomOut()}
            >
                <IconMinus />
            </IconButton>
            <Button
                variant='outline'
                size='xs'
                bg={{ base: 'bg.subtle', _hover: 'bg.muted' }}
                boxShadow='md'
                aria-label='Reset zoom'
                title='Reset zoom'
                onClick={() => resetTransform()}
            >
                reset
            </Button>
            <IconButton
                variant='outline'
                bg={{ base: 'bg.subtle', _hover: 'bg.muted' }}
                boxShadow='md'
                size='xs'
                aria-label={expand ? 'Minimize diagram' : 'Maximize diagram'}
                title={expand ? 'Minimize' : 'Maximize'}
                onClick={() => onToggleExpand()}
            >
                {expand ? <IconCollapse /> : <IconExpand />}
            </IconButton>
        </HStack>
    )
}

function DiagramSvg({
    svg,
    bindFunctions
}: {
    svg: string
    bindFunctions: BindFunctions | undefined
}): JSX.Element {
    return (
        <div
            ref={node => {
                if (node) bindFunctions?.(node)
            }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    )
}

export default function ChatMermaidDiagram({
    code
}: {
    code: string
}): JSX.Element {
    const { theme } = useTheme()
    const rawId = useId().replace(/:/g, '')
    const [svg, setSvg] = useState<string | null>(null)
    const [bindFunctions, setBindFunctions] = useState<
        BindFunctions | undefined
    >(undefined)
    const [renderFailed, setRenderFailed] = useState(false)
    const [expanded, setExpanded] = useState(false)

    useEffect(() => {
        let cancelled = false

        import('mermaid')
            .then(async ({ default: mermaid }) => {
                mermaid.initialize({
                    startOnLoad: false,
                    theme: theme === 'dark' ? 'dark' : 'base'
                })
                const result = await mermaid.render(`mermaid-${rawId}`, code)
                if (cancelled) return
                setSvg(result.svg)
                setBindFunctions(() => result.bindFunctions)
                setRenderFailed(false)
            })
            .catch(() => {
                if (cancelled) return
                setRenderFailed(true)
            })

        return () => {
            cancelled = true
        }
    }, [code, theme, rawId])

    if (renderFailed || !svg) {
        return <pre>{code}</pre>
    }

    return (
        <>
            <Box
                className={styles.mermaidWrapper}
                position='relative'
                onClick={() => setExpanded(true)}
            >
                <TransformWrapper
                    wheel={{ disabled: true }}
                    pinch={{ disabled: true }}
                    panning={{ disabled: true }}
                    doubleClick={{ disabled: true }}
                >
                    <Controls
                        expand={false}
                        onToggleExpand={() => setExpanded(true)}
                    />
                    <TransformComponent>
                        <DiagramSvg svg={svg} bindFunctions={bindFunctions} />
                    </TransformComponent>
                </TransformWrapper>
            </Box>

            <Dialog.Root
                open={expanded}
                lazyMount
                unmountOnExit
                onOpenChange={e => setExpanded(e.open)}
            >
                <Portal>
                    <Dialog.Backdrop zIndex={10010} />
                    <Dialog.Positioner zIndex={10010}>
                        <Dialog.Content
                            w='92vw'
                            h='88vh'
                            maxW='92vw'
                            maxH='88vh'
                            display='flex'
                            flexDirection='column'
                            padding='1rem'
                        >
                            <TransformWrapper
                                wheel={{ disabled: false }}
                                pinch={{ disabled: false }}
                                panning={{ disabled: false }}
                            >
                                <Controls
                                    expand
                                    onToggleExpand={() => setExpanded(false)}
                                />
                                <TransformComponent
                                    wrapperStyle={{
                                        width: '100%',
                                        height: '100%',
                                        flex: 1
                                    }}
                                >
                                    <DiagramSvg
                                        svg={svg}
                                        bindFunctions={bindFunctions}
                                    />
                                </TransformComponent>
                            </TransformWrapper>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    )
}
