/* istanbul ignore file */
import { EtpTitle, Option } from '@/app/onboarding-form/types'

export function extractEtpSelectOptions(etpOptions: EtpTitle[] | undefined) {
    return [
        ...(etpOptions
            ? etpOptions
                  .map(etp => ({
                      displayText: etp.initiative_title,
                      value: etp.etp_id
                  }))
                  .sort((a, b) => a.displayText.localeCompare(b.displayText))
            : [])
    ]
}

export function extractFrameworkCategorySelectOptions(
    ftCategoryOptions: Option[] | undefined
) {
    return [
        ...(ftCategoryOptions
            ? ftCategoryOptions
                  .filter(category => !category.selected)
                  .map(category => ({
                      ...(category.disabled !== undefined && {
                          disabled: category.disabled
                      }),
                      displayText: category.displayText,
                      value: category.value
                  }))
            : [])
    ]
}

export function extractInitiativeCategorySelectOptions(
    initiativeCategoryOptions: Option[] | undefined
) {
    return [
        ...(initiativeCategoryOptions
            ? initiativeCategoryOptions
                  .filter(category => !category.disabled)
                  .map(category => ({
                      ...(category.selected !== undefined && {
                          selected: category.selected
                      }),
                      displayText: category.displayText,
                      value: category.value
                  }))
                  .sort((a, b) => a.displayText.localeCompare(b.displayText))
            : [])
    ]
}

export function extractBusinessUnitSelectOptions(
    businessUnitOptions: Option[] | undefined
) {
    return [
        ...(businessUnitOptions
            ? businessUnitOptions
                  .filter(category => !category.disabled)
                  .map(category => ({
                      ...(category.selected !== undefined && {
                          selected: category.selected
                      }),
                      displayText: category.displayText,
                      value: category.value
                  }))
                  .sort((a, b) => a.displayText.localeCompare(b.displayText))
            : [])
    ]
}

export function extractRepoTypeOptions(repoTypeOptions: Option[] | undefined) {
    return [
        ...(repoTypeOptions
            ? repoTypeOptions
                  .map(repoType => ({
                      displayText: repoType.displayText,
                      value: repoType.value
                  }))
                  .sort((a, b) => a.displayText.localeCompare(b.displayText))
            : [])
    ]
}

export function extractCompanyDomainSelectOptions(
    companyDomainOptions: Option[] | undefined
) {
    return [
        ...(companyDomainOptions
            ? companyDomainOptions
                  .filter(category => !category.disabled)
                  .map(category => ({
                      ...(category.selected !== undefined && {
                          selected: category.selected
                      }),
                      displayText: category.displayText,
                      value: category.value
                  }))
                  .sort((a, b) => a.displayText.localeCompare(b.displayText))
            : [])
    ]
}
