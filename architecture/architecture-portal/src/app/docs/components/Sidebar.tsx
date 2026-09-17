/* istanbul ignore file */
'use client'
import * as React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
    Spinner,
    Box,
    Flex,
    IconButton,
    Collapsible,
    Skeleton,
    Text,
    List
} from '@chakra-ui/react'
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronDown
} from '@americanexpress/dls-icons'
import { SidebarContext, useNavbarContext } from '@/context'
import { SidebarItem as SidebarItemType } from '@/types/SidebarItem'
import { getSidebarKey } from '@/app/docs/utils/client'
import {
    NAVBAR_HEIGHT,
    FOOTER_HEIGHT,
    BVB_ONBOARDING_FORM_PLAYBOOK_ID
} from '@/constants'
import { useSidebar } from '@/app/docs/hooks'
import { NoPrefetchLink } from '@/components/ui'

const SIDEBAR_LEFT_PADDING = 8
const SIDEBAR_ITEM_LEFT_PADDING = 12
const SIDEBAR_ITEM_DROPDOWN_LEFT_PADDING = 2
const SIDEBAR_ITEM_DROPDOWN_LEFT_MARGIN = 13

function SidebarItem({
    item,
    padding = 0,
    initialScroll
}: {
    item: SidebarItemType
    padding?: number
    initialScroll: boolean
}) {
    const {
        name,
        path,
        href,
        type,
        playbook_id,
        playbook_type_id,
        expanded,
        isAdrs,
        children
    } = item

    const pathname = usePathname()
    const itemRef = React.useRef<HTMLLIElement>(null)
    const [open, setOpen] = React.useState(expanded)
    const [items, setItems] = React.useState<SidebarItemType[]>(children || [])
    const isActive = href && pathname === href
    const isDropdown =
        type !== 'file' && playbook_id !== BVB_ONBOARDING_FORM_PLAYBOOK_ID
    const isPrescriptiveAdr = !isDropdown && name.endsWith('Prescriptive ADR')
    const { isLoading, refetch } = useSidebar({
        path,
        playbook_id,
        playbook_type_id,
        isAdrs
    })

    React.useEffect(() => {
        if (isActive && itemRef.current && initialScroll) {
            itemRef.current.scrollIntoView({
                block: 'center',
                behavior: 'smooth'
            })
        }
    }, [isActive, initialScroll])

    const handleExpand = (e: React.MouseEvent) => {
        // stop propagation to prevent triggering navigation
        e.preventDefault()
        e.stopPropagation()
        // fetch children items if not already loaded
        if (!open && items.length === 0) {
            refetch().then(result => setItems(result.data ?? []))
        }

        // toggle dropdown
        setOpen(open => !open)
    }

    const handleClick = (e: React.MouseEvent) => {
        // exit if href exists (link will take care of navigation)
        if (!!href) return

        // if dropdown, expand/collapse on click
        if (isDropdown) {
            handleExpand(e)
        }
    }

    return (
        <>
            <List.Item
                ref={itemRef}
                bg={isActive ? 'bg.info' : undefined}
                pl={`${(isDropdown ? SIDEBAR_ITEM_DROPDOWN_LEFT_PADDING : SIDEBAR_ITEM_LEFT_PADDING) + padding}px`}
                py={1}
                display='flex'
                flexDirection='row'
                alignItems='center'
                cursor='pointer'
                onClick={handleClick}
                _hover={{
                    bg: {
                        base: 'bg.muted',
                        _dark: 'bg.emphasized'
                    }
                }}
                {...(href && {
                    href,
                    as: NoPrefetchLink
                })}
            >
                {isDropdown && (
                    <IconButton
                        borderRadius='50%'
                        variant='ghost'
                        size='xs'
                        boxSize='22px'
                        minW='22px'
                        height='22px'
                        mr='2px'
                        onClick={handleExpand}
                        _hover={{
                            bg: {
                                base: 'bg.emphasized',
                                _dark: 'bg.muted'
                            }
                        }}
                    >
                        {open ? (
                            <IconChevronDown size='xs' color='information' />
                        ) : (
                            <IconChevronRight size='xs' color='information' />
                        )}
                    </IconButton>
                )}
                {isPrescriptiveAdr && (
                    <Image
                        src='/perscribed_adr_icon.svg'
                        alt='Prescriptive ADR Icon'
                        width={12}
                        height={12}
                        style={{
                            marginRight: '0.5rem'
                        }}
                    />
                )}
                <Text
                    css={{
                        fontSize: 'sm',
                        fontWeight: isActive || expanded ? 'bold' : 'normal',
                        color: isActive
                            ? 'fg.info'
                            : expanded
                              ? { base: 'blue.900', _dark: 'fg.info' }
                              : 'fg'
                    }}
                >
                    {name}
                </Text>
            </List.Item>
            <Collapsible.Root
                lazyMount
                open={open}
                onOpenChange={details => setOpen(details.open)}
            >
                <Collapsible.Content>
                    <List.Root
                        borderLeft='1px solid'
                        borderColor='border.emphasized'
                        ml={`${SIDEBAR_ITEM_DROPDOWN_LEFT_MARGIN + padding}px`}
                    >
                        {isLoading && (
                            <List.Item
                                pl={`${SIDEBAR_ITEM_LEFT_PADDING}px`}
                                py={1}
                                display='flex'
                                flexDirection='row'
                                alignItems='center'
                            >
                                <Spinner size='xs' mr={2} />
                                <Text textStyle='sm' color='fg.muted'>
                                    Loading...
                                </Text>
                            </List.Item>
                        )}
                        {items.map(x => (
                            <SidebarItem
                                key={getSidebarKey(x)}
                                item={x}
                                initialScroll={initialScroll}
                            />
                        ))}
                    </List.Root>
                </Collapsible.Content>
            </Collapsible.Root>
        </>
    )
}

export default function Sidebar({
    open,
    width,
    collapsedWidth,
    toggleDrawer
}: {
    open: boolean
    width: number
    collapsedWidth: number
    toggleDrawer: () => void
}) {
    const { label } = useNavbarContext()
    const { sidebar } = React.useContext(SidebarContext)
    const safeSidebar = Array.isArray(sidebar) ? sidebar : []

    // Ref for the scrollable List
    const scrollKey = `sidebar-scroll-${label || 'default'}`
    const listRef = React.useRef<HTMLUListElement>(null)
    const [initialScroll, setInitialScroll] = React.useState(false)

    // Restore scroll position on mount
    React.useLayoutEffect(() => {
        const saved = sessionStorage.getItem(scrollKey)
        if (listRef.current && safeSidebar.length > 0) {
            if (saved) {
                listRef.current.scrollTop = parseInt(saved, 10)
                setInitialScroll(false)
            } else {
                setInitialScroll(true) // No saved scroll, so use smooth scroll for active item
            }
        }
    }, [safeSidebar.length, scrollKey])

    // Save scroll position on scroll
    React.useEffect(() => {
        const handleScroll = () => {
            if (listRef.current) {
                sessionStorage.setItem(
                    scrollKey,
                    listRef.current.scrollTop.toString()
                )
            }
        }
        const el = listRef.current
        if (el) el.addEventListener('scroll', handleScroll)
        return () => {
            if (el) el.removeEventListener('scroll', handleScroll)
        }
    }, [scrollKey])

    return (
        <Box
            as='nav'
            position='sticky'
            alignSelf='stretch'
            top='0px'
            bottom={FOOTER_HEIGHT}
            width={open ? `${width}px` : `${collapsedWidth}px`}
            minWidth={open ? `${width}px` : `${collapsedWidth}px`}
            flexShrink={0}
            boxSizing='border-box'
            transition='width 200ms ease'
            borderRight='1px solid'
            borderColor='bg.emphasized'
            zIndex={10}
            bg='bg.panel'
            display='flex'
            flexDirection='column'
            overflow='visible'
            minHeight={`calc(100vh - (${NAVBAR_HEIGHT} + ${FOOTER_HEIGHT}))`}
            maxHeight={`calc(100vh - ${NAVBAR_HEIGHT})`}
        >
            <Box px={open ? 3.5 : 0} py={2}>
                <Flex
                    align='center'
                    justify={open ? 'space-between' : 'center'}
                >
                    {open && (
                        <Text as='div' fontSize='sm' color='fg.muted'>
                            {label ?? <Skeleton height='16px' width='200px' />}
                        </Text>
                    )}
                    <IconButton
                        size='sm'
                        variant='ghost'
                        borderRadius='50%'
                        onClick={toggleDrawer}
                    >
                        {open ? (
                            <IconChevronLeft size='sm' color='information' />
                        ) : (
                            <IconChevronRight size='sm' color='information' />
                        )}
                    </IconButton>
                </Flex>
            </Box>
            {open && (
                <List.Root
                    ref={listRef}
                    margin={0}
                    padding={0}
                    paddingBottom={4}
                    flex='1 1 auto'
                    minWidth='0'
                    overflowY='auto'
                    WebkitOverflowScrolling='touch'
                >
                    {safeSidebar.map(x => (
                        <SidebarItem
                            key={getSidebarKey(x)}
                            item={x}
                            padding={SIDEBAR_LEFT_PADDING}
                            initialScroll={initialScroll}
                        />
                    ))}
                </List.Root>
            )}
        </Box>
    )
}
