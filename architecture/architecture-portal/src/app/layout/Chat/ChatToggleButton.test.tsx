import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import ChatToggleButton from './ChatToggleButton'

describe('ChatToggleButton', () => {
    it('reflects isOpen=true via aria-expanded', () => {
        render(
            <ChatToggleButton iconSrc='/icon.svg' isOpen onToggle={jest.fn()} />
        )

        expect(screen.getByRole('button')).toHaveAttribute(
            'aria-expanded',
            'true'
        )
    })

    it('reflects isOpen=false via aria-expanded', () => {
        render(
            <ChatToggleButton
                iconSrc='/icon.svg'
                isOpen={false}
                onToggle={jest.fn()}
            />
        )

        expect(screen.getByRole('button')).toHaveAttribute(
            'aria-expanded',
            'false'
        )
    })

    it('calls onToggle when clicked', () => {
        const onToggle = jest.fn()
        render(
            <ChatToggleButton
                iconSrc='/icon.svg'
                isOpen={false}
                onToggle={onToggle}
            />
        )

        fireEvent.click(screen.getByRole('button'))
        expect(onToggle).toHaveBeenCalledTimes(1)
    })
})
