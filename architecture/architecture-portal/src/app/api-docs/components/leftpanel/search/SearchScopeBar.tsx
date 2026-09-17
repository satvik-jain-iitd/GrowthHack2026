/* istanbul ignore file */

import React from 'react'
import { HStack, Image, Text, VStack, chakra } from '@chakra-ui/react'
import { Domains, domainsLeftNav } from '@/app/api-docs/types/apiDocs'
import { useGetDomainInfo } from '@/app/api-docs/components/hooks/useGetDomainInfo'
import { LinkButton } from './searchRowUtils'

function DomainChip({
    domain,
    domains,
    selected,
    onClick
}: {
    domain: domainsLeftNav
    domains: Domains
    selected: boolean
    onClick: () => void
}) {
    const info = useGetDomainInfo(domain.id, domains)
    return (
        <chakra.button
            type='button'
            aria-pressed={selected}
            onClick={onClick}
            px={3}
            py={1.5}
            borderRadius='full'
            borderWidth='1px'
            borderColor={selected ? '#006fcf' : '#D4DEE9'}
            bg={selected ? 'blue.50' : 'transparent'}
            _dark={{
                borderColor: selected ? '#8ec7ff' : '#3c4250',
                bg: selected ? '#243044' : 'transparent'
            }}
            _hover={{ borderColor: '#006fcf' }}
        >
            <HStack gap={2}>
                {/* An empty base64 string would fire a broken image request. */}
                {Boolean(info.lightIcon) && (
                    <>
                        <Image
                            alt=''
                            className='image-light'
                            width={4}
                            height={4}
                            src={`data:image/png;base64,${info.lightIcon}`}
                        />
                        <Image
                            alt=''
                            className='image-dark'
                            width={4}
                            height={4}
                            src={`data:image/png;base64,${info.darkIcon}`}
                        />
                    </>
                )}
                <Text fontSize='xs' fontWeight='600'>
                    {domain.name}
                </Text>
            </HStack>
        </chakra.button>
    )
}

export function SearchScopeBar({
    domainList,
    domains,
    selected,
    onToggle,
    onClear,
    collapsed,
    onExpand
}: {
    domainList: domainsLeftNav[]
    domains: Domains
    selected: ReadonlySet<string>
    onToggle: (domainId: string) => void
    onClear: () => void
    collapsed: boolean
    onExpand: () => void
}) {
    const visible = collapsed
        ? domainList.filter(domain => selected.has(domain.id))
        : domainList
    const hidden = domainList.length - visible.length

    return (
        <VStack align='stretch' gap={2} px={4} pt={4}>
            {!collapsed && (
                <Text fontSize='xs' fontWeight='700' color='gray.500'>
                    FILTER BY COMPANY DOMAIN
                </Text>
            )}
            <HStack gap={2} flexWrap='wrap'>
                {visible.map(domain => (
                    <DomainChip
                        key={domain.id}
                        domain={domain}
                        domains={domains}
                        selected={selected.has(domain.id)}
                        onClick={() => onToggle(domain.id)}
                    />
                ))}
                {collapsed && !selected.size ? (
                    <LinkButton onClick={onExpand}>
                        Filter by company domain
                    </LinkButton>
                ) : (
                    <>
                        {collapsed && hidden > 0 && (
                            <LinkButton onClick={onExpand}>
                                + {hidden} domains
                            </LinkButton>
                        )}
                        {Boolean(selected.size) && (
                            <LinkButton onClick={onClear}>Clear</LinkButton>
                        )}
                    </>
                )}
            </HStack>
        </VStack>
    )
}
