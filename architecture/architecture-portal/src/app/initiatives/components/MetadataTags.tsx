/* istanbul ignore file */
import { Flex, Tag } from '@chakra-ui/react'
import { AIIcon } from '@/components/icons/AIIcon'
import { RECOMMENDATION_COLOR } from '@/app/shared/components/RecommendationLegend'

export default function MetadataTags({
    label,
    isRecommended = false
}: {
    label: string
    isRecommended?: boolean
}) {
    const color = isRecommended ? RECOMMENDATION_COLOR : '#006fcf'

    return (
        <Tag.Root
            ml={2}
            mt={2}
            variant={'surface'}
            color={color}
            backgroundColor={'white'}
            border={`1px solid ${color}`}
            data-recommended={isRecommended ? 'true' : undefined}
        >
            <Tag.Label padding={'5px'} fontSize={'14px'} fontWeight={'500'}>
                <Flex alignItems={'center'} gap={1}>
                    {label}
                    {isRecommended && <AIIcon width={14} height={14} />}
                </Flex>
            </Tag.Label>
        </Tag.Root>
    )
}
