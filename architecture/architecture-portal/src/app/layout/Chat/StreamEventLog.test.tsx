import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import StreamEventLog from './StreamEventLog'
import { StreamEventLine } from './types'

const events: StreamEventLine[] = [
    { type: 'thinking', label: 'Thinking...', detail: 'details here' },
    {
        type: 'unknown_custom_type',
        label: 'Custom label',
        detail: 'custom detail'
    }
]

describe('StreamEventLog', () => {
    it('renders nothing when there are no events', () => {
        const { container } = render(
            <StreamEventLog events={[]} isAnswerReady={false} />
        )
        expect(container.firstChild).toBeNull()
    })

    it('renders event lines while the answer is not ready', () => {
        render(<StreamEventLog events={events} isAnswerReady={false} />)

        expect(screen.getByText('Thinking')).toBeInTheDocument()
        expect(screen.getByText('Thinking...')).toBeInTheDocument()
    })

    it('falls back to a split/capitalized display name for unrecognized event types', () => {
        render(<StreamEventLog events={events} isAnswerReady={false} />)

        expect(screen.getByText('Unknown Custom Type')).toBeInTheDocument()
        expect(screen.getByText('Custom label')).toBeInTheDocument()
    })
})
