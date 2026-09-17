/* istanbul ignore file */
import Document from '@/app/docs/components/Document'
import { getMetadata } from '@/app/docs/utils/server'

export const revalidate = 60

export async function generateStaticParams() {
    return []
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ uuid: string }>
}) {
    const { uuid } = await params
    return await getMetadata(uuid)
}

export default async function Doc({
    params
}: {
    params: Promise<{ uuid: string }>
}) {
    const { uuid } = await params
    return <Document uuid={uuid} />
}
