/* istanbul ignore file */
'use client'
import React, { useEffect, useRef, useMemo } from 'react'

interface SeamlessIframeProps {
    src: string
    allow: string
    onMessage?: (event: MessageEvent) => void
}

export const SeamlessIframe: React.FC<SeamlessIframeProps> = ({
    src,
    onMessage,
    allow
}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const basedUrl = useMemo(() => {
        const url = new URL(src)
        return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`
    }, [src])

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Optionally, check event.origin for security
            if (
                iframeRef.current &&
                event.source === iframeRef.current.contentWindow
            ) {
                if (onMessage) {
                    onMessage(event)
                }

                const {
                    type,
                    dimensions,
                    location: iframeLocation
                } = event.data
                switch (type) {
                    case 'resize': {
                        iframeRef.current.style.height = `${dimensions.height}px`
                        break
                    }
                    case 'relocate': {
                        const newPath = iframeLocation.path
                            .replace(/^\.\//, '')
                            .replace(basedUrl, '')
                        if (/^https?/.test(newPath)) {
                            window.open(newPath, '_blank')
                        } else {
                            iframeRef.current.src = `${basedUrl}${newPath}`
                        }

                        break
                    }
                    default:
                        break
                }
            }
        }

        window.addEventListener('message', handleMessage)
        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [onMessage, basedUrl])

    return (
        <iframe
            ref={iframeRef}
            src={src}
            style={{ border: 'none', width: '100%' }}
            title='Seamless Iframe'
            allow={allow}
        />
    )
}
