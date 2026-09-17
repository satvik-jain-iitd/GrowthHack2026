/* istanbul ignore file */
'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { IconButton, Box } from '@chakra-ui/react'
import { IconChevronUp } from '@americanexpress/dls-icons'
import { useScrollContext } from '@/context'

const SCROLL_THRESHOLD = 300

export default function ScrollToTop() {
    const { scrollRef, scrollTo, getScrollY } = useScrollContext()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        const onScroll = () => setIsVisible(getScrollY() > SCROLL_THRESHOLD)
        onScroll()
        el.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            el.removeEventListener('scroll', onScroll)
        }
    }, [scrollRef, getScrollY])

    const scrollToTop = useCallback(() => {
        scrollTo(0, { behavior: 'smooth' })
    }, [scrollTo])

    return (
        <Box
            as='aside'
            position='fixed'
            bottom='6'
            right='6'
            zIndex={1000}
            opacity={isVisible ? 1 : 0}
            pointerEvents={isVisible ? 'auto' : 'none'}
            transform={isVisible ? 'translateY(0)' : 'translateY(8px)'}
            transition='opacity 200ms ease, transform 200ms ease'
        >
            <IconButton
                onClick={scrollToTop}
                size='md'
                borderRadius='full'
                colorPalette='blue'
                boxShadow='md'
                _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg'
                }}
            >
                <IconChevronUp color='white' />
            </IconButton>
        </Box>
    )
}
