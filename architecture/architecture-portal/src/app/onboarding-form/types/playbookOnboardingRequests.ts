export interface OnboardingRequestPlaybook {
    playbook_type_nm: string
    playbook_type_id: string
    playbook_nm: string
    req_id: string
    repst_nm: string | null
    doc_fldr_path_tx: string | null
    prim_pfrm_nm: string[]
    impct_pfrm_nm: string[]
    ctc_email_ad_tx: string[]
    cntrb_user_id: string[]
    playbook_dply_in: boolean
    req_aprv_sta_nm: string
    lst_suc_comt_sha_tx: string
    portal_url_slug_tx: string
    cntrl_id: string[]
    etp_id: string | null
    add_da: object
    playbook_mtda_id: string | null
    creat_user_id: string
    ecmi_prod_in: boolean
    parnt_playbook_id: string | null
    amex_way_url_tx: string | null
    disp_sort_ord: number | null
}
