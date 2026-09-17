'use client'
import React, { useCallback, useState, useTransition } from 'react'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'
import { useScrollContext } from '@/context/ScrollContext'
import { JourneySelectStep } from './JourneySelectStep'
import { CapabilitySelectMap } from './CapabilitySelectMap'
import { SubmissionComplete } from './SubmissionComplete'
import { JourneyFormState } from '@/app/business-architecture/tbm-mapping/types'
import { useGetStrategicEpicById } from '@/app/business-architecture/tbm-mapping/hooks/useGetEpic'

type AptioStep = 1 | 2 | 3

export function AptioForm({ epicId }: { epicId: string }) {
    const { strategic_epic } = useGetStrategicEpicById(epicId)
    const [step, setStep] = useState<AptioStep>(1)
    const [selectedJourneys, setSelectedJourneys] = useState<CustomerJourney[]>(
        []
    )
    // Preserved so Back restores the user's journey selections + search term
    const [savedJourneyState, setSavedJourneyState] = useState<
        JourneyFormState | undefined
    >(undefined)
    const [isPending, startTransition] = useTransition()
    const { scrollTo } = useScrollContext()

    const handleJourneysNext = useCallback(
        (journeys: CustomerJourney[], state: JourneyFormState) => {
            setSelectedJourneys(journeys)
            setSavedJourneyState(state)
            startTransition(() => {
                setStep(2)
            })
            scrollTo(0, { behavior: 'instant' as ScrollBehavior })
        },
        [scrollTo]
    )

    const handleBack = useCallback(() => {
        setStep(1)
    }, [])

    const handleSubmitComplete = useCallback(() => {
        setStep(3)
        scrollTo(0, { behavior: 'instant' as ScrollBehavior })
    }, [scrollTo])

    if (step === 1) {
        return (
            <JourneySelectStep
                epicId={epicId}
                onNext={handleJourneysNext}
                initialState={savedJourneyState}
                isNextPending={isPending}
                epicName={strategic_epic?.name}
                projectId={strategic_epic?.project.id}
            />
        )
    }

    if (step === 3) {
        return <SubmissionComplete />
    }

    return (
        <CapabilitySelectMap
            epicId={epicId}
            selectedJourneys={selectedJourneys}
            onBack={handleBack}
            onSubmitComplete={handleSubmitComplete}
            epicName={strategic_epic?.name}
        />
    )
}
