import { AIIcon } from '@/components/icons/AIIcon'
import { Tooltip } from '@/components/ui'
import { TBM_MAPPING_HELP_SLACK_URL } from '@/constants'
import { IconInfo, IconSearch } from '@americanexpress/dls-icons'
import {
    Box,
    Button,
    HStack,
    IconButton,
    Input,
    InputGroup,
    Tag,
    Text,
    VStack
} from '@chakra-ui/react'
import SlackHelpButton from './SlackHelpButton'

type SelectedJourneyTag = {
    id: string
    label: string
    isAI: boolean
    isUserProposed: boolean
}

type Props = {
    searchTerm: string
    onSearchChange: (value: string) => void
    onNext: () => void
    onClear: () => void
    canNext: boolean
    selectedJourneys: SelectedJourneyTag[]
    onRemoveJourney: (id: string) => void
    isLoading?: boolean
}

export function JourneySearchBar({
    searchTerm,
    onSearchChange,
    onNext,
    onClear,
    canNext,
    selectedJourneys,
    onRemoveJourney,
    isLoading
}: Props) {
    return (
        <Box width='100%'>
            <HStack gap={2} alignItems='center' mb={3}>
                <Text fontWeight='600' fontSize='14px'>
                    Type an Enterprise Customer Journey to search
                </Text>
                <Tooltip showArrow content='Search by journey name or group.'>
                    <IconInfo
                        style={{
                            cursor: 'pointer',
                            width: '14px',
                            height: '14px',
                            color: 'var(--chakra-colors-text-subtle)'
                        }}
                    />
                </Tooltip>
            </HStack>
            <InputGroup
                width='100%'
                maxWidth='600px'
                endElement={<IconSearch />}
                mb={5}
            >
                <Input
                    placeholder='Type an Enterprise Customer Journey'
                    value={searchTerm}
                    onChange={e => onSearchChange(e.target.value)}
                    borderRadius='md'
                    border='1px solid'
                    borderColor='border.emphasis'
                    background='surface.white'
                />
            </InputGroup>

            {selectedJourneys.length > 0 && (
                <VStack alignItems='flex-start' gap={1} mb={5} width='100%'>
                    <HStack gap={4} flexWrap='wrap'>
                        {selectedJourneys.map(journey => (
                            <Tag.Root
                                key={journey.id}
                                size='sm'
                                borderRadius='full'
                                border={`1px solid ${journey.isAI ? '#F3780D' : journey.isUserProposed ? '#34A853' : '#98C5F8'}`}
                                backgroundColor={
                                    journey.isAI
                                        ? '#FEF1E7'
                                        : journey.isUserProposed
                                          ? '#E6F4EA'
                                          : '#EAF3FF'
                                }
                                px={5}
                                py={2}
                            >
                                {journey.isAI && (
                                    <AIIcon width={16} height={16} />
                                )}
                                <Tag.Label
                                    data-testid={`journey-tag-${journey.id}`}
                                    fontSize='14px'
                                    fontWeight='600'
                                    color={
                                        journey.isAI
                                            ? '#C44B25'
                                            : journey.isUserProposed
                                              ? '#188038'
                                              : '#00175A'
                                    }
                                    px={1}
                                >
                                    {journey.label}
                                </Tag.Label>
                                <IconButton
                                    aria-label={`Remove ${journey.label}`}
                                    size='2xs'
                                    variant='ghost'
                                    minW='16px'
                                    h='16px'
                                    color={
                                        journey.isAI
                                            ? '#C44B25'
                                            : journey.isUserProposed
                                              ? '#188038'
                                              : '#006FCF'
                                    }
                                    onClick={() => onRemoveJourney(journey.id)}
                                >
                                    <Tag.CloseTrigger
                                        color={
                                            journey.isAI
                                                ? '#C44B25'
                                                : journey.isUserProposed
                                                  ? '#188038'
                                                  : '#006FCF'
                                        }
                                    />
                                </IconButton>
                            </Tag.Root>
                        ))}
                    </HStack>
                </VStack>
            )}

            <HStack gap={3} justify='space-between' width='100%'>
                <HStack gap={3}>
                    <Button
                        colorPalette='blue'
                        size='sm'
                        data-testid='review-impacted-btn'
                        disabled={!canNext || isLoading}
                        loading={isLoading}
                        onClick={onNext}
                    >
                        Review Impacted Capabilities
                    </Button>
                    <Button
                        colorPalette={'blue'}
                        variant='outline'
                        size='sm'
                        data-testid='clear-btn'
                        onClick={onClear}
                    >
                        Clear
                    </Button>
                </HStack>

                <SlackHelpButton
                    href={TBM_MAPPING_HELP_SLACK_URL}
                    iconSrc='/slack-icon-size_256.png'
                    iconAlt='Slack Help Link'
                    label='Need Help?'
                />
            </HStack>
        </Box>
    )
}
