/* istanbul ignore file */

const introSectionTitle = 'API Documentation'
const introSectionDescription = `The company domain APIs offer intuitive access to a wide range of company-related APIs and operations, including retrieving information, managing resources, and performing key actions. Each endpoint is well-documented with clear explanations and examples, enabling developers to seamlessly integrate and manage APIs within their applications.`
const introSectionMetricsTitle = 'API Docs Metrics:'

const STATUS_FILTER_VALUES = {
    ALL: 'all',
    DESIGN_CERTIFIED: 'design_certified',
    PRODUCTION_CERTIFIED: 'production_certified'
}
const STATUS_FILTERS = [
    {
        label: 'Onboarded to Catalog',
        value: STATUS_FILTER_VALUES.ALL
    },
    {
        label: 'Design Certified',
        value: STATUS_FILTER_VALUES.DESIGN_CERTIFIED
    },
    {
        label: 'Production Certified',
        value: STATUS_FILTER_VALUES.PRODUCTION_CERTIFIED
    }
]

export {
    introSectionTitle,
    introSectionDescription,
    introSectionMetricsTitle,
    STATUS_FILTER_VALUES,
    STATUS_FILTERS
}
