import { ENVIRONMENT } from './env'

export const PTB_APPLICATION_APP_IDS = {
    e0: ['500000846', '600002119', '600000959', '600002532', '600002665'],
    e1: ['500000846', '600002119', '600000959', '600002532', '600002665'],
    e2: ['500000846', '600002119', '600000959', '600002532', '600002665'],
    e3: ['500000846', '600002119', '600000959', '600002532', '600002665']
}

export const getPtbApplication = () => {
    const env = ENVIRONMENT || 'e1'
    return PTB_APPLICATION_APP_IDS[env as keyof typeof PTB_APPLICATION_APP_IDS]
}
