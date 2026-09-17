/*istanbul ignore file */
import { ENVIRONMENT } from '@/constants/env'
import { ARCHITECTURE_URL, EXPLORER_URL } from '@/constants/urls'

export const DOMAIN_API_MAP = {
    // CIRM
    '27124f40-7adf-42c2-8a18-a44b75d8bc2d': {
        e0: '/docs/16cafa94-8e2c-4973-ad59-b922dcd0caa6',
        e1: '/docs/16cafa94-8e2c-4973-ad59-b922dcd0caa6',
        e2: '/docs/1fbe06c9-56e9-427d-9c7b-8c58c11f583f',
        e3: '/docs/eff64ac8-3e62-4c9d-9cc5-73af415ff46d'
    },
    // Acquirer
    '2890e278-8750-4da7-9ef2-b0c0e874fd3e': {
        e0: '/docs/83d6c129-968c-4305-a3b7-67393bea2e5b',
        e1: '/docs/83d6c129-968c-4305-a3b7-67393bea2e5b',
        e2: '/docs/f7e64929-6a3e-4b13-bd13-679235e35212',
        e3: '/docs/6e84dac5-2ab0-411d-b562-aaf47e7bc11b'
    },
    // Payment Network
    '083240ad-6a4b-4d89-87b5-b5dea31c4e26': {
        e0: '/docs/ccd883cb-8149-43c0-a1d1-8407b2081a92',
        e1: '/docs/ccd883cb-8149-43c0-a1d1-8407b2081a92',
        e2: '/docs/44243cb5-d090-439b-8f25-ac76ba30d48b',
        e3: '/docs/779cabbe-bf56-405b-8f16-34143ee32401'
    },
    // AR
    '1d438ee9-f81c-4e64-9dca-37cc34ce5f76': {
        e0: '/docs/7eb8f0ef-eb70-4b39-a1d4-b978fb5d2406',
        e1: '/docs/7eb8f0ef-eb70-4b39-a1d4-b978fb5d2406',
        e2: '/docs/0e9f7478-9328-4bb1-b9e4-e34674564519',
        e3: '/docs/35398f83-a875-45ce-ade8-b03d03645672'
    },
    // GLB No E1, E2 and E0
    '59997997-753e-492a-b41d-79b4ebfd5b41': {
        e2: '/docs/fe9f9b98-4a07-4918-a2ac-681aa10be6a7',
        e3: '/docs/f118bfc8-ef3f-4b2b-9765-3b61690d1e12'
    },
    // CFR No E1 and E0
    '0199f60b-0619-4bb6-b79b-375c776d3516': {
        e2: '/docs/2b1f4c51-69f0-4722-99ad-06d629c2472d',
        e3: '/docs/447afeac-3be5-49e9-ac6f-4f6174c721b0'
    },
    // Finance
    '285ebf24-4915-4fd1-957a-04d68e959e82': {
        e0: '/docs/12a10eaa-0b8c-41f9-8c37-c12c6d574a76',
        e1: '/docs/12a10eaa-0b8c-41f9-8c37-c12c6d574a76',
        e2: '/docs/85ce558a-0fd1-4625-b187-0f2cf824b53a',
        e3: '/docs/81b33ff9-34eb-42e7-8703-19c3c1f2a13f'
    },
    // Payment Device Management
    '6443ec08-0d97-45fa-9fe6-e56489b593bd': {
        e0: '/docs/035edad3-9c7b-4ad1-9386-01d8ca473740',
        e1: '/docs/035edad3-9c7b-4ad1-9386-01d8ca473740',
        e2: '/docs/c375f09c-9c87-4758-a7b0-c2159034354a',
        e3: '/docs/17a2eb17-9282-4516-b01c-b5b7dca07ae1'
    },
    // MYCA - Web
    '8b600406-0142-45b3-b812-2d810d578c05': {
        e3: '/docs/a8766ef7-5fa3-4de7-b716-e8c9ea00998e'
    },
    // Amex Mobile App and Suite of Apps
    'e1f179c3-1fca-4be9-97c3-4b98302b5c1c': {
        e3: '/docs/f766c53e-b5fe-43ac-8cb2-71eb82f2d544'
    },
    // Digital Acquisition (Consumer)
    'e4ff064c-865a-4f51-9b4b-1296b5d20c8b': {
        e3: '/docs/8b501179-d5a9-4220-b765-8ed448a46787'
    },
    // Banking
    'c75676d1-0196-4c5c-b3f9-80986e452765': {
        e3: '/docs/7731fc9f-edc6-4451-971f-9adaea97001f'
    },
    // Bill Pay
    '95f4c937-ec13-408f-9ac7-6f19de2b256f': {
        e3: '/docs/2d7c24a3-561e-46e5-a1a6-61bc612e83db'
    },
    // Travel
    'a57ef2c3-ad6d-4542-b9a0-3059254beecf': {
        e3: '/docs/a3270706-018d-4d28-8375-a9b2a7828ccb'
    },
    // Money Movement
    '4109a002-fe4b-4b0d-82e9-df99d1bae586': {
        e3: '/docs/256d9be0-a53b-407f-9090-3bff04002ca9'
    },
    // Dining
    '0ef9de97-3ee2-4b53-922a-ba5857ec3315': {
        e3: '/docs/6d8ac6ad-4e91-4ad7-8c21-50a3ed9f7376'
    },
    // Servicing Case Management
    '01f9da41-5440-47a2-b8a4-920022d2b507': {
        e3: '/docs/d43f2210-0c6e-4290-b8a1-9c5cdbded579'
    },
    // Digital Labs
    'd28b22d6-aad8-44ac-a45b-9016c24cdbc3': {
        e3: '/docs/969106f8-5a24-41c3-9c37-1bbed549a5d7'
    },
    // Global Infrastructure
    'e41fc789-2f2c-4f28-9d21-b032c50ff39a': {
        e3: '/docs/6a3a7856-c3af-47d4-9812-67b23ce88e79'
    },
    // Global Risk & Compliance
    '867acb29-aee1-4abd-b66c-8d946ab3d222': {
        e3: '/docs/ef032a6f-efb0-4a10-b003-4778e473927a'
    },
    // Digital Workplace
    '2fd5a813-172d-41e2-8e6d-804cc102cceb': {
        e3: '/docs/a0947654-28e6-4319-93a9-54ff9c69eb4c'
    },
    // B2B Sales
    'b6dce835-889d-4d68-895e-9cd7c5350d9e': {
        e3: '/docs/3d580d5b-2548-4cd1-9b39-30a9b43fc38b'
    },
    // Corporate Functions
    '4bd40f6a-025a-4caa-a78d-a20d25692c43': {
        e3: '/docs/88012e97-59bd-4b64-a895-4f463179c5ee'
    },
    // Colleague Experience
    '16b5ec28-9bec-46eb-9051-234b5f8ab142': {
        e3: '/docs/2f848859-459f-4972-b4d3-98356de54536'
    },
    // Information Security
    '19ffcf89-4a90-4f3e-854f-4deed37644fc': {
        e3: '/docs/0ef61f58-5dad-44aa-9541-25de2727dbdf'
    },
    // Marketing
    '26c89511-0feb-4b92-8402-730f4035f9eb': {
        e3: '/docs/ca82cdc1-8d1c-48f5-8734-4c3e1e0c9b97'
    },
    // Global Procurement
    '3d2a82f4-2f57-426d-8248-ed120ce82fa0': {
        e3: '/docs/7454ea23-1935-4680-aaa2-801f82f897fd'
    },
    // Business Enablement Tools
    '3a57ac2c-f971-4f93-9ef6-ebadd660dc1e': {
        e3: '/docs/3a57ac2c-f971-4f93-9ef6-ebadd660dc1e'
    },
    // Tools & Utilities
    '98a28010-b012-4dc6-97b3-7e7e16657b36': {
        e3: '/docs/81414f0c-747a-420d-a3bd-4129698195c9'
    },
    // Commercial Business Services
    '887b869b-4112-417c-96d3-7198254e8ee9': {
        e3: '/docs/96319d3b-69f7-483e-b814-4281bc9b865e'
    },
    // Commercial Card Services
    '1e0bf494-7cfb-420c-8934-b6c6f1437f73': {
        e3: '/docs/92629a01-8b84-43c2-a117-6c03d5fdabbd'
    },
    // Customer Product
    '76702523-1261-4a68-b2ac-43753628580f': {
        e3: '/docs/95672b4e-1a52-4951-bc12-29b01e074573'
    },
    // Assisted Servicing
    '175ff245-453d-4c8b-be06-91b17b1e011d': {
        e3: '/docs/995ccbd3-deeb-4557-bc1e-72611482fbf9'
    }
}

export const DOMAIN_API_TARGETS_MAP = {
    // CIRM
    '27124f40-7adf-42c2-8a18-a44b75d8bc2d': 4,
    // Acquirer
    '2890e278-8750-4da7-9ef2-b0c0e874fd3e': 11,
    // Payment Network
    '083240ad-6a4b-4d89-87b5-b5dea31c4e26': 12,
    // AR
    '1d438ee9-f81c-4e64-9dca-37cc34ce5f76': 18,
    // GLB
    '59997997-753e-492a-b41d-79b4ebfd5b41': 20,
    // CFR
    '0199f60b-0619-4bb6-b79b-375c776d3516': 16,
    // Finance
    '285ebf24-4915-4fd1-957a-04d68e959e82': 2,
    // Payment Device Management
    '6443ec08-0d97-45fa-9fe6-e56489b593bd': 3,
    // MYCA - Web
    '8b600406-0142-45b3-b812-2d810d578c05': 0,
    // Amex Mobile App and Suite of Apps
    'e1f179c3-1fca-4be9-97c3-4b98302b5c1c': 0,
    // Digital Acquisition (Consumer)
    'e4ff064c-865a-4f51-9b4b-1296b5d20c8b': 5,
    // Banking
    'c75676d1-0196-4c5c-b3f9-80986e452765': 15,
    // Bill Pay
    '95f4c937-ec13-408f-9ac7-6f19de2b256f': 8,
    // Travel
    'a57ef2c3-ad6d-4542-b9a0-3059254beecf': 14,
    // Money Movement
    '4109a002-fe4b-4b0d-82e9-df99d1bae586': 3,
    // Dining
    '0ef9de97-3ee2-4b53-922a-ba5857ec3315': 2,
    // Servicing Case Management
    '01f9da41-5440-47a2-b8a4-920022d2b507': 6,
    // Digital Labs
    'd28b22d6-aad8-44ac-a45b-9016c24cdbc3': 7,
    // Global Infrastructure
    'e41fc789-2f2c-4f28-9d21-b032c50ff39a': 0,
    // Global Risk & Compliance
    '867acb29-aee1-4abd-b66c-8d946ab3d222': 1,
    // Digital Workplace
    '2fd5a813-172d-41e2-8e6d-804cc102cceb': 0,
    // B2B Sales
    'b6dce835-889d-4d68-895e-9cd7c5350d9e': 5,
    // Corporate Functions
    '4bd40f6a-025a-4caa-a78d-a20d25692c43': 0,
    // Colleague Experience
    '16b5ec28-9bec-46eb-9051-234b5f8ab142': 3,
    // Information Security
    '19ffcf89-4a90-4f3e-854f-4deed37644fc': 0,
    // Marketing
    '26c89511-0feb-4b92-8402-730f4035f9eb': 12,
    // Global Procurement
    '3d2a82f4-2f57-426d-8248-ed120ce82fa0': 0,
    // Business Enablement Tools
    '3a57ac2c-f971-4f93-9ef6-ebadd660dc1e': 0,
    // Tools & Utilities
    '98a28010-b012-4dc6-97b3-7e7e16657b36': 0,
    // Commercial Business Services
    '887b869b-4112-417c-96d3-7198254e8ee9': 19,
    // Commercial Card Services
    '1e0bf494-7cfb-420c-8934-b6c6f1437f73': 10,
    // Customer Product
    '76702523-1261-4a68-b2ac-43753628580f': 5,
    // Assisted Servicing
    '175ff245-453d-4c8b-be06-91b17b1e011d': 5
}

export const getUrlByDomainId = (domainId: string) => {
    return (
        DOMAIN_API_MAP[domainId as keyof typeof DOMAIN_API_MAP]?.[
            ENVIRONMENT as keyof (typeof DOMAIN_API_MAP)[keyof typeof DOMAIN_API_MAP]
        ] || ''
    )
}

export const getApiUrl = (domainId: string, api_metadata_id: string) => {
    const DOMAIN_API_URL = getUrlByDomainId(domainId) + '#' + api_metadata_id
    if (DOMAIN_API_URL === '#') {
        return ''
    }
    return DOMAIN_API_URL
}

export const getAbsoluteApiUrl = (
    domainId: string,
    api_metadata_id: string
) => {
    const DOMAIN_API_URL = getApiUrl(domainId, api_metadata_id)
    if (DOMAIN_API_URL === '') {
        return ''
    }
    return `${ARCHITECTURE_URL}${DOMAIN_API_URL}`
}

export const getAbsoluteOperationUrl = (
    domainId: string,
    operation_metadata_id: string
) => {
    const DOMAIN_OPERATION_URL = getApiUrl(domainId, operation_metadata_id)
    if (DOMAIN_OPERATION_URL === '') {
        return ''
    }
    return `${ARCHITECTURE_URL}${DOMAIN_OPERATION_URL}`
}

export const formatDelegateName = (value: string) => {
    const isEmail = value?.includes('@')
    if (isEmail) {
        return value
    }
    return value
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export const getApiDocsUrl = () => {
    const url = '/api-docs/'
    return `${ARCHITECTURE_URL}${url}`
}

export const getApiDocsUrlForDomain = (domainId: string) => {
    const apiDocsUrl = getApiDocsUrl()
    return apiDocsUrl + '#' + domainId
}

export const getExplorerUrl = (explorerApiId: string) => {
    return `${EXPLORER_URL[ENVIRONMENT as keyof typeof EXPLORER_URL]}/functions/${explorerApiId}`
}
