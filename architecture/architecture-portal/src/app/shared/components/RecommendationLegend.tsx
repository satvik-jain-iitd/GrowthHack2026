'use client'
import { Box, Flex, Text } from '@chakra-ui/react'
import { AIIcon } from '@/components/icons/AIIcon'

export const RECOMMENDATION_COLOR = '#F3780D'

/**
 * Legend for the recommendation styling used on the initiative and application
 * management pages, mirroring the TBM mapping AI legend.
 */
export default function RecommendationLegend() {
    return (
        <Flex
            alignItems='center'
            gap={2}
            mt={4}
            px={3}
            py={2}
            border={`1px solid ${RECOMMENDATION_COLOR}`}
            borderRadius='8px'
            backgroundColor='#FEF6F0'
            data-testid='recommendation-legend'
        >
            <Box display='flex' alignItems='center'>
                <AIIcon width={16} height={16} />
            </Box>
            <Text fontSize='14px'>
                = Recommended value, not yet confirmed. Edit and save to
                confirm.
            </Text>
        </Flex>
    )
}
