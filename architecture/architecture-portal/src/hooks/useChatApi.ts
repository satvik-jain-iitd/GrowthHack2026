/* istanbul ignore file */
'use client'
import { API_ENDPOINTS } from '@/constants'
import { useState } from 'react'
import { fetchWithToken } from '@/utils/client'

export type ChatApiResponse = {
    reply: string
    sources?: string[]
}

export function useChatApi() {
    const [loading, setLoading] = useState(false)

    const sendMessage = async (
        message: string,
        sessionId?: string
    ): Promise<ChatApiResponse> => {
        const payload: { message: string; session_id?: string } = { message }

        if (sessionId) {
            payload.session_id = sessionId
        }

        setLoading(true)
        try {
            const response = await fetchWithToken(API_ENDPOINTS.GET_AGENT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                throw new Error('Failed to fetch from the chat service.')
            }

            const data = await response.json()
            if (typeof data === 'string') {
                return { reply: data, sources: [] }
            }

            if (data && typeof data.reply === 'string') {
                return {
                    reply: data.reply,
                    sources: Array.isArray(data.sources) ? data.sources : []
                }
            }

            throw new Error('Unexpected response from the chat service.')
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }
    return { sendMessage, loading }
}
