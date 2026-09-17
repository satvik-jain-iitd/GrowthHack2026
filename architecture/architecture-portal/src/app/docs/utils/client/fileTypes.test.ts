import {
    getFileName,
    isDownloadablePath
} from '@/app/docs/utils/client/fileTypes'

describe('getFileName', () => {
    it('returns the last path segment', () => {
        expect(getFileName('buildvsbuy/SCIM_BvBScorecard_v7.xlsx')).toBe(
            'SCIM_BvBScorecard_v7.xlsx'
        )
    })

    it('strips query strings and fragments', () => {
        expect(getFileName('/api/contents/report.xlsx?host=ghe')).toBe(
            'report.xlsx'
        )
        expect(getFileName('./notes.pdf#page=2')).toBe('notes.pdf')
    })

    it('returns an empty string for a trailing slash', () => {
        expect(getFileName('some/dir/')).toBe('')
    })
})

describe('isDownloadablePath', () => {
    it.each([
        'buildvsbuy/SCIM_BvBScorecard_v7.xlsx',
        './data.CSV',
        'spec.json',
        'deck.pptx',
        'archive.zip'
    ])('treats %s as downloadable', path => {
        expect(isDownloadablePath(path)).toBe(true)
    })

    it.each([
        'diagram.png',
        'guide.md',
        '#section-anchor',
        'https://example.com/badge',
        ''
    ])('does not treat %s as downloadable', path => {
        expect(isDownloadablePath(path)).toBe(false)
    })
})
