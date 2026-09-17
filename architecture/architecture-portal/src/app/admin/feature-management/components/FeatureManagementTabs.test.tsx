import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/test-utils'
import { FeatureManagementTabs } from './FeatureManagementTabs'
import { FEATURE_MANAGEMENT_TEST_IDS } from '../test-ids'

jest.mock('./FeatureFlagsPanel', () => ({
    FeatureFlagsPanel: () => (
        <div data-testid='feature-flags-panel'>Feature Flags Panel</div>
    )
}))

jest.mock('./PilotGroupsPanel', () => ({
    PilotGroupsPanel: () => (
        <div data-testid='pilot-groups-panel'>Pilot Groups Panel</div>
    )
}))

describe('FeatureManagementTabs', () => {
    it('renders both tab triggers', () => {
        render(<FeatureManagementTabs />)
        expect(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.tabBtn('feature-flags')
            )
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.tabBtn('pilot-groups')
            )
        ).toBeInTheDocument()
    })

    it('shows the feature flags panel by default', () => {
        render(<FeatureManagementTabs />)
        expect(screen.getByTestId('feature-flags-panel')).toBeInTheDocument()
    })

    it('switches to the pilot groups panel when that tab is clicked', async () => {
        const user = userEvent.setup()
        render(<FeatureManagementTabs />)
        await user.click(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.tabBtn('pilot-groups')
            )
        )
        expect(screen.getByTestId('pilot-groups-panel')).toBeInTheDocument()
    })

    it('switches back to the feature flags panel', async () => {
        const user = userEvent.setup()
        render(<FeatureManagementTabs />)
        await user.click(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.tabBtn('pilot-groups')
            )
        )
        await user.click(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.tabBtn('feature-flags')
            )
        )
        expect(screen.getByTestId('feature-flags-panel')).toBeInTheDocument()
    })
})
