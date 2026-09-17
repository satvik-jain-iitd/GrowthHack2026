import { defineConfig, globalIgnores } from 'eslint/config'
import nextBase from 'eslint-config-next'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import enforceNoPrefetchLink from 'eslint-plugin-enforce-no-prefetch-link'

const eslintConfig = defineConfig([
    ...nextBase,
    ...nextCoreWebVitals,
    ...nextTypescript,
    {
        plugins: {
            'enforce-no-prefetch-link': enforceNoPrefetchLink
        },
        rules: {
            'enforce-no-prefetch-link/enforce-no-prefetch-link': 'error',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react-hooks/set-state-in-effect': 'warn',
            'react-hooks/refs': 'warn',
            'react/jsx-key': 'warn',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_'
                }
            ],
            'react/no-danger': 'error'
        },
        settings: {
            react: {
                version: 'detect'
            }
        }
    },
    globalIgnores([
        'node_modules/**',
        '.next/**',
        'out/**',
        'build/**',
        'coverage/**',
        'next-env.d.ts'
    ])
])

export default eslintConfig
