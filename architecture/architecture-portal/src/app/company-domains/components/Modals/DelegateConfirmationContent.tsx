/* istanbul ignore file */
import { Button, Center, Dialog } from '@chakra-ui/react'
import { IconSuccess } from '@americanexpress/dls-icons'
import styles from '@/app/company-domains/domain-api-page.module.css'

interface ConfirmationSummary {
    title: string
    body: string
}

interface DelegateConfirmationContentProps {
    confirmationSummary: ConfirmationSummary
    onClose: () => void
}

const DelegateConfirmationContent = ({
    confirmationSummary,
    onClose
}: DelegateConfirmationContentProps) => {
    return (
        <>
            <Center margin={'20px 0px'} fontSize={'3rem'}>
                <IconSuccess color='success' size='xl' />
            </Center>
            <Dialog.Header
                className={styles.appDialogHeader}
                _dark={{
                    backgroundColor: '#111111',
                    color: 'white'
                }}
            >
                <Center w={'100%'}>{confirmationSummary.title}</Center>
            </Dialog.Header>
            <Dialog.Body className={styles.modalBody}>
                {confirmationSummary.body}
            </Dialog.Body>
            <Dialog.Footer>
                <Center w={'100%'}>
                    <Button
                        colorPalette={'blue'}
                        onClick={onClose}
                        className={styles.closeButton}
                    >
                        Close
                    </Button>
                </Center>
            </Dialog.Footer>
        </>
    )
}

export default DelegateConfirmationContent
