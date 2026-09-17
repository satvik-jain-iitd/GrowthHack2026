import React from 'react'
import { render, screen } from '@/test/utils/test-utils'
import { CustomerJourneyHeader } from './CustomerJourneyHeader'
import { CJ_HEADER_TEST_IDS } from '../test-ids'

describe('CustomerJourneyHeader', () => {
    it('renders the Enterprise Customer Journey heading', () => {
        render(<CustomerJourneyHeader />)
        expect(
            screen.getByTestId(CJ_HEADER_TEST_IDS.heading)
        ).toBeInTheDocument()
    })

    it('renders the description text', () => {
        render(<CustomerJourneyHeader />)
        expect(
            screen.getByTestId(CJ_HEADER_TEST_IDS.description)
        ).toBeInTheDocument()
    })
})
