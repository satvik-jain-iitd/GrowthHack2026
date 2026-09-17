/* istanbul ignore file */

'use client'
import { useEffect, useRef, useState } from 'react'
import type {
    DerivedMetrics,
    EpicDetailData,
    EpicSummaryRow,
    WorkerOutMessage
} from '@/app/resources/tech-investment-planning-dashboard/types'

export type ProcessingPhase =
    | 'idle'
    | 'mapping'
    | 'journeyRec'
    | 'capRec'
    | 'history'
    | 'deriving'
    | 'done'
    | 'error'

interface State {
    phase: ProcessingPhase
    pct: number
    metrics: DerivedMetrics | null
    epicRows: EpicSummaryRow[]
    epicDetails: Record<string, EpicDetailData>
    epicActors: Record<string, string[]>
    error: string | null
}

export function useCsvProcessor(
    mappingUrl: string | null,
    journeyRecUrl: string | null,
    capRecUrl: string | null,
    historyUrl: string | null
) {
    const [state, setState] = useState<State>({
        phase: 'idle',
        pct: 0,
        metrics: null,
        epicRows: [],
        epicDetails: {},
        epicActors: {},
        error: null
    })
    const workerRef = useRef<Worker | null>(null)

    useEffect(() => {
        if (typeof window === 'undefined') return
        if (!mappingUrl || !journeyRecUrl || !capRecUrl || !historyUrl) return

        const worker = new Worker(
            new URL('../workers/csvProcessor.worker.ts', import.meta.url),
            { type: 'module' }
        )
        workerRef.current = worker

        setState({
            phase: 'mapping',
            pct: 0,
            metrics: null,
            epicRows: [],
            epicDetails: {},
            epicActors: {},
            error: null
        })

        worker.onmessage = (e: MessageEvent<WorkerOutMessage>) => {
            const msg = e.data
            if (msg.type === 'PROGRESS') {
                setState(prev => ({ ...prev, phase: msg.phase, pct: msg.pct }))
            } else if (msg.type === 'COMPLETE') {
                setState({
                    phase: 'done',
                    pct: 100,
                    metrics: msg.metrics,
                    epicRows: msg.epicRows,
                    epicDetails: msg.epicDetails,
                    epicActors: msg.epicActors,
                    error: null
                })
                worker.terminate()
            } else if (msg.type === 'ERROR') {
                setState(prev => ({
                    ...prev,
                    phase: 'error',
                    error: msg.message
                }))
                worker.terminate()
            }
        }

        worker.onerror = err => {
            setState(prev => ({ ...prev, phase: 'error', error: err.message }))
            worker.terminate()
        }

        worker.postMessage({
            type: 'START',
            mappingUrl,
            journeyRecUrl,
            capRecUrl,
            historyUrl
        })

        return () => {
            worker.terminate()
        }
    }, [mappingUrl, journeyRecUrl, capRecUrl, historyUrl])

    return state
}
