/* istanbul ignore file */
import { Metadata } from 'next'
import Root from '@/app/layout/Root'
import { CDAAS } from '@/constants'

export const metadata: Metadata = {
    title: {
        default: 'Architecture Portal',
        template: '%s | Architecture Portal'
    },
    icons: [
        {
            type: 'image/svg+xml',
            url: `${CDAAS.e3}/enterprise-architecture/aplogo.svg`
        }
    ]
}

export default function Layout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return <Root>{children}</Root>
}
