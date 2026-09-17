/* istanbul ignore file */
type EnvKey = 'e0' | 'e1' | 'e2' | 'e3'
export const ENVIRONMENT: EnvKey =
    (process.env.NEXT_PUBLIC_ENV as EnvKey) ?? 'e0'
