import '@testing-library/jest-dom'
import 'structured-clone'

// jsdom does not implement TextEncoder/TextDecoder or Element.scrollTo
if (typeof global.TextEncoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { TextEncoder, TextDecoder } = require('util')
    global.TextEncoder = TextEncoder
    global.TextDecoder = TextDecoder
}

if (typeof Element !== 'undefined' && !Element.prototype.scrollTo) {
    Element.prototype.scrollTo = function scrollTo() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
        this.callback = callback
    }

    observe() {
        if (this.callback) {
            this.callback([{ contentRect: { width: 400, height: 200 } }])
        }
    }

    unobserve() {}
    disconnect() {}
}

// implementation of structuredClone polyfill

if (typeof global.structuredClone !== 'function') {
    global.structuredClone = function structuredClone(value) {
        if (value === null || value === undefined) {
            return value
        }

        try {
            // For objects and arrays, use JSON methods
            if (typeof value === 'object') {
                return JSON.parse(JSON.stringify(value))
            }

            // For primitive values, return directly
            return value
        } catch (error) {
            console.warn('structuredClone polyfill failed:', error)

            // Returns a shallow copy as fallback
            return Array.isArray(value) ? [...value] : { ...value }
        }
    }
}
