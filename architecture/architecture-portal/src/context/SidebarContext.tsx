/* istanbul ignore file */
'use client'
import { createContext } from 'react'
import { SidebarItem } from '@/types/SidebarItem'

export const SidebarContext = createContext<{ sidebar: SidebarItem[] }>({
    sidebar: []
})
