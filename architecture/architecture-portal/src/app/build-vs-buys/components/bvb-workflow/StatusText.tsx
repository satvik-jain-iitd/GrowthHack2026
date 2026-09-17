import { getStatusByTask } from '@/app/build-vs-buys/components/StatusBadge'
import { Text } from '@chakra-ui/react'

function getStatus(data: object) {
    const jsonContent = JSON.parse(JSON.stringify(data))
    if (jsonContent.workflowData && jsonContent.workflowData?.currentTask) {
        return getStatusByTask(
            jsonContent.workflowData?.currentTask?.step,
            jsonContent.workflowData
        )
    }
    return jsonContent.status
}

const statusTextMap: { [key: string]: string } = {
    awaitingAcceptance: 'Awaiting Acceptance',
    inProgress: 'In Progress',
    inReview: 'In Review',
    awaitingApproval: 'Awaiting Approval',
    approved: 'Approved',
    rejected: 'Rejected'
}

export default function StatusText({ data }: { data: object }) {
    const workflowStatus = getStatus(data)

    return (
        <Text
            color={'#006FCF'}
            fontFamily='Helvetica'
            fontSize='16px'
            fontStyle='normal'
            fontWeight={700}
            lineHeight='normal'
            whiteSpace='nowrap'
        >
            {statusTextMap[workflowStatus]}
        </Text>
    )
}
