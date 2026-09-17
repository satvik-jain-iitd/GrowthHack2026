import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import RecommendationLegend, {
    RECOMMENDATION_COLOR
} from './RecommendationLegend'

describe('RecommendationLegend', () => {
    it('renders the recommendation legend text', () => {
        render(<RecommendationLegend />)
        expect(screen.getByTestId('recommendation-legend')).toBeInTheDocument()
        expect(
            screen.getByText(/Recommended value, not yet confirmed/)
        ).toBeInTheDocument()
    })

    it('exposes the shared recommendation colour', () => {
        expect(RECOMMENDATION_COLOR).toBe('#F3780D')
    })
})
