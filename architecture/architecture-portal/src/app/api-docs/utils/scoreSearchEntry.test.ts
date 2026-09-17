import { FIELD_WEIGHTS } from '@/app/api-docs/constants/search'
import { SearchIndexEntry } from '@/app/api-docs/types/search'
import { apiDocsSidebar } from '@/test/mocks/apiDocsSidebar'
import { buildSearchIndex } from './buildSearchIndex'
import { parseSearchQuery } from './parseSearchQuery'
import { matchQuality, scoreSearchEntry } from './scoreSearchEntry'

const index = buildSearchIndex(apiDocsSidebar)
const entry = (id: string) => index.byId.get(id) as SearchIndexEntry

describe('matchQuality', () => {
    it('scores an exact match highest', () => {
        expect(matchQuality('payments', 'payments')).toBe(4)
    })

    it('scores a prefix above a word boundary above a bare substring', () => {
        expect(matchQuality('payments api', 'pay')).toBe(3)
        expect(matchQuality('card payments', 'pay')).toBe(2)
        expect(matchQuality('repayments', 'pay')).toBe(1)
    })

    it('treats URI punctuation as a word boundary', () => {
        expect(matchQuality('/v1/{cardid}/payments', 'payments')).toBe(2)
        expect(matchQuality('/v1/{cardid}/payments', 'cardid')).toBe(2)
    })

    it('returns 0 when the token is absent or either side is empty', () => {
        expect(matchQuality('payments', 'refund')).toBe(0)
        expect(matchQuality('', 'pay')).toBe(0)
        expect(matchQuality('payments', '')).toBe(0)
    })
})

describe('scoreSearchEntry', () => {
    it('returns 0 when there are no tokens', () => {
        expect(
            scoreSearchEntry(entry('op-create-payment'), parseSearchQuery(''))
        ).toBe(0)
    })

    it('weights an operation-name hit above a domain-name hit', () => {
        const query = parseSearchQuery('payment')
        const operation = scoreSearchEntry(entry('op-create-payment'), query)
        const domain = scoreSearchEntry(entry('domain-payments'), query)
        expect(operation).toBeGreaterThan(domain)
    })

    it('weights a URI hit above an operation-description hit', () => {
        const query = parseSearchQuery('statements')
        expect(scoreSearchEntry(entry('op-list-statements'), query)).toBe(
            FIELD_WEIGHTS.OPERATION_NAME * 2
        )
        expect(
            scoreSearchEntry(entry('op-get-batch'), parseSearchQuery('batches'))
        ).toBe(FIELD_WEIGHTS.URI * 2)
    })

    it('surfaces an operation from its description alone', () => {
        expect(
            scoreSearchEntry(
                entry('op-delete-payment'),
                parseSearchQuery('reverses')
            )
        ).toBe(FIELD_WEIGHTS.OPERATION_DESCRIPTION * 3)
    })

    it('requires every token to match (AND semantics)', () => {
        expect(
            scoreSearchEntry(
                entry('op-create-payment'),
                parseSearchQuery('create payment')
            )
        ).toBeGreaterThan(0)
        expect(
            scoreSearchEntry(
                entry('op-create-payment'),
                parseSearchQuery('create nonsense')
            )
        ).toBe(0)
    })

    it('excludes non-matching methods and every non-operation entry', () => {
        const query = parseSearchQuery('post payment')
        expect(
            scoreSearchEntry(entry('op-create-payment'), query)
        ).toBeGreaterThan(0)
        expect(scoreSearchEntry(entry('op-get-payment'), query)).toBe(0)
        expect(scoreSearchEntry(entry('domain-payments'), query)).toBe(0)
    })

    it('excludes operations with no method under a method filter', () => {
        expect(
            scoreSearchEntry(
                entry('op-list-refunds'),
                parseSearchQuery('put refunds')
            )
        ).toBe(0)
    })

    it('folds diacritics on both sides', () => {
        expect(
            scoreSearchEntry(entry('domain-cartao'), parseSearchQuery('cartao'))
        ).toBe(FIELD_WEIGHTS.DOMAIN_NAME * 4)
        expect(
            scoreSearchEntry(entry('domain-cartao'), parseSearchQuery('Cartão'))
        ).toBe(FIELD_WEIGHTS.DOMAIN_NAME * 4)
    })

    it.each(['(', '[', '*', '?', '\\', '+'])(
        'treats the regex metacharacter %p as a literal',
        token => {
            expect(() =>
                scoreSearchEntry(entry('op-create-payment'), {
                    tokens: [token],
                    raw: token
                })
            ).not.toThrow()
            expect(
                scoreSearchEntry(entry('op-create-payment'), {
                    tokens: [token],
                    raw: token
                })
            ).toBe(0)
        }
    )

    it('matches a URI fragment containing braces literally', () => {
        expect(
            scoreSearchEntry(
                entry('op-create-payment'),
                parseSearchQuery('{cardId}')
            )
        ).toBe(FIELD_WEIGHTS.URI * 2)
    })
})
