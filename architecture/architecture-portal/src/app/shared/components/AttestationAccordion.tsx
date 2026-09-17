'use client'
import React, { useState } from 'react'
import {
    Accordion,
    Box,
    Button,
    CloseButton,
    Flex,
    Grid,
    Spinner,
    Text
} from '@chakra-ui/react'
import { IconWarning } from '@americanexpress/dls-icons'
import { FieldDiff } from '../utils/snapshotDiff'
import {
    getLatestAttestationId,
    AttestationRole
} from '../utils/attestationState'
import {
    computeTrackedFieldDiffs,
    isSnapshotStale
} from '../utils/snapshotDiff'
import {
    useAttestationDetail,
    useAttestationsList,
    useCreateAttestation
} from '../hooks/useAttestations'
import {
    EntityType,
    ADRReferenceMM,
    BVBReferenceMM,
    CompanyDomainMM,
    InitiativeReferenceMM
} from '../types/metamodel'
import AttestationBanner from './AttestationBanner'
import AttestationConfirmationModal from './AttestationConfirmationModal'
import PtbTags from '@/app/initiatives/components/PtbTags'
import {
    resolveAttestationType,
    type CapturedAttestationItem
} from '@/constants/attestationConfig'

interface AttestationAccordionProps {
    entityType: EntityType
    entityId: string
    currentEntity: Record<string, unknown>
    role: AttestationRole
    userEmail?: string
    userName?: string
}

// function StatusPill({ status }: { status: string }) {
//     const isPending = status === 'Pending Attestation'
//     const borderColor = isPending ? 'orange.500' : 'green.500'
//     const textColor = isPending ? 'orange.600' : 'green.600'
//
//     return (
//         <Text
//             fontSize='xs'
//             fontWeight='500'
//             border='1px solid'
//             borderColor={borderColor}
//             color={textColor}
//             borderRadius='full'
//             px={3}
//             py={1}
//             display='inline-block'
//         >
//             {status}
//         </Text>
//     )
// }

function mapAdrToTagItem(ref: ADRReferenceMM) {
    return { id: ref.adrId, name: ref.title || ref.adrId, file_id: ref.adrId }
}

function mapBvbToTagItem(ref: BVBReferenceMM) {
    return { id: ref.bvbId, name: ref.title || ref.bvbId }
}

function extractTagItems(
    entity: Record<string, unknown>,
    entityType: EntityType,
    field: 'adrs' | 'bvbs'
): { item: { id: string; name: string; file_id?: string }; isCore: boolean }[] {
    const key =
        field === 'adrs'
            ? entityType === 'initiative'
                ? 'architectureDecisionRecords'
                : 'linkedArchitectureDecisionRecords'
            : entityType === 'initiative'
              ? 'buildVsBuyAssessments'
              : 'linkedBuildVsBuyAssessments'

    const refs = (entity[key] as Array<ADRReferenceMM | BVBReferenceMM>) || []
    return refs.map(ref => {
        if (field === 'adrs') {
            const adr = ref as ADRReferenceMM
            return { item: mapAdrToTagItem(adr), isCore: adr.isCore }
        }
        const bvb = ref as BVBReferenceMM
        return { item: mapBvbToTagItem(bvb), isCore: bvb.isCore }
    })
}

function extractCompanyDomainTags(
    entity: Record<string, unknown>,
    entityType: EntityType
): { item: { id: string; name: string }; isCore: boolean }[] {
    if (entityType === 'initiative') {
        const domains =
            (entity.impactedCompanyDomains as CompanyDomainMM[]) || []
        return domains.map(d => ({
            item: {
                id: d.companyDomainId,
                name: d.companyDomainName || d.companyDomainId
            },
            isCore: false
        }))
    }
    const domain = entity.linkedCompanyDomain as CompanyDomainMM | null
    if (!domain) return []
    return [
        {
            item: {
                id: domain.companyDomainId,
                name: domain.companyDomainName || domain.companyDomainId
            },
            isCore: false
        }
    ]
}

function extractInitiativeTags(
    entity: Record<string, unknown>
): { item: { id: string; name: string }; isCore: boolean }[] {
    const initiatives =
        (entity.linkedInitiatives as InitiativeReferenceMM[]) || []
    return initiatives.map(i => ({
        item: {
            id: i.initiativeId,
            name: i.initiativeName || i.initiativeId
        },
        isCore: i.isCore ?? false
    }))
}

function TagsCell({
    tags,
    isLink
}: {
    tags: {
        item: { id: string; name: string; file_id?: string }
        isCore: boolean
    }[]
    isLink: boolean
}) {
    if (tags.length === 0) return <Text fontSize='sm'>-</Text>
    return (
        <Flex flexWrap='wrap' gap={1}>
            {tags.map(tag => (
                <PtbTags
                    key={tag.item.id}
                    item={tag.item}
                    isCore={tag.isCore}
                    isLink={isLink}
                />
            ))}
        </Flex>
    )
}

function DiffRow({
    diff,
    requestDate,
    currentTagItems,
    snapshotTagItems,
    isTagField
}: {
    diff: FieldDiff
    requestDate: string
    status: string
    currentTagItems?: {
        item: { id: string; name: string; file_id?: string }
        isCore: boolean
    }[]
    snapshotTagItems?: {
        item: { id: string; name: string; file_id?: string }
        isCore: boolean
    }[]
    isTagField?: boolean
}) {
    return (
        <Grid
            templateColumns='2fr 2fr 1.5fr'
            gap={4}
            px={4}
            py={4}
            borderBottom='1px solid'
            borderColor='gray.200'
            alignItems='center'
        >
            {isTagField && snapshotTagItems ? (
                <Box fontSize='sm'>
                    <Text fontWeight='500' mb={1}>
                        {diff.field}:
                    </Text>
                    <TagsCell
                        tags={snapshotTagItems}
                        isLink={diff.field === 'ADRs'}
                    />
                </Box>
            ) : (
                <Text fontSize='sm'>{`${diff.field}: ${diff.from}`}</Text>
            )}
            <Flex alignItems='center' gap={1} fontSize='sm'>
                {diff.isChanged && (
                    <IconWarning
                        isFilled={true}
                        color='caution'
                        size='xl'
                        style={{ fontSize: '18px' }}
                    />
                )}
                {isTagField && currentTagItems ? (
                    <Box>
                        <Text fontWeight='500' mb={1}>
                            {diff.field}:
                        </Text>
                        <TagsCell
                            tags={currentTagItems}
                            isLink={diff.field === 'ADRs'}
                        />
                    </Box>
                ) : (
                    <Text>{`${diff.field}: ${diff.to}`}</Text>
                )}
            </Flex>
            <Text fontSize='sm'>{requestDate}</Text>
            {/*<Box>*/}
            {/*    <StatusPill status={status} />*/}
            {/*</Box>*/}
        </Grid>
    )
}

export default function AttestationAccordion({
    entityType,
    entityId,
    currentEntity,
    role,
    userEmail,
    userName
}: AttestationAccordionProps) {
    const [showSuccess, setShowSuccess] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const { data: attestations, isLoading: listLoading } = useAttestationsList(
        entityType,
        entityId
    )

    const latestAttestationId = getLatestAttestationId(attestations)

    const { data: attestationDetail, isLoading: detailLoading } =
        useAttestationDetail(
            entityType,
            entityId,
            latestAttestationId || '',
            !!latestAttestationId
        )

    const createMutation = useCreateAttestation(entityType, entityId)

    if (listLoading) return <Spinner />

    const snapshot =
        latestAttestationId && attestationDetail
            ? (attestationDetail.attestationSnapshot as unknown as Record<
                  string,
                  unknown
              >)
            : null

    const stale = isSnapshotStale(snapshot, currentEntity, entityType)
    const noAttestations = !attestations || attestations.length === 0
    const shouldShow = noAttestations || stale

    if (!shouldShow && !showSuccess) return null

    if (showSuccess) {
        return (
            <Box
                mt={4}
                p={4}
                bg='green.50'
                border='1px solid'
                borderColor='green.200'
                borderRadius='8px'
            >
                <Flex justifyContent='space-between' alignItems='center'>
                    <Flex alignItems='center' gap={3}>
                        <Box>
                            <Text
                                fontWeight='bold'
                                fontSize='md'
                                color='green.700'
                            >
                                Change Request Complete
                            </Text>
                            <Text fontSize='sm' color='green.600'>
                                All proposed changes have been reviewed and
                                attested.
                            </Text>
                        </Box>
                    </Flex>
                    <CloseButton onClick={() => setShowSuccess(false)} />
                </Flex>
            </Box>
        )
    }
    const isPrincipalArchitect = role === 'principal_architect'

    const diffs = computeTrackedFieldDiffs(snapshot, currentEntity, entityType)
    const requestDate = attestationDetail?.attestationDate
        ? new Date(attestationDetail.attestationDate).toLocaleDateString()
        : new Date().toLocaleDateString()

    const attestationType = resolveAttestationType(entityType)

    const handleSubmit = () => {
        setShowModal(true)
    }

    const handleModalConfirm = (payload: {
        attestationType: string
        capturedAttestations: CapturedAttestationItem[]
    }) => {
        setShowModal(false)
        createMutation.mutate(
            {
                attestationBy: {
                    email: userEmail,
                    name: userName
                },
                additionalDetails: [],
                attestationType: payload.attestationType,
                capturedAttestations: payload.capturedAttestations
            },
            {
                onSuccess: () => {
                    setShowSuccess(true)
                }
            }
        )
    }

    return (
        <Box
            mt={4}
            border='1px solid'
            borderColor='gray.200'
            borderRadius='8px'
        >
            <Accordion.Root collapsible>
                <Accordion.Item value='attestation'>
                    <Accordion.ItemTrigger p={0} _hover={{ cursor: 'pointer' }}>
                        <Box w='100%'>
                            <AttestationBanner role={role} />
                        </Box>
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent>
                        <Accordion.ItemBody>
                            {detailLoading ? (
                                <Spinner />
                            ) : (
                                <>
                                    {attestationDetail?.attestationDate && (
                                        <Text
                                            fontSize='xs'
                                            color='gray.500'
                                            px={4}
                                            mb={2}
                                        >
                                            Last attested:{' '}
                                            {new Date(
                                                attestationDetail.attestationDate
                                            ).toLocaleDateString()}
                                        </Text>
                                    )}
                                    <Grid
                                        templateColumns='2fr 2fr 1.5fr'
                                        gap={4}
                                        px={4}
                                        py={2}
                                        bg='gray.200'
                                        borderRadius='4px'
                                    >
                                        <Text
                                            fontWeight='500'
                                            fontSize='sm'
                                            fontStyle='italic'
                                        >
                                            Change From
                                        </Text>
                                        <Text
                                            fontWeight='500'
                                            fontSize='sm'
                                            fontStyle='italic'
                                        >
                                            Change To
                                        </Text>
                                        <Text
                                            fontWeight='500'
                                            fontSize='sm'
                                            fontStyle='italic'
                                        >
                                            Attestation Date
                                        </Text>
                                        {/*<Text*/}
                                        {/*    fontWeight='500'*/}
                                        {/*    fontSize='sm'*/}
                                        {/*    fontStyle='italic'*/}
                                        {/*>*/}
                                        {/*    Status*/}
                                        {/*</Text>*/}
                                    </Grid>

                                    {diffs.map(diff => {
                                        const isAdrField = diff.field === 'ADRs'
                                        const isBvbField = diff.field === 'BVBs'
                                        const isDomainField =
                                            diff.field === 'Company Domain'
                                        const isInitiativeField =
                                            diff.field === 'Linked Initiatives'
                                        const isTagField =
                                            isAdrField ||
                                            isBvbField ||
                                            isDomainField ||
                                            isInitiativeField
                                        let currentTagItems:
                                            | {
                                                  item: {
                                                      id: string
                                                      name: string
                                                      file_id?: string
                                                  }
                                                  isCore: boolean
                                              }[]
                                            | undefined
                                        if (isAdrField) {
                                            currentTagItems = extractTagItems(
                                                currentEntity,
                                                entityType,
                                                'adrs'
                                            )
                                        } else if (isBvbField) {
                                            currentTagItems = extractTagItems(
                                                currentEntity,
                                                entityType,
                                                'bvbs'
                                            )
                                        } else if (isDomainField) {
                                            currentTagItems =
                                                extractCompanyDomainTags(
                                                    currentEntity,
                                                    entityType
                                                )
                                        } else if (isInitiativeField) {
                                            currentTagItems =
                                                extractInitiativeTags(
                                                    currentEntity
                                                )
                                        }
                                        let snapshotTagItems:
                                            | {
                                                  item: {
                                                      id: string
                                                      name: string
                                                      file_id?: string
                                                  }
                                                  isCore: boolean
                                              }[]
                                            | undefined
                                        if (isTagField && snapshot) {
                                            if (isAdrField) {
                                                snapshotTagItems =
                                                    extractTagItems(
                                                        snapshot,
                                                        entityType,
                                                        'adrs'
                                                    )
                                            } else if (isBvbField) {
                                                snapshotTagItems =
                                                    extractTagItems(
                                                        snapshot,
                                                        entityType,
                                                        'bvbs'
                                                    )
                                            } else if (isDomainField) {
                                                snapshotTagItems =
                                                    extractCompanyDomainTags(
                                                        snapshot,
                                                        entityType
                                                    )
                                            } else if (isInitiativeField) {
                                                snapshotTagItems =
                                                    extractInitiativeTags(
                                                        snapshot
                                                    )
                                            }
                                        }
                                        return (
                                            <DiffRow
                                                key={diff.field}
                                                diff={diff}
                                                requestDate={requestDate}
                                                status='Pending Attestation'
                                                isTagField={isTagField}
                                                currentTagItems={
                                                    currentTagItems
                                                }
                                                snapshotTagItems={
                                                    snapshotTagItems
                                                }
                                            />
                                        )
                                    })}

                                    {isPrincipalArchitect && (
                                        <Flex
                                            justifyContent='flex-end'
                                            alignItems='center'
                                            mt={4}
                                            px={4}
                                            pb={4}
                                            gap={4}
                                        >
                                            <Button
                                                colorPalette='blue'
                                                size='sm'
                                                borderRadius='full'
                                                loading={
                                                    createMutation.isPending
                                                }
                                                onClick={handleSubmit}
                                            >
                                                Submit Attestation
                                            </Button>
                                        </Flex>
                                    )}
                                </>
                            )}
                        </Accordion.ItemBody>
                    </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
            <AttestationConfirmationModal
                isOpen={showModal}
                attestationType={attestationType}
                onConfirm={handleModalConfirm}
                onCancel={() => setShowModal(false)}
            />
        </Box>
    )
}
