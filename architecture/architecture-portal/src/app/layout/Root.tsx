/* istanbul ignore file */
import React from 'react'
import NavBar from '@/app/layout/NavBar'
import AuthBlueSso from '@/app/layout/AuthBlueSso'
import Content from '@/app/layout/Content'
import ThemeProvider from '@/app/layout/ThemeProvider'
import ReactQueryProvider from '@/app/layout/ReactQueryProvider'
import NavigationTransition from '@/app/layout/NavigationTransition'
import AnalyticsTracking from '@/app/layout/AnalyticsTracking'
import {
    DirectoryProvider,
    NavbarProvider,
    NavigationProvider,
    ScrollProvider,
    SidebarOpenProvider,
    UserProvider
} from '@/context'
import '@/app/globals.css'
import { ToastContainer } from 'react-toastify'

export default function Root({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className='body'>
                <AnalyticsTracking />
                <AuthBlueSso>
                    <ReactQueryProvider>
                        <ThemeProvider>
                            <SidebarOpenProvider>
                                <UserProvider>
                                    <DirectoryProvider>
                                        <ScrollProvider>
                                            <NavigationProvider>
                                                <NavigationTransition />
                                                <NavbarProvider>
                                                    <NavBar>
                                                        {children}
                                                        <Content />
                                                    </NavBar>
                                                </NavbarProvider>
                                            </NavigationProvider>
                                        </ScrollProvider>
                                    </DirectoryProvider>
                                </UserProvider>
                            </SidebarOpenProvider>
                        </ThemeProvider>
                    </ReactQueryProvider>
                </AuthBlueSso>
                <ToastContainer />
            </body>
        </html>
    )
}
