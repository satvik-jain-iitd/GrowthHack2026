/* istanbul ignore file */
import React from 'react'
import { AdminHeader } from '../components/AdminHeader'
import { AdminProvider } from '@/context'
import { AdminContainer } from '../components/AdminContainer'
import { toTitleCase } from '@/utils/client'

export async function generateMetadata({
    params
}: {
    params: Promise<{ playbookCategory: string }>
}) {
    const { playbookCategory } = await params
    return {
        title: `Admin - ${toTitleCase(playbookCategory)}`
    }
}

export default async function Category({
    params
}: {
    params: Promise<{
        playbookCategory:
            | 'initiatives'
            | 'company-domains'
            | 'foundational-technologies'
    }>
}) {
    const { playbookCategory } = await params

    return (
        <>
            <AdminProvider selectedCategory={playbookCategory}>
                <AdminHeader />
                <AdminContainer playbookCategory={playbookCategory} />
            </AdminProvider>
        </>
    )
}
