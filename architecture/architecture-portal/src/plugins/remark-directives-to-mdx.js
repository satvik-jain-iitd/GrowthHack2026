/* istanbul ignore file */
/*
 * remark-directives-to-mdx
 * -------------------------------------
 * Converts `remark-directive` syntax (e.g. :::note, ::youtube, :badge[])
 * into proper MDX JSX AST nodes (`mdxJsxFlowElement`, `mdxJsxTextElement`)
 * so MDX compilers (Next.js MDX, @mdx-js/mdx, next-mdx-remote, etc.)
 * output actual JSX elements like <Admonition>, <Youtube>, or <Badge>.
 *
 * ✅ What this plugin does:
 *  - Parses directive nodes created by `remark-directive`:
 *      • containerDirective  →  <Admonition type="note" title="...">...</Admonition>
 *      • leafDirective       →  <Youtube id="..." />
 *      • textDirective       →  inline <Badge>...</Badge>
 *  - Converts attributes into MDX JSX attributes (typed as strings, numbers, or booleans).
 *  - Maps common admonition names (note, tip, warning, etc.) to a shared <Admonition> component
 *    with a `type` prop so they all render through the same React component.
 *  - Supports ":::note Title" and ":::note{title='Title'}" styles by extracting the title text.
 *
 * ⚙️ Use this when:
 *  - You render content through an **MDX pipeline**, such as:
 *      • Next.js built-in MDX (`@next/mdx` / `createMDX`)
 *      • `next-mdx-remote`
 *      • `@mdx-js/mdx` (manual compile)
 *  - You want directives to become real React components in JSX output.
 *
 * ❌ Do NOT use this with `react-markdown` + `rehype-raw` — that setup
 *    expects raw HTML strings instead of MDX JSX nodes. Use `remark-directives-to-html.js` for that.
 *
 * Example:
 *   :::note{title="Heads up"}
 *   Some content here
 *   :::
 *   → <Admonition type="note" title="Heads up">Some content here</Admonition>
 */

/* eslint-disable @typescript-eslint/no-require-imports */
let visit = require('unist-util-visit')
if (visit && typeof visit !== 'function') {
    visit = visit.default || visit.visit || visit
}

const ADMONITION_NAMES = new Set([
    'note',
    'info',
    'tip',
    'caution',
    'warning',
    'danger',
    'important',
    'success'
])

function capitalize(s = '') {
    return s ? s[0].toUpperCase() + s.slice(1) : s
}

function parseAttrValue(value) {
    if (value === null || value === undefined) return ''
    if (typeof value !== 'string') return String(value)
    const v = value.trim()
    if (v === 'true') return true
    if (v === 'false') return false
    if (!Number.isNaN(Number(v)) && v !== '') return Number(v)
    return v
}

function attrsObjToMdxAttrs(obj = {}) {
    return Object.entries(obj).map(([k, v]) => {
        const parsed = parseAttrValue(v)
        return {
            type: 'mdxJsxAttribute',
            name: k,
            value: typeof parsed === 'string' ? parsed : String(parsed)
        }
    })
}

module.exports = function remarkDirectivesToMdx() {
    return tree => {
        // TEXT DIRECTIVE: inline :name[label]{...}
        visit(tree, 'textDirective', (node, index, parent) => {
            if (!parent || typeof index !== 'number') return

            const nameRaw = String(node.name || 'span')
            const name = ADMONITION_NAMES.has(nameRaw.toLowerCase())
                ? 'Admonition'
                : capitalize(nameRaw)

            const innerText = (node.children || [])
                .map(c => c.value || '')
                .join('')
            const attrs = node.attributes || {}
            const mdxAttrs = attrsObjToMdxAttrs(attrs)

            if (ADMONITION_NAMES.has(nameRaw.toLowerCase())) {
                mdxAttrs.unshift({
                    type: 'mdxJsxAttribute',
                    name: 'type',
                    value: nameRaw.toLowerCase()
                })
            }

            const mdxNode = {
                type: 'mdxJsxTextElement',
                name,
                attributes: mdxAttrs,
                children: [{ type: 'text', value: innerText }],
                data: { _mdxExplicitJsx: true }
            }

            parent.children.splice(index, 1, mdxNode)
        })

        // LEAF DIRECTIVE: self-closing ::name[label]{...}
        visit(tree, 'leafDirective', (node, index, parent) => {
            if (!parent || typeof index !== 'number') return

            const nameRaw = String(node.name || 'div')
            const name = ADMONITION_NAMES.has(nameRaw.toLowerCase())
                ? 'Admonition'
                : capitalize(nameRaw)

            const attrs = node.attributes || {}
            const mdxAttrs = attrsObjToMdxAttrs(attrs)

            if (node.label && !mdxAttrs.some(a => a.name === 'title')) {
                mdxAttrs.push({
                    type: 'mdxJsxAttribute',
                    name: 'title',
                    value: String(node.label)
                })
            }

            if (ADMONITION_NAMES.has(nameRaw.toLowerCase())) {
                mdxAttrs.unshift({
                    type: 'mdxJsxAttribute',
                    name: 'type',
                    value: nameRaw.toLowerCase()
                })
            }

            const mdxNode = {
                type: 'mdxJsxFlowElement',
                name,
                attributes: mdxAttrs,
                children: [],
                data: { _mdxExplicitJsx: true }
            }

            parent.children.splice(index, 1, mdxNode)
        })

        // CONTAINER DIRECTIVE: block :::name Title or :::name{title=".."} children :::
        visit(tree, 'containerDirective', (node, index, parent) => {
            if (!parent || typeof index !== 'number') return

            const nameRaw = String(node.name || 'div')
            const name = ADMONITION_NAMES.has(nameRaw.toLowerCase())
                ? 'Admonition'
                : capitalize(nameRaw)

            const attrs = node.attributes || {}
            const mdxAttrs = attrsObjToMdxAttrs(attrs)

            if (!mdxAttrs.some(a => a.name === 'title')) {
                if (node.label) {
                    mdxAttrs.push({
                        type: 'mdxJsxAttribute',
                        name: 'title',
                        value: String(node.label)
                    })
                } else if (
                    Array.isArray(node.children) &&
                    node.children[0] &&
                    node.children[0].type === 'paragraph'
                ) {
                    const firstPara = node.children[0]
                    const singleTextChild =
                        firstPara.children &&
                        firstPara.children.length === 1 &&
                        firstPara.children[0].type === 'text'
                    if (singleTextChild) {
                        const titleText = firstPara.children[0].value
                        node.children = node.children.slice(1)
                        mdxAttrs.push({
                            type: 'mdxJsxAttribute',
                            name: 'title',
                            value: String(titleText)
                        })
                    }
                }
            }

            if (ADMONITION_NAMES.has(nameRaw.toLowerCase())) {
                mdxAttrs.unshift({
                    type: 'mdxJsxAttribute',
                    name: 'type',
                    value: nameRaw.toLowerCase()
                })
            }

            const mdxNode = {
                type: 'mdxJsxFlowElement',
                name,
                attributes: mdxAttrs,
                children: node.children || [],
                data: { _mdxExplicitJsx: true }
            }

            parent.children.splice(index, 1, mdxNode)
        })
    }
}
