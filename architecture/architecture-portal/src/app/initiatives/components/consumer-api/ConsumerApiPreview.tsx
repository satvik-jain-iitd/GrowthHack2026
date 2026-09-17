/* istanbul ignore file */

import { Box, Button, ButtonGroup, Link, Text } from '@chakra-ui/react'
import { SearchResult } from './ConsumerApiAdd.types'

function PreviewField({ label, value }: { label: string; value: string }) {
    return (
        <Box
            p={3}
            borderRadius='md'
            bg='transparent'
            border='1px solid'
            borderColor={{ base: '#E2E8F0', _dark: '#4A5568' }}
        >
            <Text
                fontSize='14px'
                fontWeight={600}
                color={{ base: '#53565A', _dark: '#CBD5E0' }}
            >
                {label}
            </Text>
            <Text fontSize='14px' color={{ _dark: '#F7FAFC' }}>
                {value}
            </Text>
        </Box>
    )
}

export function ConsumerApiPreview({
    selectedResult: userSelectedResult,
    derivedOpDetails,
    selectedConsumerDomainLabel,
    canAddApi,
    isSaving,
    onAddApi,
    onCancel
}: {
    selectedResult: SearchResult
    derivedOpDetails: SearchResult | undefined
    selectedConsumerDomainLabel: string
    canAddApi: boolean
    isSaving: boolean
    onAddApi: () => void
    onCancel: () => void
}) {
    const selectedResult = derivedOpDetails ?? userSelectedResult
    const detailsUrl =
        selectedResult.source === 'portal'
            ? selectedResult.portalUrl
            : selectedResult.explorerUrl

    const detailsLabel =
        selectedResult.source === 'portal'
            ? 'View more details'
            : 'View more details in Explorer'
    return (
        <Box
            w='100%'
            border='1px solid'
            borderColor={{ base: '#E2E8F0', _dark: '#4A5568' }}
            borderRadius='lg'
            p={4}
            bg={{ base: '#F8FBFF', _dark: '#1A202C' }}
        >
            <Text
                fontSize='14px'
                fontWeight={700}
                mb={3}
                color={{ _dark: '#F7FAFC' }}
            >
                API Preview
            </Text>
            {derivedOpDetails && (
                <Box
                    mb={4}
                    p={3}
                    borderRadius='md'
                    bg={{ base: '#E2E8F0', _dark: '#4A5568' }}
                >
                    <Text fontSize='14px' color={{ _dark: '#F7FAFC' }}>
                        The API you have selected is associated with an existing
                        Type A Operation. The details shown are from the
                        existing Type A API. Please review before adding.
                    </Text>
                </Box>
            )}

            {selectedResult.source === 'portal' ? (
                <Box
                    display='grid'
                    gridTemplateColumns={{
                        base: '1fr',
                        md: 'repeat(2, minmax(0, 1fr))',
                        xl: 'repeat(3, minmax(0, 1fr))'
                    }}
                    gap={3}
                    mb={4}
                >
                    <PreviewField
                        label='API Name'
                        value={selectedResult.apiName}
                    />
                    <PreviewField
                        label='Operation Name'
                        value={selectedResult.operationName}
                    />
                    <PreviewField
                        label='Operation Type'
                        value={selectedResult.operationType}
                    />
                    <PreviewField
                        label='Operation Status'
                        value={selectedResult.operationStatus}
                    />
                    <PreviewField
                        label='Operation Path'
                        value={selectedResult.operationPath || '-'}
                    />
                    <PreviewField
                        label='Provider Company Domain'
                        value={selectedResult.providerCompanyDomain}
                    />
                    <PreviewField
                        label='Consumer Company Domain'
                        value={selectedConsumerDomainLabel || '-'}
                    />
                </Box>
            ) : (
                <Box
                    display='grid'
                    gridTemplateColumns={{
                        base: '1fr',
                        md: 'repeat(2, minmax(0, 1fr))'
                    }}
                    gap={3}
                    mb={4}
                >
                    <PreviewField
                        label='Operation Name'
                        value={selectedResult.operationName}
                    />
                    <PreviewField
                        label='Operation Type'
                        value={selectedResult.apiType}
                    />
                    <PreviewField
                        label='Operation Description'
                        value={selectedResult.operationDescription || '-'}
                    />
                    <PreviewField
                        label='Operation Path'
                        value={selectedResult.path || '-'}
                    />
                    <PreviewField
                        label='Consumer Company Domain'
                        value={selectedConsumerDomainLabel || '-'}
                    />
                </Box>
            )}

            {detailsUrl ? (
                <Box mb={4}>
                    {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                    <Link
                        href={detailsUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        color={{ base: '#0066BE', _dark: '#63B3ED' }}
                        textDecoration='underline'
                    >
                        {detailsLabel}
                    </Link>
                </Box>
            ) : null}

            <ButtonGroup>
                <Button
                    bg='#0066BE'
                    borderRadius='lg'
                    onClick={onAddApi}
                    disabled={!canAddApi || isSaving}
                    _dark={{
                        color: '#fff'
                    }}
                >
                    {isSaving ? 'Adding API...' : 'Add API'}
                </Button>
                <Button
                    borderRadius='lg'
                    onClick={onCancel}
                    variant='subtle'
                    color={{ base: '#0066BE', _dark: '#63B3ED' }}
                    border='1px solid'
                    borderColor={{ base: '#0066BE', _dark: '#63B3ED' }}
                    _dark={{
                        color: '#fff'
                    }}
                >
                    Cancel
                </Button>
            </ButtonGroup>
        </Box>
    )
}
