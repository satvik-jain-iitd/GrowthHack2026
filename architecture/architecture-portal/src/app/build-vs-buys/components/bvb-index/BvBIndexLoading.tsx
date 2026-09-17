import { Box, Flex, SimpleGrid, Skeleton, Text } from '@chakra-ui/react'
import BvBIndexHeaderItem from '@/app/build-vs-buys/components/bvb-index/BvBIndexHeaderItem'
import React from 'react'

export default function BvBIndexLoading() {
    return (
        <>
            <Text fontSize={36} color='fg'>
                <Skeleton mb={6} height='40px' width='300px' />
            </Text>
            <Flex
                align='center'
                mb={6}
                width='100%'
                borderBottom='1px solid #e0e0e0'
            >
                {[...Array(6)].map((_, idx) => (
                    <BvBIndexHeaderItem key={idx}>
                        <Skeleton height='30px' width='80px' />
                    </BvBIndexHeaderItem>
                ))}
            </Flex>
            <Box width='100%' mb={6}>
                <Skeleton height='60px' width='100%' />
            </Box>
            <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3 }}
                gap={{ base: 4, sm: 8, md: 12 }}
            >
                {[...Array(6)].map((_, idx) => (
                    <Box key={idx}>
                        <Skeleton height='50px' width='100%' />
                    </Box>
                ))}
            </SimpleGrid>
        </>
    )
}
