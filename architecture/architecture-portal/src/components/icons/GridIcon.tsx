import React, { SVGProps } from 'react'

export const GridIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg
            {...props}
            width='32'
            height='32'
            viewBox='0 0 32 32'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <g clipPath='url(#clip0_76_4252)'>
                <path
                    d='M0.458984 0.25V9.53H9.73898V0.25H0.458984ZM11.739 0.25V9.53H21.019V0.25H11.739ZM23.019 0.25V9.53H32.459V0.25H23.019ZM0.458984 11.53V20.81H9.73898V11.53H0.458984ZM11.739 11.53V20.81H21.019V11.53H11.739ZM23.019 11.53V20.81H32.459V11.53H23.019ZM0.458984 22.81V32.25H9.73898V22.81H0.458984ZM11.739 22.81V32.25H21.019V22.81H11.739ZM23.019 22.81V32.25H32.459V22.81H23.019Z'
                    fill='currentColor'
                />
            </g>
            <defs>
                <clipPath id='clip0_76_4252'>
                    <rect
                        width='32'
                        height='32'
                        fill='white'
                        transform='translate(0.458984 0.25)'
                    />
                </clipPath>
            </defs>
        </svg>
    )
}
