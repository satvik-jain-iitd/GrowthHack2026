import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import ChatHeader from './ChatHeader'

describe('ChatHeader', () => {
    it('shows the expand affordance when not expanded', () => {
        render(
            <ChatHeader
                iconSrc='/icon.svg'
                isExpanded={false}
                onToggleExpand={jest.fn()}
                onClose={jest.fn()}
            />
        )

        expect(
            screen.getByRole('button', { name: 'Expand chat' })
        ).toBeInTheDocument()
    })

    it('shows the collapse affordance when expanded', () => {
        render(
            <ChatHeader
                iconSrc='/icon.svg'
                isExpanded
                onToggleExpand={jest.fn()}
                onClose={jest.fn()}
            />
        )

        expect(
            screen.getByRole('button', { name: 'Exit full screen chat' })
        ).toBeInTheDocument()
    })

    it('calls onToggleExpand when the expand/collapse button is clicked', () => {
        const onToggleExpand = jest.fn()
        render(
            <ChatHeader
                iconSrc='/icon.svg'
                isExpanded={false}
                onToggleExpand={onToggleExpand}
                onClose={jest.fn()}
            />
        )

        fireEvent.click(screen.getByRole('button', { name: 'Expand chat' }))
        expect(onToggleExpand).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when the close button is clicked', () => {
        const onClose = jest.fn()
        render(
            <ChatHeader
                iconSrc='/icon.svg'
                isExpanded={false}
                onToggleExpand={jest.fn()}
                onClose={onClose}
            />
        )

        fireEvent.click(screen.getByRole('button', { name: 'Close chat' }))
        expect(onClose).toHaveBeenCalledTimes(1)
    })
})
