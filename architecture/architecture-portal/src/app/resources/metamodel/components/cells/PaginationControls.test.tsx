import { getPageTokens } from './PaginationControls'

describe('getPageTokens', () => {
    it('returns a single page for empty or single-page tables', () => {
        expect(getPageTokens(0, 0)).toEqual([0])
        expect(getPageTokens(0, 1)).toEqual([0])
    })

    it('lists every page when they all fit in the window', () => {
        expect(getPageTokens(0, 3)).toEqual([0, 1, 2])
        expect(getPageTokens(2, 4)).toEqual([0, 1, 2, 3])
    })

    it('collapses skipped pages into a gap on each side', () => {
        expect(getPageTokens(5, 12)).toEqual([
            0,
            'gap-start',
            4,
            5,
            6,
            'gap-end',
            11
        ])
    })

    it('only gaps on the trailing side near the start', () => {
        expect(getPageTokens(0, 10)).toEqual([0, 1, 'gap-end', 9])
    })

    it('only gaps on the leading side near the end', () => {
        expect(getPageTokens(9, 10)).toEqual([0, 'gap-start', 8, 9])
    })
})
