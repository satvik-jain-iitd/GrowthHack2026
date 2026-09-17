'use client'

import React, { useState } from 'react'
import {
    Box,
    Button,
    Grid,
    GridItem,
    Table,
    VStack,
    Heading,
    Card,
    HStack,
    Text,
    Flex,
    Badge
} from '@chakra-ui/react'
import {
    IconBusiness,
    IconChevronRight,
    IconConstruction,
    IconEdit,
    IconFilter,
    IconGlobal,
    IconInfo,
    IconLaptop,
    IconLink
} from '@americanexpress/dls-icons'
import { AIIcon } from '@/components/icons/AIIcon'
import Image from 'next/image'
import { NoPrefetchLink, Tooltip } from '@/components/ui'
import { CJ_DETAILS_TEST_IDS } from '../test-ids'
import { CDAAS_URL } from '@/constants'
import { ECJChangeModal } from '@/app/enterprise-customer-journeys/components'
import { useSubmitECJChangeModalRequest } from '@/app/enterprise-customer-journeys/hooks'
import {
    getAbsoluteOperationUrl,
    getUrlByDomainId
} from '@/app/company-domains/constants/domainApiMap'

/**
 * An API endpoint the stage is linked to in the graph, via
 * JourneyStage -[:ENABLED_BY]-> CompanyDomainAPIEndpoint. api_nm is the
 * operation description, and no link is sent: it is built from the two ids.
 */
export interface StageApiEndpoint {
    api_endpoint_mtda_id: string
    api_nm: string
    prim_company_domain_id: string
    type_a: boolean
    market?: string[]
}

/** The legacy denormalized shape from the JourneyStage node's apis_da blob. */
export interface StageLegacyApi {
    api_nm: string
    operation_nm?: string
    api_metadata_id: string
    prim_company_domain_id: string
    type_a: boolean
    add_da: {
        architecturePortalUrl: string
    }
    market?: string[]
}

export interface JourneyStage {
    journey_stage_id: string
    journey_stage_name: string
    capabilities: {
        capability_id: string
        capability_nm: string
        capability_key_tx: string
    }[]
    /**
     * Set when the stage has endpoint edges in the graph, in which case
     * apis_da is absent. Exactly one of the two is ever populated.
     */
    apis?: StageApiEndpoint[]
    apis_da?: StageLegacyApi[]
    company_domains: {
        company_domain_id: string
        domain_nm: string
        playbook_id: string
    }[]
    applications?: {
        application_nm: string
        application_id: string
        market: string[]
    }[]
    touch_point?: string[]
    business_action?: {
        business_action_nm: string
        journey_variant: string
    }[]
}

export interface CustomerJourney {
    journey_id: string
    journey_statement: string
    journey_desc?: string
    journey_grp_tx: string
    journey_link?: string
    customer_tx: string[]
    persona?: string[]
    market: string[]
    product: string[]
    journey_stages?: JourneyStage[]
    channel?: string[]
    reviewed: boolean
    ai_generated: boolean
    user_proposed?: boolean
}

/**
 * Shared by both API shapes. An empty href renders as plain text — that covers
 * non-Type-A entries as well as endpoints whose domain has no docs URL mapped
 * for the current environment, which would otherwise be a dead link.
 */
const ApiCard = ({
    id,
    label,
    href
}: {
    id: string
    label: string
    href: string
}) => (
    <Card.Root
        size='sm'
        bg={{ base: '#E4F5F4', _dark: 'green.800' }}
        borderColor={'#0E7F79'}
        borderWidth='1.8px'
        boxShadow='md'
        transition='transform 0.3s, box-shadow 0.3s'
        _hover={
            href
                ? {
                      transform: 'translateY(-4px)',
                      boxShadow: 'xl',
                      cursor: 'pointer'
                  }
                : {}
        }
    >
        {href ? (
            <NoPrefetchLink
                data-testid={CJ_DETAILS_TEST_IDS.apiLink(id)}
                href={href}
            >
                <Card.Body
                    color='text.subtle'
                    whiteSpace='normal'
                    wordWrap='break-word'
                    fontWeight='501'
                >
                    {label}
                </Card.Body>
            </NoPrefetchLink>
        ) : (
            <Card.Body
                data-testid={CJ_DETAILS_TEST_IDS.apiText(id)}
                whiteSpace='normal'
                wordWrap='break-word'
                fontWeight='501'
                color='text.subtle'
            >
                {label}
            </Card.Body>
        )}
    </Card.Root>
)

/** Strips scheme and host so the link stays in-app via NoPrefetchLink. */
const toRelativeUrl = (absoluteUrl: string) =>
    absoluteUrl ? '/' + absoluteUrl.split('/').slice(3).join('/') : ''

/**
 * getAbsoluteOperationUrl only blanks its result when the operation id is also
 * empty, so an unmapped domain would otherwise yield a bare `<origin>#<id>`
 * pointing at the portal root. Resolving the domain first is what makes the
 * plain-text fallback actually trigger.
 */
const endpointDocsUrl = (domainId: string, endpointId: string) =>
    getUrlByDomainId(domainId)
        ? toRelativeUrl(getAbsoluteOperationUrl(domainId, endpointId))
        : ''

const dedupeBy = <T,>(items: T[], key: (item: T) => string): T[] =>
    items.filter(
        (item, i, self) => i === self.findIndex(o => key(o) === key(item))
    )

export const CustomerJourneyDetails = ({
    journey
}: {
    journey: CustomerJourney
}) => {
    const [selectedMarkets, setSelectedMarkets] = useState<Set<string>>(
        new Set()
    )
    const [isOpenChangeModal, setIsOpenChangeModal] = useState(false)
    const { handleSubmitECJChangeModal, isSubmitting } =
        useSubmitECJChangeModalRequest()

    const variants = [
        ...new Set(
            journey.journey_stages?.flatMap(s =>
                (s.business_action || [])
                    .map(a => a.journey_variant)
                    .filter(v => v && v !== 'Shared')
            )
        )
    ]
    const [selectedVariants, setSelectedVariants] = useState<Set<string>>(
        new Set()
    )

    const matchesSelectedMarket = (markets?: string[]) =>
        !markets ||
        markets.length <= 0 ||
        markets.some(m => selectedMarkets.has(m) || m === 'Global')

    const stages =
        selectedMarkets.size > 0
            ? journey.journey_stages?.map(stage => ({
                  ...stage,
                  apis: stage.apis?.filter(api =>
                      matchesSelectedMarket(api.market)
                  ),
                  apis_da: stage.apis_da?.filter(api =>
                      matchesSelectedMarket(api.market)
                  ),
                  applications: stage.applications?.filter(
                      app =>
                          !app.market ||
                          app.market.length <= 0 ||
                          app?.market?.some(
                              m => selectedMarkets.has(m) || m === 'Global'
                          )
                  ),
                  business_action:
                      selectedVariants.size > 0
                          ? stage.business_action?.filter(
                                ba =>
                                    selectedVariants.has(ba.journey_variant) ||
                                    ba.journey_variant === 'Shared'
                            )
                          : stage.business_action
              }))
            : journey.journey_stages

    return (
        <Box
            p={4}
            borderRadius='md'
            boxShadow='sm'
            minWidth='100%'
            minH='70vh'
            overflowX='scroll'
            background='surface.default.offwhite'
        >
            <Box
                marginBottom={5}
                paddingY={1}
                background='surface.white'
                borderRadius='17px'
                width='100%'
            >
                <HStack
                    marginTop={8}
                    alignItems='center'
                    justifyContent='space-between'
                    width='100%'
                >
                    <Text
                        data-testid={CJ_DETAILS_TEST_IDS.journeyLabel}
                        marginLeft='3rem'
                        fontSize='14px'
                        color='text.subtle'
                    >
                        CUSTOMER JOURNEY:
                    </Text>
                    <HStack marginRight='3rem'>
                        {journey.ai_generated && !journey.reviewed && (
                            <Badge
                                padding='8px 16px'
                                fontSize='16px'
                                borderRadius='var(--Radius, 100px)'
                                border='1px solid var(--Status-Colors-Status-Attention, #FDB92D)'
                                background='rgba(253, 185, 45, 0.20)'
                            >
                                <AIIcon width={20} height={20} />
                                <Text
                                    color='var(--Brand-Colors-Primary-Deep-Blue, #00175A)'
                                    textAlign='center'
                                    fontFeatureSettings="'liga' off, 'clig' off"
                                    fontSize='var(--Font-Label-font-size, 16px)'
                                    fontStyle='normal'
                                    fontWeight='510'
                                    lineHeight='var(--Font-Label-line-height, 24px)'
                                >
                                    AI Generated: Pending Review
                                </Text>
                            </Badge>
                        )}
                        <Button
                            colorPalette='blue'
                            variant='outline'
                            onClick={() => setIsOpenChangeModal(true)}
                            borderRadius={'8px'}
                        >
                            <IconEdit color='blue' isFilled={false} />
                            <Text fontWeight={'bold'}>Propose a Change</Text>
                        </Button>
                    </HStack>
                </HStack>
                <Heading
                    data-testid={CJ_DETAILS_TEST_IDS.journeyStatement}
                    size='3xl'
                    marginBottom={3}
                    marginLeft='3rem'
                    color='graphic.brandAlt'
                >
                    {journey.journey_statement}
                </Heading>
                <Text
                    data-testid={CJ_DETAILS_TEST_IDS.journeyDesc}
                    marginBottom={5}
                    marginLeft='3rem'
                    maxW='50%'
                >
                    {journey.journey_desc}
                </Text>
                <Box p={3} bg='transparent' marginBottom={8} marginX='2.1rem'>
                    <Flex justifyContent={'space-between'}>
                        <HStack
                            width='100%'
                            justifyContent='space-between'
                            alignItems='flex-start'
                        >
                            {journey.customer_tx.length > 0 && (
                                <VStack alignItems='left'>
                                    <HStack>
                                        <Text
                                            data-testid={
                                                CJ_DETAILS_TEST_IDS.customerLabel
                                            }
                                            fontWeight='bold'
                                            fontSize='18px'
                                        >
                                            Customer Category
                                        </Text>
                                        <Tooltip
                                            showArrow
                                            content={
                                                'The types of customers who may use this journey.'
                                            }
                                            contentProps={{
                                                css: {
                                                    '--tooltip-bg': 'grey'
                                                }
                                            }}
                                        >
                                            <IconInfo size='md' color='brand' />
                                        </Tooltip>
                                    </HStack>
                                    <HStack>
                                        {journey.customer_tx.map(c => (
                                            <Badge
                                                data-testid={CJ_DETAILS_TEST_IDS.customerBadge(
                                                    c
                                                )}
                                                key={c}
                                                as='div'
                                                width='fit-content'
                                                bg={{
                                                    base: '#ECEDEE',
                                                    _dark: 'gray.800'
                                                }}
                                                padding='8px 16px'
                                                fontSize='16px'
                                            >
                                                {c}
                                            </Badge>
                                        ))}
                                    </HStack>
                                </VStack>
                            )}

                            {journey.persona && journey.persona.length > 0 && (
                                <VStack alignItems='left'>
                                    <HStack>
                                        <Text
                                            data-testid={
                                                CJ_DETAILS_TEST_IDS.personaLabel
                                            }
                                            fontWeight='bold'
                                            fontSize='18px'
                                        >
                                            Customer
                                        </Text>
                                        <Tooltip
                                            showArrow
                                            content={
                                                'The main actor and beneficiary of the journey.'
                                            }
                                            contentProps={{
                                                css: {
                                                    '--tooltip-bg': 'grey'
                                                }
                                            }}
                                        >
                                            <IconInfo size='md' color='brand' />
                                        </Tooltip>
                                    </HStack>
                                    <HStack>
                                        {journey.persona?.map(p => (
                                            <Badge
                                                data-testid={CJ_DETAILS_TEST_IDS.personaBadge(
                                                    p
                                                )}
                                                key={p}
                                                as='div'
                                                width='fit-content'
                                                bg={{
                                                    base: '#ECEDEE',
                                                    _dark: 'gray.800'
                                                }}
                                                padding='8px 16px'
                                                fontSize='16px'
                                            >
                                                {p}
                                            </Badge>
                                        ))}
                                    </HStack>
                                </VStack>
                            )}

                            {journey.product.length > 0 && (
                                <VStack alignItems='left'>
                                    <HStack>
                                        <Text
                                            data-testid={
                                                CJ_DETAILS_TEST_IDS.productLabel
                                            }
                                            fontWeight='bold'
                                            fontSize='18px'
                                        >
                                            Product
                                        </Text>
                                        <Tooltip
                                            showArrow
                                            content={
                                                'The business-defined solution associated with the journey.'
                                            }
                                            contentProps={{
                                                css: {
                                                    '--tooltip-bg': 'grey'
                                                }
                                            }}
                                        >
                                            <IconInfo size='md' color='brand' />
                                        </Tooltip>
                                    </HStack>
                                    <VStack alignItems='flex-start'>
                                        {journey.product.map(p => (
                                            <Badge
                                                data-testid={CJ_DETAILS_TEST_IDS.productBadge(
                                                    p
                                                )}
                                                key={p}
                                                as='div'
                                                width='fit-content'
                                                bg={{
                                                    base: '#ECEDEE',
                                                    _dark: 'gray.800'
                                                }}
                                                padding='8px 16px'
                                                fontSize='16px'
                                            >
                                                {p}
                                            </Badge>
                                        ))}
                                    </VStack>
                                </VStack>
                            )}

                            {journey.channel && journey.channel?.length > 0 && (
                                <VStack alignItems='left'>
                                    <HStack>
                                        <Text fontWeight='bold' fontSize='18px'>
                                            Channel
                                        </Text>
                                        <Tooltip
                                            showArrow
                                            content={
                                                'How the customer interacts with the business.'
                                            }
                                            contentProps={{
                                                css: {
                                                    '--tooltip-bg': 'grey'
                                                }
                                            }}
                                        >
                                            <IconInfo size='md' color='brand' />
                                        </Tooltip>
                                    </HStack>
                                    <VStack alignItems='flex-start'>
                                        {journey.channel.map(c => (
                                            <Badge
                                                key={c}
                                                as='div'
                                                width='fit-content'
                                                bg={{
                                                    base: '#ECEDEE',
                                                    _dark: 'gray.800'
                                                }}
                                                padding='8px 16px'
                                                fontSize='16px'
                                            >
                                                {c}
                                            </Badge>
                                        ))}
                                    </VStack>
                                </VStack>
                            )}

                            {variants.length > 0 && (
                                <VStack alignItems='left'>
                                    <HStack>
                                        <IconFilter
                                            color='brand'
                                            style={{
                                                fontSize: '25px',
                                                height: '25px'
                                            }}
                                        />
                                        <Text fontWeight='bold' fontSize='18px'>
                                            Variant
                                        </Text>
                                        <Tooltip
                                            showArrow
                                            content={
                                                'A version of the journey that applies in specific cases.'
                                            }
                                            contentProps={{
                                                css: {
                                                    '--tooltip-bg': 'grey'
                                                }
                                            }}
                                        >
                                            <IconInfo size='md' color='brand' />
                                        </Tooltip>
                                    </HStack>
                                    <Grid
                                        templateColumns='repeat(1, 0.9fr)'
                                        gap='0.75rem'
                                    >
                                        {variants
                                            .filter(v => v !== 'Shared')
                                            .map(v => (
                                                <Badge
                                                    key={v}
                                                    as='div'
                                                    width='fit-content'
                                                    fontSize='16px'
                                                    padding='8px 16px'
                                                    bg={
                                                        selectedVariants.has(v)
                                                            ? '#0066BE'
                                                            : {
                                                                  base: '#ECEDEE',
                                                                  _dark: 'gray.800'
                                                              }
                                                    }
                                                    color={
                                                        selectedVariants.has(v)
                                                            ? 'white'
                                                            : undefined
                                                    }
                                                    cursor='pointer'
                                                    onClick={() =>
                                                        setSelectedVariants(
                                                            prev => {
                                                                const next =
                                                                    new Set(
                                                                        prev
                                                                    )
                                                                if (
                                                                    next.has(v)
                                                                ) {
                                                                    next.delete(
                                                                        v
                                                                    )
                                                                } else {
                                                                    next.add(v)
                                                                }
                                                                return next
                                                            }
                                                        )
                                                    }
                                                    _hover={{ opacity: 0.8 }}
                                                >
                                                    {v}
                                                </Badge>
                                            ))}
                                    </Grid>
                                </VStack>
                            )}

                            {journey.market.length > 0 && (
                                <VStack alignItems='left'>
                                    <HStack>
                                        <IconFilter
                                            color='brand'
                                            style={{
                                                fontSize: '25px',
                                                height: '25px'
                                            }}
                                        />
                                        <Text
                                            data-testid={
                                                CJ_DETAILS_TEST_IDS.marketLabel
                                            }
                                            fontWeight='bold'
                                            fontSize='18px'
                                        >
                                            Market
                                        </Text>
                                        <Tooltip
                                            showArrow
                                            content={
                                                'Country or Region where the journey or activity applies.'
                                            }
                                            contentProps={{
                                                css: {
                                                    '--tooltip-bg': 'grey'
                                                }
                                            }}
                                        >
                                            <IconInfo size='md' color='brand' />
                                        </Tooltip>
                                    </HStack>

                                    <Grid
                                        templateColumns='repeat(4, 0.9fr)'
                                        gap='0.75rem'
                                    >
                                        {journey.market.map(m => (
                                            <Badge
                                                data-testid={CJ_DETAILS_TEST_IDS.marketBadge(
                                                    m
                                                )}
                                                key={m}
                                                as='div'
                                                width='100%'
                                                fontSize='16px'
                                                padding='8px 16px'
                                                bg={
                                                    selectedMarkets.has(m)
                                                        ? '#0066BE'
                                                        : {
                                                              base: '#ECEDEE',
                                                              _dark: 'gray.800'
                                                          }
                                                }
                                                color={
                                                    selectedMarkets.has(m)
                                                        ? 'white'
                                                        : undefined
                                                }
                                                cursor='pointer'
                                                onClick={() =>
                                                    setSelectedMarkets(prev => {
                                                        const next = new Set(
                                                            prev
                                                        )
                                                        if (next.has(m)) {
                                                            next.delete(m)
                                                        } else {
                                                            next.add(m)
                                                        }
                                                        return next
                                                    })
                                                }
                                                _hover={{ opacity: 0.8 }}
                                            >
                                                {m === 'Global' ? (
                                                    <IconGlobal
                                                        data-testid={CJ_DETAILS_TEST_IDS.marketFlag(
                                                            m
                                                        )}
                                                        title='Global icon'
                                                        titleId='global-icon-id'
                                                        className='icon-blue-color'
                                                    />
                                                ) : (
                                                    <Image
                                                        data-testid={CJ_DETAILS_TEST_IDS.marketFlag(
                                                            m
                                                        )}
                                                        width={20}
                                                        height={15}
                                                        src={`${CDAAS_URL}/enterprise-architecture/flags/${m === 'UK' ? 'gb' : m.toLowerCase()}.png`}
                                                        unoptimized
                                                        alt={m}
                                                    />
                                                )}

                                                <Text paddingRight={4.5}>
                                                    {m}
                                                </Text>
                                            </Badge>
                                        ))}
                                    </Grid>
                                </VStack>
                            )}
                        </HStack>
                    </Flex>
                </Box>
            </Box>
            {journey.journey_stages && journey.journey_stages?.length > 0 && (
                <Box
                    data-testid={CJ_DETAILS_TEST_IDS.stagesTable}
                    background='surface.white'
                    borderRadius='17px'
                    padding={3}
                >
                    <Table.ScrollArea height='90vh'>
                        <Table.Root
                            size='md'
                            height='fit-content'
                            showColumnBorder
                            stickyHeader
                            border='2px solid border.regular'
                            css={{
                                '& [data-sticky]': {
                                    position: 'sticky',
                                    zIndex: 1,
                                    bg: 'surface.white',

                                    _after: {
                                        content: '""',
                                        position: 'absolute',
                                        pointerEvents: 'none',
                                        top: '0',
                                        bottom: '-1px',
                                        width: '32px'
                                    }
                                },

                                '& [data-sticky=end]': {
                                    _after: {
                                        insetInlineEnd: '0',
                                        translate: '100% 0'
                                    }
                                },

                                '& [data-sticky=start]': {
                                    _after: {
                                        insetInlineStart: '0',
                                        translate: '-100% 0'
                                    }
                                },

                                '& thead tr': {
                                    shadow: '0 1px 0 0 {colors.border}',
                                    '&:has(th[data-sticky])': {
                                        zIndex: 2
                                    }
                                },

                                '& :is(th, td)': {
                                    borderWidth: '3px'
                                }
                            }}
                            borderCollapse='collapse'
                        >
                            <Table.Header>
                                <Table.Row
                                    borderCollapse='separate'
                                    borderSpacing='0 5'
                                    color='white'
                                >
                                    <Table.ColumnHeader
                                        data-sticky='end'
                                        maxW='10%'
                                        left='0'
                                        border='none !important'
                                        borderRight='3px solid white !important'
                                        padding-left='0 !important'
                                        textAlign='center'
                                        fontWeight='600'
                                        color='white'
                                        fontSize='14px'
                                        bg={{
                                            base: '#0066BE !important',
                                            _dark: 'gray.800 !important'
                                        }}
                                    >
                                        <HStack
                                            alignSelf='center'
                                            justifyContent='center'
                                        >
                                            <Text>Value Stage</Text>
                                            <Tooltip
                                                showArrow
                                                content={
                                                    'A major phase that groups related customer interactions.'
                                                }
                                                contentProps={{
                                                    css: {
                                                        '--tooltip-bg': 'grey'
                                                    }
                                                }}
                                            >
                                                <IconInfo
                                                    size='md'
                                                    color='white'
                                                />
                                            </Tooltip>
                                        </HStack>
                                    </Table.ColumnHeader>
                                    {stages?.map((stage, index) => (
                                        <Table.ColumnHeader
                                            key={stage.journey_stage_id}
                                            textAlign='center'
                                            color='white'
                                            fontWeight='600'
                                            border='none !important'
                                            direction='column'
                                            bg={{
                                                base: '#0066BE !important',
                                                _dark: 'gray.800 !important'
                                            }}
                                        >
                                            <HStack justifyContent='space-between'>
                                                <div />
                                                <Text
                                                    data-testid={CJ_DETAILS_TEST_IDS.stageName(
                                                        stage.journey_stage_id
                                                    )}
                                                    alignSelf='center'
                                                    marginLeft={3}
                                                    fontSize='14px'
                                                >
                                                    {stage.journey_stage_name}
                                                </Text>
                                                {index < stages.length - 1 ? (
                                                    <Box
                                                        width='20px'
                                                        marginRight='8px'
                                                    >
                                                        <IconChevronRight
                                                            color='white'
                                                            style={{
                                                                fontSize:
                                                                    '55px',
                                                                height: '55px',
                                                                position:
                                                                    'absolute',
                                                                top: '-5px'
                                                            }}
                                                        />
                                                    </Box>
                                                ) : (
                                                    <div />
                                                )}
                                            </HStack>
                                        </Table.ColumnHeader>
                                    ))}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body backgroundColor='surface.white'>
                                {stages?.some(
                                    stage =>
                                        stage.touch_point &&
                                        stage.touch_point.length > 0
                                ) && (
                                    <Table.Row background='surface.white'>
                                        <Table.Cell
                                            data-sticky='end'
                                            left='0'
                                            borderLeft='none !important'
                                            borderTop='none !important'
                                            padding-left='0 !important'
                                            position='relative'
                                        >
                                            <Box
                                                borderTop={`4px solid #006FCF`}
                                                width='80%'
                                                position='absolute'
                                                top={3}
                                                left={3}
                                                right='0'
                                            />
                                            <HStack
                                                width='100%'
                                                justifyContent='center'
                                            >
                                                <VStack
                                                    alignItems='center'
                                                    gap={2}
                                                    pt={4}
                                                >
                                                    <Image
                                                        alt='Customer Interactions'
                                                        width={40}
                                                        height={40}
                                                        src='/business-architecture/interactions-icon.png'
                                                    />

                                                    <Heading
                                                        data-testid={
                                                            CJ_DETAILS_TEST_IDS.touchPointsHeading
                                                        }
                                                        size='sm'
                                                        textAlign='right'
                                                        color='text.brand'
                                                    >
                                                        Customer Interaction
                                                    </Heading>
                                                </VStack>
                                                <Box alignSelf='end'>
                                                    <Tooltip
                                                        showArrow
                                                        content={
                                                            'What the customer does, views, selects, confirms, receives, submits, or manages.'
                                                        }
                                                        contentProps={{
                                                            css: {
                                                                '--tooltip-bg':
                                                                    'grey'
                                                            }
                                                        }}
                                                    >
                                                        <IconInfo
                                                            size='md'
                                                            color='brand'
                                                        />
                                                    </Tooltip>
                                                </Box>
                                            </HStack>
                                        </Table.Cell>
                                        {stages?.map((stage, index) => (
                                            <Table.Cell
                                                key={
                                                    stage.journey_stage_id +
                                                    index
                                                }
                                                verticalAlign='top'
                                                padding={4}
                                                borderTop='none !important'
                                            >
                                                <Grid
                                                    templateColumns='repeat(3, minmax(170px, 1fr))'
                                                    gap={3}
                                                >
                                                    {stage.touch_point?.map(
                                                        (tp, index) => (
                                                            <GridItem
                                                                key={`item-${index}`}
                                                            >
                                                                <Card.Root
                                                                    bg={{
                                                                        base: '#006FCF1A',
                                                                        _dark: '#2987D9'
                                                                    }}
                                                                    borderColor='#006FCF'
                                                                    borderWidth='1px'
                                                                    boxShadow='md'
                                                                >
                                                                    <Card.Body
                                                                        data-testid={CJ_DETAILS_TEST_IDS.touchPointText(
                                                                            tp
                                                                        )}
                                                                        color='text.subtle'
                                                                        textWrap='pretty'
                                                                        fontWeight='501'
                                                                        width='fit-content'
                                                                    >
                                                                        <Text
                                                                            wordWrap='normal'
                                                                            whiteSpace='normal'
                                                                        >
                                                                            {tp}
                                                                        </Text>
                                                                    </Card.Body>
                                                                </Card.Root>
                                                            </GridItem>
                                                        )
                                                    )}
                                                </Grid>
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                )}

                                {/* ROW: Business Actions */}
                                {stages?.some(
                                    stage =>
                                        stage.business_action &&
                                        stage.business_action.length > 0
                                ) && (
                                    <Table.Row background='surface.white'>
                                        <Table.Cell
                                            data-sticky='end'
                                            left='0'
                                            borderTop='none !important'
                                            borderLeft='none !important'
                                            padding-left='0 !important'
                                            position='relative'
                                        >
                                            <Box
                                                borderTop={`4px solid #8700CF`}
                                                width='80%'
                                                position='absolute'
                                                top={3}
                                                left={3}
                                                right='0'
                                            />
                                            <HStack
                                                width='100%'
                                                justifyContent='center'
                                            >
                                                <VStack
                                                    alignItems='center !important'
                                                    gap={2}
                                                    pt={4}
                                                >
                                                    <IconBusiness
                                                        color='brand'
                                                        style={{
                                                            fontSize: '40px',
                                                            height: '48px'
                                                        }}
                                                    />
                                                    <Heading
                                                        data-testid={
                                                            CJ_DETAILS_TEST_IDS.businessActionsHeading
                                                        }
                                                        size='sm'
                                                        textAlign='right'
                                                        color='text.brand'
                                                    >
                                                        Business Action
                                                    </Heading>
                                                </VStack>
                                                <Box alignSelf='end'>
                                                    <Tooltip
                                                        showArrow
                                                        content={
                                                            'What the business does to enable or respond to the customer.'
                                                        }
                                                        contentProps={{
                                                            css: {
                                                                '--tooltip-bg':
                                                                    'grey'
                                                            }
                                                        }}
                                                    >
                                                        <IconInfo
                                                            size='md'
                                                            color='brand'
                                                        />
                                                    </Tooltip>
                                                </Box>
                                            </HStack>
                                        </Table.Cell>
                                        {stages?.map((stage, index) => (
                                            <Table.Cell
                                                key={
                                                    stage.journey_stage_id +
                                                    index
                                                }
                                                verticalAlign='top'
                                                padding={4}
                                            >
                                                <Grid
                                                    templateColumns='repeat(3, minmax(170px, 1fr))'
                                                    gap={3}
                                                >
                                                    {stage.business_action
                                                        ?.filter(
                                                            ba =>
                                                                selectedVariants.has(
                                                                    ba.journey_variant
                                                                ) ||
                                                                selectedVariants.size <
                                                                    1 ||
                                                                ba.journey_variant ===
                                                                    'Shared'
                                                        )
                                                        .map((ba, index) => (
                                                            <GridItem
                                                                key={`item-${index}`}
                                                            >
                                                                <Card.Root
                                                                    bg={{
                                                                        base: '#8700CF1A',
                                                                        _dark: '#7789BF'
                                                                    }}
                                                                    border={
                                                                        '1px solid #8700CF'
                                                                    }
                                                                    boxShadow='md'
                                                                >
                                                                    <Card.Body
                                                                        data-testid={CJ_DETAILS_TEST_IDS.businessActionText(
                                                                            ba.business_action_nm
                                                                        )}
                                                                        color='text.subtle'
                                                                        textWrap='pretty'
                                                                        fontWeight='501'
                                                                        width='fit-content'
                                                                    >
                                                                        <Text
                                                                            wordWrap='normal'
                                                                            whiteSpace='normal'
                                                                        >
                                                                            {
                                                                                ba.business_action_nm
                                                                            }
                                                                        </Text>
                                                                    </Card.Body>
                                                                </Card.Root>
                                                            </GridItem>
                                                        ))}
                                                </Grid>
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                )}

                                {stages?.some(
                                    stage =>
                                        stage.capabilities &&
                                        stage.capabilities.length > 0
                                ) && (
                                    <Table.Row background='surface.white'>
                                        <Table.Cell
                                            data-sticky='end'
                                            left='0'
                                            borderTop='none !important'
                                            borderLeft='none !important'
                                            padding-left='0 !important'
                                            position='relative'
                                        >
                                            <Box
                                                borderTop={`4px solid #1FB22E`}
                                                width='80%'
                                                position='absolute'
                                                top={3}
                                                left={3}
                                                right='0'
                                            />
                                            <HStack
                                                width='100%'
                                                justifyContent='center'
                                            >
                                                <VStack
                                                    alignItems='center'
                                                    gap={2}
                                                    pt={4}
                                                >
                                                    <IconConstruction
                                                        color='brand'
                                                        style={{
                                                            fontSize: '40px',
                                                            height: '48px'
                                                        }}
                                                    />
                                                    <Heading
                                                        data-testid={
                                                            CJ_DETAILS_TEST_IDS.capabilitiesHeading
                                                        }
                                                        size='sm'
                                                        textAlign='right'
                                                        color='text.brand'
                                                    >
                                                        Capability
                                                    </Heading>
                                                </VStack>
                                                <Box alignSelf='end'>
                                                    <Tooltip
                                                        showArrow
                                                        content={
                                                            'What the business must be able to do, linked to supporting data and technology.'
                                                        }
                                                        contentProps={{
                                                            css: {
                                                                '--tooltip-bg':
                                                                    'grey'
                                                            }
                                                        }}
                                                    >
                                                        <IconInfo
                                                            size='md'
                                                            color='brand'
                                                        />
                                                    </Tooltip>
                                                </Box>
                                            </HStack>
                                        </Table.Cell>
                                        {stages?.map((stage, index) => (
                                            <Table.Cell
                                                key={
                                                    stage.journey_stage_id +
                                                    index
                                                }
                                                verticalAlign='top'
                                                padding={4}
                                            >
                                                <Grid
                                                    templateColumns='repeat(3, minmax(170px, 1fr))'
                                                    gap={3}
                                                >
                                                    {stage.capabilities.map(
                                                        (cap, index) => (
                                                            <GridItem
                                                                key={`item-${index}`}
                                                            >
                                                                <Card.Root
                                                                    bg={
                                                                        cap
                                                                            .capability_id
                                                                            .length >
                                                                        0
                                                                            ? {
                                                                                  base: '#1FB22E1A',
                                                                                  _dark: '#189662'
                                                                              }
                                                                            : 'surface.foreground'
                                                                    }
                                                                    borderColor={
                                                                        cap
                                                                            .capability_id
                                                                            .length >
                                                                        0
                                                                            ? '#1FB22E'
                                                                            : 'status.informationSubtle'
                                                                    }
                                                                    borderWidth='1px'
                                                                    boxShadow='md'
                                                                    transition='transform 0.3s, box-shadow 0.3s'
                                                                    _hover={
                                                                        cap
                                                                            .capability_id
                                                                            .length >
                                                                        0
                                                                            ? {
                                                                                  transform:
                                                                                      'translateY(-4px)',
                                                                                  boxShadow:
                                                                                      'xl',
                                                                                  cursor: 'pointer'
                                                                              }
                                                                            : {}
                                                                    }
                                                                >
                                                                    {cap
                                                                        .capability_id
                                                                        .length >
                                                                    0 ? (
                                                                        <NoPrefetchLink
                                                                            data-testid={CJ_DETAILS_TEST_IDS.capabilityLink(
                                                                                cap.capability_id
                                                                            )}
                                                                            href={
                                                                                '/business-architecture/capabilities/' +
                                                                                cap.capability_id +
                                                                                '/?tab=Enterprise+Customer+Journeys'
                                                                            }
                                                                        >
                                                                            <Card.Body
                                                                                color='text.subtle'
                                                                                textWrap='pretty'
                                                                                fontWeight='501'
                                                                                width='fit-content'
                                                                            >
                                                                                <Text
                                                                                    wordWrap='normal'
                                                                                    whiteSpace='normal'
                                                                                >
                                                                                    {
                                                                                        cap.capability_nm
                                                                                    }
                                                                                </Text>
                                                                            </Card.Body>
                                                                        </NoPrefetchLink>
                                                                    ) : (
                                                                        <Card.Body
                                                                            data-testid={CJ_DETAILS_TEST_IDS.capabilityText(
                                                                                cap.capability_key_tx
                                                                            )}
                                                                            color='text.subtle'
                                                                            textWrap='pretty'
                                                                            fontWeight='501'
                                                                            width='fit-content'
                                                                        >
                                                                            <Text
                                                                                wordWrap='normal'
                                                                                whiteSpace='normal'
                                                                            >
                                                                                {
                                                                                    cap.capability_nm
                                                                                }
                                                                            </Text>
                                                                        </Card.Body>
                                                                    )}
                                                                </Card.Root>
                                                            </GridItem>
                                                        )
                                                    )}
                                                </Grid>
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                )}

                                {/* ROW: Company Domains */}
                                {stages?.some(
                                    stage =>
                                        stage.company_domains &&
                                        stage.company_domains.length > 0
                                ) && (
                                    <Table.Row background='surface.white'>
                                        <Table.Cell
                                            left='0'
                                            data-sticky='end'
                                            padding-left='0 !important'
                                            borderLeft='none !important'
                                        >
                                            <Box
                                                borderTop={`4px solid #F3780D`}
                                                width='80%'
                                                position='absolute'
                                                top={3}
                                                left={3}
                                                right='0'
                                            />
                                            <HStack
                                                width='100%'
                                                justifyContent='center'
                                            >
                                                <VStack
                                                    alignItems='center'
                                                    gap={2}
                                                    pt={4}
                                                >
                                                    <Image
                                                        data-testid={
                                                            CJ_DETAILS_TEST_IDS.platformsLogo
                                                        }
                                                        src='/products/PlatformsLogo.png'
                                                        alt='Platforms Logo'
                                                        width={40}
                                                        height={40}
                                                    />
                                                    <Heading
                                                        size='sm'
                                                        textAlign='right'
                                                        color='text.brand'
                                                    >
                                                        Company Domain
                                                    </Heading>
                                                </VStack>
                                                <Box alignSelf='end'>
                                                    <Tooltip
                                                        showArrow
                                                        content={
                                                            'A business-aligned technology area that enables capabilities.'
                                                        }
                                                        contentProps={{
                                                            css: {
                                                                '--tooltip-bg':
                                                                    'grey'
                                                            }
                                                        }}
                                                    >
                                                        <IconInfo
                                                            size='md'
                                                            color='brand'
                                                        />
                                                    </Tooltip>
                                                </Box>
                                            </HStack>
                                        </Table.Cell>
                                        {stages?.map((stage, index) => (
                                            <Table.Cell
                                                key={
                                                    stage.journey_stage_id +
                                                    index
                                                }
                                                verticalAlign='top'
                                                padding={4}
                                            >
                                                <Grid
                                                    templateColumns='repeat(3, minmax(170px, 1fr))'
                                                    gap={3}
                                                >
                                                    {stage.company_domains.map(
                                                        (domain, index) => (
                                                            <GridItem
                                                                key={`item-${index}`}
                                                                width='100%'
                                                            >
                                                                <Card.Root
                                                                    size='sm'
                                                                    bg={{
                                                                        base: '#FFF2E8',
                                                                        _dark: '#D46E4E'
                                                                    }}
                                                                    borderColor='#F3780D'
                                                                    borderWidth='1px'
                                                                    boxShadow='md'
                                                                    transition='transform 0.3s, box-shadow 0.3s'
                                                                    _hover={{
                                                                        transform:
                                                                            'translateY(-4px)',
                                                                        boxShadow:
                                                                            'xl',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    <NoPrefetchLink
                                                                        data-testid={CJ_DETAILS_TEST_IDS.domainLink(
                                                                            domain.company_domain_id
                                                                        )}
                                                                        href={
                                                                            '/docs/' +
                                                                            domain.playbook_id
                                                                        }
                                                                    >
                                                                        <Card.Body
                                                                            color='text.subtle'
                                                                            whiteSpace='normal'
                                                                            wordWrap='break-word'
                                                                            fontWeight='501'
                                                                        >
                                                                            {
                                                                                domain.domain_nm
                                                                            }
                                                                        </Card.Body>
                                                                    </NoPrefetchLink>
                                                                </Card.Root>
                                                            </GridItem>
                                                        )
                                                    )}
                                                </Grid>
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                )}

                                {/* ROW: APIs */}
                                {stages?.some(
                                    stage =>
                                        (stage.apis?.length ?? 0) > 0 ||
                                        (stage.apis_da?.length ?? 0) > 0
                                ) && (
                                    <Table.Row background='surface.white'>
                                        <Table.Cell
                                            left='0'
                                            data-sticky='end'
                                            borderLeft='none !important'
                                        >
                                            <Box
                                                borderTop={`4px solid #0E7F79`}
                                                width='80%'
                                                position='absolute'
                                                top={3}
                                                left={3}
                                                right='0'
                                            />
                                            <HStack
                                                width='100%'
                                                justifyContent='center'
                                            >
                                                <VStack
                                                    alignItems='center'
                                                    gap={2}
                                                    padding-left='0 !important'
                                                    pt={4}
                                                >
                                                    <IconLink
                                                        color='brand'
                                                        style={{
                                                            fontSize: '40px',
                                                            height: '48px'
                                                        }}
                                                    />
                                                    <Heading
                                                        data-testid={
                                                            CJ_DETAILS_TEST_IDS.apisHeading
                                                        }
                                                        size='sm'
                                                        textAlign='right'
                                                        color='text.brand'
                                                    >
                                                        Inter-domain API
                                                    </Heading>
                                                </VStack>
                                                <Box alignSelf='end'>
                                                    <Tooltip
                                                        showArrow
                                                        content={
                                                            'A connection that lets one company domain exchange information or trigger activity with another.'
                                                        }
                                                        contentProps={{
                                                            css: {
                                                                '--tooltip-bg':
                                                                    'grey'
                                                            }
                                                        }}
                                                    >
                                                        <IconInfo
                                                            size='md'
                                                            color='brand'
                                                        />
                                                    </Tooltip>
                                                </Box>
                                            </HStack>
                                        </Table.Cell>
                                        {stages?.map((stage, index) => (
                                            <Table.Cell
                                                key={
                                                    stage.journey_stage_id +
                                                    index
                                                }
                                                verticalAlign='top'
                                                padding={4}
                                            >
                                                <Grid
                                                    templateColumns='repeat(3, minmax(170px, 1fr))'
                                                    gap={3}
                                                >
                                                    {(stage.apis?.length ?? 0) >
                                                    0
                                                        ? dedupeBy(
                                                              stage.apis ?? [],
                                                              api =>
                                                                  api.api_endpoint_mtda_id
                                                          ).map(api => (
                                                              <GridItem
                                                                  key={
                                                                      api.api_endpoint_mtda_id
                                                                  }
                                                                  width='100%'
                                                              >
                                                                  <ApiCard
                                                                      id={
                                                                          api.api_endpoint_mtda_id
                                                                      }
                                                                      label={
                                                                          api.api_nm
                                                                      }
                                                                      href={
                                                                          api.type_a
                                                                              ? endpointDocsUrl(
                                                                                    api.prim_company_domain_id,
                                                                                    api.api_endpoint_mtda_id
                                                                                )
                                                                              : ''
                                                                      }
                                                                  />
                                                              </GridItem>
                                                          ))
                                                        : dedupeBy(
                                                              stage.apis_da ??
                                                                  [],
                                                              api => api.api_nm
                                                          ).map(api => (
                                                              <GridItem
                                                                  key={
                                                                      api.api_metadata_id
                                                                  }
                                                                  width='100%'
                                                              >
                                                                  <ApiCard
                                                                      id={
                                                                          api.api_metadata_id
                                                                      }
                                                                      label={
                                                                          api.api_nm
                                                                      }
                                                                      href={
                                                                          api.type_a
                                                                              ? toRelativeUrl(
                                                                                    api
                                                                                        .add_da
                                                                                        ?.architecturePortalUrl ??
                                                                                        ''
                                                                                )
                                                                              : ''
                                                                      }
                                                                  />
                                                              </GridItem>
                                                          ))}
                                                </Grid>
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                )}

                                {/* ROW: Applications */}
                                {stages?.some(
                                    stage =>
                                        stage.applications &&
                                        stage.applications.length > 0
                                ) && (
                                    <Table.Row background='surface.white'>
                                        <Table.Cell
                                            left='0'
                                            data-sticky='end'
                                            borderBottom='none !important'
                                            borderLeft='none !important'
                                        >
                                            <Box
                                                borderTop={`4px solid #757621`}
                                                width='80%'
                                                position='absolute'
                                                top={3}
                                                left={3}
                                                right='0'
                                            />
                                            <HStack
                                                width='100%'
                                                justifyContent='center'
                                            >
                                                <VStack
                                                    alignItems='center'
                                                    gap={2}
                                                    mt={2}
                                                    padding-left='0 !important'
                                                >
                                                    <IconLaptop
                                                        color='brand'
                                                        style={{
                                                            fontSize: '40px',
                                                            height: '48px'
                                                        }}
                                                    />
                                                    <Heading
                                                        data-testid={
                                                            CJ_DETAILS_TEST_IDS.applicationsHeading
                                                        }
                                                        size='sm'
                                                        textAlign='right'
                                                        color='text.brand'
                                                    >
                                                        Application
                                                    </Heading>
                                                </VStack>
                                                <Box alignSelf='end'>
                                                    <Tooltip
                                                        showArrow
                                                        content={
                                                            'A system, platform, or tool that supports the journey.'
                                                        }
                                                        contentProps={{
                                                            css: {
                                                                '--tooltip-bg':
                                                                    'grey'
                                                            }
                                                        }}
                                                    >
                                                        <IconInfo
                                                            size='md'
                                                            color='brand'
                                                        />
                                                    </Tooltip>
                                                </Box>
                                            </HStack>
                                        </Table.Cell>
                                        {stages?.map((stage, index) => (
                                            <Table.Cell
                                                key={
                                                    stage.journey_stage_id +
                                                    index
                                                }
                                                verticalAlign='top'
                                                padding={4}
                                                borderBottom='none !important'
                                            >
                                                <Grid
                                                    templateColumns='repeat(3, minmax(170px, 1fr))'
                                                    gap={3}
                                                >
                                                    {stage.applications
                                                        ?.filter(
                                                            (
                                                                app,
                                                                index,
                                                                self
                                                            ) =>
                                                                index ===
                                                                self.findIndex(
                                                                    a =>
                                                                        a.application_nm ===
                                                                        app.application_nm
                                                                )
                                                        )
                                                        .map((app, index) => (
                                                            <GridItem
                                                                key={`item-${index}`}
                                                                width='100%'
                                                            >
                                                                <Card.Root
                                                                    size='sm'
                                                                    bg={{
                                                                        base: '#F4F5DB',
                                                                        _dark: '#757621'
                                                                    }}
                                                                    borderColor='#757621'
                                                                    borderWidth='1px'
                                                                    boxShadow='md'
                                                                >
                                                                    <Card.Body
                                                                        data-testid={CJ_DETAILS_TEST_IDS.applicationText(
                                                                            app.application_id
                                                                        )}
                                                                        color='text.subtle'
                                                                        whiteSpace='normal'
                                                                        wordWrap='break-word'
                                                                        fontWeight='501'
                                                                    >
                                                                        {
                                                                            app.application_nm
                                                                        }
                                                                    </Card.Body>
                                                                </Card.Root>
                                                            </GridItem>
                                                        ))}
                                                </Grid>
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table.Root>
                    </Table.ScrollArea>
                </Box>
            )}
            <ECJChangeModal
                isOpen={isOpenChangeModal}
                setIsOpenChangeModal={setIsOpenChangeModal}
                onSubmit={handleSubmitECJChangeModal}
                isSubmitting={isSubmitting}
                journeyStatement={journey.journey_statement}
                journeyDesc={journey.journey_desc || ''}
            />
        </Box>
    )
}
