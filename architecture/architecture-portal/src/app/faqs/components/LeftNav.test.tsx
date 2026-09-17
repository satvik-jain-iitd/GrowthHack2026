import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { LeftNav } from './LeftNav'
import { FAQ_TEST_IDS } from '@/app/faqs/test-ids'
import { mockLeftNavGroups } from '@/app/faqs/test-data'

describe('LeftNav', () => {
    it('renders nav root and group counts', () => {
        const mockOnSelectGroup = jest.fn()

        render(
            <LeftNav
                groups={mockLeftNavGroups}
                selectedGroup='general'
                onSelectGroup={mockOnSelectGroup}
            />
        )

        expect(screen.getByTestId(FAQ_TEST_IDS.leftNavRoot)).toBeInTheDocument()
        expect(
            screen.getByTestId(FAQ_TEST_IDS.leftNavCount('general'))
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(FAQ_TEST_IDS.leftNavCount('governance'))
        ).toBeInTheDocument()
    })

    it('calls onSelectGroup with clicked group id', () => {
        const mockOnSelectGroup = jest.fn()

        render(
            <LeftNav
                groups={mockLeftNavGroups}
                selectedGroup='general'
                onSelectGroup={mockOnSelectGroup}
            />
        )

        fireEvent.click(
            screen.getByTestId(FAQ_TEST_IDS.leftNavButton('governance'))
        )

        expect(mockOnSelectGroup).toHaveBeenCalledWith('governance')
    })
})
