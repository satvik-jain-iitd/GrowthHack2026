/* istanbul ignore file */
export interface Feature {
    id: string
    imageSrc: string
    descriptionLabel: string
    descriptionContent: string
}

export interface LevelInfoStackProps {
    features: Feature[]
    expandedItemId: string | null
    setExpandedItemId: (id: string) => void
}
