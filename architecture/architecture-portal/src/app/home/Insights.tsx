/* istanbul ignore file */
'use client'
import React, { useState } from 'react'
import CountUp from 'react-countup'
import { useAnalytics } from '@/hooks'
import { useInView } from 'react-intersection-observer'
import { Box, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'

type Insight = {
    title: string
    imgSrc: string
    stats: number
}

type InsightCardProps = {
    item: Insight
}

function InsightCard({ item }: InsightCardProps) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 })
    const [statScroll, setStatScroll] = useState(false)

    return (
        <Box>
            <Stack alignItems='center' gap={0}>
                <Image
                    src={item.imgSrc}
                    alt={item.title}
                    width={48}
                    height={48}
                />
                <Text fontSize='5xl' color='fg.info' as='div'>
                    {!statScroll ? (
                        <div ref={ref}>
                            {inView ? (
                                <CountUp
                                    useEasing={true}
                                    end={item.stats}
                                    start={
                                        item.stats > 100
                                            ? item.stats - 100
                                            : item.stats
                                    }
                                    duration={2}
                                    onEnd={() => setStatScroll(true)}
                                />
                            ) : null}
                        </div>
                    ) : (
                        <div>{item.stats.toLocaleString()}</div>
                    )}
                </Text>
                <Text fontSize='xl' color='fg'>
                    {item.title}
                </Text>
                {item.title !== 'Contributors' && (
                    <Text fontSize='md' color='fg.muted'>
                        Last 30 days
                    </Text>
                )}
            </Stack>
        </Box>
    )
}

export default function Insights() {
    const { analytics } = useAnalytics()
    const { overall } = analytics ?? {}
    const { numDistinctContributors, pageViews, uniqueVisitors } = overall ?? {}
    const insights: Insight[] = [
        {
            title: 'Contributors',
            imgSrc: '/contributers.png',
            stats: numDistinctContributors ?? 0
        },
        {
            title: 'Page Views',
            imgSrc: '/pageViews.png',
            stats: pageViews ?? 0
        },
        {
            title: 'Unique Visitors',
            imgSrc: '/uniqueVisitors.png',
            stats: uniqueVisitors ?? 0
        }
    ]

    return (
        <Box mt={9} display='flex' justifyContent='center' width='100%'>
            <SimpleGrid
                columns={{ base: 1, md: 3 }}
                gap={8}
                w={{ xl: '50%', base: '80%' }}
            >
                {insights.map((item, index) => (
                    <InsightCard key={index} item={item} />
                ))}
            </SimpleGrid>
        </Box>
    )
}
