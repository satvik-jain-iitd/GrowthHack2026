'use client'
import { useState } from 'react'
import { Box, Tabs } from '@chakra-ui/react'
import { FeatureFlagsPanel } from './FeatureFlagsPanel'
import { PilotGroupsPanel } from './PilotGroupsPanel'
import { FEATURE_MANAGEMENT_TEST_IDS } from '../test-ids'

type TabValue = 'feature-flags' | 'pilot-groups'

export const FeatureManagementTabs = () => {
    const [value, setValue] = useState<TabValue>('feature-flags')

    return (
        <Box
            px='5%'
            py={8}
            data-testid={FEATURE_MANAGEMENT_TEST_IDS.tabs}
            w='100%'
        >
            <Tabs.Root
                variant='outline'
                value={value}
                onValueChange={e => setValue(e.value as TabValue)}
            >
                <Tabs.List>
                    <Tabs.Trigger
                        value='feature-flags'
                        data-testid={FEATURE_MANAGEMENT_TEST_IDS.tabBtn(
                            'feature-flags'
                        )}
                    >
                        Feature Flags
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value='pilot-groups'
                        data-testid={FEATURE_MANAGEMENT_TEST_IDS.tabBtn(
                            'pilot-groups'
                        )}
                    >
                        Pilot Groups
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value='feature-flags'>
                    <FeatureFlagsPanel />
                </Tabs.Content>
                <Tabs.Content value='pilot-groups'>
                    <PilotGroupsPanel />
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    )
}
