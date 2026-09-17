/* istanbul ignore file */

import { Box, Image, HStack, SkeletonCircle, Text } from '@chakra-ui/react'
import styles from '@/app/api-docs/api-docs.module.scss'
import { useGetDomainInfo } from '@/app/api-docs/components/hooks'
import {
    apisLeftNav,
    operationsLeftNav,
    Domains
} from '@/app/api-docs/types/apiDocs'
import { useState, useEffect } from 'react'
import { IconChevronRight, IconChevronDown } from '@americanexpress/dls-icons'
import LeftNavItems from './LeftNavItems'

export default function LeftNavItem({
    label,
    id,
    expandPath,
    isDomain,
    childItems,
    level,
    selectedId,
    setSelectedId,
    domains
}: {
    label: string
    id: string
    expandPath: string[] | null
    isDomain: boolean
    childItems: { [key: string]: apisLeftNav | operationsLeftNav } | null
    level: number
    selectedId?: string
    setSelectedId: React.Dispatch<React.SetStateAction<string | undefined>>
    domains: Domains
}) {
    const domainInfo = useGetDomainInfo(id, domains)

    // Initialize from expandPath to avoid first-render close/open flicker on refresh.
    const [isOpen, setIsOpen] = useState<boolean>(
        Boolean(expandPath && expandPath.includes(id) && childItems)
    )
    const isActive = selectedId === id
    const lightIcon = isDomain ? domainInfo.lightIcon : ''
    const darkIcon = isDomain ? domainInfo.darkIcon : ''
    const loading = isDomain ? domainInfo.loading : false

    const handleClick = () => {
        if (isOpen && (level === 0 || level === 1)) {
            setSelectedId(level === 0 ? undefined : expandPath?.[0])
        } else {
            setSelectedId(id)
        }
        if (childItems) setIsOpen(open => !open)
    }
    useEffect(() => {
        if (expandPath && expandPath.includes(id) && childItems) {
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expandPath, id, childItems])

    // Determine font weight and color based on level and path
    const getLevelWeight = () => {
        if (level === 0) return '600'
        if (level === 1) return '500'
        return '400'
    }

    const getLevelColor = () => {
        if (expandPath?.includes(id)) {
            return level === 0 ? '#00175a' : level === 1 ? '#00175a' : '#1a202c'
        }
        return level === 0 ? 'gray.600' : level === 1 ? 'gray.600' : 'gray.700'
    }

    const getLevelDarkColor = () => {
        if (expandPath?.includes(id)) {
            return '#ffffff'
        }
        return level === 0 ? '#c8c9c7' : level === 1 ? '#c8c9c7' : '#a8aaa8'
    }

    return (
        <>
            <Box
                flex='1'
                textAlign='left'
                color={getLevelColor()}
                _dark={{
                    color: getLevelDarkColor(),
                    bg:
                        isActive && level === 2
                            ? 'rgb(26 136 233)'
                            : 'transparent'
                }}
                fontWeight={getLevelWeight()}
                onClick={handleClick}
                className={styles.apiDocsFontSize}
                bg={isActive && level === 2 ? '#dbeafe' : 'transparent'}
                _hover={{
                    cursor: 'pointer',
                    color: '#006fcf',
                    bg: '#e0f2fe'
                }}
                aria-level={level + 1}
                id={`left-nav-item-${id}`}
            >
                <HStack gap={0} py={0.5}>
                    {isDomain ? (
                        <SkeletonCircle loading={loading} p={0}>
                            <Box
                                height={'36px'}
                                display={'flex'}
                                alignItems='center'
                                px={2}
                            >
                                <Image
                                    alt={` ${label} Logo`}
                                    className='image-light'
                                    width={4}
                                    height={4}
                                    src={`data:image/png;base64, ${lightIcon}`}
                                />
                                <Image
                                    alt={` ${label} Logo`}
                                    className='image-dark'
                                    width={4}
                                    height={4}
                                    src={`data:image/png;base64, ${darkIcon}`}
                                />
                            </Box>
                        </SkeletonCircle>
                    ) : (
                        <Box
                            width={'auto'}
                            height={'30px'}
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                            position='relative'
                            pl={level === 1 ? '4' : '2'}
                        />
                    )}
                    {level === 1 ? (
                        <Text pl='1' rounded='xl'>
                            {label}
                        </Text>
                    ) : level === 2 ? (
                        <Text pl='2' rounded='xl'>
                            {label}
                        </Text>
                    ) : (
                        <Text>{label}</Text>
                    )}
                    {childItems && (
                        <Box as={'span'} ml='auto'>
                            {isOpen ? (
                                <IconChevronDown />
                            ) : (
                                <IconChevronRight />
                            )}
                        </Box>
                    )}
                </HStack>
            </Box>
            {childItems && (
                <Box
                    pl={6}
                    maxH={isOpen ? '1000px' : '0px'}
                    opacity={isOpen ? 1 : 0}
                    transform={isOpen ? 'translateY(0)' : 'translateY(-4px)'}
                    overflow='hidden'
                    pointerEvents={isOpen ? 'auto' : 'none'}
                    aria-hidden={!isOpen}
                    transition='max-height 300ms ease, opacity 220ms ease, transform 220ms ease'
                >
                    <LeftNavItems
                        items={childItems}
                        level={level + 1}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        expandPath={expandPath}
                        domains={domains}
                    />
                </Box>
            )}
        </>
    )
}
