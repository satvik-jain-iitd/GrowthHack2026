'use client'
import React from 'react'
import { Box } from '@chakra-ui/react'
import { AdminTabs } from './AdminTabs'
import { AdminSidebar, AdminSidebarType } from './AdminSidebar'
import { AdminContent } from './AdminContent'

export const AdminLayout = ({ sidebar }: { sidebar: AdminSidebarType[] }) => {
    return (
        <Box
            pt={{ base: 0, sm: 8 }}
            px={{ base: 0, sm: '10rem' }}
            pb={{ base: 4, sm: 24 }}
            height={{ base: '100%', sm: '90vh' }}
            bg={{ base: '#ecedee', _dark: '#3c3c3c' }}
        >
            <Box
                w='100%'
                p={2}
                bg={{ base: '#00175a', _dark: '#1c1c1c' }}
                borderRadius='7px'
                boxShadow='0px 5px 10px 0px rgba(0,0,0,0.1)'
                color='#fff'
                display={{ base: 'none', sm: 'block' }}
            >
                <AdminTabs />
            </Box>
            <Box
                w='100%'
                h='100%'
                borderRadius='7px'
                bg={{ base: '#fff', _dark: '#333' }}
                display={{ base: 'block', sm: 'none' }}
                p={2}
            >
                <AdminSidebar sidebar={sidebar} isMobile={true} />
            </Box>
            <Box
                h='100%'
                pt={4}
                display='flex'
                justifyContent={{ base: 'center', sm: 'space-between' }}
            >
                <Box
                    w='20%'
                    h='100%'
                    borderRadius='7px'
                    bg={{ base: '#fff', _dark: '#333' }}
                    display={{ base: 'none', sm: 'block' }}
                >
                    <AdminSidebar sidebar={sidebar} />
                </Box>
                <Box
                    w={{ base: '95%', sm: '78%' }}
                    h='100%'
                    p={{ base: 0, sm: 4 }}
                    bg={{ base: '#fff', _dark: '#333' }}
                    borderRadius='7px'
                    boxShadow='0px 5px 10px 0px rgba(0,0,0,0.1)'
                    color={{ base: 'inherit', _dark: 'white' }}
                >
                    <AdminContent />
                </Box>
            </Box>
        </Box>
    )
}
