/* istanbul ignore file */
'use client'
import React, { useState, useRef, useEffect } from 'react'
import EdaaatIcon from '../../../../components/icons/EdaaatIcon'
import styles from '../edaaat.module.css'
import { Box, Flex, HStack, Button } from '@chakra-ui/react'
import { IconDownload, IconUpload, IconInfo } from '@americanexpress/dls-icons'
import Select, { ActionMeta, SingleValue } from 'react-select'
import {
    useSubmitDiagramFormData as SubmitDiagramFormData,
    useDBFootprint as DBFootprint,
    usePreviousArtifacts as PreviousArtifacts
} from '../hooks'
import DiagramPreview from './DiagramPreview'
import DBFootprintTable from './DBFootprintTable'
import { Input, Tag } from '@chakra-ui/react'
import { NoPrefetchLink, Tooltip } from '@/components/ui'
import {
    EDAAAT_API_URL,
    EDAAAT_FAQ_URL,
    EDAAAT_DATA_FLOW_DIAGRAM,
    EDAAAT_CONCEPTUAL_MODAL
} from '@/constants'
import { useUserContext } from '@/context'
import { useGetDomains } from '@/app/company-domains/hooks'
import {
    FormFieldsType,
    EdaaatSelectOption,
    DomainOption,
    DiagramApiError,
    ExtractedFile,
    DiagramApiResult,
    DBFootprintTableData,
    JsonObject,
    JsonValue
} from '../utils/types'
import { PreviousArtifactsModal } from '@/app/resources/edaaat/modals'

const extractedFileDefaultValue: ExtractedFile = {
    type: 'image',
    diagramImage: null,
    diagramFileName: null,
    diagramDetailImage: null,
    diagramDetailFileName: null
}

export const ARTIFACT_OPTIONS = [
    { value: 'company-domain', label: 'Company Domain' },
    { value: 'company-subdomain', label: 'Company Subdomain' },
    { value: 'etp-ecmi', label: 'ETP/ECMI' }
]

export const DIAGRAM_OPTIONS = [
    { value: 'conceptual-model', label: 'Conceptual Data Model' },
    { value: 'data-flow-diagram', label: 'Data Flow Diagram' },
    { value: 'db-footprint', label: 'DB Footprint' }
]

export const COMPANY_DOMAIN_DATA_FLOW_LEVELS = [
    { value: 'level-0', label: 'Level 0' },
    { value: 'level-1', label: 'Level 1' }
]

const getPreviousArtifactsList = (
    value: JsonValue | null
): JsonValue[] | null => {
    if (Array.isArray(value)) {
        return value
    }

    if (value && typeof value === 'object') {
        const nestedData = (value as JsonObject).data
        if (Array.isArray(nestedData)) {
            return nestedData
        }
    }

    return null
}

const hasDownloadablePayload = (value: JsonValue | undefined): boolean => {
    if (!value || Array.isArray(value) || typeof value !== 'object') {
        return false
    }

    return Object.entries(value as JsonObject).some(([key, sheetValue]) => {
        if (key === 'Conceptual_Heading') {
            return false
        }

        if (sheetValue === null) {
            return false
        }

        if (Array.isArray(sheetValue)) {
            return sheetValue.length > 0
        }

        if (typeof sheetValue === 'object') {
            return Object.keys(sheetValue as Record<string, unknown>).length > 0
        }

        return String(sheetValue).trim().length > 0
    })
}

const getDownloadablePreviousArtifactsList = (
    value: JsonValue | null
): JsonValue[] | null => {
    const artifactRows = getPreviousArtifactsList(value)
    if (!artifactRows) {
        return null
    }

    const downloadableRows = artifactRows.filter(item => {
        if (!item || Array.isArray(item) || typeof item !== 'object') {
            return false
        }

        const payload = (item as JsonObject).inp_fl_da
        return hasDownloadablePayload(payload)
    })

    return downloadableRows.length > 0 ? downloadableRows : null
}

//DON'T REMOVE COMMENTED CODE
export default function EdaaatUI() {
    const [selectedFileName, setSelectedFileName] = useState('No file selected')
    const [uploadedFile, setUploadedFile] = useState<File>()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const usageMetricsRequestSeqRef = useRef(0)
    const [formFields, setFormFields] = useState<FormFieldsType>({})
    const [diagramArtifact, setDiagramArtifact] = useState<ExtractedFile>(
        extractedFileDefaultValue
    )
    const [errors, setErrors] = useState<DiagramApiError[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [subdomains, setSubdomains] = useState<string[]>([])
    const [showNotification, setShowNotification] = useState<boolean>(false)
    const [previousArtifactsData, setPreviousArtifactsData] = useState<
        JsonValue[] | null
    >(null)
    const [dbFootprintData, setDbFootprintData] =
        useState<DBFootprintTableData | null>(null)
    const [openPrevArtifactsModal, setOpenPrevArtifactsModal] = useState(false)
    const user = useUserContext()
    const { adsId = '' } = user?.attributes ?? {}
    const domains = useGetDomains()
    const { mutateAsync: fetchDBFootprint } = DBFootprint(EDAAAT_API_URL)
    const { mutateAsync: submitDiagramFormData } =
        SubmitDiagramFormData(EDAAAT_API_URL)
    const { mutateAsync: submitPreviousArtifacts } =
        PreviousArtifacts(EDAAAT_API_URL)
    const hasPreviousArtifactsData =
        Array.isArray(previousArtifactsData) && previousArtifactsData.length > 0

    const showAdditionalSubdomains =
        (formFields?.artifact_name !== undefined &&
            formFields?.artifact_name !== null &&
            formFields?.artifact_name !== 'etp-ecmi' &&
            formFields?.artifact_name === 'company-subdomain' &&
            formFields?.diagram_type === 'data-flow-diagram') ||
        (formFields?.artifact_name === 'company-domain' &&
            formFields?.diagram_type === 'data-flow-diagram' &&
            formFields?.diagram_level === 'level-1')
    const diagramOptions =
        formFields?.artifact_name === 'company-domain'
            ? DIAGRAM_OPTIONS
            : DIAGRAM_OPTIONS?.filter(item => item?.value !== 'db-footprint')

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current?.click()
        }
    }

    // Returns the base template URL based on diagram_type
    const handleBaseTemplate = () => {
        if (formFields.diagram_type === 'data-flow-diagram') {
            return EDAAAT_DATA_FLOW_DIAGRAM
        } else if (formFields.diagram_type === 'conceptual-model') {
            return EDAAAT_CONCEPTUAL_MODAL
        }
        return ''
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFileName(file.name)
            setUploadedFile(file)
        } else {
            setSelectedFileName('No file selected')
            setUploadedFile(undefined)
        }
    }

    const handleChange = (
        data: SingleValue<EdaaatSelectOption>,
        action: ActionMeta<EdaaatSelectOption>
    ) => {
        let updatedFormFields: FormFieldsType = {}
        const selectedValue = data?.value || ''

        if (action?.name === 'artifact_name') {
            setDbFootprintData(null)
            if (selectedValue === 'etp-ecmi') {
                updatedFormFields = {
                    ...formFields,
                    [action.name]: selectedValue,
                    diagram_type: 'data-flow-diagram',
                    diagram_level: 'level-0'
                }
                setFormFields(updatedFormFields)
                return
            }
            updatedFormFields = {
                ...formFields,
                [action.name]: selectedValue,
                diagram_type: '',
                diagram_level:
                    selectedValue === 'company-subdomain' ? 'level-2' : ''
            }
        } else if (action?.name === 'diagram_type') {
            setDbFootprintData(null)
            updatedFormFields = {
                ...formFields,
                [action.name]: selectedValue,
                diagram_level:
                    formFields?.artifact_name === 'company-domain' &&
                    selectedValue === 'conceptual-model'
                        ? 'level-1'
                        : formFields?.artifact_name === 'company-subdomain'
                          ? 'level-2'
                          : ''
            }
        } else if (action?.name) {
            updatedFormFields = {
                ...formFields,
                [action.name]: selectedValue
            }
        }
        setFormFields(updatedFormFields)
    }

    const handleInputChange = (name: string, value: string) => {
        const updatedFormFields = { ...formFields, [name]: value }
        setFormFields(updatedFormFields)
    }

    const handleRemoveSubdomain = (subdomain: string) => {
        const updatedSubdomains = subdomains?.filter(d => d !== subdomain)
        setSubdomains(updatedSubdomains)
    }

    const handleSubdomainInputKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            ['Enter', 'Tab', ','].includes(e.key) &&
            formFields?.subdomain?.trim()
        ) {
            e.preventDefault()
            const value = formFields?.subdomain?.trim()
            if (!subdomains?.includes(value)) {
                setSubdomains([...subdomains, value])
            }
            const updatedFormFields = { ...formFields, subdomain: '' }
            setFormFields(updatedFormFields)
        }
    }

    const handleSubdomainInputPaste = (
        e: React.ClipboardEvent<HTMLInputElement>
    ) => {
        e.preventDefault() // Prevent default paste behavior
        const pastedSubdomains = e.clipboardData
            .getData('text')
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0)
        setSubdomains(prev => {
            const mergedSubdomains = [...prev]
            pastedSubdomains.forEach(subdomain => {
                if (!mergedSubdomains.includes(subdomain)) {
                    mergedSubdomains.push(subdomain)
                }
            })
            return mergedSubdomains
        })
        const updatedFormFields = { ...formFields, subdomain: '' }
        setFormFields(updatedFormFields)
    }

    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if (isSubmitting) {
            e.preventDefault()
            return
        }
        e.preventDefault()
        setIsSubmitting(true)
        setErrors([])

        const isDbFootprintSelected = formFields.diagram_type === 'db-footprint'
        const isMissingDiagramLevel =
            !isDbFootprintSelected &&
            !formFields.diagram_level &&
            formFields.artifact_name !== 'etp-ecmi'
        const isMissingCompanyDomain =
            isDbFootprintSelected && !formFields.company_domain_id

        if (
            !formFields.artifact_name ||
            !formFields.diagram_type ||
            isMissingDiagramLevel ||
            isMissingCompanyDomain ||
            (!isDbFootprintSelected && !uploadedFile)
        ) {
            setDiagramArtifact(extractedFileDefaultValue)
            setIsSubmitting(false)
            setErrors([
                { error_description: 'Please fill all required fields.' }
            ])
            return
        }

        const currentUploadedFile = uploadedFile
        try {
            if (
                formFields.artifact_name === 'company-domain' &&
                formFields.diagram_type === 'db-footprint'
            ) {
                const req = {
                    car_id: '',
                    company_domain_id: String(formFields.company_domain_id),
                    company_domain_name: String(formFields.domain_nm),
                    env: 'prod,test,dev',
                    include_details_per_car_id: false
                }
                const result = await fetchDBFootprint(req)
                if (result.type === 'db-footprint') {
                    setDbFootprintData(result)
                    setErrors([])
                    setDiagramArtifact(extractedFileDefaultValue)
                } else if (result.type === 'error') {
                    setDbFootprintData(null)
                    setErrors(
                        result.errors || ['Please fill all required fields.']
                    )
                    setDiagramArtifact(extractedFileDefaultValue)
                }
            } else {
                setDbFootprintData(null)
                if (!currentUploadedFile) {
                    setDiagramArtifact(extractedFileDefaultValue)
                    setIsSubmitting(false)
                    setErrors([
                        {
                            error_description:
                                'Please fill all required fields.'
                        }
                    ])
                    return
                }

                const submitRequestSeq = ++usageMetricsRequestSeqRef.current
                setPreviousArtifactsData(null)
                void submitPreviousArtifacts({
                    ads_id: adsId,
                    artifact_name: formFields.artifact_name,
                    diagram_type: formFields.diagram_type,
                    diagram_level: formFields.diagram_level ?? '',
                    file_name: currentUploadedFile.name,
                    input_file: currentUploadedFile
                })
                    .then(response => {
                        setPreviousArtifactsData(
                            getDownloadablePreviousArtifactsList(response.data)
                        )
                    })
                    .catch(e => {
                        if (
                            submitRequestSeq !==
                            usageMetricsRequestSeqRef.current
                        ) {
                            return
                        }
                        const errorWithStatus = e as { status?: number }
                        if (
                            errorWithStatus.status === 400 ||
                            errorWithStatus.status === 404
                        ) {
                            console.error('Usage metrics requires file retry')
                        }
                        console.error('Usage metrics submit error:', e)
                    })

                const result: DiagramApiResult = await submitDiagramFormData({
                    artifact_name: formFields.artifact_name,
                    diagram_level: formFields.diagram_level ?? '',
                    diagram_type: formFields.diagram_type,
                    file: currentUploadedFile,
                    subdomains: subdomains,
                    ads_id: adsId
                })
                if (result.type === 'image') {
                    setDiagramArtifact(result)
                    setErrors([])
                } else if (result.type === 'error') {
                    setErrors(
                        result.errors || ['Please fill all required fields.']
                    )
                    setDiagramArtifact(extractedFileDefaultValue)
                }
            }
            setShowNotification(true)
            setIsSubmitting(false)
        } catch {
            setDiagramArtifact(extractedFileDefaultValue)
            setErrors([{ error_description: 'Unexpected error occurred.' }])
            setIsSubmitting(false)
        }
    }

    const filteredDomains =
        domains?.domains?.map(({ domain_nm, company_domain_id }) => ({
            domain_nm,
            company_domain_id
        })) || []
    const domainOptions: DomainOption[] = filteredDomains.map(item => ({
        value: item.company_domain_id,
        label: item.domain_nm,
        domain_nm: item.domain_nm,
        company_domain_id: item.company_domain_id
    }))
    domainOptions.sort((a, b) =>
        a.label.localeCompare(b.label, undefined, {
            sensitivity: 'base',
            numeric: true
        })
    )

    const handleDomainSelect = (selectedOption: DomainOption | null) => {
        setFormFields(prev => ({
            ...prev,
            domain_nm: selectedOption?.domain_nm || '',
            company_domain_id: selectedOption?.company_domain_id || ''
        }))
    }

    useEffect(() => {
        if (!showAdditionalSubdomains) {
            setFormFields(f => ({ ...f, subdomain: '' }))
            setSubdomains([])
        }
    }, [showAdditionalSubdomains])

    useEffect(() => {
        const artifactName = formFields?.artifact_name
        const diagramLevel = formFields?.diagram_level
        const diagramType = formFields?.diagram_type

        // Invalidate any in-flight request and hide the button until fresh data arrives.
        const initialRequestSeq = ++usageMetricsRequestSeqRef.current
        setPreviousArtifactsData(null)

        if (!artifactName || !diagramLevel || !diagramType || !adsId) {
            return
        }

        const usageMetricsPayload = {
            ads_id: adsId,
            artifact_name: artifactName,
            diagram_type: diagramType,
            diagram_level: diagramLevel
        }

        submitPreviousArtifacts(usageMetricsPayload)
            .then(response => {
                if (initialRequestSeq !== usageMetricsRequestSeqRef.current) {
                    return
                }
                setPreviousArtifactsData(
                    getDownloadablePreviousArtifactsList(response.data)
                )
            })
            .catch(e => {
                if (initialRequestSeq !== usageMetricsRequestSeqRef.current) {
                    return
                }
                setPreviousArtifactsData(null)
                const errorWithStatus = e as { status?: number }
                if (
                    errorWithStatus.status === 400 ||
                    errorWithStatus.status === 404
                ) {
                    console.error(
                        'Usage metrics initial call failed with 400/404'
                    )
                }
                console.error('Usage metrics error:', e)
            })
    }, [
        formFields?.artifact_name,
        formFields?.diagram_level,
        formFields?.diagram_type,
        adsId,
        submitPreviousArtifacts
    ])

    const handleOpenPrevArtifactsModal = () => {
        setOpenPrevArtifactsModal(true)
    }

    return (
        <>
            {/* Header Section */}
            <Flex
                className={styles.artifactsHeader}
                alignItems='center'
                justifyContent='space-between'
            >
                <div className={styles.edaLogoWrapper}>
                    <div className={styles.edaLogo}>
                        <EdaaatIcon width='75' height='75' />
                    </div>
                    <span className={styles.divider}>|</span>
                    <span className={styles.titleText}>
                        Enterprise Data Architecture Artifact Automation Tool
                    </span>
                </div>
                <Box pt='20px'>
                    <div className={styles.headerActions}>
                        {formFields?.diagram_type &&
                            formFields?.diagram_type !== 'db-footprint' &&
                            (() => {
                                const templateUrl = handleBaseTemplate()
                                return (
                                    <>
                                        <NoPrefetchLink
                                            href={templateUrl}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            title='Download base template'
                                            className={styles.faqLink}
                                            aria-label='Download base template'
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                textDecoration: 'none',
                                                pointerEvents: 'auto',
                                                opacity: 1
                                            }}
                                        >
                                            <IconDownload className='iconDownload' />
                                            <span
                                                style={{
                                                    marginLeft: '4px'
                                                }}
                                            >
                                                Template
                                            </span>
                                        </NoPrefetchLink>
                                        <span className={styles.divider}>
                                            |
                                        </span>
                                    </>
                                )
                            })()}
                        <NoPrefetchLink
                            href={EDAAAT_FAQ_URL}
                            target='_blank'
                            rel='noopener noreferrer'
                            title='FAQs'
                            className={styles.faqLink}
                            aria-label='Open FAQ in new tab'
                        >
                            FAQs
                        </NoPrefetchLink>
                    </div>
                </Box>
            </Flex>
            {/* Selection Tab */}
            <HStack gap={4} paddingX='2rem' paddingY='2rem'>
                <Box>
                    <div className={styles.formFields}>
                        <div className={styles.fields}>
                            <div className={styles.tooltipContent}>
                                <label>Generate Artifact For</label>
                                <Tooltip
                                    content='Choose the Initiative type for which
                                    the artifact has to be generated:
                                    company domain, subdomain or
                                    specific initiative (ETP/ECMI).'
                                    positioning={{ placement: 'top' }}
                                >
                                    <Box>
                                        <IconInfo
                                            title='More info'
                                            titleId='unique-icon-id-for-title-more-info'
                                        />
                                    </Box>
                                </Tooltip>
                            </div>
                            <Select
                                instanceId='artifact-name-select'
                                inputId='artifact-name-select-input'
                                options={ARTIFACT_OPTIONS || []}
                                className={styles.inputArtifactFields}
                                name='artifact_name'
                                onChange={handleChange}
                                classNames={{
                                    menu: () => styles.selectDropdownMenu
                                }}
                            />
                        </div>
                        <div className={styles.fields}>
                            <div className={styles.tooltipContent}>
                                <label>Artifact Type</label>
                                <Tooltip
                                    content='Choose the artifact type: Data Flow
                                    Diagram (DFD) or Conceptual Data
                                    Model (CDM).'
                                    positioning={{ placement: 'top' }}
                                >
                                    <Box>
                                        <IconInfo
                                            title='More info'
                                            titleId='unique-icon-id-for-title-more-info'
                                        />
                                    </Box>
                                </Tooltip>
                            </div>
                            <Select
                                instanceId='diagram-type-select'
                                inputId='diagram-type-select-input'
                                value={
                                    formFields?.artifact_name === 'etp-ecmi'
                                        ? DIAGRAM_OPTIONS?.filter(
                                              item =>
                                                  item?.value ===
                                                  'data-flow-diagram'
                                          )?.[0] || ''
                                        : diagramOptions?.filter(
                                              item =>
                                                  item?.value ===
                                                  formFields?.diagram_type
                                          )?.[0] || ''
                                }
                                options={
                                    formFields?.artifact_name ===
                                    'company-domain'
                                        ? DIAGRAM_OPTIONS
                                        : DIAGRAM_OPTIONS?.filter(
                                              item =>
                                                  item?.value !== 'db-footprint'
                                          )
                                }
                                className={styles.inputArtifactFields}
                                name='diagram_type'
                                onChange={handleChange}
                                isDisabled={
                                    !formFields?.artifact_name ||
                                    formFields?.artifact_name === 'etp-ecmi'
                                }
                                classNames={{
                                    menu: () => styles.selectDropdownMenu
                                }}
                            />
                        </div>
                        {formFields?.diagram_type === 'db-footprint' ? (
                            <div className={styles.fields}>
                                <div className={styles.tooltipContent}>
                                    <label>Company Domains</label>
                                </div>
                                <Select
                                    instanceId='company-domains-select'
                                    inputId='company-domains-select-input'
                                    value={
                                        domainOptions?.filter(
                                            item =>
                                                item?.value ===
                                                formFields?.company_domain_id
                                        )?.[0] || ''
                                    }
                                    options={domainOptions}
                                    className={styles.inputArtifactFields}
                                    name='company_domains'
                                    onChange={option =>
                                        handleDomainSelect(
                                            option as DomainOption | null
                                        )
                                    }
                                    classNames={{
                                        menu: () => styles.selectDropdownMenu
                                    }}
                                />
                            </div>
                        ) : (
                            <div className={styles.fields}>
                                <div className={styles.tooltipContent}>
                                    <label>Diagram Level</label>
                                    <Tooltip
                                        content='Select Level 0, 1 and 2 for DFD,
                                    Level 1 and 2 for CDM.'
                                        positioning={{ placement: 'top' }}
                                    >
                                        <Box>
                                            <IconInfo
                                                title='More info'
                                                titleId='unique-icon-id-for-title-more-info'
                                            />
                                        </Box>
                                    </Tooltip>
                                </div>
                                <Select
                                    instanceId='diagram-level-select'
                                    inputId='diagram-level-select-input'
                                    value={
                                        formFields?.artifact_name === 'etp-ecmi'
                                            ? {
                                                  label: 'Level 0',
                                                  value: 'level-0'
                                              }
                                            : formFields?.artifact_name ===
                                                    'company-subdomain' &&
                                                formFields?.diagram_type !==
                                                    undefined
                                              ? {
                                                    label: 'Level 2',
                                                    value: 'level-2'
                                                }
                                              : formFields?.artifact_name ===
                                                      'company-domain' &&
                                                  formFields?.diagram_type ===
                                                      'conceptual-model'
                                                ? {
                                                      label: 'Level 1',
                                                      value: 'level-1'
                                                  }
                                                : COMPANY_DOMAIN_DATA_FLOW_LEVELS?.filter(
                                                      item =>
                                                          item?.value ===
                                                          formFields?.diagram_level
                                                  )?.[0] || ''
                                    }
                                    options={COMPANY_DOMAIN_DATA_FLOW_LEVELS}
                                    className={styles.inputArtifactFields}
                                    name='diagram_level'
                                    onChange={handleChange}
                                    isDisabled={
                                        !(
                                            formFields?.artifact_name ===
                                                'company-domain' &&
                                            formFields?.diagram_type ===
                                                'data-flow-diagram'
                                        )
                                    }
                                    classNames={{
                                        menu: () => styles.selectDropdownMenu
                                    }}
                                />
                            </div>
                        )}
                        {formFields?.diagram_type !== 'db-footprint' && (
                            <div className={styles.uploadedFile}>
                                <Button
                                    variant='outline'
                                    colorPalette='blue'
                                    bg='white'
                                    onClick={handleUploadClick}
                                >
                                    <IconUpload className='iconUpload' />
                                    Upload Filled Template
                                </Button>
                                <input
                                    type='file'
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <p>{selectedFileName}</p>
                            </div>
                        )}
                        <div className={styles.generateArtifact}>
                            <Button
                                variant='solid'
                                colorPalette='blue'
                                onClick={handleSubmit}
                            >
                                Generate Artifact
                            </Button>
                            {hasPreviousArtifactsData && (
                                <Button
                                    variant='outline'
                                    colorPalette='blue'
                                    bg='white'
                                    onClick={handleOpenPrevArtifactsModal}
                                >
                                    View Previously Used Templates
                                </Button>
                            )}
                        </div>
                        {showAdditionalSubdomains && (
                            <>
                                <div className={styles.fullRowBreak} />
                                <div className={styles.InputFields}>
                                    <label>Additional Subdomains</label>
                                    <div className={styles.subDomainText}>
                                        Add comma separated subdomains
                                    </div>
                                    <Input
                                        title='Additional Subdomains'
                                        type='text'
                                        name='subdomain'
                                        className={styles.subdomainInput}
                                        value={formFields?.subdomain}
                                        onChange={event =>
                                            handleInputChange(
                                                event.target.name,
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={handleSubdomainInputKeyDown}
                                        onPaste={handleSubdomainInputPaste}
                                    />
                                    <div className={styles.chipsContainer}>
                                        {subdomains.map(chip => (
                                            <Tag.Root
                                                key={chip}
                                                className={styles.subDomainTags}
                                            >
                                                <Tag.Label>{chip}</Tag.Label>
                                                <Tag.EndElement>
                                                    <Tag.CloseTrigger
                                                        onClick={() => {
                                                            handleRemoveSubdomain(
                                                                chip
                                                            )
                                                        }}
                                                    />
                                                </Tag.EndElement>
                                            </Tag.Root>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Box>
            </HStack>
            <Box
                className={styles.previewContainer}
                backgroundColor={{
                    _dark: '#1c1c1c'
                }}
            >
                {formFields?.diagram_type === 'db-footprint' &&
                dbFootprintData ? (
                    <DBFootprintTable data={dbFootprintData} />
                ) : (
                    <DiagramPreview
                        diagramArtifact={diagramArtifact}
                        isLoading={isSubmitting}
                        errors={errors}
                        showNotification={showNotification}
                        setShowNotification={setShowNotification}
                    />
                )}
            </Box>
            {openPrevArtifactsModal && (
                <PreviousArtifactsModal
                    isOpen={openPrevArtifactsModal}
                    data={previousArtifactsData}
                    companyDomainNames={domainOptions.map(item => item.label)}
                    onClose={() => {
                        setOpenPrevArtifactsModal(false)
                    }}
                />
            )}
        </>
    )
}
