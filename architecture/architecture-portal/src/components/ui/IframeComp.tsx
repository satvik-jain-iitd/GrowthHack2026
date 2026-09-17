/* istanbul ignore file */
'use client'
import React from 'react'
import { Button } from '@chakra-ui/react'
import { IconDesktop } from '@americanexpress/dls-icons'

export const IframeComp = ({ id, url }: { id: string; url: string }) => (
    <>
        <div>
            <iframe
                id={id}
                style={{ height: '650px', width: '100%' }}
                src={url}
                allow='fullscreen'
            />
        </div>
        <Button
            variant='ghost'
            onClick={() => document.getElementById(id)?.requestFullscreen()}
        >
            <IconDesktop />
            Presentation Mode
        </Button>
    </>
)
