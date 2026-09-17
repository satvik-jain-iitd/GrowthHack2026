import React from 'react'
import { render } from '@/test/utils/test-utils'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DomainApiHeader from './DomainApiHeader'
import {
    DOMAIN_TEST_IDS,
    DOMAIN_TEST_TEXT,
    DOMAIN_TEST_ROLE
} from '../../test-ids'

describe('DomainApiHeader', () => {
    const baseStatusCount = {
        domainStatusCount: {
            eARB_Approved: 0,
            dARB_Approved: 0
        }
    }

    it('renders the header and triggers add action', async () => {
        const handleAdd = jest.fn()

        render(
            <DomainApiHeader
                isAdd={false}
                domainName='Payments'
                statusCount={baseStatusCount}
                handleAdd={handleAdd}
            />
        )

        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.headerText)
        ).toBeInTheDocument()

        const addButton = screen.getByRole(DOMAIN_TEST_ROLE.button, {
            name: DOMAIN_TEST_TEXT.addCompanyDomainApi
        })
        await userEvent.click(addButton)

        expect(handleAdd).toHaveBeenCalledTimes(1)
    })

    it('hides the add button when add mode is active', () => {
        render(
            <DomainApiHeader
                isAdd
                domainName='Payments'
                statusCount={baseStatusCount}
                handleAdd={jest.fn()}
            />
        )

        expect(
            screen.queryByRole(DOMAIN_TEST_ROLE.button, {
                name: DOMAIN_TEST_TEXT.addCompanyDomainApi
            })
        ).not.toBeInTheDocument()
    })

    it('renders chart controls and toggles chart view', async () => {
        const statusCount = {
            domainStatusCount: {
                eARB_Approved: 1,
                dARB_Approved: 0
            }
        }

        render(
            <DomainApiHeader
                isAdd
                domainName='Payments'
                statusCount={statusCount}
                handleAdd={jest.fn()}
            />
        )

        const pieChartIcon = screen.getByTestId(DOMAIN_TEST_IDS.iconPieChart)
        const barChartIcon = screen.getByTestId(DOMAIN_TEST_IDS.iconBarChart)
        expect(pieChartIcon).toHaveAttribute('data-dls-icon-color', 'white')
        expect(barChartIcon).toHaveAttribute('data-dls-icon-color', 'brand')

        await userEvent.click(barChartIcon)

        expect(pieChartIcon).toHaveAttribute('data-dls-icon-color', 'brand')
        expect(barChartIcon).toHaveAttribute('data-dls-icon-color', 'white')

        await userEvent.click(pieChartIcon)

        expect(pieChartIcon).toHaveAttribute('data-dls-icon-color', 'white')
        expect(barChartIcon).toHaveAttribute('data-dls-icon-color', 'brand')
    })

    it('should render IconPieChart and simulate onClick to show pie chart', async () => {
        const statusCount = {
            domainStatusCount: {
                eARB_Approved: 1,
                dARB_Approved: 1
            }
        }

        render(
            <DomainApiHeader
                isAdd={false}
                domainName='Payments'
                statusCount={statusCount}
                handleAdd={jest.fn()}
            />
        )

        const pieChartIcon = screen.getByTestId(DOMAIN_TEST_IDS.iconPieChart)
        expect(pieChartIcon).toBeInTheDocument()

        const barChartIcon = screen.getByTestId(DOMAIN_TEST_IDS.iconBarChart)

        expect(pieChartIcon).toHaveAttribute('data-dls-icon-color', 'white')
        expect(barChartIcon).toHaveAttribute('data-dls-icon-color', 'brand')

        await userEvent.click(barChartIcon)
        expect(pieChartIcon).toHaveAttribute('data-dls-icon-color', 'brand')
        expect(barChartIcon).toHaveAttribute('data-dls-icon-color', 'white')

        await userEvent.click(pieChartIcon)

        expect(pieChartIcon).toHaveAttribute('data-dls-icon-color', 'white')
        expect(barChartIcon).toHaveAttribute('data-dls-icon-color', 'brand')
    })

    it('should toggle between pie and bar chart on icon clicks', async () => {
        const statusCount = {
            domainStatusCount: {
                eARB_Approved: 2,
                dARB_Approved: 0
            }
        }

        render(
            <DomainApiHeader
                isAdd={false}
                domainName='Payments'
                statusCount={statusCount}
                handleAdd={jest.fn()}
            />
        )

        const pieChartIcon = screen.getByTestId(DOMAIN_TEST_IDS.iconPieChart)
        const barChartIcon = screen.getByTestId(DOMAIN_TEST_IDS.iconBarChart)

        expect(pieChartIcon).toHaveAttribute('data-dls-icon-color', 'white')
        expect(barChartIcon).toHaveAttribute('data-dls-icon-color', 'brand')

        await userEvent.click(barChartIcon)
        expect(pieChartIcon).toHaveAttribute('data-dls-icon-color', 'brand')
        expect(barChartIcon).toHaveAttribute('data-dls-icon-color', 'white')

        await userEvent.click(pieChartIcon)
        expect(pieChartIcon).toHaveAttribute('data-dls-icon-color', 'white')
        expect(barChartIcon).toHaveAttribute('data-dls-icon-color', 'brand')

        await userEvent.click(barChartIcon)
        expect(pieChartIcon).toHaveAttribute('data-dls-icon-color', 'brand')
        expect(barChartIcon).toHaveAttribute('data-dls-icon-color', 'white')
    })
})
