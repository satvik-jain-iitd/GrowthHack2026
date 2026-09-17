import React from 'react'
import { screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import { useTheme } from 'next-themes'
import mermaid from 'mermaid'
import ChatMermaidDiagram from './ChatMermaidDiagram'

jest.mock('mermaid', () => ({
    __esModule: true,
    default: {
        initialize: jest.fn(),
        render: jest.fn()
    }
}))

jest.mock('next-themes', () => ({
    useTheme: jest.fn()
}))

const mockZoomIn = jest.fn()
const mockZoomOut = jest.fn()
const mockResetTransform = jest.fn()

jest.mock('react-zoom-pan-pinch', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TransformWrapper: ({ children }: any) => <div>{children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TransformComponent: ({ children }: any) => <div>{children}</div>,
    useControls: () => ({
        zoomIn: mockZoomIn,
        zoomOut: mockZoomOut,
        resetTransform: mockResetTransform
    })
}))

const mockUseTheme = useTheme as jest.Mock
const mockRender = mermaid.render as jest.Mock

const CODE = 'graph TD;\nA-->B;'

describe('ChatMermaidDiagram', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockUseTheme.mockReturnValue({ theme: 'light' })
    })

    it('shows a <pre> fallback while the diagram is rendering', () => {
        mockRender.mockReturnValue(new Promise(() => {}))
        const { container } = render(<ChatMermaidDiagram code={CODE} />)

        expect(container.querySelector('pre')).toHaveTextContent(
            'graph TD; A-->B;'
        )
    })

    it('replaces the fallback with the rendered svg once mermaid resolves', async () => {
        mockRender.mockResolvedValue({
            svg: '<svg data-testid="rendered-svg"></svg>',
            bindFunctions: undefined
        })

        const { container } = render(<ChatMermaidDiagram code={CODE} />)

        await waitFor(() => {
            expect(container.querySelector('pre')).not.toBeInTheDocument()
        })
        expect(
            screen.getByRole('button', { name: 'Maximize diagram' })
        ).toBeInTheDocument()
    })

    it('keeps showing the <pre> fallback when mermaid.render rejects', async () => {
        mockRender.mockRejectedValue(new Error('render failed'))

        const { container } = render(<ChatMermaidDiagram code={CODE} />)

        await waitFor(() => {
            expect(container.querySelector('pre')).toHaveTextContent(
                'graph TD; A-->B;'
            )
        })
        expect(
            screen.queryByRole('button', { name: 'Maximize diagram' })
        ).not.toBeInTheDocument()
    })

    it('does not update state after unmounting while the render promise is pending', async () => {
        let resolveRender: (value: {
            svg: string
            bindFunctions: undefined
        }) => void = () => {}
        mockRender.mockReturnValue(
            new Promise(resolve => {
                resolveRender = resolve
            })
        )

        const { unmount } = render(<ChatMermaidDiagram code={CODE} />)
        unmount()

        await act(async () => {
            resolveRender({ svg: '<svg></svg>', bindFunctions: undefined })
            await Promise.resolve()
        })
    })

    it('initializes mermaid with the dark theme when next-themes reports dark', async () => {
        mockUseTheme.mockReturnValue({ theme: 'dark' })
        mockRender.mockResolvedValue({
            svg: '<svg></svg>',
            bindFunctions: undefined
        })

        render(<ChatMermaidDiagram code={CODE} />)

        await waitFor(() => {
            expect(mermaid.initialize).toHaveBeenCalledWith({
                startOnLoad: false,
                theme: 'dark'
            })
        })
    })

    it('initializes mermaid with the base theme for any non-dark theme', async () => {
        mockUseTheme.mockReturnValue({ theme: 'light' })
        mockRender.mockResolvedValue({
            svg: '<svg></svg>',
            bindFunctions: undefined
        })

        render(<ChatMermaidDiagram code={CODE} />)

        await waitFor(() => {
            expect(mermaid.initialize).toHaveBeenCalledWith({
                startOnLoad: false,
                theme: 'base'
            })
        })
    })

    it('invokes bindFunctions with the mounted svg node when provided', async () => {
        const bindFunctions = jest.fn()
        mockRender.mockResolvedValue({
            svg: '<svg></svg>',
            bindFunctions
        })

        render(<ChatMermaidDiagram code={CODE} />)

        await waitFor(() => {
            expect(bindFunctions).toHaveBeenCalled()
        })
        expect(bindFunctions.mock.calls[0][0]).toBeInstanceOf(Element)
    })

    it('does not throw when bindFunctions is undefined', async () => {
        mockRender.mockResolvedValue({
            svg: '<svg></svg>',
            bindFunctions: undefined
        })

        render(<ChatMermaidDiagram code={CODE} />)

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'Maximize diagram' })
            ).toBeInTheDocument()
        })
    })

    it('opens the dialog when the compact diagram is clicked, and toggles both ways via the Controls buttons', async () => {
        mockRender.mockResolvedValue({
            svg: '<svg></svg>',
            bindFunctions: undefined
        })

        render(<ChatMermaidDiagram code={CODE} />)

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'Maximize diagram' })
            ).toBeInTheDocument()
        })

        fireEvent.click(
            screen.getByRole('button', { name: 'Maximize diagram' })
        )

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'Minimize diagram' })
            ).toBeInTheDocument()
        })

        fireEvent.click(
            screen.getByRole('button', { name: 'Minimize diagram' })
        )

        await waitFor(() => {
            expect(
                screen.queryByRole('button', { name: 'Minimize diagram' })
            ).not.toBeInTheDocument()
        })
    })

    it('opens the dialog via the compact wrapper click and can be closed via the maximize control inside it', async () => {
        mockRender.mockResolvedValue({
            svg: '<svg></svg>',
            bindFunctions: undefined
        })

        const { container } = render(<ChatMermaidDiagram code={CODE} />)

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'Maximize diagram' })
            ).toBeInTheDocument()
        })

        const wrapper = container.querySelector(
            '.mermaidWrapper'
        ) as HTMLElement
        fireEvent.click(wrapper)

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'Minimize diagram' })
            ).toBeInTheDocument()
        })
    })

    it('calls zoomIn, zoomOut, and resetTransform from the compact controls', async () => {
        mockRender.mockResolvedValue({
            svg: '<svg></svg>',
            bindFunctions: undefined
        })

        render(<ChatMermaidDiagram code={CODE} />)

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'Zoom in' })
            ).toBeInTheDocument()
        })

        fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }))
        fireEvent.click(screen.getByRole('button', { name: 'Zoom out' }))
        fireEvent.click(screen.getByRole('button', { name: 'Reset zoom' }))

        expect(mockZoomIn).toHaveBeenCalledTimes(1)
        expect(mockZoomOut).toHaveBeenCalledTimes(1)
        expect(mockResetTransform).toHaveBeenCalledTimes(1)
    })
})
