import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { AIJourneyRecommendBanner } from './AIJourneyRecommendBanner'

/* eslint-disable @next/next/no-img-element */
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
        <img alt={alt} {...props} />
    )
}))
/* eslint-enable @next/next/no-img-element */

jest.mock('@americanexpress/dls-icons', () => ({
    IconInfo: () => <span data-testid='icon-info' />
}))

jest.mock('@/components/icons/AIIcon', () => ({
    AIIcon: () => <span data-testid='ai-icon' />
}))

jest.mock('@/components/ui', () => ({
    Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

describe('AIJourneyRecommendBanner', () => {
    it('renders the heading text', () => {
        render(<AIJourneyRecommendBanner />)
        expect(screen.getByTestId('ai-banner-heading')).toBeInTheDocument()
    })

    it('renders instructional body text mentioning recommended journeys', () => {
        render(<AIJourneyRecommendBanner />)
        expect(screen.getByTestId('ai-banner-body')).toBeInTheDocument()
    })

    it('renders the hero image', () => {
        render(<AIJourneyRecommendBanner />)
        expect(
            screen.getByAltText('Enterprise Customer Journeys')
        ).toBeInTheDocument()
    })
})
