/* istanbul ignore file */
import React from 'react'
import { Box, Button, GridItem, Text, Flex } from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { IconWarning, IconCheck, IconClose } from '@americanexpress/dls-icons'
import { countryOptions } from '@/app/company-domains/constants'
import Select, { MultiValue } from 'react-select'
import ExpandableText from './ExpandableText'
import EbcmBadgeList from './EbcmBadgeList'
import { Tooltip } from '@/components/ui'
import Image from 'next/image'
import {
    ApiEndpoint,
    ApiMetadata,
    ConsumerCompanyDomainOption,
    Markets,
    OperationalFieldsProps
} from '@/app/company-domains/types'
import { NoPrefetchLink } from '@/components/ui'
import { IconLinkOut } from '@americanexpress/dls-icons'
import CodeText from '@/components/ui/CodeText'
import { getReactSelectStyles } from '../../utils/reactSelectStyles'
import { useTheme } from 'next-themes'

const OnboardingPending = () => (
    <Tooltip content='Pending API Catalog Onboarding'>
        <span>
            <IconWarning
                isFilled={true}
                color='caution'
                size='xl'
                style={{ fontSize: '22px' }}
            />
        </span>
    </Tooltip>
)

const OperationalFields: React.FC<OperationalFieldsProps> = ({
    api_endpoint_metadata_id,
    viewOnly,
    canEditPartially = false,
    tableData,
    isDeletedApi,
    isDeletedApiOperation,
    consumerCompanyDomainValue,
    handleConsumerCompanyDomainChange,
    handleConsumerCompanyDomainCancel,
    isEditConsumerCompanyDomain,
    setIsEditConsumerCompanyDomain,
    handleChange,
    handleSubmit,
    actualMarkets,
    handleConsumerCompanyDomainSave,
    consumerCompanyDomainName,
    isEditActualMarkets,
    setIsEditActualMarkets,
    intendedMarketsLabels,
    actualMarketsLabels,
    consumerCompanyDomainOptions,
    errorMessage,
    setErrorMessage,
    formValues,
    setFormValues
}) => {
    const data =
        tableData?.api_endpoint.find(
            (endpoint: ApiEndpoint) =>
                endpoint.api_endpoint_metadata_id === api_endpoint_metadata_id
        ) ?? ({} as ApiMetadata & ApiEndpoint)

    const canEditInline =
        canEditPartially && (data?.status || '').toLowerCase() !== 'draft'

    const createMarkup = (text: string) => {
        return { __html: text }
    }
    const { theme } = useTheme()

    return (
        <>
            <GridItem
                color={{
                    base: 'black',
                    _dark: 'white'
                }}
            >
                <Text className={styles.content}>Operation Name</Text>
                <Text className={styles.description}>
                    {data?.endpoint_operation || '--'}
                </Text>
            </GridItem>
            <GridItem>
                <Flex className={styles.content} alignItems='center' gap={2}>
                    <Text as='span'>Consumer Company Domain</Text>

                    {canEditInline && !isEditConsumerCompanyDomain && (
                        <Button
                            color={'#006fcf'}
                            onClick={() => setIsEditConsumerCompanyDomain(true)}
                            disabled={
                                viewOnly ||
                                isDeletedApi ||
                                isDeletedApiOperation
                            }
                            variant={'plain'}
                        >
                            Edit
                        </Button>
                    )}

                    {isEditConsumerCompanyDomain && (
                        <Box className={styles.editIcons} mb='10px'>
                            <IconCheck
                                title='Example icon'
                                titleId='example-icon-id'
                                className={styles.marketsCheckIcon}
                                onClick={handleConsumerCompanyDomainSave}
                            />
                            <IconClose
                                title='Example icon'
                                titleId='example-icon-id'
                                className={styles.marketsCloseIcon}
                                onClick={handleConsumerCompanyDomainCancel}
                            />
                        </Box>
                    )}
                </Flex>
                {isEditConsumerCompanyDomain ? (
                    <Select<ConsumerCompanyDomainOption, true>
                        isMulti
                        classNames={{
                            menu: () => styles.selectDropdownMenu
                        }}
                        value={consumerCompanyDomainValue}
                        onChange={handleConsumerCompanyDomainChange}
                        options={consumerCompanyDomainOptions}
                        className={styles.selectContainer}
                        styles={getReactSelectStyles(theme)}
                    />
                ) : (
                    <ExpandableText
                        className={styles.description}
                        styles={getReactSelectStyles(theme)}
                    >
                        <span>{consumerCompanyDomainName || '--'}</span>
                    </ExpandableText>
                )}
            </GridItem>
            <GridItem>
                <Text fontWeight='bold' className={styles.content} mb={2}>
                    Journey / Usecase Link
                </Text>
                {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href={data?.journey_link || '#'}
                    title='Journey Link'
                    className={`${styles.journeyLinkIcon} ${styles.journeyLink}`}
                >
                    <Flex alignItems='center'>
                        <Image
                            src='/company-domains/aplogo.svg'
                            alt='Architecture Portal Icon'
                            width={21}
                            height={21}
                        />
                        <Text ml={1}>Link</Text>
                    </Flex>
                </a>
            </GridItem>
            <GridItem
                color={{
                    base: 'black',
                    _dark: 'white'
                }}
            >
                <Text className={styles.content}>URI</Text>
                {data?.uri ? (
                    <CodeText text={data.uri} />
                ) : (
                    <OnboardingPending />
                )}
            </GridItem>
            <GridItem>
                <Text fontWeight='bold' className={styles.content} mb={2}>
                    API Type
                </Text>
                <Text className={styles.description}>
                    {data?.endpoint_type || '--'}
                </Text>
            </GridItem>
            <GridItem
                color={{
                    base: 'black',
                    _dark: 'white'
                }}
            >
                <Text className={styles.content}>Intended Markets</Text>
                <Text className={styles.description}>
                    {intendedMarketsLabels}
                </Text>
            </GridItem>
            <GridItem
                color={{
                    base: 'black',
                    _dark: 'white'
                }}
            >
                <Text className={styles.content}>
                    Currently Supported Markets
                    {canEditInline && !isEditActualMarkets && (
                        <Button
                            color={'#006fcf'}
                            onClick={() => setIsEditActualMarkets(true)}
                            disabled={
                                viewOnly ||
                                isDeletedApi ||
                                isDeletedApiOperation
                            }
                            variant={'plain'}
                        >
                            Edit
                        </Button>
                    )}
                </Text>
                {isEditActualMarkets ? (
                    <>
                        <Box className={styles.editForm}>
                            <Select
                                isMulti
                                classNames={{
                                    menu: () => styles.selectDropdownMenu
                                }}
                                name='actualMarkets'
                                value={formValues?.actualMarkets}
                                onChange={(newValue: MultiValue<Markets>) =>
                                    handleChange('actualMarkets', [
                                        ...newValue
                                    ] as Markets[])
                                }
                                options={countryOptions}
                                placeholder='Select countries'
                                data-testid='actual-markets'
                                className={styles.selectContainer}
                            />
                            <div className={styles.editIcons}>
                                <IconCheck
                                    title='Example icon'
                                    titleId='example-icon-id'
                                    className={styles.marketsCheckIcon}
                                    onClick={handleSubmit}
                                />
                                <IconClose
                                    title='Example icon'
                                    titleId='example-icon-id'
                                    className={styles.marketsCloseIcon}
                                    onClick={() => {
                                        setIsEditActualMarkets(false)
                                        setErrorMessage('')
                                        setFormValues({
                                            ...formValues,
                                            actualMarkets
                                        })
                                    }}
                                />
                            </div>
                        </Box>
                        {errorMessage && (
                            <div className={styles.errorMessage}>
                                {errorMessage}
                            </div>
                        )}
                    </>
                ) : (
                    <Text className={styles.description}>
                        {actualMarketsLabels}
                    </Text>
                )}
            </GridItem>
            <GridItem
                color={{
                    base: 'black',
                    _dark: 'white'
                }}
            >
                <Text className={styles.content}>Method</Text>
                <Text className={styles.description}>
                    {data?.verb ? (
                        <div
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={createMarkup(
                                typeof data?.verb === 'string' ? data.verb : ''
                            )}
                        />
                    ) : (
                        <OnboardingPending />
                    )}
                </Text>
            </GridItem>
            <GridItem
                color={{
                    base: 'black',
                    _dark: 'white'
                }}
            >
                <Text className={styles.content}>Description</Text>
                <ExpandableText className={styles.description}>
                    <span>{data?.endpoint_ds || '--'}</span>
                </ExpandableText>
            </GridItem>
            <GridItem>
                <Text fontWeight='bold' className={styles.content} mb={2}>
                    Input
                </Text>
                <ExpandableText className={styles.description}>
                    {data?.input ? (
                        <div
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={createMarkup(
                                data.input || '--'
                            )}
                        />
                    ) : (
                        '--'
                    )}
                </ExpandableText>
            </GridItem>
            <GridItem>
                <Text fontWeight='bold' className={styles.content} mb={2}>
                    Output
                </Text>
                <ExpandableText className={styles.description}>
                    {data?.output ? (
                        <div
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={createMarkup(
                                data?.output || '--'
                            )}
                        />
                    ) : (
                        '--'
                    )}
                </ExpandableText>
            </GridItem>
            <GridItem
                color={{
                    base: 'black',
                    _dark: 'white'
                }}
            >
                <Text className={styles.content}>Schema</Text>
                <Text>
                    {data?.api_catalog_url ? (
                        <NoPrefetchLink
                            href={data?.api_catalog_url}
                            target='_blank'
                            rel='noopener noreferrer'
                            title='API Catalog Link'
                        >
                            <Flex alignItems='center' fontWeight='400'>
                                <IconLinkOut />
                                Explorer
                            </Flex>
                        </NoPrefetchLink>
                    ) : (
                        <OnboardingPending />
                    )}
                </Text>
            </GridItem>
            <GridItem>
                <Text fontWeight='bold' className={styles.content} mb={2}>
                    EBCM
                </Text>
                <EbcmBadgeList
                    capabilities={data?.ebcm_v10}
                    fallbackNames={data?.ebcm_names}
                />
            </GridItem>
        </>
    )
}

export default OperationalFields
