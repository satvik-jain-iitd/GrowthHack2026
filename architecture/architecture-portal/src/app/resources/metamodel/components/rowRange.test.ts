import { getRowRangeLabel } from './rowRange'

describe('getRowRangeLabel', () => {
    it('reports the visible range on a paginated grid', () => {
        expect(
            getRowRangeLabel({
                filteredCount: 312,
                totalCount: 312,
                pageIndex: 0,
                pageSize: 25
            })
        ).toBe('Showing 1–25 of 312')

        expect(
            getRowRangeLabel({
                filteredCount: 312,
                totalCount: 312,
                pageIndex: 2,
                pageSize: 25
            })
        ).toBe('Showing 51–75 of 312')
    })

    it('clamps the end of the range on a partial last page', () => {
        expect(
            getRowRangeLabel({
                filteredCount: 312,
                totalCount: 312,
                pageIndex: 12,
                pageSize: 25
            })
        ).toBe('Showing 301–312 of 312')
    })

    it('notes the pre-filter total when filters are narrowing the set', () => {
        expect(
            getRowRangeLabel({
                filteredCount: 8,
                totalCount: 312,
                pageIndex: 0,
                pageSize: 25
            })
        ).toBe('Showing 1–8 of 8 (filtered from 312)')
    })

    it('keeps the plain count when the grid is not paginated', () => {
        expect(getRowRangeLabel({ filteredCount: 8, totalCount: 312 })).toBe(
            'Showing 8 of 312'
        )
    })

    it('handles an empty result set', () => {
        expect(
            getRowRangeLabel({
                filteredCount: 0,
                totalCount: 312,
                pageIndex: 0,
                pageSize: 25
            })
        ).toBe('Showing 0 of 0')
    })
})
