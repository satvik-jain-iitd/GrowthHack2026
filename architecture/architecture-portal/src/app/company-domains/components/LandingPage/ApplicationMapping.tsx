import React, { useEffect, useState } from 'react'
import {
    useDisclosure,
    Button,
    Center,
    Dialog,
    CloseButton
} from '@chakra-ui/react'
import styles from '@/app/company-domains/modals.module.css'
import { User } from '@/app/layout/AuthBlueSso'
import { useUserContext } from '@/context'
import { useDomainMapping, useEBCMMapping } from '@/app/company-domains/hooks'
import { ApplicationMappingConfirmationModal } from '../Modals'
import {
    Application,
    ApplicationCentralInfo
} from '@/app/company-domains/types'

const ApplicationMapping = ({
    modalDetails,
    applicationData,
    isLinked,
    isOpen,
    onClose,
    domainName,
    clearData
}: {
    modalDetails: { data?: string; name?: string; isLinked?: boolean }
    applicationData: (Application & ApplicationCentralInfo) | null

    isLinked: boolean
    isOpen: boolean
    onClose: () => void
    domainName: { id: string }
    clearData?: () => void
}) => {
    const {
        open: confirmationOpen,
        onOpen,
        onClose: confirmationClose
    } = useDisclosure()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const user: User | undefined = useUserContext()
    const userDetails = user?.attributes
    const { status, serverError, isLoading, fetchData, setServerError } =
        useDomainMapping()
    const {
        status: ebcmStatus,
        serverError: ebcmServerError,
        isLoading: ebcmIsLoading,
        fetchData: ebcmFetchData
    } = useEBCMMapping()

    const handleLinkEBCM = async () => {
        const payload = {
            car_id:
                applicationData?.application_id || applicationData?.id || '',
            capability: domainName,
            email_id: userDetails?.email
        }
        await ebcmFetchData(payload, isLinked)
    }

    const handleLinkDomain = async () => {
        const payload = {
            car_id:
                applicationData?.application_id || applicationData?.id || '',
            email_id: userDetails?.email,
            domain_id: domainName?.id
        }
        await fetchData(domainName?.id, payload, isLinked)
    }

    useEffect(() => {
        if (status && !serverError && !isLoading) {
            onOpen()
        } else if (serverError) {
            setErrorMessage(serverError)
            setServerError(serverError)
            onOpen()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, serverError])

    useEffect(() => {
        if (ebcmStatus && !ebcmServerError && !ebcmIsLoading) {
            onOpen()
            clearData?.()
        } else if (ebcmServerError && !ebcmStatus) {
            setErrorMessage(ebcmServerError)
            onOpen()
            clearData?.()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ebcmStatus, ebcmServerError])

    const getModalBody = () => {
        if (isLinked) {
            return (
                <Dialog.Body>
                    <span className={styles.modalBody}>
                        Are you sure you want to unlink Application{' '}
                    </span>
                    <div>
                        <b>
                            {applicationData?.application_nm ||
                                applicationData?.application_name ||
                                applicationData?.name}
                        </b>{' '}
                        from <b>{modalDetails.data}</b>?
                    </div>
                </Dialog.Body>
            )
        } else {
            return (
                <Dialog.Body className={styles.modalBodyText}>
                    Are you sure you want to link Application{' '}
                    <b>
                        {applicationData?.application_nm ||
                            applicationData?.application_name ||
                            applicationData?.name}
                    </b>{' '}
                    to <b>{modalDetails.data}</b>?
                </Dialog.Body>
            )
        }
    }

    return (
        <>
            <Dialog.Root
                open={isOpen}
                onOpenChange={isOpen => {
                    if (!isOpen) {
                        onClose()
                        clearData?.()
                    }
                }}
                placement='center'
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content className={styles.modalContent}>
                        <Dialog.Header
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                        >
                            <Dialog.Title>
                                <div className={styles.modalTitle}>
                                    {`You are about to 
                                ${isLinked ? 'unlink' : 'link'}
                                 the Application`}
                                </div>
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton onClick={onClose} />
                        </Dialog.CloseTrigger>
                        {getModalBody()}
                        <Dialog.Footer>
                            <Center w={'full'}>
                                <Button
                                    colorScheme={isLinked ? 'red' : 'green'}
                                    mr={3}
                                    padding='8px 16px'
                                    border={`1px solid ${isLinked ? 'red' : 'green'}`}
                                    borderRadius={10}
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='center'
                                    color='white'
                                    backgroundColor={isLinked ? 'red' : 'green'}
                                    _hover={{
                                        backgroundColor: isLinked
                                            ? '#cc0000'
                                            : '#008000'
                                    }}
                                    onClick={
                                        modalDetails.name === 'EBCM'
                                            ? handleLinkEBCM
                                            : handleLinkDomain
                                    }
                                >
                                    Yes, {isLinked ? 'Unlink' : 'Link'}
                                </Button>
                                <Button
                                    border={'1px solid #006fcf'}
                                    color='#006fcf'
                                    background={{
                                        base: 'white',
                                        _dark: 'black'
                                    }}
                                    onClick={() => {
                                        onClose()
                                        clearData?.()
                                    }}
                                >
                                    No, Cancel
                                </Button>
                            </Center>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
            <ApplicationMappingConfirmationModal
                label={isLinked ? 'Unlinked' : 'Linked'}
                isOpen={confirmationOpen}
                onClose={confirmationClose}
                modalClose={onClose}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                onConfirm={clearData}
            />
        </>
    )
}

export default ApplicationMapping
