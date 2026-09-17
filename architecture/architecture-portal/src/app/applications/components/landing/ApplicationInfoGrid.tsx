'use client'
import React from 'react'
import { Box, Flex, Grid } from '@chakra-ui/react'
import {
    IconArchive,
    IconBank,
    IconBankApp,
    IconBusiness,
    IconCardBenefit,
    IconCart,
    IconCopy,
    IconGlobal,
    IconInsurance,
    IconLaptop,
    IconMultiChannel,
    IconProcessing,
    IconGrid,
    IconWarning
} from '@americanexpress/dls-icons'
import MetadataTags from '@/app/initiatives/components/MetadataTags'
import PtbTags from '@/app/initiatives/components/PtbTags'
import { Application } from '@/app/company-domains/types'
import { useCapabilities } from '@/app/business-architecture/hooks/useGetCapabilities'
import {
    useMetamodelFoundationalTechnologyOptions,
    useMetamodelTechnicalCapabilityOptions
} from '@/app/shared/hooks'
import {
    isRecommendedValue,
    type RecommendedValueIds
} from '@/app/shared/utils/recommendationDiff'
import { RECOMMENDATION_COLOR } from '@/app/shared/components/RecommendationLegend'
import { AIIcon } from '@/components/icons/AIIcon'
import { useLinkedDisplayUrls } from '@/app/resources/metamodel/hooks/useLinkedDisplayUrls'

interface ApplicationInfoGridProps {
    applicationData: Application
    metadata: Record<string, string[]>
    isEdit: boolean
    linkedPlaybookNames?: string[]
    /** Playbook ids, positionally aligned with `linkedPlaybookNames`. */
    linkedPlaybookIds?: string[]
    techStackNames?: string[]
    /** Tech stack ids, positionally aligned with `techStackNames`. */
    techStackIds?: string[]
    recommendedValues?: RecommendedValueIds
    isCompanyDomainRecommended?: boolean
}

export default function ApplicationInfoGrid({
    applicationData,
    metadata,
    isEdit,
    linkedPlaybookNames,
    linkedPlaybookIds,
    techStackNames,
    techStackIds,
    recommendedValues,
    isCompanyDomainRecommended = false
}: ApplicationInfoGridProps) {
    const { central_application_da, application_id } = applicationData
    const { capability } = useCapabilities()
    const { foundationalTechnologyOptions } =
        useMetamodelFoundationalTechnologyOptions()
    const { technicalCapabilityOptions } =
        useMetamodelTechnicalCapabilityOptions()
    const adrIds = React.useMemo(
        () =>
            [
                ...(applicationData.adr_core || []),
                ...(applicationData.adr_non_core || [])
            ].map(adr => adr.id),
        [applicationData.adr_core, applicationData.adr_non_core]
    )
    const bvbIds = React.useMemo(
        () =>
            [
                ...(applicationData.bvb_core || []),
                ...(applicationData.bvb_non_core || [])
            ].map(bvb => bvb.id),
        [applicationData.bvb_core, applicationData.bvb_non_core]
    )
    const { adrDisplayUrl, bvbDisplayUrl } = useLinkedDisplayUrls({
        adrIds,
        bvbIds
    })
    const capabilityNameById = React.useMemo(
        () =>
            capability.reduce<Record<string, string>>((acc, cap) => {
                acc[cap.capability_id] = cap.capability_nm
                return acc
            }, {}),
        [capability]
    )
    const foundationalTechnologyNameById = React.useMemo(
        () =>
            (foundationalTechnologyOptions || []).reduce<
                Record<string, string>
            >((acc, ft) => {
                acc[ft.foundationalTechnologyId] = ft.name
                return acc
            }, {}),
        [foundationalTechnologyOptions]
    )
    const technicalCapabilityNameById = React.useMemo(
        () =>
            (technicalCapabilityOptions || []).reduce<Record<string, string>>(
                (acc, tc) => {
                    acc[tc.technicalCapabilityId] = tc.name
                    return acc
                },
                {}
            ),
        [technicalCapabilityOptions]
    )

    const appInfo = [
        {
            icon: IconInsurance,
            label: 'Central ID',
            value: application_id
        },
        {
            icon: IconBank,
            label: 'Line of Business 2',
            value:
                central_application_da?.lineOfBusiness?.lineOfBusiness2 || '-'
        },
        {
            icon: IconProcessing,
            label: 'Lifecycle Status',
            value: central_application_da?.lifeCycleStatus || '-'
        },
        {
            icon: IconGlobal,
            label: 'Countries Supported',
            value: 'Global'
        },
        {
            icon: IconLaptop,
            label: 'App Type',
            value: central_application_da?.appType || '-'
        },
        {
            icon: IconBusiness,
            label: 'Business units',
            value: metadata?.['Business Units']?.length
                ? metadata['Business Units'].map((m: string) => (
                      <MetadataTags label={m} key={m} />
                  ))
                : '-'
        },
        {
            icon: IconBankApp,
            label: 'Business capabilities',
            value: metadata?.['Business Capabilities']?.length
                ? metadata['Business Capabilities'].map((m: string) => (
                      <MetadataTags
                          label={capabilityNameById[m] ?? m}
                          key={m}
                          isRecommended={isRecommendedValue(
                              recommendedValues,
                              'businessCapabilities',
                              m
                          )}
                      />
                  ))
                : '-'
        },
        {
            icon: IconGrid,
            label: 'Foundational Technologies',
            value: metadata?.['Foundational Technologies']?.length
                ? metadata['Foundational Technologies'].map(id => (
                      <MetadataTags
                          label={foundationalTechnologyNameById[id] ?? id}
                          key={id}
                          isRecommended={isRecommendedValue(
                              recommendedValues,
                              'foundationalTechnologies',
                              id
                          )}
                      />
                  ))
                : '-'
        },
        {
            icon: IconGlobal,
            label: 'Markets',
            value: metadata?.['Markets']?.length
                ? metadata['Markets'].map((m: string) => (
                      <MetadataTags
                          label={m}
                          key={m}
                          isRecommended={isRecommendedValue(
                              recommendedValues,
                              'markets',
                              m
                          )}
                      />
                  ))
                : '-'
        },
        {
            icon: IconMultiChannel,
            label: 'Tech Stacks',
            value:
                (techStackNames || []).length === 0
                    ? '-'
                    : techStackNames!.map((name: string, index: number) => (
                          <MetadataTags
                              label={name}
                              key={name}
                              isRecommended={isRecommendedValue(
                                  recommendedValues,
                                  'techStacks',
                                  techStackIds?.[index]
                              )}
                          />
                      ))
        },
        {
            icon: IconLaptop,
            label: 'Tech Capabilities',
            value: metadata?.['Technical Capabilities']?.length
                ? metadata['Technical Capabilities'].map(id => (
                      <MetadataTags
                          label={technicalCapabilityNameById[id] ?? id}
                          key={id}
                          isRecommended={isRecommendedValue(
                              recommendedValues,
                              'technicalCapabilities',
                              id
                          )}
                      />
                  ))
                : '-'
        },
        {
            icon: IconArchive,
            label: 'Company Domain',
            value: isCompanyDomainRecommended ? (
                <Flex alignItems='center' gap={1}>
                    <Box color={RECOMMENDATION_COLOR}>
                        {applicationData.domain_nm}
                    </Box>
                    <AIIcon width={14} height={14} />
                </Flex>
            ) : (
                applicationData.domain_nm
            ),
            visible: !isEdit
        },
        {
            icon: IconArchive,
            label: 'Proposed Company Domain',
            value: (
                <Flex>
                    <IconWarning
                        isFilled={true}
                        color='caution'
                        size='xl'
                        style={{ fontSize: '22px' }}
                    />
                    <Box ml={2}>
                        {applicationData.proposed_domain_nm || '-'}
                    </Box>
                </Flex>
            ),
            visible:
                applicationData.proposed_domain_nm && !isEdit ? true : false
        },
        {
            icon: IconCopy,
            label: 'Sub Domain',
            value: applicationData.sub_domain_nm || '-',
            visible: !isEdit
        },
        {
            icon: IconCardBenefit,
            label: 'ADR',
            value:
                (applicationData.adr_core || []).length === 0 &&
                (applicationData.adr_non_core || []).length === 0 ? (
                    '-'
                ) : (
                    <>
                        {[...(applicationData.adr_core || [])].map(adr => (
                            <PtbTags
                                item={adr}
                                isCore={true}
                                key={adr.id}
                                isLink={true}
                                href={adrDisplayUrl(adr.id)}
                            />
                        ))}
                        {[...(applicationData.adr_non_core || [])].map(adr => (
                            <PtbTags
                                item={adr}
                                key={adr.id}
                                isLink={true}
                                href={adrDisplayUrl(adr.id)}
                            />
                        ))}
                    </>
                ),
            visible: !isEdit
        },
        {
            icon: IconCart,
            label: 'BvB',
            value:
                (applicationData.bvb_core || []).length === 0 &&
                (applicationData.bvb_non_core || []).length === 0 ? (
                    '-'
                ) : (
                    <>
                        {[...(applicationData.bvb_core || [])].map(bvb => (
                            <PtbTags
                                item={bvb}
                                isCore={true}
                                key={bvb.id}
                                isLink={true}
                                href={bvbDisplayUrl(bvb.id)}
                            />
                        ))}
                        {[...(applicationData.bvb_non_core || [])].map(bvb => (
                            <PtbTags
                                item={bvb}
                                key={bvb.id}
                                isLink={true}
                                href={bvbDisplayUrl(bvb.id)}
                            />
                        ))}
                    </>
                ),
            visible: !isEdit
        },
        {
            icon: IconGrid,
            label: 'Playbooks',
            value:
                (linkedPlaybookNames || []).length === 0 ? (
                    '-'
                ) : (
                    <>
                        {linkedPlaybookNames!.map((name, index) => (
                            <MetadataTags
                                label={name}
                                key={name}
                                isRecommended={isRecommendedValue(
                                    recommendedValues,
                                    'playbooks',
                                    linkedPlaybookIds?.[index]
                                )}
                            />
                        ))}
                    </>
                ),
            visible: !isEdit
        },
        {
            icon: IconCart,
            label: 'Linked Initiative',
            value:
                (applicationData.playbook_core || []).length === 0 &&
                (applicationData.playbook_non_core || []).length === 0 ? (
                    '-'
                ) : (
                    <>
                        {[...(applicationData.playbook_core || [])].map(adr => (
                            <PtbTags
                                item={adr}
                                isCore={true}
                                key={adr.id}
                                isLink={true}
                                isPlaybook={true}
                            />
                        ))}
                        {[...(applicationData.playbook_non_core || [])].map(
                            adr => (
                                <PtbTags
                                    item={adr}
                                    key={adr.id}
                                    isLink={true}
                                    isPlaybook={true}
                                />
                            )
                        )}
                    </>
                ),
            visible: !isEdit
        }
    ]

    return (
        <Grid
            templateColumns={{ base: 'repeat(3, 1fr)' }}
            mt={8}
            gap={4}
            width='100%'
        >
            {appInfo.map((app, index) => {
                const { icon: Icon, label, value, visible = true } = app
                if (!visible) return null
                return (
                    <Flex key={index}>
                        <Box>
                            <Icon style={{ fontSize: '1.375rem' }} />
                        </Box>
                        <Box ml='2'>
                            <Flex direction='column'>
                                <Box fontWeight='700'>{label}</Box>
                                <Box>{value}</Box>
                            </Flex>
                        </Box>
                    </Flex>
                )
            })}
        </Grid>
    )
}
