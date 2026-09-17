/* istanbul ignore file */

import { Box, Separator } from '@chakra-ui/react'
import { CenterContentPanel } from './CenterContentPanel'
import { RightContentPanel } from './RightContentPanel'
import React from 'react'
import { NAVBAR_HEIGHT } from '@/constants/layout'

export function ContentSection({
    id,
    firstSection,
    lastSection,
    midSection,
    rightSection
}: {
    id: string
    midSection: React.ReactNode
    rightSection: React.ReactNode
    firstSection?: boolean
    lastSection?: boolean
}) {
    return (
        <>
            <Box
                as='section'
                display='flex'
                flexDirection={{ base: 'column', md: 'row' }}
                width='100%'
                paddingTop={firstSection ? '1rem' : '2rem'}
                paddingBottom={lastSection ? '1rem' : '2rem'}
                paddingX={{ base: '1rem', md: '2rem' }}
                gap={8}
                id={id}
                scrollMarginTop={`calc(${NAVBAR_HEIGHT} + 1rem)`}
                className='content-section'
            >
                <CenterContentPanel>{midSection}</CenterContentPanel>
                <RightContentPanel>{rightSection}</RightContentPanel>
            </Box>
            {!lastSection && !firstSection && (
                <Separator
                    borderColor='#D4DEE9'
                    _dark={{
                        borderColor: 'gray.800'
                    }}
                />
            )}
        </>
    )
}
