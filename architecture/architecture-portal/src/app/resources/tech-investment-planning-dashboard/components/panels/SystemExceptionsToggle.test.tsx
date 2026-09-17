import { render, screen, fireEvent } from '@/test/utils/test-utils'
import { SystemExceptionsToggle } from '@/app/resources/tech-investment-planning-dashboard/components/panels/SystemExceptionsToggle'

jest.mock('../../context/DashboardContext')

import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
const mockUseDashboard = useDashboard as jest.Mock

describe('SystemExceptionsToggle', () => {
    const setSystemExceptionsMode = jest.fn()

    beforeEach(() => {
        setSystemExceptionsMode.mockClear()
        mockUseDashboard.mockReturnValue({
            systemExceptionsMode: 'without_system_exceptions',
            setSystemExceptionsMode
        })
    })

    it('renders both toggle options', () => {
        render(<SystemExceptionsToggle />)
        expect(
            screen.getByText('Without system exceptions')
        ).toBeInTheDocument()
        expect(screen.getByText('With system exceptions')).toBeInTheDocument()
    })

    it('renders without crashing', () => {
        expect(() => render(<SystemExceptionsToggle />)).not.toThrow()
    })

    it('switches to with_system_exceptions when clicked', () => {
        render(<SystemExceptionsToggle />)
        fireEvent.click(screen.getByText('With system exceptions'))
        expect(setSystemExceptionsMode).toHaveBeenCalledWith(
            'with_system_exceptions'
        )
    })

    it('switches back to without_system_exceptions when clicked', () => {
        mockUseDashboard.mockReturnValue({
            systemExceptionsMode: 'with_system_exceptions',
            setSystemExceptionsMode
        })
        render(<SystemExceptionsToggle />)
        fireEvent.click(screen.getByText('Without system exceptions'))
        expect(setSystemExceptionsMode).toHaveBeenCalledWith(
            'without_system_exceptions'
        )
    })
})
