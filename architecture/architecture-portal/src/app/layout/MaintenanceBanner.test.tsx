import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import MaintenanceBanner from './MaintenanceBanner'
import { useMaintenanceModeVisible } from '@/hooks'

jest.mock('@/hooks', () => ({
    useMaintenanceModeVisible: jest.fn()
}))

const mockUseMaintenanceModeVisible = useMaintenanceModeVisible as jest.Mock

const BANNER_MESSAGE = /Scheduled maintenance is in progress/

describe('MaintenanceBanner', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the maintenance message when the flag resolves to visible', () => {
        mockUseMaintenanceModeVisible.mockReturnValue(true)

        render(<MaintenanceBanner />)

        expect(screen.getByText(BANNER_MESSAGE)).toBeInTheDocument()
    })

    it('renders nothing when the flag resolves to not visible', () => {
        mockUseMaintenanceModeVisible.mockReturnValue(false)

        const { container } = render(<MaintenanceBanner />)

        expect(container.firstChild).toBeNull()
    })
})
