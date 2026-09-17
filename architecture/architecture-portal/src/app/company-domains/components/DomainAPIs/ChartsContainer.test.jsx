import { render } from '@/test/utils/test-utils'
import ChartsContainer from './ChartsContainer'
import HeaderPieChart from './HeaderPieChart'
import HeaderBarChart from './HeaderBarChart'

jest.mock('./HeaderPieChart', () => ({
    __esModule: true,
    default: jest.fn(() => null)
}))

jest.mock('./HeaderBarChart', () => ({
    __esModule: true,
    default: jest.fn(() => null)
}))

describe('ChartsContainer', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('maps positive operation counts into pie chart data with names, values, and colors', () => {
        const statusCount = {
            domainStatusCount: {
                operations: {
                    eARB_Approved: 2,
                    dARB_Approved: 0,
                    design_Certified: 3,
                    prod_Certified: 1,
                    proposed: 0,
                    total: 6
                }
            }
        }

        render(
            <ChartsContainer showBarChart={false} statusCount={statusCount} />
        )

        expect(HeaderPieChart).toHaveBeenCalledTimes(1)
        expect(HeaderBarChart).not.toHaveBeenCalled()
        expect(HeaderPieChart.mock.calls[0][0]).toEqual({
            chartData: [
                {
                    name: 'EARB Approved Operations',
                    value: 2,
                    color: '#F9A94E'
                },
                {
                    name: 'Design Certified Operations',
                    value: 3,
                    color: '#2196F3'
                },
                {
                    name: 'Production Certified Operations',
                    value: 1,
                    color: '#4CAF50'
                }
            ],
            Proposed: 6
        })
    })

    it('passes mapped operation counts to the bar chart when bar mode is active', () => {
        const statusCount = {
            domainStatusCount: {
                operations: {
                    eARB_Approved: 0,
                    dARB_Approved: 4,
                    design_Certified: 0,
                    prod_Certified: 0,
                    proposed: 0,
                    total: 4
                }
            }
        }

        render(<ChartsContainer showBarChart statusCount={statusCount} />)

        expect(HeaderBarChart).toHaveBeenCalledTimes(1)
        expect(HeaderPieChart).not.toHaveBeenCalled()
        expect(HeaderBarChart.mock.calls[0][0]).toEqual({
            chartData: [
                {
                    name: 'ARB Approved Operations',
                    value: 4,
                    color: '#FFF846'
                }
            ],
            Proposed: 4
        })
    })
})
