/* istanbul ignore file */
'use client'
import { useUserContext } from '@/context'
import React, { useState } from 'react'
import {
    Box,
    Field,
    Grid,
    GridItem,
    Heading,
    Link,
    NativeSelect,
    Span,
    Text
} from '@chakra-ui/react'
import { Tooltip, NoPrefetchLink } from '@/components/ui'
import { InitiativeForm } from './InitiativeForm'
import { FoundationalTechnologyForm } from './FoundationalTechnologyForm'
import { CompanySubdomainForm } from './CompanySubdomainForm'
import { BuildBuyForm } from './BuildBuyForm'
import { IconInfo } from '@americanexpress/dls-icons'
import { LayoutRenderProps } from '@/app/onboarding-form/types'
import { useRepoTypeOptions } from '@/app/onboarding-form/hooks'
import { extractRepoTypeOptions } from '@/app/onboarding-form/utils'
import { PLAYBOOK_TYPE_IDS } from '@/constants'
import { useRouter } from 'next/navigation'

export function OnboardingForm({ defaultType }: { defaultType?: string }) {
    const user = useUserContext()
    const router = useRouter()
    const { adsId = '', email = '' } = user?.attributes ?? {}
    const {
        extension_ee871ce5fcfd4b20869cbd9d712306f7_axppband: bandLevel = ''
    } = user?.userInfo ?? {}
    const { data: repoTypeOptionsData, isLoading: isRepoTypeLoading } =
        useRepoTypeOptions()
    const repoTypeOptions = extractRepoTypeOptions(repoTypeOptionsData)
    const formTypeOptions = [
        { displayText: 'Initiative', value: PLAYBOOK_TYPE_IDS.INITIATIVE },
        {
            displayText: 'Foundational Technology',
            value: PLAYBOOK_TYPE_IDS.FOUNDATIONAL_TECHNOLOGY
        },
        {
            displayText: 'Company Subdomain',
            value: PLAYBOOK_TYPE_IDS.COMPANY_SUBDOMAIN
        },
        { displayText: 'BuildBuy', value: PLAYBOOK_TYPE_IDS.BUILD_VS_BUY }
    ]
    const [activeFormValue, setActiveFormValue] = useState<string>(
        defaultType ? defaultType : PLAYBOOK_TYPE_IDS.INITIATIVE
    )

    // Find the initial display text based on the initial value and available options
    const getInitialDisplayText = () => {
        const allOptions =
            repoTypeOptions && repoTypeOptions.length > 0
                ? repoTypeOptions
                : formTypeOptions
        const found = allOptions.find(
            opt =>
                String(opt.value) ===
                String(defaultType ? defaultType : PLAYBOOK_TYPE_IDS.INITIATIVE)
        )
        return found ? found.displayText : ''
    }

    const [activeFormDisplayText, setActiveFormDisplayText] = useState(
        getInitialDisplayText()
    )

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // Get the selected value
        const value = event.currentTarget.value

        // Get the index of the selected option
        const selectedIndex = event.currentTarget.selectedIndex

        // Get the label using the options collection and the index
        const displayText = event.currentTarget.options[selectedIndex].text

        router.push(`/onboarding-form?type=${value}`)
        setActiveFormValue(value)
        setActiveFormDisplayText(displayText)
    }

    const renderWithLayout = (
        FormComponent: React.ComponentType<{
            children: (p: LayoutRenderProps) => React.ReactNode
            activeFormDisplayText: string
            adsId?: string
            email?: string
            bandLevel?: string
        }>,
        extraProps: {
            activeFormDisplayText: string
            adsId?: string
            email?: string
            bandLevel?: string
        }
    ) => (
        <FormComponent {...extraProps}>
            {({ firstField, restFields, onSubmit }) => (
                <Box as='form' onSubmit={onSubmit}>
                    <Grid
                        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                        gap={6}
                    >
                        {/* Select: full width on mobile, first col on md+ */}
                        <GridItem colSpan={{ base: 2, md: 1 }}>
                            <Field.Root required={true}>
                                <Field.Label>
                                    <Text textStyle='sm' fontWeight='bold'>
                                        Onboarding Request Type
                                    </Text>

                                    <Field.RequiredIndicator />
                                    <Tooltip
                                        showArrow
                                        content='Select the type you are requesting to onboard.'
                                        contentProps={{
                                            css: { '--tooltip-bg': 'grey' }
                                        }}
                                    >
                                        <IconInfo />
                                    </Tooltip>
                                </Field.Label>
                                <NativeSelect.Root>
                                    <NativeSelect.Field
                                        value={activeFormValue}
                                        onChange={handleChange}
                                        placeholder={
                                            isRepoTypeLoading
                                                ? 'Loading...'
                                                : undefined
                                        }
                                    >
                                        {repoTypeOptions
                                            ? repoTypeOptions
                                                  .filter(
                                                      item =>
                                                          item.value !==
                                                          undefined
                                                  )
                                                  .map(item => (
                                                      <option
                                                          key={String(
                                                              item.value
                                                          )}
                                                          value={String(
                                                              item.value
                                                          )}
                                                      >
                                                          {item.displayText}
                                                      </option>
                                                  ))
                                            : formTypeOptions.map(item => (
                                                  <option
                                                      key={String(item.value)}
                                                      value={item.value}
                                                  >
                                                      {item.displayText}
                                                  </option>
                                              ))}
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Field.Root>
                        </GridItem>

                        {/* First field: full width on mobile, second col on md+ */}
                        <GridItem colSpan={{ base: 2, md: 1 }}>
                            {firstField}
                        </GridItem>

                        {/* Rest of the fields: always below, full width */}
                        <GridItem colSpan={2}>{restFields}</GridItem>
                    </Grid>
                </Box>
            )}
        </FormComponent>
    )

    return (
        <Box maxW='1000px' width='100%' mx='auto' p={6}>
            <Heading
                size='3xl'
                mb={4}
                color={{ base: '#00175a', _dark: '#1a88e9ff' }}
            >
                Onboarding Request
            </Heading>
            <Text paddingBottom={'30px'} color='fg.muted' textStyle='sm'>
                If this is your first time onboarding, please follow the
                instructions in the Need Help section.
                {activeFormValue === PLAYBOOK_TYPE_IDS.COMPANY_SUBDOMAIN && (
                    <Text>
                        <Text as={Span} fontWeight='bold' color='red'>
                            Note:
                        </Text>{' '}
                        Subdomain approval process{' '}
                        <Text as={Span} fontStyle='italic'>
                            has changed
                        </Text>
                        , please refer to our{' '}
                        {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                        <Link
                            as={NoPrefetchLink}
                            href={'/contribute/subdomain-onboarding-guidelines'}
                            style={{
                                color: '#006fcf',
                                cursor: 'pointer'
                            }}
                            _hover={{ textDecoration: 'underline' }}
                            variant={'plain'}
                        >
                            approval workflow
                        </Link>
                        . Requests can only be submitted by{' '}
                        <Text as={Span} fontWeight='bold'>
                            Band 40+
                        </Text>{' '}
                        users.
                    </Text>
                )}
            </Text>
            {activeFormValue === PLAYBOOK_TYPE_IDS.INITIATIVE &&
                renderWithLayout(InitiativeForm, {
                    activeFormDisplayText,
                    adsId,
                    email
                })}
            {activeFormValue === PLAYBOOK_TYPE_IDS.FOUNDATIONAL_TECHNOLOGY &&
                renderWithLayout(FoundationalTechnologyForm, {
                    activeFormDisplayText,
                    adsId,
                    email
                })}
            {activeFormValue === PLAYBOOK_TYPE_IDS.COMPANY_SUBDOMAIN &&
                renderWithLayout(CompanySubdomainForm, {
                    activeFormDisplayText,
                    adsId,
                    email,
                    bandLevel
                })}
            {activeFormValue === PLAYBOOK_TYPE_IDS.BUILD_VS_BUY &&
                renderWithLayout(BuildBuyForm, {
                    activeFormDisplayText,
                    adsId,
                    email
                })}
        </Box>
    )
}
