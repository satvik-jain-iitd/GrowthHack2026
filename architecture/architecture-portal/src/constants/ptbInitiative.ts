import { ENVIRONMENT } from './env'

export const PTB_INITIATIVES_PLAYBOOK_IDS = {
    e0: [
        '0b194847-4d13-47c3-81d2-ce9eb06c22aa',
        '3892d0a9-3fc7-4fa3-a61f-ea467808fc13'
    ],
    e1: [
        '0b194847-4d13-47c3-81d2-ce9eb06c22aa',
        '3892d0a9-3fc7-4fa3-a61f-ea467808fc13'
    ],
    e2: [
        'a81edf96-d12c-46ba-ac90-29b5070606f0',
        'b0baa512-b985-4226-adb0-9d936a2d0257',
        'ba099b4d-39e7-4b7d-b868-9eff9656de55',
        '0b194847-4d13-47c3-81d2-ce9eb06c22aa',
        '93a4483d-2e87-4675-82b0-2f128fdd1f73'
    ],
    e3: [
        'b0baa512-b985-4226-adb0-9d936a2d0257',
        '3892d0a9-3fc7-4fa3-a61f-ea467808fc13',
        '0b194847-4d13-47c3-81d2-ce9eb06c22aa',
        'ad53b8f1-4eb6-4a9e-bfa1-d38478ca183a'
    ]
}

export const getPtbInitiatives = () => {
    const env = ENVIRONMENT || 'e1'
    return PTB_INITIATIVES_PLAYBOOK_IDS[
        env as keyof typeof PTB_INITIATIVES_PLAYBOOK_IDS
    ]
}
