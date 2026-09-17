export type FormFieldsType = {
    artifact_name?: string
    diagram_type?: string
    diagram_level?: string
    subdomain?: string
    domain_nm?: string
    company_domain_id?: string | number
}

export type EdaaatSelectOption = {
    value: string
    label: string
}

export type DomainOption = {
    value: string | number
    label: string
    domain_nm: string
    company_domain_id: string | number
}

export type ExtractedFile = {
    type: 'image' // default value should be 'image' for all valid ExtractedFile objects
    diagramImage: string | null
    diagramFileName: string | null
    diagramDetailImage: string | null
    diagramDetailFileName: string | null
}

export type LegendItem = {
    label: string
    color: string
}

export type ChartHeaderLine = {
    text: string
    font: string
    color: string
}

export type DownloadDBFootprintChartParams = {
    companyDomainName: string
    chartContainerElement: HTMLDivElement | null
}

export type DownloadDBFootprintTableParams = {
    companyDomainName: string
    tableElement: HTMLElement | null
}

export type DiagramApiPayload = {
    diagram?: {
        base64_encoded_image?: string
        file_name?: string
    }
    diagram_detail?: {
        base64_encoded_image?: string
        file_name?: string
    }
}
export type DiagramApiError = {
    error_code?: string
    error?: string
    error_description?: string
    action?: string
}

export type DiagramFormApiParams = {
    artifact_name: string
    diagram_level: string
    diagram_type: string
    file: File
    subdomains: string[]
    ads_id: string
}

export type JsonPrimitive = string | number | boolean | null

export type JsonValue = JsonPrimitive | JsonObject | JsonValue[]

export type JsonObject = {
    [key: string]: JsonValue
}

export type PreviousArtifactsParams = {
    artifact_name: string
    diagram_level: string
    diagram_type: string
    ads_id: string
    file_name?: string
    status_name?: string
    error_text?: string
    generated_diagrams?: JsonObject
    input_file?: File | JsonObject
}

export type PreviousArtifactsResult = {
    fileBlob: Blob | null
    fileName: string | null
    data: JsonValue | null
}

export type PreviousArtifactDataShape = {
    [key: string]: JsonValue
}

export type PreviousArtifactRow = {
    user_login_id?: string
    diagram_type_nm?: string
    diagram_lvl_nm?: string
    artifact_nm?: string
    inp_fl_nm?: string
    inp_fl_da?: PreviousArtifactDataShape
    [key: string]: JsonValue | undefined
}

export type DiagramPreviewProps = {
    diagramArtifact: ExtractedFile
    isLoading: boolean
    errors?: DiagramApiError[]
    showNotification?: boolean
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>
}

export type DiagramApiResult =
    | ExtractedFile
    | DBFootprintTableData
    | { type: 'error'; errors: DiagramApiError[] }

export type DBFootprintConsolidatedRow = {
    databaseTechnology: string
    databaseVersion: string
    noOfInstancesInProd: number
    noOfInstancesInTest: number
    noOfInstancesInDev: number
}

export type DBFootprintTableData = {
    type: 'db-footprint'
    company_domain_id: string
    company_domain_name: string
    consolidated: DBFootprintConsolidatedRow[]
}

export type DBFootprintTableProps = {
    data: DBFootprintTableData
}

export type DBFootprintResult = {
    type: 'db-footprint'
    company_domain_id: string
    company_domain_name: string
    consolidated: DBFootprintConsolidatedRow[]
}

export type DBFootprintParams = {
    car_id: string | number
    company_domain_id: string
    company_domain_name: string
    env: string
    include_details_per_car_id: boolean
}

export type DBFootprintApiPayload = {
    company_domain_id?: string
    company_domain_name?: string
    consolidated?: DBFootprintConsolidatedRow[]
    diagram?: {
        base64_encoded_image?: string
        file_name?: string
    }
    diagram_detail?: {
        base64_encoded_image?: string
        file_name?: string
    }
}
