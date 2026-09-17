import { render, screen } from '@/test/utils/test-utils'
import { MetricCard } from '@/app/resources/tech-investment-planning-dashboard/components/shared/MetricCard'

describe('MetricCard', () => {
    it('renders numeric value with toLocaleString', () => {
        render(<MetricCard label='Total' value={1234567} />)
        expect(screen.getByText('1,234,567')).toBeInTheDocument()
    })

    it('renders string value as-is', () => {
        render(<MetricCard label='Rate' value='42.5%' />)
        expect(screen.getByText('42.5%')).toBeInTheDocument()
    })

    it('renders label text', () => {
        render(<MetricCard label='Submitted' value={10} />)
        expect(screen.getByText('Submitted')).toBeInTheDocument()
    })

    it('renders subtitle when provided', () => {
        render(<MetricCard label='Epics' value={5} subtitle='Flow started' />)
        expect(screen.getByText('Flow started')).toBeInTheDocument()
    })

    it('omits subtitle when not provided', () => {
        render(<MetricCard label='Epics' value={5} />)
        expect(screen.queryByText('Flow started')).not.toBeInTheDocument()
    })

    it('renders blue variant without crashing', () => {
        render(<MetricCard label='Blue' value={1} color='blue' />)
        expect(screen.getByText('Blue')).toBeInTheDocument()
    })

    it('renders green variant without crashing', () => {
        render(<MetricCard label='Green' value={2} color='green' />)
        expect(screen.getByText('Green')).toBeInTheDocument()
    })

    it('renders red variant without crashing', () => {
        render(<MetricCard label='Red' value={3} color='red' />)
        expect(screen.getByText('Red')).toBeInTheDocument()
    })
})
