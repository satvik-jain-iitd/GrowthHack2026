/* istanbul ignore file */
import { TypeaheadField } from '@/app/onboarding-form/components'
import { GraphAPIUser } from '@/app/onboarding-form/types'
import {
    fetchEaLeadsWithEmails,
    fetchEmployeesByEmail
} from '@/app/onboarding-form/utils'
import { useDomainContext, useUserContext } from '@/context'
import { Box, Button, Field, Grid, GridItem, Text } from '@chakra-ui/react'
import Select, { MultiValue } from 'react-select'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Playbook } from '@/types/Playbook'
import { PTBInitiative } from '../types/PTBInitiative'
import { buildNameByEmail, toOwnerPersona } from '../utils/ownerPersona'
import { User } from '@/app/layout/AuthBlueSso'
import SelectRadioGroup from './SelectRadioGroup'
import { Markets } from '@/app/company-domains/types'
import MarketsSelect from './MarketsSelect'
import { countryOptions } from '@/app/company-domains/constants'
import { InitiativeMM } from '@/app/shared/types/metamodel'
import {
    useUpdateMetamodelInitiative,
    useMetamodelAdrOptions,
    useMetamodelBvbOptions,
    useMetamodelInitiativeOptions,
    useTechStackOptions,
    useMetamodelFoundationalTechnologyOptions,
    useMetamodelTechnicalCapabilityOptions,
    UpdateMetamodelInitiativeBody,
    OwnerPersona
} from '@/app/shared/hooks'
import { CapabilityDrilldownSelect } from '@/app/shared/components'

interface Option {
    label: string
    value: string
}

interface InitiativeEditFormType {
    unitCIO: string[]
    market: MultiValue<Markets>
    adr: Option[]
    bvbAdr: Option[]
    principalArchitect: string[]
    eaArchitect: string[]
    additionalDelegate: string[]
}

/** Apptio-sourced values are displayed but cannot be edited here. */
function ReadOnlyField({
    label,
    value
}: {
    label: string
    value?: string | string[] | null
}) {
    const display = Array.isArray(value) ? value.join(', ') : value
    return (
        <GridItem>
            <Field.Root>
                <Field.Label>
                    <Text textStyle='sm' fontWeight='bold'>
                        {label}
                    </Text>
                </Field.Label>
                <Text textStyle='sm'>{display || '-'}</Text>
            </Field.Root>
        </GridItem>
    )
}

function InitiativeEditForm({
    initiativeData,
    metamodelEntity,
    setIsEdit,
    refetch
}: {
    playbook?: Playbook
    initiativeData?: PTBInitiative
    metamodelEntity?: InitiativeMM | null
    setIsEdit: (edit: boolean) => void
    refetch: () => void
}) {
    const [adrSelection, setAdrSelection] = useState<{
        core: { label: string; value: string }[]
        nonCore: { label: string; value: string }[]
        selected: null | { label: string; value: string }
        type: null | string
    }>({
        core:
            initiativeData?.adrCore?.map(core => {
                return { label: core.name, value: core.id }
            }) || [],
        nonCore:
            initiativeData?.adrNonCore?.map(nonCore => {
                return { label: nonCore.name, value: nonCore.id }
            }) || [],
        selected: null,
        type: null
    })

    const [bvbAdrSelection, setBvbAdrSelection] = useState<{
        core: { label: string; value: string }[]
        nonCore: { label: string; value: string }[]
        selected: null | { label: string; value: string }
        type: null | string
    }>({
        core:
            initiativeData?.bvbCore?.map(core => {
                return { label: core.name, value: core.id }
            }) || [],
        nonCore:
            initiativeData?.bvbNonCore?.map(nonCore => {
                return { label: nonCore.name, value: nonCore.id }
            }) || [],
        selected: null,
        type: null
    })

    const [linkedInitiativeSelection, setLinkedInitiativeSelection] = useState<{
        core: { label: string; value: string }[]
        nonCore: { label: string; value: string }[]
        selected: null | { label: string; value: string }
        type: null | string
    }>({
        core:
            metamodelEntity?.linkedInitiatives
                ?.filter(ref => ref.isCore)
                .map(ref => ({
                    label: ref.initiativeName || ref.initiativeId,
                    value: ref.initiativeId
                })) || [],
        nonCore:
            metamodelEntity?.linkedInitiatives
                ?.filter(ref => !ref.isCore)
                .map(ref => ({
                    label: ref.initiativeName || ref.initiativeId,
                    value: ref.initiativeId
                })) || [],
        selected: null,
        type: null
    })

    const [selectedCompanyDomains, setSelectedCompanyDomains] = useState<
        MultiValue<{ label: string; value: string }>
    >(
        initiativeData?.companyDomains?.map(d => ({
            label: d.domain_nm,
            value: d.company_domain_id
        })) || []
    )

    const [businessCapabilities, setBusinessCapabilities] = useState<string[]>(
        metamodelEntity?.businessCapabilities ?? []
    )

    const [techStacksSelection, setTechStacksSelection] = useState<
        MultiValue<Option>
    >(
        (metamodelEntity?.technologyStacks || []).map(id => ({
            label: id,
            value: id
        }))
    )

    const [foundationalTechSelection, setFoundationalTechSelection] = useState<
        MultiValue<Option>
    >(
        (metamodelEntity?.foundationalTechnologies || []).map(id => ({
            label: id,
            value: id
        }))
    )

    const [techCapabilitySelection, setTechCapabilitySelection] = useState<
        MultiValue<Option>
    >(
        (metamodelEntity?.techCapabilities || []).map(id => ({
            label: id,
            value: id
        }))
    )

    const { control, watch, reset, setValue, getValues } =
        useForm<InitiativeEditFormType>({
            mode: 'onBlur',
            defaultValues: {
                unitCIO: initiativeData?.unitCIO
                    ? [initiativeData?.unitCIO]
                    : [],
                eaArchitect: initiativeData?.enterpriseArchitects
                    ? initiativeData?.enterpriseArchitects
                    : [],
                principalArchitect: initiativeData?.principalArchitects
                    ? initiativeData?.principalArchitects
                    : [],
                additionalDelegate: initiativeData?.additionalArchitects || [],
                market:
                    countryOptions.filter(option =>
                        initiativeData?.markets?.includes(option.code)
                    ) || []
            }
        })

    const [loading, setLoading] = useState(false)

    const user: User | undefined = useUserContext()
    const { email } = user?.attributes || {}

    const mutation = useUpdateMetamodelInitiative(
        metamodelEntity?.initiativeId || initiativeData?.initiativeId || ''
    )

    const { adrOptions } = useMetamodelAdrOptions()

    const { bvbOptions } = useMetamodelBvbOptions()

    const { data: initiativeOptionsList } = useMetamodelInitiativeOptions()

    const { data: techStackOptions } = useTechStackOptions()

    const { foundationalTechnologyOptions } =
        useMetamodelFoundationalTechnologyOptions()
    const { technicalCapabilityOptions } =
        useMetamodelTechnicalCapabilityOptions()

    const foundationalTechOptionsList = useMemo(
        () =>
            (foundationalTechnologyOptions || []).map(ft => ({
                label: ft.name,
                value: ft.foundationalTechnologyId
            })),
        [foundationalTechnologyOptions]
    )
    const techCapabilityOptionsList = useMemo(
        () =>
            (technicalCapabilityOptions || []).map(tc => ({
                label: tc.name,
                value: tc.technicalCapabilityId
            })),
        [technicalCapabilityOptions]
    )

    useEffect(() => {
        if (techStackOptions) {
            setTechStacksSelection(
                (metamodelEntity?.technologyStacks || []).map(id => ({
                    label: techStackOptions.byId[id] ?? id,
                    value: id
                }))
            )
        }
    }, [techStackOptions, metamodelEntity])

    useEffect(() => {
        if (foundationalTechnologyOptions) {
            const byId = new Map(
                foundationalTechnologyOptions.map(ft => [
                    ft.foundationalTechnologyId,
                    ft.name
                ])
            )
            setFoundationalTechSelection(
                (metamodelEntity?.foundationalTechnologies || []).map(id => ({
                    label: byId.get(id) ?? id,
                    value: id
                }))
            )
        }
    }, [foundationalTechnologyOptions, metamodelEntity])

    useEffect(() => {
        if (technicalCapabilityOptions) {
            const byId = new Map(
                technicalCapabilityOptions.map(tc => [
                    tc.technicalCapabilityId,
                    tc.name
                ])
            )
            setTechCapabilitySelection(
                (metamodelEntity?.techCapabilities || []).map(id => ({
                    label: byId.get(id) ?? id,
                    value: id
                }))
            )
        }
    }, [technicalCapabilityOptions, metamodelEntity])

    const { domains } = useDomainContext() || {}
    const domainOptions = (domains || []).map(d => ({
        label: d.domain_nm,
        value: d.company_domain_id
    }))

    const selectedNamesRef = useRef(new Map<string, string>())

    const rememberName = (email?: string | null, name?: string | null) => {
        if (email && name) {
            selectedNamesRef.current.set(email.toLowerCase(), name)
        }
    }

    const onGraphUserSelect = (item: GraphAPIUser) =>
        rememberName(item?.userPrincipalName, item?.displayName)

    const onEaLeadSelect = (item: { name: string; email: string }) =>
        rememberName(item?.email, item?.name)

    const handleSave = () => {
        const formData = getValues()

        const nameByEmail = buildNameByEmail(metamodelEntity?.initiativeOwners)
        selectedNamesRef.current.forEach((name, email) => {
            nameByEmail.set(email, name)
        })
        const toPersona = (email?: string | null): OwnerPersona | null =>
            toOwnerPersona(email, nameByEmail)

        const body: UpdateMetamodelInitiativeBody = {
            supportedMarkets:
                formData?.market?.map(market => market.code) || [],
            owners: {
                unitcio: toPersona(formData?.unitCIO?.[0]),
                principal_architect: toPersona(
                    formData?.principalArchitect?.[0]
                ),
                enterprise_architect: toPersona(formData?.eaArchitect?.[0]),
                additional_architects: (formData?.additionalDelegate || [])
                    .map(email => toPersona(email))
                    .filter((p): p is OwnerPersona => p !== null)
            },
            adrCore: adrSelection.core?.map(adr => adr.value) || [],
            adrNonCore: adrSelection.nonCore?.map(adr => adr.value) || [],
            bvbCore: bvbAdrSelection.core?.map(bvb => bvb.value) || [],
            bvbNonCore: bvbAdrSelection.nonCore?.map(bvb => bvb.value) || [],
            linkedInitiativesCore:
                linkedInitiativeSelection.core?.map(i => i.value) || [],
            linkedInitiativesNonCore:
                linkedInitiativeSelection.nonCore?.map(i => i.value) || [],
            impactedCompanyDomainIds:
                selectedCompanyDomains?.map(d => d.value) || [],
            technologyStacks: techStacksSelection?.map(t => t.value) || [],
            foundationalTechnologies:
                foundationalTechSelection?.map(t => t.value) || [],
            techCapabilities: techCapabilitySelection?.map(t => t.value) || [],
            businessCapabilities,
            userEmail: email || ''
        }

        setLoading(true)
        mutation.mutate(body, {
            onSuccess: () => {
                refetch()
                setIsEdit(false)
                setLoading(false)
            },
            onError: () => {
                setLoading(false)
            }
        })
    }

    const handleCancel = () => {
        reset()
        setIsEdit(false)
    }

    return (
        <>
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={6}
                mt={8}
                width={'80%'}
            >
                <ReadOnlyField
                    label={'Select ETP'}
                    value={initiativeData?.clarityId}
                />
                <ReadOnlyField label={'Years'} value={initiativeData?.years} />
                <ReadOnlyField
                    label={'Start Date'}
                    value={initiativeData?.startDate}
                />
                <ReadOnlyField
                    label={'Tentative End Date'}
                    value={initiativeData?.tentativeEndDate}
                />
                <ReadOnlyField
                    label={'Tech Owner'}
                    value={initiativeData?.techOwners}
                />
                <ReadOnlyField
                    label={'Head Engineer'}
                    value={initiativeData?.headEngineers}
                />
                <TypeaheadField
                    key={'principalArchitect'}
                    name={'principalArchitect'}
                    onItemSelect={onEaLeadSelect}
                    required={false}
                    label={'Principal Architect'}
                    placeholder={'eg: test@aexp.com'}
                    tooltip={'Principal Architect(s) for the initiative .'}
                    control={control}
                    fetcher={fetchEaLeadsWithEmails}
                    mapResponseToItems={(
                        response: { name: string; email: string }[] | undefined
                    ) => {
                        return response ?? []
                    }}
                    itemToString={(item: { name: string; email: string }) =>
                        (item?.name as string) ?? ''
                    }
                    itemToValue={(item: { name: string; email: string }) =>
                        (item?.email as string) ?? ''
                    }
                    colSpan={{ base: 2, md: 1 }}
                    autoFetch={true}
                    width={500}
                    border={'1px solid #8C8C8C'}
                    borderRadius={'5px'}
                />
                <TypeaheadField
                    key={'eaArchitect'}
                    name={'eaArchitect'}
                    onItemSelect={onEaLeadSelect}
                    required={false}
                    label={'Enterprise Architect'}
                    placeholder={'eg: test@aexp.com'}
                    tooltip={'EA Architect(s) for the initiative.'}
                    control={control}
                    fetcher={fetchEaLeadsWithEmails}
                    mapResponseToItems={(
                        response: { name: string; email: string }[] | undefined
                    ) => {
                        return response ?? []
                    }}
                    itemToString={(item: { name: string; email: string }) =>
                        (item?.name as string) ?? ''
                    }
                    itemToValue={(item: { name: string; email: string }) =>
                        (item?.email as string) ?? ''
                    }
                    colSpan={{ base: 2, md: 1 }}
                    autoFetch={true}
                    width={500}
                    border={'1px solid #8C8C8C'}
                    borderRadius={'5px'}
                />
                <TypeaheadField
                    key={'additionalDelegate'}
                    name={'additionalDelegate'}
                    onItemSelect={onGraphUserSelect}
                    required={false}
                    label={'Additional Delegates'}
                    placeholder={'eg: test@aexp.com'}
                    tooltip={'Additional Delegates for the initiative.'}
                    control={control}
                    fetcher={fetchEmployeesByEmail}
                    mapResponseToItems={response => {
                        return response ? response : []
                    }}
                    itemToString={item =>
                        (
                            item as GraphAPIUser
                        )?.userPrincipalName?.toLocaleLowerCase() ?? ''
                    }
                    colSpan={{ base: 2, md: 1 }}
                    width={500}
                    border={'1px solid #8C8C8C'}
                    borderRadius={'5px'}
                />

                <SelectRadioGroup
                    options={
                        adrOptions
                            ?.map((o: { id: string; name: string }) => {
                                return {
                                    label: o?.name,
                                    value: o?.id
                                }
                            })
                            ?.filter(
                                (
                                    option: Option,
                                    index: number,
                                    self: Option[]
                                ) =>
                                    index ===
                                    self.findIndex(
                                        (o: Option) => o.value === option.value
                                    )
                            ) || []
                    }
                    name={'ADR'}
                    selection={adrSelection}
                    setSelection={setAdrSelection}
                    width={'500px'}
                />
                <SelectRadioGroup
                    options={
                        bvbOptions
                            ?.map((o: { id: string; title: string }) => {
                                return {
                                    label: o?.title,
                                    value: o?.id
                                }
                            })
                            ?.filter(
                                (
                                    option: Option,
                                    index: number,
                                    self: Option[]
                                ) =>
                                    index ===
                                    self.findIndex(
                                        (o: Option) => o.value === option.value
                                    )
                            ) || []
                    }
                    name={'BVB'}
                    selection={bvbAdrSelection}
                    setSelection={setBvbAdrSelection}
                    width={'500px'}
                />

                <GridItem>
                    <Field.Root>
                        <Field.Label>
                            <Text textStyle='sm' fontWeight='bold'>
                                Impacted Company Domains
                            </Text>
                        </Field.Label>
                        <Box>
                            <Select
                                styles={{
                                    control: base => ({
                                        ...base,
                                        border: '1px solid #8C8C8C',
                                        borderRadius: '5px',
                                        minHeight: '40px',
                                        width: '500px'
                                    })
                                }}
                                isMulti
                                isClearable={false}
                                onChange={selectedOptions => {
                                    setSelectedCompanyDomains(selectedOptions)
                                }}
                                value={selectedCompanyDomains}
                                options={domainOptions}
                                placeholder='Select Company Domains'
                            />
                        </Box>
                    </Field.Root>
                </GridItem>
                <GridItem>
                    <Field.Root>
                        <Field.Label>
                            <Text textStyle='sm' fontWeight='bold'>
                                Foundational Technologies
                            </Text>
                        </Field.Label>
                        <Box>
                            <Select
                                styles={{
                                    control: base => ({
                                        ...base,
                                        border: '1px solid #8C8C8C',
                                        borderRadius: '5px',
                                        minHeight: '40px',
                                        width: '500px'
                                    })
                                }}
                                isMulti
                                onChange={selectedOptions => {
                                    setFoundationalTechSelection(
                                        selectedOptions
                                    )
                                }}
                                value={foundationalTechSelection}
                                options={foundationalTechOptionsList}
                                placeholder='Select Foundational Technologies'
                            />
                        </Box>
                    </Field.Root>
                </GridItem>
                <GridItem>
                    <Field.Root>
                        <Field.Label>
                            <Text textStyle='sm' fontWeight='bold'>
                                Technical Capabilities
                            </Text>
                        </Field.Label>
                        <Box>
                            <Select
                                styles={{
                                    control: base => ({
                                        ...base,
                                        border: '1px solid #8C8C8C',
                                        borderRadius: '5px',
                                        minHeight: '40px',
                                        width: '500px'
                                    })
                                }}
                                isMulti
                                onChange={selectedOptions => {
                                    setTechCapabilitySelection(selectedOptions)
                                }}
                                value={techCapabilitySelection}
                                options={techCapabilityOptionsList}
                                placeholder='Select Technical Capabilities'
                            />
                        </Box>
                    </Field.Root>
                </GridItem>
                <SelectRadioGroup
                    options={initiativeOptionsList || []}
                    name={'Linked Initiative'}
                    selection={linkedInitiativeSelection}
                    setSelection={setLinkedInitiativeSelection}
                    width={'500px'}
                />
                <GridItem>
                    <CapabilityDrilldownSelect
                        value={businessCapabilities}
                        onChange={setBusinessCapabilities}
                    />
                </GridItem>

                <GridItem>
                    <Field.Root>
                        <Field.Label>
                            <Text textStyle='sm' fontWeight='bold'>
                                Tech Stacks
                            </Text>
                        </Field.Label>
                        <Box>
                            <Select
                                styles={{
                                    control: base => ({
                                        ...base,
                                        border: '1px solid #8C8C8C',
                                        borderRadius: '5px',
                                        minHeight: '40px',
                                        width: '500px'
                                    })
                                }}
                                isMulti
                                isClearable={false}
                                onChange={selectedOptions => {
                                    setTechStacksSelection(selectedOptions)
                                }}
                                value={techStacksSelection}
                                options={techStackOptions?.options || []}
                                placeholder='Select Tech Stacks'
                            />
                        </Box>
                    </Field.Root>
                </GridItem>

                <GridItem>
                    <Field.Root>
                        <Field.Label>
                            <Text textStyle='sm' fontWeight='bold'>
                                Markets
                            </Text>
                        </Field.Label>

                        <MarketsSelect
                            marketFormValue={
                                watch('market') || ([] as Markets[])
                            }
                            setMarketFormValue={values =>
                                setValue('market', values)
                            }
                        />
                    </Field.Root>
                </GridItem>
            </Grid>
            <Button
                mt={4}
                loading={loading}
                mb={4}
                colorPalette={'blue'}
                onClick={() => {
                    handleSave()
                }}
            >
                Save
            </Button>
            <Button
                mt={4}
                ml={4}
                mb={4}
                variant={'outline'}
                onClick={() => {
                    handleCancel()
                }}
            >
                Cancel
            </Button>
        </>
    )
}

export default InitiativeEditForm
