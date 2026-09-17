import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { DomainsOwnerListItem } from './DomainsOwnerListItem'
import { Table } from '@chakra-ui/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import { DOMAIN_TEST_IDS } from '@/app/company-domains/test-ids'

jest.mock('@/components/ui', () => ({
    __esModule: true,
    AvatarTableRow: ({ user }) => (
        <div data-testid='avatar-row'>{user?.name || 'User'}</div>
    )
}))

const renderWithTable = ui => {
    return render(
        <Table.Root>
            <Table.Body>{ui}</Table.Body>
        </Table.Root>
    )
}

const mockProps = {
    playbookId: 'playbookId1',
    group: 'Test Group',
    title: 'Test Domain',
    imgSrcDM: 'imgDMBase64',
    imgSrcLM: 'imgLMBase64',
    imgSrcFilledDM: 'filledDMBase64',
    imgSrcFilledLM: 'filledLMBase64',
    unitCIO: 'User A',
    techOwner: 'User B',
    headEngineer: 'User C',
    principalArchitect: 'User D',
    enterpriseArchitect: 'User E',
    unitCIODelegate: 'open'
}

const mockPush = jest.fn()
jest.mock('@/hooks', () => ({
    useNavigation: jest.fn(() => ({
        push: mockPush
    }))
}))

describe('DomainsOwnerListItem', () => {
    it('renders domain title', () => {
        renderWithTable(<DomainsOwnerListItem {...mockProps} />)
        expect(screen.getByText('Test Domain')).toBeInTheDocument()
    })

    it('handles click navigation', () => {
        renderWithTable(<DomainsOwnerListItem {...mockProps} />)
        const row = screen.getByRole('row')
        fireEvent.click(row)
        expect(mockPush).toHaveBeenCalledWith('/docs/playbookId1')
    })

    it('handles mouse enter and leave events without crashing', () => {
        renderWithTable(<DomainsOwnerListItem {...mockProps} />)
        const row = screen.getByRole('row')
        fireEvent.mouseEnter(row)
        fireEvent.mouseLeave(row)
    })

    it('renders all 5 avatar components', () => {
        renderWithTable(<DomainsOwnerListItem {...mockProps} />)
        const avatars = screen.getAllByTestId(DOMAIN_TEST_IDS.avatarRow)
        expect(avatars.length).toBe(5)
    })
})
