/* istanbul ignore file */
export const QUERY_PARAMS = {
    APPROVAL_FILTER: 'approvalFilter',
    APPROVAL_FILTER_VALUES: {
        EARB_APPROVAL: 'pendingEarbApproval',
        ARB_APPROVAL: 'pendingArbApproval'
    }
}

export const getStatusFiltersfromUrl = (isApi: boolean = false) => {
    const queryParams = new URLSearchParams(window.location.search)
    let statusFiltersFromUrl = queryParams.get(QUERY_PARAMS.APPROVAL_FILTER)
    statusFiltersFromUrl = !statusFiltersFromUrl
        ? queryParams.get(QUERY_PARAMS.APPROVAL_FILTER.toLowerCase())
        : statusFiltersFromUrl
    if (
        statusFiltersFromUrl?.toLowerCase() ===
        QUERY_PARAMS.APPROVAL_FILTER_VALUES.EARB_APPROVAL.toLowerCase()
    ) {
        return isApi
            ? ['darbAppr', 'earbAppr', 'catalog', 'preCert', 'prodCert']
            : ['darbAppr']
    } else if (
        statusFiltersFromUrl?.toLowerCase() ===
        QUERY_PARAMS.APPROVAL_FILTER_VALUES.ARB_APPROVAL.toLowerCase()
    ) {
        return isApi
            ? [
                  'proposed',
                  'darbAppr',
                  'earbAppr',
                  'catalog',
                  'preCert',
                  'prodCert'
              ]
            : ['proposed']
    }
    return []
}
