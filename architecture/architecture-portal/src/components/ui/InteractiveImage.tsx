/* istanbul ignore file */
'use client'
import { HStack, Button, Box, IconButton } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
    TransformComponent,
    TransformWrapper,
    useControls
} from 'react-zoom-pan-pinch'
import {
    IconPlus,
    IconMinus,
    IconExpand,
    IconCollapse,
    IconDownload
} from '@americanexpress/dls-icons'
import { ConditionalWrapper } from './ConditionalWrapper'
import {
    getFileName,
    isDownloadablePath,
    rewriteImageSrc
} from '@/app/docs/utils/client'
import { fetchWithToken } from '@/utils/client'
import { DEFAULT_DOCUMENT_WIDTH, SourceHost } from '@/constants'

const Controls = ({
    expand,
    onExpand
}: {
    expand: boolean
    onExpand: () => void
}) => {
    const { zoomIn, zoomOut, resetTransform } = useControls()
    return (
        <HStack marginBottom={2} justifyContent='right'>
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
                aria-label={expand ? 'Collapse' : 'Expand'}
                title={expand ? 'Collapse' : 'Expand'}
                onClick={() => onExpand()}
            >
                {expand ? <IconCollapse /> : <IconExpand />}
            </IconButton>
        </HStack>
    )
}

const HoverOverlayBox = ({
    controls,
    children
}: {
    controls: React.ReactNode
    children: React.ReactNode
}) => {
    const [hovered, setHovered] = React.useState(false)
    return (
        <Box
            position='relative'
            maxWidth={DEFAULT_DOCUMENT_WIDTH}
            height='auto'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Box
                position='absolute'
                top={2}
                right={2}
                zIndex={2}
                opacity={hovered ? 1 : 0}
                pointerEvents={hovered ? 'auto' : 'none'}
                transition='opacity 0.2s'
            >
                {controls}
            </Box>
            {children}
        </Box>
    )
}

const Svg = React.memo(function Svg({
    src,
    alt,
    expand,
    priority = false
}: {
    src: string
    alt: string
    expand: boolean
    priority?: boolean
}) {
    const [svgMarkup, setSvgMarkup] = React.useState<string | null>(null)
    const [shouldLoadSvg, setShouldLoadSvg] = React.useState(priority)
    const svgRef = React.useRef<HTMLDivElement>(null)

    // Lazy load SVGs using Intersection Observer
    React.useEffect(() => {
        if (priority) return
        const observerRef = svgRef.current
        if (shouldLoadSvg || !observerRef) return
        const observer = new window.IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    setShouldLoadSvg(true)
                }
            },
            { rootMargin: '200px' }
        )
        observer.observe(observerRef)
        return () => observer.disconnect()
    }, [shouldLoadSvg, priority])

    // Fetch SVG markup when shouldLoadSvg is true
    React.useEffect(() => {
        if (!shouldLoadSvg) return
        setSvgMarkup(null)
        fetchWithToken(src)
            .then(res => res.text())
            .then(text => {
                setSvgMarkup(text)
            })
            .catch(() => setSvgMarkup(null))
    }, [src, shouldLoadSvg])

    const width = expand ? '90vw' : '100%'
    const height = expand ? '80vh' : 'auto'
    const placeholderHeight = expand ? '80vh' : 675
    const style = expand
        ? { maxWidth: '90vw', maxHeight: '80vh' }
        : { maxWidth: '100%' }

    if (!svgMarkup) {
        return (
            <div
                ref={svgRef}
                style={{
                    ...style,
                    width,
                    height: placeholderHeight,
                    display: 'block',
                    overflow: 'hidden',
                    background: 'transparent'
                }}
                aria-label={alt}
            />
        )
    }

    const svgSizingStyle = expand
        ? 'width:auto;height:auto;max-width:90vw;max-height:80vh;'
        : 'width:auto;height:auto;max-width:100%;'

    const svgWithSizing = svgMarkup.replace(
        /<svg([^>]*)>/i,
        (_match: string, attrs: string) => {
            let newAttrs = attrs
            // Ensure viewBox exists
            if (!/viewBox=/.test(newAttrs)) {
                const widthMatch = attrs.match(/width=["']?(\d+)(px)?["']?/i)
                const heightMatch = attrs.match(/height=["']?(\d+)(px)?["']?/i)
                if (widthMatch && heightMatch) {
                    newAttrs += ` viewBox="0 0 ${widthMatch[1]} ${heightMatch[1]}"`
                }
            }
            // Keep intrinsic SVG size while constraining overflow.
            if (/style=/.test(newAttrs)) {
                newAttrs = newAttrs.replace(
                    /style=["']([^"']*)["']/i,
                    (_m: string, s: string) => `style="${s};${svgSizingStyle}"`
                )
            } else {
                newAttrs += ` style="${svgSizingStyle}"`
            }
            return `<svg${newAttrs}>`
        }
    )

    const svgWithInlineFontSize = svgWithSizing.replace(
        /<([a-zA-Z][\w:-]*)([^>]*)>/gi,
        (tag: string, tagName: string, attrs: string) => {
            const fontSize = attrs.match(/\sfont-size=["']([^"']+)["']/i)?.[1]
            if (!fontSize) return tag
            const cleanedAttrs = attrs.replace(
                /\sfont-size=["'][^"']+["']/i,
                ''
            )
            if (!/style=["']/.test(cleanedAttrs)) {
                return `<${tagName}${cleanedAttrs} style="font-size:${fontSize}">`
            }
            return `<${tagName}${cleanedAttrs.replace(
                /style=["']([^"']*)["']/i,
                (_m: string, styleValue: string) =>
                    `style="${styleValue};font-size:${fontSize}"`
            )}>`
        }
    )

    return (
        <div
            ref={svgRef}
            style={{
                ...style,
                width,
                height,
                display: 'block',
                overflow: 'hidden'
            }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: svgWithInlineFontSize }}
            aria-label={alt}
        />
    )
})

const Image = ({
    src,
    alt,
    expand,
    priority = false
}: {
    src: string
    alt: string
    expand: boolean
    priority?: boolean
}) => {
    const [shouldLoadImg, setShouldLoadImg] = React.useState(priority)
    const imgRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (priority) return
        let observer: IntersectionObserver | undefined
        if (!shouldLoadImg && imgRef.current) {
            observer = new window.IntersectionObserver(
                entries => {
                    if (entries[0].isIntersecting) {
                        setShouldLoadImg(true)
                    }
                },
                { rootMargin: '200px' }
            )
            observer.observe(imgRef.current)
        }
        return () => observer && observer.disconnect()
    }, [shouldLoadImg, priority])

    return (
        <div ref={imgRef}>
            {shouldLoadImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={alt}
                    loading='lazy'
                    height={expand ? undefined : 675}
                    style={
                        expand
                            ? {
                                  maxWidth: '90vw',
                                  maxHeight: '80vh'
                              }
                            : {
                                  maxWidth: '100%',
                                  height: 'auto',
                                  padding: '0px 0px 16px 0px'
                              }
                    }
                />
            ) : (
                <div
                    style={{
                        maxWidth: expand ? '90vw' : '100%',
                        height: expand ? '80vh' : 675
                    }}
                />
            )}
        </div>
    )
}

export const InteractiveImage = ({
    src,
    alt,
    repository,
    filePath,
    priority = false,
    preview = false,
    static: isStatic = false,
    sourceHost = 'ghe'
}: {
    src: string
    alt: string
    repository?: string
    filePath?: string
    priority?: boolean
    preview?: boolean
    static?: boolean
    sourceHost?: SourceHost
}) => {
    const imgSrc = isStatic
        ? src
        : rewriteImageSrc(src, repository, filePath, sourceHost)
    const [expand, setExpand] = useState(false)
    // Detect SVG by extension
    const isSvg = imgSrc.trim().toLowerCase().endsWith('.svg')

    const onExpand = () => {
        setExpand(!expand)
    }

    // Authors often use image syntax for spreadsheets and other attachments;
    // mirror GitHub and render a download link rather than a broken image.
    if (isDownloadablePath(src)) {
        const fileName = getFileName(src)
        return (
            // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
            <a
                href={imgSrc}
                download={fileName}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                }}
            >
                <IconDownload size='sm' />
                {alt || fileName}
            </a>
        )
    }

    if (preview) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={imgSrc}
                alt={alt}
                loading='lazy'
                height={675}
                style={{
                    width: DEFAULT_DOCUMENT_WIDTH,
                    maxWidth: '100%',
                    height: 'auto'
                }}
            />
        )
    }

    return (
        <ConditionalWrapper
            condition={expand}
            wrapper={children => (
                <Box
                    position='fixed'
                    top={0}
                    left={0}
                    width='100vw'
                    height='100vh'
                    zIndex={9999}
                    background='rgba(0,0,0,0.7)'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    onClick={onExpand}
                >
                    <Box
                        bg='bg.panel'
                        borderRadius='md'
                        boxShadow='lg'
                        p={4}
                        maxW='95vw'
                        maxH='95vh'
                        overflow='auto'
                        onClick={e => e.stopPropagation()}
                    >
                        {children}
                    </Box>
                </Box>
            )}
        >
            <TransformWrapper
                wheel={{ disabled: !expand }}
                minScale={1}
                maxScale={10000}
            >
                {expand && <Controls expand={expand} onExpand={onExpand} />}
                <ConditionalWrapper
                    condition={!expand}
                    wrapper={children => (
                        <HoverOverlayBox
                            controls={
                                <Controls expand={expand} onExpand={onExpand} />
                            }
                        >
                            {children}
                        </HoverOverlayBox>
                    )}
                >
                    <TransformComponent
                        wrapperStyle={
                            expand
                                ? {
                                      width: '100%',
                                      height: 'auto'
                                  }
                                : undefined
                        }
                    >
                        {isSvg ? (
                            <Svg
                                src={imgSrc}
                                alt={alt}
                                expand={expand}
                                priority={priority}
                            />
                        ) : (
                            <Image
                                src={imgSrc}
                                alt={alt}
                                expand={expand}
                                priority={priority}
                            />
                        )}
                    </TransformComponent>
                </ConditionalWrapper>
            </TransformWrapper>
        </ConditionalWrapper>
    )
}
