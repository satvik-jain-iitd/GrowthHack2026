/* istanbul ignore file */
const HEIGHT = '220px'
const HEADER_OBJECT = {
    metric1: [
        {
            title: 'Count of ECMI Applications Mapped',
            key: 'mappedAppCount',
            tooltip: 'Number of ECMI Applications mapped to Company Domain',
            countTooltip: []
        },
        {
            title: 'Total Count of ECMI Applications',
            key: 'appCount',
            tooltip: 'Total number of applications that are linked to ECMI',
            countTooltip: []
        },
        {
            title: '% of ECMI Applications Mapped',
            key: 'percentage',
            tooltip:
                'Percentage of the ECMI Applciations Mapped to Company domain',
            countTooltip: []
        }
    ],
    metric2: [
        {
            title: 'ARB Approved',
            key: ['darb_apis', 'darb_ops'],
            countTooltip: [
                'Number of APIs that have ARB Approved operations',
                'Number of operations that are ARB Approved'
            ],
            tooltip:
                'Sum of APIs/operations that are ARB Approved, EARB Approved, Design Certified and Production Certified',
            color: '#F0D041'
        },
        {
            title: 'EARB Approved',
            key: ['earb_apis', 'earb_ops'],
            countTooltip: [
                'Number of APIs that have EARB Approved operations',
                'Number of operations that are EARB Approved'
            ],
            tooltip:
                'Sum of APIs/operations that are EARB Approved, Design Certified and Production Certified',
            color: '#F3780D'
        },
        {
            title: 'Onboarded to Catalog',
            key: ['onboarded_apis', 'onboarded_ops'],
            countTooltip: [
                'Number of APIs that have been approved and onboarded to the API Catalog',
                'Number of operations that have been approved and onboarded to the API Catalog'
            ],
            tooltip:
                'Number of APIs that have been approved and onboarded to the API Catalog',
            color: '#975DFF'
        },
        {
            title: 'Design Certified',
            key: ['design_apis', 'design_ops'],
            countTooltip: [
                'Number of APIs that have Design Certified Operations',
                'Number of operations that are Design Certified'
            ],
            tooltip:
                'Sum of APIs/operations that are Design Certified and Production Certified',
            color: '#006FCF'
        },
        {
            title: 'Prod Certified',
            key: ['prod_apis', 'prod_ops'],
            countTooltip: [
                'Number of APIs that have Prod Certified Operations',
                'Number of operations that are Prod Certified'
            ],
            tooltip: 'Number of APIs/operations that are Prod Certified',
            color: '#43A34C'
        }
    ]
}

const CHART_COLORS = [
    '#006FCF',
    '#61C5FF',
    '#85E9FF',
    '#3AABA5',
    '#59CDC7',
    '#7AF1EB',
    '#F3780D',
    '#F9A94E',
    '#FFD48F',
    '#EE71A5',
    '#FF5733',
    '#FF8D72',
    '#FFC1A1',
    '#A569BD',
    '#BB8FCE',
    '#D2B4DE',
    '#28B463',
    '#58D68D',
    '#82E0AA',
    '#F4D03F',
    '#F7DC6F',
    '#F9E79F',
    '#5DADE2',
    '#85C1E9',
    '#AED6F1'
]

const GROUPBY_METRIC1 = [
    {
        label: 'Applications Mapped to Company Domain',
        key: 'numerator'
    },
    {
        label: 'Total Applications',
        key: 'denominator'
    },
    {
        label: 'Percentage',
        key: 'percentage'
    }
]

const METRIC1_COLUMNS = {
    default: [
        {
            label: 'ECMI',
            key: 'ecmi_name'
        },
        {
            label: 'Application Id',
            key: 'application_id'
        },
        {
            label: 'Application Name',
            key: 'application_nm'
        },
        {
            label: 'Company Domain',
            key: 'domain_nm'
        },
        {
            label: 'Has Domain',
            key: 'has_domain'
        },
        {
            label: 'Application Director',
            key: 'app_dir',
            type: 'user',
            emailKey: 'app_dir_email'
        },
        {
            label: 'Application Owner Business Director',
            key: 'app_own_bus_dir',
            type: 'user',
            emailKey: 'app_own_bus_dir_email'
        },
        {
            label: 'Application Owner Business VP',
            key: 'app_own_bus_vp',
            type: 'user',
            emailKey: 'app_own_bus_vp_email'
        },
        {
            label: 'Application VP Level 1',
            key: 'app_vp_lv1',
            type: 'user',
            emailKey: 'app_vp_lv1_email'
        },
        {
            label: 'Owner SVP',
            key: 'app_svp',
            type: 'user',
            emailKey: 'app_svp_email'
        },
        {
            label: 'Unit CIO',
            key: 'unitcio',
            type: 'user'
        },
        {
            label: 'Application VP Level 2',
            key: 'app_vp_lv2',
            type: 'user',
            emailKey: 'app_vp_lv2_email'
        },
        {
            label: 'Business Unit',
            key: 'businessunit'
        }
    ],
    grouped: {
        ecmi: [
            {
                label: 'ECMI',
                key: 'ecmi'
            },
            ...GROUPBY_METRIC1
        ],
        ownerSVP: [
            {
                label: 'Tech Owner VP',
                key: 'ownersvp',
                type: 'user',
                emailKey: 'ownersvp_email'
            },
            ...GROUPBY_METRIC1
        ],
        unitCIO: [
            {
                label: 'Unit CIO',
                key: 'unitcio',
                type: 'user',
                emailKey: 'unitcio_email'
            },
            ...GROUPBY_METRIC1
        ]
    }
}
export const SCORE_COLOR_MAP = {
    excellent: '#38A169',
    good: '#68D391',
    poor: '#E3660D',
    fair: '#F3780D',
    critical: '#C53030',
    '--': '#A0AEC0'
}
const getScoreColor = (score: number) => {
    if (score >= 85) return SCORE_COLOR_MAP.excellent
    if (score >= 75) return SCORE_COLOR_MAP.good
    if (score >= 50) return SCORE_COLOR_MAP.fair
    if (score >= 0) return SCORE_COLOR_MAP.poor
    return SCORE_COLOR_MAP['--']
}

const getMetricsApiTableColumns = (view: string[]) => {
    if (view.length === 1 && view[0] === 'apis') {
        return [
            {
                label: 'Proposed APIs',
                key: 'proposedTypeACumSum'
            },
            {
                label: 'ARB Approved',
                key: 'darbTypeACumSum'
            },
            {
                label: 'EARB Certified',
                key: 'earbTypeACumSum'
            },
            {
                label: 'Design Certified',
                key: 'designTypeACumSum'
            },
            {
                label: 'Prod Certified',
                key: 'prod_certified_apis'
            }
        ]
    } else if (view.length === 1 && view[0] === 'operations') {
        return [
            {
                label: 'Proposed Operations',
                key: 'opsProposed'
            },
            {
                label: 'ARB Approved Operations',
                key: 'opsDarb'
            },
            {
                label: 'EARB Approved Operations',
                key: 'opsEarb'
            },
            {
                label: 'Design Certified Operations',
                key: 'opsDesign'
            },
            {
                label: 'Prod Certified Operations',
                key: 'opsProd'
            }
        ]
    }

    return GROUPBY_METRIC2
}

const GROUPBY_METRIC2 = [
    {
        label: 'Proposed',
        child: [
            {
                label: 'API Count',
                key: 'proposedTypeACumSum'
            },
            {
                label: 'Operations Count',
                key: 'opsProposed'
            }
        ],
        colSpan: 2
    },
    {
        label: 'ARB Approved',
        child: [
            {
                label: 'API Count',
                key: 'darbTypeACumSum'
            },
            {
                label: 'Operations Count',
                key: 'opsDarb'
            }
        ],
        colSpan: 2
    },
    {
        label: 'EARB Approved APIs',
        child: [
            {
                label: 'API Count',
                key: 'earbTypeACumSum'
            },
            {
                label: 'Operations Count',
                key: 'opsEarb'
            }
        ],
        colSpan: 2
    },
    {
        label: 'Design Certified',
        key: 'designTypeACumSum',
        child: [
            {
                label: 'API Count',
                key: 'designTypeACumSum'
            },
            {
                label: 'Operations Count',
                key: 'opsDesign'
            }
        ],
        colSpan: 2
    },
    {
        label: 'Prod Certified',
        key: 'prod_certified_apis',
        child: [
            {
                label: 'API Count',
                key: 'prod_certified_apis'
            },
            {
                label: 'Operations Count',
                key: 'opsProd'
            }
        ],
        colSpan: 2
    }
]

const METRIC2_COLUMNS = {
    default: [
        {
            label: 'Operation',
            key: 'api_endpoint_opr_ds'
        },
        {
            label: 'Resource',
            key: 'api_resource'
        },
        {
            label: 'API Name',
            key: 'api_nm'
        },
        {
            label: 'Operation Type',
            key: 'api_endpoint_type_nm',
            type: 'apiType',
            // ToDo: Enable the filter when Type B is confirmed to be not needed
            isFilterable: false,
            filterType: 'type',
            filterableValues: ['viewAll', 'typeA', 'typeB']
        },
        {
            label: 'API Description',
            key: 'api_ds'
        },
        {
            label: 'Company Domain',
            key: 'prim_company_domain_name'
        }
    ],
    grouped: (view: string[], groupBy: string) => {
        if (groupBy === 'domain') {
            return [
                {
                    label: 'Company Domains',
                    key: 'domain',
                    rowSpan: 2
                },
                ...getMetricsApiTableColumns(view)
            ]
        } else if (groupBy === 'techOwner') {
            return [
                {
                    label: 'Tech Owner VP',
                    key: 'techowner',
                    type: 'user',
                    emailKey: 'techowner_email',
                    rowSpan: 2
                },
                ...getMetricsApiTableColumns(view)
            ]
        } else if (groupBy === 'unitCIO') {
            return [
                {
                    label: 'Unit CIO',
                    key: 'unitcio',
                    type: 'user',
                    emailKey: 'unit_cio_email',
                    rowSpan: 2
                },
                ...getMetricsApiTableColumns(view)
            ]
        }
    }
}

// widths are explicit so the fixed-layout table keeps its columns still
// while paging and sorting swap the content underneath
const METRIC3_COLUMNS = [
    {
        label: 'ETP / ECMI',
        key: 'initiative_name',
        type: 'name',
        width: '15%'
    },
    {
        label: 'Unit CIO',
        key: 'unit_cio',
        type: 'avatar',
        emailKey: 'unit_cio_email',
        width: '12%'
    },
    {
        label: 'Principal Architect',
        key: 'principal_architect',
        type: 'avatar',
        emailKey: 'principal_architect_email',
        width: '12%'
    },
    {
        label: 'Type',
        key: 'initiative_type',
        type: 'badges',
        sortable: false,
        width: '6%'
    },
    {
        label: 'Years',
        key: 'planning_cycle',
        type: 'years',
        width: '8%'
    },
    {
        label: 'Identified APIs',
        key: 'identified_apis',
        width: '9%'
    },
    {
        label: 'EARB Approved Cross-Domain APIs',
        key: 'earb_approved_pct',
        type: 'progress',
        numeratorKey: 'earb_approved_type_ab',
        denominatorKey: 'identified_apis',
        width: '13%'
    },
    {
        label: 'Production Certified Cross-Domain APIs',
        key: 'prod_certified_pct',
        type: 'progress',
        numeratorKey: 'prod_certified_type_ab',
        denominatorKey: 'identified_apis',
        width: '13%'
    },
    {
        label: 'Playbook Onboarded',
        key: 'playbook_onboarded',
        type: 'boolean-badge',
        width: '12%'
    }
]

const METRIC3_UNIT_CIO_COLUMNS = [
    {
        label: 'Unit CIO',
        key: 'unit_cio',
        type: 'avatar',
        emailKey: 'unit_cio_email',
        width: '22%'
    },
    {
        label: 'ETPs',
        key: 'etp_count',
        width: '8%'
    },
    {
        label: 'ECMIs',
        key: 'ecmi_count',
        width: '8%'
    },
    {
        label: 'Playbooks Onboarded',
        key: 'playbook_onboarded_count',
        type: 'fraction',
        denominatorKey: 'initiative_count',
        width: '14%'
    },
    {
        label: 'Identified APIs',
        key: 'identified_apis',
        width: '12%'
    },
    {
        label: 'EARB Approved Cross-Domain APIs',
        key: 'earb_approved_pct',
        type: 'progress',
        numeratorKey: 'earb_approved_type_ab',
        denominatorKey: 'identified_apis'
    },
    {
        label: 'Production Certified Cross-Domain APIs',
        key: 'prod_certified_pct',
        type: 'progress',
        numeratorKey: 'prod_certified_type_ab',
        denominatorKey: 'identified_apis'
    }
]

const PROGRESS_THRESHOLD_COLORS = [
    { max: 20, color: SCORE_COLOR_MAP.critical },
    { max: 40, color: SCORE_COLOR_MAP.poor },
    { max: 60, color: SCORE_COLOR_MAP.fair },
    { max: 80, color: SCORE_COLOR_MAP.good },
    { max: 100, color: SCORE_COLOR_MAP.excellent }
]

// flags a row that has identified APIs but no progress at all against them
const PROGRESS_ZERO_BORDER_COLOR = '#E53E3E'

// metric3 is absent here on purpose — its group-by lives in CrossDomainFilterBar,
// because MetricsActionBar is not rendered for that tab
const RADIO_GROUPBY = {
    metric1: [
        { label: 'ECMI', value: 'ecmi' },
        { label: 'Unit CIO', value: 'unitCIO' },
        { label: 'Tech Owner VP', value: 'ownerSVP' }
    ],
    metric2: [
        { label: 'Company Domain', value: 'domain' },
        { label: 'Unit CIO', value: 'unitCIO' },
        { label: 'Tech Owner VP', value: 'techOwner' }
    ]
}

const CROSS_DOMAIN_TYPE_FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'ECMI', value: 'ecmi' },
    { label: 'ETP', value: 'etp' }
]

const CROSS_DOMAIN_GROUP_BY = [
    { label: 'None', value: '' },
    { label: 'Unit CIO', value: 'unitCIO' }
]

export {
    HEIGHT,
    HEADER_OBJECT,
    CHART_COLORS,
    CROSS_DOMAIN_GROUP_BY,
    CROSS_DOMAIN_TYPE_FILTERS,
    METRIC1_COLUMNS,
    METRIC2_COLUMNS,
    METRIC3_COLUMNS,
    METRIC3_UNIT_CIO_COLUMNS,
    PROGRESS_THRESHOLD_COLORS,
    PROGRESS_ZERO_BORDER_COLOR,
    RADIO_GROUPBY,
    getMetricsApiTableColumns,
    getScoreColor
}
