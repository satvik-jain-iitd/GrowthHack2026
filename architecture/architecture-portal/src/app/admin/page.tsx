/* istanbul ignore file */
import { Metadata } from 'next'
import { AdminHeader } from './components/AdminHeader'
import { AdminCards } from './components/AdminCards'

export const metadata: Metadata = {
    title: 'Admin'
}

export default function AdminHomePage() {
    return (
        <>
            <AdminHeader />
            <AdminCards />
        </>
    )
}
