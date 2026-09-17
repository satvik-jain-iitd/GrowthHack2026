export interface Fetcher {
    (q?: string): Promise<string[]>
}
