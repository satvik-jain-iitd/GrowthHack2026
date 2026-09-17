export const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.endsWith('@aexp.com')

export const validateCoEditorEmails = (
    rawValue: string | string[],
    metadata_id: string
) => {
    const value = Array.isArray(rawValue)
        ? rawValue.join(',')
        : typeof rawValue === 'string'
          ? rawValue
          : ''

    const emails = value
        .split(/[\n,;]+/)
        .map(e => e.trim())
        .filter(Boolean)

    const invalidEmails = emails.filter(
        email =>
            !email.toLowerCase().endsWith('@aexp.com') ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    )
    return {
        isValid: !metadata_id ? invalidEmails.length === 0 : true,
        invalidEmails,
        emails
    }
}

export const coeditorTableColumns = [
    {
        name: 'Co-Editor',
        title: 'Co-Editor',
        key: 'coEditor'
    },
    {
        name: 'Email',
        title: 'Email',
        key: 'email'
    },
    {
        name: 'Edit',
        title: 'Edit',
        key: 'edit'
    }
]
