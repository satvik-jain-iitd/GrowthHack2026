import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { render, RenderOptions } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const AllProviders = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    })
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
        </QueryClientProvider>
    )
}

const customRender = (
    ui: React.ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
