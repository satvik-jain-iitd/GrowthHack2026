/* istanbul ignore file */
'use strict'

/**
 * Rule: enforce-no-prefetch-link
 *
 * Errors on:
 * - any JSX <a ...>
 * - any JSX usage of components imported from:
 *    - next/link (default import or named Link)
 *    - @chakra-ui/react (named Link)
 * - Chakra Breadcrumb.Link when Breadcrumb is imported from @chakra-ui/react
 *
 * Allows:
 * - Using next/link inside the NoPrefetchLink implementation file (ignored by filename)
 * - Explicit opt-out via eslint-disable-next-line
 */

const DISALLOWED_SOURCES = new Set(['next/link', '@chakra-ui/react'])

function isIgnoredFile(filename) {
    // This prevents the rule from flagging our NoPrefetchLink.tsx implementation.
    return (
        typeof filename === 'string' &&
        (filename.endsWith('NoPrefetchLink.tsx') ||
            filename.includes('/NoPrefetchLink.tsx'))
    )
}

function getJSXName(node) {
    // <A> -> "A"
    // <Foo.Bar> -> "Foo.Bar"
    if (!node) return null

    if (node.type === 'JSXIdentifier') return node.name

    if (node.type === 'JSXMemberExpression') {
        const object = getJSXName(node.object)
        const property = getJSXName(node.property)
        if (!object || !property) return null
        return `${object}.${property}`
    }

    return null
}

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Enforce using NoPrefetchLink instead of <a>, next/link Link, Chakra Link, or Chakra Breadcrumb.Link.',
            recommended: false
        },
        schema: [],
        messages: {
            noAnchor:
                'Do not use native <a>. Use <NoPrefetchLink> instead (disable this rule inline only for rare exceptions).',
            noNextOrChakraLink:
                'Do not use {{component}} from {{source}}. Use <NoPrefetchLink> instead (disable this rule inline only for rare exceptions).',
            noBreadcrumbLink:
                'Do not use Breadcrumb.Link from @chakra-ui/react. Use <NoPrefetchLink> instead (disable this rule inline only for rare exceptions).'
        }
    },

    create(context) {
        const filename = context.getFilename()

        // Skip linting your NoPrefetchLink implementation file (so it can use next/link internally).
        if (isIgnoredFile(filename)) return {}

        // Track local identifiers bound to disallowed imports.
        // localName -> source
        const disallowedLocalNames = new Map()

        // Track Chakra Breadcrumb import local names:
        // import { Breadcrumb } from '@chakra-ui/react' -> record "Breadcrumb"
        // import { Breadcrumb as MyBreadcrumb } from '@chakra-ui/react' -> record "MyBreadcrumb"
        const chakraBreadcrumbLocalNames = new Set()

        function recordImport(localName, source) {
            if (!localName) return
            disallowedLocalNames.set(localName, source)
        }

        return {
            Program(programNode) {
                for (const stmt of programNode.body) {
                    if (stmt.type !== 'ImportDeclaration') continue

                    const source = stmt.source && stmt.source.value

                    // Track Chakra Breadcrumb import local name(s) (for <Breadcrumb.Link /> detection)
                    if (
                        typeof source === 'string' &&
                        source.startsWith('@chakra-ui/')
                    ) {
                        for (const spec of stmt.specifiers) {
                            if (
                                spec.type === 'ImportSpecifier' &&
                                spec.imported &&
                                spec.imported.name === 'Breadcrumb'
                            ) {
                                chakraBreadcrumbLocalNames.add(spec.local.name)
                            }
                        }
                    }

                    // Track disallowed sources for Link usage
                    if (!DISALLOWED_SOURCES.has(source)) continue

                    for (const spec of stmt.specifiers) {
                        // import Link from 'next/link'
                        if (spec.type === 'ImportDefaultSpecifier') {
                            recordImport(spec.local.name, source)
                        }

                        // import { Link } from '@chakra-ui/react'
                        // import { Link as ChakraLink } from '@chakra-ui/react'
                        if (spec.type === 'ImportSpecifier') {
                            const importedName =
                                spec.imported && spec.imported.name
                            const localName = spec.local && spec.local.name

                            // Only ban the Link export from these libraries.
                            if (importedName === 'Link') {
                                recordImport(localName, source)
                            }
                        }

                        // import * as NextLink from 'next/link'
                        // We'll record namespace too, and later catch <NextLink.*> usage.
                        if (spec.type === 'ImportNamespaceSpecifier') {
                            recordImport(spec.local.name, source)
                        }
                    }
                }
            },

            JSXOpeningElement(node) {
                const nameNode = node.name
                const jsxName = getJSXName(nameNode)

                // 1) Ban native <a>
                if (
                    nameNode.type === 'JSXIdentifier' &&
                    nameNode.name === 'a'
                ) {
                    context.report({
                        node,
                        messageId: 'noAnchor'
                    })
                    return
                }

                if (!jsxName) return

                // 2) Ban Chakra <Breadcrumb.Link ...> when Breadcrumb imported from @chakra-ui/react
                // Catches <Breadcrumb.Link> and <MyBreadcrumb.Link> (aliased Breadcrumb import)
                if (nameNode.type === 'JSXMemberExpression') {
                    const objectName = getJSXName(nameNode.object) // e.g. "Breadcrumb" / "MyBreadcrumb"
                    const propertyName = getJSXName(nameNode.property) // e.g. "Link"

                    if (
                        objectName &&
                        propertyName === 'Link' &&
                        chakraBreadcrumbLocalNames.has(objectName)
                    ) {
                        context.report({
                            node,
                            messageId: 'noBreadcrumbLink'
                        })
                        return
                    }
                }

                // 3) Ban next/link / chakra Link usage — but only if it’s actually imported from those sources
                // If <Foo.Bar>, check Foo (namespace) too
                const baseName = jsxName.split('.')[0]

                if (disallowedLocalNames.has(jsxName)) {
                    const source = disallowedLocalNames.get(jsxName)
                    context.report({
                        node,
                        messageId: 'noNextOrChakraLink',
                        data: { component: jsxName, source }
                    })
                    return
                }

                if (disallowedLocalNames.has(baseName)) {
                    const source = disallowedLocalNames.get(baseName)
                    context.report({
                        node,
                        messageId: 'noNextOrChakraLink',
                        data: { component: jsxName, source }
                    })
                }
            }
        }
    }
}
