'use client'
import React from 'react'
import { useAdminContext } from '@/context'
import { Box, Button } from '@chakra-ui/react'
import { useNavigation } from '@/hooks'
import { ADMIN_TEST_IDS } from '../test-ids'

const tabsList = [
    { label: 'Initiative', value: 'initiatives' },
    { label: 'Company Domain', value: 'company-domains' },
    { label: 'Foundational Technology', value: 'foundational-technologies' }
]

export const AdminTabs = () => {
    const router = useNavigation()
    const adminContext = useAdminContext()
    const { selectedType } = adminContext || {}
    const [value, setValue] = React.useState<string>(
        selectedType || 'initiatives'
    )

    React.useEffect(() => {
        setValue(selectedType || 'initiatives')
    }, [selectedType])

    const handleClick = (tabValue: string) => {
        setValue(tabValue)
        router.push(`/admin/${tabValue}`)
    }

    return (
        <Box display='flex' gap={2} alignItems='center'>
            {tabsList.map(tab => (
                <Button
                    key={tab.value}
                    data-testid={ADMIN_TEST_IDS.adminTabBtn(tab.value)}
                    variant='ghost'
                    color='white'
                    onClick={() => handleClick(tab.value)}
                    borderRadius='0'
                    whiteSpace='nowrap'
                    justifyContent='center'
                    alignItems='center'
                    textAlign='center'
                    minH='40px'
                    paddingX={2}
                    boxShadow={
                        value === tab.value
                            ? 'inset 0 -4px 0 0 #ff8f00'
                            : 'none'
                    }
                    _hover={{
                        bg: { base: '#182a61ff', _dark: 'bg.emphasized' }
                    }}
                >
                    {tab.label.toUpperCase()}
                </Button>
            ))}
        </Box>
    )
}
