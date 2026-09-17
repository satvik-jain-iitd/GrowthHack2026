/* istanbul ignore file */
'use client'
import { useEffect } from 'react'
import { getUserLocale } from '@/utils/client'
import { ENVIRONMENT, SCRIPT_SUPPLIER_URL } from '@/constants'

const AnalyticsTracking = () => {
    useEffect(() => {
        // Don't apply tracking in local environment (e0)
        if (ENVIRONMENT === 'e0') return

        // Config script
        const locale = getUserLocale()
        const configScript = document.createElement('script')
        configScript.id = 'script-supplier-config'
        configScript.innerHTML = `
            window.scriptSupplierPageLocale = "${locale}";
            window.scriptSupplierPreset = [
                {
                    "name": "adobe",
                    "version": "^1.0.0",
                    "async": true,
                    "config": {
                        "market": "${locale}",
                        "businessUnit": "intranet"
                    }
                }
            ];
        `

        // Supplier script
        const supplierScript = document.createElement('script')
        supplierScript.id = 'script-supplier'
        supplierScript.src = SCRIPT_SUPPLIER_URL.src
        supplierScript.integrity = SCRIPT_SUPPLIER_URL.integrity
        supplierScript.crossOrigin = 'anonymous'
        supplierScript.async = true

        // 1. Inject config script
        document.head.appendChild(configScript)
        // 2. Inject supplier script after config
        document.head.appendChild(supplierScript)

        // Cleanup
        return () => {
            document.head.removeChild(configScript)
            document.head.removeChild(supplierScript)
        }
    }, [])

    return null
}

export default AnalyticsTracking
