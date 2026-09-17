/* istanbul ignore file */
'use client'
import React from 'react'
import {
    ChakraProvider,
    createSystem,
    defaultConfig,
    defineConfig
} from '@chakra-ui/react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

if (typeof window !== 'undefined') {
    const _err = console.error.bind(console)
    console.error = (...args: Parameters<typeof console.error>) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('script tag while rendering')
        ) {
            return
        }
        _err(...args)
    }
}

const config = defineConfig({
    theme: {
        breakpoints: {
            xs: '0px',
            sm: '500px',
            md: '1000px',
            lg: '1600px',
            xl: '2000px'
        },
        tokens: {
            colors: {
                blue: {
                    50: { value: '#E3F2FD' },
                    100: { value: '#BBDEFB' },
                    200: { value: '#90CAF9' },
                    300: { value: '#64B5F6' },
                    400: { value: '#42A5F5' },
                    500: { value: '#2196F3' },
                    600: { value: '#1E88E5' },
                    700: { value: '#1976D2' },
                    800: { value: '#1565C0' },
                    900: { value: '#0D47A1' }
                },
                brightBlue: {
                    100: { value: '#EDF7FF' },
                    200: { value: '#B5D7F4' },
                    300: { value: '#83BAEB' },
                    400: { value: '#56A1E3' },
                    500: { value: '#2987D9' },
                    600: { value: '#006FCF' },
                    700: { value: '#00559E' },
                    800: { value: '#003A6E' },
                    900: { value: '#001D3E' },
                    tint600T4: { value: '#F5F9FD' },
                    tint600T8: { value: '#EBF3FB' },
                    tint600T12: { value: '#E0EEF9' },
                    tint600T16: { value: '#D6E8F7' },
                    tint400T92: { value: '#64A9E5' },
                    shade600S92: { value: '#0066BE' },
                    shade600S88: { value: '#0062B6' },
                    shade600S84: { value: '#0062B6' },
                    mix400M68: { value: '#224372' },
                    mix400M84: { value: '#152D58' }
                },
                deepBlue: {
                    100: { value: '#E0E4F1' },
                    200: { value: '#A7B3D9' },
                    300: { value: '#7789BF' },
                    400: { value: '#4C63A6' },
                    500: { value: '#2B438C' },
                    600: { value: '#112A73' },
                    700: { value: '#00175A' },
                    800: { value: '#000F3C' },
                    900: { value: '#00081F' },
                    tint700T8: { value: '#EBECF2' },
                    tint700T64: { value: '#52618F' },
                    tint700T76: { value: '#3D4F82' },
                    tint700T88: { value: '#1F336E' },
                    surface800SB4: { value: '#09173D' },
                    surface800SB8: { value: '#101B3D' },
                    surface800SB12: { value: '#2D3654' },
                    surface800SB32: { value: '#5C647B' },
                    surface600M16: { value: '#0D2854' },
                    surface600M32: { value: '#0B2247' },
                    surface600M48: { value: '#0A1E3F' }
                },
                gray: {
                    100: { value: '#FBFBFB' },
                    200: { value: '#F4F4F4' },
                    300: { value: '#E0E0E0' },
                    400: { value: '#BDBDBD' },
                    500: { value: '#8C8C8C' },
                    600: { value: '#737373' },
                    700: { value: '#595959' },
                    800: { value: '#3D3D3D' },
                    900: { value: '#262626' },
                    shade100S4: { value: '#F1F1F1' },
                    shade100S8: { value: '#E7E7E7' },
                    mix400M68: { value: '#434C66' },
                    mix400M84: { value: '#263251' }
                },
                green: {
                    100: { value: '#F2FCF8' },
                    200: { value: '#BAE8D5' },
                    300: { value: '#87D4B4' },
                    400: { value: '#5CBF96' },
                    500: { value: '#37AB7A' },
                    600: { value: '#189662' },
                    700: { value: '#00804A' },
                    800: { value: '#005934' },
                    900: { value: '#00361F' },
                    tint600T8: { value: '#EBF5F1' },
                    mix400M68: { value: '#244D59' },
                    mix400M84: { value: '#16324B' }
                },
                orange: {
                    100: { value: '#FFF6ED' },
                    200: { value: '#F9DDC0' },
                    300: { value: '#F4C393' },
                    400: { value: '#EEAA67' },
                    500: { value: '#E9913A' },
                    600: { value: '#E3660D' },
                    700: { value: '#B5530D' },
                    800: { value: '#8C410C' },
                    900: { value: '#612F0C' },
                    tint600T8: { value: '#FDF3EC' },
                    mix400M68: { value: '#52464A' },
                    mix400M84: { value: '#2E2F44' }
                },
                red: {
                    100: { value: '#FFEDE8' },
                    200: { value: '#F0BFAF' },
                    300: { value: '#E0947B' },
                    400: { value: '#D46E4E' },
                    500: { value: '#C44B25' },
                    600: { value: '#B41601' },
                    700: { value: '#9C2601' },
                    800: { value: '#822001' },
                    900: { value: '#6C1A01' },
                    tint600T8: { value: '#F9ECEB' },
                    mix400M68: { value: '#4A3342' },
                    mix400M84: { value: '#292540' }
                }
            }
        },
        semanticTokens: {
            colors: {
                // ── Surface ──────────────────────────────────────────────
                'surface.base': {
                    value: {
                        base: '{colors.gray.200}',
                        _dark: '{colors.deepBlue.900}'
                    }
                },
                'surface.foreground': {
                    value: {
                        base: 'white',
                        _dark: '{colors.deepBlue.surface800SB8}'
                    }
                },
                'surface.foregroundSubtle': {
                    value: {
                        base: '{colors.gray.100}',
                        _dark: '{colors.deepBlue.surface800SB4}'
                    }
                },
                'surface.foregroundBrand': {
                    value: {
                        base: '{colors.brightBlue.600}',
                        _dark: '{colors.brightBlue.600}'
                    }
                },
                'surface.foregroundBrandAlt': {
                    value: {
                        base: '{colors.deepBlue.600}',
                        _dark: '{colors.deepBlue.600}'
                    }
                },
                'surface.white': {
                    value: { base: 'white', _dark: '#27272a' }
                },
                'surface.white/black': {
                    value: { base: 'white', _dark: '#121212' }
                },
                'surface.default.offwhite': {
                    value: { base: '#ecedee', _dark: '#1C1C1C' }
                },
                // ── Status ────────────────────────────────────────────────
                'status.information': {
                    value: {
                        base: '{colors.brightBlue.600}',
                        _dark: '{colors.brightBlue.400}'
                    }
                },
                'status.informationSubtle': {
                    value: {
                        base: '{colors.brightBlue.100}',
                        _dark: '{colors.brightBlue.mix400M84}'
                    }
                },
                'status.success': {
                    value: {
                        base: '{colors.green.600}',
                        _dark: '{colors.green.400}'
                    }
                },
                'status.successSubtle': {
                    value: {
                        base: '{colors.green.100}',
                        _dark: '{colors.green.mix400M84}'
                    }
                },
                'status.caution': {
                    value: {
                        base: '{colors.orange.600}',
                        _dark: '{colors.orange.400}'
                    }
                },
                'status.cautionSubtle': {
                    value: {
                        base: '{colors.orange.100}',
                        _dark: '{colors.orange.mix400M84}'
                    }
                },
                'status.critical': {
                    value: {
                        base: '{colors.red.600}',
                        _dark: '{colors.red.400}'
                    }
                },
                'status.criticalSubtle': {
                    value: {
                        base: '{colors.red.100}',
                        _dark: '{colors.red.mix400M84}'
                    }
                },
                'status.neutral': {
                    value: {
                        base: '{colors.gray.600}',
                        _dark: '{colors.gray.400}'
                    }
                },
                'status.neutralSubtle': {
                    value: {
                        base: '{colors.gray.100}',
                        _dark: '{colors.gray.mix400M84}'
                    }
                },

                // ── Border ────────────────────────────────────────────────
                'border.emphasis': {
                    value: {
                        base: '{colors.gray.500}',
                        _dark: '{colors.deepBlue.400}'
                    }
                },
                'border.regular': {
                    value: {
                        base: '{colors.gray.400}',
                        _dark: '{colors.deepBlue.tint700T76}'
                    }
                },
                'border.subtle': {
                    value: {
                        base: '{colors.gray.300}',
                        _dark: '{colors.deepBlue.tint700T88}'
                    }
                },
                'border.brand': {
                    value: {
                        base: '{colors.brightBlue.600}',
                        _dark: '{colors.brightBlue.600}'
                    }
                },
                'border.brandAlt': {
                    value: {
                        base: '{colors.deepBlue.600}',
                        _dark: '{colors.brightBlue.200}'
                    }
                },

                // ── Text ──────────────────────────────────────────────────
                'text.emphasis': {
                    value: {
                        base: '{colors.gray.900}',
                        _dark: '{colors.gray.100}'
                    }
                },
                'text.regular': {
                    value: {
                        base: '{colors.gray.800}',
                        _dark: '{colors.gray.200}'
                    }
                },
                'text.subtle': {
                    value: {
                        base: '{colors.gray.700}',
                        _dark: '{colors.gray.300}'
                    }
                },
                'text.brand': {
                    value: {
                        base: '{colors.brightBlue.600}',
                        _dark: '{colors.brightBlue.600}'
                    }
                },
                'text.brandAlt': {
                    value: {
                        base: '{colors.deepBlue.900}',
                        _dark: '{colors.brightBlue.200}'
                    }
                },
                'text.link': {
                    value: {
                        base: '{colors.brightBlue.shade600S88}',
                        _dark: '{colors.brightBlue.400}'
                    }
                },

                // ── Graphic ───────────────────────────────────────────────
                'graphic.emphasis': {
                    value: {
                        base: '{colors.gray.900}',
                        _dark: '{colors.gray.100}'
                    }
                },
                'graphic.regular': {
                    value: {
                        base: '{colors.gray.800}',
                        _dark: '{colors.gray.200}'
                    }
                },
                'graphic.subtle': {
                    value: {
                        base: '{colors.gray.700}',
                        _dark: '{colors.gray.300}'
                    }
                },
                'graphic.minimal': {
                    value: {
                        base: '{colors.gray.600}',
                        _dark: '{colors.gray.400}'
                    }
                },
                'graphic.brand': {
                    value: {
                        base: '{colors.brightBlue.600}',
                        _dark: '{colors.brightBlue.600}'
                    }
                },
                'graphic.brandAlt': {
                    value: {
                        base: '{colors.deepBlue.600}',
                        _dark: '{colors.brightBlue.200}'
                    }
                },
                'graphic.link': {
                    value: {
                        base: '{colors.brightBlue.shade600S88}',
                        _dark: '{colors.brightBlue.400}'
                    }
                },

                // ── Interactive / Primary ─────────────────────────────────
                'interactive.primary.default': {
                    value: {
                        base: '{colors.brightBlue.600}',
                        _dark: '{colors.brightBlue.600}'
                    }
                },
                'interactive.primary.hover': {
                    value: {
                        base: '{colors.brightBlue.shade600S88}',
                        _dark: '{colors.brightBlue.shade600S88}'
                    }
                },
                'interactive.primary.pressed': {
                    value: {
                        base: '{colors.brightBlue.shade600S84}',
                        _dark: '{colors.brightBlue.shade600S84}'
                    }
                },
                'interactive.primary.disabled': {
                    value: {
                        base: '{colors.gray.300}',
                        _dark: '{colors.deepBlue.surface800SB12}'
                    }
                },

                // ── Interactive / Secondary ───────────────────────────────
                'interactive.secondary.default': {
                    value: {
                        base: 'white',
                        _dark: '{colors.deepBlue.surface600M16}'
                    }
                },
                'interactive.secondary.hover': {
                    value: {
                        base: '{colors.brightBlue.tint600T12}',
                        _dark: '{colors.deepBlue.surface600M32}'
                    }
                },
                'interactive.secondary.pressed': {
                    value: {
                        base: '{colors.brightBlue.tint600T16}',
                        _dark: '{colors.deepBlue.surface600M48}'
                    }
                },
                'interactive.secondary.disabled': {
                    value: {
                        base: '{colors.gray.300}',
                        _dark: '{colors.deepBlue.surface800SB12}'
                    }
                },

                // ── Interactive / Tertiary ────────────────────────────────
                'interactive.tertiary.default': {
                    value: { base: 'transparent', _dark: 'transparent' }
                },
                'interactive.tertiary.hover': {
                    value: {
                        base: '{colors.brightBlue.tint600T8}',
                        _dark: '{colors.deepBlue.surface800SB4}'
                    }
                },
                'interactive.tertiary.pressed': {
                    value: {
                        base: '{colors.brightBlue.tint600T12}',
                        _dark: '{colors.deepBlue.surface800SB8}'
                    }
                },
                'interactive.tertiary.disabled': {
                    value: { base: 'transparent', _dark: 'transparent' }
                },

                // ── Interactive / Tertiary (Gray theme) ───────────────────
                'interactive.tertiaryGray.default': {
                    value: { base: 'transparent', _dark: 'transparent' }
                },
                'interactive.tertiaryGray.hover': {
                    value: {
                        base: '{colors.gray.shade100S4}',
                        _dark: '{colors.deepBlue.surface800SB4}'
                    }
                },
                'interactive.tertiaryGray.pressed': {
                    value: {
                        base: '{colors.gray.shade100S8}',
                        _dark: '{colors.deepBlue.surface800SB8}'
                    }
                }
            }
        }
    }
})

const chakraSystem = createSystem(defaultConfig, config)

export default function ThemeProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <NextThemeProvider
            attribute='class'
            storageKey='chakra-ui-color-mode'
            enableColorScheme={false}
            enableSystem={false}
            disableTransitionOnChange
        >
            <ChakraProvider value={chakraSystem}>{children}</ChakraProvider>
        </NextThemeProvider>
    )
}
