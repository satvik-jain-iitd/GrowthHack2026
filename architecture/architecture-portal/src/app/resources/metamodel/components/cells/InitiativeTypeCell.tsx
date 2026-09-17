'use client'

import { Badge, Text } from '@chakra-ui/react'

/** The type an initiative's `is_etp`/`is_ecmi` flags place it in. */
export type InitiativeTypeValue = 'None' | 'ETP' | 'ECMI'

export interface InitiativeTypeCellProps {
    isEtp: boolean | null | undefined
    isEcmi: boolean | null | undefined
}

/** Pill color per type, so ETPs and ECMIs stay distinguishable at a glance. */
export const INITIATIVE_TYPE_COLOR_PALETTES: Record<
    InitiativeTypeValue,
    string
> = {
    ECMI: 'purple',
    ETP: 'green',
    None: 'gray'
}

/**
 * Every ECMI is an ETP, so an initiative flagged as both is shown as the more
 * specific ECMI. Returns `undefined` while the flags are unknown.
 */
export function getInitiativeType(
    isEtp: boolean | null | undefined,
    isEcmi: boolean | null | undefined
): InitiativeTypeValue | undefined {
    if (isEcmi) return 'ECMI'
    if (isEtp) return 'ETP'
    if (isEtp === null || isEtp === undefined) return undefined
    return 'None'
}

/**
 * Read-only pill naming the initiative's type. Renders an em dash while the
 * flags are missing (e.g. the row has not been enriched yet).
 */
export function InitiativeTypeCell({ isEtp, isEcmi }: InitiativeTypeCellProps) {
    const type = getInitiativeType(isEtp, isEcmi)

    if (!type) {
        return (
            <Text as='span' fontSize='sm'>
                —
            </Text>
        )
    }

    return (
        <Badge
            colorPalette={INITIATIVE_TYPE_COLOR_PALETTES[type]}
            variant='subtle'
            borderRadius='full'
            px={2}
        >
            {type}
        </Badge>
    )
}
