export interface ResponseCount {
    domainStatusCount: {
        eARB_Approved: number
        dARB_Approved: number
        api: {
            eARB_Approved: number
            dARB_Approved: number
            design_Certified: number
            prod_Certified: number
            proposed: number
            total: number
        }
        operations: {
            eARB_Approved: number
            dARB_Approved: number
            design_Certified: number
            prod_Certified: number
            proposed: number
            total: number
        }
    }
}
