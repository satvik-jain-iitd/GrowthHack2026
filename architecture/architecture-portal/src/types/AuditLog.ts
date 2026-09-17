export interface AuditLogEntry {
    action: 'CREATE' | 'UPDATE' | 'DELETE'
    details: string
    changedBy: string
    changedAt: string
}
