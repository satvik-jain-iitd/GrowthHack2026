'use client'
import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Combobox,
    Flex,
    Grid,
    GridItem,
    Heading,
    NativeSelect,
    Span,
    Spinner,
    Tag,
    TagsInput,
    Text,
    useCombobox,
    useFilter,
    useListCollection,
    useTagsInput
} from '@chakra-ui/react'
import { useNavigation } from '@/hooks'
import { User } from '@/app/layout/AuthBlueSso'
import { useDomainContext, useUserContext } from '@/context'
import SelectRadioGroup from '@/app/initiatives/components/SelectRadioGroup'
import MarketsSelect from '@/app/initiatives/components/MarketsSelect'
import { countryOptions } from '@/app/company-domains/constants'
import { Markets } from '@/app/company-domains/types'
import {
    canEditApplication,
    flattenMetadata,
    getApplicationAttestationRole
} from '../utils/applicationOwnership'
import { mapMetamodelToApplication } from '../utils/metamodelApplicationMapper'
import { ApplicationInfoGrid, ApplicationOwnersGrid } from './landing'
import {
    useMetamodelApplicationView,
    useUpdateMetamodelApplication,
    useMetamodelAdrOptions,
    useMetamodelBvbOptions,
    useMetamodelInitiativeOptions,
    useTechStackOptions,
    useMetamodelFoundationalTechnologyOptions,
    useMetamodelTechnicalCapabilityOptions,
    useCreateAttestation
} from '@/app/shared/hooks'
import { usePlaybookTypesGenAi } from '../hooks'
import {
    AttestationAccordion,
    CapabilityDrilldownSelect,
    MetamodelAuditHistoryModal,
    RecommendationLegend
} from '@/app/shared/components'
import {
    hasRecommendedValues,
    isRecommendedValue
} from '@/app/shared/utils/recommendationDiff'
import AttestationConfirmationModal from '@/app/shared/components/AttestationConfirmationModal'
import {
    resolveAttestationType,
    type CapturedAttestationItem
} from '@/constants/attestationConfig'

function TagMultiSelect({
    label,
    idPrefix,
    placeholder,
    options,
    selected,
    onChange
}: {
    label: string
    idPrefix: string
    placeholder: string
    options: { label: string; value: string }[]
    selected: { label: string; value: string }[]
    onChange: (items: { label: string; value: string }[]) => void
}) {
    const { contains } = useFilter({ sensitivity: 'base' })
    const { collection, filter, set } = useListCollection({
        initialItems: options,
        filter: contains,
        limit: 20,
        itemToString: item => item.label,
        itemToValue: item => item.value
    })

    useEffect(() => {
        if (options && options.length > 0) {
            set(options)
        }
    }, [options])

    const selectedValues = new Set(selected.map(s => s.value))

    const combobox = useCombobox({
        ids: {
            input: `input_${idPrefix}`,
            control: `control_${idPrefix}`
        },
        name: idPrefix,
        collection,
        allowCustomValue: false,
        value: [],
        placeholder,
        selectionBehavior: 'clear',
        onInputValueChange: e => filter(e.inputValue),
        onValueChange: e => {
            const val = e.value[0]
            if (!val || selectedValues.has(val)) return
            const opt = options.find(o => o.value === val)
            if (opt) onChange([...selected, opt])
        },
        closeOnSelect: true
    })

    const tags = useTagsInput({
        ids: {
            input: `input_${idPrefix}`,
            control: `control_${idPrefix}`
        },
        name: idPrefix
    })

    const onRemove = (value: string) => {
        onChange(selected.filter(s => s.value !== value))
    }

    return (
        <Flex direction='column' gap={4}>
            <GridItem>
                <Text textStyle='sm' fontWeight='bold'>
                    {label}
                </Text>
                <Box>
                    <Combobox.RootProvider value={combobox} width='400px'>
                        <TagsInput.RootProvider value={tags}>
                            <TagsInput.Control
                                style={{ width: '400px' }}
                                border='1px solid #8C8C8C'
                                borderRadius='5px'
                            >
                                <Combobox.Trigger style={{ width: '100%' }}>
                                    <Combobox.Input unstyled asChild>
                                        <TagsInput.Input
                                            style={{ width: '100%' }}
                                            placeholder={placeholder}
                                        />
                                    </Combobox.Input>
                                </Combobox.Trigger>
                            </TagsInput.Control>
                            <Combobox.Positioner>
                                <Combobox.Content>
                                    {collection?.items?.map((item, index) => (
                                        <Combobox.Item
                                            key={`${item.value}_${index}`}
                                            item={item}
                                        >
                                            <Span truncate>{item.label}</Span>
                                            {selectedValues.has(item.value) && (
                                                <Combobox.ItemIndicator />
                                            )}
                                        </Combobox.Item>
                                    ))}
                                </Combobox.Content>
                            </Combobox.Positioner>
                        </TagsInput.RootProvider>
                    </Combobox.RootProvider>
                    <Box mb={2}>
                        {selected.map(item => (
                            <Tag.Root
                                key={item.value}
                                ml={2}
                                mt={2}
                                variant='surface'
                                color='#006fcf'
                                backgroundColor='white'
                                border='1px solid #006fcf'
                                cursor='pointer'
                                onClick={() => onRemove(item.value)}
                            >
                                <Tag.Label
                                    padding='5px'
                                    fontSize='14px'
                                    fontWeight='500'
                                >
                                    {item.label} ✕
                                </Tag.Label>
                            </Tag.Root>
                        ))}
                    </Box>
                </Box>
            </GridItem>
        </Flex>
    )
}

function ApplicationLanding({ centralId }: { centralId: string }) {
    const navigation = useNavigation()
    const [isEdit, setIsEdit] = useState(false)
    const [isAuditHistoryOpen, setIsAuditHistoryOpen] = useState(false)
    const [isReattestModalOpen, setIsReattestModalOpen] = useState(false)

    const {
        data: metamodelEntity,
        isLoading: metamodelLoading,
        refetch: refetchMetamodel,
        recommendedValues
    } = useMetamodelApplicationView(centralId || '')

    const applicationData = metamodelEntity
        ? mapMetamodelToApplication(metamodelEntity)
        : undefined

    const metadata = flattenMetadata(applicationData?.metadata)

    const { central_application_da, application_id, application_nm } =
        applicationData || {}

    const createAttestation = useCreateAttestation(
        'application',
        application_id || ''
    )
    const { domains, loading: domainLoading } = useDomainContext() || {}

    const user: User | undefined = useUserContext()
    const { email, fullName } = user?.attributes || {}

    const [fieldsData, setFieldsData] = useState({
        companyDomainId: ''
    })

    const [loading, setLoading] = useState(false)

    const [adrSelection, setAdrSelection] = useState<{
        core: { label: string; value: string }[]
        nonCore: { label: string; value: string }[]
        selected: null | { label: string; value: string }
        type: null | string
    }>({
        core: [],
        nonCore: [],
        selected: null,
        type: null
    })

    const [bvbAdrSelection, setBvbAdrSelection] = useState<{
        core: { label: string; value: string }[]
        nonCore: { label: string; value: string }[]
        selected: null | { label: string; value: string }
        type: null | string
    }>({
        core: [],
        nonCore: [],
        selected: null,
        type: null
    })

    const [linkedInitiativeSelection, setLinkedInitiativeSelection] = useState<{
        core: { label: string; value: string }[]
        nonCore: { label: string; value: string }[]
        selected: null | { label: string; value: string }
        type: null | string
    }>({
        core: [],
        nonCore: [],
        selected: null,
        type: null
    })

    const [linkedPlaybooksField, setLinkedPlaybooksField] = useState<
        { label: string; value: string }[]
    >([])

    const [techStacksField, setTechStacksField] = useState<
        { label: string; value: string }[]
    >([])

    const [marketsField, setMarketsField] = useState<Markets[]>([])

    const [foundationalTechField, setFoundationalTechField] = useState<
        { label: string; value: string }[]
    >([])

    const [techCapabilitiesField, setTechCapabilitiesField] = useState<
        { label: string; value: string }[]
    >([])

    const [businessCapabilities, setBusinessCapabilities] = useState<string[]>(
        []
    )

    const { adrOptions } = useMetamodelAdrOptions()
    const { bvbOptions } = useMetamodelBvbOptions()
    const { data: initiativeOptions } = useMetamodelInitiativeOptions()
    const { data: playbookOptions } = usePlaybookTypesGenAi()
    const { data: techStackOptions } = useTechStackOptions()
    const { foundationalTechnologyOptions } =
        useMetamodelFoundationalTechnologyOptions()
    const { technicalCapabilityOptions } =
        useMetamodelTechnicalCapabilityOptions()

    const foundationalTechSelectOptions =
        foundationalTechnologyOptions?.map(o => ({
            label: o.name,
            value: o.foundationalTechnologyId
        })) || []
    const techCapabilitySelectOptions =
        technicalCapabilityOptions?.map(o => ({
            label: o.name,
            value: o.technicalCapabilityId
        })) || []

    const adrSelectOptions =
        adrOptions?.map(o => ({ label: o.name, value: o.id })) || []
    const bvbSelectOptions =
        bvbOptions?.map(o => ({ label: o.title, value: o.id })) || []

    const mutation = useUpdateMetamodelApplication(centralId || '')

    const handleEdit = () => {
        if (!isEdit) {
            setIsEdit(true)
        } else {
            const body = {
                adrCore: adrSelection.core.map(adr => adr.value),
                adrNonCore: adrSelection.nonCore.map(adr => adr.value),
                bvbCore: bvbAdrSelection.core.map(bvb => bvb.value),
                bvbNonCore: bvbAdrSelection.nonCore.map(bvb => bvb.value),
                linkedInitiativesCore: linkedInitiativeSelection.core.map(
                    i => i.value
                ),
                linkedInitiativesNonCore: linkedInitiativeSelection.nonCore.map(
                    i => i.value
                ),
                linkedCompanyDomainId: fieldsData.companyDomainId || null,
                linkedPlaybooks: linkedPlaybooksField.map(o => o.value),
                technologyStacks: techStacksField.map(o => o.value),
                marketsSupported: marketsField.map(m => m.code),
                foundationalTechnologies: foundationalTechField.map(
                    o => o.value
                ),
                techCapabilities: techCapabilitiesField.map(o => o.value),
                businessCapabilities,
                userEmail: email || ''
            }
            setLoading(true)
            mutation.mutate(body, {
                onSuccess: () => {
                    setIsEdit(!isEdit)
                    setLoading(false)
                    refetchMetamodel()
                }
            })
        }
    }

    const handleChange = (key: string, value: string) => {
        setFieldsData({
            ...fieldsData,
            [key]: value
        })
    }

    const handleBackNavigation = () => {
        navigation.push('/directory')
    }

    useEffect(() => {
        if (metamodelEntity) {
            setFieldsData({
                companyDomainId:
                    metamodelEntity.linkedCompanyDomain?.companyDomainId || ''
            })
            setAdrSelection({
                ...adrSelection,
                core: metamodelEntity.linkedArchitectureDecisionRecords
                    .filter(r => r.isCore)
                    .map(r => ({ label: r.title, value: r.adrId })),
                nonCore: metamodelEntity.linkedArchitectureDecisionRecords
                    .filter(r => !r.isCore)
                    .map(r => ({ label: r.title, value: r.adrId }))
            })
            setBvbAdrSelection({
                ...bvbAdrSelection,
                core: metamodelEntity.linkedBuildVsBuyAssessments
                    .filter(r => r.isCore)
                    .map(r => ({ label: r.title, value: r.bvbId })),
                nonCore: metamodelEntity.linkedBuildVsBuyAssessments
                    .filter(r => !r.isCore)
                    .map(r => ({ label: r.title, value: r.bvbId }))
            })
            setLinkedInitiativeSelection({
                ...linkedInitiativeSelection,
                core: metamodelEntity.linkedInitiatives
                    .filter(ref => ref.isCore)
                    .map(ref => ({
                        label: ref.initiativeName || ref.initiativeId,
                        value: ref.initiativeId
                    })),
                nonCore: metamodelEntity.linkedInitiatives
                    .filter(ref => !ref.isCore)
                    .map(ref => ({
                        label: ref.initiativeName || ref.initiativeId,
                        value: ref.initiativeId
                    }))
            })
            setBusinessCapabilities(metamodelEntity.businessCapabilities ?? [])
        }
    }, [metamodelEntity])

    useEffect(() => {
        if (metamodelEntity && playbookOptions) {
            const ids = metamodelEntity.linkedPlaybooks ?? []
            setLinkedPlaybooksField(
                ids.map(id => {
                    const opt = playbookOptions.find(o => o.value === id)
                    return { label: opt?.label ?? id, value: id }
                })
            )
        }
    }, [metamodelEntity, playbookOptions])

    useEffect(() => {
        if (metamodelEntity && techStackOptions) {
            const ids = metamodelEntity.technologyStacks ?? []
            setTechStacksField(
                ids.map(id => ({
                    label: techStackOptions.byId[id] ?? id,
                    value: id
                }))
            )
        }
    }, [metamodelEntity, techStackOptions])

    useEffect(() => {
        if (metamodelEntity) {
            const codes = metamodelEntity.marketsSupported ?? []
            setMarketsField(
                countryOptions.filter(option => codes.includes(option.code))
            )
        }
    }, [metamodelEntity])

    useEffect(() => {
        if (metamodelEntity && foundationalTechnologyOptions) {
            const byId = new Map(
                foundationalTechnologyOptions.map(ft => [
                    ft.foundationalTechnologyId,
                    ft.name
                ])
            )
            const ids = metamodelEntity.linkedFoundationalTechnologies ?? []
            setFoundationalTechField(
                ids.map(id => ({ label: byId.get(id) ?? id, value: id }))
            )
        }
    }, [metamodelEntity, foundationalTechnologyOptions])

    useEffect(() => {
        if (metamodelEntity && technicalCapabilityOptions) {
            const byId = new Map(
                technicalCapabilityOptions.map(tc => [
                    tc.technicalCapabilityId,
                    tc.name
                ])
            )
            const ids = metamodelEntity.techCapabilities ?? []
            setTechCapabilitiesField(
                ids.map(id => ({ label: byId.get(id) ?? id, value: id }))
            )
        }
    }, [metamodelEntity, technicalCapabilityOptions])

    const hasMetamodelEntity = !!metamodelEntity
    const hasEditPermission = canEditApplication(
        applicationData,
        email,
        user?.groups || []
    )
    const attestationRole = getApplicationAttestationRole(
        applicationData,
        email,
        user?.groups || []
    )
    if (metamodelLoading) {
        return (
            <Flex height='50vh' justifyContent='center' alignItems='center'>
                <Spinner />
            </Flex>
        )
    }

    return (
        <>
            <Button
                variant='ghost'
                color='blue.600'
                mb={2}
                px={2}
                onClick={handleBackNavigation}
            >
                {'Back to Applications'}
            </Button>
            <Box mt={4} p={4} border='1px solid #ECEDEE' borderRadius='8px'>
                <Flex
                    justifyContent='space-between'
                    alignItems='flex-start'
                    gap={6}
                >
                    <Box flex='1' minW={0}>
                        <Heading size='2xl' mt={2}>
                            {application_nm?.toUpperCase() || 'EXPLORER'}
                        </Heading>
                        <Text
                            fontSize='sm'
                            mt={2}
                            color='gray.600'
                            textWrap='auto'
                            wordBreak='break-word'
                        >
                            {central_application_da?.description}
                        </Text>
                    </Box>
                    <Flex alignItems='center' gap={4} mt={2} flexShrink={0}>
                        <Text
                            color='blue.600'
                            fontSize='sm'
                            cursor='pointer'
                            whiteSpace='nowrap'
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
                                whiteSpace='nowrap'
                                onClick={() => setIsReattestModalOpen(true)}
                                _hover={{ textDecoration: 'underline' }}
                            >
                                {createAttestation.isPending
                                    ? 'Reattesting...'
                                    : 'Reattest'}
                            </Text>
                        )}
                    </Flex>
                </Flex>
            </Box>

            {hasMetamodelEntity &&
                attestationRole &&
                !hasRecommendedValues(recommendedValues) && (
                    <AttestationAccordion
                        entityType='application'
                        entityId={centralId}
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

            <Grid mt='4' templateColumns='repeat(5, 1fr)' gap={8}>
                <GridItem
                    w='100%'
                    colSpan={isEdit ? 5 : 3}
                    paddingRight={isEdit ? undefined : '40px'}
                    borderRight={isEdit ? undefined : '1px solid #c8c9c7'}
                >
                    {!isEdit &&
                        applicationData &&
                        hasRecommendedValues(recommendedValues) && (
                            <RecommendationLegend />
                        )}
                    {!isEdit && applicationData && (
                        <ApplicationInfoGrid
                            applicationData={applicationData}
                            metadata={metadata}
                            isEdit={isEdit}
                            linkedPlaybookNames={linkedPlaybooksField.map(
                                o => o.label
                            )}
                            linkedPlaybookIds={linkedPlaybooksField.map(
                                o => o.value
                            )}
                            techStackNames={techStacksField.map(o => o.label)}
                            techStackIds={techStacksField.map(o => o.value)}
                            recommendedValues={recommendedValues}
                            isCompanyDomainRecommended={isRecommendedValue(
                                recommendedValues,
                                'companyDomains',
                                metamodelEntity?.linkedCompanyDomain
                                    ?.companyDomainId
                            )}
                        />
                    )}
                    <GridItem w='100%' colSpan={3}>
                        {isEdit && (
                            <Grid
                                templateColumns='repeat(2, 1fr)'
                                justifyContent='space-between'
                                mt={4}
                            >
                                <GridItem>
                                    <Text fontWeight='bold'>
                                        Company Domain
                                    </Text>
                                    <NativeSelect.Root
                                        width='400px'
                                        disabled={domainLoading}
                                    >
                                        <NativeSelect.Field
                                            placeholder={
                                                domainLoading
                                                    ? 'Loading...'
                                                    : '-- Choose one --'
                                            }
                                            value={
                                                fieldsData.companyDomainId || ''
                                            }
                                            onChange={e => {
                                                handleChange(
                                                    'companyDomainId',
                                                    e.target.value
                                                )
                                            }}
                                        >
                                            {domains?.map(domain => (
                                                <option
                                                    key={
                                                        domain.company_domain_id
                                                    }
                                                    value={
                                                        domain.company_domain_id
                                                    }
                                                >
                                                    {domain.domain_nm}
                                                </option>
                                            ))}
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </GridItem>
                                <GridItem mt={2}>
                                    <SelectRadioGroup
                                        options={adrSelectOptions}
                                        name='ADR'
                                        selection={adrSelection}
                                        setSelection={setAdrSelection}
                                        width='400px'
                                    />
                                </GridItem>
                                <GridItem mt={2}>
                                    <SelectRadioGroup
                                        width='400px'
                                        options={bvbSelectOptions}
                                        name='BVB'
                                        selection={bvbAdrSelection}
                                        setSelection={setBvbAdrSelection}
                                    />
                                </GridItem>
                                <GridItem mt={2}>
                                    <SelectRadioGroup
                                        width='400px'
                                        options={initiativeOptions || []}
                                        name='Linked Initiative'
                                        selection={linkedInitiativeSelection}
                                        setSelection={
                                            setLinkedInitiativeSelection
                                        }
                                    />
                                </GridItem>
                                <GridItem mt={2}>
                                    <TagMultiSelect
                                        label='Playbooks'
                                        idPrefix='playbooks'
                                        placeholder='Select Playbooks'
                                        options={playbookOptions || []}
                                        selected={linkedPlaybooksField}
                                        onChange={setLinkedPlaybooksField}
                                    />
                                </GridItem>
                                <GridItem mt={2}>
                                    <TagMultiSelect
                                        label='Tech Stacks'
                                        idPrefix='techstacks'
                                        placeholder='Select Tech Stacks'
                                        options={
                                            techStackOptions?.options || []
                                        }
                                        selected={techStacksField}
                                        onChange={setTechStacksField}
                                    />
                                </GridItem>
                                <GridItem mt={2}>
                                    <TagMultiSelect
                                        label='Foundational Technologies'
                                        idPrefix='foundationaltech'
                                        placeholder='Select Foundational Technologies'
                                        options={foundationalTechSelectOptions}
                                        selected={foundationalTechField}
                                        onChange={setFoundationalTechField}
                                    />
                                </GridItem>
                                <GridItem mt={2}>
                                    <TagMultiSelect
                                        label='Technical Capabilities'
                                        idPrefix='techcapabilities'
                                        placeholder='Select Technical Capabilities'
                                        options={techCapabilitySelectOptions}
                                        selected={techCapabilitiesField}
                                        onChange={setTechCapabilitiesField}
                                    />
                                </GridItem>
                                <GridItem mt={2}>
                                    <CapabilityDrilldownSelect
                                        value={businessCapabilities}
                                        onChange={setBusinessCapabilities}
                                    />
                                </GridItem>
                                <GridItem mt={2}>
                                    <Text
                                        textStyle='sm'
                                        fontWeight='bold'
                                        mb={2}
                                    >
                                        Markets
                                    </Text>
                                    <MarketsSelect
                                        marketFormValue={marketsField}
                                        setMarketFormValue={setMarketsField}
                                    />
                                </GridItem>
                            </Grid>
                        )}
                    </GridItem>
                </GridItem>
                {!isEdit && (
                    <GridItem w='100%' colSpan={2}>
                        {applicationData && (
                            <ApplicationOwnersGrid
                                applicationData={applicationData}
                            />
                        )}
                    </GridItem>
                )}
            </Grid>
            <Box mt='10'>
                {hasEditPermission && (
                    <Button
                        loading={loading}
                        onClick={handleEdit}
                        colorPalette='blue'
                        mr={2}
                    >
                        {isEdit ? 'Save' : 'Edit'}
                    </Button>
                )}
                {isEdit && (
                    <Button
                        onClick={() => {
                            setIsEdit(false)
                        }}
                        variant='outline'
                        mr={2}
                    >
                        Cancel
                    </Button>
                )}
            </Box>

            {hasMetamodelEntity && (
                <>
                    <MetamodelAuditHistoryModal
                        isOpen={isAuditHistoryOpen}
                        onClose={() => setIsAuditHistoryOpen(false)}
                        entityType='application'
                        entityId={centralId}
                    />
                    <AttestationConfirmationModal
                        isOpen={isReattestModalOpen}
                        attestationType={resolveAttestationType('application')}
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
            )}
        </>
    )
}

export default ApplicationLanding
