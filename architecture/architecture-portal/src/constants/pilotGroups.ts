import { ENVIRONMENT } from '@/constants/env'

const PILOT_GROUPS = {
    PLANNING_PROCESS_DASHBOARD_PILOT_GROUP: {
        e0: '9fdac1f7-483e-426a-9c78-80ace764e84b',
        e1: '9fdac1f7-483e-426a-9c78-80ace764e84b',
        e2: '2acda40e-2143-4db0-9578-778ae5ac83f9',
        e3: 'ac385fc9-e70b-480d-8528-1aef5415eec2'
    },
    INITIATIVES_TABLE_PILOT_GROUP: {
        e0: 'c1e738d3-39cb-4b91-8a1b-6367f238d6c3',
        e1: 'c1e738d3-39cb-4b91-8a1b-6367f238d6c3',
        e2: '6eb07439-eddc-4d70-9790-99e9a21278bb',
        e3: '672a89c9-e400-4325-bf77-141cde35e62d'
    },
    PILOT_CHAT_GROUP: {
        e0: 'ab45c7ab-fd3a-4314-9821-84c6510159b8',
        e1: 'ab45c7ab-fd3a-4314-9821-84c6510159b8',
        e2: '0878f3d2-3c07-4c31-bb69-47858790187b',
        e3: '042ac962-80cf-4ce8-be8c-edab4c7e2f5b'
    },
    CROSS_DOMAIN_API_METRICS_PILOT_GROUP: {
        e0: '68ca62eb-9b35-48d6-8c84-ac202f5c2d62',
        e1: '68ca62eb-9b35-48d6-8c84-ac202f5c2d62',
        e2: '87596aaa-e10f-4870-af38-b57bc71db715',
        e3: '43927fe3-0b17-42c9-a5bd-2e710657eb30'
    }
}

export const getPilotGroupId = (
    pilotGroup: keyof typeof PILOT_GROUPS
): string => {
    return PILOT_GROUPS[pilotGroup][ENVIRONMENT]
}
