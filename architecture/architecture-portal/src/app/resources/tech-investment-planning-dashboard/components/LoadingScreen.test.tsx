import { render, screen } from '@/test/utils/test-utils'
import { LoadingScreen } from '@/app/resources/tech-investment-planning-dashboard/components/LoadingScreen'
import type { ProcessingPhase } from '@/app/resources/tech-investment-planning-dashboard/hooks/useCsvProcessor'

describe('LoadingScreen', () => {
    it('shows error UI (not progress bar) when error is non-null', () => {
        render(
            <LoadingScreen phase='idle' pct={0} error='Something went wrong' />
        )
        expect(screen.getByText('Error loading data')).toBeInTheDocument()
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
        expect(screen.queryByText(/complete/)).not.toBeInTheDocument()
    })

    it('shows mapping phase label', () => {
        render(<LoadingScreen phase='mapping' pct={20} error={null} />)
        expect(
            screen.getByText('Loading epic submissions and user selections…')
        ).toBeInTheDocument()
    })

    it('shows journeyRec phase label', () => {
        render(<LoadingScreen phase='journeyRec' pct={40} error={null} />)
        expect(
            screen.getByText('Loading AI journey recommendations…')
        ).toBeInTheDocument()
    })

    it('shows capRec phase label', () => {
        render(<LoadingScreen phase='capRec' pct={60} error={null} />)
        expect(
            screen.getByText('Loading AI capability recommendations…')
        ).toBeInTheDocument()
    })

    it('shows history phase label', () => {
        render(<LoadingScreen phase='history' pct={80} error={null} />)
        expect(
            screen.getByText('Replaying activity history…')
        ).toBeInTheDocument()
    })

    it('shows deriving phase label', () => {
        render(<LoadingScreen phase='deriving' pct={90} error={null} />)
        expect(
            screen.getByText(
                'Crunching the numbers and building your dashboard…'
            )
        ).toBeInTheDocument()
    })

    it('shows "Initializing..." for unknown phase', () => {
        render(
            <LoadingScreen
                phase={'idle' as ProcessingPhase}
                pct={0}
                error={null}
            />
        )
        expect(screen.getByText('Initializing...')).toBeInTheDocument()
    })

    it('shows pct% complete', () => {
        render(<LoadingScreen phase='mapping' pct={55} error={null} />)
        expect(screen.getByText('55% complete')).toBeInTheDocument()
    })
})
