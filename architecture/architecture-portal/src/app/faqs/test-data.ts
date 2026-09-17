import { Group } from '@/app/faqs/types'

export const mockFaqGroups: Group[] = [
    {
        id: 'general',
        title: 'General',
        sourceLink:
            'https://github.aexp.com/amex-eng/architecture-portal-docs/blob/main/docs/faqs/01-general.md',
        items: [
            {
                id: 'what-is-architecture-portal',
                q: 'What is Architecture Portal?',
                a: '<p>The internal architecture hub.</p>'
            },
            {
                id: 'who-can-access',
                q: 'Who can access it?',
                a: '<p>All engineers.</p>'
            }
        ]
    },
    {
        id: 'governance',
        title: 'Governance',
        sourceLink:
            'https://github.aexp.com/amex-eng/architecture-portal-docs/blob/main/docs/faqs/02-governance.md',
        items: []
    }
]

export const mockLeftNavGroups = [
    { id: 'general', title: 'General', count: 2 },
    { id: 'governance', title: 'Governance', count: 0 }
]
