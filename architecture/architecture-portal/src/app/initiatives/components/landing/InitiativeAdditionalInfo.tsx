'use client'
import React from 'react'
import { Box, Grid, GridItem, Heading, Text } from '@chakra-ui/react'
import PtbTags from '../PtbTags'
import MetadataTags from '../MetadataTags'
import { PTBInitiative } from '../../types'
import {
    useTechStackOptions,
    useMetamodelFoundationalTechnologyOptions,
    useMetamodelTechnicalCapabilityOptions
} from '@/app/shared/hooks'
import { useCapabilities } from '@/app/business-architecture/hooks/useGetCapabilities'
import {
    isRecommendedValue,
    type RecommendedValueIds
} from '@/app/shared/utils/recommendationDiff'
import { useLinkedDisplayUrls } from '@/app/resources/metamodel/hooks/useLinkedDisplayUrls'

interface InitiativeAdditionalInfoProps {
    initiativeData: PTBInitiative
    metadata: Record<string, string[]>
    recommendedValues?: RecommendedValueIds
}

function buildAdditionalFields(
    initiativeData: PTBInitiative,
    metadata: Record<string, string[]>,
    techStackById: Record<string, string>,
    capabilityNameById: Record<string, string>,
    foundationalTechnologyNameById: Record<string, string>,
    technicalCapabilityNameById: Record<string, string>,
    adrDisplayUrl: (id: string) => string | null,
    bvbDisplayUrl: (id: string) => string | null,
    recommendedValues?: RecommendedValueIds
) {
    return [
        {
            label: 'Impacted Company Domain(s)',
            value:
                initiativeData.companyDomains?.length === 0 ? (
                    '-'
                ) : (
                    <>
                        {(initiativeData.companyDomains || []).map(domain => (
                            <PtbTags
                                item={{
                                    id: domain.company_domain_id,
                                    name: domain.domain_nm
                                }}
                                key={domain.company_domain_id}
                                isRecommended={isRecommendedValue(
                                    recommendedValues,
                                    'companyDomains',
                                    domain.company_domain_id
                                )}
                            />
                        ))}
                    </>
                )
        },
        {
            label: 'Foundational Technologies',
            value: initiativeData.initiativeFrameworks?.length
                ? initiativeData.initiativeFrameworks.map(id => (
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
            label: 'ADR',
            value:
                initiativeData.adrCore?.length === 0 &&
                initiativeData.adrNonCore?.length === 0 ? (
                    '-'
                ) : (
                    <>
                        {[...(initiativeData.adrCore || [])].map(adr => (
                            <PtbTags
                                item={adr}
                                isCore={true}
                                key={adr.id}
                                isLink={true}
                                href={adrDisplayUrl(adr.id)}
                            />
                        ))}
                        {[...(initiativeData.adrNonCore || [])].map(adr => (
                            <PtbTags
                                item={adr}
                                key={adr.id}
                                isLink={true}
                                href={adrDisplayUrl(adr.id)}
                            />
                        ))}
                    </>
                )
        },
        {
            label: 'BvB',
            value:
                initiativeData.bvbCore?.length === 0 &&
                initiativeData.bvbNonCore?.length === 0 ? (
                    '-'
                ) : (
                    <>
                        {[...(initiativeData.bvbCore || [])].map(bvb => (
                            <PtbTags
                                item={bvb}
                                isCore={true}
                                key={bvb.id}
                                isLink={true}
                                href={bvbDisplayUrl(bvb.id)}
                            />
                        ))}
                        {[...(initiativeData.bvbNonCore || [])].map(bvb => (
                            <PtbTags
                                item={bvb}
                                key={bvb.id}
                                isLink={true}
                                href={bvbDisplayUrl(bvb.id)}
                            />
                        ))}
                    </>
                )
        },
        {
            label: 'Linked Initiative',
            value:
                initiativeData.playbookCore?.length === 0 &&
                initiativeData.playbookNonCore?.length === 0 ? (
                    '-'
                ) : (
                    <>
                        {[...(initiativeData.playbookCore || [])].map(
                            playbook => (
                                <PtbTags
                                    item={playbook}
                                    isCore={true}
                                    key={playbook.id}
                                    isLink={true}
                                    isPlaybook={true}
                                />
                            )
                        )}
                        {[...(initiativeData.playbookNonCore || [])].map(
                            playbook => (
                                <PtbTags
                                    item={playbook}
                                    key={playbook.id}
                                    isLink={true}
                                    isPlaybook={true}
                                />
                            )
                        )}
                    </>
                )
        },
        {
            label: 'Business Unit',
            value: metadata['Business Units']
                ? metadata['Business Units'].map((m: string) => (
                      <MetadataTags label={m} key={m} />
                  ))
                : '-'
        },
        {
            label: 'Business Capabilities',
            value:
                initiativeData.ebc?.length === 0
                    ? '-'
                    : initiativeData.ebc?.map(
                          (ebc: { id: string; name: string }) => (
                              <MetadataTags
                                  label={capabilityNameById[ebc.id] ?? ebc.name}
                                  key={ebc.id}
                                  isRecommended={isRecommendedValue(
                                      recommendedValues,
                                      'businessCapabilities',
                                      ebc.id
                                  )}
                              />
                          )
                      )
        },
        {
            label: 'Markets',
            value:
                (initiativeData.markets || []).length > 0
                    ? initiativeData.markets?.map((m: string) => (
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
            label: 'Tech Stacks',
            value: metadata['Tech Stacks']
                ? metadata['Tech Stacks'].map((id: string) => (
                      <MetadataTags
                          label={techStackById[id] ?? id}
                          key={id}
                          isRecommended={isRecommendedValue(
                              recommendedValues,
                              'techStacks',
                              id
                          )}
                      />
                  ))
                : '-'
        },
        {
            label: 'Technical Capabilities',
            value: metadata['Technical Capabilities']?.length
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
        }
    ]
}

export default function InitiativeAdditionalInfo({
    initiativeData,
    metadata,
    recommendedValues
}: InitiativeAdditionalInfoProps) {
    const { data: techStackOptions } = useTechStackOptions()
    const { capability } = useCapabilities()
    const { foundationalTechnologyOptions } =
        useMetamodelFoundationalTechnologyOptions()
    const { technicalCapabilityOptions } =
        useMetamodelTechnicalCapabilityOptions()
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
    const adrIds = React.useMemo(
        () =>
            [
                ...(initiativeData.adrCore || []),
                ...(initiativeData.adrNonCore || [])
            ].map(adr => adr.id),
        [initiativeData.adrCore, initiativeData.adrNonCore]
    )
    const bvbIds = React.useMemo(
        () =>
            [
                ...(initiativeData.bvbCore || []),
                ...(initiativeData.bvbNonCore || [])
            ].map(bvb => bvb.id),
        [initiativeData.bvbCore, initiativeData.bvbNonCore]
    )
    const { adrDisplayUrl, bvbDisplayUrl } = useLinkedDisplayUrls({
        adrIds,
        bvbIds
    })
    const additionalFields = buildAdditionalFields(
        initiativeData,
        metadata,
        techStackOptions?.byId || {},
        capabilityNameById,
        foundationalTechnologyNameById,
        technicalCapabilityNameById,
        adrDisplayUrl,
        bvbDisplayUrl,
        recommendedValues
    )

    return (
        <>
            <Heading size='lg' marginBottom={3} mt={4}>
                Additional Information
            </Heading>
            <Grid templateColumns={{ base: 'repeat(2, 1fr)' }} mt={4} gap={4}>
                {additionalFields.map(info => (
                    <GridItem mb={4} key={info.label}>
                        <Text fontWeight='600' fontSize='14px'>
                            {info.label}
                        </Text>
                        <Box mt={1}>{info.value}</Box>
                    </GridItem>
                ))}
            </Grid>
        </>
    )
}
