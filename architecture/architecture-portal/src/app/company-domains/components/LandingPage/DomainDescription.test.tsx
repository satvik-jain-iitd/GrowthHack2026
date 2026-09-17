import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { DomainDescription } from './DomainDescription'

describe('DomainDescription', () => {
    it('renders domain name and description', () => {
        render(
            <DomainDescription
                domain_name='Payments'
                domain_description='Handles payment capabilities'
            />
        )

        expect(screen.getByText('Payments:')).toBeInTheDocument()
        expect(
            screen.getByText('Handles payment capabilities')
        ).toBeInTheDocument()
    })

    it('renders fallback when description is empty', () => {
        render(
            <DomainDescription domain_name='Payments' domain_description='' />
        )

        expect(screen.getByText('Payments:')).toBeInTheDocument()
        expect(screen.getByText('--')).toBeInTheDocument()
    })
})
