import React from 'react'
import { DomainsContainer } from './DomainsContainer'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { UserContext, NavigationProvider, DomainProvider } from '@/context'
import { domains } from '@/test/mocks/domains'
import { useGetDomains, useGetSubDomains } from '@/app/company-domains/hooks'
import { render } from '@/test/utils/test-utils'
import { DOMAIN_TEST_IDS } from '../test-ids'
import { DomainCategory } from '../types/domains'

globalThis.fetch = jest.fn()
jest.mock('@/app/company-domains/hooks')

jest.mock('@/hooks', () => ({
    useNavigation: jest.fn(() => ({
        push: jest.fn()
    })),
    useUserInfo: jest.fn(() => ({
        userInfo: { displayName: 'Test User' },
        isLoading: false
    })),
    useUserAvatar: jest.fn(() => ({
        avatarUrl: '',
        isLoading: false
    }))
}))

useGetDomains.mockImplementation(() => {
    return {
        domains: domains,
        loading: false,
        error: null
    }
})

describe('DomainsContainer', () => {
    const mockUser = {
        userObject: null
    }

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should render Domains section', async () => {
        render(
            <UserContext.Provider value={mockUser}>
                <NavigationProvider>
                    <DomainsContainer viewState={null} />
                </NavigationProvider>
            </UserContext.Provider>
        )

        expect(
            await screen.findByTestId(DOMAIN_TEST_IDS.headerText)
        ).toBeInTheDocument()
    })

    it('should render version toggle', async () => {
        render(
            <UserContext.Provider value={mockUser}>
                <NavigationProvider>
                    <DomainsContainer viewState={null} />
                </NavigationProvider>
            </UserContext.Provider>
        )

        const versionV = screen.getByRole('button', { name: 'Version 1' })
        await userEvent.click(versionV)

        const versionEvolve = screen.getByRole('button', { name: 'Evolving' })
        await userEvent.click(versionEvolve)
    })

    it('should render Domains view options', async () => {
        render(
            <UserContext.Provider value={mockUser}>
                <NavigationProvider>
                    <DomainsContainer viewState={null} />
                </NavigationProvider>
            </UserContext.Provider>
        )

        const viewbtn = screen.getByTestId(DOMAIN_TEST_IDS.viewAllBtn)
        await userEvent.click(viewbtn)
    })
    it('should render DomainsViewOptions viewControlButtons', async () => {
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({})
        }

        useGetSubDomains.mockImplementationOnce(() => {
            const customDomains = [
                domains[0],
                {
                    ...domains[1],
                    company_domain_id: 'processing-domain-id',
                    domain_category_nm: DomainCategory.SystemsOfProcessing,
                    domain_category_sort: 2
                }
            ]

            return {
                subDomains: customDomains,
                loading: false,
                error: null
            }
        })

        globalThis.fetch.mockResolvedValue(mockResponse)

        render(
            <UserContext.Provider value={mockUser}>
                <NavigationProvider>
                    <DomainProvider>
                        <DomainsContainer viewState={null} />
                    </DomainProvider>
                </NavigationProvider>
            </UserContext.Provider>
        )

        const listView = screen.getByTestId(DOMAIN_TEST_IDS.listViewBtn)
        await userEvent.click(listView)

        expect(
            await screen.findByTestId(DOMAIN_TEST_IDS.listView)
        ).toBeInTheDocument()
        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.ownerTable)
        ).not.toBeInTheDocument()

        const cardView = screen.getByTestId(DOMAIN_TEST_IDS.cardViewBtn)
        await userEvent.click(cardView)
        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.listView)
        ).not.toBeInTheDocument()
        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.listView)
        ).not.toBeInTheDocument()
    })

    it('should filter domains when a category button is clicked', async () => {
        useGetDomains.mockImplementationOnce(() => {
            const customDomains = [
                domains[0],
                {
                    ...domains[1],
                    company_domain_id: 'processing-domain-id',
                    domain_category_nm: DomainCategory.SystemsOfProcessing,
                    domain_category_sort: 2
                }
            ]

            return {
                domains: customDomains,
                loading: false,
                error: null
            }
        })

        useGetSubDomains.mockImplementationOnce(() => {
            const customDomains = [
                domains[0],
                {
                    ...domains[1],
                    company_domain_id: 'processing-domain-id',
                    domain_category_nm: DomainCategory.SystemsOfProcessing,
                    domain_category_sort: 2
                }
            ]

            return {
                subDomains: customDomains,
                loading: false,
                error: null
            }
        })

        render(
            <UserContext.Provider value={mockUser}>
                <NavigationProvider>
                    <DomainProvider>
                        <DomainsContainer viewState={null} />
                    </DomainProvider>
                </NavigationProvider>
            </UserContext.Provider>
        )

        expect(
            screen.getByRole('heading', {
                name: DomainCategory.SystemsOfEngagement
            })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('heading', {
                name: DomainCategory.SystemsOfProcessing
            })
        ).toBeInTheDocument()

        const processingBtn = screen.getByRole('button', {
            name: new RegExp(DomainCategory.SystemsOfProcessing, 'i')
        })
        await userEvent.click(processingBtn)

        expect(
            screen.getByRole('heading', {
                name: DomainCategory.SystemsOfProcessing
            })
        ).toBeInTheDocument()
        expect(
            screen.queryByRole('heading', {
                name: DomainCategory.SystemsOfEngagement
            })
        ).not.toBeInTheDocument()
    })

    it('should switch to owner view when owner button is clicked', async () => {
        useGetSubDomains.mockImplementationOnce(() => {
            const customDomains = [
                domains[0],
                {
                    ...domains[1],
                    company_domain_id: 'processing-domain-id',
                    domain_category_nm: DomainCategory.SystemsOfProcessing,
                    domain_category_sort: 2
                }
            ]

            return {
                subDomains: customDomains,
                loading: false,
                error: null
            }
        })
        render(
            <UserContext.Provider value={mockUser}>
                <NavigationProvider>
                    <DomainProvider>
                        <DomainsContainer viewState={null} />
                    </DomainProvider>
                </NavigationProvider>
            </UserContext.Provider>
        )

        const ownerView = screen.getByTestId(DOMAIN_TEST_IDS.ownerViewBtn)
        await userEvent.click(ownerView)

        expect(
            await screen.findByTestId(DOMAIN_TEST_IDS.ownerTable)
        ).toBeInTheDocument()
        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.listView)
        ).not.toBeInTheDocument()
    })
})
