export interface BAChangeRequest {
    requesterName: string
    requesterEmail: string
    changeType: string
    capabilityKeyTx?: string
    capabilityName?: string
    impactedCustomerSegment: string
    associatedSystems?: string
    impactedMarkets: string
    impactedAmexProducts: string
    impactedChannels: string
    customerJourneyContext?: string
    additionalInformation?: string
}
