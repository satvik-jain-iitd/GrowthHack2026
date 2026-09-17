/* istanbul ignore file */
'use client'
import { useTheme } from 'next-themes'
import { Icon, IconButton } from '@chakra-ui/react'
import { LightModeIcon, DarkModeIcon } from '@/components/icons'

export default function ThemeToggleButton() {
    const { theme, setTheme } = useTheme()
    const isDarkMode = theme === 'dark'

    const handleClick = () => {
        setTheme(isDarkMode ? 'light' : 'dark')
    }

    return (
        <IconButton borderRadius='50%' variant='ghost' onClick={handleClick}>
            <Icon size='lg' display='block' _dark={{ display: 'none' }}>
                <DarkModeIcon />
            </Icon>
            <Icon size='lg' display='none' _dark={{ display: 'block' }}>
                <LightModeIcon />
            </Icon>
        </IconButton>
    )
}
