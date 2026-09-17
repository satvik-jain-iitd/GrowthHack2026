/* istanbul ignore file */

import React, { useMemo, useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { Domains, domainsLeftNav } from '@/app/api-docs/types/apiDocs'
import LeftNavItems from './LeftNavItems'
import { findPathToId } from '@/app/api-docs/utils'
import { APIDOCS_LEFT_NAV_WIDTH } from '@/constants/'

const isElementVisibleInViewport = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight
    const viewportWidth =
        window.innerWidth || document.documentElement.clientWidth

    return (
        rect.bottom > 0 &&
        rect.top < viewportHeight &&
        rect.right > 0 &&
        rect.left < viewportWidth
    )
}

export default function LeftNav({
    data,
    selectedId,
    domains,
    setSelectedId,
    navNonce = 0
}: {
    data: { [key: string]: domainsLeftNav }
    selectedId?: string
    domains: Domains
    setSelectedId: React.Dispatch<React.SetStateAction<string | undefined>>
    navNonce?: number
}) {
    useEffect(() => {
        if (selectedId) {
            const element = document.getElementById(selectedId)
            const leftNavElement = document.getElementById(
                'left-nav-item-' + selectedId
            )
            if (element) {
                if (!isElementVisibleInViewport(element)) {
                    element.scrollIntoView({
                        block: 'start',
                        behavior: 'instant'
                    })
                }
                // replaceState instead of hash assignment so the Back button
                // does not walk through every jump; the synthetic event keeps
                // useHash consumers in sync.
                window.history.replaceState(null, '', `#${selectedId}`)
                window.dispatchEvent(new Event('hashchange'))
                setTimeout(() => {
                    // Needs timeout so the height of the element is calculated correctly before scrolling to it
                    if (
                        leftNavElement &&
                        !isElementVisibleInViewport(leftNavElement)
                    ) {
                        leftNavElement.scrollIntoView({
                            block: 'start',
                            behavior: 'smooth'
                        })
                    }
                }, 100)
            }
        }
    }, [selectedId, navNonce])

    const expandPath = useMemo(() => {
        return selectedId ? findPathToId(selectedId, data) : []
    }, [selectedId, data])

    return (
        <Box
            w='100%'
            maxW={APIDOCS_LEFT_NAV_WIDTH}
            borderRight='1px'
            borderColor='gray.200'
            p={2}
            overflowY='auto'
            height='80vh'
        >
            <LeftNavItems
                items={data}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                expandPath={expandPath}
                domains={domains}
            />
        </Box>
    )
}
