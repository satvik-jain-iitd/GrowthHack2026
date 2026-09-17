import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { fetchGithub } from '@/utils/server'
import { SOURCE_HOST } from '@/constants'
import { formatSkillTitle } from '@/app/resources/skills/utils/formatSkillTitle'
import { SidebarItem } from '@/types/SidebarItem'
import { PrevNext } from '@/types/PrevNext'
import { getSkillsTableOfContents } from './getSkillsTableOfContents'
const REPO = 'amex-eng/architecture-portal-docs'
const BASE_PATH = 'docs/skills'
const BASE_ROUTE = 'resources/skills'
const BRANCH = 'main'
const ALLOWED_SKILL_LINK_PREFIXES = [
    'https://github.aexp.com/amex-eng/',
    'https://github.com/amex-eng/'
]
type GithubEntry = {
    name: string
    path: string
    type: 'file' | 'dir'
    url: string
}
type SkillFrontmatter = Record<string, unknown>
type RouteTreeNode = {
    children: Map<string, RouteTreeNode>
    route?: string
}
function sortSkillsEntries(entries: GithubEntry[]) {
    return entries.sort((a, b) => {
        const aRoute = pathToRoute(a.path)
        const bRoute = pathToRoute(b.path)
        const aNum = a.name.match(/^([0-9]+)/)
        const bNum = b.name.match(/^([0-9]+)/)
        if (aNum && bNum) return Number(aNum[1]) - Number(bNum[1])
        if (aNum) return -1
        if (bNum) return 1
        return aRoute.localeCompare(bRoute)
    })
}
function pathToRoute(path: string): string {
    const relativePath = path.replace(new RegExp(`^${BASE_PATH}/`), '')
    const withoutExtension = relativePath.replace(/\.(md|mdx)$/i, '')
    const segments = withoutExtension.split('/').filter(Boolean)
    const lastSegment = segments.at(-1)?.toLowerCase()
    // Treat index/readme/skill documents as the folder route.
    const routeSegments =
        lastSegment &&
        ['index', 'readme', 'skill'].includes(lastSegment) &&
        segments.length > 1
            ? segments.slice(0, -1)
            : segments
    return routeSegments
        .map(segment => segment.replace(/^[0-9]+-/, ''))
        .join('/')
}
function formatRouteTitle(route: string): string {
    return route
        .split('/')
        .filter(Boolean)
        .map(segment => formatSkillTitle(segment))
        .join(' / ')
}
function routeToHref(route: string): string {
    return `/${BASE_ROUTE}/${route
        .split('/')
        .filter(Boolean)
        .map(segment => encodeURIComponent(segment))
        .join('/')}`
}
function buildRouteMap(entries: GithubEntry[]): Record<string, string> {
    const routeMap: Record<string, string> = {}
    for (const entry of entries) {
        const route = pathToRoute(entry.path)
        if (!routeMap[route]) {
            routeMap[route] = entry.path
        }
    }
    return routeMap
}
function buildOrderedRoutes(entries: GithubEntry[]): string[] {
    const seen = new Set<string>()
    const routes: string[] = []
    for (const entry of entries) {
        const route = pathToRoute(entry.path)
        if (seen.has(route)) {
            continue
        }
        seen.add(route)
        routes.push(route)
    }
    return routes
}
function buildSkillsSidebar(
    routes: string[],
    currentRoute: string
): SidebarItem[] {
    const root: RouteTreeNode = { children: new Map() }
    for (const route of routes) {
        const segments = route.split('/').filter(Boolean)
        let node = root
        for (const segment of segments) {
            if (!node.children.has(segment)) {
                node.children.set(segment, { children: new Map() })
            }
            node = node.children.get(segment) as RouteTreeNode
        }
        node.route = route
    }
    const toItems = (
        node: RouteTreeNode,
        parentSegments: string[] = []
    ): SidebarItem[] => {
        const items: SidebarItem[] = []
        for (const [segment, child] of node.children) {
            const fullSegments = [...parentSegments, segment]
            const fullRoute = fullSegments.join('/')
            const hasChildren = child.children.size > 0
            const isCurrent = currentRoute === fullRoute
            const isAncestor = currentRoute.startsWith(`${fullRoute}/`)
            if (!hasChildren) {
                items.push({
                    type: 'file',
                    name: formatSkillTitle(segment),
                    href: routeToHref(fullRoute),
                    expanded: isCurrent
                })
                continue
            }
            items.push({
                type: 'folder',
                name: formatSkillTitle(segment),
                href: child.route ? routeToHref(fullRoute) : undefined,
                expanded: isCurrent || isAncestor,
                children: toItems(child, fullSegments)
            })
        }
        return items
    }
    return toItems(root)
}
async function fetchSkillsDirectory(path = BASE_PATH): Promise<GithubEntry[]> {
    const response = await fetchGithub(
        SOURCE_HOST.GHC,
        `/repos/${REPO}/contents/${path}?ref=${BRANCH}`
    )
    if (!response.ok) return []
    const entries: GithubEntry[] = await response.json()
    const fileEntries = entries.filter(
        e => e.type === 'file' && /\.(md|mdx)$/i.test(e.name)
    )
    const directoryEntries = entries.filter(e => e.type === 'dir')
    const nestedEntries = await Promise.all(
        directoryEntries.map(entry => fetchSkillsDirectory(entry.path))
    )
    return sortSkillsEntries(fileEntries.concat(nestedEntries.flat()))
}
async function readSkillsFile(filePath: string) {
    const response = await fetchGithub(
        SOURCE_HOST.GHC,
        `/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`
    )
    if (!response.ok) {
        throw new Error(
            `Failed to fetch skill document from GitHub: ${filePath} [${response.status}]`
        )
    }
    const fileData = await response.json()
    return Buffer.from(fileData.content, fileData.encoding).toString('utf8')
}
function getFrontmatterString(
    frontmatter: SkillFrontmatter,
    ...keys: string[]
): string | null {
    for (const key of keys) {
        const value = frontmatter[key]
        if (typeof value === 'string' && value.trim()) {
            return value.trim()
        }
    }
    return null
}
function normalizeSkillGithubUrl(url: string | null): string | null {
    if (!url) {
        return null
    }
    try {
        const parsedUrl = new URL(url)
        if (parsedUrl.protocol !== 'https:') {
            return null
        }
        const normalizedUrl = parsedUrl.toString()
        if (
            !ALLOWED_SKILL_LINK_PREFIXES.some(prefix =>
                normalizedUrl.startsWith(prefix)
            )
        ) {
            return null
        }
        return normalizedUrl
    } catch {
        return null
    }
}
function normalizeSkillStatus(status: string | null) {
    if (!status) {
        return null
    }
    return status.trim()
}
function extractSkillDocFields(frontmatter: SkillFrontmatter) {
    return {
        skillGithubUrl: normalizeSkillGithubUrl(
            getFrontmatterString(frontmatter, 'skillLink')
        ),
        status: normalizeSkillStatus(
            getFrontmatterString(frontmatter, 'status')
        )
    }
}
function extractFirstParagraph(markdown: string): string | null {
    const lines = markdown.split('\n')
    const overviewIdx = lines.findIndex(l =>
        /^##\s+skill\s+overview\s*$/i.test(l.trim())
    )
    const searchLines =
        overviewIdx !== -1 ? lines.slice(overviewIdx + 1) : lines
    for (const line of searchLines) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('#') && trimmed.length > 20) {
            const sentence = trimmed.match(/^([^.!?]+[.!?])/)
            return (sentence ? sentence[1] : trimmed)
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/`(.*?)`/g, '$1')
                .slice(0, 200)
        }
    }
    return null
}
export type SkillIndexEntry = {
    route: string
    description: string | null
    status: string | null
}
export async function getGithubSkillsIndex(): Promise<SkillIndexEntry[]> {
    const entries = await fetchSkillsDirectory()
    return Promise.all(
        entries.map(async entry => {
            const route = pathToRoute(entry.path)
            try {
                const fileContents = await readSkillsFile(entry.path)
                const { content, data } = matter(fileContents)
                const description =
                    getFrontmatterString(
                        data as SkillFrontmatter,
                        'description'
                    ) ?? extractFirstParagraph(content.trim())
                const status = normalizeSkillStatus(
                    getFrontmatterString(data as SkillFrontmatter, 'status')
                )
                return { route, description, status }
            } catch {
                return { route, description: null, status: null }
            }
        })
    )
}
export async function getGithubSkillsPaths(): Promise<Record<string, string>> {
    const entries = await fetchSkillsDirectory()
    return buildRouteMap(entries)
}
export async function getGithubSkillsMetadata(
    relativePath: string
): Promise<Metadata> {
    return {
        title: formatRouteTitle(relativePath)
    }
}
export async function getGithubSkillsDocument(relativePath: string) {
    const entries = await fetchSkillsDirectory()
    const routeMap = buildRouteMap(entries)
    const routes = buildOrderedRoutes(entries)
    const filePath = routeMap[relativePath]
    if (!filePath) notFound()
    const isMdx = filePath.endsWith('.mdx')
    const fileContents = await readSkillsFile(filePath)
    // Parse frontmatter
    const { content, data } = matter(fileContents)
    const frontmatter = data as SkillFrontmatter
    const { skillGithubUrl, status } = extractSkillDocFields(frontmatter)
    const markdown = content.trim()
    // Generate Table of Contents
    const { toc, headingToc } = getSkillsTableOfContents(markdown, isMdx)
    // Build sidebar from all skill files
    const sidebar = buildSkillsSidebar(routes, relativePath)
    // Breadcrumbs
    const breadcrumbs = [{ label: formatRouteTitle(relativePath) }]
    // Prev / Next
    const keys = routes
    const idx = keys.indexOf(relativePath)
    const prevNext: PrevNext = {
        previous:
            idx > 0
                ? {
                      label: formatRouteTitle(keys[idx - 1]),
                      href: routeToHref(keys[idx - 1])
                  }
                : undefined,
        next:
            idx !== -1 && idx < keys.length - 1
                ? {
                      label: formatRouteTitle(keys[idx + 1]),
                      href: routeToHref(keys[idx + 1])
                  }
                : undefined
    }
    return {
        isMdx,
        frontmatter,
        markdown,
        sidebar,
        toc,
        headingToc,
        breadcrumbs,
        prevNext,
        skillGithubUrl,
        status
    }
}
