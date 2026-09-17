/* istanbul ignore file */
import Papa from 'papaparse'
import brotliPromise from 'brotli-dec-wasm'
import type {
    EpicMappingAccumulator,
    RecEpicAccumulator,
    EpicSummaryRow,
    EpicDetailData,
    EpicAuditData,
    AuditEvent,
    DerivedMetrics,
    JourneyFrequency,
    CapabilityFrequency,
    WorkerInMessage,
    WorkerOutMessage
} from '@/app/resources/tech-investment-planning-dashboard/types'
import { fetchWithToken } from '@/utils/client'

function post(msg: WorkerOutMessage) {
    self.postMessage(msg)
}

const brotliModule = brotliPromise

async function fetchBrotliText(url: string): Promise<string> {
    const [res, brotli] = await Promise.all([fetchWithToken(url), brotliModule])
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
    const compressed = new Uint8Array(await res.arrayBuffer())
    const decompressed = brotli.decompress(compressed)
    return new TextDecoder().decode(decompressed)
}

function parseBool(val: string): boolean {
    return val.trim().toUpperCase() === 'TRUE'
}

// mappings.csv: renamed columns journey_is_ai_recommended, capability_is_ai_recommended, capability_nm
async function parseMappingFile(
    url: string
): Promise<Map<string, EpicMappingAccumulator>> {
    post({ type: 'PROGRESS', phase: 'mapping', pct: 0 })
    const text = await fetchBrotliText(url)
    const map = new Map<string, EpicMappingAccumulator>()
    let rowCount = 0

    await new Promise<void>((resolve, reject) => {
        Papa.parse(text, {
            worker: false,
            header: true,
            skipEmptyLines: true,
            step(result: Papa.ParseStepResult<Record<string, string>>) {
                const row = result.data
                const epicId = row['epic_id']?.trim()
                if (!epicId) return

                rowCount++
                if (rowCount % 5000 === 0) {
                    post({
                        type: 'PROGRESS',
                        phase: 'mapping',
                        pct: Math.min(24, Math.round((rowCount / 23203) * 24))
                    })
                }

                const recJourney = parseBool(
                    row['journey_is_ai_recommended'] ?? 'false'
                )
                const recCap = parseBool(
                    row['capability_is_ai_recommended'] ?? 'false'
                )
                const isSubmitted = parseBool(
                    row['is_saved_to_apptio'] ?? 'false'
                )
                const journeyId = row['journey_id']?.trim() ?? ''
                const journeyStatement = row['journey_statement']?.trim() ?? ''
                const capabilityId = row['capability_id']?.trim() ?? ''
                const capabilityName = row['capability_nm']?.trim() ?? ''
                const capLevel = parseInt(
                    row['capability_level']?.trim() ?? '0',
                    10
                )

                let acc = map.get(epicId)
                if (!acc) {
                    acc = {
                        epicId,
                        epicName: row['epic_name']?.trim() ?? '',
                        isSubmitted,
                        allRecommended: true,
                        savedJourneyIds: new Set(),
                        savedCapabilityIds: new Set(),
                        addedJourneyIds: new Set(),
                        addedCapabilityIds: new Set(),
                        capLevel3Count: 0,
                        capLevel4Count: 0,
                        journeyDetail: new Map(),
                        capabilityDetail: new Map()
                    }
                    map.set(epicId, acc)
                }

                if (journeyId) {
                    acc.savedJourneyIds.add(journeyId)
                    if (!recJourney) acc.addedJourneyIds.add(journeyId)
                    if (!acc.journeyDetail.has(journeyId)) {
                        acc.journeyDetail.set(journeyId, {
                            statement: journeyStatement,
                            recommended: recJourney
                        })
                    } else {
                        if (!recJourney)
                            acc.journeyDetail.get(journeyId)!.recommended =
                                false
                    }
                }
                if (capabilityId) {
                    acc.savedCapabilityIds.add(capabilityId)
                    if (!recCap) acc.addedCapabilityIds.add(capabilityId)
                    if (!acc.capabilityDetail.has(capabilityId)) {
                        acc.capabilityDetail.set(capabilityId, {
                            name: capabilityName,
                            level: capLevel,
                            recommended: recCap
                        })
                    } else {
                        if (!recCap)
                            acc.capabilityDetail.get(
                                capabilityId
                            )!.recommended = false
                    }
                }
                if (!recJourney || !recCap) acc.allRecommended = false

                if (capLevel === 3) acc.capLevel3Count++
                else if (capLevel === 4) acc.capLevel4Count++
            },
            complete() {
                resolve()
            },
            error(err: Error) {
                reject(err)
            }
        })
    })

    post({ type: 'PROGRESS', phase: 'mapping', pct: 25 })
    return map
}

// journey_ai_recommendations.csv: epic_id, epic_name, journey_id, journey_statement
async function parseJourneyRecFile(
    url: string
): Promise<Map<string, RecEpicAccumulator>> {
    post({ type: 'PROGRESS', phase: 'journeyRec', pct: 25 })
    const text = await fetchBrotliText(url)
    const map = new Map<string, RecEpicAccumulator>()
    let rowCount = 0

    await new Promise<void>((resolve, reject) => {
        Papa.parse(text, {
            worker: false,
            header: true,
            skipEmptyLines: true,
            step(result: Papa.ParseStepResult<Record<string, string>>) {
                const row = result.data
                const epicId = row['epic_id']?.trim()
                if (!epicId) return

                rowCount++
                if (rowCount % 1000 === 0) {
                    post({
                        type: 'PROGRESS',
                        phase: 'journeyRec',
                        pct:
                            25 +
                            Math.min(19, Math.round((rowCount / 5936) * 19))
                    })
                }

                const journeyId = row['journey_id']?.trim() ?? ''
                const journeyStatement = row['journey_statement']?.trim() ?? ''

                let acc = map.get(epicId)
                if (!acc) {
                    acc = {
                        epicId,
                        recJourneyIds: new Set(),
                        recCapabilityIds: new Set(),
                        capLevel3Count: 0,
                        capLevel4Count: 0,
                        journeyDetail: new Map(),
                        capabilityDetail: new Map()
                    }
                    map.set(epicId, acc)
                }

                if (journeyId) {
                    acc.recJourneyIds.add(journeyId)
                    if (!acc.journeyDetail.has(journeyId)) {
                        acc.journeyDetail.set(journeyId, {
                            statement: journeyStatement
                        })
                    }
                }
            },
            complete() {
                resolve()
            },
            error(err: Error) {
                reject(err)
            }
        })
    })

    post({ type: 'PROGRESS', phase: 'journeyRec', pct: 45 })
    return map
}

// capabilities_ai_recommendations.csv: epic_id, epic_name, journey_id, journey_statement, capability_id, capability_nm, capability_level, cap_rec_edge
async function parseCapRecFile(
    url: string,
    recMap: Map<string, RecEpicAccumulator>
): Promise<void> {
    post({ type: 'PROGRESS', phase: 'capRec', pct: 45 })
    const text = await fetchBrotliText(url)
    let rowCount = 0

    await new Promise<void>((resolve, reject) => {
        Papa.parse(text, {
            worker: false,
            header: true,
            skipEmptyLines: true,
            step(result: Papa.ParseStepResult<Record<string, string>>) {
                const row = result.data
                const epicId = row['epic_id']?.trim()
                if (!epicId) return

                rowCount++
                if (rowCount % 2000 === 0) {
                    post({
                        type: 'PROGRESS',
                        phase: 'capRec',
                        pct:
                            45 +
                            Math.min(19, Math.round((rowCount / 21240) * 19))
                    })
                }

                const capabilityId = row['capability_id']?.trim() ?? ''
                const capabilityName = row['capability_nm']?.trim() ?? ''
                const capLevel = parseInt(
                    row['capability_level']?.trim() ?? '0',
                    10
                )

                let acc = recMap.get(epicId)
                if (!acc) {
                    acc = {
                        epicId,
                        recJourneyIds: new Set(),
                        recCapabilityIds: new Set(),
                        capLevel3Count: 0,
                        capLevel4Count: 0,
                        journeyDetail: new Map(),
                        capabilityDetail: new Map()
                    }
                    recMap.set(epicId, acc)
                }

                if (capabilityId) {
                    acc.recCapabilityIds.add(capabilityId)
                    if (!acc.capabilityDetail.has(capabilityId)) {
                        acc.capabilityDetail.set(capabilityId, {
                            name: capabilityName,
                            level: capLevel
                        })
                    }
                }
                if (capLevel === 3) acc.capLevel3Count++
                else if (capLevel === 4) acc.capLevel4Count++
            },
            complete() {
                resolve()
            },
            error(err: Error) {
                reject(err)
            }
        })
    })

    post({ type: 'PROGRESS', phase: 'capRec', pct: 65 })
}

const AUDIT_ACTIONS = new Set([
    'ADD ASSOCIATED CAPABILITY',
    'ADD ASSOCIATED JOURNEY',
    'DELETE ASSOCIATED JOURNEY',
    'REMOVE ASSOCIATED CAPABILITY',
    'APPTIO DATA UPDATE SUCCESSFUL',
    'CAPABILITY RECOMMENDATIONS GENERATED',
    'JOURNEY RECOMMENDATIONS GENERATED'
])

// Dedup key: epic_id + action_summary + changed_properties (for ADD events only)
const ADD_DEDUP_ACTIONS = new Set([
    'ADD ASSOCIATED CAPABILITY',
    'ADD ASSOCIATED JOURNEY'
])

function parseJourneyRecommendChangedProps(raw: string): string[] {
    let cleaned = raw.trim()
    if (cleaned.startsWith('"') && cleaned.endsWith('"'))
        cleaned = cleaned.slice(1, -1)
    cleaned = cleaned.replace(/\\"/g, '"')
    let parsed: unknown
    try {
        parsed = JSON.parse(cleaned)
    } catch {
        return []
    }
    if (!Array.isArray(parsed)) return []
    return parsed
        .map((item: unknown) => {
            if (item && typeof item === 'object') {
                const obj = item as Record<string, unknown>
                return typeof obj['journeyId'] === 'string'
                    ? obj['journeyId']
                    : ''
            }
            return ''
        })
        .filter(Boolean)
}

function parseChangedProperties(raw: string): {
    ids: string[]
    aiFlags: (boolean | null)[]
} {
    const ids: string[] = []
    const aiFlags: (boolean | null)[] = []

    // The field arrives triple-quoted from Papa Parse, strip leading/trailing quotes
    let cleaned = raw.trim()
    // Remove surrounding outer quotes that CSV wrapping adds (Papa gives us the value already unescaped once)
    // But the value still contains \"\" for internal quotes — strip a leading/trailing single " if present
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1)
    }
    // Replace escaped quotes (\") with real quotes
    cleaned = cleaned.replace(/\\"/g, '"')

    let parsed: unknown
    try {
        parsed = JSON.parse(cleaned)
    } catch {
        return { ids, aiFlags }
    }

    if (parsed === null || typeof parsed !== 'object') return { ids, aiFlags }

    // Could be object with numeric string keys (ADD/REMOVE/DELETE) or array (SUBMIT/RECOMMEND — we don't extract IDs from those)
    const values = Object.values(parsed as Record<string, unknown>)
    for (const v of values) {
        if (typeof v === 'string') {
            // DELETE ASSOCIATED JOURNEY: bare UUID string
            ids.push(v)
            aiFlags.push(null)
        } else if (v !== null && typeof v === 'object') {
            const obj = v as Record<string, unknown>
            if (typeof obj['id'] === 'string') {
                ids.push(obj['id'])
                aiFlags.push(
                    typeof obj['isAiRecommended'] === 'boolean'
                        ? obj['isAiRecommended']
                        : null
                )
            }
        }
    }

    return { ids, aiFlags }
}

async function parseHistoryFile(url: string): Promise<{
    auditMap: Map<string, EpicAuditData>
    epicActors: Record<string, string[]>
    journeyRankMap: Map<string, { journeyIds: string[]; time: string }>
}> {
    post({ type: 'PROGRESS', phase: 'history', pct: 65 })
    const text = await fetchBrotliText(url)

    const auditMap = new Map<string, EpicAuditData>()
    const journeyRankMap = new Map<
        string,
        { journeyIds: string[]; time: string }
    >()
    const dedupSeen = new Set<string>()
    let rowCount = 0

    await new Promise<void>((resolve, reject) => {
        Papa.parse(text, {
            worker: false,
            header: true,
            skipEmptyLines: true,
            step(result: Papa.ParseStepResult<Record<string, string>>) {
                const row = result.data
                const epicId = row['epic_id']?.trim()
                const actionSummary = row['action_summary']?.trim() ?? ''

                if (!epicId || !AUDIT_ACTIONS.has(actionSummary)) return

                rowCount++
                if (rowCount % 5000 === 0) {
                    post({
                        type: 'PROGRESS',
                        phase: 'history',
                        pct:
                            65 +
                            Math.min(14, Math.round((rowCount / 50000) * 14))
                    })
                }

                const changedProps = row['changed_properties'] ?? ''
                const actor = row['actor']?.trim() ?? ''
                const time = row['time']?.trim() ?? ''

                // Dedup ADD events by (epicId, actionSummary, changed_properties)
                if (ADD_DEDUP_ACTIONS.has(actionSummary)) {
                    const dedupKey =
                        epicId + '|' + actionSummary + '|' + changedProps
                    if (dedupSeen.has(dedupKey)) return
                    dedupSeen.add(dedupKey)
                }

                if (actionSummary === 'JOURNEY RECOMMENDATIONS GENERATED') {
                    const journeyIds =
                        parseJourneyRecommendChangedProps(changedProps)
                    if (journeyIds.length > 0) {
                        const existing = journeyRankMap.get(epicId)
                        if (!existing || time > existing.time) {
                            journeyRankMap.set(epicId, { journeyIds, time })
                        }
                    }
                }

                const { ids: itemIds, aiFlags: isAiRecommended } =
                    parseChangedProperties(changedProps)

                const event: AuditEvent = {
                    time,
                    actor,
                    actionSummary,
                    itemIds,
                    isAiRecommended
                }

                let epicAudit = auditMap.get(epicId)
                if (!epicAudit) {
                    epicAudit = { events: [], actors: [], timeSpentMs: null }
                    auditMap.set(epicId, epicAudit)
                }
                epicAudit.events.push(event)

                if (actor && !epicAudit.actors.includes(actor)) {
                    epicAudit.actors.push(actor)
                }
            },
            complete() {
                resolve()
            },
            error(err: Error) {
                reject(err)
            }
        })
    })

    // Sort events chronologically and actors alphabetically, then compute time spent
    for (const audit of auditMap.values()) {
        audit.events.sort((a, b) => a.time.localeCompare(b.time))
        audit.actors.sort()

        // Time spent: first event with a valid timestamp → last APPTIO DATA UPDATE SUCCESSFUL
        const submissions = audit.events.filter(
            e => e.actionSummary === 'APPTIO DATA UPDATE SUCCESSFUL' && e.time
        )
        const firstValidEvent = audit.events.find(e => e.time)
        if (submissions.length > 0 && firstValidEvent) {
            const firstMs = new Date(firstValidEvent.time).getTime()
            const lastSubmitMs = new Date(
                submissions[submissions.length - 1].time
            ).getTime()
            const diff = lastSubmitMs - firstMs
            audit.timeSpentMs = isNaN(diff) || diff < 0 ? null : diff
        } else {
            audit.timeSpentMs = null
        }
    }

    // Build epicActors map
    const epicActors: Record<string, string[]> = {}
    for (const [epicId, audit] of auditMap) {
        epicActors[epicId] = audit.actors
    }

    post({ type: 'PROGRESS', phase: 'history', pct: 80 })
    return { auditMap, epicActors, journeyRankMap }
}

function deriveMetrics(
    mappingMap: Map<string, EpicMappingAccumulator>,
    recMap: Map<string, RecEpicAccumulator>,
    auditMap: Map<string, EpicAuditData>,
    journeyRankMap: Map<string, { journeyIds: string[]; time: string }>
): {
    metrics: DerivedMetrics
    epicRows: EpicSummaryRow[]
    epicDetails: Record<string, EpicDetailData>
} {
    post({ type: 'PROGRESS', phase: 'deriving', pct: 80 })

    const epicRows: EpicSummaryRow[] = []
    const epicDetails: Record<string, EpicDetailData> = {}

    let abandoned = 0
    let submitted = 0
    let noChange = 0
    let delta = 0
    let noRec = 0
    let totalAddedJourneys = 0
    let totalAddedCapabilities = 0
    let totalRemovedJourneys = 0
    let totalRemovedCapabilities = 0
    let epicsWithAdditions = 0
    let epicsWithRemovals = 0
    let totalKeptAiJourneys = 0
    let totalKeptAiCapabilities = 0
    let mapLevel3 = 0
    let mapLevel4 = 0
    let journeyRetentionSum = 0
    let journeyRetentionCount = 0
    let capabilityRetentionSum = 0
    let capabilityRetentionCount = 0

    const recJourneyFreq = new Map<
        string,
        { statement: string; epicCount: number }
    >()
    const recCapFreq = new Map<
        string,
        { name: string; level: number; epicCount: number }
    >()
    const savedJourneyFreq = new Map<
        string,
        { statement: string; epicCount: number }
    >()
    const savedCapFreq = new Map<
        string,
        { name: string; level: number; epicCount: number }
    >()

    for (const [epicId, acc] of mappingMap) {
        mapLevel3 += acc.capLevel3Count
        mapLevel4 += acc.capLevel4Count

        const recAcc = recMap.get(epicId)
        let removedJourneys = 0
        let removedCapabilities = 0

        if (recAcc) {
            // If a journey/capability was flagged false in mappings but also exists in the rec file,
            // the user removed and re-added an AI suggestion — treat it as AI-recommended.
            for (const jId of recAcc.recJourneyIds) {
                if (!acc.savedJourneyIds.has(jId)) {
                    removedJourneys++
                } else if (acc.addedJourneyIds.has(jId)) {
                    // Present in rec → not a user addition
                    acc.addedJourneyIds.delete(jId)
                    const detail = acc.journeyDetail.get(jId)
                    if (detail) detail.recommended = true
                }
            }
            for (const cId of recAcc.recCapabilityIds) {
                if (!acc.savedCapabilityIds.has(cId)) {
                    removedCapabilities++
                } else if (acc.addedCapabilityIds.has(cId)) {
                    // Present in rec → not a user addition
                    acc.addedCapabilityIds.delete(cId)
                    const detail = acc.capabilityDetail.get(cId)
                    if (detail) detail.recommended = true
                }
            }
            // Recompute allRecommended: true only if user neither added nor removed any items
            acc.allRecommended =
                acc.addedJourneyIds.size === 0 &&
                acc.addedCapabilityIds.size === 0 &&
                removedJourneys === 0 &&
                removedCapabilities === 0
        }

        // Retention rate: per submitted epic with recs, kept / recommended
        if (recAcc && acc.isSubmitted) {
            if (recAcc.recJourneyIds.size > 0) {
                const keptJ = recAcc.recJourneyIds.size - removedJourneys
                journeyRetentionSum += keptJ / recAcc.recJourneyIds.size
                journeyRetentionCount++
            }
            if (recAcc.recCapabilityIds.size > 0) {
                const keptC = recAcc.recCapabilityIds.size - removedCapabilities
                capabilityRetentionSum += keptC / recAcc.recCapabilityIds.size
                capabilityRetentionCount++
            }
        }

        // Frequency counts for top journeys/capabilities (distinct-epic counts)
        if (recAcc) {
            for (const [jId, d] of recAcc.journeyDetail) {
                const entry = recJourneyFreq.get(jId)
                if (entry) {
                    entry.epicCount++
                } else
                    recJourneyFreq.set(jId, {
                        statement: d.statement,
                        epicCount: 1
                    })
            }
            for (const [cId, d] of recAcc.capabilityDetail) {
                const entry = recCapFreq.get(cId)
                if (entry) {
                    entry.epicCount++
                } else
                    recCapFreq.set(cId, {
                        name: d.name,
                        level: d.level,
                        epicCount: 1
                    })
            }
        }
        for (const [jId, d] of acc.journeyDetail) {
            const entry = savedJourneyFreq.get(jId)
            if (entry) {
                entry.epicCount++
            } else
                savedJourneyFreq.set(jId, {
                    statement: d.statement,
                    epicCount: 1
                })
        }
        for (const [cId, d] of acc.capabilityDetail) {
            const entry = savedCapFreq.get(cId)
            if (entry) {
                entry.epicCount++
            } else
                savedCapFreq.set(cId, {
                    name: d.name,
                    level: d.level,
                    epicCount: 1
                })
        }

        const status: EpicSummaryRow['status'] = acc.isSubmitted
            ? 'submitted'
            : 'abandoned'
        let aiMatch: EpicSummaryRow['aiMatch'] = 'n/a'

        if (!recAcc) {
            aiMatch = 'no_rec'
            noRec++
            if (acc.isSubmitted) submitted++
            else abandoned++
        } else if (acc.isSubmitted) {
            submitted++
            aiMatch = acc.allRecommended ? 'no_change' : 'delta'
            if (acc.allRecommended) noChange++
            else delta++
        } else {
            abandoned++
        }

        const addedJourneys = acc.addedJourneyIds.size
        const addedCapabilities = acc.addedCapabilityIds.size
        // AI-recommended items the user kept = saved set minus user-added items
        const keptAiJourneys = acc.savedJourneyIds.size - addedJourneys
        const keptAiCapabilities =
            acc.savedCapabilityIds.size - addedCapabilities

        totalAddedJourneys += addedJourneys
        totalAddedCapabilities += addedCapabilities
        totalRemovedJourneys += removedJourneys
        totalRemovedCapabilities += removedCapabilities
        totalKeptAiJourneys += keptAiJourneys > 0 ? keptAiJourneys : 0
        totalKeptAiCapabilities +=
            keptAiCapabilities > 0 ? keptAiCapabilities : 0

        if (addedJourneys > 0 || addedCapabilities > 0) epicsWithAdditions++
        if (acc.isSubmitted && (removedJourneys > 0 || removedCapabilities > 0))
            epicsWithRemovals++

        epicRows.push({
            epicId,
            epicName: acc.epicName,
            status,
            aiMatch,
            addedJourneys,
            addedCapabilities,
            removedJourneys,
            removedCapabilities,
            savedJourneyCount: acc.savedJourneyIds.size,
            savedCapabilityCount: acc.savedCapabilityIds.size,
            recJourneyCount: recAcc ? recAcc.recJourneyIds.size : 0,
            recCapabilityCount: recAcc ? recAcc.recCapabilityIds.size : 0
        })

        const savedJourneys = Array.from(acc.journeyDetail.entries()).map(
            ([jId, d]) => ({
                journeyId: jId,
                journeyStatement: d.statement,
                recommended: d.recommended,
                saved: true
            })
        )

        const savedCapabilities = Array.from(
            acc.capabilityDetail.entries()
        ).map(([cId, d]) => ({
            capabilityId: cId,
            capabilityName: d.name,
            capabilityLevel: d.level,
            recommended: d.recommended,
            saved: true
        }))

        const recJourneys = recAcc
            ? Array.from(recAcc.journeyDetail.entries()).map(([jId, d]) => ({
                  journeyId: jId,
                  journeyStatement: d.statement,
                  recommended: true,
                  saved: acc.savedJourneyIds.has(jId)
              }))
            : []

        const recCapabilities = recAcc
            ? Array.from(recAcc.capabilityDetail.entries()).map(([cId, d]) => ({
                  capabilityId: cId,
                  capabilityName: d.name,
                  capabilityLevel: d.level,
                  recommended: true,
                  saved: acc.savedCapabilityIds.has(cId)
              }))
            : []

        const auditData = auditMap.get(epicId)
        epicDetails[epicId] = {
            epicId,
            epicName: acc.epicName,
            savedJourneys,
            savedCapabilities,
            recJourneys,
            recCapabilities,
            audit: auditData,
            timeSpentMs: auditData?.timeSpentMs ?? null
        }
    }

    let recLevel3 = 0
    let recLevel4 = 0
    for (const rec of recMap.values()) {
        recLevel3 += rec.capLevel3Count
        recLevel4 += rec.capLevel4Count
    }

    epicRows.sort((a, b) => a.epicName.localeCompare(b.epicName))

    const topRecJourneys: JourneyFrequency[] = Array.from(
        recJourneyFreq.entries()
    )
        .map(([journeyId, d]) => ({
            journeyId,
            journeyStatement: d.statement,
            epicCount: d.epicCount
        }))
        .sort((a, b) => b.epicCount - a.epicCount)
        .slice(0, 10)

    const topRecCapabilities: CapabilityFrequency[] = Array.from(
        recCapFreq.entries()
    )
        .map(([capabilityId, d]) => ({
            capabilityId,
            capabilityName: d.name,
            capabilityLevel: d.level,
            epicCount: d.epicCount
        }))
        .sort((a, b) => b.epicCount - a.epicCount)
        .slice(0, 10)

    const topSavedJourneys: JourneyFrequency[] = Array.from(
        savedJourneyFreq.entries()
    )
        .map(([journeyId, d]) => ({
            journeyId,
            journeyStatement: d.statement,
            epicCount: d.epicCount
        }))
        .sort((a, b) => b.epicCount - a.epicCount)
        .slice(0, 10)

    const topSavedCapabilities: CapabilityFrequency[] = Array.from(
        savedCapFreq.entries()
    )
        .map(([capabilityId, d]) => ({
            capabilityId,
            capabilityName: d.name,
            capabilityLevel: d.level,
            epicCount: d.epicCount
        }))
        .sort((a, b) => b.epicCount - a.epicCount)
        .slice(0, 10)

    const rankRetention = [0, 0, 0, 0, 0]
    for (const [epicId, ranked] of journeyRankMap) {
        const acc = mappingMap.get(epicId)
        if (!acc) continue
        for (let i = 0; i < Math.min(5, ranked.journeyIds.length); i++) {
            if (acc.savedJourneyIds.has(ranked.journeyIds[i])) {
                rankRetention[i]++
            }
        }
    }

    const metrics: DerivedMetrics = {
        totalEpicsInitiated: mappingMap.size,
        totalEpicsInRecommendations: recMap.size,
        abandoned,
        submitted,
        noChange,
        delta,
        noRec,
        totalAddedJourneys,
        totalAddedCapabilities,
        totalRemovedJourneys,
        totalRemovedCapabilities,
        epicsWithAdditions,
        epicsWithRemovals,
        totalKeptAiJourneys,
        totalKeptAiCapabilities,
        capLevelDistMapping: { level3: mapLevel3, level4: mapLevel4 },
        capLevelDistRec: { level3: recLevel3, level4: recLevel4 },
        journeyRetentionRate:
            journeyRetentionCount > 0
                ? journeyRetentionSum / journeyRetentionCount
                : 0,
        capabilityRetentionRate:
            capabilityRetentionCount > 0
                ? capabilityRetentionSum / capabilityRetentionCount
                : 0,
        topRecJourneys,
        topRecCapabilities,
        topSavedJourneys,
        topSavedCapabilities,
        journeyRankRetention: rankRetention
    }

    post({ type: 'PROGRESS', phase: 'deriving', pct: 100 })
    return { metrics, epicRows, epicDetails }
}

self.onmessage = async (e: MessageEvent<WorkerInMessage>) => {
    if (e.data.type !== 'START') return
    try {
        const { mappingUrl, journeyRecUrl, capRecUrl, historyUrl } = e.data
        const mappingMap = await parseMappingFile(mappingUrl)
        const recMap = await parseJourneyRecFile(journeyRecUrl)
        await parseCapRecFile(capRecUrl, recMap)
        const { auditMap, epicActors, journeyRankMap } =
            await parseHistoryFile(historyUrl)
        const { metrics, epicRows, epicDetails } = deriveMetrics(
            mappingMap,
            recMap,
            auditMap,
            journeyRankMap
        )
        post({ type: 'COMPLETE', metrics, epicRows, epicDetails, epicActors })
    } catch (err) {
        post({
            type: 'ERROR',
            message: err instanceof Error ? err.message : String(err)
        })
    }
}
