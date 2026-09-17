/* istanbul ignore file */
import {
    ARCHITECTURE_API_URL,
    ARCHITECTURE_INTELLIGENCE_API_URL,
    METAMODEL_API_URL
} from './urls'

/** architecture-metamodel path builder: global prefix `api`, URI version v1. */
const metamodel = (path: string) => `${METAMODEL_API_URL}/api/v1/${path}`

export const API_ENDPOINTS = {
    GET_FEATURE_FLAG: (name: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/feature-flags/${encodeURIComponent(name)}`,
    GET_FEATURE_FLAGS: `${ARCHITECTURE_API_URL}/arch-api/v1/feature-flags`,
    PUT_FEATURE_FLAG: (name: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/feature-flags/${encodeURIComponent(name)}`,
    DELETE_FEATURE_FLAG: (name: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/feature-flags/${encodeURIComponent(name)}`,
    GET_FEATURE_FLAG_AUDIT_LOGS: (name: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/feature-flags/${encodeURIComponent(name)}/audit-logs`,
    GET_PLAYBOOKS: `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks`,
    GET_PLAYBOOK_BY_ID: (id: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks/${id}`,
    GET_PLAYBOOK_FILE_BY_ID: (id: string, isAdrs: boolean = false) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks/files/${id}${isAdrs ? '/adrs' : ''}`,
    GET_PLAYBOOK_FILES: (id: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks/${id}/files`,
    GET_PLAYBOOKS_FILES: `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks/files`,
    GET_USER_ICON: (email: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/graphAPI/getUserPhoto/${email}`,
    GET_USER_INFO: (email: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/graphAPI/getUserInfo/${email}`,
    GET_PERSONA: `${ARCHITECTURE_API_URL}/arch-api/v1/persona`,
    GET_PILOT_GROUP: (id: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/pilot-groups/${id}`,
    GET_PILOT_GROUPS: `${ARCHITECTURE_API_URL}/arch-api/v1/pilot-groups`,
    POST_PILOT_GROUP: `${ARCHITECTURE_API_URL}/arch-api/v1/pilot-groups`,
    DELETE_PILOT_GROUP: (groupId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/pilot-groups/${groupId}`,
    POST_PILOT_GROUP_MEMBERS: (groupId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/pilot-groups/${groupId}/members`,
    DELETE_PILOT_GROUP_MEMBERS: (groupId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/pilot-groups/${groupId}/members`,
    GET_PILOT_GROUP_AUDIT_LOGS: (groupId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/pilot-groups/${groupId}/audit-logs`,
    GET_USER_BY_PLAYBOOK_ID: (id: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/users/${id}`,
    GET_PLAYBOOKS_BY_TYPE: (typeId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/playbooks/types/${typeId}`,
    GET_SIDEBAR: (id?: string, typeId?: string, isAdrs?: boolean) => {
        if (id)
            return `${ARCHITECTURE_API_URL}/arch-api/v2/sidebar/files/${id}${isAdrs ? '/adrs' : ''}`
        return isAdrs
            ? `${ARCHITECTURE_API_URL}/arch-api/v2/sidebar/adrs`
            : `${ARCHITECTURE_API_URL}/arch-api/v2/sidebar/types/${typeId}`
    },
    GET_SIDEBAR_SECTION: (
        path?: string,
        id?: string,
        typeId?: string,
        isAdrs?: boolean
    ) => {
        if (isAdrs) {
            if (typeId)
                return `${ARCHITECTURE_API_URL}/arch-api/v2/sidebar/types/${typeId}/adrs`
            else
                return `${ARCHITECTURE_API_URL}/arch-api/v2/sidebar/playbooks/${id}/adrs?path=${encodeURIComponent(path ?? '')}`
        }
        return `${ARCHITECTURE_API_URL}/arch-api/v2/sidebar/playbooks/${id}?path=${encodeURIComponent(path ?? '')}`
    },
    SYNC_GITHUB_REPO: (repository: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/repos/sync/${repository}`,
    DOWNLOAD_PDF: (uuid: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v2/playbooks/${uuid}/download`,
    UPDATE_BVB: (playbookId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks/updateBvB/${playbookId}`,
    GET_ADMIN_SIDEBAR: `${ARCHITECTURE_API_URL}/arch-api/v1/admin/sidebar`,
    ADMIN_USER: `${ARCHITECTURE_API_URL}/arch-api/v1/user`,
    GET_DOMAINS: `${ARCHITECTURE_API_URL}/arch-api/v5/domains`,
    GET_ANALYTICS: `${ARCHITECTURE_API_URL}/arch-api/v2/analytics`,
    SUBMIT_ACCEPTANCE: (bvbId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/workflow/criteria/${bvbId}`,
    SUBMIT_FOR_REVIEW: (bvbId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/workflow/review/${bvbId}`,
    SUBMIT_REVIEW: () => `${ARCHITECTURE_API_URL}/arch-api/v2/workflow/review`,
    SUBMIT_APPROVAL: () =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/workflow/decider`,
    GET_STATUS_COUNT: (domainId = '') =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domains/${domainId}/Statuscount`,
    ACTUAL_MARKETS_EDIT: `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/marketEdit`,
    EDIT_COEDITORS: `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/coeditor`,
    API_UPDATE_STATUS: `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/apiEndpoint/updateStatus`,
    GET_REVIEWER: (domainId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domain/${domainId}/reviewer`,
    GET_API_WITH_ENDPOINT_DETAILS: (domainId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/${domainId}/fetchApiWithEndPointDetails`,

    // Directory
    GET_DOMAIN_DETAILS: (domainId = '') =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/directory/domain/${domainId}`,
    POST_DOMAIN_DETAILS_APPLICATIONS: (domainId = '') =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/directory/domain/${domainId}/applications`,
    GET_DOMAIN_DETAILS_APPLICATIONS: (domainId = '') =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/directory/domain/${domainId}/applications`,
    GET_APP_COUNT: `${ARCHITECTURE_API_URL}/arch-api/v1/directory/applications/count`,
    GET_ALL_DOMAINS: `${ARCHITECTURE_API_URL}/arch-api/v1/directory/domain/allDomains`,
    GET_COMPANY_DOMAINS_DATA: `${ARCHITECTURE_API_URL}/arch-api/v1/directory/domain/domainsAppsCount`,
    GET_COMPANY_DOMAINS_DETAIL: (id: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/directory/domain/${id}/applications`,
    GET_EBCM_LIST: (level = '') =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/directory/ebcm/applications/${level}`,
    ADD_DOMAIN_MAPPING: (domainId = '') =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/directory/domain/${domainId}/applications`,
    ADD_EDIT_OWNER: (domainId = '') =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/directory/domain/${domainId}/owner`,
    GET_DASHBOARD_DETAILS: `${ARCHITECTURE_API_URL}/arch-api/v1/directory/dashBoard/info`,
    GET_DOMAIN_HISTORY: `${ARCHITECTURE_API_URL}/arch-api/v1/directory/audit-history/domain/`,
    ADD_EBCM_MAPPING: `${ARCHITECTURE_API_URL}/arch-api/v1/directory/ebcm/applications`,
    DIRECTORY_USER: `${ARCHITECTURE_API_URL}/arch-api/v1/directory/user`,
    GET_EBCM_DETAILS: (row: {
        ebc_level_4_nm?: string
        ebc_level_3_nm: string
    }) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/directory/ebcm/${row?.ebc_level_4_nm ? row.ebc_level_4_nm : row.ebc_level_3_nm}`,
    GET_SUB_DOMAINS: `${ARCHITECTURE_API_URL}/arch-api/v1/domains/allSubDomains`,
    DOMAINS_API: `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/api`,
    DOMAINS_API_ENDPOINT: `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/apiEndpoint`,
    GET_ECMI_MAPPED_APPS_BY_GROUP: (group: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/metrics/ecmi-mapped-applications/percentage?groupBy=${group}`,
    GET_API_COUNT_BY_GROUP: (group: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/metrics/domains/api/count?type=all&approvalStatus=all&groupBy=${group}`,
    GET_API_METRICS_DASHBOARD: `${ARCHITECTURE_API_URL}/arch-api/v1/metrics/domains/api/dashboard`,
    GET_ETP_ECMI_CROSS_DOMAIN_APIS: (group: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/metrics/etp-ecmi/cross-domain-apis?groupBy=${group || 'all'}`,
    GET_PLAYBOOK_CROSS_DOMAIN_METRICS: (playbookId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/metrics/etp-ecmi/cross-domain-apis/playbook/${playbookId}`,
    GET_API_DOMAIN_TARGETS: `${ARCHITECTURE_API_URL}/arch-api/v1/metrics/domains/api/target`,
    GET_UNIT_CIOS: `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getUnitCIOs`,
    GET_ECMI_MAPPED_APPS_DATA: `${ARCHITECTURE_API_URL}/arch-api/v1/metrics/ecmi-mapped-applications`,
    GET_API_LIST: `${ARCHITECTURE_API_URL}/arch-api/v1/metrics/domains/api`,
    UPDATE_API_DOMAIN_TARGET: `${ARCHITECTURE_API_URL}/arch-api/v1/metrics/domains/api/target`,
    GET_ALL_DIRECTORY_DOMAINS: `${ARCHITECTURE_API_URL}/arch-api/v1/directory/domain/allDomains`,
    POST_PLAYBOOK_V2: `${ARCHITECTURE_API_URL}/arch-api/v2/playbooks`,
    // endpoints used for populating field dropdowns
    GET_REPO_TYPE_OPTIONS: `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getRepoTypeOptions`,
    // graph api endpoints
    // eng lead also calls employees
    GET_EMPLOYEES_BY_EMAIL: (email: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/graphAPI/getEmployees/${email}`,
    GET_EMPLOYEES_AND_CONTRACTORS_BY_EMAIL: (email: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/graphAPI/getEmployeesAndContractors/${email}`,
    // field data endpoints
    GET_ENTERPRISE_ARCHITECTS_BY_EMAIL: (email: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getEnterpriseArchitects/${email}`,
    GET_OWNERS_BY_EMAIL: (email: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getOwners/${email}`,
    GET_TECH_OWNERS_BY_EMAIL: (email: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getTechOwners/${email}`,
    GET_UNIT_CIOS_BY_EMAIL: (email: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getUnitCIOs/${email}`,
    GET_STAKEHOLDERS_BY_EMAIL: (email: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getStakeholders/${email}`,
    GET_ETP_TITLES: `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getEtpTitles`,
    GET_INITIATIVE_CATEGORIES: `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getInitiativeCategories`,
    GET_BUSINESS_UNITS: `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getBusinessUnitList`,
    GET_EA_LEADS: `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getEaLeads`,
    // used for inits
    GET_FOUNDATIONAL_TECHNOLOGY_CATEGORIES: `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getFoundationalTechnologyCategories`,
    // used for ft dropdown
    GET_FRAMEWORK_CATEGORIES: `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getFrameworkCategories`,
    GET_ALL_EBCM_LEVELS: `${ARCHITECTURE_API_URL}/arch-api/v1/directory/ebcm/allCapabilities`,
    GET_APPLICATIONS: (search: boolean | string = false) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/directory/applications${search}`,
    GET_DASHBOARD_APPLICATIONS: `${ARCHITECTURE_API_URL}/arch-api/v1/directory/dashBoard/applications`,
    GET_APPLICATION_HISTORY: `${ARCHITECTURE_API_URL}/arch-api/v1/directory/audit-history/application/`,

    APPLICATION_SEARCH_HISTORY: `${ARCHITECTURE_API_URL}/arch-api/v1/directory/audit-history/application/search/`,
    DOMAIN_SEARCH_HISTORY: `${ARCHITECTURE_API_URL}/arch-api/v1/directory/audit-history/domain/search/`,
    GET_COMPANY_DOMAIN_CATEGORIES: `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/getPlatformCategories`,
    GET_APIDOCS_SIDEBAR: `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/api-docs/sidebar`,
    REORDER_DOMAIN_APIS: (domainId: string, apiId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/${domainId}/api/${apiId}/reorder`,
    REORDER_DOMAIN_API_ENDPOINTS: (domainId: string, apiId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/${domainId}/apis/${apiId}/endpoints/reorder`,
    GET_OPERATION_SCHEMA: (apiId: string, operationId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/api-docs/apis/${apiId}/operations/${operationId}`,
    ADD_ADR: `${ARCHITECTURE_API_URL}/arch-api/v1/adrs`,
    EDIT_ADR: (adrId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/adrs/${adrId}`,
    GET_ADR: (fileId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/adrs/${fileId}`,
    SUBMIT_ADR_FOR_REVIEW: (adrId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/adrs/review/${adrId}`,
    SUBMIT_ADR_REVIEW: `${ARCHITECTURE_API_URL}/arch-api/v1/adrs/review`,
    SUBMIT_ADR_APPROVAL: `${ARCHITECTURE_API_URL}/arch-api/v1/adrs/approval`,
    GET_ADR_AUDIT_HISTORY: (adrId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/adrs/audit-history/${adrId}`,
    GET_CONTRIBUTORS: (repo: string, filePath: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/repos/contributors?repo=${encodeURIComponent(repo)}&file_path_tx=${encodeURIComponent(filePath)}`,
    GET_PTB_INITIATIVE: (initiativeId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/ptb/initiatives/${initiativeId}`,
    GET_EA_LEADS_EMAIL: `${ARCHITECTURE_API_URL}/arch-api/v5/fieldData/eaLeads`,
    GET_ALL_ADR: `${ARCHITECTURE_API_URL}/arch-api/v1/adrs`,
    GET_APPLICATION_BY_CENTRAL_ID: (centralId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v5/directory/applications/${centralId}`,
    PUT_PTB_INITIATIVE: (initiativeId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/ptb/initiatives/${initiativeId}`,

    PUT_PTB_APPLICATION: (centralId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/ptb/applications/${centralId}`,

    POST_ATTESTATION_REQUEST_EMAIL: `${ARCHITECTURE_API_URL}/arch-api/v1/ptb/attestations/request-email`,

    ADD_DELEGATE_OWNER: (domainId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/${domainId}/delegates`,
    GET_DELEGATE_OWNER: (domainId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/${domainId}/delegates`,
    GET_ALL_PTB_INITIATIVES: `${ARCHITECTURE_API_URL}/arch-api/v1/initiatives`,
    UPDATE_INITIATIVE: (id: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/initiatives/${id}`,
    GET_PTB_INITIATIVES_BY_ETP_ID: (etpId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/ptb/initiatives?etpId=${etpId}`,
    PATCH_OPERATION_SLAS: (
        domainId: string,
        api_metadata_id: string,
        api_endpoint_metadata_id: string
    ) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/${domainId}/apis/${api_metadata_id}/operations/${api_endpoint_metadata_id}/slas`,
    FETCH_ARTIFACTS: (playbookId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks/artifacts/${playbookId}`,
    POST_METADATA_TAGS: `${ARCHITECTURE_API_URL}/arch-api/v1/metadata/category`,
    GET_METADATA_TAGS: (category: string | number) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/metadata/category/${category}`,
    GET_METADATA_FILE: (fileId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/metadata/file/${fileId}`,
    FETCH_USER_ROLES: `${ARCHITECTURE_API_URL}/arch-api/v1/metadata/role`,
    SAVE_METADATA_ARTIFACT_CATEGORY: `${ARCHITECTURE_API_URL}/arch-api/v1/metadata/saveArtifactCategory`,

    // apptio
    GET_APPTIO_EPIC_JOURNEYS: (epicId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/apptio/strategic-epics/${epicId}/journeys`,
    GET_APPTIO_JOURNEY_CAPABILITIES: (epicId: string, journeyId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/apptio/strategic-epics/${epicId}/journeys/${journeyId}/business-capabilities`,
    GET_APPTIO_EPIC_MAPPINGS: (epicId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/apptio/strategic-epics/${epicId}/mappings`,
    GET_STRATEGIC_EPIC: (epicId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/apptio/strategic-epics/${epicId}`,

    // ebcm
    GET_CAPABILITIES: `${ARCHITECTURE_API_URL}/arch-api/v2/business-architecture/capabilities`,
    GET_CAPABILITY_OWNERS: `${ARCHITECTURE_API_URL}/arch-api/v1/business-architecture/capability-owners`,
    GET_CUSTOMER_JOURNEYS: `${ARCHITECTURE_API_URL}/arch-api/v2/business-architecture/customer-journeys`,
    GET_CAPABILITY_COMPANY_DOMAINS: (capabilityId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/business-architecture/capabilities/${capabilityId}/company-domains`,
    GET_EBCM_USERS: `${ARCHITECTURE_API_URL}/arch-api/v1/business-architecture/ebcm-users`,
    POST_BA_CHANGE_REQUEST: `${ARCHITECTURE_API_URL}/arch-api/v1/business-architecture/change-request-email`,
    POST_ECJ_CHANGE_REQUEST: `${ARCHITECTURE_API_URL}/arch-api/v1/business-architecture/ecj-change-request-email`,
    POST_PROPOSED_JOURNEY: `${ARCHITECTURE_API_URL}/arch-api/v1/business-architecture/custom-ecj`,

    // ptb
    GET_PTB_BVB: `${ARCHITECTURE_API_URL}/arch-api/v1/ptb/bvbs`,
    DELETE_API_DATA: (metadataID: string, domainID: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/${domainID}/apis/${metadataID}`,
    DELETE_API_ENDPOINT_DATA: (
        metadataID: string,
        domainID: string,
        apiID: string
    ) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/${domainID}/apis/${apiID}/operations/${metadataID}`,
    RESTORE_API_DATA: (metadataID: string, domainID: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/${domainID}/apis/${metadataID}/restore`,
    RESTORE_API_ENDPOINT_DATA: (
        metadataID: string,
        domainID: string,
        apiID: string
    ) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/${domainID}/apis/${apiID}/operations/${metadataID}/restore`,
    REVERT_API_ENDPOINT_DATA: (
        operationID: string,
        domainID: string,
        apiID: string
    ) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/${domainID}/apis/${apiID}/operations/${operationID}/revert`,
    OPERATION_SCORE_DATA: (domainID: string, operationID: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/${domainID}/apis/operations/${operationID}/api_score`,

    GET_AGENT: `${ARCHITECTURE_INTELLIGENCE_API_URL}/app/v1/agent`,
    GET_AGENT_STREAM: `${ARCHITECTURE_INTELLIGENCE_API_URL}/app/v1/agent/stream`,
    GET_ALL_DOMAIN_APIS: `${ARCHITECTURE_API_URL}/arch-api/v1/domainApi/`,
    POST_INITIATIVE_CONSUMER_API: (playbookId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks/${playbookId}/consumer-api`,
    GET_EXPLORER_API: `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks/explorer/search`,
    GET_INITIATIVE_CONSUMER_API: (playbookId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks/${playbookId}/consumer-api`,
    PUT_INITIATIVE_CONSUMER_API: (playbookId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks/${playbookId}/consumer-api`,
    DELETE_INITIATIVE_CONSUMER_API: (playbookId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks/${playbookId}/consumer-api`,
    GET_EXISTING_TYPE_A_API: (
        playbookId: string,
        explorerApiId: string,
        method: string
    ) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks/${playbookId}/consumer-api/check-existing?explorerApiId=${explorerApiId}&method=${method}`,
    GET_INITIATIVE_USER_ROLE: (playbookId: string, emailId: string) =>
        `${ARCHITECTURE_API_URL}/arch-api/v1/playbooks/${playbookId}/user-roles?email=${emailId}`,
    // architecture-metamodel service (NestJS, global prefix `api`, URI version
    // v1). List endpoints return only id + name; the grids enrich rows from the
    // per-dataset get-by-ids routes, which take comma-separated ids (capped at
    // 5 per request) on the same path as the single-record get.

    // metamodel — initiatives
    METAMODEL_LIST_INITIATIVES: metamodel('initiatives'),
    METAMODEL_GET_INITIATIVE: (id: string) => metamodel(`initiatives/${id}`),
    METAMODEL_GET_INITIATIVES_BY_IDS: (ids: string[]) =>
        metamodel(`initiatives/${ids.join(',')}`),
    METAMODEL_UPDATE_INITIATIVE: (id: string) => metamodel(`initiatives/${id}`),
    METAMODEL_LIST_INITIATIVE_ATTESTATIONS: (initiativeId: string) =>
        metamodel(`initiatives/${initiativeId}/attestations`),
    METAMODEL_GET_INITIATIVE_ATTESTATION: (
        initiativeId: string,
        attestationId: string
    ) => metamodel(`initiatives/${initiativeId}/attestations/${attestationId}`),
    METAMODEL_CREATE_INITIATIVE_ATTESTATION: (initiativeId: string) =>
        metamodel(`initiatives/${initiativeId}/attestations`),
    METAMODEL_GET_INITIATIVE_AUDIT_HISTORY: (initiativeId: string) =>
        metamodel(`initiatives/${initiativeId}/audit-history`),

    // metamodel — staged (non-authoritative) reads. Same DTO as the
    // authoritative routes with recommended values merged in; only read for
    // records the user has never edited (`lastUserUpdateTs === null`).
    METAMODEL_GET_STAGED_INITIATIVE: (id: string) =>
        metamodel(`staged/initiatives/${id}`),

    // metamodel — applications
    METAMODEL_LIST_APPLICATIONS: metamodel('applications'),
    METAMODEL_GET_APPLICATION: (id: string) => metamodel(`applications/${id}`),
    METAMODEL_GET_APPLICATIONS_BY_IDS: (ids: string[]) =>
        metamodel(`applications/${ids.join(',')}`),
    METAMODEL_UPDATE_APPLICATION: (id: string) =>
        metamodel(`applications/${id}`),
    METAMODEL_LIST_APPLICATION_ATTESTATIONS: (applicationId: string) =>
        metamodel(`applications/${applicationId}/attestations`),
    METAMODEL_GET_APPLICATION_ATTESTATION: (
        applicationId: string,
        attestationId: string
    ) =>
        metamodel(
            `applications/${applicationId}/attestations/${attestationId}`
        ),
    METAMODEL_CREATE_APPLICATION_ATTESTATION: (applicationId: string) =>
        metamodel(`applications/${applicationId}/attestations`),
    METAMODEL_GET_APPLICATION_AUDIT_HISTORY: (applicationId: string) =>
        metamodel(`applications/${applicationId}/audit-history`),
    METAMODEL_GET_STAGED_APPLICATION: (id: string) =>
        metamodel(`staged/applications/${id}`),

    // metamodel — ADRs / BvBs
    METAMODEL_LIST_ADRS: metamodel('adrs'),
    METAMODEL_GET_ADRS_BY_IDS: (ids: string[]) =>
        metamodel(`adrs/${ids.join(',')}`),
    METAMODEL_LIST_BVBS: metamodel('bvbs'),
    METAMODEL_GET_BVBS_BY_IDS: (ids: string[]) =>
        metamodel(`bvbs/${ids.join(',')}`),

    // metamodel — foundational technologies / technical capabilities
    METAMODEL_LIST_FOUNDATIONAL_TECHNOLOGIES: metamodel(
        'foundational-technologies'
    ),
    METAMODEL_GET_FOUNDATIONAL_TECHNOLOGIES_BY_IDS: (ids: string[]) =>
        metamodel(`foundational-technologies/${ids.join(',')}`),
    METAMODEL_LIST_TECHNICAL_CAPABILITIES: metamodel('technical-capabilities'),
    METAMODEL_GET_TECHNICAL_CAPABILITIES_BY_IDS: (ids: string[]) =>
        metamodel(`technical-capabilities/${ids.join(',')}`),

    // metamodel — business capabilities / company domains
    METAMODEL_GET_BUSINESS_CAPABILITIES_BY_IDS: (ids: string[]) =>
        metamodel(`business-capabilities/${ids.join(',')}`),
    METAMODEL_LIST_COMPANY_DOMAINS: metamodel('company-domains'),
    METAMODEL_GET_COMPANY_DOMAINS_BY_IDS: (ids: string[]) =>
        metamodel(`company-domains/${ids.join(',')}`),

    // arch-api — playbook types
    GET_PLAYBOOK_TYPES_GENAI: `${ARCHITECTURE_API_URL}/arch-api/v5/playbooks/types?category=genai`
}
