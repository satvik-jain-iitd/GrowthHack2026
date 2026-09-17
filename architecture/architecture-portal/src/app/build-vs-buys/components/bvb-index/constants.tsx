import { PlaybookEditableFields } from '@/app/build-vs-buys/components/bvb-index/BvBIndex'
import {
    IconLock,
    IconBusiness,
    IconSearch,
    IconPlusCircle,
    IconFeedback,
    IconSource
} from '@americanexpress/dls-icons'

export const editableFieldKeys: (keyof PlaybookEditableFields)[] = [
    'description',
    'owner',
    'requester',
    'reviewers',
    'stakeHolders',
    'deciders',
    'eaArchitect',
    'overallRisk',
    'estimatedCost',
    'etpImpacting'
]

export const fieldsConfig = [
    {
        key: 'owner',
        label: 'Owner(s)',
        icon: <IconLock color='neutral' />
    },
    {
        key: 'requester',
        label: 'Requester(s)',
        icon: <IconPlusCircle color='neutral' />
    },
    {
        key: 'reviewers',
        label: 'Reviewer(s)',
        icon: <IconSearch color='neutral' />
    },
    {
        key: 'stakeHolders',
        label: 'Stakeholder(s)',
        icon: <IconBusiness color='neutral' />
    },
    {
        key: 'deciders',
        label: 'Decider(s)',
        icon: <IconFeedback color='neutral' />
    },
    {
        key: 'eaArchitect',
        label: 'EA Architect(s)',
        icon: <IconSource color='neutral' />
    }
] as const

export const checkCanEdit = (status: string) => {
    const statusList = [
        'awaitingAcceptance',
        'inProgress',
        'inReview',
        'awaitingApproval',
        'approved',
        'rejected'
    ]
    return statusList.indexOf(status)
}
