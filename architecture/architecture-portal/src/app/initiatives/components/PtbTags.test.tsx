import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import PtbTags from './PtbTags'

jest.mock('@/components/ui', () => ({
    NoPrefetchLink: ({
        href,
        children,
        ...props
    }: {
        href: string
        children: React.ReactNode
        [key: string]: unknown
    }) => (
        // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
        <a href={href} {...props}>
            {children}
        </a>
    )
}))

describe('PtbTags', () => {
    const item = { id: 'adr-1', name: 'ADR One' }

    it('renders a link to the resolved href when isLink is true', () => {
        render(
            <PtbTags
                item={item}
                isLink={true}
                href='https://portal.test/adrs/file-1'
            />
        )
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', 'https://portal.test/adrs/file-1')
        expect(link).toHaveAttribute('target', '_blank')
        expect(screen.getByText('ADR One')).toBeInTheDocument()
    })

    it('renders a BvB link to the resolved docs href', () => {
        render(
            <PtbTags
                item={{ id: 'bvb-1', name: 'BvB One' }}
                isLink={true}
                href='https://portal.test/docs/file-2'
            />
        )
        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            'https://portal.test/docs/file-2'
        )
    })

    it('renders a plain tag when no href is resolved', () => {
        render(<PtbTags item={item} isLink={true} href={null} />)
        expect(screen.queryByRole('link')).not.toBeInTheDocument()
        expect(screen.getByText('ADR One')).toBeInTheDocument()
    })

    it('falls back to the portal docs route for playbook tags', () => {
        render(
            <PtbTags
                item={{ id: 'pb-1', name: 'Initiative One' }}
                isLink={true}
                isPlaybook={true}
            />
        )
        expect(screen.getByRole('link')).toHaveAttribute('href', '/docs/pb-1')
    })

    it('renders a plain tag when isLink is false', () => {
        render(<PtbTags item={item} />)
        expect(screen.queryByRole('link')).not.toBeInTheDocument()
        expect(screen.getByText('ADR One')).toBeInTheDocument()
    })

    it('renders a close trigger in edit mode', () => {
        const onClickClose = jest.fn()
        render(
            <PtbTags item={item} isEdit={true} onClickClose={onClickClose} />
        )
        screen.getByTestId('ebcm-close').click()
        expect(onClickClose).toHaveBeenCalled()
    })
})
