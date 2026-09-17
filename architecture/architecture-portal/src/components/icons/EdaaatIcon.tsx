import React, { SVGProps } from 'react'
import styles from '../../app/resources/edaaat/edaaat.module.css'

export default function EdaaatIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width={props.width || '75'}
            height={props.height || '75'}
            viewBox='0 0 512 512'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
        >
            <rect
                width='512'
                height='512'
                rx='50'
                fill='#00175a'
                stroke='#fff'
                strokeWidth='20'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <g
                fill='none'
                stroke='#fff'
                strokeWidth='20'
                strokeLinecap='round'
                strokeLinejoin='round'
            >
                <circle cx='150' cy='175' r='34' />
                <rect x='216' y='135' width='80' height='80' rx='10' />
                <circle cx='362' cy='175' r='34' />
                <rect x='204' y='270' width='104' height='62' rx='10' />
                <line x1='184' y1='175' x2='216' y2='175' />
                <line x1='296' y1='175' x2='328' y2='175' />
                <line x1='256' y1='215' x2='256' y2='270' />
            </g>
            <text
                x='50%'
                y='460'
                textAnchor='middle'
                fill='#fff'
                fontFamily='Segoe UI, Roboto, sans-serif'
                fontWeight='750'
                fontSize='100'
                className={styles.imageText}
            >
                EDAAAT
            </text>
        </svg>
    )
}
