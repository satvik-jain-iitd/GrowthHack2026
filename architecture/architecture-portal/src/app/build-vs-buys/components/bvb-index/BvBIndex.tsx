'use client'
import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import { IconEdit } from '@americanexpress/dls-icons'
import StatusBadge, { getStatusByTask } from '../StatusBadge'
import BvBIndexHeaderItem from '@/app/build-vs-buys/components/bvb-index/BvBIndexHeaderItem'
import BvBIndexBodyItem from '@/app/build-vs-buys/components/bvb-index/BvBIndexBodyItem'
import BvBIndexEditBodyItemActor from '@/app/build-vs-buys/components/bvb-index/BvBIndexEditBodyItemActor'
import { useEditBvB } from '@/app/build-vs-buys/hooks/useEditBvB'
import { usePlaybook, usePlaybookRoles } from '@/hooks'
import BvBIndexLoading from '@/app/build-vs-buys/components/bvb-index/BvBIndexLoading'
import {
    checkCanEdit,
    editableFieldKeys,
    fieldsConfig
} from '@/app/build-vs-buys/components/bvb-index/constants'
import {
    Flex,
    SimpleGrid,
    Text,
    Box,
    Button,
    Input,
    Alert,
    CloseButton,
    Textarea,
    Select,
    createListCollection
} from '@chakra-ui/react'
import AddAdrButton from '@/app/docs/components/AddAdrButton'
import { PLAYBOOK_TYPE_IDS } from '@/constants'

export type PlaybookEditableFields = {
    description: string | undefined
    owner: string[] | undefined
    requester: string[] | undefined
    reviewers: string[] | undefined
    stakeHolders: string[] | undefined
    deciders: string[] | undefined
    eaArchitect: string[] | undefined
    overallRisk: string | undefined
    estimatedCost: string | undefined
    etpImpacting: boolean | undefined
}

function getStatus(data: object) {
    const jsonContent = JSON.parse(JSON.stringify(data))
    if (jsonContent.workflowData && jsonContent.workflowData?.currentTask) {
        return getStatusByTask(
            jsonContent.workflowData?.currentTask?.step,
            jsonContent.workflowData
        )
    }
    return jsonContent.status
}

function capitalizeFirstLetter(str: string | undefined) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatEstimatedCost(estimatedCost: string | undefined): string {
    if (estimatedCost && isNaN(Number(estimatedCost))) {
        return estimatedCost
    } else {
        return estimatedCost ? formatCurrency(estimatedCost) : 'N/A'
    }
}

function formatCurrency(value: string) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(Number(value))
}

export function BvBIndex({
    playbookId,
    repo
}: {
    playbookId: string
    repo?: string
}) {
    const { data: playbook, isLoading, refetch } = usePlaybook(playbookId)
    const { canEdit } = usePlaybookRoles(playbook)
    const [editMode, setEditMode] = React.useState(false)
    const [editedFields, setEditedFields] = React.useState<
        Partial<PlaybookEditableFields>
    >({})
    const [alert, setAlert] = React.useState<{
        type: 'success' | 'error'
        open: boolean
    }>({ type: 'success', open: false })
    const mutation = useEditBvB(playbookId)
    const data: PlaybookEditableFields & {
        title?: string
        targetedEndDate?: string
        completedAt?: string
        createdAt?: string
        status?: string
        workflowData?: {
            currentTask?: {
                step: string
            }
            reviews?: string[]
            approvals?: string[]
        }
    } = useMemo(() => {
        if (!playbook) {
            return {} as PlaybookEditableFields
        }
        const da = playbook.add_da
        const jsonContent = JSON.parse(JSON.stringify(da))
        const workflow = jsonContent.workflowData || {}
        return {
            title: playbook.playbook_nm,
            requester: workflow.actors?.requester ?? jsonContent.requester,
            deciders: workflow.actors?.deciders ?? jsonContent.deciders,
            reviewers: workflow.actors?.reviewers ?? jsonContent.reviewers,
            targetedEndDate: jsonContent.targetedEndDate,
            completedAt: workflow.completedAt,
            createdAt: jsonContent.createdAt,
            owner: jsonContent.owner,
            stakeHolders: jsonContent.stakeHolders,
            eaArchitect: jsonContent.eaArchitect,
            status: workflow.status ?? jsonContent.status,
            etpImpacting: jsonContent.etpImpacting,
            overallRisk: jsonContent.overallRisk,
            estimatedCost: jsonContent.estimatedCost,
            description: jsonContent.description,
            workflowData: workflow
        }
    }, [playbook])

    const status: string = getStatus(data)
    console.log('status:', status)
    const stepIndex = checkCanEdit(status)

    React.useEffect(() => {
        if (editMode && playbook && data) {
            setEditedFields({
                description: data.description,
                owner: data.owner,
                requester: data.requester,
                reviewers: data.reviewers,
                stakeHolders: data.stakeHolders,
                deciders: data.deciders,
                eaArchitect: data.eaArchitect,
                overallRisk: data.overallRisk,
                estimatedCost: data.estimatedCost,
                etpImpacting: data.etpImpacting
            })
        }
    }, [editMode, playbook, data])

    const handleFieldChange = (
        field: string,
        value: string | string[] | boolean
    ) => {
        setEditedFields(prev => ({ ...prev, [field]: value }))
    }

    const handleCancel = () => {
        setEditMode(false)
        setEditedFields({})
    }

    const handleSubmit = async () => {
        if (!playbook || !data) return
        const changedFields: Partial<PlaybookEditableFields> = {}
        editableFieldKeys.forEach(key => {
            const original = data[key]
            const edited = editedFields[key]
            if (Array.isArray(original) || Array.isArray(edited)) {
                if (JSON.stringify(original) !== JSON.stringify(edited)) {
                    changedFields[key] = edited as never
                }
            } else if (original !== edited) {
                changedFields[key] = edited as never
            }
        })
        if (Object.keys(changedFields).length === 0) {
            setEditMode(false)
            return
        }
        mutation.mutate(changedFields, {
            onSuccess: () => {
                refetch()
                setEditMode(false)
                setAlert({ type: 'success', open: true })
            },
            onError: () => {
                setAlert({ type: 'error', open: true })
            }
        })
    }

    if (isLoading) {
        return <BvBIndexLoading />
    }

    return (
        <>
            {alert.open && (
                <Alert.Root
                    alignItems={'center'}
                    status={alert.type}
                    variant='subtle'
                >
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>
                            {alert.type === 'success'
                                ? 'Successfully updated!'
                                : 'Update failed. Please try again.'}
                        </Alert.Title>
                    </Alert.Content>
                    <CloseButton
                        size={'xs'}
                        onClick={() => setAlert({ ...alert, open: false })}
                    />
                </Alert.Root>
            )}
            <Flex align='center' justify='space-between' width='100%'>
                <Text fontSize={36} mb={2} color='fg'>
                    {data.title}
                </Text>
                {playbookId && repo && (
                    <AddAdrButton
                        playbookId={playbookId}
                        repo={repo}
                        playbookTypeId={PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                        text
                    />
                )}
            </Flex>

            <Flex
                align='center'
                mb={6}
                width='100%'
                borderBottom='1px solid #e0e0e0'
            >
                {data.createdAt && (
                    <BvBIndexHeaderItem label='Onboarded On'>
                        <Text fontWeight='bold' color='fg' whiteSpace='nowrap'>
                            {dayjs(data.createdAt).format('MM/DD/YYYY')}
                        </Text>
                    </BvBIndexHeaderItem>
                )}
                {data.completedAt ? (
                    <BvBIndexHeaderItem label='Approved On'>
                        <Text fontWeight='bold' color='fg' whiteSpace='nowrap'>
                            {dayjs(data.completedAt).format('MM/DD/YYYY')}
                        </Text>
                    </BvBIndexHeaderItem>
                ) : (
                    data.targetedEndDate && (
                        <BvBIndexHeaderItem label='Targeted End Date'>
                            <Text
                                fontWeight='bold'
                                color='fg'
                                whiteSpace='nowrap'
                            >
                                {dayjs(data.targetedEndDate).format(
                                    'MM/DD/YYYY'
                                )}
                            </Text>
                        </BvBIndexHeaderItem>
                    )
                )}
                <BvBIndexHeaderItem label='ETP Impacting'>
                    {editMode ? (
                        <Select.Root
                            color={'fg'}
                            collection={createListCollection({
                                items: [
                                    { label: 'Yes', value: 'Yes' },
                                    { label: 'No', value: 'No' }
                                ]
                            })}
                            value={[editedFields.etpImpacting ? 'Yes' : 'No']}
                            onValueChange={details =>
                                handleFieldChange(
                                    'etpImpacting',
                                    details.value[0] === 'Yes'
                                )
                            }
                            disabled={stepIndex > 1}
                            size='sm'
                            minW={100}
                        >
                            <Select.HiddenSelect name='etpImpacting' />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder='Select option' />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Select.Positioner>
                                <Select.Content>
                                    {[
                                        { label: 'Yes', value: 'Yes' },
                                        { label: 'No', value: 'No' }
                                    ].map(item => (
                                        <Select.Item
                                            item={item}
                                            key={item.value}
                                        >
                                            {item.label}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Select.Root>
                    ) : (
                        <Text fontWeight='bold' color='fg' whiteSpace='nowrap'>
                            {data.etpImpacting ? 'Yes' : 'No'}
                        </Text>
                    )}
                </BvBIndexHeaderItem>
                <BvBIndexHeaderItem label='Overall Risk'>
                    {editMode ? (
                        <Select.Root
                            color={'fg'}
                            collection={createListCollection({
                                items: [
                                    { label: 'Critical', value: 'critical' },
                                    { label: 'High', value: 'high' },
                                    { label: 'Medium', value: 'medium' },
                                    { label: 'Low', value: 'low' }
                                ]
                            })}
                            value={[
                                editedFields.overallRisk ||
                                    data.overallRisk ||
                                    ''
                            ]}
                            onValueChange={details =>
                                handleFieldChange(
                                    'overallRisk',
                                    details.value[0]
                                )
                            }
                            disabled={stepIndex > 2}
                            size='sm'
                            minW={120}
                        >
                            <Select.HiddenSelect name='overallRisk' />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder='Select risk' />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Select.Positioner>
                                <Select.Content>
                                    {[
                                        {
                                            label: 'Critical',
                                            value: 'critical'
                                        },
                                        { label: 'High', value: 'high' },
                                        { label: 'Medium', value: 'medium' },
                                        { label: 'Low', value: 'low' }
                                    ].map(item => (
                                        <Select.Item
                                            item={item}
                                            key={item.value}
                                        >
                                            {item.label}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Select.Root>
                    ) : (
                        <Text fontWeight='bold' color='fg' whiteSpace='nowrap'>
                            {capitalizeFirstLetter(data.overallRisk)}
                        </Text>
                    )}
                </BvBIndexHeaderItem>
                <BvBIndexHeaderItem label='Estimated Cost'>
                    {editMode ? (
                        <Input
                            color={'fg'}
                            value={editedFields.estimatedCost ?? ''}
                            size='sm'
                            onChange={e =>
                                handleFieldChange(
                                    'estimatedCost',
                                    e.target.value
                                )
                            }
                            disabled={stepIndex > 1}
                            minWidth={100}
                        />
                    ) : (
                        <Text fontWeight='bold' color='fg' whiteSpace='nowrap'>
                            {formatEstimatedCost(data.estimatedCost)}
                        </Text>
                    )}
                </BvBIndexHeaderItem>
                {(data.workflowData || data.status) && (
                    <BvBIndexHeaderItem label='Status'>
                        <span>
                            <StatusBadge status={status} />
                        </span>
                    </BvBIndexHeaderItem>
                )}
                {canEdit && (
                    <BvBIndexHeaderItem>
                        <Flex
                            align='center'
                            cursor='pointer'
                            position='relative'
                            onClick={() => setEditMode(true)}
                        >
                            <IconEdit
                                color='neutral'
                                style={{
                                    opacity: 1,
                                    transition: 'opacity 0.2s'
                                }}
                            />
                        </Flex>
                    </BvBIndexHeaderItem>
                )}
            </Flex>
            <Box width='100%' mb={8}>
                {editMode ? (
                    <Textarea
                        color={'fg'}
                        value={editedFields.description ?? ''}
                        size={'xl'}
                        onChange={e =>
                            handleFieldChange('description', e.target.value)
                        }
                    />
                ) : (
                    <React.Fragment>
                        <Text fontWeight='bold' color='fg.muted'>
                            Description:
                        </Text>
                        <Text color='fg'>{data.description}</Text>
                    </React.Fragment>
                )}
            </Box>
            <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3 }}
                gap={{ base: 4, sm: 8, md: 12 }}
            >
                {fieldsConfig.map(({ key, label, icon }) => {
                    const value = editMode ? editedFields[key] : data[key]
                    if (!editMode && (!value || value.length === 0)) return null
                    return (
                        <Box key={key}>
                            {editMode ? (
                                <BvBIndexEditBodyItemActor
                                    label={label}
                                    keyName={key}
                                    icon={icon}
                                    value={editedFields[key] as string[]}
                                    onChange={vals =>
                                        handleFieldChange(key, vals)
                                    }
                                    stepIndex={stepIndex}
                                />
                            ) : (
                                <BvBIndexBodyItem
                                    label={label}
                                    value={data[key] as string[]}
                                    icon={icon}
                                />
                            )}
                        </Box>
                    )
                })}
            </SimpleGrid>
            {editMode && (
                <Flex justify='flex-end' mt={4} gap={2}>
                    <Button
                        size='lg'
                        variant='outline'
                        colorPalette='blue'
                        onClick={handleCancel}
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        size={'lg'}
                        variant='solid'
                        colorPalette='blue'
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Saving...' : 'Submit'}
                    </Button>
                </Flex>
            )}
        </>
    )
}
