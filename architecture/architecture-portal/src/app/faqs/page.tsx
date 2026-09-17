import React from 'react'
import { Metadata } from 'next'
import { Box } from '@chakra-ui/react'
import { FrequentlyAskedQuestions } from '@/app/faqs/components'
import { getFaqGroupsFromMarkdown } from '@/app/faqs/utils'
import { FAQ_TEST_IDS } from '@/app/faqs/test-ids'
import '@/app/docs/styles/markdown.css'

const FAQ_DOCS_REPO = 'architecture-portal-docs'
const FAQ_DOCS_PATH = 'docs/faqs'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Frequently Asked Questions'
}

export default async function FAQs() {
    const faqs = await getFaqGroupsFromMarkdown(FAQ_DOCS_REPO, FAQ_DOCS_PATH)
    return (
        <Box className='page-content' data-testid={FAQ_TEST_IDS.pageContainer}>
            <FrequentlyAskedQuestions faqs={faqs} />
        </Box>
    )
}
