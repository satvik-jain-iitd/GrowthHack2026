import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { ResponseBlock } from './ResponseBlock'

describe('ResponseBlock', () => {
    it('renders children inside the block', () => {
        render(
            <ResponseBlock>
                <p>Sample response content</p>
            </ResponseBlock>
        )
        expect(screen.getByText('Sample response content')).toBeInTheDocument()
    })

    it('renders multiple children', () => {
        render(
            <ResponseBlock>
                <p>First paragraph</p>
                <ul>
                    <li>List item</li>
                </ul>
            </ResponseBlock>
        )
        expect(screen.getByText('First paragraph')).toBeInTheDocument()
        expect(screen.getByText('List item')).toBeInTheDocument()
    })
})
