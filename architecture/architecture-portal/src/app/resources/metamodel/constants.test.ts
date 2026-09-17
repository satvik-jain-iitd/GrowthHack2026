import {
    ENABLED_METAMODEL_DATASETS,
    isMetamodelDatasetEnabled
} from './constants'

describe('isMetamodelDatasetEnabled', () => {
    it('enables initiatives only', () => {
        expect(ENABLED_METAMODEL_DATASETS).toEqual(['initiatives'])
        expect(isMetamodelDatasetEnabled('initiatives')).toBe(true)
    })

    it('disables the other datasets', () => {
        expect(isMetamodelDatasetEnabled('applications')).toBe(false)
        expect(isMetamodelDatasetEnabled('adrs')).toBe(false)
        expect(isMetamodelDatasetEnabled('bvbs')).toBe(false)
        expect(isMetamodelDatasetEnabled('company-domains')).toBe(false)
        expect(isMetamodelDatasetEnabled('technical-capabilities')).toBe(false)
    })
})
