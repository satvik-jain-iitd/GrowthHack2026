/* istanbul ignore file */
import { Playbook } from '@/types/Playbook'
import { Stack, Text, Link as ChakraLink, Box } from '@chakra-ui/react'
import {
    AvatarTableRow,
    AvatarShowMore,
    NoPrefetchLink as NextLink
} from '@/components/ui'
import StatusBadge, {
    getStatusByTask
} from '@/app/build-vs-buys/components/StatusBadge'
import dayjs from 'dayjs'

export const columns = [
    {
        key: 'playbook_nm',
        label: 'Name',
        render: (pb: Playbook) => (
            // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
            <ChakraLink
                as={NextLink}
                href={`/docs/${pb.playbook_id}`}
                fontWeight='bold'
                color='fg'
                whiteSpace='nowrap'
                _hover={{ textDecoration: 'underline' }}
            >
                {pb.playbook_nm}
            </ChakraLink>
        )
    },
    {
        key: 'adrLink',
        label: 'ADR',
        render: (pb: Playbook) =>
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (pb.add_da as any)?.adrLink ? (
                // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                <ChakraLink
                    as={NextLink}
                    //eslint-disable-next-line @typescript-eslint/no-explicit-any
                    href={(pb.add_da as any).adrLink}
                    color='fg'
                    whiteSpace='nowrap'
                    _hover={{ textDecoration: 'underline' }}
                >
                    {pb.playbook_nm} ADR
                </ChakraLink>
            ) : (
                <Text color={'fg'}>N/A</Text>
            )
    },
    {
        key: 'prim_pfrm_nm',
        label: 'Primary Company Domain',
        render: (pb: Playbook) => (
            <Text color={'fg'}> {pb.prim_pfrm_nm?.join(', ') || 'N/A'}</Text>
        )
    },
    {
        key: 'targetedEndDate',
        label: 'Targeted End Date',
        render: (pb: Playbook) => (
            <Text color={'fg'}>
                {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                {(pb.add_da as any)?.targetedEndDate || 'N/A'}
            </Text>
        )
    },
    {
        key: 'status',
        label: 'Status',
        render: (pb: Playbook) => {
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            const da = pb.add_da as any
            const workflow = da?.workflowData || {}
            let status: string | undefined
            if (workflow?.currentTask) {
                status = getStatusByTask(workflow.currentTask.step, workflow)
            }
            if (!status) {
                status = workflow.status ?? da?.status ?? ''
            }
            return <StatusBadge status={status || ''} fullWidth />
        }
    },
    {
        key: 'owner',
        label: 'Owner',
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (pb: Playbook) => renderEmailAvatars((pb.add_da as any)?.owner)
    },
    {
        key: 'requester',
        label: 'Requester',
        render: (pb: Playbook) =>
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderEmailAvatars((pb.add_da as any)?.requester)
    },
    {
        key: 'deciders',
        label: 'Deciders',
        render: (pb: Playbook) =>
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderEmailAvatars((pb.add_da as any)?.deciders)
    },
    {
        key: 'reviewers',
        label: 'Reviewers',
        render: (pb: Playbook) =>
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderEmailAvatars((pb.add_da as any)?.reviewers)
    },
    {
        key: 'stakeHolders',
        label: 'Stakeholders',
        render: (pb: Playbook) =>
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderEmailAvatars((pb.add_da as any)?.stakeHolders)
    },
    {
        key: 'eaArchitect',
        label: 'EA Architect',
        render: (pb: Playbook) =>
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderEmailAvatars((pb.add_da as any)?.eaArchitect)
    },
    {
        key: 'etpImpacting',
        label: 'ETP Impacting',
        render: (pb: Playbook) => (
            <Text color={'fg'}>
                {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                {(pb.add_da as any)?.etpImpacting === undefined
                    ? 'N/A'
                    : //eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (pb.add_da as any)?.etpImpacting === true
                      ? 'Yes'
                      : 'No'}
            </Text>
        )
    },
    {
        key: 'estimatedCost',
        label: 'Estimated Cost',
        render: (pb: Playbook) => (
            <Text color={'fg'}>
                {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                {(pb.add_da as any)?.estimatedCost || 'N/A'}
            </Text>
        )
    },
    {
        key: 'overallRisk',
        label: 'Overall Risk',
        render: (pb: Playbook) => (
            <Text color={'fg'}>
                {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                {(pb.add_da as any)?.overallRisk || 'N/A'}{' '}
            </Text>
        )
    },
    {
        key: 'createdAt',
        label: 'Created At',
        render: (pb: Playbook) => (
            <Text color={'fg'}>
                {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                {dayjs((pb.add_da as any)?.createdAt).format('MM/DD/YYYY')}
            </Text>
        )
    }
]

function renderEmailAvatars(emails: string[] | string | undefined) {
    const AVATAR_ROW_WIDTH = 260

    if (!emails || (Array.isArray(emails) && emails.length === 0)) {
        return (
            <Text fontSize='sm' color='fg'>
                N/A
            </Text>
        )
    }
    if (Array.isArray(emails)) {
        if (emails.length <= 3) {
            return (
                <Stack minW={AVATAR_ROW_WIDTH} maxW={AVATAR_ROW_WIDTH}>
                    {emails.map(email =>
                        email ? (
                            <AvatarTableRow key={email} email={email} stacked />
                        ) : null
                    )}
                </Stack>
            )
        } else {
            const firstThree = emails.slice(0, 3)
            return (
                <Stack
                    alignItems='flex-start'
                    minW={AVATAR_ROW_WIDTH}
                    maxW={AVATAR_ROW_WIDTH}
                >
                    {firstThree.map(email =>
                        email ? (
                            <AvatarTableRow key={email} email={email} stacked />
                        ) : null
                    )}
                    <AvatarShowMore users={emails} />
                </Stack>
            )
        }
    }
    return (
        <Box minW={AVATAR_ROW_WIDTH} maxW={AVATAR_ROW_WIDTH}>
            <AvatarTableRow email={emails} />
        </Box>
    )
}
