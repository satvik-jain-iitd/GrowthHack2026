import { Badge, Box, Text } from '@chakra-ui/react'

export function getStatusByTask(
    task: string,
    workflowData: { [key: string]: string | boolean }
) {
    if (workflowData?.status === 'PROCESS_STATE_COMPLETED') {
        return workflowData.adrRejected ? 'rejected' : 'approved'
    }
    switch (task) {
        case 'WaitForBvBCriteriaMet':
            return 'awaitingAcceptance'
        case 'WaitForADRSubmission':
            return 'inProgress'
        case 'WaitForReviewers':
            return 'inReview'
        case 'WaitForDeciders':
            return 'awaitingApproval'
        default:
            return undefined
    }
}

export function getStatusLabel(text: string) {
    if (!text) return 'N/A'
    const result = text.replace(/([A-Z])/g, ' $1')
    return result.charAt(0).toUpperCase() + result.slice(1)
}

export default function StatusBadge({
    status,
    fullWidth
}: {
    status: string
    fullWidth?: boolean
}) {
    const statusColor: Record<string, string> = {
        awaitingAcceptance: 'orange',
        inProgress: 'gray',
        inReview: 'yellow',
        awaitingApproval: 'blue',
        approved: 'green',
        accepted: 'green',
        rejected: 'red',
        complete: 'green',
        open: 'default'
    }

    const colorScheme = statusColor[status]

    const badge = (
        <Badge
            data-testid='status-badge'
            colorPalette={colorScheme}
            px={3}
            py={1}
            borderRadius='md'
            fontSize='sm'
            width={fullWidth ? '100%' : 'auto'}
            display='flex'
            justifyContent='center'
            alignItems='center'
        >
            <Text
                data-testid='status-badge-label'
                width='100%'
                textAlign='center'
            >
                {getStatusLabel(status)}
            </Text>
        </Badge>
    )

    return fullWidth ? (
        <Box data-testid='status-badge-wrapper' width='100%'>
            {badge}
        </Box>
    ) : (
        badge
    )
}
