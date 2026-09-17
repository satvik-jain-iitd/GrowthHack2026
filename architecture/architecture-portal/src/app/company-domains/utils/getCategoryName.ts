/* istanbul ignore file */

import { DomainCategory } from '../types/domains'

export function getCategoryName(category: DomainCategory) {
    if (category.trim() === DomainCategory.ToolsAndUtilities.trim()) {
        return DomainCategory.ToolsAndUtilities
    }

    return category
}
