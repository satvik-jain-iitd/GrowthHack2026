'use client'
import { useState } from 'react'
import {
    DomainApiIcon,
    ApplicationsIcon,
    CapabilityMapIcon
} from '@/components/icons'
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'
import { ApplicationTableSearch } from './ApplicationTableSearch'
import { DetailTable } from './DetailTable'
import { Tabs } from '@chakra-ui/react'
import DomainApiSearchableTable from './DomainApiSearchableTable'
import { SeamlessIframe } from '@/components/ui'
import { CDAAS } from '@/constants'
import {
    Application,
    Domain,
    PlatformConfiguration
} from '@/app/company-domains/types'

export const DomainTabs = ({
    domain,
    applications: applicationsFromProps,
    capabilityMap,
    TotalApplicationsCount,
    domainApi
}: {
    domain: Domain
    applications: Application[]
    capabilityMap: PlatformConfiguration | undefined
    TotalApplicationsCount: number
    domainApi: number
}) => {
    const [value, setValue] = useState(
        capabilityMap ? 'CAPABILITY MAP' : 'APPLICATIONS'
    )
    const [applications, setApplications] = useState(applicationsFromProps)
    const orientation = useBreakpointValue<'horizontal' | 'vertical'>({
        base: 'vertical',
        md: 'horizontal'
    })

    const handleChange = (event: { value: string }) => {
        setValue(event.value)
    }

    const tabs = [
        {
            value: 'CAPABILITY MAP',
            Icon: CapabilityMapIcon,
            condition: capabilityMap
        },
        {
            value: 'APPLICATIONS',
            Icon: ApplicationsIcon,
            condition: true,
            amount: TotalApplicationsCount
        },
        {
            value: 'EARB APPROVED APIs',
            Icon: DomainApiIcon,
            condition: true,
            amount: domainApi
        }
    ]

    return (
        <>
            <Tabs.Root
                variant='outline'
                value={value}
                onValueChange={handleChange}
                orientation={orientation}
                flexDirection={{ mdDown: 'column' }}
            >
                <Tabs.List display={'flex'}>
                    {tabs.map((tab, index) => {
                        const { value: tabValue, Icon, condition, amount } = tab
                        const isSelected = tabValue == value
                        if (!condition) {
                            return null
                        }
                        if (tabValue == 'CAPABILITY MAP') {
                            return (
                                <Tabs.Trigger
                                    key={index}
                                    minHeight={{
                                        base: '80px',
                                        mdDown: 'unset'
                                    }}
                                    flex={1}
                                    value={tabValue}
                                    borderTop={
                                        isSelected
                                            ? {
                                                  _dark: '4px solid white',
                                                  base: '4px solid rgb(0, 23, 90)'
                                              }
                                            : '0px'
                                    }
                                    backgroundColor={{
                                        _dark: isSelected
                                            ? 'rgb(0, 0, 0)'
                                            : '#333',
                                        base: isSelected
                                            ? 'rgb(255, 255, 255)'
                                            : 'rgb(236, 237, 238)'
                                    }}
                                >
                                    <Flex
                                        flexDirection={'column'}
                                        alignItems={'center'}
                                        width={'100%'}
                                    >
                                        <Box
                                            color={{
                                                _dark: 'white',
                                                base: '#00175a'
                                            }}
                                        >
                                            <Icon
                                                color='inherit'
                                                height='22px'
                                                width='22px'
                                            />
                                        </Box>
                                        <Box
                                            ml={2}
                                            fontWeight='bold'
                                            fontSize='16px'
                                            color={{
                                                _dark: 'white',
                                                base: '#006fcf'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: '40px',
                                                    fontWeight: '700',
                                                    color: '#006fcf',
                                                    lineHeight: '44px'
                                                }}
                                            >
                                                {amount !== undefined
                                                    ? amount
                                                    : ''}
                                            </div>
                                            {tabValue}
                                        </Box>
                                    </Flex>
                                </Tabs.Trigger>
                            )
                        }
                        return (
                            <Tabs.Trigger
                                key={index}
                                minHeight={{
                                    base: '80px',
                                    mdDown: 'unset'
                                }}
                                flex={1}
                                value={tabValue}
                                borderTop={
                                    isSelected
                                        ? {
                                              _dark: '4px solid white',
                                              base: '4px solid rgb(0, 23, 90)'
                                          }
                                        : '0px'
                                }
                                backgroundColor={{
                                    _dark: isSelected ? 'rgb(0, 0, 0)' : '#333',
                                    base: isSelected
                                        ? 'rgb(255, 255, 255)'
                                        : 'rgb(236, 237, 238)'
                                }}
                            >
                                <Flex
                                    flexDirection={{
                                        base: 'row',
                                        mdDown: 'row'
                                    }}
                                    alignItems={'center'}
                                    justifyContent={{
                                        base: 'center',
                                        mdDown: 'flex-start'
                                    }}
                                    width={'100%'}
                                >
                                    <Box
                                        color={{
                                            _dark: 'white',
                                            base: '#61c5ff'
                                        }}
                                    >
                                        <Icon
                                            color='inherit'
                                            height='56px'
                                            width='56px'
                                        />
                                    </Box>
                                    <Box
                                        ml={2}
                                        fontWeight='bold'
                                        fontSize='16px'
                                        color={{
                                            _dark: 'white',
                                            base: '#006fcf'
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: '40px',
                                                fontWeight: '700',
                                                color: '#006fcf',
                                                lineHeight: '44px'
                                            }}
                                        >
                                            {amount !== undefined ? amount : ''}
                                        </div>
                                        {tabValue}
                                    </Box>
                                </Flex>
                            </Tabs.Trigger>
                        )
                    })}
                </Tabs.List>
                <Tabs.Content value={'CAPABILITY MAP'} mt={{ mdDown: 4 }}>
                    <Flex
                        mt={4}
                        width={{ base: '100%' }}
                        alignItems={'center'}
                        mb={2}
                    >
                        <CapabilityMapIcon
                            width='32px'
                            height='32px'
                            color='#006fcf'
                        />
                        <Box ml={1} fontWeight={600}>
                            Capability Map
                        </Box>
                    </Flex>
                    <SeamlessIframe
                        src={`${CDAAS.e1}/enterprise-platforms/capability-map/${capabilityMap?.mapPath}/`}
                        allow='local-network-access'
                    />
                </Tabs.Content>
                <Tabs.Content value={'APPLICATIONS'} mt={{ mdDown: 4 }}>
                    <Flex flexDirection={{ base: 'row', mdDown: 'column' }}>
                        <Flex
                            width={{ base: '50%', mdDown: '100%' }}
                            alignItems={'center'}
                        >
                            <ApplicationsIcon
                                width='32px'
                                height='32px'
                                color='#006fcf'
                            />
                            <Box ml={1} fontWeight={600}>
                                Applications
                            </Box>
                        </Flex>
                        <Flex
                            mt={{ mdDown: 2 }}
                            width={{ base: '50%', mdDown: '100%' }}
                            justifyContent={{
                                base: 'flex-end',
                                mdDown: 'flex-start'
                            }}
                        >
                            <Box
                                width={{ base: '70%', mdDown: '100%' }}
                                padding={0.5}
                            >
                                <ApplicationTableSearch
                                    appData={applicationsFromProps}
                                    setData={setApplications}
                                />
                            </Box>
                        </Flex>
                    </Flex>
                    <Box
                        mt={2}
                        width={{ base: '100%', mdDown: '82dvw' }}
                        overflowX={'auto'}
                    >
                        <DetailTable
                            applications={applications}
                            domain={domain}
                            allowUnlink={false}
                        />
                    </Box>
                </Tabs.Content>
                <Tabs.Content value={'EARB APPROVED APIs'} mt={{ mdDown: 4 }}>
                    <DomainApiSearchableTable
                        domainId={domain.company_domain_id}
                        viewOnly={true}
                        domainName=''
                    >
                        <Flex
                            width={{ base: '50%', mdDown: '100%' }}
                            alignItems={'center'}
                        >
                            <DomainApiIcon
                                width='32px'
                                height='32px'
                                color='#006fcf'
                            />
                            <Box ml={1} fontWeight={600}>
                                EARB Approved APIs
                            </Box>
                        </Flex>
                    </DomainApiSearchableTable>
                </Tabs.Content>
            </Tabs.Root>
        </>
    )
}
