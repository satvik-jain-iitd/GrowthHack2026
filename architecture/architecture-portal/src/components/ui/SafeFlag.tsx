/* istanbul ignore file */
'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { IconGlobal } from '@americanexpress/dls-icons'
import { CDAAS_URL } from '@/constants'

export const SafeFlag = ({ code, alt }: { code: string; alt: string }) => {
    const [hasError, setHasError] = useState(false)

    const flagImg = useMemo(() => {
        if (!code || hasError) return null

        if (code === 'GLOBAL') {
            return (
                <IconGlobal
                    title='Global icon'
                    titleId='global-icon-id'
                    className='icon-blue-color'
                />
            )
        }

        return (
            <Image
                width={20}
                height={15}
                src={`${CDAAS_URL}/enterprise-architecture/flags/${code.toLowerCase()}.png`}
                alt={alt}
                onError={() => setHasError(true)}
                style={{
                    borderRadius: '2px',
                    objectFit: 'cover'
                }}
                unoptimized={true}
            />
        )
    }, [code, alt, hasError])

    return flagImg
}
