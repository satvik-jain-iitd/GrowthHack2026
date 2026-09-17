/* istanbul ignore file */
import {
    Dialog,
    Center,
    Button,
    Box,
    ProgressCircle,
    AbsoluteCenter,
    Link
} from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'

interface OperationScoreDataProps {
    apiScore: {
        totalScore?: number
        apiDataStandards?: string
        metadataStandards?: string
        apiDesignPattern?: string
        payloadStandards?: string
        securityStandards?: string
        apiEndpointAndProtocolStandards?: string
    }
}

interface OperationScoreModalProps {
    isOpen: boolean
    closeDialog: () => void
    operationName: string
    apiScoreData: OperationScoreDataProps
    api_catalog_url: string
}

export const OperationScoreModal: React.FC<OperationScoreModalProps> = ({
    isOpen,
    closeDialog,
    operationName,
    apiScoreData,
    api_catalog_url
}) => {
    const apiScore = apiScoreData?.apiScore || {}
    const scoreItems = [
        {
            key: 'apiDataStandards',
            value: apiScore?.apiDataStandards,
            label: 'API Data Standards'
        },
        {
            key: 'apiDesignPattern',
            value: apiScore?.apiDesignPattern,
            label: 'API Design Pattern'
        },
        {
            key: 'payloadStandards',
            value: apiScore?.payloadStandards,
            label: 'Payload Standards'
        },
        {
            key: 'metadataStandards',
            value: apiScore?.metadataStandards,
            label: 'Metadata Standards'
        },
        {
            key: 'securityStandards',
            value: apiScore?.securityStandards,
            label: 'Security Standards'
        },
        {
            key: 'apiEndpointAndProtocolStandards',
            value: apiScore?.apiEndpointAndProtocolStandards,
            label: 'API Endpoint and Protocol Standards'
        }
    ]

    return (
        <Dialog.Root open={isOpen} placement='center' size={'lg'}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Box
                            className={styles.apiScoreHeader}
                            w={'100%'}
                            color={'black'}
                            _dark={{ color: 'white' }}
                            lineHeight={'30px'}
                        >
                            {`Design Score for ${operationName || ''}`}
                        </Box>
                    </Dialog.Header>
                    <Dialog.Body>
                        <div className={styles.apiScoreContainer}>
                            <div className={styles.apiScoreData}>
                                <ProgressCircle.Root
                                    size={'lg'}
                                    key={'lg'}
                                    value={Number(apiScore?.totalScore) || 0}
                                    colorPalette={'blue'}
                                    className={styles.progressCircle}
                                >
                                    <ProgressCircle.Circle
                                        css={{
                                            '--thickness': '15px',
                                            '--size': '110px'
                                        }}
                                    >
                                        <ProgressCircle.Track />
                                        <ProgressCircle.Range />
                                    </ProgressCircle.Circle>
                                    <AbsoluteCenter>
                                        <ProgressCircle.ValueText />
                                    </AbsoluteCenter>
                                </ProgressCircle.Root>
                                {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                                <Link
                                    href={api_catalog_url + '#apiQuality'}
                                    style={{ textDecoration: 'none' }}
                                    target='_blank'
                                    tabIndex={-1}
                                >
                                    View Full Report
                                </Link>
                            </div>
                            <Box
                                w={'100%'}
                                color={'black'}
                                _dark={{ color: 'white' }}
                                className={styles.apiScoreDetails}
                            >
                                {scoreItems.map(
                                    item =>
                                        item.value && (
                                            <div
                                                key={item.key}
                                                className={styles.apiScoreRow}
                                            >
                                                <p
                                                    className={
                                                        styles.apiScoreValue
                                                    }
                                                >
                                                    {item.value}%
                                                </p>
                                                <span
                                                    className={
                                                        styles.apiScoreLabel
                                                    }
                                                >
                                                    {item.label}
                                                </span>
                                            </div>
                                        )
                                )}
                            </Box>
                        </div>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Center w={'100%'}>
                            <Button
                                colorPalette={'blue'}
                                onClick={closeDialog}
                                color={'#fff'}
                                className={styles.Approve}
                            >
                                Close
                            </Button>
                        </Center>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
