import { IconGlobal } from '@americanexpress/dls-icons'
import { CDAAS_URL } from '@/constants'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { components } from 'react-select'

const SafeFlag = ({ code, alt }: { code: string; alt: string }) => {
    const [hasError, setHasError] = useState(false)

    const flagImg = useMemo(() => {
        if (!code || hasError) return null

        if (code === 'GLOBAL') {
            return (
                <IconGlobal
                    title='Global icon'
                    titleId='global-icon-id'
                    className='icon-blue-color'
                />
            )
        }

        return (
            <Image
                width={20}
                height={15}
                src={`${CDAAS_URL}/enterprise-architecture/flags/${code.toLowerCase()}.png`}
                alt={alt}
                onError={() => setHasError(true)}
                style={{
                    borderRadius: '2px',
                    objectFit: 'cover'
                }}
                unoptimized
            />
        )
    }, [alt, code, hasError])

    return flagImg
}

export const formatOptionLabel = ({
    label,
    code
}: {
    label: string
    code: string
}) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <SafeFlag code={code} alt={label} />
        <span>{label}</span>
    </div>
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomMultiValueLabel = (props: any) => {
    const { data } = props

    return (
        <components.MultiValueLabel {...props}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}
            >
                <SafeFlag code={data.code || data.value} alt={data.label} />
                <span>{data.label}</span>
            </div>
        </components.MultiValueLabel>
    )
}
