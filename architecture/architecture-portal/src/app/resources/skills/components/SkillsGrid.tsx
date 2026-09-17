/* istanbul ignore file */
'use client'
import React, {
    memo,
    startTransition,
    useDeferredValue,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'
import { Box, Grid, HStack, Input, Text } from '@chakra-ui/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { NoPrefetchLink } from '@/components/ui'
import { IconSparkle } from '@americanexpress/dls-icons'
import { formatSkillTitle } from '@/app/resources/skills/utils/formatSkillTitle'
import type { SkillIndexEntry } from '@/app/resources/skills/utils/getGithubSkillsDocument'
const GRID_GAP_PX = 16
const CARD_HEIGHT_PX = 148
const ROW_HEIGHT_PX = CARD_HEIGHT_PX + GRID_GAP_PX
const MAX_VIEWPORT_HEIGHT_PX = 960
const MAX_COLUMNS = 4
const MIN_CARD_WIDTH_PX = 300
type SkillRoute = {
    route: string
    title: string
    searchValue: string
    description: string | null
    status: string | null
}
function routeToSkillHref(route: string): string {
    return `/resources/skills/${route
        .split('/')
        .filter(Boolean)
        .map(segment => encodeURIComponent(segment))
        .join('/')}`
}
function normalizeSearchValue(value: string) {
    return value
        .toLowerCase()
        .replace(/[-_/]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}
function getColumnCount(containerWidth: number) {
    if (containerWidth <= 0) {
        return 1
    }
    return Math.min(
        MAX_COLUMNS,
        Math.max(
            1,
            Math.floor(
                (containerWidth + GRID_GAP_PX) /
                    (MIN_CARD_WIDTH_PX + GRID_GAP_PX)
            )
        )
    )
}
const SkillCard = memo(function SkillCard({ skill }: { skill: SkillRoute }) {
    return (
        <NoPrefetchLink
            href={routeToSkillHref(skill.route)}
            style={{
                textDecoration: 'none',
                height: '100%'
            }}
        >
            <Box
                borderWidth='1.5px'
                borderColor={{ base: 'transparent', _dark: 'transparent' }}
                borderRadius='lg'
                p={5}
                height={`${CARD_HEIGHT_PX}px`}
                display='flex'
                flexDirection='column'
                gap={2}
                bg={{ base: 'white', _dark: 'bg.muted' }}
                boxShadow={{ base: 'md', _dark: 'none' }}
                transition='transform 0.3s, box-shadow 0.3s'
                _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl'
                }}
                cursor='pointer'
            >
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                    flexShrink={0}
                >
                    <Box
                        as='span'
                        display='inline-flex'
                        p={0}
                        m={0}
                        lineHeight='1'
                        fontSize='20px'
                    >
                        <IconSparkle color='information' />
                    </Box>
                    {skill.status && (
                        <Box
                            as='span'
                            display='inline-flex'
                            alignItems='center'
                            px={2}
                            py={0.5}
                            borderRadius='full'
                            fontSize='2xs'
                            lineHeight='1'
                            fontWeight='semibold'
                            bg={
                                skill.status.toLowerCase() === 'launched'
                                    ? 'green.700'
                                    : 'green.100'
                            }
                            color={
                                skill.status.toLowerCase() === 'launched'
                                    ? 'white'
                                    : 'green.800'
                            }
                            border='1px solid'
                            borderColor={
                                skill.status.toLowerCase() === 'launched'
                                    ? 'green.700'
                                    : 'green.300'
                            }
                        >
                            {skill.status}
                        </Box>
                    )}
                </Box>
                <Text
                    pt={1}
                    fontSize='sm'
                    fontWeight='700'
                    color={{ base: '#00175a', _dark: 'fg' }}
                    lineHeight='1.3'
                    title={skill.title}
                    style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden'
                    }}
                >
                    {skill.title}
                </Text>
                {skill.description && (
                    <Text
                        fontSize='xs'
                        color={{ base: '#5a6a7e', _dark: 'fg.subtle' }}
                        lineHeight='1.45'
                        mt={1}
                        style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden'
                        }}
                    >
                        {skill.description}
                    </Text>
                )}
            </Box>
        </NoPrefetchLink>
    )
})
const VirtualSkillCards = memo(function VirtualSkillCards({
    skills,
    query
}: {
    skills: SkillRoute[]
    query: string
}) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [columnCount, setColumnCount] = useState(1)
    const normalizedQuery = useMemo(() => normalizeSearchValue(query), [query])
    useEffect(() => {
        if (!containerRef.current) {
            return
        }
        const updateColumnCount = (nextWidth: number) => {
            const nextColumnCount = getColumnCount(nextWidth)
            setColumnCount(currentCount =>
                currentCount === nextColumnCount
                    ? currentCount
                    : nextColumnCount
            )
        }
        updateColumnCount(containerRef.current.clientWidth)
        if (typeof ResizeObserver === 'undefined') {
            return
        }
        const observer = new ResizeObserver(entries => {
            updateColumnCount(entries[0]?.contentRect.width ?? 0)
        })
        observer.observe(containerRef.current)
        return () => {
            observer.disconnect()
        }
    }, [])
    const filteredSkills = useMemo(() => {
        if (!normalizedQuery) {
            return skills
        }
        return skills.filter(skill =>
            skill.searchValue.includes(normalizedQuery)
        )
    }, [normalizedQuery, skills])
    const rowCount = Math.ceil(filteredSkills.length / columnCount)
    const viewportHeight = Math.min(
        MAX_VIEWPORT_HEIGHT_PX,
        Math.max(1, rowCount) * ROW_HEIGHT_PX
    )
    // eslint-disable-next-line react-hooks/incompatible-library
    const virtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => ROW_HEIGHT_PX,
        overscan: 6
    })
    return (
        <Box ref={containerRef}>
            {filteredSkills.length === 0 && (
                <Text color='fg.muted' fontSize='sm'>
                    No skills match &ldquo;{query}&rdquo;.
                </Text>
            )}
            {filteredSkills.length > 0 && (
                <Box
                    ref={scrollRef}
                    height={`${viewportHeight}px`}
                    overflowY={rowCount > 1 ? 'auto' : 'visible'}
                >
                    <Box
                        height={`${virtualizer.getTotalSize()}px`}
                        position='relative'
                    >
                        {virtualizer.getVirtualItems().map(virtualRow => {
                            const rowStartIndex = virtualRow.index * columnCount
                            const rowSkills = filteredSkills.slice(
                                rowStartIndex,
                                rowStartIndex + columnCount
                            )
                            return (
                                <Box
                                    key={virtualRow.key}
                                    position='absolute'
                                    top={0}
                                    left={0}
                                    width='100%'
                                    transform={`translateY(${virtualRow.start}px)`}
                                    pb={4}
                                >
                                    <Grid
                                        templateColumns={`repeat(${columnCount}, minmax(0, 1fr))`}
                                        gap={4}
                                    >
                                        {rowSkills.map(skill => (
                                            <SkillCard
                                                key={skill.route}
                                                skill={skill}
                                            />
                                        ))}
                                    </Grid>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
            )}
        </Box>
    )
})
export function SkillsGrid({ entries }: { entries: SkillIndexEntry[] }) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [debouncedQuery, setDebouncedQuery] = React.useState('')
    const skills = useMemo(() => {
        const folders = new Map<string, SkillIndexEntry>()
        const topLevelSkills: SkillRoute[] = []
        for (const entry of entries) {
            const segments = entry.route.split('/').filter(Boolean)
            const rootSegment = segments[0]
            if (!rootSegment) {
                continue
            }
            if (segments.length === 1) {
                topLevelSkills.push({
                    route: entry.route,
                    title: formatSkillTitle(entry.route),
                    description: entry.description,
                    status: entry.status,
                    searchValue: normalizeSearchValue(
                        `${entry.route} ${formatSkillTitle(entry.route)}`
                    )
                })
                continue
            }
            if (!folders.has(rootSegment)) {
                folders.set(rootSegment, entry)
            }
        }
        for (const [rootSegment, representative] of folders) {
            if (topLevelSkills.some(skill => skill.route === rootSegment)) {
                continue
            }
            const rootLevelEntry = entries.find(e => e.route === rootSegment)
            const linkRoute = rootLevelEntry?.route ?? representative.route
            const description =
                rootLevelEntry?.description ?? representative.description
            const status = rootLevelEntry?.status ?? representative.status
            const title = formatSkillTitle(rootSegment)
            topLevelSkills.push({
                route: linkRoute,
                title,
                description,
                status,
                searchValue: normalizeSearchValue(`${rootSegment} ${title}`)
            })
        }
        return topLevelSkills
    }, [entries])
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])
    function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
        const nextQuery = event.target.value
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            startTransition(() => {
                setDebouncedQuery(nextQuery)
            })
        }, 150)
    }
    const deferredQuery = useDeferredValue(debouncedQuery)
    return (
        <Box>
            <HStack
                justifyContent='space-between'
                alignItems={{ base: 'flex-start', md: 'center' }}
                flexDirection={{ base: 'column', md: 'row' }}
                gap={3}
                mb={8}
            >
                <Input
                    placeholder='Search skills…'
                    aria-label='Search skills'
                    onChange={handleInput}
                    maxW='sm'
                    size='md'
                    bg={{ base: 'white', _dark: 'bg.muted' }}
                    borderColor={{ base: '#d0dae8', _dark: 'border' }}
                    _focus={{ borderColor: '#006FCF', boxShadow: 'none' }}
                />
                <Box
                    as='span'
                    display='inline-flex'
                    alignItems='center'
                    gap={2}
                    bg='fg.info'
                    color='white'
                    border='2px solid transparent'
                    borderRadius='15px'
                    px={4}
                    py={2}
                    fontWeight='600'
                    lineHeight='1'
                    whiteSpace='nowrap'
                    _dark={{
                        bg: 'fg.info',
                        color: 'white',
                        borderColor: 'transparent'
                    }}
                >
                    <Text as='span' fontSize='md' fontWeight='700'>
                        {skills.length}
                    </Text>
                    <Text as='span' fontSize='sm'>
                        Skills available
                    </Text>
                </Box>
            </HStack>
            <VirtualSkillCards skills={skills} query={deferredQuery} />
        </Box>
    )
}
