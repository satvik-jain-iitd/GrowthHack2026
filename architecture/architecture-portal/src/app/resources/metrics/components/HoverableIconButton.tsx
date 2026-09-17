/* istanbul ignore file */
import { Button } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface HoverableIconButtonProps {
    href: string
    defaultIcon: string
    hoverIcon: string
    iconAlt: string
    label: string
    target?: string
    rel?: string
}

export default function HoverableIconButton({
    href,
    defaultIcon,
    hoverIcon,
    iconAlt,
    label,
    target,
    rel
}: HoverableIconButtonProps) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <Button
            variant='outline'
            size='sm'
            borderColor={'#006fcf'}
            _dark={{ borderColor: 'rgb(8,7,6)' }}
            _hover={{ borderColor: '#0056b3' }}
        >
            {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
            <Link
                href={href}
                target={target}
                rel={rel}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                <Image
                    src={isHovered ? hoverIcon : defaultIcon}
                    alt={iconAlt}
                    width={20}
                    height={20}
                />
                {label}
            </Link>
        </Button>
    )
}
