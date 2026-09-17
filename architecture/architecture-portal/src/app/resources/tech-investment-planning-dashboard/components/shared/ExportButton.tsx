'use client'
import Papa from 'papaparse'
import { Button } from '@chakra-ui/react'
import type {
    EpicDetailData,
    EpicSummaryRow,
    StrategicEpic
} from '@/app/resources/tech-investment-planning-dashboard/types'
import { SYSTEM_ACTORS } from '@/app/resources/tech-investment-planning-dashboard/constants'
import { formatDuration } from '@/app/resources/tech-investment-planning-dashboard/utils/formatDuration'

interface Props {
    rows: EpicSummaryRow[]
    strategicEpicMap: Map<string, StrategicEpic>
    epicActors: Record<string, string[]>
    epicDetails: Record<string, EpicDetailData>
}

export function ExportButton({
    rows,
    strategicEpicMap,
    epicActors,
    epicDetails
}: Props) {
    function download() {
        const csv = Papa.unparse(
            rows.map(r => {
                const se = strategicEpicMap.get(r.epicId)
                const actors = epicActors[r.epicId] ?? []
                const humanActors = actors.filter(a => !SYSTEM_ACTORS.has(a))
                const timeSpentMs = epicDetails[r.epicId]?.timeSpentMs ?? null
                return {
                    epic_id: r.epicId,
                    epic_name: r.epicName,
                    status: r.status,
                    ai_match: r.aiMatch,
                    actors: humanActors.join('; '),
                    // Strategic Epic details
                    requesting_lob: se?.requestingLOB ?? '',
                    impacted_lob: se?.impactedLOB ?? '',
                    sponsoring_lob: se?.sponsoringLOB ?? '',
                    investment_category: se?.investmentCategory ?? '',
                    demand_group: se?.demandGroup ?? '',
                    planning_cycle: se?.planningCycle?.join('; ') ?? '',
                    created_by: se?.createdBy ?? '',
                    created_date: se?.createdDate ?? '',
                    // Metrics — mirrors the AI ECJs/Saved ECJs/Added ECJ/Retained ECJ
                    // (and EBC) columns shown in the Strategic Epic Detail table
                    ai_rec_ecj_count: r.recJourneyCount,
                    saved_ecj_count: r.savedJourneyCount,
                    added_ecjs: r.addedJourneys,
                    retained_ecj_count:
                        r.recJourneyCount > 0
                            ? r.recJourneyCount - r.removedJourneys
                            : '',
                    ai_rec_ebc_count: r.recCapabilityCount,
                    saved_ebc_count: r.savedCapabilityCount,
                    added_ebcs: r.addedCapabilities,
                    retained_ebc_count:
                        r.recCapabilityCount > 0
                            ? r.recCapabilityCount - r.removedCapabilities
                            : '',
                    removed_ecjs: r.removedJourneys,
                    removed_ebcs: r.removedCapabilities,
                    time_taken:
                        timeSpentMs !== null ? formatDuration(timeSpentMs) : ''
                }
            })
        )
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'apptio_epic_summary.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <Button size='sm' colorPalette='blue' onClick={download}>
            Export CSV ({rows.length} rows)
        </Button>
    )
}
