/* istanbul ignore file */
'use client'
import { useContext } from 'react'
import { useNavbarContext, SidebarContext } from '@/context'
import { findSidebarItem, getSidebarKey } from '@/app/docs/utils/client'
import { Box, Text, Skeleton, SimpleGrid, Link } from '@chakra-ui/react'
import { ConditionalWrapper, NoPrefetchLink as NextLink } from '@/components/ui'
import { IconDocument } from '@americanexpress/dls-icons'
import AddAdrButton from '@/app/docs/components/AddAdrButton'
import { PLAYBOOK_TYPE_IDS } from '@/constants'

export default function GeneratedIndex({
    uuid,
    isAdrs,
    playbookId,
    repo
}: {
    uuid?: string
    isAdrs?: boolean
    playbookId?: string
    repo?: string
}) {
    const { label } = useNavbarContext()
    const { sidebar } = useContext(SidebarContext)
    const sidebarItem = uuid
        ? findSidebarItem(sidebar, uuid, isAdrs)
        : undefined
    const title = sidebarItem?.name ?? label
    const items = sidebarItem ? sidebarItem.children : sidebar

    const showAddAdrButton =
        playbookId && repo && !isAdrs && repo !== 'architecture-portal'
    return (
        <>
            <Text as='h1' fontSize='3xl' mb={4} color='fg'>
                {title ?? <Skeleton height='45px' width='500px' />}
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={4}>
                {showAddAdrButton && (
                    <AddAdrButton
                        playbookId={playbookId}
                        repo={repo}
                        playbookTypeId={PLAYBOOK_TYPE_IDS.INITIATIVE}
                    />
                )}
                {items?.map(item => (
                    <ConditionalWrapper
                        key={getSidebarKey(item)}
                        condition={!!item.href}
                        wrapper={children => (
                            // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                            <Link
                                as={NextLink}
                                href={item.href}
                                display='flex'
                                alignItems='center'
                                cursor='pointer'
                                _hover={{ textDecoration: 'none' }}
                                _focus={{
                                    outline: 'none',
                                    boxShadow: 'none'
                                }}
                            >
                                {children}
                            </Link>
                        )}
                    >
                        <Box
                            width='100%'
                            borderWidth='1px'
                            borderRadius='md'
                            transition='border-color 0.2s'
                            _dark={{ bg: 'bg.muted' }}
                            _hover={item.href ? { borderColor: 'fg.info' } : {}}
                            p={4}
                        >
                            <Box display='flex' alignItems='center'>
                                <IconDocument
                                    style={{ marginRight: 8 }}
                                    color='information'
                                    size='sm'
                                />
                                <Text fontSize={14} color='fg'>
                                    {item.name}
                                </Text>
                            </Box>
                        </Box>
                    </ConditionalWrapper>
                ))}
            </SimpleGrid>
        </>
    )
}
