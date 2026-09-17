/* istanbul ignore file */
'use client'
import React from 'react'
import { NoPrefetchLink as NextLink } from '@/components/ui'
import { Box, Text, Link, VStack } from '@chakra-ui/react'

export function NeedHelp({ isBvB }: { isBvB?: boolean }) {
    const steps = [
        {
            label: 'Step 1',
            link: isBvB
                ? '/contribute/getting-started-with-build-vs-buy#step-1-onboarding-form'
                : '/contribute/getting-started#step-1-review-templates',
            text: isBvB ? 'Onboarding Form' : 'Review Templates'
        },
        {
            label: 'Step 2',
            link: isBvB
                ? '/contribute/getting-started-with-build-vs-buy#step-2-templates'
                : '/contribute/getting-started#step-2-create-playbook-directory-structure',
            text: isBvB
                ? 'Review Templates'
                : 'Create Playbook Directory Structure'
        },
        {
            label: 'Step 3',
            link: isBvB
                ? '/contribute/getting-started-with-build-vs-buy#step-3-assessment-adr'
                : '/contribute/getting-started#step-3-create-documentation',
            text: isBvB ? 'Assessment and ADR' : 'Create Documentation'
        },
        {
            label: 'Step 4',
            link: isBvB
                ? '/contribute/getting-started-with-build-vs-buy#step-4-review-process'
                : '/contribute/getting-started#step-4-request-to-publish',
            text: isBvB ? 'Review Process' : 'Request To Publish'
        }
    ]

    return (
        <Box
            css={{
                height: '100%',
                borderLeft: '1px solid',
                borderColor: 'bg.emphasized',
                backgroundImage: 'url(/onboarding-background.svg)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right bottom -100px',
                backgroundSize: 'auto 85%',
                maxW: '1000px',
                mx: 'auto',
                p: 6,
                mt: 6
            }}
        >
            <Text
                textStyle='xl'
                mb={2}
                color={{ base: '#00175a', _dark: '#1a88e9ff' }}
            >
                Need Help?
            </Text>
            <Text textStyle='sm' mb={4} color='fg.muted'>
                If this is your first time onboarding, please follow the below
                steps.
            </Text>
            <VStack align='left'>
                {steps.map(({ label, link, text }) => (
                    // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                    <Link
                        key={label}
                        as={NextLink}
                        href={link}
                        textStyle='sm'
                        mb={2}
                        color='fg.info'
                        width='fit-content'
                        _hover={{ textDecoration: 'underline' }}
                        _focus={{
                            outline: 'none',
                            boxShadow: 'none'
                        }}
                    >
                        {label}: {text}
                    </Link>
                ))}
                {isBvB && (
                    // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                    <Link
                        as={NextLink}
                        href='/contribute/build-vs-buy-faqs'
                        textStyle='sm'
                        mb={2}
                        color='fg.info'
                        width='fit-content'
                        _hover={{ textDecoration: 'underline' }}
                        _focus={{
                            outline: 'none',
                            boxShadow: 'none'
                        }}
                    >
                        Build vs Buy FAQs
                    </Link>
                )}
            </VStack>
        </Box>
    )
}
