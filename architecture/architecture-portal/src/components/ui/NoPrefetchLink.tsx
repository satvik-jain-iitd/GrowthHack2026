/* istanbul ignore file */
'use client'
import React, { MouseEvent } from 'react'
import Link, { LinkProps } from 'next/link'
import { useNavigationContext } from '@/context'

type NoPrefetchLinkProps = Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keyof LinkProps<any>
> &
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LinkProps<any> & {
        children?: React.ReactNode
    }

/**
 * NoPrefetchLink component
 * IMPORTANT: Use NoPrefetchLink for all internal navigation across the app.
 * This ensures navigation state is tracked and disables Next.js prefetching.
 * @param param0 - Props for the link component
 * @returns JSX.Element
 */
export function NoPrefetchLink({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    prefetch,
    target,
    onClick,
    ...rest
}: NoPrefetchLinkProps) {
    const { startNavigation } = useNavigationContext()

    function handleClick(e: MouseEvent<HTMLAnchorElement>) {
        // 1) Call user onClick first so they can preventDefault / stopPropagation etc.
        if (onClick) {
            onClick(e)
        }

        // If user prevented default, do NOT treat this as navigation
        if (e.defaultPrevented) return

        // 2) Ignore new-tab / special clicks
        // - non left-click (button !== 0)
        // - metaKey (cmd on Mac)
        // - ctrlKey, shiftKey, altKey (open in new tab/window)
        const isModifiedClick =
            e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
        if (isModifiedClick) return

        // 3) Ignore target="_blank" (or any non-self target)
        if (target && target !== '_self') return

        // 4) At this point, it's a "normal" left-click nav within the SPA
        if (typeof rest.href !== 'string') return
        startNavigation(rest.href)
    }

    return (
        <Link
            {...rest}
            target={target}
            prefetch={false}
            onClick={handleClick}
        />
    )
}
