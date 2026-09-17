/* istanbul ignore file */
import React from 'react'
import { Box, Image, Text } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui'

type Hotspot = {
    id: string
    // percent coords relative to image container
    leftPct: number
    topPct: number
    widthPct: number
    heightPct: number
    title: string
    content: React.ReactNode
}

export const HowItConnects = ({
    src = '/business-architecture/EBCMHowItConnects.png',
    alt = 'EBCM diagram',
    maxWidth = '980px',
    enlarged = false,
    debug = false
}: {
    src?: string
    alt?: string
    maxWidth?: string | number
    enlarged?: boolean
    debug?: boolean
}) => {
    const hotspots: Hotspot[] = [
        {
            id: 'axp',
            leftPct: (enlarged ? 33 : 36) - 2.5, // make hotspot centered; subtract half width
            topPct: (enlarged ? 28.8 : 30.5) - 2.5,
            widthPct: 5, // small square centered on icon
            heightPct: 5,
            title: 'AXP Strategy & Outcomes',
            content: 'AXP Strategy & Outcomes'
        },
        {
            id: 'customer',
            leftPct: (enlarged ? 82 : 76.5) - 2.5,
            topPct: (enlarged ? 35 : 36.5) - 2.5,
            widthPct: 5,
            heightPct: 5,
            title: 'Customer Journeys & Products',
            content: 'Customer journeys and products'
        },
        {
            id: 'ebcm',
            leftPct: (enlarged ? 39 : 40.5) - 2.5,
            topPct: 71 - 2.5,
            widthPct: 5,
            heightPct: 5,
            title: 'Enterprise Business Capabilities (EBCM)',
            content: 'Enterprise Business Capabilities.'
        },
        {
            id: 'domains',
            leftPct: (enlarged ? 88 : 81.5) - 2.5,
            topPct: 92.3 - 2.5,
            widthPct: 5,
            heightPct: 5,
            title: 'Domains, APIs, Applications, Data',
            content: 'Domains, APIs, applications and data layers.'
        }
    ]
    return (
        <Box
            maxW={maxWidth}
            position='relative'
            userSelect='none'
            paddingX='4rem'
            paddingTop={3}
        >
            <Image
                src={src}
                className='image-light'
                alt={alt}
                w='100%'
                h='auto'
                draggable={false}
                borderRadius='md'
            />
            <Image
                src='/business-architecture/EBCMHowItConnectsDark.png'
                className='image-dark'
                alt={alt}
                w='100%'
                h='auto'
                draggable={false}
                borderRadius='md'
            />

            {hotspots.map(h => (
                <Tooltip
                    key={h.id}
                    content={
                        <Box>
                            {/* <Text fontWeight="700" mb={1}>
                {h.title}
              </Text> */}
                            <Text fontSize='sm'>{h.content}</Text>
                        </Box>
                    }
                    showArrow
                >
                    {/* button-like hotspot for accessibility */}
                    <Box
                        as='button'
                        aria-label={h.title}
                        role='button'
                        position='absolute'
                        left={`${h.leftPct}%`}
                        top={`${h.topPct}%`}
                        width={`${h.widthPct}%`}
                        height={`${h.heightPct}%`}
                        bg={debug ? 'rgba(243,156,18,0.22)' : 'transparent'}
                        border={debug ? '1px dashed rgba(0,0,0,0.35)' : '0'}
                        _hover={{
                            cursor: 'pointer'
                        }}
                        _focus={{ boxShadow: 'outline' }}
                        tabIndex={0}
                        zIndex={2}
                    />
                </Tooltip>
            ))}
        </Box>
    )
}
