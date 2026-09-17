export const mockMarkdown = `# What is Architecture Portal?
It is an internal platform.

# How do I onboard?
Open an ADR and follow the onboarding flow.
`

export const mockMarkdownNoHeadings = `This file has no FAQ headings.
Only body content.
`

export const mockGithubListingResponse = [
    { type: 'file', name: '01-general.md' },
    { type: 'file', name: 'README.txt' },
    { type: 'dir', name: 'nested' }
]

export const mockGithubFileResponse = {
    content: Buffer.from(
        '# What is Architecture Portal?\nIt is an internal platform.\n'
    ).toString('base64')
}
