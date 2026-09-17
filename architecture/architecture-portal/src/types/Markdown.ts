import { SourceHost } from '@/constants'

export type Markdown = {
    md?: string
    toc?: {
        level: number
        text: string
        anchor: string
    }[]
    filePath?: string
    repository?: string
    preview?: boolean
    static?: boolean
    sourceHost?: SourceHost
}
