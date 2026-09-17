/* istanbul ignore file */
'use client'
import { useState, useEffect } from 'react'

export function LoadingDots() {
    const [dots, setDots] = useState('.')

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDots(prevDots => {
                if (prevDots === '...') return '.'
                return prevDots + '.'
            })
        }, 500)

        return () => clearInterval(intervalId)
    }, [])

    return <span>{dots}</span>
}
