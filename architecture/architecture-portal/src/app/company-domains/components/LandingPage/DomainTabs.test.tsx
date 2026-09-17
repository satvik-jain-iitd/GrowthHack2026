import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { DomainTabs } from './DomainTabs'
import { domains } from '@/test/mocks/domains'
import {
    Application,
    Domain,
    PlatformConfiguration
} from '@/app/company-domains/types'

jest.mock('@chakra-ui/react', () => {
    const actual = jest.requireActual('@chakra-ui/react')
    const ReactLocal = jest.requireActual('react')
    const TabsContext = ReactLocal.createContext({
        value: '',
        onValueChange: (_event: { value: string }) => {}
    })

    return {
        ...actual,
        Box: ({ children }: { children: React.ReactNode }) => (
            <div>{children}</div>
        ),
        Flex: ({ children }: { children: React.ReactNode }) => (
            <div>{children}</div>
        ),
        useBreakpointValue: () => 'horizontal',
        Tabs: {
            Root: ({
                value,
                onValueChange,
                children
            }: {
                value: string
                onValueChange: (event: { value: string }) => void
                children: React.ReactNode
            }) => (
                <TabsContext.Provider value={{ value, onValueChange }}>
                    <div data-testid='tabs-root'>{children}</div>
                </TabsContext.Provider>
            ),
            List: ({ children }: { children: React.ReactNode }) => (
                <div data-testid='tabs-list'>{children}</div>
            ),
            Trigger: ({
                children,
                value
            }: {
                children: React.ReactNode
                value: string
            }) => {
                const context = ReactLocal.useContext(TabsContext)
                return (
                    <button
                        type='button'
                        aria-selected={context.value === value}
                        onClick={() => context.onValueChange({ value })}
                    >
                        {children}
                    </button>
                )
            },
            Content: ({
                children,
                value
            }: {
                children: React.ReactNode
                value: string
            }) => {
                const context = ReactLocal.useContext(TabsContext)
                return context.value === value ? <div>{children}</div> : null
            }
        }
    }
})

jest.mock('@/components/icons', () => ({
    DomainApiIcon: () => <span data-testid='domain-api-icon'>api</span>,
    ApplicationsIcon: () => <span data-testid='applications-icon'>apps</span>,
    CapabilityMapIcon: () => <span data-testid='capability-map-icon'>map</span>
}))

jest.mock('./ApplicationTableSearch', () => ({
    ApplicationTableSearch: ({
        appData,
        setData
    }: {
        appData: Application[]
        setData: (applications: Application[]) => void
    }) => (
        <button
            data-testid='application-table-search'
            onClick={() => setData(appData.slice(0, 1))}
        >
            apply-filter
        </button>
    )
}))

jest.mock('./DetailTable', () => ({
    DetailTable: ({
        applications,
        domain,
        allowUnlink
    }: {
        applications: Application[]
        domain: Domain
        allowUnlink: boolean
    }) => (
        <div
            data-testid='detail-table'
            data-count={String(applications.length)}
            data-domain-id={domain.company_domain_id}
            data-allow-unlink={String(allowUnlink)}
        />
    )
}))

jest.mock('./DomainApiSearchableTable', () => ({
    __esModule: true,
    default: ({
        domainId,
        viewOnly,
        children
    }: {
        domainId: string
        viewOnly: boolean
        children: React.ReactNode
    }) => (
        <div
            data-testid='domain-api-searchable-table'
            data-domain-id={domainId}
            data-view-only={String(viewOnly)}
        >
            {children}
        </div>
    )
}))

jest.mock('@/components/ui', () => ({
    SeamlessIframe: ({ src, allow }: { src: string; allow?: string }) => (
        <iframe data-testid='seamless-iframe' src={src} allow={allow} />
    )
}))

jest.mock('@/constants', () => ({
    CDAAS: {
        e1: 'https://mock-cdaas.example.com'
    }
}))

const mockDomain = domains[0] as unknown as Domain

const mockApplications = [
    {
        application_nm: 'App One',
        application_id: 'app-1'
    },
    {
        application_nm: 'App Two',
        application_id: 'app-2'
    }
] as unknown as Application[]

const mockCapabilityMap = {
    name: 'Capability Map',
    abbreviatedName: 'CM',
    description: 'Domain capability map',
    mapPath: 'payments-map',
    logo: 'logo.svg'
} as PlatformConfiguration

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn()
        }))
    })
})

const renderDomainTabs = (
    overrides: Partial<React.ComponentProps<typeof DomainTabs>> = {}
) =>
    render(
        <DomainTabs
            domain={mockDomain}
            applications={mockApplications}
            capabilityMap={mockCapabilityMap}
            TotalApplicationsCount={mockApplications.length}
            domainApi={4}
            {...overrides}
        />
    )

describe('DomainTabs', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders capability map tab and uses capability map content by default when capabilityMap exists', () => {
        renderDomainTabs()

        expect(screen.getByText('CAPABILITY MAP')).toBeInTheDocument()

        expect(screen.getByTestId('seamless-iframe')).toHaveAttribute(
            'src',
            'https://mock-cdaas.example.com/enterprise-platforms/capability-map/payments-map/'
        )
    })

    it('hides capability map tab when capabilityMap is undefined', () => {
        renderDomainTabs({ capabilityMap: undefined })

        expect(screen.queryByText('CAPABILITY MAP')).not.toBeInTheDocument()
        expect(screen.getByText('APPLICATIONS')).toBeInTheDocument()
    })

    it('updates applications table data via ApplicationTableSearch setData', () => {
        renderDomainTabs()

        fireEvent.click(screen.getByText('APPLICATIONS'))

        expect(screen.getByTestId('detail-table')).toHaveAttribute(
            'data-count',
            '2'
        )

        fireEvent.click(screen.getByTestId('application-table-search'))

        expect(screen.getByTestId('detail-table')).toHaveAttribute(
            'data-count',
            '1'
        )
    })

    it('passes domain id and viewOnly=true to DomainApiSearchableTable', () => {
        renderDomainTabs()

        fireEvent.click(screen.getByText('EARB APPROVED APIs'))

        expect(
            screen.getByTestId('domain-api-searchable-table')
        ).toHaveAttribute('data-domain-id', mockDomain.company_domain_id)
        expect(
            screen.getByTestId('domain-api-searchable-table')
        ).toHaveAttribute('data-view-only', 'true')
        expect(screen.getByText('EARB Approved APIs')).toBeInTheDocument()
    })
})
