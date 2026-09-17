import { domainsLeftNav } from '@/app/api-docs/types/apiDocs'
import { OpenAPIV3 } from 'openapi-types'

// openapi-types ships declarations only, so the enum has no runtime value.
const get = 'get' as OpenAPIV3.HttpMethods
const post = 'post' as OpenAPIV3.HttpMethods
const del = 'delete' as OpenAPIV3.HttpMethods

// Two company domains: "Payments" has one API with more operations than the
// per-API cap, "Cartão" exercises diacritic folding.
export const apiDocsSidebar: { [key: string]: domainsLeftNav } = {
    'domain-payments': {
        id: 'domain-payments',
        name: 'Payments',
        apis: {
            'api-card-payments': {
                id: 'api-card-payments',
                name: 'Card Payments API',
                description:
                    'Submit and inspect card payments across the enterprise.',
                path: ['Payments', 'Card Payments API'],
                operations: {
                    'op-create-payment': {
                        id: 'op-create-payment',
                        name: 'Create Payment',
                        description: 'Creates a new payment for a card member.',
                        path: [
                            'Payments',
                            'Card Payments API',
                            'Create Payment'
                        ],
                        method: post,
                        resource: '/v1/cards/{cardId}/payments',
                        status: 'Production Certified',
                        statusId: '1f16ec95-d399-41ff-856e-ff517b7772f4'
                    },
                    'op-get-payment': {
                        id: 'op-get-payment',
                        name: 'Get Payment',
                        description: 'Fetches a single payment by identifier.',
                        path: ['Payments', 'Card Payments API', 'Get Payment'],
                        method: get,
                        resource: '/v1/cards/{cardId}/payments/{paymentId}',
                        status: 'Design Certified',
                        statusId: '802a6837-3c0b-4058-8bd5-6c2bbea1c69a'
                    },
                    'op-delete-payment': {
                        id: 'op-delete-payment',
                        name: 'Delete Payment',
                        description: 'Reverses a previously submitted payment.',
                        path: [
                            'Payments',
                            'Card Payments API',
                            'Delete Payment'
                        ],
                        method: del,
                        resource: '/v1/cards/{cardId}/payments/{paymentId}'
                    },
                    'op-list-statements': {
                        id: 'op-list-statements',
                        name: 'List Statements',
                        description: 'Lists statements for a card member.',
                        path: [
                            'Payments',
                            'Card Payments API',
                            'List Statements'
                        ],
                        method: get,
                        resource: '/v1/cards/{cardId}/statements'
                    },
                    'op-list-disputes': {
                        id: 'op-list-disputes',
                        name: 'List Disputes',
                        description: 'Lists open disputes for a card member.',
                        path: [
                            'Payments',
                            'Card Payments API',
                            'List Disputes'
                        ],
                        method: get,
                        resource: '/v1/cards/{cardId}/disputes'
                    },
                    'op-list-refunds': {
                        id: 'op-list-refunds',
                        name: 'List Refunds',
                        description: 'Lists refunds issued against a card.',
                        path: ['Payments', 'Card Payments API', 'List Refunds'],
                        method: get,
                        resource: '/v1/cards/{cardId}/refunds',
                        // Raw value differs from its display label, so tests can
                        // tell the shared Status mapping is being applied.
                        status: 'API Catalog'
                    }
                }
            },
            'api-settlement': {
                id: 'api-settlement',
                name: 'Settlement API',
                description: 'Settlement batches and reconciliation reports.',
                path: ['Payments', 'Settlement API'],
                operations: {
                    'op-get-batch': {
                        id: 'op-get-batch',
                        name: 'Get Batch',
                        description: 'Returns a settlement batch.',
                        path: ['Payments', 'Settlement API', 'Get Batch'],
                        method: get,
                        resource: '/v1/settlement/batches/{batchId}'
                    }
                }
            }
        }
    },
    'domain-cartao': {
        id: 'domain-cartao',
        name: 'Cartão',
        apis: {
            'api-servicing': {
                id: 'api-servicing',
                name: 'Servicing API',
                description: 'Card member servicing endpoints.',
                path: ['Cartão', 'Servicing API'],
                operations: {
                    'op-get-profile': {
                        id: 'op-get-profile',
                        name: 'Get Profile',
                        description: 'Returns the card member profile.',
                        path: ['Cartão', 'Servicing API', 'Get Profile'],
                        method: get,
                        resource: '/v1/members/{memberId}/profile'
                    }
                }
            }
        }
    }
}
