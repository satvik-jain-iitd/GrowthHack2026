'use client'
import { Button, Flex } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui/Tooltip'
import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
import type { SystemExceptionsMode } from '@/app/resources/tech-investment-planning-dashboard/types'

const OPTIONS: { mode: SystemExceptionsMode; label: string }[] = [
    { mode: 'without_system_exceptions', label: 'Without system exceptions' },
    { mode: 'with_system_exceptions', label: 'With system exceptions' }
]

export function SystemExceptionsToggle() {
    const { systemExceptionsMode, setSystemExceptionsMode } = useDashboard()

    return (
        <Tooltip
            content='System exceptions are Strategic Epics saved without ever receiving an AI ECJ/EBC recommendation. "Without system exceptions" (default) excludes them from journey/capability metrics. "With system exceptions" includes all saved epics, counting missing recommendations as 0% retained.'
            showArrow
        >
            <Flex
                display='inline-flex'
                borderRadius='md'
                border='1px solid'
                borderColor='border.subtle'
                overflow='hidden'
            >
                {OPTIONS.map(({ mode, label }, i) => {
                    const active = systemExceptionsMode === mode
                    return (
                        <Button
                            key={mode}
                            size='sm'
                            borderRadius='0'
                            borderLeftWidth={i > 0 ? '1px' : '0'}
                            borderLeftColor='border.subtle'
                            variant={active ? 'solid' : 'ghost'}
                            colorPalette={active ? 'blue' : 'gray'}
                            onClick={() => setSystemExceptionsMode(mode)}
                        >
                            {label}
                        </Button>
                    )
                })}
            </Flex>
        </Tooltip>
    )
}
