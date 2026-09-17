import { SVGProps } from 'react'

export const AICheckBoxIcon = ({
    width = 16,
    height = 16,
    ...props
}: SVGProps<SVGSVGElement>) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
        >
            <path
                d='M0 4C0 1.79086 1.79086 0 4 0H12C14.2091 0 16 1.79086 16 4V12C16 14.2091 14.2091 16 12 16H4C1.79086 16 0 14.2091 0 12V4Z'
                fill='#F3780D'
            />
            <path
                d='M5.18819 8.27581C5.0126 8.08558 4.71604 8.07372 4.52581 8.24931C4.33558 8.42491 4.32372 8.72147 4.49931 8.91169L6.74931 11.3492C6.92989 11.5448 7.23695 11.551 7.42521 11.3627L12.4877 6.30021C12.6708 6.11715 12.6708 5.82035 12.4877 5.63729C12.3047 5.45424 12.0079 5.45424 11.8248 5.63729L7.10728 10.3548L5.18819 8.27581Z'
                fill='#F4F4F4'
            />
        </svg>
    )
}
