/* istanbul ignore file */
import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { CDAAS } from '@/constants'

/**
 * Custom error.tsx page in the app router is NOT rendered for dynamic routes using generateStaticParams or ISR.
 * Instead, the pages router 500.tsx is rendered for those error cases.
 * See: https://github.com/vercel/next.js/issues/62046
 */

// This is to prevent SSR issues with @americanexpress/dls-icons
const Root = dynamic(() => import('@/app/layout/Root'), { ssr: false })
const Error = dynamic(() => import('@/app/error'), { ssr: false })

export default function Custom500() {
    return (
        <Root>
            <Head>
                <link
                    rel='icon'
                    type='image/svg+xml'
                    href={`${CDAAS.e3}/enterprise-architecture/aplogo.svg`}
                />
                <title>Error | Architecture Portal</title>
            </Head>
            <Error />
        </Root>
    )
}
