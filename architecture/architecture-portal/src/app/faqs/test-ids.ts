export const FAQ_TEST_IDS = {
    pageContainer: 'faq-page-container',
    faqContainer: 'faq-container',
    faqHeading: 'faq-heading',
    leftNavRoot: 'faq-left-nav-root',
    leftNavButton: (groupId: string) => `faq-left-nav-button-${groupId}`,
    leftNavCount: (groupId: string) => `faq-left-nav-count-${groupId}`,
    groupCard: (groupId: string) => `faq-group-card-${groupId}`,
    groupHeader: (groupId: string) => `faq-group-header-${groupId}`,
    groupSourceLink: (groupId: string) => `faq-group-source-link-${groupId}`,
    toggleAllButton: (groupId: string) => `faq-toggle-all-${groupId}`,
    emptyState: (groupId: string) => `faq-empty-state-${groupId}`,
    questionTrigger: (itemId: string) => `faq-question-trigger-${itemId}`,
    answerContent: (itemId: string) => `faq-answer-content-${itemId}`
}
