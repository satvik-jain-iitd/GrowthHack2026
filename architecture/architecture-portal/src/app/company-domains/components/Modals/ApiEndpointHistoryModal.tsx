/* istanbul ignore file */
import React from 'react'
import { Button, CloseButton, Dialog } from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import ApiEndPointTable from '../LandingPage/ApiEndpointTable'
import { HistoryData } from '@/app/company-domains/hooks'

interface Column {
    isSortable: boolean
    name: string
    title: string
    key: string
}

export const ApiEndpointHistoryModal = (props: {
    isOpen: boolean
    onClose: () => void
    columns: Column[]
    data: HistoryData[]
    isLoading: boolean
    api_nm: string
}) => {
    const { isOpen, onClose, columns, data, isLoading, api_nm } = props

    const handleClose = () => {
        onClose()
    }

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={e => !e.open && handleClose()}
            placement='center'
        >
            <Dialog.Backdrop width={'100%'} height={'100%'} />
            <Dialog.Positioner>
                <Dialog.Content
                    style={{ width: '80%', maxWidth: '1700px' }}
                    height={{ mdDown: '80%' }}
                    overflow={'auto'}
                >
                    <Dialog.CloseTrigger asChild>
                        <CloseButton />
                    </Dialog.CloseTrigger>
                    <Dialog.Header
                        className={styles.appDialogHeader}
                        _dark={{
                            backgroundColor: '#111111 !important',
                            color: 'white'
                        }}
                    >
                        Audit Logs for API: {api_nm}
                    </Dialog.Header>

                    <Dialog.CloseTrigger />
                    <Dialog.Body>
                        <ApiEndPointTable
                            columns={columns}
                            data={data}
                            isLoading={isLoading}
                        />
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button
                            variant='outline'
                            colorPalette='blue'
                            onClick={handleClose}
                            className={styles.closeButton}
                        >
                            Close
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
