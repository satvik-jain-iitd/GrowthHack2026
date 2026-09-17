/* istanbul ignore file */
import {
    IconButton,
    Card,
    Heading,
    HStack,
    Text,
    VStack,
    Box,
    Separator,
    createIcon
} from '@chakra-ui/react'
import { Fragment, useState, useEffect } from 'react'
import {
    IconAlert,
    IconChevronDown,
    IconChevronUp,
    IconLinkOut,
    IconPaymentDue
} from '@americanexpress/dls-icons'
import Styles from '../metrics.module.css'
import { DOMAIN_API_MAP } from '@/app/company-domains/constants'
import { Domain } from '@/app/company-domains/types'
import Image from 'next/image'
import { NoPrefetchLink } from '@/components/ui'

const statusColors = {
    earb: '#FA700B',
    darb: '#F0D041',
    design: '#006FCF',
    prod: '#43A34C',
    pending: '#C8C9C7'
}

const CircleIcon = createIcon({
    displayName: 'CircleIcon',
    path: <circle cx='12' cy='12' r='6' fill='currentColor' />
})

const StatusText = ({
    type,
    count,
    noEARB,
    text,
    showCount = true,
    domainId,
    displayLink = true,
    apiId
}: {
    type?: string
    count?: number
    noEARB?: boolean
    text?: string
    showCount?: boolean
    domainId?: string
    displayLink?: boolean
    apiId?: string
}) => {
    return (
        <HStack width='100%' justifyContent='space-between' px='1.25rem'>
            <Text>
                <CircleIcon
                    size='lg'
                    color={
                        statusColors[
                            noEARB
                                ? 'pending'
                                : (type as keyof typeof statusColors)
                        ]
                    }
                />
                {displayLink
                    ? DOMAIN_API_MAP[domainId as keyof typeof DOMAIN_API_MAP]?.[
                          'e3'
                      ] && (
                          <NoPrefetchLink
                              href={`${DOMAIN_API_MAP[domainId as keyof typeof DOMAIN_API_MAP]['e3']}#${apiId}`}
                              className={Styles.navlink}
                          >
                              {text}
                          </NoPrefetchLink>
                      )
                    : text}
            </Text>
            {showCount && <Text>{count || 0}</Text>}
        </HStack>
    )
}

export default function MetricsDomainCard({
    domainInfo,
    data,
    tableViewOptions
}: {
    domainInfo: Domain | undefined
    data: Domain
    tableViewOptions: { filter: string; showAll: boolean }
}) {
    const [isFilled, setFilled] = useState(false)
    const [isExpand, setIsExpand] = useState(tableViewOptions.showAll || false)

    const {
        im_light_tx: imgLight,
        im_dark_tx: imgDark,
        im_fill_light_tx: imgFilledLight,
        im_fill_dark_tx: imgFilledDark,
        company_domain_id: domainId,
        domain_nm
    } = domainInfo || {}

    const {
        earb_approved_names_api: earb_approved_names,
        onboarded_catalog_names_api: onboarded_catalog_names,
        design_certified_names_api: design_certified_names,
        prod_certified_names_api: prod_certified_names,
        earb_approved_apis: earb,
        onboarded_catalog_apis: onboarded,
        design_certified_apis: design,
        prod_certified_apis: prod,
        darb_approved_apis: darb,
        proposed_apis: proposed
    } = data

    const total =
        +(earb || 0) + +(onboarded || 0) + +(design || 0) + +(prod || 0)
    const earbApiNames = earb_approved_names
        ? JSON.parse(earb_approved_names)
        : []
    const onboardedApiNames = onboarded_catalog_names
        ? JSON.parse(onboarded_catalog_names)
        : []
    const designApiNames = design_certified_names
        ? JSON.parse(design_certified_names)
        : []
    const prodApiNames = prod_certified_names
        ? JSON.parse(prod_certified_names)
        : []
    const noEARB = total === 0
    const isPendingApproval = noEARB && +(darb || 0) > 0
    const isPendingArbApproval =
        noEARB && +(darb || 0) === 0 && +(proposed || 0) > 0

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsExpand(tableViewOptions.showAll)
    }, [tableViewOptions.showAll])

    const handleMouseEnter = () => setFilled(true)
    const handleMouseLeave = () => setFilled(false)
    const toggleExpand = () => setIsExpand(prev => !prev)

    const cardMetrics = [
        { type: 'prod', count: +(prod || 0), text: 'Prod Certified APIs' },
        {
            type: 'design',
            count: +(design || 0) + +(prod || 0),
            text: 'Design Certified APIs'
        },
        {
            type: 'earb',
            count: total,
            text: 'EARB Approved APIs'
        }
    ]

    return (
        <Box bg='#f7f8fa' h='100%' borderRadius='3%'>
            <Card.Root
                key={domainId}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                height={'fit-content'}
                className='metrics-domain-card'
            >
                <Card.Header minH='80px' display='flex'>
                    <HStack>
                        <Image
                            className='image-light margin-1-b'
                            src={`data:image/png;base64, ${isFilled ? imgFilledLight : imgLight}`}
                            width={35}
                            height={35}
                            alt='Domain Icon'
                        />
                        <Image
                            className='image-dark margin-1-b'
                            src={`data:image/png;base64, ${isFilled ? imgFilledDark : imgDark}`}
                            width={35}
                            height={35}
                            alt='Domain Icon'
                        />
                        <Heading size='md' fontSize='1.3rem'>
                            {domain_nm}
                        </Heading>
                    </HStack>
                </Card.Header>
                <Card.Body pt='0.5rem' pl='0' pr='0' pb='0' minH={'115px'}>
                    <VStack height='100%'>
                        {[...cardMetrics]
                            .reverse()
                            .map(({ type, count, text }) => (
                                <StatusText
                                    key={type}
                                    text={text}
                                    type={type}
                                    count={count}
                                    noEARB={noEARB}
                                    displayLink={false}
                                />
                            ))}
                    </VStack>
                </Card.Body>
                <Card.Footer p='0'>
                    <VStack w='100%'>
                        <HStack
                            width='100%'
                            justify='space-between'
                            align='center'
                            bg={noEARB ? 'transparent' : '#006FCF'}
                            borderBottomLeftRadius={isExpand ? 0 : '0.375rem'}
                            borderBottomRightRadius={isExpand ? 0 : '0.375rem'}
                            onClick={!noEARB ? toggleExpand : undefined}
                            style={{ cursor: noEARB ? 'default' : 'pointer' }}
                        >
                            {!noEARB ? (
                                <>
                                    <Box
                                        color='white'
                                        fontWeight='bold'
                                        height='41px'
                                        pl='0.6rem'
                                        alignContent='center'
                                    >
                                        <IconButton
                                            variant='plain'
                                            pr='0.5rem'
                                            aria-describedby='icon-button-label'
                                            size='sm'
                                        >
                                            {isExpand ? (
                                                <IconChevronUp
                                                    title='Collapse'
                                                    size='sm'
                                                    titleId='Collapse'
                                                    isFilled
                                                    className={
                                                        Styles.expandIcon
                                                    }
                                                />
                                            ) : (
                                                <IconChevronDown
                                                    title='Expand'
                                                    size='sm'
                                                    isFilled
                                                    titleId='Expand'
                                                    className={
                                                        Styles.expandIcon
                                                    }
                                                />
                                            )}
                                        </IconButton>
                                        Total API Count
                                    </Box>
                                    <Text
                                        color='white'
                                        fontWeight='bold'
                                        pr='1.25rem'
                                    >
                                        {total}
                                    </Text>
                                </>
                            ) : (
                                <VStack width='100%' align='center'>
                                    <Separator
                                        flex='1'
                                        size='lg'
                                        variant='solid'
                                        colorPalette='#C8C9C7'
                                    />
                                    <Text
                                        height='32px'
                                        color={
                                            isPendingApproval
                                                ? statusColors.earb
                                                : isPendingArbApproval
                                                  ? statusColors.darb
                                                  : statusColors.pending
                                        }
                                        textAlign='center'
                                        pl='1.25rem'
                                        pr='1.25rem'
                                    >
                                        {isPendingApproval ? (
                                            <>
                                                <IconPaymentDue
                                                    title='Pending EARB Approval'
                                                    titleId='Pending EARB Approval'
                                                    size='sm'
                                                    isFilled
                                                    className={
                                                        Styles.contribPending
                                                    }
                                                />
                                                <Text as='span' pl='0.5rem'>
                                                    Pending EARB Approval
                                                </Text>
                                            </>
                                        ) : isPendingArbApproval ? (
                                            <>
                                                <IconPaymentDue
                                                    title='Pending ARB Approval'
                                                    titleId='Pending ARB Approval'
                                                    size='sm'
                                                    isFilled
                                                    className={
                                                        Styles.contribPending
                                                    }
                                                />
                                                <Text as='span' pl='0.5rem'>
                                                    Pending ARB Approval
                                                </Text>
                                            </>
                                        ) : (
                                            <>
                                                <IconAlert
                                                    title='Contribution Pending'
                                                    titleId='Contribution Pending'
                                                    size='sm'
                                                    className={
                                                        Styles.pendingApproval
                                                    }
                                                />
                                                <Text as='span' pl='0.5rem'>
                                                    Contribution Pending
                                                </Text>
                                            </>
                                        )}
                                    </Text>
                                </VStack>
                            )}
                        </HStack>
                        {isExpand && !noEARB && (
                            <VStack
                                height='100%'
                                width='100%'
                                mb='0.5rem'
                                justifyContent='space-between'
                            >
                                <Box
                                    width='100%'
                                    overflowY='auto'
                                    maxHeight={
                                        tableViewOptions.filter ===
                                        'withContributions'
                                            ? ''
                                            : '300px'
                                    }
                                >
                                    {cardMetrics.map(({ type }) => {
                                        let names
                                        if (type === 'earb') {
                                            names = [
                                                ...earbApiNames,
                                                ...onboardedApiNames
                                            ]
                                        } else if (type === 'design') {
                                            names = designApiNames
                                        } else {
                                            names = prodApiNames
                                        }
                                        return (
                                            <Fragment key={type}>
                                                {names?.map(
                                                    (
                                                        api: {
                                                            id: string
                                                            name: string
                                                        },
                                                        index: string
                                                    ) => (
                                                        <StatusText
                                                            key={
                                                                api.id || index
                                                            }
                                                            text={api.name}
                                                            type={type}
                                                            noEARB={noEARB}
                                                            showCount={false}
                                                            domainId={domainId}
                                                            apiId={api.id}
                                                        />
                                                    )
                                                )}
                                            </Fragment>
                                        )
                                    })}
                                </Box>
                                {DOMAIN_API_MAP[
                                    domainId as keyof typeof DOMAIN_API_MAP
                                ]?.['e3'] && (
                                    <NoPrefetchLink
                                        href={
                                            DOMAIN_API_MAP[
                                                domainId as keyof typeof DOMAIN_API_MAP
                                            ]['e3']
                                        }
                                        className={Styles.navlink}
                                    >
                                        <HStack align='center'>
                                            <Text>2.3 Company Domain API</Text>
                                            <IconLinkOut />
                                        </HStack>
                                    </NoPrefetchLink>
                                )}
                            </VStack>
                        )}
                    </VStack>
                </Card.Footer>
            </Card.Root>
        </Box>
    )
}
