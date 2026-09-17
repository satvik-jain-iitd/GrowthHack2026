import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import MetricProgressCell from './MetricProgressCell'
import {
    PROGRESS_THRESHOLD_COLORS,
    PROGRESS_ZERO_BORDER_COLOR
} from '../constants'

const [CRITICAL, POOR, FAIR, GOOD, EXCELLENT] = PROGRESS_THRESHOLD_COLORS.map(
    t => t.color
)

const hexToRgb = (hex: string) => {
    const [, r, g, b] = /^#(..)(..)(..)$/.exec(hex) as RegExpExecArray
    return `rgb(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)})`
}

const rangeColor = () =>
    getComputedStyle(
        screen
            .getByTestId('progress-cell')
            .querySelector('[data-part="range"]')!
    ).background

const trackOutline = () =>
    getComputedStyle(
        screen
            .getByTestId('progress-cell')
            .querySelector('[data-part="track"]')!
    ).outline

describe('MetricProgressCell', () => {
    it.each([
        [0, CRITICAL],
        [20, CRITICAL],
        [21, POOR],
        [40, POOR],
        [41, FAIR],
        [60, FAIR],
        [61, GOOD],
        [80, GOOD],
        [81, EXCELLENT],
        [100, EXCELLENT]
    ])('colours %i%% with the matching threshold', (value, expected) => {
        render(<MetricProgressCell value={value} />)
        expect(rangeColor()).toContain(hexToRgb(expected))
    })

    it('outlines the bar in red when there are identified APIs but no progress', () => {
        render(<MetricProgressCell value={0} numerator={0} denominator={12} />)
        expect(trackOutline()).toContain(PROGRESS_ZERO_BORDER_COLOR)
    })

    it.each([
        ['there are no identified APIs', 0, 0],
        ['there is some progress', 25, 12]
    ])('leaves the bar unoutlined when %s', (_case, value, denominator) => {
        render(
            <MetricProgressCell
                value={value}
                numerator={0}
                denominator={denominator}
            />
        )
        expect(trackOutline()).not.toContain(
            hexToRgb(PROGRESS_ZERO_BORDER_COLOR)
        )
    })

    it.each([
        [-10, '0.00%'],
        [150, '100.00%'],
        ['not a number', '0.00%'],
        [undefined, '0.00%'],
        [null, '0.00%']
    ])('clamps %p to %s', (value, expected) => {
        render(<MetricProgressCell value={value} />)
        expect(screen.getByText(expected)).toBeInTheDocument()
    })

    it('formats to two decimal places', () => {
        render(<MetricProgressCell value={66.666} />)
        expect(screen.getByText('66.67%')).toBeInTheDocument()
    })

    it('accepts a numeric string', () => {
        render(<MetricProgressCell value='42.5' />)
        expect(screen.getByText('42.50%')).toBeInTheDocument()
    })

    it('exposes the percentage as an aria-label', () => {
        render(<MetricProgressCell value={25} />)
        expect(screen.getByLabelText('25.00%')).toBeInTheDocument()
    })

    it('defaults a missing numerator and denominator to zero', () => {
        render(<MetricProgressCell value={0} />)
        expect(screen.getByTestId('progress-cell')).toBeInTheDocument()
    })
})
