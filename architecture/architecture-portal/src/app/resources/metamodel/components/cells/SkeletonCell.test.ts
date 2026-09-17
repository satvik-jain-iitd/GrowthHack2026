import { skeletonWidth } from './SkeletonCell'

describe('skeletonWidth', () => {
    it('is stable for the same row/column so it does not re-roll on re-render', () => {
        expect(skeletonWidth('i1', 'lineOfBusiness')).toBe(
            skeletonWidth('i1', 'lineOfBusiness')
        )
    })

    it('varies across cells so a page of placeholders looks like ragged text', () => {
        const widths = new Set(
            ['a', 'b', 'c', 'd', 'e', 'f'].map(id =>
                skeletonWidth(id, 'lineOfBusiness')
            )
        )
        expect(widths.size).toBeGreaterThan(1)
    })

    it('stays within the 55–89% range', () => {
        for (const id of ['i1', 'i2', 'initiative-with-a-much-longer-id', '']) {
            const pct = Number(
                skeletonWidth(id, 'ownerUnitCio').replace('%', '')
            )
            expect(pct).toBeGreaterThanOrEqual(55)
            expect(pct).toBeLessThan(90)
        }
    })
})
