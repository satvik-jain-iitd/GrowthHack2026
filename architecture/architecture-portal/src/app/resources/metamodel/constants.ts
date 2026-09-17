/** Metamodel datasets that have a hub card and a browsable route. */
export type MetamodelDataset =
    | 'initiatives'
    | 'applications'
    | 'adrs'
    | 'bvbs'
    | 'company-domains'
    | 'technical-capabilities'

/**
 * Datasets currently exposed to users. Disabled datasets are hidden from the
 * hub and their routes return 404; re-enable one by adding it back here.
 */
export const ENABLED_METAMODEL_DATASETS: readonly MetamodelDataset[] = [
    'initiatives'
]

export function isMetamodelDatasetEnabled(dataset: MetamodelDataset): boolean {
    return ENABLED_METAMODEL_DATASETS.includes(dataset)
}
