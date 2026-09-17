import { PLAYBOOK_TYPE_IDS } from '@/constants'
import { generateDocsRoot } from './generateDocsRoot'

describe('generateDocsRoot', () => {
    describe('with PLAYBOOK_TYPE_IDS.BUILD_VS_BUY', () => {
        const playbookTypeId = PLAYBOOK_TYPE_IDS.BUILD_VS_BUY

        it('returns /buildvsbuy when docsRoot is undefined', () => {
            const result = generateDocsRoot(undefined, playbookTypeId)
            expect(result).toBe('/buildvsbuy')
        })

        it('appends /buildvsbuy when docsRoot does not end with buildvsbuy', () => {
            const result = generateDocsRoot(
                'gcp/services/apigeex/architecturedecisionrecord',
                playbookTypeId
            )
            expect(result).toBe(
                '/gcp/services/apigeex/architecturedecisionrecord/buildvsbuy'
            )
        })

        it('does not append buildvsbuy when docsRoot already ends with /buildvsbuy', () => {
            const result = generateDocsRoot(
                '/gcp/services/buildvsbuy',
                playbookTypeId
            )
            expect(result).toBe('/gcp/services/buildvsbuy')
        })

        it('trims trailing slash when docsRoot ends with /buildvsbuy/', () => {
            const result = generateDocsRoot(
                '/gcp/services/buildvsbuy/',
                playbookTypeId
            )
            expect(result).toBe('/gcp/services/buildvsbuy')
        })

        it('is case-insensitive when checking for buildvsbuy suffix', () => {
            const result = generateDocsRoot(
                '/some/path/BuildVsBuy',
                playbookTypeId
            )
            expect(result).toBe('/some/path/BuildVsBuy')
        })

        it('adds leading slash when docsRoot does not start with one', () => {
            const result = generateDocsRoot('mypath', playbookTypeId)
            expect(result).toBe('/mypath/buildvsbuy')
        })

        it('does not append buildvsbuy when it appears as a mid-path segment', () => {
            const result = generateDocsRoot(
                'gcp/buildvsbuy/services',
                playbookTypeId
            )
            expect(result).toBe('/gcp/buildvsbuy/services')
        })

        it('does not append buildvsbuy when it appears mid-path (case-insensitive)', () => {
            const result = generateDocsRoot(
                '/gcp/BuildVsBuy/services',
                playbookTypeId
            )
            expect(result).toBe('/gcp/BuildVsBuy/services')
        })
    })

    describe('with a non-BUILD_VS_BUY playbook type (defaults to workproducts)', () => {
        const playbookTypeId = PLAYBOOK_TYPE_IDS.COMPANY_SUBDOMAIN

        it('returns /workproducts when docsRoot is undefined', () => {
            const result = generateDocsRoot(undefined, playbookTypeId)
            expect(result).toBe('/workproducts')
        })

        it('appends /workproducts when docsRoot does not end with workproducts', () => {
            const result = generateDocsRoot('/some/path', playbookTypeId)
            expect(result).toBe('/some/path/workproducts')
        })

        it('does not append workproducts when docsRoot already ends with /workproducts', () => {
            const result = generateDocsRoot(
                '/some/path/workproducts',
                playbookTypeId
            )
            expect(result).toBe('/some/path/workproducts')
        })
    })
})
