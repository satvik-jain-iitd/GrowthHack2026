import React from 'react'
import '@testing-library/jest-dom'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/test-utils'
import { apiDocsSidebar } from '@/test/mocks/apiDocsSidebar'
import { optionDomId } from './searchRowUtils'
import SearchDialog from './SearchDialog'

// jsdom implements neither of these, and the dialog depends on both.
beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn()
    global.IntersectionObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
            return []
        }
        root = null
        rootMargin = ''
        thresholds: number[] = []
    } as unknown as typeof IntersectionObserver
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
        callback(0)
        return 0
    })
})

const domains = { domains: [], loading: false, error: null }

const renderDialog = (onNavigate = jest.fn(), onOpenChange = jest.fn()) => {
    render(
        <SearchDialog
            open
            onOpenChange={onOpenChange}
            sidebarData={apiDocsSidebar}
            domains={domains}
            onNavigate={onNavigate}
        />
    )
    return { onNavigate, onOpenChange }
}

const getInput = () => screen.getByRole('combobox')

// <Highlight> splits matched text across <mark> nodes, so rows are matched on
// their combined text content rather than with getByText.
const optionWith = (text: string) =>
    screen
        .getAllByRole('option')
        .find(option => option.textContent?.includes(text))

const optionsText = () =>
    screen
        .getAllByRole('option')
        .map(option => option.textContent)
        .join(' | ')

describe('SearchDialog', () => {
    it('offers the company domains as a filter before anything is typed', () => {
        renderDialog()
        expect(screen.getByText('FILTER BY COMPANY DOMAIN')).toBeInTheDocument()
        expect(screen.getByText('Payments')).toBeInTheDocument()
        expect(screen.getByText('Cartão')).toBeInTheDocument()
    })

    it('lists the APIs of every selected company domain', async () => {
        const user = userEvent.setup()
        renderDialog()

        await user.click(screen.getByRole('button', { name: 'Payments' }))

        expect(screen.getByText('Card Payments API')).toBeInTheDocument()
        expect(screen.getByText('Settlement API')).toBeInTheDocument()
        expect(screen.queryByText('Servicing API')).not.toBeInTheDocument()
    })

    it('scopes the query to the selected company domains', async () => {
        const user = userEvent.setup()
        renderDialog()

        await user.click(screen.getByRole('button', { name: 'Cartão' }))
        await user.type(getInput(), 'get')
        await screen.findByRole('listbox')

        expect(optionsText()).toContain('Get Profile')
        expect(optionsText()).not.toContain('Get Payment')
        expect(optionsText()).not.toContain('Get Batch')
    })

    it('restores the unscoped results when the scope is cleared', async () => {
        const user = userEvent.setup()
        renderDialog()

        await user.click(screen.getByRole('button', { name: 'Cartão' }))
        await user.type(getInput(), 'get')
        await screen.findByRole('listbox')
        await user.click(screen.getByRole('button', { name: 'Clear' }))

        await waitFor(() => expect(optionsText()).toContain('Get Payment'))
        expect(optionsText()).toContain('Get Profile')
    })

    it('lists an API’s operations and navigates on Enter', async () => {
        const user = userEvent.setup()
        const { onNavigate } = renderDialog()

        await user.type(getInput(), 'settlement')
        await screen.findByRole('listbox')

        expect(optionWith('Settlement API')).toBeDefined()
        expect(optionWith('Get Batch')).toBeDefined()

        // domain header -> api header -> first operation
        await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')
        expect(onNavigate).toHaveBeenCalledWith('op-get-batch')
    })

    it('tracks the highlighted row with aria-activedescendant', async () => {
        const user = userEvent.setup()
        renderDialog()

        await user.type(getInput(), 'settlement')
        await screen.findByRole('listbox')

        await waitFor(() =>
            expect(getInput()).toHaveAttribute(
                'aria-activedescendant',
                optionDomId('domain:domain-payments')
            )
        )

        await user.keyboard('{ArrowDown}')
        expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            optionDomId('api:domain-payments/api-settlement')
        )

        // ArrowUp from the top wraps to the last row.
        await user.keyboard('{ArrowUp}{ArrowUp}')
        expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            optionDomId('operation:domain-payments/api-settlement/op-get-batch')
        )
    })

    it('navigates when a row is clicked', async () => {
        const user = userEvent.setup()
        const { onNavigate } = renderDialog()

        await user.type(getInput(), 'settlement')
        await screen.findByRole('listbox')
        await user.click(optionWith('Settlement API') as HTMLElement)

        expect(onNavigate).toHaveBeenCalledWith('api-settlement')
    })

    it('reveals hidden operations from the expander instead of navigating', async () => {
        const user = userEvent.setup()
        const { onNavigate } = renderDialog()

        await user.type(getInput(), 'card payments')
        const expander = await screen.findByText('Show all 1 more operations')
        await user.click(expander)

        expect(onNavigate).not.toHaveBeenCalled()
        expect(optionWith('List Refunds')).toBeDefined()
    })

    it('renders the status through the shared Status badge', async () => {
        const user = userEvent.setup()
        renderDialog()

        await user.type(getInput(), 'refunds')
        await screen.findByRole('listbox')

        // "API Catalog" is displayed as "Onboarded to Catalog" everywhere else.
        expect(optionWith('Onboarded to Catalog')).toBeDefined()
    })

    it('narrows on a method-prefixed query', async () => {
        const user = userEvent.setup()
        renderDialog()

        await user.type(getInput(), 'post payment')
        await screen.findByRole('listbox')

        expect(optionsText()).toContain('Create Payment')
        expect(optionsText()).not.toContain('Get Payment')
    })

    it('reports when nothing matches', async () => {
        const user = userEvent.setup()
        renderDialog()

        await user.type(getInput(), 'zzzznomatch')
        expect(await screen.findByText(/No matches for/)).toBeInTheDocument()
    })

    it('closes on Escape', async () => {
        const user = userEvent.setup()
        const { onOpenChange } = renderDialog()

        await user.keyboard('{Escape}')
        await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
    })

    it('documents the search from the footer help control', async () => {
        const user = userEvent.setup()
        renderDialog()

        await user.click(screen.getByRole('button', { name: /help/ }))

        expect(screen.getByText('FILTER BY HTTP METHOD')).toBeInTheDocument()
        expect(screen.getByText('Show this help')).toBeInTheDocument()

        await user.click(screen.getByText('← Back to results'))
        expect(
            screen.queryByText('FILTER BY HTTP METHOD')
        ).not.toBeInTheDocument()
        expect(screen.getByText('FILTER BY COMPANY DOMAIN')).toBeInTheDocument()
    })

    it('opens the help from ? without typing the character', async () => {
        const user = userEvent.setup()
        renderDialog()

        await user.type(getInput(), '?')

        expect(screen.getByText('SEARCH HELP')).toBeInTheDocument()
        expect(getInput()).toHaveValue('')
    })

    it('dismisses the help as soon as the query changes', async () => {
        const user = userEvent.setup()
        renderDialog()

        await user.type(getInput(), 'settlement')
        await screen.findByRole('listbox')
        await user.click(screen.getByRole('button', { name: /help/ }))
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

        await user.type(getInput(), 'x')
        expect(screen.queryByText('SEARCH HELP')).not.toBeInTheDocument()
        expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('lets Escape leave the help before it closes the dialog', async () => {
        const user = userEvent.setup()
        const { onOpenChange } = renderDialog()

        await user.click(screen.getByRole('button', { name: /help/ }))
        await user.keyboard('{Escape}')

        expect(screen.queryByText('SEARCH HELP')).not.toBeInTheDocument()
        expect(onOpenChange).not.toHaveBeenCalled()

        await user.keyboard('{Escape}')
        await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
    })
})
