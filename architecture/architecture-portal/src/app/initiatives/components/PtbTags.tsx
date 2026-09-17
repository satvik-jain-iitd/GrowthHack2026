import { Box, Flex, Tag, Text } from '@chakra-ui/react'
import { NoPrefetchLink as Link } from '@/components/ui'
import { CoreIcon } from '@/components/icons/CoreIcon'
import { AIIcon } from '@/components/icons/AIIcon'
import { RECOMMENDATION_COLOR } from '@/app/shared/components/RecommendationLegend'

const PtbTag = ({
    isLink,
    isCore,
    item,
    isEdit,
    isRecommended,
    onClickClose
}: {
    isLink: boolean
    isCore: boolean
    item: { name: string; id: string }
    isEdit: boolean
    isRecommended: boolean
    onClickClose: () => void
}) => {
    return (
        <Tag.Root
            ml={2}
            mt={2}
            variant={'surface'}
            color={isRecommended ? RECOMMENDATION_COLOR : '#006FCF'}
            size={'sm'}
            backgroundColor={isRecommended ? '#FEF6F0' : '#EDF7FF'}
            _hover={isLink ? { textDecoration: 'underline' } : {}}
            data-recommended={isRecommended ? 'true' : undefined}
        >
            <Tag.Label padding={'5px'} fontSize={'14px'} fontWeight={'500'}>
                <Flex justifyContent={'center'} alignItems={'center'}>
                    {isCore && <CoreIcon />}
                    <Text ml={1}>{item.name}</Text>
                    {isRecommended && (
                        <Box ml={1} display={'flex'} alignItems={'center'}>
                            <AIIcon width={14} height={14} />
                        </Box>
                    )}
                </Flex>
            </Tag.Label>
            {isEdit && (
                <Tag.CloseTrigger
                    color='#006fcf'
                    width='20px'
                    cursor='pointer'
                    pr={1}
                    onClick={onClickClose}
                    data-testid='ebcm-close'
                />
            )}
        </Tag.Root>
    )
}

export default function PtbTags({
    item,
    isCore = false,
    isEdit = false,
    onClickClose = () => {},
    isLink = false,
    isPlaybook = false,
    isRecommended = false,
    href
}: {
    item: { name: string; id: string }
    isCore?: boolean
    isEdit?: boolean
    onClickClose?: () => void
    isLink?: boolean
    isPlaybook?: boolean
    isRecommended?: boolean
    /** Resolved link target. Playbook tags fall back to `/docs/{item.id}`. */
    href?: string | null
}) {
    const linkTarget = href || (isPlaybook ? `/docs/${item.id}` : null)

    if (isLink && linkTarget) {
        return (
            <Link href={linkTarget} target='_blank'>
                <PtbTag
                    isCore={isCore}
                    isEdit={isEdit}
                    isLink={isLink}
                    isRecommended={isRecommended}
                    item={item}
                    onClickClose={onClickClose}
                />
            </Link>
        )
    }

    return (
        <PtbTag
            isCore={isCore}
            isEdit={isEdit}
            isLink={false}
            isRecommended={isRecommended}
            item={item}
            onClickClose={onClickClose}
        />
    )
}
