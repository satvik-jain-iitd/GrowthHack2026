import { render } from '@/test/utils/test-utils'
import { screen } from '@testing-library/react'
import HeaderPieChart, { CustomTooltip } from './HeaderPieChart'
import { DOMAIN_TEST_IDS, DOMAIN_TEST_TEXT } from '../../test-ids'

describe('HeaderPieChart', () => {
    const mockChartData = [
        { name: DOMAIN_TEST_TEXT.eArbApproved, value: 5, color: '#28a745' },
        { name: DOMAIN_TEST_TEXT.dArbApproved, value: 3, color: '#007bff' },
        { name: DOMAIN_TEST_TEXT.inReview, value: 2, color: '#ffc107' }
    ]

    it('should render HeaderPieChart with chart data', () => {
        const { container } = render(
            <HeaderPieChart chartData={mockChartData} Proposed={0} />
        )

        expect(container).toBeInTheDocument()
        expect(
            container.querySelector('.recharts-responsive-container')
        ).toBeInTheDocument()
    })

    it('should render center label when Proposed is greater than 0', () => {
        render(<HeaderPieChart chartData={mockChartData} Proposed={10} />)

        expect(screen.getByText('10')).toBeInTheDocument()
        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.chartLegendDomain)
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.chartLegendOperations)
        ).toBeInTheDocument()
    })

    it('should not render center label when Proposed is 0', () => {
        render(<HeaderPieChart chartData={mockChartData} Proposed={0} />)

        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.chartLegendDomain)
        ).not.toBeInTheDocument()
        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.chartLegendOperations)
        ).not.toBeInTheDocument()
    })

    it('should render legend entries from chart data', () => {
        render(<HeaderPieChart chartData={mockChartData} Proposed={0} />)

        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.chartLegendEArbApproved)
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.chartLegendDArbApproved)
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.chartLegendInReview)
        ).toBeInTheDocument()
    })

    it('should render custom tooltip when active', () => {
        render(
            <CustomTooltip
                active
                payload={[{ name: DOMAIN_TEST_TEXT.eArbApproved, value: '5' }]}
            />
        )

        expect(
            screen.getByText(`${DOMAIN_TEST_TEXT.eArbApproved} : 5`)
        ).toBeInTheDocument()
    })

    it('should handle tooltip with inactive state', () => {
        render(<HeaderPieChart chartData={mockChartData} Proposed={10} />)

        expect(
            screen.queryByText(`${DOMAIN_TEST_TEXT.eArbApproved} : 5`)
        ).not.toBeInTheDocument()
    })

    it('should render with empty chart data', () => {
        const { container } = render(
            <HeaderPieChart chartData={[]} Proposed={0} />
        )

        expect(container).toBeInTheDocument()
        expect(
            container.querySelector('.recharts-responsive-container')
        ).toBeInTheDocument()
    })
})
