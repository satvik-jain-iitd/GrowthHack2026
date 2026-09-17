import { useState } from 'react'
import { Button, Flex, Tag, Text } from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { EbcmCapability } from '@/app/company-domains/types'
import { NoPrefetchLink } from '@/components/ui'
import ExpandableText from './ExpandableText'

const VISIBLE_LIMIT = 8

interface EbcmBadgeListProps {
    capabilities?: EbcmCapability[]
    fallbackNames?: string[]
}

const EbcmBadgeList = ({ capabilities, fallbackNames }: EbcmBadgeListProps) => {
    const [expanded, setExpanded] = useState(false)

    if (!capabilities?.length) {
        return (
            <ExpandableText className={styles.description}>
                <span>{fallbackNames?.join(', ') || '--'}</span>
            </ExpandableText>
        )
    }

    const hiddenCount = capabilities.length - VISIBLE_LIMIT
    const visibleCapabilities = expanded
        ? capabilities
        : capabilities.slice(0, VISIBLE_LIMIT)

    return (
        <Flex wrap='wrap' alignItems='center'>
            {visibleCapabilities.map(capability => (
                <NoPrefetchLink
                    key={capability.capability_id}
                    href={`/business-architecture/capabilities/${capability.capability_id}/?tab=Enterprise+Customer+Journeys`}
                >
                    <Tag.Root
                        variant='subtle'
                        m={1}
                        fontSize='12px'
                        lineHeight='24px'
                        borderRadius='full'
                        minHeight='32px'
                        cursor='pointer'
                        borderWidth='1px'
                        borderStyle='solid'
                        borderColor={{ base: '#9dcbf2', _dark: 'blue.700' }}
                        backgroundColor={{ base: '#ecf5fd', _dark: 'blue.900' }}
                        color={{ base: '#006fcf', _dark: 'blue.100' }}
                        _hover={{
                            backgroundColor: {
                                base: '#d8eafb',
                                _dark: 'blue.800'
                            }
                        }}
                    >
                        <Tag.Label p={1} title={capability.capability_nm}>
                            {capability.capability_nm}
                        </Tag.Label>
                    </Tag.Root>
                </NoPrefetchLink>
            ))}
            {hiddenCount > 0 && (
                <Button
                    variant='plain'
                    size='sm'
                    onClick={() => setExpanded(prev => !prev)}
                    cursor='pointer'
                    p={0}
                    ml={1}
                >
                    <Text
                        color='blue.500'
                        textDecoration='underline'
                        fontSize='11px'
                    >
                        {expanded ? 'Show less' : `+${hiddenCount} more`}
                    </Text>
                </Button>
            )}
        </Flex>
    )
}

export default EbcmBadgeList
