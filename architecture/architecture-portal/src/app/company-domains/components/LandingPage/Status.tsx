/* istanbul ignore file */
import { Text, Badge } from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { statusMap } from '@/app/company-domains/constants'

const StatusBadge = ({
    status,
    rowExpanded
}: {
    status: keyof typeof statusMap
    rowExpanded: boolean
}) => {
    return (
        <Badge
            backgroundColor={statusMap[status]?.color ?? 'gray'}
            borderRadius={10}
            w='auto'
            px='8px'
            fontWeight={600}
        >
            <Text
                as='div'
                textAlign='center'
                color={rowExpanded && status == 'draft' ? 'white' : 'black'}
                className={styles.textDisplay}
            >
                {statusMap[status]?.label}
            </Text>
        </Badge>
    )
}

const statusKeyMap = {
    DRAFT: 'draft',
    PROPOSED: 'proposed',
    'ARB APPROVED': 'darbAppr',
    'DARB APPROVED': 'darbAppr',
    'EARB APPROVED': 'earbAppr',
    'API CATALOG': 'catalog',
    'DESIGN CERTIFIED': 'preCert',
    'PRODUCTION CERTIFIED': 'prodCert',
    DELETED: 'deleted',
    'NOT REGISTERED': 'notRegistered'
}

const Status = ({
    data,
    rowExpanded
}: {
    data: { status: string }
    rowExpanded: boolean
}) => {
    const normalStatus: keyof typeof statusKeyMap =
        data?.status === ''
            ? 'DRAFT'
            : (data?.status?.trim().toUpperCase() as keyof typeof statusKeyMap)

    const statusKey = statusKeyMap[normalStatus] || 'draft'

    return (
        <StatusBadge
            status={statusKey as keyof typeof statusMap}
            rowExpanded={rowExpanded}
        />
    )
}

const ApiType = ({
    data
}: {
    data: { endpoint_type: string; api_endpoint_type_nm: string }
}) => {
    const typeStatus =
        data.endpoint_type === 'Type A' ||
        data.api_endpoint_type_nm === 'Type A'
            ? 'typeA'
            : data.endpoint_type === 'Type B' ||
                data.api_endpoint_type_nm === 'Type B'
              ? 'typeB'
              : 'typeC'
    return <StatusBadge status={typeStatus} rowExpanded />
}

export default Status
export { StatusBadge, ApiType, statusKeyMap }
