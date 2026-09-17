import { formatSkillTitle } from './formatSkillTitle'

describe('formatSkillTitle', () => {
    it('preserves known acronym segments in lowercase skill slugs', () => {
        expect(formatSkillTitle('type-a-api-reuse-check')).toBe(
            'Type A API Reuse Check'
        )
        expect(formatSkillTitle('architecture-mcp')).toBe('Architecture MCP')
    })

    it('keeps standalone a lowercase outside the Type A API phrase', () => {
        expect(formatSkillTitle('build-a-better-mcp')).toBe(
            'Build a Better MCP'
        )
    })

    it('preserves existing uppercase tokens from skill filenames', () => {
        expect(formatSkillTitle('API Strategy')).toBe('API Strategy')
    })

    it('preserves mixed-case tokens from skill filenames', () => {
        expect(formatSkillTitle('OpenAPI Guidelines')).toBe(
            'OpenAPI Guidelines'
        )
        expect(formatSkillTitle('GraphQL Overview')).toBe('GraphQL Overview')
        expect(formatSkillTitle('iOS Support')).toBe('iOS Support')
    })
})
