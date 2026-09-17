export const CJ_TEST_TEXT = {
    // Navigation direction labels
    previous: 'Previous',
    next: 'Next',
    // Nav link labels used in prevNext mock data
    manageAccount: 'Manage Account',
    viewStatements: 'View Statements',
    unknownJourney: 'Unknown Journey',
    anotherUnknown: 'Another Unknown',
    someLabel: 'Some Label',
    otherLabel: 'Other Label',
    // Journey statements returned by useCustomerJourneys
    manageAccountStatement: 'I want to manage my account settings',
    viewStatementsStatement: 'I want to view my statements'
}

export const CJ_TEST_HREFS = {
    prevPage: '/prev-page',
    nextPage: '/next-page',
    prev: '/prev',
    next: '/next'
}

export const CJ_DETAILS_TEST_TEXT = {
    // Static section labels
    customerJourneyLabel: 'CUSTOMER JOURNEY:',
    customerSectionLabel: 'Customer',
    personaSectionLabel: 'Persona',
    productSectionLabel: 'Product',
    marketSectionLabel: 'Market',
    capabilitiesHeading: 'Capabilities',
    apisHeading: 'APIs',
    platformsLogoAlt: 'Platforms Logo',
    // Journey data
    journeyStatement: 'I want to manage my finances',
    journeyDesc: 'This journey covers financial management',
    // Metadata badge values
    customerTx: 'Retail',
    persona: 'Cardholder',
    product: 'Credit Card',
    market: 'US',
    // Stage names
    stage1Name: 'Discovery',
    stage2Name: 'Application',
    // Capability names
    capabilityWithId: 'Financial Planning',
    capabilityNoId: 'Roadmap Item',
    // Domain nameenterprise-customer-journeys
    domainName: 'Payments Domain',
    // API names
    apiTypeA: 'Payments API',
    apiNonTypeA: 'Legacy API',
    duplicateApiName: 'Duplicate API'
}

export const CJ_LANDING_TEST_TEXT = {
    journeyStatement: 'I want to manage my finances'
}

export const CJ_DETAILS_TEST_HREFS = {
    capability:
        '/business-architecture/capabilities/cap-001/?tab=Enterprise+Customer+Journeys',
    domain: '/docs/playbook-001',
    api: '/domain/api/details',
    // Built by getAbsoluteOperationUrl from the CIRM domain's e0 docs path,
    // anchored on the endpoint id.
    apiEndpoint: '/docs/16cafa94-8e2c-4973-ad59-b922dcd0caa6#ep-001'
}

/** CIRM — present in DOMAIN_API_MAP for every environment. */
export const CJ_DETAILS_MAPPED_DOMAIN_ID =
    '27124f40-7adf-42c2-8a18-a44b75d8bc2d'
