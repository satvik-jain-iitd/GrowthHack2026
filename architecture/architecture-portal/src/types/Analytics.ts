export type AdobeAnalytics = {
    pageViews?: number
    uniqueVisitors?: number
}

export type GitHubAnalytics = {
    contributors?: string[]
    numDistinctContributors?: number
    numCommits?: number
    lastCommitDate?: string
}

export type PlaybookAnalytics = AdobeAnalytics &
    GitHubAnalytics & {
        playbook_id: string
        cachedAt?: number
    }

export type Analytics = {
    playbooks: PlaybookAnalytics[]
    overall: AdobeAnalytics & GitHubAnalytics
    cachedAt?: number
}
