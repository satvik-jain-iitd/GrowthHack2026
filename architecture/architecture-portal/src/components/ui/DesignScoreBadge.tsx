/* istanbul ignore file */
import { Text, Link } from '@chakra-ui/react'
import { Tooltip } from './Tooltip'

export function DesignScoreBadge({
    score,
    href,
    onClick,
    tooltip
}: {
    score?: string | number | null
    href?: string
    onClick?: () => void
    tooltip?: string
}) {
    const numericScore = Number(score)
    if (!score || !Number.isFinite(numericScore)) return <>{'--'}</>

    const badge = (
        <Text
            as={onClick ? 'button' : 'span'}
            onClick={onClick}
            style={{
                display: 'inline-block',
                height: 32,
                width: 32,
                textAlign: 'center',
                lineHeight: '32px',
                verticalAlign: 'middle',
                borderRadius: 8,
                fontWeight: 600,
                color: '#fff',
                cursor: 'pointer',
                background:
                    numericScore > 85
                        ? '#38A169'
                        : numericScore > 75
                          ? '#68D391'
                          : '#e3660d'
            }}
        >
            {score}
        </Text>
    )

    const trigger = href ? (
        /* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */
        <Link href={href} style={{ textDecoration: 'none' }} target='_blank'>
            {badge}
        </Link>
    ) : (
        badge
    )

    if (!tooltip) return trigger

    return (
        <Tooltip content={tooltip} showArrow>
            {trigger}
        </Tooltip>
    )
}
