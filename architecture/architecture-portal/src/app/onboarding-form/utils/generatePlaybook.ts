/* istanbul ignore file */
import {
    BUILD_VS_BUY_PARENT_PLAYBOOK_ID,
    PLAYBOOK_TYPE_IDS,
    SourceHost
} from '@/constants'
import {
    CompanySubdomainFormValues,
    FoundationalTechnologyFormValues,
    InitiativeFormValues,
    BuildBuyFormValues
} from '@/app/onboarding-form/types'
import { ENVIRONMENT } from '@/constants'
import { generateDocsRoot } from './generateDocsRoot'
import { stringToArray } from './stringToArray'
import dayjs from 'dayjs'

export function generateInitiativePlaybook(
    values: InitiativeFormValues,
    adsId: string,
    activeFormDisplayText: string,
    sourceHost: SourceHost
) {
    const docsRoot = generateDocsRoot(
        values.docsRoot,
        PLAYBOOK_TYPE_IDS.INITIATIVE
    )
        .trim()
        .slice(1, -13)
    return {
        playbook_env: ENVIRONMENT,
        playbook_type_id: PLAYBOOK_TYPE_IDS.INITIATIVE,
        playbook_type_nm: activeFormDisplayText,
        playbook_nm: values.title.trim(),
        req_id: adsId,
        repst_nm: values.repoName.trim(),
        doc_fldr_path_tx: docsRoot !== '' ? docsRoot : null,
        ctc_email_ad_tx: values.contactInfo,
        ecmi_prod_in: Boolean(values.ecmi),
        parnt_playbook_id: values.initiativeCategory
            ? values.initiativeCategory
            : null,
        playbook_dply_in: true,
        req_aprv_sta_nm: 'PENDING',
        creat_user_id: adsId,
        portal_url_slug_tx: '',
        lst_suc_comt_sha_tx: '',
        etp_id: values.isEtp && values.etp ? values.etp : null,
        playbook_mtda_id: null,
        disp_sort_ord: null,
        amex_way_url_tx: null,
        cntrl_id: [],
        prim_pfrm_nm: [],
        impct_pfrm_nm: [],
        cntrb_user_id: [],
        add_da: {
            source_host: sourceHost,
            businessUnit: values.businessUnit,
            unitCIO: values.unitCIO,
            engLead: values.engLead ? values.engLead : [],
            eaLead: values.eaLead ? values.eaLead : [],
            years: stringToArray(values.years, true),
            ...((values.initiativeFrameworks?.length ?? 0) > 0 && {
                initiativeFrameworks: values.initiativeFrameworks
            })
        }
    }
}

export function generateFoundationalTechnologyPlaybook(
    values: FoundationalTechnologyFormValues,
    adsId: string,
    activeFormDisplayText: string,
    ftCategoryName: string,
    sourceHost: SourceHost
) {
    const docsRoot = generateDocsRoot(
        values.docsRoot,
        PLAYBOOK_TYPE_IDS.FOUNDATIONAL_TECHNOLOGY
    )
        .trim()
        .slice(1, -13)
    return {
        playbook_env: ENVIRONMENT,
        playbook_type_id: PLAYBOOK_TYPE_IDS.FOUNDATIONAL_TECHNOLOGY,
        playbook_type_nm: activeFormDisplayText,
        playbook_nm: values.title.trim(),
        req_id: adsId,
        repst_nm: values.repoName.trim(),
        doc_fldr_path_tx: docsRoot !== '' ? docsRoot : null,
        ctgy_nm: ftCategoryName,
        ctc_email_ad_tx: values.contactInfo,
        ecmi_prod_in: false,
        parnt_playbook_id: values.ftCategory,
        playbook_dply_in: true,
        req_aprv_sta_nm: 'PENDING',
        creat_user_id: adsId,
        portal_url_slug_tx: '',
        lst_suc_comt_sha_tx: '',
        etp_id: null,
        playbook_mtda_id: null,
        disp_sort_ord: null,
        amex_way_url_tx: null,
        cntrl_id: [],
        prim_pfrm_nm: [],
        impct_pfrm_nm: [],
        cntrb_user_id: [],
        add_da: {
            source_host: sourceHost,
            businessUnit: values.businessUnit,
            unitCIO: values.unitCIO,
            engLead: values.engLead ? values.engLead : [],
            eaLead: values.eaLead ? values.eaLead : []
        }
    }
}

export function generateCompanySubdomainPlaybook(
    values: CompanySubdomainFormValues,
    adsId: string,
    activeFormDisplayText: string,
    companyDomainName: string,
    sourceHost: SourceHost
) {
    const docsRoot = generateDocsRoot(
        values.docsRoot,
        PLAYBOOK_TYPE_IDS.COMPANY_SUBDOMAIN
    )
        .trim()
        .slice(1, -13)
    return {
        playbook_env: ENVIRONMENT,
        playbook_type_id: PLAYBOOK_TYPE_IDS.COMPANY_SUBDOMAIN,
        playbook_type_nm: activeFormDisplayText,
        playbook_nm: values.title.trim(),
        req_id: adsId,
        repst_nm: values.repoName.trim(),
        doc_fldr_path_tx: docsRoot !== '' ? docsRoot : null,
        ctgy_nm: companyDomainName,
        ctc_email_ad_tx: values.contactInfo,
        ecmi_prod_in: false,
        parnt_playbook_id: values.companyDomain,
        playbook_dply_in: true,
        req_aprv_sta_nm: 'PENDING',
        creat_user_id: adsId,
        portal_url_slug_tx: '',
        lst_suc_comt_sha_tx: '',
        etp_id: null,
        playbook_mtda_id: null,
        disp_sort_ord: null,
        amex_way_url_tx: null,
        cntrl_id: [],
        prim_pfrm_nm: [],
        impct_pfrm_nm: [],
        cntrb_user_id: [],
        add_da: {
            source_host: sourceHost,
            businessUnit: values.businessUnit,
            techOwner: values.techOwner,
            description: values.description,
            shortDescription: values.shortDescription
        }
    }
}

export function generateBuildBuyPlaybook(
    values: BuildBuyFormValues,
    adsId: string,
    email: string,
    activeFormDisplayText: string,
    sourceHost: SourceHost
) {
    const docsRoot =
        values.isExistingDocs === 'true'
            ? generateDocsRoot(values.docsRoot, PLAYBOOK_TYPE_IDS.BUILD_VS_BUY)
                  .trim()
                  .slice(1, -11)
            : ''
    return {
        playbook_env: ENVIRONMENT,
        playbook_type_id: PLAYBOOK_TYPE_IDS.BUILD_VS_BUY,
        playbook_type_nm: activeFormDisplayText,
        playbook_nm: values.title.trim(),
        req_id: adsId,
        repst_nm:
            values.isExistingDocs === 'true'
                ? values.repoName
                    ? values.repoName.trim()
                    : ''
                : '',
        doc_fldr_path_tx: docsRoot !== '' ? docsRoot : null,
        ctgy_nm: null,
        ctc_email_ad_tx: [email],
        ecmi_prod_in: false,
        parnt_playbook_id: BUILD_VS_BUY_PARENT_PLAYBOOK_ID,
        playbook_dply_in: true,
        req_aprv_sta_nm: 'PENDING',
        creat_user_id: adsId,
        portal_url_slug_tx: '',
        lst_suc_comt_sha_tx: '',
        etp_id: null,
        playbook_mtda_id: null,
        disp_sort_ord: null,
        amex_way_url_tx: null,
        cntrl_id: [],
        prim_pfrm_nm: values.prim_pfrm_nm,
        impct_pfrm_nm: [],
        cntrb_user_id: [],
        add_da: {
            source_host: sourceHost,
            title: values.title,
            requester: values.requester,
            deciders: values.deciders,
            reviewers: values.reviewers,
            targetedEndDate: dayjs(values.targetedEndDate).format('MM/DD/YYYY'),
            createdAt: dayjs(new Date()).format('MM/DD/YYYY'),
            owner: values.owners,
            stakeHolders: values.stakeholders,
            eaArchitect: values.eaArchitects,
            etpImpacting: values.etpImpacting,
            overallRisk: values.overallRisk,
            estimatedCost: values.estimatedCost,
            description: values.description,
            bvbCriteriaMet: false
        }
    }
}
