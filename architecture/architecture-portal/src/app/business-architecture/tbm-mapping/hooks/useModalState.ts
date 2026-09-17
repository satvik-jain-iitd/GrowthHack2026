/*istanbul ignore file*/

'use client'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { useSaveApptioJourneyCapabilities } from '@/app/business-architecture/hooks/useSaveApptioJourneyCapabilities'
import { submitApptioEpicMappings } from '@/app/business-architecture/hooks/useSubmitApptioEpicMappings'
import { checkSessionValid } from '../utils/checkSessionValid'

type ModalMode = null | 'journey' | 'final'
type CapabilitySnapshot = { journey_id: string; capability_ids: string[] }[]

export function useModalState({
    epicId,
    currentJourneyId,
    isLastJourney,
    onSubmitComplete,
    onJourneySelect,
    onAdvanceJourney,
    onSaveSuccess,
    getAllJourneyCapabilities,
    getAllJourneyAICapabilities,
    user
}: {
    epicId: string
    currentJourneyId: string
    isLastJourney: boolean
    onSubmitComplete?: () => void
    onJourneySelect: (journeyId: string) => void
    onAdvanceJourney: () => void
    onSaveSuccess?: () => void
    getAllJourneyCapabilities: () => CapabilitySnapshot
    getAllJourneyAICapabilities: () => CapabilitySnapshot
    user: { userEmail: string; userName: string }
}) {
    const [modalMode, setModalMode] = useState<ModalMode>(null)
    const [isJourneyModalLoading, setIsJourneyModalLoading] = useState(false)
    const [modalSnapshot, setModalSnapshot] = useState<CapabilitySnapshot>([])
    const [aiModalSnapshot, setAiModalSnapshot] = useState<CapabilitySnapshot>(
        []
    )
    const [sessionExpired, setSessionExpired] = useState(false)
    const saveCapabilitiesMutation = useSaveApptioJourneyCapabilities()
    const handleSaveAndNext = useCallback(() => {
        const allCapabilities = getAllJourneyCapabilities()
        const allAICapabilities = getAllJourneyAICapabilities()
        setModalSnapshot(allCapabilities)
        setAiModalSnapshot(allAICapabilities)
        setModalMode('journey')
    }, [getAllJourneyCapabilities, getAllJourneyAICapabilities])

    const handleJourneyModalConfirm = useCallback(async () => {
        setIsJourneyModalLoading(true)
        try {
            const isValid = await checkSessionValid()
            if (!isValid) {
                setSessionExpired(true)
                setModalMode(null)
                return
            }

            const journeyCaps =
                getAllJourneyCapabilities().find(
                    jc => jc.journey_id === currentJourneyId
                )?.capability_ids ?? []
            const aiCaps = new Set(
                getAllJourneyAICapabilities().find(
                    jc => jc.journey_id === currentJourneyId
                )?.capability_ids ?? []
            )

            const payload = journeyCaps.map(capId => ({
                id: capId,
                isAiRecommended: aiCaps.has(capId)
            }))

            await saveCapabilitiesMutation
                .mutateAsync({
                    epicId,
                    journeyId: currentJourneyId,
                    capabilities: [...payload],
                    userInfo: user
                })
                .then(() => {
                    toast.success(
                        'Enterprise Business Capabilities saved successfully'
                    )
                    onSaveSuccess?.()

                    if (isLastJourney) {
                        setModalMode('final')
                    } else {
                        setModalMode(null)
                        onAdvanceJourney()
                    }
                })
        } catch {
            toast.error('Failed to save capabilities, please try again.')
        } finally {
            setIsJourneyModalLoading(false)
        }
    }, [
        epicId,
        currentJourneyId,
        isLastJourney,
        onAdvanceJourney,
        onSaveSuccess,
        getAllJourneyCapabilities,
        getAllJourneyAICapabilities,
        user
    ])

    const [isFinalLoading, setIsFinalLoading] = useState(false)

    const handleFinalConfirm = useCallback(async () => {
        setIsFinalLoading(true)
        try {
            const isValid = await checkSessionValid()
            if (!isValid) {
                setSessionExpired(true)
                setModalMode(null)
                return
            }

            await submitApptioEpicMappings(epicId, user)
            toast.success('Mappings submitted successfully')
            setModalMode(null)
            onSubmitComplete?.()
        } catch {
            toast.error('Failed to submit mappings, please try again.')
        } finally {
            setIsFinalLoading(false)
        }
    }, [epicId, onSubmitComplete, user])

    const handleSubmitAll = useCallback(() => {
        const allCapabilities = getAllJourneyCapabilities()
        const allAICapabilities = getAllJourneyAICapabilities()
        setModalSnapshot(allCapabilities)
        setAiModalSnapshot(allAICapabilities)
        setModalMode('final')
    }, [getAllJourneyCapabilities, getAllJourneyAICapabilities])

    const handleEditJourney = useCallback(
        (journeyId: string) => {
            setModalMode(null)
            onJourneySelect(journeyId)
        },
        [onJourneySelect]
    )

    return {
        modalMode,
        setModalMode,
        isJourneyModalLoading,
        isFinalLoading,
        sessionExpired,
        modalSnapshot,
        aiModalSnapshot,
        handleSaveAndNext,
        handleJourneyModalConfirm,
        handleFinalConfirm,
        handleSubmitAll,
        handleEditJourney
    }
}
