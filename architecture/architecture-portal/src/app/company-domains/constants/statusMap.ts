export const statusMap = {
    draft: {
        color: {
            _dark: '#e0dada',
            base: 'transparent'
        },
        label: 'Draft'
    },
    proposed: {
        color: {
            _dark: '#4A5568',
            base: '#EDF2F7'
        },
        label: 'Proposed'
    },
    darbAppr: {
        color: { _dark: '#B7791F', base: '#FEFCBF' },
        label: 'ARB Approved'
    },
    earbAppr: {
        color: { _dark: '#C05621', base: '#FEEBC8' },
        label: 'EARB Approved'
    },
    catalog: {
        color: { _dark: '#7e758dff', base: '#EDE2FF' },
        label: 'Onboarded to Catalog'
    },
    preCert: {
        color: { _dark: '#2b6cb0', base: '#bee3f8' },
        label: 'Design Certified'
    },
    prodCert: {
        color: { _dark: '#2F855A', base: '#C6F6D5' },
        label: 'Production Certified'
    },
    deleted: {
        color: { _dark: '#ef796c', base: '#ef796c' },
        label: 'Deleted'
    },
    notRegistered: {
        color: { _dark: '#4A5568', base: '#EDF2F7' },
        label: 'Not Certified'
    },
    typeA: { color: { _dark: '#2F855A', base: '#C6F6D5' }, label: 'Type A' },
    typeB: { color: { _dark: '#2b6cb0', base: '#bee3f8' }, label: 'Type B' },
    typeC: { color: { _dark: '#7e758dff', base: '#EDE2FF' }, label: 'Type C' }
}
