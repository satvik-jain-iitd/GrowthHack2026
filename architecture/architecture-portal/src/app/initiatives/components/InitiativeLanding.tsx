'use client'
import React, { useMemo, useState } from 'react'
import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { usePlaybook } from '@/hooks'
import { LoadingSpinner } from '@/components/ui'
import { User } from '@/app/layout/AuthBlueSso'
import { useUserContext } from '@/context'
import {
    canEditInitiative,
    flattenMetadata,
    getAttestationRole
} from '../utils/initiativeOwnership'
import { mapMetamodelToInitiative } from '../utils/metamodelMapper'
import InitiativeEditForm from './InitiativeEditForm'
import {
    InitiativeSummaryGrid,
    InitiativeOwnersGrid,
    InitiativeAdditionalInfo
} from './landing'
import { useMetamodelInitiativeView } from '@/app/shared/hooks'
import { hasRecommendedValues } from '@/app/shared/utils/recommendationDiff'
import { useCreateAttestation } from '@/app/shared/hooks/useAttestations'
import {
    AttestationAccordion,
    MetamodelAuditHistoryModal,
    RecommendationLegend
} from '@/app/shared/components'
import AttestationConfirmationModal from '@/app/shared/components/AttestationConfirmationModal'
import {
    resolveAttestationType,
    type CapturedAttestationItem
} from '@/constants/attestationConfig'

function InitiativeLanding({ uuid }: { uuid?: string }) {
    const user: User | undefined = useUserContext()
    const { email, fullName } = user?.attributes || {}
    const { data: playbook, isLoading } = usePlaybook(uuid || '')

    const { initiative_id } = playbook || {}

    const {
        data: metamodelEntity,
        isLoading: metamodelLoading,
        refetch: refetchMetamodel,
        recommendedValues
    } = useMetamodelInitiativeView(initiative_id || '')

    const initiativeData = useMemo(
        () =>
            metamodelEntity
                ? mapMetamodelToInitiative(metamodelEntity)
                : undefined,
        [metamodelEntity]
    )

    const metadata = flattenMetadata(initiativeData?.metadata)

    const [isEdit, setIsEdit] = useState(false)
    const [isAuditHistoryOpen, setIsAuditHistoryOpen] = useState(false)
    const [isReattestModalOpen, setIsReattestModalOpen] = useState(false)

    const createAttestation = useCreateAttestation(
        'initiative',
        initiative_id || ''
    )

    if (isLoading || metamodelLoading) {
        return <LoadingSpinner />
    }

    const hasMetamodelEntity = !!metamodelEntity
    const hasEditPermission = canEditInitiative(
        initiativeData,
        email,
        user?.groups || []
    )
    const attestationRole = getAttestationRole(
        initiativeData,
        email,
        user?.groups || []
    )
    return (
        <Box
            marginBottom={5}
            paddingY={1}
            background='white'
            borderRadius='17px'
            width='100%'
            pl='3rem'
            pr='3rem'
            fontFamily='Arial, Helvetica, sans-serif'
        >
            <Box mt={4} p={4} border='1px solid #ECEDEE' borderRadius='8px'>
                <Flex justifyContent='space-between' alignItems='flex-start'>
                    <Box>
                        <Heading size='2xl' mt={2}>
                            {initiativeData?.name?.toUpperCase() || ''}
                        </Heading>
                    </Box>
                    <VStack>
                        {/*<HStack>*/}
                        {/*    <Flex*/}
                        {/*        gap={2}*/}
                        {/*        alignItems={'center'}*/}
                        {/*        justifyContent={'center'}*/}
                        {/*        width={20}*/}
                        {/*        height={25}*/}
                        {/*        borderRadius={'full'}*/}
                        {/*        border={'1px solid #008767'}*/}
                        {/*        backgroundColor={'#43A34C1A'}*/}
                        {/*    >*/}
                        {/*        <CompleteCheckIcon width={12} height={12} />*/}

                        {/*        <Text color={'#008767'} fontSize={10}>*/}
                        {/*            Pre Build*/}
                        {/*        </Text>*/}
                        {/*    </Flex>*/}
                        {/*    <Flex*/}
                        {/*        gap={2}*/}
                        {/*        alignItems={'center'}*/}
                        {/*        justifyContent={'center'}*/}
                        {/*        width={20}*/}
                        {/*        height={25}*/}
                        {/*        borderRadius={'full'}*/}
                        {/*        border={'1px solid #8E9092'}*/}
                        {/*        backgroundColor={'#F7F8F9'}*/}
                        {/*    >*/}
                        {/*        <IncompleteCheckIcon width={12} height={12} />*/}

                        {/*        <Text color={'#8E9092'} fontSize={10}>*/}
                        {/*            Pre Deploy*/}
                        {/*        </Text>*/}
                        {/*    </Flex>*/}
                        {/*</HStack>*/}
                        <Flex alignItems='center' gap={4} mt={2} mr={12}>
                            <Text
                                color='blue.600'
                                fontSize='sm'
                                cursor='pointer'
                                onClick={() => setIsAuditHistoryOpen(true)}
                                _hover={{ textDecoration: 'underline' }}
                            >
                                View Audit History
                            </Text>
                            {attestationRole === 'principal_architect' && (
                                <Text
                                    color='blue.600'
                                    fontSize='sm'
                                    cursor='pointer'
                                    onClick={() => setIsReattestModalOpen(true)}
                                    _hover={{ textDecoration: 'underline' }}
                                >
                                    {createAttestation.isPending
                                        ? 'Reattesting...'
                                        : 'Reattest'}
                                </Text>
                            )}
                        </Flex>
                    </VStack>
                </Flex>
            </Box>

            {hasMetamodelEntity &&
                attestationRole &&
                !hasRecommendedValues(recommendedValues) && (
                    <AttestationAccordion
                        entityType='initiative'
                        entityId={initiative_id || ''}
                        currentEntity={
                            metamodelEntity as unknown as Record<
                                string,
                                unknown
                            >
                        }
                        role={attestationRole}
                        userEmail={email}
                        userName={fullName}
                    />
                )}

            <Flex>
                <Box width='100%'>
                    <Box>
                        {isEdit ? (
                            <InitiativeEditForm
                                playbook={playbook}
                                initiativeData={initiativeData}
                                metamodelEntity={metamodelEntity}
                                setIsEdit={setIsEdit}
                                refetch={refetchMetamodel}
                            />
                        ) : (
                            <>
                                {initiativeData && (
                                    <>
                                        {hasRecommendedValues(
                                            recommendedValues
                                        ) && <RecommendationLegend />}
                                        <InitiativeSummaryGrid
                                            initiativeData={initiativeData}
                                        />
                                        <InitiativeOwnersGrid
                                            initiativeData={initiativeData}
                                        />
                                        <InitiativeAdditionalInfo
                                            initiativeData={initiativeData}
                                            metadata={metadata}
                                            recommendedValues={
                                                recommendedValues
                                            }
                                        />
                                    </>
                                )}
                                {hasEditPermission ? (
                                    <Button
                                        mt={4}
                                        mb={4}
                                        colorPalette='blue'
                                        onClick={() => setIsEdit(true)}
                                    >
                                        Edit
                                    </Button>
                                ) : null}
                            </>
                        )}
                    </Box>
                </Box>
            </Flex>

            {hasMetamodelEntity ? (
                <>
                    <MetamodelAuditHistoryModal
                        isOpen={isAuditHistoryOpen}
                        onClose={() => setIsAuditHistoryOpen(false)}
                        entityType='initiative'
                        entityId={initiative_id || ''}
                    />
                    <AttestationConfirmationModal
                        isOpen={isReattestModalOpen}
                        attestationType={resolveAttestationType('initiative')}
                        onConfirm={(payload: {
                            attestationType: string
                            capturedAttestations: CapturedAttestationItem[]
                        }) => {
                            setIsReattestModalOpen(false)
                            createAttestation.mutate({
                                attestationBy: {
                                    name: fullName,
                                    email
                                },
                                additionalDetails: [],
                                attestationType: payload.attestationType,
                                capturedAttestations:
                                    payload.capturedAttestations
                            })
                        }}
                        onCancel={() => setIsReattestModalOpen(false)}
                    />
                </>
            ) : null}
        </Box>
    )
}

export default InitiativeLanding
