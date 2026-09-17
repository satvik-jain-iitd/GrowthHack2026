import { getPinnedColumnStyles } from './pinnedColumns'

const columns = [
    { id: '_drag', size: 36 },
    { id: 'id', size: 120 },
    { id: 'name', size: 260 },
    { id: 'owner', size: 180 }
]

describe('getPinnedColumnStyles', () => {
    it('accumulates offsets in render order and flags the last pinned column', () => {
        expect(getPinnedColumnStyles(columns, ['_drag', 'name'])).toEqual({
            _drag: { left: 0, isLast: false },
            name: { left: 36, isLast: true }
        })
    })

    it('ignores pinned ids that no column defines', () => {
        expect(getPinnedColumnStyles(columns, ['_drag', 'missing'])).toEqual({
            _drag: { left: 0, isLast: true }
        })
    })

    it('returns no styles when nothing is pinned', () => {
        expect(getPinnedColumnStyles(columns, [])).toEqual({})
    })

    it('offsets a pinned column by the widths of the pinned columns before it', () => {
        expect(getPinnedColumnStyles(columns, ['_drag', 'id', 'name'])).toEqual(
            {
                _drag: { left: 0, isLast: false },
                id: { left: 36, isLast: false },
                name: { left: 156, isLast: true }
            }
        )
    })
})
