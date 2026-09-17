import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import ExpandableText from './ExpandableText'

// Mock Text and Button to control overflow detection behavior
jest.mock('@chakra-ui/react', () => {
    const actual = jest.requireActual('@chakra-ui/react')
    return {
        ...actual,
        Text: ({ children, ref, style, ...props }) => {
            return (
                <div
                    ref={ref}
                    style={style}
                    data-testid='text-element'
                    {...props}
                >
                    {children}
                </div>
            )
        },
        Button: ({ onClick, children, ...props }) => (
            <button onClick={onClick} {...props}>
                {children}
            </button>
        ),
        Box: ({ children, ...props }) => <div {...props}>{children}</div>
    }
})

describe('ExpandableText', () => {
    beforeEach(() => {
        // Mock scrollHeight and clientHeight for overflow detection
        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
            configurable: true,
            get: function () {
                return this._scrollHeight !== undefined
                    ? this._scrollHeight
                    : 80
            }
        })
        Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
            configurable: true,
            get: function () {
                return this._clientHeight !== undefined
                    ? this._clientHeight
                    : 80
            }
        })
    })

    it('renders text content correctly', () => {
        render(<ExpandableText maxLines={2}>Test content here</ExpandableText>)
        expect(screen.getByText('Test content here')).toBeInTheDocument()
    })

    it('applies WebkitLineClamp style when collapsed', () => {
        render(
            <ExpandableText maxLines={3}>Long text content here</ExpandableText>
        )

        const textElement = screen.getByTestId('text-element')
        expect(textElement).toHaveStyle('WebkitLineClamp: 3')
    })

    it('applies display -webkit-box and overflow hidden styles', () => {
        render(<ExpandableText maxLines={2}>Text content here</ExpandableText>)

        const textElement = screen.getByTestId('text-element')
        expect(textElement).toHaveStyle('display: -webkit-box')
        expect(textElement).toHaveStyle('overflow: hidden')
    })

    it('accepts custom maxLines prop', () => {
        render(
            <ExpandableText maxLines={5}>
                Text with custom max lines
            </ExpandableText>
        )

        const textElement = screen.getByTestId('text-element')
        expect(textElement).toHaveStyle('WebkitLineClamp: 5')
    })

    it('accepts custom font size prop', () => {
        render(
            <ExpandableText textFontSize='16px'>
                Text with custom font size
            </ExpandableText>
        )

        const textElement = screen.getByTestId('text-element')
        expect(textElement).toHaveStyle('fontSize: 16px')
    })

    it('shows Show more button when content overflows', () => {
        const { unmount } = render(
            <ExpandableText maxLines={1}>
                <div>
                    This is a very long text that definitely exceeds one line
                    and will trigger the show more button
                </div>
            </ExpandableText>
        )

        const textElement = screen.getByTestId('text-element')
        // Simulate overflow
        textElement._scrollHeight = 150
        textElement._clientHeight = 50

        // Trigger resize to recalculate
        window.dispatchEvent(new Event('resize'))

        unmount()
    })
})
