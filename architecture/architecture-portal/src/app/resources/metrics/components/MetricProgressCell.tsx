import { Flex, Progress, Text } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui'
import {
    PROGRESS_THRESHOLD_COLORS,
    PROGRESS_ZERO_BORDER_COLOR
} from '../constants'

const FALLBACK_COLOR =
    PROGRESS_THRESHOLD_COLORS[PROGRESS_THRESHOLD_COLORS.length - 1].color

export default function MetricProgressCell({
    value,
    numerator,
    denominator
}: {
    value: number | string | null | undefined
    numerator?: number
    denominator?: number
}) {
    const parsed = Number.parseFloat(String(value))
    const percentage = Number.isNaN(parsed)
        ? 0
        : Math.min(100, Math.max(0, parsed))
    const color =
        PROGRESS_THRESHOLD_COLORS.find(threshold => percentage <= threshold.max)
            ?.color ?? FALLBACK_COLOR
    const label = `${percentage.toFixed(2)}%`
    const noneCertified = percentage === 0 && (denominator ?? 0) > 0

    return (
        <Tooltip
            content={`${numerator ?? 0} out of ${denominator ?? 0} operations`}
            openDelay={500}
        >
            <Flex alignItems='center' gap='0.5rem' data-testid='progress-cell'>
                <Progress.Root
                    value={percentage}
                    variant='outline'
                    flex='1'
                    minW='60px'
                    aria-label={label}
                >
                    <Progress.Track
                        h='16px'
                        borderRadius='8px'
                        overflow='hidden'
                        outline={
                            noneCertified
                                ? `2px solid ${PROGRESS_ZERO_BORDER_COLOR}`
                                : undefined
                        }
                        outlineOffset='1px'
                    >
                        <Progress.Range bg={color} borderRadius='8px' />
                    </Progress.Track>
                </Progress.Root>
                <Text whiteSpace='nowrap' flexShrink={0} textAlign='right'>
                    {label}
                </Text>
            </Flex>
        </Tooltip>
    )
}
