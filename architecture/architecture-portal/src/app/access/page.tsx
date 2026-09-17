/* istanbul ignore file */
import { Metadata } from 'next'
import { NavbarHider } from '@/context'
import { AccessRequired } from './AccessRequired'

export const metadata: Metadata = {
    title: 'Access Required'
}

export default function AccessPage() {
    return (
        <>
            <NavbarHider />
            <AccessRequired />
        </>
    )
}
