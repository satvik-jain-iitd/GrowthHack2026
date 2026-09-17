/* istanbul ignore file */
/*
 * remark-directives-to-html
 * -------------------------------------
 * Converts `remark-directive` syntax (e.g. :::note, ::youtube, :badge[])
 * into raw HTML nodes so Markdown renderers like `react-markdown` + `rehype-raw`
 * can interpret and render them as real HTML / custom elements.
 *
 * ✅ What this plugin does:
 *  - Parses directive nodes created by `remark-directive`:
 *      • containerDirective  →  <admonition type="note" title="...">...</admonition>
 *      • leafDirective       →  <youtube id="..." />
 *      • textDirective       →  inline <Badge>...</Badge> etc.
 *  - Serializes directive attributes into HTML attributes.
 *  - Escapes HTML safely.
 *  - Keeps directive children (Markdown content) intact.
 *
 * ⚙️ Use this when:
 *  - You render Markdown through `react-markdown` or a similar pipeline
 *    that uses rehype to transform raw HTML into React elements.
 *  - You include `rehype-raw` (and optionally `rehype-sanitize`)
 *    so your custom tags become live React elements.
 *
 * ❌ Do NOT use this with MDX (`@next/mdx`, `next-mdx-remote`, or @mdx-js/mdx`);
 *    use `remark-directives-to-mdx` instead — that version emits real MDX JSX AST nodes.
 *
 * Example:
 *   :::note{title="Heads up"}
 *   Some content here
 *   :::
 *   → <admonition type="note" title="Heads up">Some content here</admonition>
 */

/* eslint-disable @typescript-eslint/no-require-imports */
let visit = require('unist-util-visit')
if (visit && typeof visit !== 'function') {
    visit = visit.default || visit.visit || visit
}

function escapeHtml(s = '') {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

/**
 * Helper: convert attributes object -> attr string
 */
function attrsToString(attrs = {}) {
    return Object.entries(attrs)
        .map(([k, v]) => `${k}="${escapeHtml(String(v))}"`)
        .join(' ')
}

/**
 * Plugin: convert directive AST nodes into html nodes (strings)
 */
module.exports = function remarkDirectivesToHtml() {
    return tree => {
        // containerDirective (:::name Title\n ... \n:::)
        visit(tree, 'containerDirective', (node, index, parent) => {
            if (!parent || typeof index !== 'number') return

            const name = String(node.name || 'div')
            // wrapper tag: use 'admonition' for known admonitions for clarity, otherwise use name
            const wrapper = [
                'note',
                'info',
                'tip',
                'caution',
                'warning',
                'danger',
                'important',
                'success'
            ].includes(name.toLowerCase())
                ? 'admonition'
                : name

            // attrs from node.attributes
            const attrs = Object.assign({}, node.attributes || {})

            // Title heuristics:
            // 1) prefer node.label (remark-directive may set this when syntax is ":::name Title")
            // 2) fallback: if first child is a paragraph with single text node -> treat as title and remove it
            if (!('title' in attrs)) {
                if (node.label) {
                    attrs.title = String(node.label)
                } else if (
                    Array.isArray(node.children) &&
                    node.children[0] &&
                    node.children[0].type === 'paragraph'
                ) {
                    const firstPara = node.children[0]
                    const isSingleText =
                        Array.isArray(firstPara.children) &&
                        firstPara.children.length === 1 &&
                        firstPara.children[0].type === 'text'
                    if (isSingleText) {
                        attrs.title = String(firstPara.children[0].value || '')
                        // remove the first paragraph child from the children so it doesn't duplicate
                        node.children = node.children.slice(1)
                    }
                }
            }

            // Add a type attribute so consumers know the original directive name
            const attrCopy = Object.assign({}, attrs)
            attrCopy.type = name

            const open = {
                type: 'html',
                value: `<${wrapper} ${attrsToString(attrCopy)}>`
            }
            const close = { type: 'html', value: `</${wrapper}>` }

            // Replace the directive node in the parent's children with opening + original children + closing
            const children = node.children || []
            parent.children.splice(index, 1, open, ...children, close)
        })

        // leafDirective (self-closing) ::name[label]{...}
        visit(tree, 'leafDirective', (node, index, parent) => {
            if (!parent || typeof index !== 'number') return

            const name = String(node.name || 'div')
            const attrs = Object.assign({}, node.attributes || {})

            // if label present, and no title attr, add it as title
            if (node.label && !('title' in attrs))
                attrs.title = String(node.label)

            const attrStr = attrsToString(attrs)
            parent.children.splice(index, 1, {
                type: 'html',
                value: `<${name} ${attrStr} />`
            })
        })

        // textDirective (inline) :name[Label]{...}
        visit(tree, 'textDirective', (node, index, parent) => {
            if (!parent || typeof index !== 'number') return

            const name = String(node.name || 'span')
            const attrs = Object.assign({}, node.attributes || {})
            const inner = (node.children || []).map(c => c.value || '').join('')
            const attrStr = attrsToString(attrs)
            parent.children.splice(index, 1, {
                type: 'html',
                value: `<${name} ${attrStr}>${escapeHtml(inner)}</${name}>`
            })
        })
    }
}
