import { NoPrefetchLink } from '@/components/ui'
import { Button, Link } from '@chakra-ui/react'
import Image from 'next/image'

interface SlackHelpButtonProps {
    href: string
    label: string
    iconSrc: string
    iconAlt: string
    iconWidth?: number
    iconHeight?: number
    target?: string
    rel?: string
}

export default function SlackHelpButton({
    href,
    label,
    iconSrc,
    iconAlt,
    iconWidth = 24,
    iconHeight = 24,
    target = '_blank',
    rel = 'noopener noreferrer'
}: SlackHelpButtonProps) {
    return (
        <>
            {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
            <Link
                data-testid='slack-help-btn'
                as={NoPrefetchLink}
                href={href}
                target={target}
                rel={rel}
            >
                <Button
                    colorPalette='blue'
                    variant='outline'
                    size='sm'
                    as='span'
                    display='inline-flex'
                >
                    <Image
                        src={iconSrc}
                        alt={iconAlt}
                        width={iconWidth}
                        height={iconHeight}
                        style={{ borderRadius: '4px' }}
                    />
                    {label}
                </Button>
            </Link>
        </>
    )
}
