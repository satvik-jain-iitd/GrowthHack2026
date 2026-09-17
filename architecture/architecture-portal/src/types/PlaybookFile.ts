import { NavLink } from '@/types/NavLink'
import { Workproduct } from '@/types/Workproduct'
import { Domain } from '@/app/company-domains/types'
import type { SourceHost } from '@/constants'

interface Metadata {
    sha?: string
}

export interface PlaybookFile {
    fl_id: string
    playbook_id: string
    fl_path_tx: string
    repst_nm?: string
    fl_mtda_da?: Metadata
    tag_da?: object[]
    artifact_id?: string
    artifact_root_in?: boolean
    del_ts?: string
    del_in?: boolean
    domain_details?: Domain
    playbook_type_id?: string
    source_host?: SourceHost
    sidebar_details?: {
        playbook_type_id: string
        sidebar_label: string
        url_slug_tx?: string
    }
    breadcrumbs?: NavLink[]
    previous?: NavLink
    next?: NavLink
    workproduct?: Workproduct
    propogatedArtifacts?: Array<{
        playbook_artifact_id: string
        artifact_nm: string
        lvl_no: string
        keyword_da: string[]
        propogate_artifact_da: string[]
        tag_ctgy_da: string[]
        add_da: unknown
        creat_ts: string
        lst_updt_ts: string
    }>
}
