/* istanbul ignore file */
'use client'
import { useNavbarContext } from '@/context'
import Chat from './Chat'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

export default function Content() {
    const { hidden } = useNavbarContext()
    if (hidden) return null
    return (
        <>
            <Chat />
            <Footer />
            <ScrollToTop />
        </>
    )
}
