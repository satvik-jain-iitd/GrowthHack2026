/* istanbul ignore file */
import React from 'react'
import styles from './Badges.module.css'

function Badge({ color, text }: { color: string; text: string }) {
    return (
        <span className={`${styles.badge} ${styles[color] || styles.default}`}>
            {text}
        </span>
    )
}

export function BadgeMandate() {
    return <Badge color='success' text='mandate' />
}

export function BadgeAdopt() {
    return <Badge color='success' text='adopt' />
}

export function BadgeAssess() {
    return <Badge color='info' text='assess' />
}

export function BadgeTrial() {
    return <Badge color='info' text='trial' />
}

export function BadgeSupported() {
    return <Badge color='warn' text='supported' />
}

export function BadgeExit() {
    return <Badge color='danger' text='exit' />
}

export function BadgeHold() {
    return <Badge color='danger' text='hold' />
}
