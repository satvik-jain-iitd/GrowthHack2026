/* istanbul ignore file */
import { LogLevel } from '@/types/LogLevel'
import { logs, Logger as OTEL_LOGGER } from '@opentelemetry/api-logs'

export class Logger {
    private static OTEL_LOGGER?: OTEL_LOGGER
    private static LOG_LEVEL: LogLevel = process.env.LOG_LEVEL
        ? (process.env.LOG_LEVEL as LogLevel)
        : 'INFO'
    private static SEVERITY_MAP: Record<LogLevel, number> = {
        DEBUG: 5,
        INFO: 9,
        WARN: 13,
        ERROR: 17
    }

    private static emitLogger(
        severity: LogLevel,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        attributes?: Record<string, any>
    ) {
        try {
            if (!Logger.OTEL_LOGGER)
                Logger.OTEL_LOGGER = logs
                    .getLoggerProvider()
                    .getLogger('architecture1')

            Logger.OTEL_LOGGER.emit({
                severityText: severity,
                severityNumber: Logger.SEVERITY_MAP[severity],
                timestamp: Date.now(),
                body:
                    message instanceof Error
                        ? message.stack
                        : typeof message === 'string'
                          ? message
                          : JSON.stringify(message),
                attributes: {
                    ...attributes
                }
            })
        } catch (error) {
            console.error(error)
            console[severity === 'ERROR' ? 'error' : 'log'](
                `[${severity}]`,
                message,
                attributes
            )
        }
    }

    private static isEnabled(severity: LogLevel) {
        return (
            Logger.SEVERITY_MAP[Logger.LOG_LEVEL] <=
            Logger.SEVERITY_MAP[severity]
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static info(message: any, attributes?: Record<string, any>) {
        if (Logger.isEnabled('INFO'))
            Logger.emitLogger('INFO', message, attributes)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static error(message: any, attributes?: Record<string, any>) {
        if (Logger.isEnabled('ERROR'))
            Logger.emitLogger('ERROR', message, attributes)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static warn(message: any, attributes?: Record<string, any>) {
        if (Logger.isEnabled('WARN'))
            Logger.emitLogger('WARN', message, attributes)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static debug(message: () => any, attributes?: Record<string, any>) {
        if (Logger.isEnabled('DEBUG')) {
            const debugMessage = message()
            console.log('DEBUG:', debugMessage)
            Logger.emitLogger('DEBUG', debugMessage, attributes)
        }
    }
}
