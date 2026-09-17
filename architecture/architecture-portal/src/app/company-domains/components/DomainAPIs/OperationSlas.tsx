/* istanbul ignore file */

import { useEffect, useState } from 'react'
import { Box, Field, Input, VStack, Accordion } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui'
import { IconInfo } from '@americanexpress/dls-icons'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { ApiFormType } from '@/app/company-domains/types'

interface ErrorType {
    error: boolean
    message: string
}
/* eslint-disable @typescript-eslint/no-explicit-any */
interface OperationSlasProps {
    formErrors: { [key: string]: ErrorType }
    formValues: Partial<ApiFormType>
    onChange: any
}

export const SlaFormElement = ({
    formErrors,
    formValues,
    onChange
}: OperationSlasProps) => {
    return (
        <Box gap='8px' width='100%'>
            {[
                {
                    name: 'slaResponseTime',
                    label: 'Response Time(ms)',
                    tooltip:
                        '99th percentile response time for the operation, measured in milliseconds (ms). (1ms <= Response Time <= 5000ms)'
                },
                {
                    name: 'slaAverageRps',
                    label: 'Average RPS',
                    tooltip:
                        'Average number of requests the operation can handle per second. (0 <= Average RPS <= Peak RPS <= 5000)'
                },
                {
                    name: 'slaPeakRps',
                    label: 'Peak RPS',
                    tooltip:
                        'Maximum number of requests the operation can handle per second at peak load. (0 <= Average RPS <= Peak RPS <= 5000)'
                },
                {
                    name: 'slaErrorRate',
                    label: 'Error Rate',
                    tooltip:
                        'Acceptable percentage of requests that may result in an error. (0 < Error Rate <= 100)'
                },
                {
                    name: 'slaAvailability',
                    label: 'Availability',
                    tooltip:
                        'Target uptime percentage per month for the operation. (0 < Availability <= 99.999)'
                }
            ].map(({ name, label, tooltip }) => (
                <Field.Root
                    key={name}
                    orientation='horizontal'
                    mb={4}
                    css={{
                        '--field-label-width': '160px'
                    }}
                    invalid={
                        !!formErrors[name as keyof typeof formErrors]?.error
                    }
                >
                    <Field.Label className={styles.slaLabel}>
                        {label}
                        <Tooltip
                            showArrow
                            content={tooltip}
                            contentProps={{
                                css: {
                                    '--tooltip-bg': 'grey'
                                }
                            }}
                        >
                            <IconInfo size='md' />
                        </Tooltip>
                    </Field.Label>
                    <VStack alignItems='flex-start' width='100%'>
                        <Input
                            value={
                                (
                                    formValues as unknown as Record<
                                        string,
                                        string
                                    >
                                )[name]
                            }
                            onChange={e => onChange(e)}
                            name={name}
                            placeholder={`Enter ${label.toLowerCase()}`}
                            data-testid={name}
                            maxW='200px'
                        />
                        {formErrors[name as keyof typeof formErrors]?.error && (
                            <Field.ErrorText className={styles.errorMessage}>
                                {
                                    formErrors[name as keyof typeof formErrors]
                                        ?.message
                                }
                            </Field.ErrorText>
                        )}
                    </VStack>
                </Field.Root>
            ))}
        </Box>
    )
}

export const OperationSlas = ({
    formErrors,
    formValues,
    onChange
}: OperationSlasProps) => {
    const expandSlaSection = Object.keys(formErrors).some(
        key =>
            [
                'slaResponseTime',
                'slaAverageRps',
                'slaPeakRps',
                'slaErrorRate',
                'slaAvailability'
            ].includes(key) && formValues[key as keyof typeof formValues]
    )
    const [isExpanded, setExpandedSections] = useState<string[]>(
        expandSlaSection ? ['sla-section'] : []
    )
    useEffect(() => {
        const hasSLAError = [
            'slaResponseTime',
            'slaAverageRps',
            'slaPeakRps',
            'slaErrorRate',
            'slaAvailability'
        ].some(key => formErrors[key]?.error === true)
        setExpandedSections(
            expandSlaSection || hasSLAError ? ['sla-section'] : []
        )
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [formErrors])
    return (
        <Accordion.Root
            collapsible
            mt='12px'
            value={isExpanded}
            onValueChange={e => {
                setExpandedSections(e.value)
            }}
        >
            <Accordion.Item value='sla-section'>
                <Accordion.ItemTrigger>
                    <Box fontWeight='semibold' fontSize='sm'>
                        Expand to Add Non Functional Requirements (NFRs)
                        <span className={styles.requiredIndicator}>*</span>
                    </Box>
                    <Accordion.ItemIndicator ml='auto' />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                    <Accordion.ItemBody>
                        <SlaFormElement
                            formValues={formValues}
                            formErrors={formErrors}
                            onChange={onChange}
                        />
                    </Accordion.ItemBody>
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Root>
    )
}
