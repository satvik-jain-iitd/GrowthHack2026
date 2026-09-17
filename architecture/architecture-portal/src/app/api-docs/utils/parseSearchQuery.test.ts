import { parseSearchQuery } from './parseSearchQuery'

describe('parseSearchQuery', () => {
    it('lowercases and splits on whitespace', () => {
        expect(parseSearchQuery('  Create   Payment ')).toEqual({
            tokens: ['create', 'payment'],
            raw: 'Create   Payment'
        })
    })

    it('folds diacritics so "cartao" matches "Cartão"', () => {
        expect(parseSearchQuery('Cartão').tokens).toEqual(['cartao'])
    })

    it('extracts a leading method token as a filter', () => {
        expect(parseSearchQuery('post payment')).toEqual({
            method: 'POST',
            tokens: ['payment'],
            raw: 'post payment'
        })
    })

    it.each(['get', 'post', 'put', 'patch', 'delete'])(
        'recognises %s as a method filter',
        method => {
            expect(parseSearchQuery(`${method} card`).method).toBe(
                method.toUpperCase()
            )
        }
    )

    it('does not strip a method when it is the only token', () => {
        expect(parseSearchQuery('delete')).toEqual({
            tokens: ['delete'],
            raw: 'delete'
        })
    })

    it('only treats a method token as a filter in leading position', () => {
        expect(parseSearchQuery('payment post')).toEqual({
            tokens: ['payment', 'post'],
            raw: 'payment post'
        })
    })

    it.each(['', '   ', '...', '--', '  ,  '])(
        'returns no tokens for %p',
        input => {
            expect(parseSearchQuery(input).tokens).toEqual([])
        }
    )

    it('keeps URI fragments that contain punctuation', () => {
        expect(parseSearchQuery('/v1/{cardId}').tokens).toEqual([
            '/v1/{cardid}'
        ])
    })

    it('tolerates a nullish query', () => {
        expect(parseSearchQuery(undefined as unknown as string).tokens).toEqual(
            []
        )
    })
})
