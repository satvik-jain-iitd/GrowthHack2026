/* istanbul ignore file */
import os from 'os'
import { ENVIRONMENT } from '@/constants'
import { NodeSDK } from '@opentelemetry/sdk-node'
import {
    resourceFromAttributes,
    processDetector
} from '@opentelemetry/resources'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'

const sdk = new NodeSDK({
    autoDetectResources: true,
    resourceDetectors: [processDetector],
    resource: resourceFromAttributes({
        'service.name': 'architecture1',
        'service.namespace': 'architecture1',
        'service.instance.id': os.hostname(),
        'service.version': '1.0.0',
        'service.car.id': '600002899',
        'deployment.environment': ENVIRONMENT.toUpperCase()
    }),
    logRecordProcessors: [
        new SimpleLogRecordProcessor(
            new OTLPLogExporter({
                url: `${process.env.ELF_INGEST_URL}/ot/v1/logs`
            })
        )
    ],
    traceExporter: new OTLPTraceExporter({
        url: `${process.env.ELF_INGEST_URL}/ot/v1/traces`
    }),
    instrumentations: getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-http': {
            enabled: true
        },
        '@opentelemetry/instrumentation-redis': {
            enabled: true
        }
    })
})

sdk.start()
