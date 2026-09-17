/* istanbul ignore file */
import React, { useState, useEffect, useMemo } from 'react'
import {
    Button,
    Center,
    Dialog,
    Field,
    useDisclosure,
    NativeSelect,
    CloseButton,
    Text
} from '@chakra-ui/react'
import { User } from '@/app/layout/AuthBlueSso'
import { useUserContext } from '@/context'
import ApplicationMapping from '@/app/company-domains/components/LandingPage/ApplicationMapping'
import {
    Application,
    ApplicationCentralInfo
} from '@/app/company-domains/types'
import { IconLink } from '@americanexpress/dls-icons'
import { useDomainContext } from '@/context/DomainContext'

const excludeDomains = [
    '5251721f-6aef-444f-8d9f-91275d44595c',
    '3a57ac2c-f971-4f93-9ef6-ebadd660dc1e',
    '0e2318e6-67fa-42ad-9156-913004072565',
    '6f6fc45f-62c3-47d8-b4e7-a9edeaa124f7',
    '83c42edb-40a7-4c83-b833-f6c1198bc33c'
]

const LinkApplication = ({
    data,
    modalDetails,
    isOpen,
    onClose
}: {
    data: (Application & ApplicationCentralInfo) | null
    modalDetails: { name?: string; data?: string; isLinked?: boolean }
    isOpen: boolean
    onClose: () => void
}) => {
    const {
        open: linkModalIsOpen,
        onOpen: linkModalOpen,
        onClose: linkModalClose
    } = useDisclosure()

    const { domains: companyDomainList } = useDomainContext() || {}
    const filteredDomainList = useMemo(() => {
        return companyDomainList?.filter(
            item => !excludeDomains.includes(item.company_domain_id || '')
        )
    }, [companyDomainList])

    const user: User | undefined = useUserContext()
    const userDomains = user?.userDirectoryAccess?.domains
    const isAdmin = user?.userDirectoryAccess?.admin

    const updatedDomainList = useMemo(() => {
        return filteredDomainList?.filter(item =>
            isAdmin
                ? item
                : (userDomains?.length || 0) > 0 &&
                  userDomains?.includes(item?.company_domain_id || '') &&
                  item
        )
    }, [filteredDomainList, isAdmin, userDomains])

    const sortedDomainList = useMemo(() => {
        const allowedItems = filteredDomainList?.filter(item =>
            userDomains?.includes(item?.company_domain_id || '')
        )
        const disabledItems = filteredDomainList?.filter(
            item => !userDomains?.includes(item?.company_domain_id || '')
        )
        return [...(allowedItems || []), ...(disabledItems || [])]
    }, [filteredDomainList, userDomains])

    const [domainName, setDomainName] = useState<{
        id?: string
        name?: string
    }>({})

    // Update domainName only when the modal opens and domainName is empty
    useEffect(() => {
        if (isOpen && !domainName.id && updatedDomainList?.length) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDomainName({
                id: updatedDomainList[0]?.company_domain_id,
                name: updatedDomainList[0]?.domain_nm
            })
        }
    }, [isOpen, updatedDomainList, domainName.id])

    const onCloseModal = () => {
        onClose()
        setDomainName({})
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = e.target.options[e.target.selectedIndex]
        const selectedId = selectedOption.getAttribute('data-id') || ''
        const selectedName = e.target.value

        setDomainName({ id: selectedId, name: selectedName })
    }

    return (
        <>
            <Dialog.Root
                size='xl'
                open={isOpen}
                onOpenChange={e => !e.open && onCloseModal()}
                placement='center'
                closeOnInteractOutside={true}
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header pb='2'>
                            <Dialog.Title style={{ fontWeight: 'bolder' }}>
                                {data?.application_nm ||
                                    data?.application_name ||
                                    data?.name}
                            </Dialog.Title>
                        </Dialog.Header>
                        <Text
                            style={{
                                paddingLeft: '24px',
                                paddingRight: '40px',
                                fontWeight: '700',
                                color: '#53565a'
                            }}
                        >
                            Select a Company Domain below to link this
                            Application to.
                        </Text>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton onClick={onClose} />
                        </Dialog.CloseTrigger>
                        <Dialog.Body pb={6}>
                            <Field.Root>
                                <Field.Label
                                    htmlFor='Company Domain'
                                    fontWeight='500'
                                    mt='25px'
                                >
                                    Company Domain
                                </Field.Label>
                                <NativeSelect.Root>
                                    <NativeSelect.Field
                                        id='Company Domain'
                                        value={domainName?.name || ''}
                                        onChange={handleChange}
                                    >
                                        {sortedDomainList?.map(
                                            (item, index) => (
                                                <option
                                                    key={index}
                                                    value={item.domain_nm}
                                                    data-id={
                                                        item.company_domain_id
                                                    }
                                                    disabled={
                                                        isAdmin
                                                            ? false
                                                            : !userDomains?.includes(
                                                                  item?.company_domain_id ||
                                                                      ''
                                                              )
                                                    }
                                                    style={{
                                                        color: updatedDomainList
                                                            ?.map(
                                                                ({
                                                                    company_domain_id
                                                                }) =>
                                                                    company_domain_id
                                                            )
                                                            ?.includes(
                                                                item?.company_domain_id
                                                            )
                                                            ? 'gray'
                                                            : 'normal'
                                                    }}
                                                >
                                                    {item.domain_nm}
                                                </option>
                                            )
                                        )}
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Field.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Center w={'100%'} gap={4}>
                                <Button
                                    className='linkButton'
                                    disabled={!domainName.id}
                                    onClick={() => {
                                        onClose()
                                        linkModalOpen()
                                    }}
                                    variant='solid'
                                    colorPalette='green'
                                >
                                    <IconLink color='white' />
                                    Link
                                </Button>
                                <Button
                                    className='cancelButton'
                                    onClick={onCloseModal}
                                    variant='outline'
                                    colorPalette='blue'
                                    _hover={{
                                        background: 'transparent',
                                        borderColor: 'currentColor',
                                        color: 'inherit'
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Center>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
            <ApplicationMapping
                modalDetails={{
                    ...modalDetails,
                    data: domainName?.name
                }}
                applicationData={data}
                isLinked={false}
                isOpen={linkModalIsOpen}
                onClose={linkModalClose}
                domainName={{ id: domainName?.id || '' }}
                clearData={() => {}}
            />
        </>
    )
}

export default LinkApplication
