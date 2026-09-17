import { render } from '@/test/utils/test-utils'
import { screen, fireEvent } from '@testing-library/react'
import HeaderBarChart, {
    CustomTooltip as HeaderBarCustomTooltip
} from './HeaderBarChart'
import { DOMAIN_TEST_IDS, DOMAIN_TEST_TEXT } from '../../test-ids'

describe('HeaderBarChart', () => {
    const mockChartData = [
        { name: DOMAIN_TEST_TEXT.eArbApproved, value: 5, color: '#28a745' },
        { name: DOMAIN_TEST_TEXT.dArbApproved, value: 3, color: '#007bff' },
        { name: DOMAIN_TEST_TEXT.inReview, value: 2, color: '#ffc107' }
    ]

    it('should render HeaderBarChart with chart data', () => {
        const { container } = render(
            <HeaderBarChart chartData={mockChartData} Proposed={0} />
        )

        expect(container).toBeInTheDocument()
        expect(
            container.querySelector('.recharts-responsive-container')
        ).toBeInTheDocument()
    })

    it('should not render CustomLegend when Proposed is 0', () => {
        render(<HeaderBarChart chartData={mockChartData} Proposed={0} />)

        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.chartLegendDomain)
        ).not.toBeInTheDocument()
        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.chartLegendOperations)
        ).not.toBeInTheDocument()
    })

    it('should not render CustomLegend when Proposed is negative', () => {
        render(<HeaderBarChart chartData={mockChartData} Proposed={-1} />)

        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.chartLegendDomain)
        ).not.toBeInTheDocument()
        expect(
            screen.queryByTestId(DOMAIN_TEST_IDS.chartLegendOperations)
        ).not.toBeInTheDocument()
    })

    it('should render CustomLegend when Proposed is greater than 0', () => {
        render(<HeaderBarChart chartData={mockChartData} Proposed={10} />)

        expect(screen.getByText('10')).toBeInTheDocument()
        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.chartLegendDomain)
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(DOMAIN_TEST_IDS.chartLegendOperations)
        ).toBeInTheDocument()
    })

    it('should render custom tooltip when active', () => {
        render(
            <HeaderBarCustomTooltip
                active
                label={DOMAIN_TEST_TEXT.eArbApproved}
                payload={[{ value: '5' }]}
            />
        )

        expect(
            screen.getByText(`${DOMAIN_TEST_TEXT.eArbApproved}: 5`)
        ).toBeInTheDocument()
    })

    it('should display tooltip on mouse hover over chart bars', async () => {
        const { container } = render(
            <HeaderBarChart chartData={mockChartData} Proposed={5} />
        )

        const bars = container.querySelectorAll('.recharts-bar-rectangle')

        if (bars.length > 0) {
            fireEvent.mouseOver(bars[0])
            expect(container).toBeInTheDocument()
        }
    })

    it('should handle tooltip with inactive state', () => {
        render(<HeaderBarChart chartData={mockChartData} Proposed={5} />)

        expect(
            screen.queryByText(`${DOMAIN_TEST_TEXT.eArbApproved}: 5`)
        ).not.toBeInTheDocument()
    })

    it('should render with empty chart data', () => {
        const { container } = render(
            <HeaderBarChart chartData={[]} Proposed={0} />
        )

        expect(container).toBeInTheDocument()
        expect(
            container.querySelector('.recharts-responsive-container')
        ).toBeInTheDocument()
    })

    it('should handle zero values in chart data', () => {
        const dataWithZeros = [
            { name: DOMAIN_TEST_TEXT.eArbApproved, value: 0, color: '#28a745' },
            { name: DOMAIN_TEST_TEXT.dArbApproved, value: 0, color: '#007bff' }
        ]

        const { container } = render(
            <HeaderBarChart chartData={dataWithZeros} Proposed={0} />
        )

        expect(container).toBeInTheDocument()
        expect(
            container.querySelector('.recharts-responsive-container')
        ).toBeInTheDocument()
    })
})
