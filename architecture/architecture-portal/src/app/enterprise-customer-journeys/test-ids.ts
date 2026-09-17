export const CJ_LANDING_TEST_IDS = {
    journeyId: 'manage-finances',
    unknownJourneyId: 'does-not-exist'
}

export const CJ_HEADER_TEST_IDS = {
    heading: 'cj-header-heading',
    description: 'cj-header-description'
}

export const CJ_PREV_NEXT_TEST_IDS = {
    previousLink: 'cjPrevNext.previousLink',
    previousLabel: 'cjPrevNext.previousLabel',
    previousJourney: 'cjPrevNext.previousJourney',
    nextLink: 'cjPrevNext.nextLink',
    nextLabel: 'cjPrevNext.nextLabel',
    nextJourney: 'cjPrevNext.nextJourney',
    previousPlaceholder: 'cjPrevNext.previousPlaceholder',
    nextPlaceholder: 'cjPrevNext.nextPlaceholder'
}

export const CJ_DETAILS_TEST_IDS = {
    journeyLabel: 'cjDetails.journeyLabel',
    journeyStatement: 'cjDetails.journeyStatement',
    journeyDesc: 'cjDetails.journeyDesc',
    customerLabel: 'cjDetails.customerLabel',
    personaLabel: 'cjDetails.personaLabel',
    productLabel: 'cjDetails.productLabel',
    marketLabel: 'cjDetails.marketLabel',
    stagesTable: 'cjDetails.stagesTable',
    capabilitiesHeading: 'cjDetails.capabilitiesHeading',
    apisHeading: 'cjDetails.apisHeading',
    touchPointsHeading: 'cjDetails.touchPointsHeading',
    businessActionsHeading: 'cjDetails.businessActionsHeading',
    applicationsHeading: 'cjDetails.applicationsHeading',
    platformsLogo: 'cjDetails.platformsLogo',
    stageName: (id: string) => `cjDetails.stageName.${id}`,
    customerBadge: (value: string) => `cjDetails.customerBadge.${value}`,
    personaBadge: (value: string) => `cjDetails.personaBadge.${value}`,
    productBadge: (value: string) => `cjDetails.productBadge.${value}`,
    marketBadge: (value: string) => `cjDetails.marketBadge.${value}`,
    marketFlag: (value: string) => `cjDetails.marketFlag.${value}`,
    capabilityLink: (id: string) => `cjDetails.capabilityLink.${id}`,
    capabilityText: (key: string) => `cjDetails.capabilityText.${key}`,
    domainLink: (id: string) => `cjDetails.domainLink.${id}`,
    apiLink: (id: string) => `cjDetails.apiLink.${id}`,
    apiText: (id: string) => `cjDetails.apiText.${id}`,
    touchPointText: (value: string) => `cjDetails.touchPointText.${value}`,
    businessActionText: (value: string) =>
        `cjDetails.businessActionText.${value}`,
    applicationText: (id: string) => `cjDetails.applicationText.${id}`
}
