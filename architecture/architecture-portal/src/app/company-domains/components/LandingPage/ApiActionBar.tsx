/* istanbul ignore file */
import { Button, Box, HStack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { IconTime } from '@americanexpress/dls-icons'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { ApiAddDa, ApiEndpoint, ApiMetadata } from '@/app/company-domains/types'
import { NoPrefetchLink } from '@/components/ui'

interface ApiActionBarProps {
    additionalData: ApiAddDa
    api_metadata_id: string
    api_nm: string
    data: ApiMetadata & ApiEndpoint
    handleClick: (value: string) => void
    handleReorderSave: () => void
    handleShowHistory: () => void
    isAddCoEditorsVisible: boolean
    isAdmin: boolean
    isDeleteVisible: boolean
    isDeletedApi: boolean
    isDraggingDisabled: boolean
    isRestoreVisible: boolean
    isShowHistoryVisible: boolean
    onOpenCoEditors: () => void
    onStartReorder: () => void
    reviewers:
        | {
              isArchReviewer?: boolean
              isEArbReviewer?: boolean
              isEnggReviewer?: boolean
          }
        | undefined
    setIsEditRow: (
        id: string,
        data: ApiMetadata & ApiEndpoint,
        name: string,
        isApiEdit?: boolean
    ) => void
    showEditAction: boolean
}

const ApiActionBar = ({
    additionalData,
    api_metadata_id,
    api_nm,
    data,
    handleClick,
    handleReorderSave,
    handleShowHistory,
    isAddCoEditorsVisible,
    isAdmin,
    isDeleteVisible,
    isDeletedApi,
    isDraggingDisabled,
    isRestoreVisible,
    isShowHistoryVisible,
    onOpenCoEditors,
    onStartReorder,
    reviewers,
    setIsEditRow,
    showEditAction
}: ApiActionBarProps) => {
    const showNoActions =
        (data?.proposed &&
            !data.earb &&
            reviewers?.isEnggReviewer &&
            data?.darb_eng &&
            !reviewers?.isEArbReviewer) ||
        (data?.proposed &&
            !data.earb &&
            reviewers?.isArchReviewer &&
            data?.darb_arch &&
            !reviewers?.isEArbReviewer) ||
        (reviewers?.isEArbReviewer && data?.earb)

    return (
        <Box ml={5} className={styles.showButton}>
            <Box display='flex' gap='16px'>
                <Button
                    className={styles.Approve}
                    backgroundColor={'#006fcf'}
                    color={'#fff'}
                    size='sm'
                    onClick={() => {
                        setIsEditRow(
                            api_metadata_id,
                            { ...data, ebcm_da: [] },
                            api_nm
                        )
                    }}
                    disabled={isDeletedApi}
                >
                    Add / Propose Operation
                </Button>
                {isAddCoEditorsVisible && (
                    <Button
                        onClick={onOpenCoEditors}
                        size='sm'
                        backgroundColor={'white'}
                        border='1px solid #006fcf'
                        className={styles.coEditorsButton}
                        color={'#006fcf'}
                    >
                        Add / View Co-Editor(s)
                    </Button>
                )}
                {showEditAction ? (
                    <div>
                        <Button
                            className={styles.reject}
                            border='2px solid blue'
                            size='sm'
                            onClick={() => {
                                setIsEditRow(
                                    api_metadata_id,
                                    data,
                                    api_nm,
                                    true
                                )
                            }}
                            disabled={isDeletedApi}
                        >
                            Edit
                        </Button>
                    </div>
                ) : (
                    <> </>
                )}
                {isAdmin && (
                    <>
                        {isDraggingDisabled ? (
                            <Button
                                border='1px solid #006fcf'
                                backgroundColor='#fff'
                                color='#006fcf'
                                onClick={onStartReorder}
                                size='sm'
                                disabled={isDeletedApi}
                            >
                                Reorder Operations
                            </Button>
                        ) : (
                            <Button
                                border='1px solid #006fcf'
                                backgroundColor='#fff'
                                color='#006fcf'
                                onClick={handleReorderSave}
                                size='sm'
                                mr={3}
                                disabled={isDeletedApi}
                            >
                                Done
                            </Button>
                        )}
                    </>
                )}
                {showNoActions && (
                    <Button disabled size={'sm'}>
                        No Actions Available
                    </Button>
                )}
                {isDeleteVisible && (
                    <Button
                        backgroundColor={'white'}
                        color={'#ab0303'}
                        border='1px solid #ab0303'
                        size='sm'
                        onClick={() => handleClick('DELETE')}
                    >
                        Delete
                    </Button>
                )}
                {isRestoreVisible && (
                    <Button
                        className={styles.reject}
                        border='1px solid blue'
                        size='sm'
                        onClick={() => handleClick('RESTORE')}
                    >
                        Restore
                    </Button>
                )}
            </Box>
            <HStack
                className={styles.apiShowHistory}
                mr={6}
                justifyContent={'center'}
                gap={4}
            >
                {isShowHistoryVisible && (
                    <Button
                        color={'#3182ce'}
                        variant='plain'
                        onClick={handleShowHistory}
                        mr={6}
                        size={'sm'}
                        fontWeight={600}
                        fontSize='var(--apiFontSizeBase)'
                        _hover={{ textDecoration: 'underline' }}
                    >
                        <IconTime />
                        Show History
                    </Button>
                )}
                <Box>
                    {additionalData?.apiCatalogUrl ? (
                        <NoPrefetchLink
                            target='_blank'
                            href={additionalData?.apiCatalogUrl}
                            title='API Catalog Link'
                        >
                            <HStack
                                alignItems='center'
                                fontWeight='600'
                                gap={2}
                            >
                                <Image
                                    src='/company-domains/Explorer_logo_icon.svg'
                                    alt='Explorer Icon'
                                    width={18}
                                    height={18}
                                />{' '}
                                <Text as='span' color='#3182ce'>
                                    API Catalog
                                </Text>
                            </HStack>
                        </NoPrefetchLink>
                    ) : (
                        ''
                    )}
                </Box>
            </HStack>
        </Box>
    )
}

export default ApiActionBar
