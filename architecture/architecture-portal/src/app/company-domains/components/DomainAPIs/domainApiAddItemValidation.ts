import type { ApiFormType } from '@/app/company-domains/types'
import type { EditRowType, ErrorType } from './DomainApiAddItem.types'

interface ValidateDomainApiFormArgs {
    formValueLabel: string
    formValues: ApiFormType
    isApiEdit: boolean
    isApiFormEnabled: boolean
    isEditRow: EditRowType
}

type ValidationErrors = {
    apiName: ErrorType
    apiType: ErrorType
    api: ErrorType
    output: ErrorType
    operation: ErrorType
    prvdDomain: ErrorType
    apiDesc: ErrorType
    endpoint_ds: ErrorType
    intendedMarkets: ErrorType
    input: ErrorType
    cnsmDomain: ErrorType
    journeyLink: ErrorType
    slaAverageRps: ErrorType
    slaPeakRps: ErrorType
    slaErrorRate: ErrorType
    slaAvailability: ErrorType
    slaResponseTime: ErrorType
}

export const getFilteredValues = (values = {}) => {
    const nonFilteredValues = ['ebcm']
    return Object.fromEntries(
        Object.entries(values).filter(
            ([key]) => !nonFilteredValues.includes(key)
        )
    )
}

export const validateDomainApiForm = ({
    formValueLabel,
    formValues,
    isApiEdit,
    isApiFormEnabled,
    isEditRow
}: ValidateDomainApiFormArgs): ValidationErrors => {
    const defaultError: ErrorType = { error: false, message: '' }
    const errors: ValidationErrors = {
        apiName: defaultError,
        apiType: defaultError,
        api: defaultError,
        output: defaultError,
        operation: defaultError,
        prvdDomain: defaultError,
        apiDesc: defaultError,
        endpoint_ds: defaultError,
        intendedMarkets: defaultError,
        input: defaultError,
        cnsmDomain: defaultError,
        journeyLink: defaultError,
        slaAverageRps: defaultError,
        slaPeakRps: defaultError,
        slaErrorRate: defaultError,
        slaAvailability: defaultError,
        slaResponseTime: defaultError
    }

    const isOperations =
        formValueLabel === 'Operations' || (!isApiEdit && isEditRow.api_id)

    if (!formValues.apiName && isApiFormEnabled) {
        errors.apiName = { error: true, message: 'API Name is required' }
    }
    if (!formValues.apiType && isOperations) {
        errors.apiType = { error: true, message: 'API Type is required' }
    }
    if (!formValues.api && formValueLabel === 'Operations') {
        errors.api = { error: true, message: 'API is required' }
    }
    if (!formValues.output && isOperations) {
        errors.output = { error: true, message: 'Output is required' }
    }
    if (!formValues.operation && isOperations) {
        errors.operation = { error: true, message: 'Operation is required' }
    }
    if (!formValues.prvdDomain?.length) {
        errors.prvdDomain = {
            error: true,
            message: 'Provider Company Domain is required'
        }
    }
    if (!formValues.apiDesc && isApiFormEnabled) {
        errors.apiDesc = {
            error: true,
            message: 'API Description is required'
        }
    }
    if (!formValues.endpoint_ds && isOperations) {
        errors.endpoint_ds = {
            error: true,
            message: 'Description is required'
        }
    }
    if (!formValues.intendedMarkets?.length && isOperations) {
        errors.intendedMarkets = {
            error: true,
            message: 'Intended Markets is required'
        }
    }
    if (!formValues.input && isOperations) {
        errors.input = { error: true, message: 'Input is required' }
    }
    if (!formValues.cnsmDomain.length && isOperations) {
        errors.cnsmDomain = {
            error: true,
            message: 'Consumer Company Domain is required'
        }
    }
    // SLA fields required only for Operations
    if (!formValues?.slaResponseTime && isOperations) {
        errors.slaResponseTime = {
            error: true,
            message: 'Response Time is required'
        }
    }
    if (!formValues?.slaAverageRps && isOperations) {
        errors.slaAverageRps = {
            error: true,
            message: 'Average RPS is required'
        }
    }
    if (!formValues?.slaPeakRps && isOperations) {
        errors.slaPeakRps = {
            error: true,
            message: 'Peak RPS is required'
        }
    }
    if (!formValues?.slaErrorRate && isOperations) {
        errors.slaErrorRate = {
            error: true,
            message: 'Error Rate is required'
        }
    }
    if (!formValues?.slaAvailability && isOperations) {
        errors.slaAvailability = {
            error: true,
            message: 'Availability is required'
        }
    }
    if (
        formValues.prvdDomain.length > 1 &&
        (formValues.apiType?.value?.toLowerCase() === 'typea' ||
            formValues.apiType?.value?.toLowerCase() === 'type a')
    ) {
        errors.apiType = {
            error: true,
            message:
                'API Type cannot be Type A when multiple domains are selected'
        }
    }
    if (formValues.slaAverageRps && isNaN(Number(formValues.slaAverageRps))) {
        errors.slaAverageRps = {
            error: true,
            message: 'Average RPS must be a number'
        }
    }
    if (formValues.slaPeakRps && isNaN(Number(formValues.slaPeakRps))) {
        errors.slaPeakRps = {
            error: true,
            message: 'Peak RPS must be a number'
        }
    }
    if (formValues.slaErrorRate && isNaN(Number(formValues.slaErrorRate))) {
        errors.slaErrorRate = {
            error: true,
            message: 'Error Rate must be a number'
        }
    }
    if (
        formValues.slaPeakRps &&
        formValues.slaAverageRps &&
        Number(formValues.slaPeakRps) <= Number(formValues.slaAverageRps)
    ) {
        errors.slaPeakRps = {
            error: true,
            message: 'Peak RPS must be greater than Average RPS'
        }
    }
    if (
        formValues.slaAvailability &&
        isNaN(Number(formValues.slaAvailability))
    ) {
        errors.slaAvailability = {
            error: true,
            message: 'Availability must be a number'
        }
    }
    if (
        formValues.slaResponseTime &&
        (Number(formValues.slaResponseTime) > 5000 ||
            Number(formValues.slaResponseTime) < 1)
    ) {
        errors.slaResponseTime = {
            error: true,
            message: 'Response Time must be between 1 and 5000ms'
        }
    }
    if (
        formValues.slaAverageRps &&
        (Number(formValues.slaAverageRps) < 0 ||
            Number(formValues.slaAverageRps) > 5000)
    ) {
        errors.slaAverageRps = {
            error: true,
            message: 'Average RPS must be between 0 and 5000'
        }
    }
    if (
        formValues.slaPeakRps &&
        (Number(formValues.slaPeakRps) < 0 ||
            Number(formValues.slaPeakRps) > 5000)
    ) {
        errors.slaPeakRps = {
            error: true,
            message: 'Peak RPS must be between 0 and 5000'
        }
    }
    if (
        formValues.slaAvailability &&
        (Number(formValues.slaAvailability) < 0 ||
            Number(formValues.slaAvailability) > 99.999)
    ) {
        errors.slaAvailability = {
            error: true,
            message: 'Availability must be between 0 and 99.999'
        }
    }
    if (
        formValues.slaErrorRate &&
        (Number(formValues.slaErrorRate) < 0 ||
            Number(formValues.slaErrorRate) > 100)
    ) {
        errors.slaErrorRate = {
            error: true,
            message: 'Error Rate must be between 0 and 100'
        }
    }
    if (!formValues.journeyLink && isOperations) {
        errors.journeyLink = {
            error: true,
            message: 'Use Case / Journey Link is required'
        }
    } else if (
        formValues.journeyLink &&
        !(
            formValues.journeyLink.startsWith(
                'https://architecture.aexp.com/architecture-docs'
            ) ||
            formValues.journeyLink.startsWith(
                'https://architecture1.aexp.com/docs'
            )
        )
    ) {
        errors.journeyLink = {
            error: true,
            message:
                'Link must start with https://architecture.aexp.com/architecture-docs'
        }
    }

    return errors
}
