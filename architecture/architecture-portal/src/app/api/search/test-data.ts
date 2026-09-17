export const SEARCH_TEST_PARAMS = {
    query: 'api gateway',
    emptyQuery: ''
}

export const SEARCH_TEST_CONFIG = {
    collection: 'documents',
    queryBy: 'title,playbook_nm,content,repo,playbook_type_nm',
    queryByWeights: '5,3,2,1,1',
    perPage: 10,
    port: 443,
    protocol: 'https',
    connectionTimeoutSeconds: 5
}

export const SEARCH_TEST_RESULTS = {
    hits: [
        { document: { id: '1', title: 'API Gateway Overview' } },
        { document: { id: '2', title: 'API Gateway Patterns' } }
    ],
    found: 2
}

export const SEARCH_TEST_ERRORS = {
    message: 'Connection timed out',
    noMessage: 42
}
