/* istanbul ignore file */
'use client'

import { Button, Flex, Text } from '@chakra-ui/react'

export interface PaginationControlsProps {
    pageIndex: number
    pageCount: number
    onPageChange: (pageIndex: number) => void
}

/** How many page buttons to show either side of the current page. */
const SIBLINGS = 1

type PageToken = number | 'gap-start' | 'gap-end'

/**
 * Page numbers to render: always the first and last page, plus a window
 * around the current page, with gaps collapsed into an ellipsis.
 */
export function getPageTokens(
    pageIndex: number,
    pageCount: number
): PageToken[] {
    if (pageCount <= 1) return [0]

    const pages = new Set<number>([0, pageCount - 1])
    for (let i = pageIndex - SIBLINGS; i <= pageIndex + SIBLINGS; i += 1) {
        if (i >= 0 && i < pageCount) pages.add(i)
    }

    const sorted = Array.from(pages).sort((a, b) => a - b)
    const tokens: PageToken[] = []
    sorted.forEach((page, index) => {
        const previous = sorted[index - 1]
        if (index > 0 && page - previous > 1) {
            tokens.push(page < pageIndex ? 'gap-start' : 'gap-end')
        }
        tokens.push(page)
    })
    return tokens
}

/** Previous / numbered pages / Next controls for a client-paginated table. */
export function PaginationControls({
    pageIndex,
    pageCount,
    onPageChange
}: PaginationControlsProps) {
    const tokens = getPageTokens(pageIndex, pageCount)

    return (
        <Flex align='center' justify='flex-end' gap={2} px={6} py={3}>
            <Button
                size='sm'
                variant='outline'
                onClick={() => onPageChange(pageIndex - 1)}
                disabled={pageIndex === 0}
            >
                Previous
            </Button>
            {tokens.map(token =>
                typeof token === 'number' ? (
                    <Button
                        key={token}
                        size='sm'
                        minW='36px'
                        variant={token === pageIndex ? 'solid' : 'outline'}
                        colorPalette={token === pageIndex ? 'blue' : undefined}
                        aria-current={token === pageIndex ? 'page' : undefined}
                        aria-label={`Page ${token + 1}`}
                        onClick={() => onPageChange(token)}
                    >
                        {token + 1}
                    </Button>
                ) : (
                    <Text key={token} fontSize='sm' color='fg.muted' px={1}>
                        …
                    </Text>
                )
            )}
            <Button
                size='sm'
                variant='outline'
                onClick={() => onPageChange(pageIndex + 1)}
                disabled={pageIndex >= pageCount - 1}
            >
                Next
            </Button>
        </Flex>
    )
}
