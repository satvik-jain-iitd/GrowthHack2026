import React from 'react'

const toKebabCase = (str: string) =>
    str
        .replace(/^Icon/, '')
        .replace(
            /([A-Z])/g,
            (_, letter: string, offset: number) =>
                (offset > 0 ? '-' : '') + letter.toLowerCase()
        )

const componentCache: Record<
    string,
    React.FC<React.SVGProps<SVGSVGElement> & { color?: string }>
> = {}

const handler: ProxyHandler<Record<string, unknown>> = {
    get: (_, prop: string) => {
        if (prop === '__esModule') return true
        if (!componentCache[prop]) {
            const testId = `icon-${toKebabCase(prop)}`
            const Component = ({
                color,
                ...props
            }: React.SVGProps<SVGSVGElement> & { color?: string }) => (
                <svg
                    data-testid={testId}
                    {...(color ? { 'data-dls-icon-color': color } : {})}
                    {...props}
                />
            )
            Component.displayName = prop
            componentCache[prop] = Component
        }
        return componentCache[prop]
    }
}

module.exports = new Proxy({}, handler)
