/* istanbul ignore file */
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { visit } from 'unist-util-visit'
import { posix as pathPosix } from 'path'
import { fetchArchitecture, Logger } from '@/utils/server'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

const MD_EXT_RE = /\.mdx?$|\.md$/i

/**
 * Rewrite markdown link nodes whose target ends with .md or .mdx to /docs/{uuid}.
 *
 * - Matches targets that start with ./, ../, /, or no leading slash.
 * - Preserves #fragments.
 * - Leaves non-.md/.mdx links untouched.
 * - If resolveBatch returns null for a path, leaves the original link unchanged.
 *
 * @param md raw markdown
 * @param playbookId playbook identifier
 * @param filePath path of current file in playbook repo e.g. "docs/guides/foo.md"
 */
export async function rewriteLinks(
    md?: string,
    playbookId?: string,
    filePath?: string
): Promise<string | undefined> {
    try {
        // parse into AST
        if (!md || !filePath) return md
        const tree = unified().use(remarkParse).parse(md)

        // collect unique targetPaths -> { nodes, fragment }
        const candidates = new Map<
            string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { nodes: any[]; fragment?: string }
        >()
        const baseDir = pathPosix.dirname(filePath)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        visit(tree, 'link', (node: any) => {
            const url: string = node.url || ''
            if (!url) return

            // split fragment off
            const [rawPath, rawFrag] = decodeURIComponent(url).split('#', 2)
            if (!rawPath) return

            // only consider links that end with .md or .mdx (case-insensitive)
            if (!MD_EXT_RE.test(rawPath)) return

            let resolvedPath: string
            if (rawPath.startsWith('/')) {
                // root-absolute within repo -> treat as repo-root path (strip leading '/')
                resolvedPath = pathPosix.normalize(rawPath.replace(/^\/+/, ''))
            } else {
                // relative (./, ../, or no prefix) -> resolve against current file dir
                resolvedPath = pathPosix.normalize(
                    pathPosix.join(baseDir, rawPath)
                )
            }

            // guard: don't allow paths that try to escape repo root (starting with '..' after normalization)
            if (resolvedPath.startsWith('..')) {
                return
            }

            const frag = rawFrag ? `#${rawFrag}` : ''
            const existing = candidates.get(resolvedPath)
            if (existing) {
                existing.nodes.push(node)
            } else {
                candidates.set(resolvedPath, { nodes: [node], fragment: frag })
            }
        })

        if (candidates.size === 0) {
            return md
        }

        // Batch resolve all candidate paths in ONE call
        const paths = Array.from(candidates.keys())
        const mapping: Record<string, string> = await fetchArchitecture(
            API_ENDPOINTS.GET_PLAYBOOK_FILES(playbookId!),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paths })
            }
        )
            .then(res => res.json())
            .then(res => res.data)

        // mutate nodes in-place only when mapping has a uuid; otherwise leave original url intact
        for (const p of paths) {
            const uuid = mapping[p]
            const meta = candidates.get(p)
            if (!meta) continue
            for (const node of meta.nodes) {
                if (uuid) {
                    node.url = `/docs/${uuid}${meta.fragment || ''}`
                } else {
                    // Leave node.url unchanged when uuid not found
                }
            }
        }

        // stringify back to markdown
        return unified().use(remarkStringify).stringify(tree)
    } catch (error) {
        Logger.error(error)
        return md
    }
}
