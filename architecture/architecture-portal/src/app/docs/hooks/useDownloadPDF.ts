/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'
import { useCallback, useState } from 'react'

export function useDownloadPDF() {
    const [isDownloading, setIsDownloading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const downloadPDF = useCallback(
        async (uuid: string) => {
            if (isDownloading) return

            setIsDownloading(true)
            setError(null)

            let url: string | undefined
            try {
                const response = await fetchWithToken(
                    API_ENDPOINTS.DOWNLOAD_PDF(uuid),
                    {
                        method: 'GET',
                        headers: { Accept: 'application/pdf' }
                    }
                )

                if (!response.ok) {
                    throw new Error('Failed to download PDF.')
                }

                let filename = 'download.pdf'
                const disposition = response.headers.get('Content-Disposition')
                if (disposition) {
                    // RFC 5987 support
                    const utf8Match = disposition.match(
                        /filename\*=UTF-8''([^;\n]*)/
                    )
                    if (utf8Match?.[1]) {
                        filename = decodeURIComponent(utf8Match[1])
                    } else {
                        const matches = disposition.match(
                            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
                        )
                        if (matches?.[1]) {
                            filename = matches[1].replace(/['"]/g, '')
                        }
                    }
                }

                const blob = await response.blob()
                url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = filename
                a.style.display = 'none'
                document.body.appendChild(a)
                a.click()
                a.remove()
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message || 'An error occurred.')
                    console.error('PDF download error:', error)
                } else {
                    setError('An error occurred.')
                }
                throw error
            } finally {
                setIsDownloading(false)
                if (url) window.URL.revokeObjectURL(url)
            }
        },
        [isDownloading]
    )

    return { downloadPDF, isDownloading, error }
}
