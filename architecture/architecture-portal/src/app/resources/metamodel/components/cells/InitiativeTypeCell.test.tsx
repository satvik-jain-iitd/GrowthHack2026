import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

import {
    InitiativeTypeCell,
    getInitiativeType,
    INITIATIVE_TYPE_COLOR_PALETTES
} from './InitiativeTypeCell'

function renderCell(props: Parameters<typeof InitiativeTypeCell>[0]) {
    return render(
        <ChakraProvider value={defaultSystem}>
            <InitiativeTypeCell {...props} />
        </ChakraProvider>
    )
}

describe('getInitiativeType', () => {
    it('prefers the more specific ECMI when both flags are set', () => {
        expect(getInitiativeType(true, true)).toBe('ECMI')
    })

    it('reports an ETP that is not an ECMI', () => {
        expect(getInitiativeType(true, false)).toBe('ETP')
    })

    it('reports an initiative with neither flag as untyped', () => {
        expect(getInitiativeType(false, false)).toBe('None')
    })

    it('reports nothing while the flags are unknown', () => {
        expect(getInitiativeType(null, null)).toBeUndefined()
        expect(getInitiativeType(undefined, undefined)).toBeUndefined()
    })
})

describe('InitiativeTypeCell', () => {
    it('renders the type as a badge', () => {
        renderCell({ isEtp: true, isEcmi: true })

        expect(screen.getByText('ECMI')).toBeInTheDocument()
    })

    it('colors each type differently', () => {
        expect(Object.values(INITIATIVE_TYPE_COLOR_PALETTES)).toEqual([
            'purple',
            'green',
            'gray'
        ])
    })

    it('renders an em dash for an unenriched row', () => {
        renderCell({ isEtp: undefined, isEcmi: undefined })

        expect(screen.getByText('—')).toBeInTheDocument()
    })
})
